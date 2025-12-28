import { Err } from '@kitz/core'
import { Context, Effect, Layer, Schema } from 'effect'
import { type SimpleGit, simpleGit } from 'simple-git'

// ============================================================================
// Errors
// ============================================================================

/**
 * Git operation names for structured error context.
 */
export type GitOperation =
  | 'getTags'
  | 'getCurrentBranch'
  | 'getCommitsSince'
  | 'isClean'
  | 'createTag'
  | 'pushTags'
  | 'getRoot'
  | 'getHeadSha'
  | 'getTagSha'
  | 'isAncestor'
  | 'createTagAt'
  | 'deleteTag'
  | 'commitExists'
  | 'pushTag'
  | 'deleteRemoteTag'

/**
 * Git operation error.
 */
export const GitError = Err.TaggedContextualError('GitError').constrain<{
  readonly operation: GitOperation
  readonly detail?: string
}>({
  message: (ctx) => `Git ${ctx.operation} failed${ctx.detail ? `: ${ctx.detail}` : ''}`,
}).constrainCause<Error>()

export type GitError = InstanceType<typeof GitError>

/**
 * A commit from git log.
 */
export class Commit extends Schema.TaggedClass<Commit>()('Commit', {
  hash: Schema.String,
  message: Schema.String,
  body: Schema.String,
  author: Schema.String,
  date: Schema.Date,
}) {}

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
      catch: (error) =>
        new GitError({ context: { operation: 'getTags' }, cause: Err.ensure(error) }),
    }),

  getCurrentBranch: () =>
    Effect.tryPromise({
      try: async () => {
        const result = await git.branch()
        return result.current
      },
      catch: (error) =>
        new GitError({ context: { operation: 'getCurrentBranch' }, cause: Err.ensure(error) }),
    }),

  getCommitsSince: (tag) =>
    Effect.tryPromise({
      try: async () => {
        const log = await git.log(tag ? { from: tag, to: 'HEAD' } : undefined)
        return log.all.map((entry) =>
          Commit.make({
            hash: entry.hash,
            message: entry.message,
            body: entry.body,
            author: entry.author_name,
            date: new Date(entry.date),
          })
        )
      },
      catch: (error) =>
        new GitError({
          context: { operation: 'getCommitsSince', ...(tag ? { detail: `since ${tag}` } : {}) },
          cause: Err.ensure(error),
        }),
    }),

  isClean: () =>
    Effect.tryPromise({
      try: async () => {
        const status = await git.status()
        return status.isClean()
      },
      catch: (error) =>
        new GitError({ context: { operation: 'isClean' }, cause: Err.ensure(error) }),
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
      catch: (error) =>
        new GitError({ context: { operation: 'createTag', detail: tag }, cause: Err.ensure(error) }),
    }),

  pushTags: (remote = 'origin') =>
    Effect.tryPromise({
      try: async () => {
        await git.pushTags(remote)
      },
      catch: (error) =>
        new GitError({ context: { operation: 'pushTags', detail: `to ${remote}` }, cause: Err.ensure(error) }),
    }),

  getRoot: () =>
    Effect.tryPromise({
      try: async () => {
        const root = await git.revparse(['--show-toplevel'])
        return root.trim()
      },
      catch: (error) =>
        new GitError({ context: { operation: 'getRoot' }, cause: Err.ensure(error) }),
    }),

  getHeadSha: () =>
    Effect.tryPromise({
      try: async () => {
        const sha = await git.revparse(['--short', 'HEAD'])
        return sha.trim()
      },
      catch: (error) =>
        new GitError({ context: { operation: 'getHeadSha' }, cause: Err.ensure(error) }),
    }),

  getTagSha: (tag) =>
    Effect.tryPromise({
      try: async () => {
        const sha = await git.raw(['rev-list', '-1', tag])
        return sha.trim()
      },
      catch: (error) =>
        new GitError({ context: { operation: 'getTagSha', detail: tag }, cause: Err.ensure(error) }),
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
      catch: (error) =>
        new GitError({
          context: { operation: 'isAncestor', detail: `${sha1} -> ${sha2}` },
          cause: Err.ensure(error),
        }),
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
      catch: (error) =>
        new GitError({
          context: { operation: 'createTagAt', detail: `${tag} at ${sha}` },
          cause: Err.ensure(error),
        }),
    }),

  deleteTag: (tag) =>
    Effect.tryPromise({
      try: async () => {
        await git.tag(['-d', tag])
      },
      catch: (error) =>
        new GitError({ context: { operation: 'deleteTag', detail: tag }, cause: Err.ensure(error) }),
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
      catch: (error) =>
        new GitError({ context: { operation: 'commitExists', detail: sha }, cause: Err.ensure(error) }),
    }),

  pushTag: (tag, remote = 'origin', force = false) =>
    Effect.tryPromise({
      try: async () => {
        const args = force ? ['push', '--force', remote, `refs/tags/${tag}`] : ['push', remote, `refs/tags/${tag}`]
        await git.raw(args)
      },
      catch: (error) =>
        new GitError({
          context: { operation: 'pushTag', detail: `${tag} to ${remote}${force ? ' (force)' : ''}` },
          cause: Err.ensure(error),
        }),
    }),

  deleteRemoteTag: (tag, remote = 'origin') =>
    Effect.tryPromise({
      try: async () => {
        await git.raw(['push', remote, `:refs/tags/${tag}`])
      },
      catch: (error) =>
        new GitError({
          context: { operation: 'deleteRemoteTag', detail: `${tag} from ${remote}` },
          cause: Err.ensure(error),
        }),
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
