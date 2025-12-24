import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'
import {
  bumpFromType,
  maxBump,
  extractImpacts,
  aggregateByPackage,
  calculateNextVersion,
  findLatestTagVersion,
} from './version.js'

describe('bumpFromType', () => {
  test('breaking = major', () => {
    expect(bumpFromType('feat', true)).toBe('major')
    expect(bumpFromType('fix', true)).toBe('major')
    expect(bumpFromType('chore', true)).toBe('major')
  })

  test('feat = minor', () => {
    expect(bumpFromType('feat', false)).toBe('minor')
  })

  test('other = patch', () => {
    expect(bumpFromType('fix', false)).toBe('patch')
    expect(bumpFromType('chore', false)).toBe('patch')
    expect(bumpFromType('docs', false)).toBe('patch')
  })
})

describe('maxBump', () => {
  test('major wins', () => {
    expect(maxBump('major', 'minor')).toBe('major')
    expect(maxBump('minor', 'major')).toBe('major')
    expect(maxBump('major', 'patch')).toBe('major')
  })

  test('minor beats patch', () => {
    expect(maxBump('minor', 'patch')).toBe('minor')
    expect(maxBump('patch', 'minor')).toBe('minor')
  })

  test('same returns same', () => {
    expect(maxBump('patch', 'patch')).toBe('patch')
    expect(maxBump('minor', 'minor')).toBe('minor')
  })
})

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

describe('calculateNextVersion', () => {
  test('first release', () => {
    expect(calculateNextVersion(null, 'major')).toBe('1.0.0')
    expect(calculateNextVersion(null, 'minor')).toBe('0.1.0')
    expect(calculateNextVersion(null, 'patch')).toBe('0.0.1')
  })

  test('major bump', () => {
    expect(calculateNextVersion('1.2.3', 'major')).toBe('2.0.0')
  })

  test('minor bump', () => {
    expect(calculateNextVersion('1.2.3', 'minor')).toBe('1.3.0')
  })

  test('patch bump', () => {
    expect(calculateNextVersion('1.2.3', 'patch')).toBe('1.2.4')
  })
})

describe('findLatestTagVersion', () => {
  test('finds matching tag', () => {
    const tags = ['@kitz/core@1.0.0', '@kitz/core@1.1.0', '@kitz/cli@0.5.0']
    expect(findLatestTagVersion('@kitz/core', tags)).toBe('1.1.0')
  })

  test('returns null when no match', () => {
    const tags = ['@kitz/cli@1.0.0']
    expect(findLatestTagVersion('@kitz/core', tags)).toBeNull()
  })

  test('returns null for empty tags', () => {
    expect(findLatestTagVersion('@kitz/core', [])).toBeNull()
  })

  test('ignores invalid versions', () => {
    const tags = ['@kitz/core@1.0.0', '@kitz/core@invalid', '@kitz/core@2.0.0']
    expect(findLatestTagVersion('@kitz/core', tags)).toBe('2.0.0')
  })
})
