import { Context, Data, Effect, Layer } from 'effect'
import { type SimpleGit, simpleGit } from 'simple-git'

// ============================================================================
// Errors
// ============================================================================

/**
 * Git operation error.
 */
export class GitError extends Data.TaggedError('GitError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * A commit from git log.
 */
export interface Commit {
  readonly hash: string
  readonly message: string
  readonly body: string
  readonly author: string
  readonly date: string
}

/**
 * Git service interface.
 */
export interface GitService {
  /** Get all tags in the repository */
  readonly getTags: () => Effect.Effect<string[], GitError>

  /** Get the current branch name */
  readonly getCurrentBranch: () => Effect.Effect<string, GitError>

  /** Get commits since a tag (or all commits if tag is undefined) */
  readonly getCommitsSince: (tag: string | undefined) => Effect.Effect<Commit[], GitError>

  /** Check if the working tree is clean */
  readonly isClean: () => Effect.Effect<boolean, GitError>

  /** Create a new tag */
  readonly createTag: (tag: string, message?: string) => Effect.Effect<void, GitError>

  /** Push tags to remote */
  readonly pushTags: (remote?: string) => Effect.Effect<void, GitError>

  /** Get the repository root path */
  readonly getRoot: () => Effect.Effect<string, GitError>

  /** Get the short SHA of HEAD commit */
  readonly getHeadSha: () => Effect.Effect<string, GitError>

  /** Get the commit SHA that a tag points to */
  readonly getTagSha: (tag: string) => Effect.Effect<string, GitError>

  /** Check if sha1 is an ancestor of sha2 */
  readonly isAncestor: (sha1: string, sha2: string) => Effect.Effect<boolean, GitError>

  /** Create a tag at a specific commit SHA */
  readonly createTagAt: (tag: string, sha: string, message?: string) => Effect.Effect<void, GitError>

  /** Delete a tag locally */
  readonly deleteTag: (tag: string) => Effect.Effect<void, GitError>

  /** Check if a commit SHA exists in the repository */
  readonly commitExists: (sha: string) => Effect.Effect<boolean, GitError>

  /** Push a specific tag to remote */
  readonly pushTag: (tag: string, remote?: string, force?: boolean) => Effect.Effect<void, GitError>

  /** Delete a tag from remote */
  readonly deleteRemoteTag: (tag: string, remote?: string) => Effect.Effect<void, GitError>
}

/**
 * Git service tag.
 */
export class Git extends Context.Tag('Git')<Git, GitService>() {}

const makeGitService = (git: SimpleGit): GitService => ({
  getTags: () =>
    Effect.tryPromise({
      try: async () => {
        const result = await git.tags()
        return result.all
      },
      catch: (error) => new GitError({ message: 'Failed to get tags', cause: error }),
    }),

  getCurrentBranch: () =>
    Effect.tryPromise({
      try: async () => {
        const result = await git.branch()
        return result.current
      },
      catch: (error) => new GitError({ message: 'Failed to get current branch', cause: error }),
    }),

  getCommitsSince: (tag) =>
    Effect.tryPromise({
      try: async () => {
        const log = await git.log(tag ? { from: tag, to: 'HEAD' } : undefined)
        return log.all.map((entry) => ({
          hash: entry.hash,
          message: entry.message,
          body: entry.body,
          author: entry.author_name,
          date: entry.date,
        }))
      },
      catch: (error) => new GitError({ message: 'Failed to get commits', cause: error }),
    }),

  isClean: () =>
    Effect.tryPromise({
      try: async () => {
        const status = await git.status()
        return status.isClean()
      },
      catch: (error) => new GitError({ message: 'Failed to check status', cause: error }),
    }),

  createTag: (tag, message) =>
    Effect.tryPromise({
      try: async () => {
        if (message) {
          await git.tag(['-a', tag, '-m', message])
        } else {
          await git.tag([tag])
        }
      },
      catch: (error) => new GitError({ message: `Failed to create tag ${tag}`, cause: error }),
    }),

  pushTags: (remote = 'origin') =>
    Effect.tryPromise({
      try: async () => {
        await git.pushTags(remote)
      },
      catch: (error) => new GitError({ message: `Failed to push tags to ${remote}`, cause: error }),
    }),

  getRoot: () =>
    Effect.tryPromise({
      try: async () => {
        const root = await git.revparse(['--show-toplevel'])
        return root.trim()
      },
      catch: (error) => new GitError({ message: 'Failed to get repository root', cause: error }),
    }),

  getHeadSha: () =>
    Effect.tryPromise({
      try: async () => {
        const sha = await git.revparse(['--short', 'HEAD'])
        return sha.trim()
      },
      catch: (error) => new GitError({ message: 'Failed to get HEAD SHA', cause: error }),
    }),

  getTagSha: (tag) =>
    Effect.tryPromise({
      try: async () => {
        const sha = await git.raw(['rev-list', '-1', tag])
        return sha.trim()
      },
      catch: (error) => new GitError({ message: `Failed to get SHA for tag ${tag}`, cause: error }),
    }),

  isAncestor: (sha1, sha2) =>
    Effect.tryPromise({
      try: async () => {
        try {
          await git.raw(['merge-base', '--is-ancestor', sha1, sha2])
          return true // Exit code 0 = is ancestor
        } catch {
          return false // Exit code 1 = not ancestor
        }
      },
      catch: (error) => new GitError({ message: `Failed to check ancestry ${sha1} -> ${sha2}`, cause: error }),
    }),

  createTagAt: (tag, sha, message) =>
    Effect.tryPromise({
      try: async () => {
        if (message) {
          await git.tag(['-a', tag, sha, '-m', message])
        } else {
          await git.tag([tag, sha])
        }
      },
      catch: (error) => new GitError({ message: `Failed to create tag ${tag} at ${sha}`, cause: error }),
    }),

  deleteTag: (tag) =>
    Effect.tryPromise({
      try: async () => {
        await git.tag(['-d', tag])
      },
      catch: (error) => new GitError({ message: `Failed to delete tag ${tag}`, cause: error }),
    }),

  commitExists: (sha) =>
    Effect.tryPromise({
      try: async () => {
        try {
          await git.raw(['cat-file', '-t', sha])
          return true
        } catch {
          return false
        }
      },
      catch: (error) => new GitError({ message: `Failed to check if commit ${sha} exists`, cause: error }),
    }),

  pushTag: (tag, remote = 'origin', force = false) =>
    Effect.tryPromise({
      try: async () => {
        const args = force ? ['push', '--force', remote, `refs/tags/${tag}`] : ['push', remote, `refs/tags/${tag}`]
        await git.raw(args)
      },
      catch: (error) => new GitError({ message: `Failed to push tag ${tag} to ${remote}`, cause: error }),
    }),

  deleteRemoteTag: (tag, remote = 'origin') =>
    Effect.tryPromise({
      try: async () => {
        await git.raw(['push', remote, `:refs/tags/${tag}`])
      },
      catch: (error) => new GitError({ message: `Failed to delete tag ${tag} from ${remote}`, cause: error }),
    }),
})

/**
 * Live implementation of Git service using simple-git.
 */
export const GitLive = Layer.sync(Git, () => makeGitService(simpleGit()))

/**
 * Create a Git service for a specific directory.
 */
export const makeGitLive = (cwd: string) => Layer.sync(Git, () => makeGitService(simpleGit(cwd)))
