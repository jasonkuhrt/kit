import { it } from '@effect/vitest'
import { Semver } from '@kitz/semver'
import { Test } from '@kitz/test'
import { Effect, Layer } from 'effect'
import { describe, expect, test } from 'vitest'
import {
  aggregateByPackage,
  bumpFromType,
  calculateNextVersion,
  type CommitImpact,
  type CommitInput,
  extractImpacts,
  findLatestTagVersion,
  maxBump,
} from './version.js'

Test.describe('bumpFromType')
  .on(bumpFromType)
  .cases(
    // Breaking changes → major
    [['feat', true], 'major', { comment: 'breaking feat' }],
    [['fix', true], 'major', { comment: 'breaking fix' }],
    [['chore', true], 'major', { comment: 'breaking chore' }],
    // feat → minor
    [['feat', false], 'minor'],
    // Other types → patch
    [['fix', false], 'patch'],
    [['chore', false], 'patch'],
    [['docs', false], 'patch'],
  )
  .test()

Test.describe('maxBump')
  .on(maxBump)
  .cases(
    // major wins
    [['major', 'minor'], 'major'],
    [['minor', 'major'], 'major'],
    [['major', 'patch'], 'major'],
    // minor beats patch
    [['minor', 'patch'], 'minor'],
    [['patch', 'minor'], 'minor'],
    // same returns same
    [['patch', 'patch'], 'patch'],
    [['minor', 'minor'], 'minor'],
  )
  .test()

Test.describe('extractImpacts')
  .inputType<CommitInput>()
  .outputType<CommitImpact[]>()
  .layer(Layer.empty)
  .cases(
    [
      { hash: 'abc123', message: 'feat(core): add feature' },
      [{ scope: 'core', bump: 'minor', commit: { type: 'feat', message: 'add feature', hash: 'abc123', breaking: false } }],
      { comment: 'single scope feat' },
    ],
    [
      { hash: 'def456', message: 'feat(core)!: breaking' },
      [{ scope: 'core', bump: 'major', commit: { type: 'feat', message: 'breaking', hash: 'def456', breaking: true } }],
      { comment: 'single scope breaking' },
    ],
    [
      { hash: 'jkl012', message: 'feat: no scope' },
      [],
      { comment: 'scopeless returns empty' },
    ],
    [
      { hash: 'mno345', message: 'random commit message' },
      [],
      { comment: 'non-conventional returns empty' },
    ],
  )
  .testEffect(({ input, output }) =>
    Effect.gen(function*() {
      const impacts = yield* extractImpacts(input)
      expect(impacts).toEqual(output)
    })
  )

describe('extractImpacts', () => {
  it.effect('multi-target commit', () =>
    Effect.gen(function*() {
      const impacts = yield* extractImpacts({ hash: 'ghi789', message: 'feat(core!), fix(cli): mixed' })
      expect(impacts).toHaveLength(2)
      expect(impacts).toContainEqual({
        scope: 'core',
        bump: 'major',
        commit: { type: 'feat', message: 'mixed', hash: 'ghi789', breaking: true },
      })
      expect(impacts).toContainEqual({
        scope: 'cli',
        bump: 'patch',
        commit: { type: 'fix', message: 'mixed', hash: 'ghi789', breaking: false },
      })
    })
  )
})

describe('aggregateByPackage', () => {
  test('keeps highest bump', () => {
    const impacts = [
      { scope: 'core', bump: 'patch' as const, commit: { type: 'fix', message: 'bug', hash: 'a1', breaking: false } },
      {
        scope: 'core',
        bump: 'minor' as const,
        commit: { type: 'feat', message: 'feature', hash: 'a2', breaking: false },
      },
      {
        scope: 'core',
        bump: 'patch' as const,
        commit: { type: 'fix', message: 'another', hash: 'a3', breaking: false },
      },
    ]
    const result = aggregateByPackage(impacts)
    expect(result.get('core')).toEqual({
      bump: 'minor',
      commits: [
        { type: 'fix', message: 'bug', hash: 'a1', breaking: false },
        { type: 'feat', message: 'feature', hash: 'a2', breaking: false },
        { type: 'fix', message: 'another', hash: 'a3', breaking: false },
      ],
    })
  })

  test('separates packages', () => {
    const impacts = [
      { scope: 'core', bump: 'minor' as const, commit: { type: 'feat', message: 'a', hash: 'b1', breaking: false } },
      { scope: 'cli', bump: 'patch' as const, commit: { type: 'fix', message: 'b', hash: 'b2', breaking: false } },
    ]
    const result = aggregateByPackage(impacts)
    expect(result.size).toBe(2)
    expect(result.get('core')?.bump).toBe('minor')
    expect(result.get('cli')?.bump).toBe('patch')
  })
})

// Helper to extract version string for cleaner table assertions
const calcNextVersionStr = (current: string | null, bump: 'major' | 'minor' | 'patch') =>
  calculateNextVersion(current ? Semver.fromString(current) : null, bump).version.toString()

Test.describe('calculateNextVersion')
  .on(calcNextVersionStr)
  .cases(
    // First release (null current version)
    [[null, 'major'], '1.0.0'],
    [[null, 'minor'], '0.1.0'],
    [[null, 'patch'], '0.0.1'],
    // Version bumps
    [['1.2.3', 'major'], '2.0.0'],
    [['1.2.3', 'minor'], '1.3.0'],
    [['1.2.3', 'patch'], '1.2.4'],
  )
  .test()

// Helper to extract version string for cleaner table assertions
const findLatestVersionStr = (name: string, tags: string[]) =>
  findLatestTagVersion(name, tags)?.version.toString() ?? null

Test.describe('findLatestTagVersion')
  .on(findLatestVersionStr)
  .cases(
    // Finds matching tag - highest version
    [['@kitz/core', ['@kitz/core@1.0.0', '@kitz/core@1.1.0', '@kitz/cli@0.5.0']], '1.1.0'],
    // Returns null when no match
    [['@kitz/core', ['@kitz/cli@1.0.0']], null],
    // Returns null for empty tags
    [['@kitz/core', []], null],
    // Ignores invalid versions, finds highest valid
    [['@kitz/core', ['@kitz/core@1.0.0', '@kitz/core@invalid', '@kitz/core@2.0.0']], '2.0.0'],
  )
  .test()
