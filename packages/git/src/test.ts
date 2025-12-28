import { Effect, Layer, Ref } from 'effect'
import { Commit, Git, GitError, type GitService } from './git.js'

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
  /** HEAD commit SHA (short form) */
  readonly headSha?: string
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
  /** HEAD commit SHA */
  readonly headSha: Ref.Ref<string>
  /** Tags created during test (for verification) */
  readonly createdTags: Ref.Ref<Array<{ tag: string; message: string | undefined }>>
  /** Tag push operations (for verification) */
  readonly pushedTags: Ref.Ref<Array<{ remote: string }>>
  /** Map of tag -> SHA for testing getTagSha */
  readonly tagShas: Ref.Ref<Record<string, string>>
  /** Map of sha -> parent SHAs for testing ancestry */
  readonly commitParents: Ref.Ref<Record<string, string[]>>
  /** Tags deleted during test */
  readonly deletedTags: Ref.Ref<string[]>
  /** Tags deleted from remote during test */
  readonly deletedRemoteTags: Ref.Ref<Array<{ tag: string; remote: string }>>
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
    headSha: Ref.make(config.headSha ?? 'abc1234'),
    createdTags: Ref.make<Array<{ tag: string; message: string | undefined }>>([]),
    pushedTags: Ref.make<Array<{ remote: string }>>([]),
    tagShas: Ref.make<Record<string, string>>({}),
    commitParents: Ref.make<Record<string, string[]>>({}),
    deletedTags: Ref.make<string[]>([]),
    deletedRemoteTags: Ref.make<Array<{ tag: string; remote: string }>>([]),
  })

/**
 * Create a Git service implementation backed by test state.
 */
const makeGitTestService = (state: GitTestState): GitService => ({
  getTags: () => Ref.get(state.tags),

  getCurrentBranch: () => Ref.get(state.branch),

  getCommitsSince: (tag) =>
    Effect.gen(function*() {
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
        return Effect.fail(new GitError({
          context: { operation: 'getCommitsSince', detail: `tag not found: ${tag}` },
        })) as never
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
        c.message.includes(`(${packageName.split('/').pop()})`)
        && c.message.includes(versionInTag)
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
    Effect.gen(function*() {
      yield* Ref.update(state.tags, (tags) => [...tags, tag])
      yield* Ref.update(state.createdTags, (created) => [...created, { tag, message }])
    }),

  pushTags: (remote = 'origin') => Ref.update(state.pushedTags, (pushed) => [...pushed, { remote }]),

  getRoot: () => Ref.get(state.root),

  getHeadSha: () => Ref.get(state.headSha),

  getTagSha: (tag) =>
    Effect.gen(function*() {
      const tagShas = yield* Ref.get(state.tagShas)
      const sha = tagShas[tag]
      if (!sha) {
        return Effect.fail(new GitError({
          context: { operation: 'getTagSha', detail: `tag not found: ${tag}` },
        })) as never
      }
      return sha
    }),

  isAncestor: (sha1, sha2) =>
    Effect.gen(function*() {
      // Simple ancestry check for testing
      // In real git, this traverses the commit graph
      const parents = yield* Ref.get(state.commitParents)

      // BFS to find if sha1 is reachable from sha2
      const visited = new Set<string>()
      const queue = [sha2]
      while (queue.length > 0) {
        const current = queue.shift()!
        if (current === sha1) return true
        if (visited.has(current)) continue
        visited.add(current)
        const currentParents = parents[current] ?? []
        queue.push(...currentParents)
      }
      return false
    }),

  createTagAt: (tag, sha, message) =>
    Effect.gen(function*() {
      yield* Ref.update(state.tags, (tags) => [...tags, tag])
      yield* Ref.update(state.tagShas, (shas) => ({ ...shas, [tag]: sha }))
      yield* Ref.update(state.createdTags, (created) => [...created, { tag, message }])
    }),

  deleteTag: (tag) =>
    Effect.gen(function*() {
      yield* Ref.update(state.tags, (tags) => tags.filter((t) => t !== tag))
      yield* Ref.update(state.tagShas, (shas) => {
        const { [tag]: _, ...rest } = shas
        return rest
      })
      yield* Ref.update(state.deletedTags, (deleted) => [...deleted, tag])
    }),

  commitExists: (sha) =>
    Effect.gen(function*() {
      const commits = yield* Ref.get(state.commits)
      const parents = yield* Ref.get(state.commitParents)
      // Check if SHA exists in commits or parent map
      return commits.some((c) => c.hash === sha || c.hash.startsWith(sha)) || sha in parents
    }),

  pushTag: (tag, remote = 'origin', _force = false) =>
    Ref.update(state.pushedTags, (pushed) => [...pushed, { remote }]),

  deleteRemoteTag: (tag, remote = 'origin') =>
    Ref.update(state.deletedRemoteTags, (deleted) => [...deleted, { tag, remote }]),
})

/**
 * Create a test Git layer with the given configuration.
 *
 * @example
 * ```ts
 * const testGit = Test.make({
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
    Effect.gen(function*() {
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
 * const { layer, state } = await Effect.runPromise(Test.makeWithState({
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
  Effect.gen(function*() {
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
): Commit =>
  Commit.make({
    hash: overrides.hash ?? Math.random().toString(36).slice(2, 10),
    message,
    body: overrides.body ?? '',
    author: overrides.author ?? 'Test Author',
    date: overrides.date ?? new Date(),
  })
