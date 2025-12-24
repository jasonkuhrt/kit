import { Context, Data, Effect, Layer } from 'effect'
import { type SimpleGit, simpleGit } from 'simple-git'

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

  /** Get the repository root path */
  readonly getRoot: () => Effect.Effect<string, GitError>

  /** Get the short SHA of HEAD commit */
  readonly getHeadSha: () => Effect.Effect<string, GitError>
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
})

/**
 * Live implementation of Git service using simple-git.
 */
export const GitLive = Layer.sync(Git, () => makeGitService(simpleGit()))

/**
 * Create a Git service for a specific directory.
 */
export const makeGitLive = (cwd: string) => Layer.sync(Git, () => makeGitService(simpleGit(cwd)))
