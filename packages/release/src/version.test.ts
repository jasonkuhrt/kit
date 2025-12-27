import { Semver } from '@kitz/semver'
import { Test } from '@kitz/test'
import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'
import {
  aggregateByPackage,
  bumpFromType,
  calculateNextVersion,
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

describe('extractImpacts', () => {
  test('single scope feat', async () => {
    const impacts = await Effect.runPromise(extractImpacts('feat(core): add feature'))
    expect(impacts).toEqual([
      { scope: 'core', bump: 'minor', commitMessage: 'feat(core): add feature' },
    ])
  })

  test('single scope breaking', async () => {
    const impacts = await Effect.runPromise(extractImpacts('feat(core)!: breaking'))
    expect(impacts).toEqual([
      { scope: 'core', bump: 'major', commitMessage: 'feat(core)!: breaking' },
    ])
  })

  test('multi-target commit', async () => {
    const impacts = await Effect.runPromise(extractImpacts('feat(core!), fix(cli): mixed'))
    expect(impacts).toHaveLength(2)
    expect(impacts).toContainEqual({
      scope: 'core',
      bump: 'major',
      commitMessage: 'feat(core!), fix(cli): mixed',
    })
    expect(impacts).toContainEqual({
      scope: 'cli',
      bump: 'patch',
      commitMessage: 'feat(core!), fix(cli): mixed',
    })
  })

  test('scopeless returns empty', async () => {
    const impacts = await Effect.runPromise(extractImpacts('feat: no scope'))
    expect(impacts).toEqual([])
  })

  test('non-conventional returns empty', async () => {
    const impacts = await Effect.runPromise(extractImpacts('random commit message'))
    expect(impacts).toEqual([])
  })
})

describe('aggregateByPackage', () => {
  test('keeps highest bump', () => {
    const impacts = [
      { scope: 'core', bump: 'patch' as const, commitMessage: 'fix(core): bug' },
      { scope: 'core', bump: 'minor' as const, commitMessage: 'feat(core): feature' },
      { scope: 'core', bump: 'patch' as const, commitMessage: 'fix(core): another' },
    ]
    const result = aggregateByPackage(impacts)
    expect(result.get('core')).toEqual({
      bump: 'minor',
      commits: ['fix(core): bug', 'feat(core): feature', 'fix(core): another'],
    })
  })

  test('separates packages', () => {
    const impacts = [
      { scope: 'core', bump: 'minor' as const, commitMessage: 'feat(core): a' },
      { scope: 'cli', bump: 'patch' as const, commitMessage: 'fix(cli): b' },
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
