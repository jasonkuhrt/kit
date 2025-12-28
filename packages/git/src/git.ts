import { Err } from '@kitz/core'
import { Context, Effect, Layer, Schema } from 'effect'
import { type SimpleGit, simpleGit } from 'simple-git'
import * as Sha from './sha.js'

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
 * Error parsing/transforming git output.
 */
export const GitParseError = Err.TaggedContextualError('GitParseError').constrain<{
  readonly operation: GitOperation
  readonly detail?: string
}>({
  message: (ctx) => `Git ${ctx.operation} parse failed${ctx.detail ? `: ${ctx.detail}` : ''}`,
}).constrainCause<Error>()

export type GitParseError = InstanceType<typeof GitParseError>

/**
 * A git commit author.
 */
export class Author extends Schema.TaggedClass<Author>()('Author', {
  name: Schema.String,
  email: Schema.String,
}) {}

/**
 * A commit from git log.
 */
export class Commit extends Schema.TaggedClass<Commit>()('Commit', {
  hash: Sha.Sha,
  message: Schema.String,
  body: Schema.String,
  author: Author,
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
  readonly getCommitsSince: (tag: string | undefined) => Effect.Effect<Commit[], GitError | GitParseError>

  /** Check if the working tree is clean */
  readonly isClean: () => Effect.Effect<boolean, GitError>

  /** Create a new tag */
  readonly createTag: (tag: string, message?: string) => Effect.Effect<void, GitError>

  /** Push tags to remote */
  readonly pushTags: (remote?: string) => Effect.Effect<void, GitError>

  /** Get the repository root path */
  readonly getRoot: () => Effect.Effect<string, GitError>

  /** Get the short SHA of HEAD commit */
  readonly getHeadSha: () => Effect.Effect<Sha.Sha, GitError | GitParseError>

  /** Get the commit SHA that a tag points to */
  readonly getTagSha: (tag: string) => Effect.Effect<Sha.Sha, GitError | GitParseError>

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

/**
 * Options for gitEffect helper with map transform.
 */
interface GitEffectOptionsWithMap<$raw, $value> {
  readonly detail?: string | undefined
  readonly map: (raw: $raw) => $value
}

/**
 * Options for gitEffect helper without map transform.
 */
interface GitEffectOptionsWithoutMap {
  readonly detail?: string
}

/**
 * Helper to wrap simple-git calls in Effect with standardized error handling.
 */
function gitEffect<$value>(
  operation: GitOperation,
  fn: () => Promise<$value>,
  options?: string | GitEffectOptionsWithoutMap,
): Effect.Effect<$value, GitError>

function gitEffect<$raw, $value>(
  operation: GitOperation,
  fn: () => Promise<$raw>,
  options: GitEffectOptionsWithMap<$raw, $value>,
): Effect.Effect<$value, GitError | GitParseError>

function gitEffect<$raw, $value = $raw>(
  operation: GitOperation,
  fn: () => Promise<$raw>,
  options?: string | GitEffectOptionsWithoutMap | GitEffectOptionsWithMap<$raw, $value>,
): Effect.Effect<$value, GitError | GitParseError> {
  const opts = typeof options === 'string' ? { detail: options } : options
  const detail = opts?.detail

  const base = Effect.tryPromise({
    try: fn,
    catch: (error) =>
      new GitError({
        context: { operation, ...(detail ? { detail } : {}) },
        cause: Err.ensure(error),
      }),
  })

  if (opts && 'map' in opts && typeof opts.map === 'function') {
    const mapFn = opts.map as (raw: $raw) => $value
    return base.pipe(
      Effect.flatMap((raw) =>
        Effect.try({
          try: () => mapFn(raw),
          catch: (error) =>
            new GitParseError({
              context: { operation, ...(detail ? { detail } : {}) },
              cause: Err.ensure(error),
            }),
        })
      ),
    )
  }

  return base as any
}

const makeGitService = (git: SimpleGit): GitService => ({
  getTags: () => gitEffect('getTags', async () => (await git.tags()).all),

  getCurrentBranch: () => gitEffect('getCurrentBranch', async () => (await git.branch()).current),

  getCommitsSince: (tag) =>
    gitEffect('getCommitsSince', () => git.log(tag ? { from: tag, to: 'HEAD' } : undefined), {
      detail: tag ? `since ${tag}` : undefined,
      map: (log) =>
        log.all.map((entry) =>
          Commit.make({
            hash: Sha.make(entry.hash),
            message: entry.message,
            body: entry.body,
            author: Author.make({
              name: entry.author_name,
              email: entry.author_email,
            }),
            date: new Date(entry.date),
          })
        ),
    }),

  isClean: () => gitEffect('isClean', async () => (await git.status()).isClean()),

  createTag: (tag, message) =>
    gitEffect(
      'createTag',
      async () => {
        if (message) {
          await git.tag(['-a', tag, '-m', message])
        } else {
          await git.tag([tag])
        }
      },
      tag,
    ),

  pushTags: (remote = 'origin') => gitEffect('pushTags', () => git.pushTags(remote), `to ${remote}`),

  getRoot: () => gitEffect('getRoot', async () => (await git.revparse(['--show-toplevel'])).trim()),

  getHeadSha: () =>
    gitEffect('getHeadSha', () => git.revparse(['--short', 'HEAD']), {
      map: (sha) => Sha.make(sha.trim()),
    }),

  getTagSha: (tag) =>
    gitEffect('getTagSha', () => git.raw(['rev-list', '-1', tag]), {
      detail: tag,
      map: (sha: string) => Sha.make(sha.trim()),
    }),

  isAncestor: (sha1, sha2) =>
    gitEffect(
      'isAncestor',
      async () => {
        try {
          await git.raw(['merge-base', '--is-ancestor', sha1, sha2])
          return true // Exit code 0 = is ancestor
        } catch {
          return false // Exit code 1 = not ancestor
        }
      },
      `${sha1} -> ${sha2}`,
    ),

  createTagAt: (tag, sha, message) =>
    gitEffect(
      'createTagAt',
      async () => {
        if (message) {
          await git.tag(['-a', tag, sha, '-m', message])
        } else {
          await git.tag([tag, sha])
        }
      },
      `${tag} at ${sha}`,
    ),

  deleteTag: (tag) => gitEffect('deleteTag', () => git.tag(['-d', tag]), tag),

  commitExists: (sha) =>
    gitEffect(
      'commitExists',
      async () => {
        try {
          await git.raw(['cat-file', '-t', sha])
          return true
        } catch {
          return false
        }
      },
      sha,
    ),

  pushTag: (tag, remote = 'origin', force = false) =>
    gitEffect(
      'pushTag',
      async () => {
        const args = force ? ['push', '--force', remote, `refs/tags/${tag}`] : ['push', remote, `refs/tags/${tag}`]
        await git.raw(args)
      },
      `${tag} to ${remote}${force ? ' (force)' : ''}`,
    ),

  deleteRemoteTag: (tag, remote = 'origin') =>
    gitEffect('deleteRemoteTag', () => git.raw(['push', remote, `:refs/tags/${tag}`]), `${tag} from ${remote}`),
})

/**
 * Live implementation of Git service using simple-git.
 */
export const GitLive = Layer.sync(Git, () => makeGitService(simpleGit()))

/**
 * Create a Git service for a specific directory.
 */
export const makeGitLive = (cwd: string) => Layer.sync(Git, () => makeGitService(simpleGit(cwd)))
