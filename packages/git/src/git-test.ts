import { Effect, Layer, Ref } from 'effect'
import { Git, GitError, type Commit, type GitService } from './git.js'

/**
 * Configuration for the test Git service.
 */
export interface GitTestConfig {
  /** Initial tags in the repository */
  readonly tags?: string[]
  /** Initial commits (newest first) */
  readonly commits?: Commit[]
  /** Current branch name */
  readonly branch?: string
  /** Whether working tree is clean */
  readonly isClean?: boolean
  /** Repository root path */
  readonly root?: string
}

/**
 * Mutable state for the test Git service.
 *
 * This allows tests to verify what operations were performed
 * and to dynamically update state during test execution.
 */
export interface GitTestState {
  /** All tags (including created ones) */
  readonly tags: Ref.Ref<string[]>
  /** All commits */
  readonly commits: Ref.Ref<Commit[]>
  /** Current branch */
  readonly branch: Ref.Ref<string>
  /** Clean status */
  readonly isClean: Ref.Ref<boolean>
  /** Repository root */
  readonly root: Ref.Ref<string>
  /** Tags created during test (for verification) */
  readonly createdTags: Ref.Ref<Array<{ tag: string; message: string | undefined }>>
}

/**
 * Create the initial test state from config.
 */
export const makeGitTestState = (
  config: GitTestConfig = {},
): Effect.Effect<GitTestState> =>
  Effect.all({
    tags: Ref.make(config.tags ?? []),
    commits: Ref.make(config.commits ?? []),
    branch: Ref.make(config.branch ?? 'main'),
    isClean: Ref.make(config.isClean ?? true),
    root: Ref.make(config.root ?? '/test/repo'),
    createdTags: Ref.make<Array<{ tag: string; message: string | undefined }>>([]),
  })

/**
 * Create a Git service implementation backed by test state.
 */
const makeGitTestService = (state: GitTestState): GitService => ({
  getTags: () => Ref.get(state.tags),

  getCurrentBranch: () => Ref.get(state.branch),

  getCommitsSince: (tag) =>
    Effect.gen(function* () {
      const commits = yield* Ref.get(state.commits)
      const tags = yield* Ref.get(state.tags)

      if (tag === undefined) {
        return commits
      }

      // Find the index where the tag points to
      // In real git, tags point to commits by hash
      // For testing, we'll find commits after the tagged one
      const tagIndex = tags.indexOf(tag)
      if (tagIndex === -1) {
        return new GitError({ message: `Tag not found: ${tag}` }) as never
      }

      // Parse tag to find package@version pattern
      const atIndex = tag.lastIndexOf('@')
      if (atIndex <= 0) {
        // Not a package tag, return all commits
        return commits
      }

      // For simplicity in tests, we assume commits are ordered newest-first
      // and the tag represents a point in history. Return commits before the tag.
      // In a real scenario, we'd match by hash.

      // For test purposes: if tag exists, simulate returning commits "since" that tag
      // We'll use a simple heuristic: find a commit that mentions the package
      const packageName = tag.slice(0, atIndex)
      const versionInTag = tag.slice(atIndex + 1)

      // Find the first commit that would correspond to this tag
      // For testing, we return all commits (simulating fresh start after tag)
      // Tests should set up commits appropriately

      // More sophisticated: find commit index by matching version in message
      const tagCommitIndex = commits.findIndex((c) =>
        c.message.includes(`(${packageName.split('/').pop()})`) &&
        c.message.includes(versionInTag),
      )

      if (tagCommitIndex === -1) {
        // Tag exists but no matching commit found - return all (fresh tag scenario)
        return commits
      }

      // Return commits before the tagged commit
      return commits.slice(0, tagCommitIndex)
    }),

  isClean: () => Ref.get(state.isClean),

  createTag: (tag, message) =>
    Effect.gen(function* () {
      yield* Ref.update(state.tags, (tags) => [...tags, tag])
      yield* Ref.update(state.createdTags, (created) => [...created, { tag, message }])
    }),

  getRoot: () => Ref.get(state.root),
})

/**
 * Create a test Git layer with the given configuration.
 *
 * @example
 * ```ts
 * const testGit = GitTest.make({
 *   tags: ['@kitz/core@1.0.0'],
 *   commits: [
 *     { hash: 'abc123', message: 'feat(core): new feature', ... }
 *   ]
 * })
 *
 * const result = await Effect.runPromise(
 *   Effect.provide(planStable(ctx), testGit)
 * )
 * ```
 */
export const make = (config: GitTestConfig = {}): Layer.Layer<Git> =>
  Layer.effect(
    Git,
    Effect.gen(function* () {
      const state = yield* makeGitTestState(config)
      return makeGitTestService(state)
    }),
  )

/**
 * Create a test Git layer with access to mutable state.
 *
 * This allows tests to:
 * - Verify what tags were created
 * - Dynamically update state during tests
 * - Inspect final state after operations
 *
 * @example
 * ```ts
 * const { layer, state } = await Effect.runPromise(GitTest.makeWithState({
 *   commits: [...]
 * }))
 *
 * await Effect.runPromise(Effect.provide(apply(plan), layer))
 *
 * const createdTags = await Effect.runPromise(Ref.get(state.createdTags))
 * expect(createdTags).toHaveLength(2)
 * ```
 */
export const makeWithState = (
  config: GitTestConfig = {},
): Effect.Effect<{ layer: Layer.Layer<Git>; state: GitTestState }> =>
  Effect.gen(function* () {
    const state = yield* makeGitTestState(config)
    const layer = Layer.succeed(Git, makeGitTestService(state))
    return { layer, state }
  })

/**
 * Helper to create a commit for testing.
 */
export const commit = (
  message: string,
  overrides: Partial<Commit> = {},
): Commit => ({
  hash: overrides.hash ?? Math.random().toString(36).slice(2, 10),
  message,
  body: overrides.body ?? '',
  author: overrides.author ?? 'Test Author',
  date: overrides.date ?? new Date().toISOString(),
})
