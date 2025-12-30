import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Test } from '@kitz/test'
import { Effect, Layer, Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { Cascade, Plan, type Workspace } from './__.js'
import { makeTestWorkflowRuntime } from './api/workflow.js'

// ─── Test Helpers ───────────────────────────────────────────────────

const mockPackages: Workspace.Package[] = [
  { name: '@kitz/core', scope: 'core', path: Fs.Path.AbsDir.fromString('/repo/packages/core/') },
  { name: '@kitz/cli', scope: 'cli', path: Fs.Path.AbsDir.fromString('/repo/packages/cli/') },
  { name: '@kitz/utils', scope: 'utils', path: Fs.Path.AbsDir.fromString('/repo/packages/utils/') },
]

const testEnv = Env.Test({ cwd: Fs.Path.AbsDir.fromString('/repo/') })
const testWorkflowRuntime = makeTestWorkflowRuntime()

const makeTestLayer = (
  gitConfig: Parameters<typeof Git.Memory.make>[0],
  diskLayout: Fs.Memory.DiskLayout = {},
) => Layer.mergeAll(Git.Memory.make(gitConfig), Fs.Memory.layer(diskLayout), testEnv)

const makeApplyTestLayer = (
  gitConfig: Parameters<typeof Git.Memory.make>[0],
  diskLayout: Fs.Memory.DiskLayout = {},
) =>
  Layer.provideMerge(
    testWorkflowRuntime,
    makeTestLayer(gitConfig, diskLayout),
  )

const makePackageJson = (
  name: string,
  version: string,
  dependencies?: Record<string, string>,
) => JSON.stringify({ name, version, ...(dependencies && { dependencies }) }, null, 2)

/** Type-safe version assertion */
const expectVersion = (actual: Semver.Semver | undefined, expected: string) => {
  expect(actual).toBeDefined()
  expect(Semver.equivalence(actual!, Semver.fromString(expected))).toBe(true)
}

// ─── Plan.stable ────────────────────────────────────────────────────

describe('Plan.stable', () => {
  test('no releases when no commits since last tag', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(0)
    expect(result.cascades).toHaveLength(0)
  })

  Test.describe('bump detection')
    .inputType<{ tags: string[]; commit: string }>()
    .outputType<{ bump: Semver.BumpType; version: string }>()
    .cases(
      {
        input: { tags: ['@kitz/core@1.0.0'], commit: 'fix(core): bug fix' },
        output: { bump: 'patch', version: '1.0.1' },
        comment: 'fix → patch',
      },
      {
        input: { tags: ['@kitz/core@1.0.0'], commit: 'feat(core): new feature' },
        output: { bump: 'minor', version: '1.1.0' },
        comment: 'feat → minor',
      },
      {
        input: { tags: ['@kitz/core@1.0.0'], commit: 'feat(core)!: breaking change' },
        output: { bump: 'major', version: '2.0.0' },
        comment: 'breaking → major',
      },
      {
        input: { tags: [], commit: 'feat(core): initial' },
        output: { bump: 'minor', version: '0.1.0' },
        comment: 'first release starts at 0.x.x',
      },
    )
    .test(async ({ input, output }) => {
      const layer = makeTestLayer({
        tags: input.tags,
        commits: [Git.Memory.commit(input.commit)],
      })

      const result = await Effect.runPromise(
        Effect.provide(Plan.stable({ packages: mockPackages }), layer),
      )

      expect(result.releases).toHaveLength(1)
      expect(Plan.getBumpType(result.releases[0]!)).toBe(output.bump)
      expectVersion(Plan.getNextVersion(result.releases[0]!), output.version)
    })

  test('aggregates multiple commits to highest bump', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        Git.Memory.commit('fix(core): bug fix 1'),
        Git.Memory.commit('feat(core): new feature'),
        Git.Memory.commit('fix(core): bug fix 2'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(1)
    expect(Plan.getBumpType(result.releases[0]!)).toBe('minor')
    expect(result.releases[0]!.commits).toHaveLength(3)
  })

  test('handles multiple packages', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0', '@kitz/cli@2.0.0'],
      commits: [
        Git.Memory.commit('feat(core): core feature'),
        Git.Memory.commit('fix(cli): cli fix'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(2)

    const core = result.releases.find((r) => r.package.name === '@kitz/core')
    const cli = result.releases.find((r) => r.package.name === '@kitz/cli')

    expect(Plan.getBumpType(core!)).toBe('minor')
    expectVersion(Plan.getNextVersion(core!), '1.1.0')

    expect(Plan.getBumpType(cli!)).toBe('patch')
    expectVersion(Plan.getNextVersion(cli!), '2.0.1')
  })

  test('respects package filter', async () => {
    const layer = makeTestLayer({
      tags: [],
      commits: [
        Git.Memory.commit('feat(core): core'),
        Git.Memory.commit('feat(cli): cli'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }, { packages: ['@kitz/core'] }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]!.package.name).toBe('@kitz/core')
  })
})

// ─── Plan.preview ───────────────────────────────────────────────────

describe('Plan.preview', () => {
  test('generates preview version', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [Git.Memory.commit('feat(core): new feature')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.preview({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(Plan.getNextVersion(result.releases[0]!), '1.1.0-next.1')
  })

  test('increments preview number', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0', '@kitz/core@1.1.0-next.1', '@kitz/core@1.1.0-next.2'],
      commits: [Git.Memory.commit('feat(core): new feature')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.preview({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(Plan.getNextVersion(result.releases[0]!), '1.1.0-next.3')
  })
})

// ─── Plan.pr ────────────────────────────────────────────────────────

describe('Plan.pr', () => {
  test('generates PR version with explicit prNumber', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [Git.Memory.commit('feat(core): new feature')],
      headSha: Git.Sha.make('abc1234'),
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 42 }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(Plan.getNextVersion(result.releases[0]!), '0.0.0-pr.42.1.abc1234')
  })

  test('increments PR iteration', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0', '@kitz/core@0.0.0-pr.42.1.def5678'],
      commits: [Git.Memory.commit('feat(core): new feature')],
      headSha: Git.Sha.make('abc1234'),
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 42 }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(Plan.getNextVersion(result.releases[0]!), '0.0.0-pr.42.2.abc1234')
  })

  test('detects PR number from environment', async () => {
    const envWithPr = Env.Test({
      cwd: Fs.Path.AbsDir.fromString('/repo/'),
      vars: { PR_NUMBER: '123' },
    })

    const layer = Layer.mergeAll(
      Git.Memory.make({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Memory.commit('feat(core): feature')],
        headSha: Git.Sha.make('def7890'),
      }),
      Fs.Memory.layer({}),
      envWithPr,
    )

    const result = await Effect.runPromise(
      Effect.provide(Plan.pr({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(Plan.getNextVersion(result.releases[0]!), '0.0.0-pr.123.1.def7890')
  })
})

// ─── Cascade Detection ──────────────────────────────────────────────

describe('Cascade', () => {
  test('detects dependent packages', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const layer = Layer.mergeAll(
      Git.Memory.make({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [Git.Memory.commit('feat(core): new API')],
      }),
      Fs.Memory.layer(diskLayout),
      testEnv,
    )

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]!.package.name).toBe('@kitz/core')

    expect(result.cascades).toHaveLength(1)
    expect(result.cascades[0]!.package.name).toBe('@kitz/cli')
    expect(Plan.getBumpType(result.cascades[0]!)).toBe('patch')
  })

  test('detects transitive cascades', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
      '/repo/packages/utils/package.json': makePackageJson('@kitz/utils', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const layer = Layer.mergeAll(
      Git.Memory.make({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0', '@kitz/utils@1.0.0'],
        commits: [Git.Memory.commit('feat(core): new API')],
      }),
      Fs.Memory.layer(diskLayout),
      testEnv,
    )

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    expect(result.cascades).toHaveLength(2)
    const cascadeNames = result.cascades.map((c) => c.package.name)
    expect(cascadeNames).toContain('@kitz/cli')
    expect(cascadeNames).toContain('@kitz/utils')
  })
})

// ─── Plan.apply ─────────────────────────────────────────────────────

describe('Plan.apply', () => {
  test('creates git tags for releases', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Memory.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Memory.commit('feat(core): new feature')],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    const result = await Effect.runPromise(
      Effect.provide(Plan.apply(plan, { dryRun: true }), layer),
    )

    expect(result.released).toHaveLength(1)
    expect(result.tags).toContain('@kitz/core@1.1.0')
  })

  test('includes cascades in release', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Memory.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [Git.Memory.commit('feat(core): new API')],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    const result = await Effect.runPromise(
      Effect.provide(Plan.apply(plan, { dryRun: true }), layer),
    )

    expect(result.released).toHaveLength(2)
    expect(result.tags).toContain('@kitz/core@1.1.0')
    expect(result.tags).toContain('@kitz/cli@1.0.1')
  })

  test('idempotent execution', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Memory.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Memory.commit('feat(core): new feature')],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    const result1 = await Effect.runPromise(
      Effect.provide(Plan.apply(plan, { dryRun: true }), layer),
    )

    const result2 = await Effect.runPromise(
      Effect.provide(Plan.apply(plan, { dryRun: true }), layer),
    )

    expect(result1.tags).toEqual(result2.tags)
  })
})

// ─── Helper Functions ───────────────────────────────────────────────

describe('Plan helpers', () => {
  test('getNextVersion returns correct version', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [Git.Memory.commit('feat(core): feature')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    const release = result.releases[0]!
    const nextVersion = Plan.getNextVersion(release)

    expect(Semver.equivalence(nextVersion, Semver.fromString('1.1.0'))).toBe(true)
  })

  test('getCurrentVersion returns Option for existing version', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [Git.Memory.commit('feat(core): feature')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    const release = result.releases[0]!
    const currentVersion = Plan.getCurrentVersion(release)

    expect(Option.isSome(currentVersion)).toBe(true)
    expect(Semver.equivalence(Option.getOrThrow(currentVersion), Semver.fromString('1.0.0'))).toBe(true)
  })

  test('getCurrentVersion returns None for first release', async () => {
    const layer = makeTestLayer({
      tags: [],
      commits: [Git.Memory.commit('feat(core): initial')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    const release = result.releases[0]!
    const currentVersion = Plan.getCurrentVersion(release)

    expect(Option.isNone(currentVersion)).toBe(true)
  })

  test('getBumpType returns bump type for stable releases', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [Git.Memory.commit('feat(core): feature')],
    })

    const result = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
    )

    const release = result.releases[0]!
    const bump = Plan.getBumpType(release)

    expect(bump).toBe('minor')
  })
})
