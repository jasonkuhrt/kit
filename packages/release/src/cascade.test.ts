import { Semver } from '@kitz/semver'
import { Equal } from 'effect'
import { describe, expect, test } from 'vitest'
import { detectCascades } from './cascade.js'
import type { Package } from './discovery.js'
import type { PlannedRelease } from './release.js'

const mockPackages: Package[] = [
  { name: '@kitz/core', scope: 'core', path: '/repo/packages/core' },
  { name: '@kitz/cli', scope: 'cli', path: '/repo/packages/cli' },
  { name: '@kitz/utils', scope: 'utils', path: '/repo/packages/utils' },
]

describe('detectCascades', () => {
  test('no cascades when no dependents', () => {
    const graph = new Map([
      ['@kitz/core', []],
      ['@kitz/cli', []],
    ])

    const releases: PlannedRelease[] = [
      {
        package: mockPackages[0]!,
        currentVersion: Semver.fromString('1.0.0'),
        nextVersion: Semver.fromString('1.1.0'),
        bump: 'minor',
        commits: ['feat(core): new feature'],
      },
    ]

    const cascades = detectCascades(mockPackages, releases, graph, [])
    expect(cascades).toHaveLength(0)
  })

  test('cascade when dependent exists', () => {
    const graph = new Map([
      ['@kitz/core', ['@kitz/cli']], // cli depends on core
      ['@kitz/cli', []],
      ['@kitz/utils', []],
    ])

    const releases: PlannedRelease[] = [
      {
        package: mockPackages[0]!,
        currentVersion: Semver.fromString('1.0.0'),
        nextVersion: Semver.fromString('1.1.0'),
        bump: 'minor',
        commits: ['feat(core): new feature'],
      },
    ]

    const cascades = detectCascades(mockPackages, releases, graph, [])
    expect(cascades).toHaveLength(1)
    expect(cascades[0]?.package.name).toBe('@kitz/cli')
    expect(cascades[0]?.bump).toBe('patch')
  })

  test('transitive cascades', () => {
    // utils -> cli -> core (utils depends on cli, cli depends on core)
    const graph = new Map([
      ['@kitz/core', ['@kitz/cli']],
      ['@kitz/cli', ['@kitz/utils']],
      ['@kitz/utils', []],
    ])

    const releases: PlannedRelease[] = [
      {
        package: mockPackages[0]!,
        currentVersion: Semver.fromString('1.0.0'),
        nextVersion: Semver.fromString('1.1.0'),
        bump: 'minor',
        commits: ['feat(core): new feature'],
      },
    ]

    const cascades = detectCascades(mockPackages, releases, graph, [])
    expect(cascades).toHaveLength(2)

    const names = cascades.map((c) => c.package.name)
    expect(names).toContain('@kitz/cli')
    expect(names).toContain('@kitz/utils')
  })

  test('no duplicate cascades when already releasing', () => {
    const graph = new Map([
      ['@kitz/core', ['@kitz/cli']],
      ['@kitz/cli', []],
    ])

    const releases: PlannedRelease[] = [
      {
        package: mockPackages[0]!,
        currentVersion: Semver.fromString('1.0.0'),
        nextVersion: Semver.fromString('1.1.0'),
        bump: 'minor',
        commits: ['feat(core): a'],
      },
      {
        package: mockPackages[1]!,
        currentVersion: Semver.fromString('0.5.0'),
        nextVersion: Semver.fromString('0.6.0'),
        bump: 'minor',
        commits: ['feat(cli): b'],
      },
    ]

    const cascades = detectCascades(mockPackages, releases, graph, [])
    expect(cascades).toHaveLength(0) // cli already in primary releases
  })

  test('cascade uses existing version from tags', () => {
    const graph = new Map([
      ['@kitz/core', ['@kitz/cli']],
      ['@kitz/cli', []],
    ])

    const releases: PlannedRelease[] = [
      {
        package: mockPackages[0]!,
        currentVersion: Semver.fromString('1.0.0'),
        nextVersion: Semver.fromString('1.1.0'),
        bump: 'minor',
        commits: ['feat(core): new feature'],
      },
    ]

    const tags = ['@kitz/cli@2.0.0']
    const cascades = detectCascades(mockPackages, releases, graph, tags)

    expect(cascades).toHaveLength(1)
    expect(Equal.equals(cascades[0]?.currentVersion, Semver.fromString('2.0.0'))).toBe(true)
    expect(Equal.equals(cascades[0]?.nextVersion, Semver.fromString('2.0.1'))).toBe(true)
  })
})
