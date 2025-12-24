import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'
import { Git, GitLive } from './git.js'

describe('Git', () => {
  // These tests require a real git repo, so we test in the current repo
  const runWithGit = <A, E>(effect: Effect.Effect<A, E, Git>) => Effect.runPromise(Effect.provide(effect, GitLive))

  test('getTags returns array of tags', async () => {
    const tags = await runWithGit(
      Effect.gen(function*() {
        const git = yield* Git
        return yield* git.getTags()
      }),
    )
    expect(Array.isArray(tags)).toBe(true)
  })

  test('getCurrentBranch returns branch name', async () => {
    const branch = await runWithGit(
      Effect.gen(function*() {
        const git = yield* Git
        return yield* git.getCurrentBranch()
      }),
    )
    expect(typeof branch).toBe('string')
    expect(branch.length).toBeGreaterThan(0)
  })

  test('getCommitsSince returns commits', async () => {
    const commits = await runWithGit(
      Effect.gen(function*() {
        const git = yield* Git
        // Get commits since beginning (no tag)
        return yield* git.getCommitsSince(undefined)
      }),
    )
    expect(Array.isArray(commits)).toBe(true)
    // This repo always has commits, so we can safely check structure
    expect(commits.length).toBeGreaterThan(0)
    expect(commits[0]).toHaveProperty('hash')
    expect(commits[0]).toHaveProperty('message')
  })

  test('isClean returns boolean', async () => {
    const clean = await runWithGit(
      Effect.gen(function*() {
        const git = yield* Git
        return yield* git.isClean()
      }),
    )
    expect(typeof clean).toBe('boolean')
  })
})
