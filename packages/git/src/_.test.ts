import { Test } from '@kitz/test'
import { Effect, Ref } from 'effect'
import { describe, expect, test } from 'vitest'
import { Git } from './_.js'

// ============================================================================
// Sha
// ============================================================================

describe('Sha', () => {
  Test.describe('Sha.make > valid')
    .inputType<string>()
    .outputType<Git.Sha.Sha>()
    .cases(
      { input: 'abc1234', output: Git.Sha.make('abc1234'), comment: 'short form (7 chars)' },
      { input: 'abcdef1234', output: Git.Sha.make('abcdef1234'), comment: 'medium form (10 chars)' },
      {
        input: 'abc1234567890abcdef1234567890abcdef12345',
        output: Git.Sha.make('abc1234567890abcdef1234567890abcdef12345'),
        comment: 'full form (40 chars)',
      },
      { input: 'ABCDEF1', output: Git.Sha.make('ABCDEF1'), comment: 'uppercase hex' },
    )
    .test(({ input, output }) => {
      expect(Git.Sha.make(input)).toBe(output)
    })

  Test.describe('Sha.make > invalid')
    .inputType<string>()
    .outputType<string>()
    .cases(
      { input: 'abc123', output: 'too short', comment: '6 chars' },
      { input: 'abc12345678901234567890123456789012345678901', output: 'too long', comment: '41 chars' },
      { input: 'abc123g', output: 'invalid hex', comment: 'non-hex character' },
      { input: '', output: 'empty', comment: 'empty string' },
    )
    .test(({ input }) => {
      expect(() => Git.Sha.make(input)).toThrow(/Sha/)
    })

  Test.describe('Sha.is')
    .inputType<unknown>()
    .outputType<boolean>()
    .cases(
      { input: Git.Sha.make('abc1234'), output: true, comment: 'branded SHA' },
      { input: 'abc1234', output: true, comment: 'valid pattern string' },
      { input: 'abc123g', output: false, comment: 'invalid hex char' },
      { input: 123, output: false, comment: 'number' },
    )
    .test(({ input, output }) => {
      expect(Git.Sha.is(input)).toBe(output)
    })
})

// ============================================================================
// Git Service (using Memory driver)
// ============================================================================

describe('Git', () => {
  test('getTags returns configured tags', async () => {
    const tags = ['@kitz/core@1.0.0', '@kitz/cli@1.0.0']
    const layer = Git.Memory.make({ tags })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getTags()
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toEqual(tags)
  })

  test('getCurrentBranch returns configured branch', async () => {
    const layer = Git.Memory.make({ branch: 'feat/test' })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getCurrentBranch()
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toBe('feat/test')
  })

  test('isClean returns configured status', async () => {
    const layer = Git.Memory.make({ isClean: false })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.isClean()
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toBe(false)
  })

  test('getRoot returns configured path', async () => {
    const layer = Git.Memory.make({ root: '/my/project' })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getRoot()
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toBe('/my/project')
  })

  test('getHeadSha returns configured SHA', async () => {
    const sha = Git.Sha.make('def4567')
    const layer = Git.Memory.make({ headSha: sha })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getHeadSha()
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toBe(sha)
  })

  test('getCommitsSince returns all commits when no tag', async () => {
    const commits = [
      Git.Memory.commit('feat(core): feature 1'),
      Git.Memory.commit('fix(core): bug fix'),
    ]
    const layer = Git.Memory.make({ commits })

    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getCommitsSince(undefined)
      }).pipe(Effect.provide(layer)),
    )

    expect(result).toHaveLength(2)
    expect(result[0]!.message).toBe('feat(core): feature 1')
  })

  test('createTag adds tag and records it', async () => {
    const { layer, state } = await Effect.runPromise(Git.Memory.makeWithState({}))

    await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        yield* git.createTag('@kitz/core@1.0.0', 'Release v1.0.0')
      }).pipe(Effect.provide(layer)),
    )

    const tags = await Effect.runPromise(Ref.get(state.tags))
    const created = await Effect.runPromise(Ref.get(state.createdTags))

    expect(tags).toContain('@kitz/core@1.0.0')
    expect(created).toContainEqual({ tag: '@kitz/core@1.0.0', message: 'Release v1.0.0' })
  })

  test('pushTags records remote', async () => {
    const { layer, state } = await Effect.runPromise(Git.Memory.makeWithState({}))

    await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        yield* git.pushTags('upstream')
      }).pipe(Effect.provide(layer)),
    )

    const pushed = await Effect.runPromise(Ref.get(state.pushedTags))
    expect(pushed).toContainEqual({ remote: 'upstream' })
  })

  test('deleteTag removes tag and records deletion', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Memory.makeWithState({ tags: ['@kitz/core@1.0.0'] }),
    )

    await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        yield* git.deleteTag('@kitz/core@1.0.0')
      }).pipe(Effect.provide(layer)),
    )

    const tags = await Effect.runPromise(Ref.get(state.tags))
    const deleted = await Effect.runPromise(Ref.get(state.deletedTags))

    expect(tags).not.toContain('@kitz/core@1.0.0')
    expect(deleted).toContain('@kitz/core@1.0.0')
  })
})

// ============================================================================
// Commit Schema
// ============================================================================

describe('Commit', () => {
  test('creates valid commit with all fields', () => {
    const commit = Git.Commit.make({
      hash: Git.Sha.make('abc1234'),
      message: 'feat(core): add feature',
      body: 'Detailed description',
      author: Git.Author.make({ name: 'Jane Doe', email: 'jane@example.com' }),
      date: new Date('2024-01-15'),
    })

    expect(commit.hash).toBe('abc1234')
    expect(commit.message).toBe('feat(core): add feature')
    expect(commit.body).toBe('Detailed description')
    expect(commit.author.name).toBe('Jane Doe')
    expect(commit.author.email).toBe('jane@example.com')
  })
})

// ============================================================================
// Memory Utilities
// ============================================================================

describe('Memory utilities', () => {
  test('commit helper creates valid commit', () => {
    const commit = Git.Memory.commit('fix(cli): resolve issue')

    expect(commit.message).toBe('fix(cli): resolve issue')
    expect(Git.Sha.is(commit.hash)).toBe(true)
    expect(commit.author.name).toBe('Test Author')
  })

  test('commit helper accepts overrides', () => {
    const sha = Git.Sha.make('abcd1234')
    const commit = Git.Memory.commit('feat: new', { hash: sha, body: 'Custom body' })

    expect(commit.hash).toBe(sha)
    expect(commit.body).toBe('Custom body')
  })

  test('makeWithState provides mutable state access', async () => {
    const { layer, state } = await Effect.runPromise(
      Git.Memory.makeWithState({ branch: 'main' }),
    )

    // Modify state
    await Effect.runPromise(Ref.set(state.branch, 'develop'))

    // Verify service sees updated state
    const branch = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getCurrentBranch()
      }).pipe(Effect.provide(layer)),
    )

    expect(branch).toBe('develop')
  })
})

// ============================================================================
// Live Layer (integration tests against real git)
// ============================================================================

describe('GitLive', () => {
  test('getTags returns array', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getTags()
      }).pipe(Effect.provide(Git.GitLive)),
    )

    expect(Array.isArray(result)).toBe(true)
  })

  test('getCurrentBranch returns string', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getCurrentBranch()
      }).pipe(Effect.provide(Git.GitLive)),
    )

    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  test('isClean returns boolean', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.isClean()
      }).pipe(Effect.provide(Git.GitLive)),
    )

    expect(typeof result).toBe('boolean')
  })

  test('getHeadSha returns valid SHA', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getHeadSha()
      }).pipe(Effect.provide(Git.GitLive)),
    )

    expect(Git.Sha.is(result)).toBe(true)
  })

  test('getCommitsSince returns commits with expected shape', async () => {
    const result = await Effect.runPromise(
      Effect.gen(function*() {
        const git = yield* Git.Git
        return yield* git.getCommitsSince(undefined)
      }).pipe(Effect.provide(Git.GitLive)),
    )

    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toHaveProperty('hash')
    expect(result[0]).toHaveProperty('message')
    expect(result[0]).toHaveProperty('author')
    expect(result[0]).toHaveProperty('date')
  })
})
