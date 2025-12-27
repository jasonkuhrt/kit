import * as GitTest from '@kitz/git/git-test'
import * as Semver from '@kitz/semver/__'
import { Effect, Ref } from 'effect'
import { describe, expect, test } from 'vitest'
import { auditPackageHistory, getPackageTagInfos, validateAdjacent } from './monotonic.js'

describe('getPackageTagInfos', () => {
  test('parses package tags and returns sorted by version descending', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@2.0.0', '@kitz/core@1.5.0'],
      }),
    )

    // Set up tag SHAs
    await Effect.runPromise(
      Effect.provide(
        Ref.set(state.tagShas, {
          '@kitz/core@1.0.0': 'sha100',
          '@kitz/core@2.0.0': 'sha200',
          '@kitz/core@1.5.0': 'sha150',
        }),
        layer,
      ),
    )

    const tags = ['@kitz/core@1.0.0', '@kitz/core@2.0.0', '@kitz/core@1.5.0']
    const result = await Effect.runPromise(Effect.provide(getPackageTagInfos('@kitz/core', tags), layer))

    expect(result).toHaveLength(3)
    // Should be sorted descending: 2.0.0, 1.5.0, 1.0.0
    expect(result[0]!.version.version.toString()).toBe('2.0.0')
    expect(result[1]!.version.version.toString()).toBe('1.5.0')
    expect(result[2]!.version.version.toString()).toBe('1.0.0')
  })

  test('filters out prerelease versions', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@2.0.0-next.1', '@kitz/core@1.5.0'],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Ref.set(state.tagShas, {
          '@kitz/core@1.0.0': 'sha100',
          '@kitz/core@1.5.0': 'sha150',
        }),
        layer,
      ),
    )

    const tags = ['@kitz/core@1.0.0', '@kitz/core@2.0.0-next.1', '@kitz/core@1.5.0']
    const result = await Effect.runPromise(Effect.provide(getPackageTagInfos('@kitz/core', tags), layer))

    expect(result).toHaveLength(2)
    expect(result.map((r) => r.version.version.toString())).toEqual(['1.5.0', '1.0.0'])
  })

  test('ignores tags for other packages', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@2.0.0'],
      }),
    )

    await Effect.runPromise(
      Effect.provide(
        Ref.set(state.tagShas, {
          '@kitz/core@1.0.0': 'sha100',
        }),
        layer,
      ),
    )

    const tags = ['@kitz/core@1.0.0', '@kitz/cli@2.0.0']
    const result = await Effect.runPromise(Effect.provide(getPackageTagInfos('@kitz/core', tags), layer))

    expect(result).toHaveLength(1)
    expect(result[0]!.tag).toBe('@kitz/core@1.0.0')
  })
})

describe('validateAdjacent', () => {
  test('valid when no existing tags', async () => {
    const layer = GitTest.make({ tags: [] })
    const newVersion = Semver.fromString('1.0.0')

    const result = await Effect.runPromise(Effect.provide(validateAdjacent('sha123', '@kitz/core', newVersion, []), layer))

    expect(result.valid).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  test('valid when new version is greater than ancestor', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0'],
      }),
    )

    // Set up: sha100 is ancestor of sha200
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@1.0.0': 'sha100' }),
          Ref.set(state.commitParents, { sha200: ['sha100'] }),
        ]),
        layer,
      ),
    )

    const newVersion = Semver.fromString('2.0.0')
    const result = await Effect.runPromise(
      Effect.provide(validateAdjacent('sha200', '@kitz/core', newVersion, ['@kitz/core@1.0.0']), layer),
    )

    expect(result.valid).toBe(true)
    expect(result.violations).toHaveLength(0)
  })

  test('invalid when new version is less than ancestor', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@2.0.0'],
      }),
    )

    // Set up: sha200 is ancestor of sha100 (new commit)
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@2.0.0': 'sha200' }),
          Ref.set(state.commitParents, { sha100: ['sha200'] }),
        ]),
        layer,
      ),
    )

    const newVersion = Semver.fromString('1.0.0')
    const result = await Effect.runPromise(
      Effect.provide(validateAdjacent('sha100', '@kitz/core', newVersion, ['@kitz/core@2.0.0']), layer),
    )

    expect(result.valid).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]!.relationship).toBe('ancestor')
    expect(result.violations[0]!.message).toContain('EARLIER commit')
  })

  test('invalid when new version is greater than descendant', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0'],
      }),
    )

    // Set up: sha100 (new commit) is ancestor of sha200 (existing tag)
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, { '@kitz/core@1.0.0': 'sha200' }),
          Ref.set(state.commitParents, { sha200: ['sha100'] }),
        ]),
        layer,
      ),
    )

    const newVersion = Semver.fromString('2.0.0')
    const result = await Effect.runPromise(
      Effect.provide(validateAdjacent('sha100', '@kitz/core', newVersion, ['@kitz/core@1.0.0']), layer),
    )

    expect(result.valid).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]!.relationship).toBe('descendant')
    expect(result.violations[0]!.message).toContain('LATER commit')
  })

  test('valid when version fits between ancestor and descendant', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@3.0.0'],
      }),
    )

    // Set up: sha100 -> sha200 (new) -> sha300
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@1.0.0': 'sha100',
            '@kitz/core@3.0.0': 'sha300',
          }),
          Ref.set(state.commitParents, {
            sha200: ['sha100'],
            sha300: ['sha200'],
          }),
        ]),
        layer,
      ),
    )

    const newVersion = Semver.fromString('2.0.0')
    const result = await Effect.runPromise(
      Effect.provide(
        validateAdjacent('sha200', '@kitz/core', newVersion, ['@kitz/core@1.0.0', '@kitz/core@3.0.0']),
        layer,
      ),
    )

    expect(result.valid).toBe(true)
    expect(result.violations).toHaveLength(0)
  })
})

describe('auditPackageHistory', () => {
  test('valid when all versions are monotonically increasing', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@2.0.0', '@kitz/core@3.0.0'],
      }),
    )

    // Set up linear history: sha100 -> sha200 -> sha300
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@1.0.0': 'sha100',
            '@kitz/core@2.0.0': 'sha200',
            '@kitz/core@3.0.0': 'sha300',
          }),
          Ref.set(state.commitParents, {
            sha200: ['sha100'],
            sha300: ['sha200'],
          }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        auditPackageHistory('@kitz/core', ['@kitz/core@1.0.0', '@kitz/core@2.0.0', '@kitz/core@3.0.0']),
        layer,
      ),
    )

    expect(result.valid).toBe(true)
    expect(result.violations).toHaveLength(0)
    expect(result.releases).toHaveLength(3)
  })

  test('invalid when versions decrease in history', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@2.0.0', '@kitz/core@1.0.0'],
      }),
    )

    // Set up: 2.0.0 at sha100 comes BEFORE 1.0.0 at sha200 (wrong!)
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@2.0.0': 'sha100',
            '@kitz/core@1.0.0': 'sha200',
          }),
          Ref.set(state.commitParents, {
            sha200: ['sha100'],
          }),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.provide(auditPackageHistory('@kitz/core', ['@kitz/core@2.0.0', '@kitz/core@1.0.0']), layer),
    )

    expect(result.valid).toBe(false)
    expect(result.violations).toHaveLength(1)
    expect(result.violations[0]!.message).toContain('comes BEFORE')
  })

  test('no violation for parallel branches', async () => {
    const { layer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/core@2.0.0'],
      }),
    )

    // Set up: sha100 and sha200 are NOT ancestors of each other (parallel branches)
    await Effect.runPromise(
      Effect.provide(
        Effect.all([
          Ref.set(state.tagShas, {
            '@kitz/core@1.0.0': 'sha100',
            '@kitz/core@2.0.0': 'sha200',
          }),
          // No parent relationship between sha100 and sha200
          Ref.set(state.commitParents, {}),
        ]),
        layer,
      ),
    )

    const result = await Effect.runPromise(
      Effect.provide(auditPackageHistory('@kitz/core', ['@kitz/core@1.0.0', '@kitz/core@2.0.0']), layer),
    )

    // Parallel branches don't violate monotonicity
    expect(result.valid).toBe(true)
    expect(result.violations).toHaveLength(0)
  })
})
