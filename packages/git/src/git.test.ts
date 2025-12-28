import { it } from '@effect/vitest'
import { Effect } from 'effect'
import { describe, expect } from 'vitest'
import { Git, GitLive } from './git.js'

describe('Git', () => {
  it.effect('getTags returns array of tags', () =>
    Effect.gen(function*() {
      const git = yield* Git
      const tags = yield* git.getTags()
      expect(Array.isArray(tags)).toBe(true)
    }).pipe(Effect.provide(GitLive)))

  it.effect('getCurrentBranch returns branch name', () =>
    Effect.gen(function*() {
      const git = yield* Git
      const branch = yield* git.getCurrentBranch()
      expect(typeof branch).toBe('string')
      expect(branch.length).toBeGreaterThan(0)
    }).pipe(Effect.provide(GitLive)))

  it.effect('getCommitsSince returns commits', () =>
    Effect.gen(function*() {
      const git = yield* Git
      const commits = yield* git.getCommitsSince(undefined)
      expect(Array.isArray(commits)).toBe(true)
      expect(commits.length).toBeGreaterThan(0)
      expect(commits[0]).toHaveProperty('hash')
      expect(commits[0]).toHaveProperty('message')
    }).pipe(Effect.provide(GitLive)))

  it.effect('isClean returns boolean', () =>
    Effect.gen(function*() {
      const git = yield* Git
      const clean = yield* git.isClean()
      expect(typeof clean).toBe('boolean')
    }).pipe(Effect.provide(GitLive)))
})
