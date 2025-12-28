import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Effect, Either, Ref } from 'effect'
import { describe, expect, test } from 'vitest'
import {
  audit,
  formatAuditResult,
  formatMonotonicViolationError,
  formatSetResult,
  formatTagExistsError,
  HistoryError,
  MonotonicViolationError,
  set,
  TagExistsError,
} from './history.js'

describe('set', () => {
  test('creates tag at specified SHA', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: [],
        commits: [{ hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' }],
      }),
    )

    // Set up commit existence check
    await Effect.runPromise(
      Effect.provide(Ref.set(state.commitParents, { abc1234: [] }), layer),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        set({
          sha: 'abc1234',
          pkg: '@kitz/core',
          ver: Semver.fromString('1.0.0'),
          push: false,
        }),
        layer,
      ),
    )

    expect(result.tag).toBe('@kitz/core@1.0.0')
    expect(result.action).toBe('created')
    expect(result.pushed).toBe(false)

    // Verify tag was created
    const createdTags = await Effect.runPromise(Ref.get(state.createdTags))
    expect(createdTags).toContainEqual({
      tag: '@kitz/core@1.0.0',
      message: 'Release @kitz/core@1.0.0',
    })
  })

  test('accepts scope shorthand', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: [],
        commits: [{ hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' }],
      }),
    )

    await Effect.runPromise(
      Effect.provide(Ref.set(state.commitParents, { abc1234: [] }), layer),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        set({
          sha: 'abc1234',
          pkg: 'core', // Short form
          ver: Semver.fromString('1.0.0'),
          push: false,
        }),
        layer,
      ),
    )

    // Should expand to full package name
    expect(result.tag).toBe('@kitz/core@1.0.0')
  })

  test('idempotent when tag exists at same SHA', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [{ hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' }],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@1.0.0': 'abc1234' }),
          Ref.set(state.commitParents, { abc1234: [] }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        set({
          sha: 'abc1234',
          pkg: '@kitz/core',
          ver: Semver.fromString('1.0.0'),
          push: false,
        }),
        layer,
      ),
    )

    expect(result.action).toBe('unchanged')
    expect(result.pushed).toBe(false)
  })

  test('errors when tag exists at different SHA without --move', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [
          { hash: 'def5678', message: 'new', body: '', author: 'test', date: '' },
          { hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' },
        ],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@1.0.0': 'abc1234' }),
          Ref.set(state.commitParents, { def5678: [], abc1234: [] }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.either(
        Effect.provide(
          set({
            sha: 'def5678',
            pkg: '@kitz/core',
            ver: Semver.fromString('1.0.0'),
            push: false,
            move: false,
          }),
          layer,
        ),
      ),
    )

    expect(Either.isLeft(result)).toBe(true)
    if (Either.isLeft(result)) {
      expect(result.left).toBeInstanceOf(TagExistsError)
      const error = result.left as TagExistsError
      expect(error.tag).toBe('@kitz/core@1.0.0')
      expect(error.existingSha).toBe('abc1234')
      expect(error.requestedSha).toBe('def5678')
    }
  })

  test('moves tag when --move is specified', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [
          { hash: 'def5678', message: 'new', body: '', author: 'test', date: '' },
          { hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' },
        ],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@1.0.0': 'abc1234' }),
          Ref.set(state.commitParents, { def5678: [], abc1234: [] }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        set({
          sha: 'def5678',
          pkg: '@kitz/core',
          ver: Semver.fromString('1.0.0'),
          push: false,
          move: true,
        }),
        layer,
      ),
    )

    expect(result.action).toBe('moved')

    // Verify old tag was deleted
    const deletedTags = await Effect.runPromise(Ref.get(state.deletedTags))
    expect(deletedTags).toContain('@kitz/core@1.0.0')
  })

  test('errors when SHA does not exist', async () => {
    const layer = Git.Test.make({
      tags: [],
      commits: [],
    })

    const result = await Effect.runPromise(
      Effect.either(
        Effect.provide(
          set({
            sha: 'nonexistent',
            pkg: '@kitz/core',
            ver: Semver.fromString('1.0.0'),
            push: false,
          }),
          layer,
        ),
      ),
    )

    expect(Either.isLeft(result)).toBe(true)
    if (Either.isLeft(result)) {
      expect(result.left).toBeInstanceOf(HistoryError)
    }
  })

  test('validates monotonic versioning', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@2.0.0'],
        commits: [
          { hash: 'def5678', message: 'new', body: '', author: 'test', date: '' },
          { hash: 'abc1234', message: 'initial', body: '', author: 'test', date: '' },
        ],
      }),
    )

    // Set up: 2.0.0 is at abc1234, which is an ancestor of def5678
    // Trying to set 1.0.0 at def5678 should fail (lower version on later commit)
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@2.0.0': 'abc1234' }),
          Ref.set(state.commitParents, { def5678: ['abc1234'], abc1234: [] }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.either(
        Effect.provide(
          set({
            sha: 'def5678',
            pkg: '@kitz/core',
            ver: Semver.fromString('1.0.0'),
            push: false,
          }),
          layer,
        ),
      ),
    )

    expect(Either.isLeft(result)).toBe(true)
    if (Either.isLeft(result)) {
      expect(result.left).toBeInstanceOf(MonotonicViolationError)
    }
  })
})

describe('audit', () => {
  test('returns valid for package with monotonic history', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@2.0.0'],
      }),
    )

    // Set up linear history
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@1.0.0': 'sha100',
            '@kitz/core@2.0.0': 'sha200',
          }),
          Ref.set(state.commitParents, {
            sha200: ['sha100'],
          }),
        ]),
        layer,
      ),
    )

    const results = await Effect.runPromise(Effect.provide(audit({ pkg: '@kitz/core' }), layer))

    expect(results).toHaveLength(1)
    expect(results[0]!.valid).toBe(true)
    expect(results[0]!.violations).toHaveLength(0)
  })

  test('audits all packages when no pkg specified', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@1.0.0': 'sha100',
            '@kitz/cli@1.0.0': 'sha200',
          }),
          Ref.set(state.commitParents, {}),
        ]),
        layer,
      ),
    )

    const results = await Effect.runPromise(Effect.provide(audit(), layer))

    expect(results).toHaveLength(2)
    expect(results.map((r) => r.packageName).sort()).toEqual(['@kitz/cli', '@kitz/core'])
  })
})

describe('formatSetResult', () => {
  test('formats created result', () => {
    const result = formatSetResult({
      tag: '@kitz/core@1.0.0',
      sha: 'abc1234def5678',
      version: Semver.fromString('1.0.0'),
      action: 'created',
      pushed: true,
    })

    expect(result).toContain('✓ Created tag @kitz/core@1.0.0')
    expect(result).toContain('abc1234')
    expect(result).toContain('Pushed to remote')
  })

  test('formats moved result', () => {
    const result = formatSetResult({
      tag: '@kitz/core@1.0.0',
      sha: 'abc1234def5678',
      version: Semver.fromString('1.0.0'),
      action: 'moved',
      pushed: false,
    })

    expect(result).toContain('✓ Moved tag')
    expect(result).not.toContain('Pushed')
  })

  test('formats unchanged result', () => {
    const result = formatSetResult({
      tag: '@kitz/core@1.0.0',
      sha: 'abc1234def5678',
      version: Semver.fromString('1.0.0'),
      action: 'unchanged',
      pushed: false,
    })

    expect(result).toContain('○ Tag @kitz/core@1.0.0 already exists')
  })
})

describe('formatTagExistsError', () => {
  test('formats error with hint', () => {
    const error = new TagExistsError({
      tag: '@kitz/core@1.0.0',
      existingSha: 'abc1234def5678',
      requestedSha: 'xyz9876fed1234',
    })

    const result = formatTagExistsError(error)

    expect(result).toContain('@kitz/core@1.0.0')
    expect(result).toContain('abc1234')
    expect(result).toContain('xyz9876')
    expect(result).toContain('--move')
  })
})

describe('formatMonotonicViolationError', () => {
  test('formats violation error', () => {
    const error = new MonotonicViolationError({
      validation: {
        valid: false,
        version: Semver.fromString('1.0.0'),
        sha: 'abc1234',
        violations: [
          {
            existingVersion: Semver.fromString('2.0.0'),
            existingSha: 'def5678',
            relationship: 'ancestor' as const,
            message: 'Version 2.0.0 at def5678 is on an EARLIER commit',
          },
        ],
      },
    })

    const result = formatMonotonicViolationError(error)

    expect(result).toContain('Cannot set 1.0.0')
    expect(result).toContain('abc1234')
    expect(result).toContain('Version 2.0.0')
    expect(result).toContain('monotonic versioning')
  })
})

describe('formatAuditResult', () => {
  test('formats valid result', () => {
    const result = formatAuditResult({
      packageName: '@kitz/core',
      valid: true,
      releases: [
        { tag: '@kitz/core@1.0.0', version: Semver.fromString('1.0.0'), sha: 'sha1' },
        { tag: '@kitz/core@2.0.0', version: Semver.fromString('2.0.0'), sha: 'sha2' },
      ],
      violations: [],
    })

    expect(result).toContain('@kitz/core')
    expect(result).toContain('✓ All 2 releases in valid order')
  })

  test('formats invalid result with violations', () => {
    const result = formatAuditResult({
      packageName: '@kitz/core',
      valid: false,
      releases: [],
      violations: [
        {
          earlier: { tag: '@kitz/core@2.0.0', version: Semver.fromString('2.0.0'), sha: 'sha1' },
          later: { tag: '@kitz/core@1.0.0', version: Semver.fromString('1.0.0'), sha: 'sha2' },
          message: '2.0.0 comes BEFORE 1.0.0',
        },
      ],
    })

    expect(result).toContain('@kitz/core')
    expect(result).toContain('✗')
    expect(result).toContain('2.0.0 comes BEFORE 1.0.0')
  })
})
