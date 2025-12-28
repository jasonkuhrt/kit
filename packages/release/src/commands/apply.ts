import { FileSystem, Path } from '@effect/platform'
import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Semver } from '@kitz/semver'
import { Effect, Fiber, Layer, Option, Schema, Stream } from 'effect'
import { load } from '../config.js'
import { discover, type Package } from '../discovery.js'
import {
  getNextVersion,
  type PlannedRelease,
  type ReleasePlan,
  StablePlannedRelease,
  StableVersionFirst,
  StableVersionIncrement,
} from '../release.js'
import type { BumpType, StructuredCommit } from '../version.js'
import { executeWorkflowObservable } from '../workflow.js'

const PLAN_DIR = '.release'
const PLAN_FILE = 'plan.json'

/**
 * Deserialize plan from JSON.
 */
const deserializePlan = (
  json: string,
  packages: Package[],
): { type: string; plan: ReleasePlan } => {
  const data = JSON.parse(json) as {
    type: string
    timestamp: string
    releases: Array<{
      package: string
      path: string
      currentVersion: string | null
      nextVersion: string
      bump: BumpType
      commits?: Array<{
        hash: string
        type: string
        scope?: string
        message: string
        breaking: boolean
      }>
    }>
    cascades: Array<{
      package: string
      path: string
      currentVersion: string | null
      nextVersion: string
      bump: BumpType
    }>
  }

  // Reconstruct full Package objects
  const packageByName = new Map(packages.map((p) => [p.name, p]))

  const reconstructRelease = (r: typeof data.releases[number]): PlannedRelease => {
    const pkg = packageByName.get(r.package)
    if (!pkg) {
      throw new Error(`Package ${r.package} not found in workspace`)
    }

    const commits: StructuredCommit[] = (r.commits ?? []).map((c) => ({
      hash: Git.Sha.make(c.hash),
      type: c.type,
      message: c.message,
      breaking: c.breaking,
    }))

    // Currently only stable releases are supported in the plan file format
    // For stable releases, determine if this is a first release or an increment
    const nextVersion = Semver.fromString(r.nextVersion)

    if (r.currentVersion === null) {
      // First release - no previous version
      return StablePlannedRelease.make({
        package: pkg,
        version: StableVersionFirst.make({ version: nextVersion }),
        commits,
      })
    } else {
      // Increment release - has previous version
      return StablePlannedRelease.make({
        package: pkg,
        version: StableVersionIncrement.make({
          from: Semver.fromString(r.currentVersion),
          to: nextVersion,
          bump: r.bump,
        }),
        commits,
      })
    }
  }

  return {
    type: data.type,
    plan: {
      releases: data.releases.map(reconstructRelease),
      cascades: data.cascades.map(reconstructRelease),
    },
  }
}

/**
 * release apply
 *
 * Execute the release plan. Requires plan file from 'release plan'.
 */
const args = await Oak.Command.create()
  .description('Execute the release plan')
  .parameter(
    'yes y',
    Schema.transform(
      Schema.UndefinedOr(Schema.Boolean),
      Schema.Boolean,
      {
        strict: true,
        decode: (v) => v ?? false,
        encode: (v) => v,
      },
    ).pipe(
      Schema.annotations({ description: 'Skip confirmation prompt (for CI)', default: false }),
    ),
  )
  .parameter(
    'dry-run d',
    Schema.transform(
      Schema.UndefinedOr(Schema.Boolean),
      Schema.Boolean,
      {
        strict: true,
        decode: (v) => v ?? false,
        encode: (v) => v,
      },
    ).pipe(
      Schema.annotations({ description: 'Preview actions without executing', default: false }),
    ),
  )
  .parameter(
    'tag t',
    Schema.UndefinedOr(Schema.String).pipe(
      Schema.annotations({ description: 'npm dist-tag (default: latest)' }),
    ),
  )
  .parse()

const program = Effect.gen(function*() {
  const env = yield* Env.Env
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path

  // Load plan file
  const planPath = path.join(process.cwd(), PLAN_DIR, PLAN_FILE)
  const planExists = yield* fs.exists(planPath)

  if (!planExists) {
    console.error(`No release plan found at ${PLAN_DIR}/${PLAN_FILE}`)
    console.error(`Run 'release plan <type>' first to generate a plan.`)
    return env.exit(1)
  }

  // Load config and discover packages
  const _config = yield* load(process.cwd()).pipe(Effect.orElseSucceed(() => undefined))
  const packages = yield* discover

  // Deserialize plan
  const planJson = yield* fs.readFileString(planPath)
  const { type, plan } = deserializePlan(planJson, packages)

  const totalReleases = plan.releases.length + plan.cascades.length

  console.log(`Applying ${type} release plan...`)
  console.log(`${totalReleases} package${totalReleases === 1 ? '' : 's'} to release`)
  console.log()

  // Confirmation prompt (unless --yes)
  if (!args.yes && !args.dryRun) {
    console.log('Releases:')
    for (const r of plan.releases) {
      console.log(`  ${r.package.name}@${getNextVersion(r).version}`)
    }
    for (const r of plan.cascades) {
      console.log(`  ${r.package.name}@${getNextVersion(r).version} (cascade)`)
    }
    console.log()
    console.log('This will:')
    console.log('  1. Run preflight checks')
    console.log('  2. Publish all packages to npm')
    console.log('  3. Create git tags')
    console.log('  4. Push tags to remote')
    console.log()
    console.log('Use --yes to skip this prompt.')
    return
  }

  if (args.dryRun) {
    console.log('[DRY RUN] Would execute:')
    for (const r of [...plan.releases, ...plan.cascades]) {
      console.log(`  - Publish ${r.package.name}@${getNextVersion(r).version}`)
    }
    console.log(`  - Create ${totalReleases} git tag${totalReleases === 1 ? '' : 's'}`)
    console.log(`  - Push tags to origin`)
    return
  }

  // Execute with observable workflow
  const { events, execute } = yield* executeWorkflowObservable(plan, {
    dryRun: args.dryRun,
    ...(args.tag && { tag: args.tag }),
  })

  // Fork event consumer to stream status updates
  const eventFiber = yield* events.pipe(
    Stream.tap((event) =>
      Effect.sync(() => {
        switch (event._tag) {
          case 'ActivityStarted':
            console.log(`  Starting: ${event.activity}`)
            break
          case 'ActivityCompleted':
            console.log(`✓ Completed: ${event.activity}`)
            break
          case 'ActivityFailed':
            console.error(`✗ Failed: ${event.activity} - ${event.error}`)
            break
        }
      })
    ),
    Stream.runDrain,
    Effect.fork,
  )

  // Run workflow
  const result = yield* execute

  // Wait for events to flush
  yield* Fiber.join(eventFiber)

  console.log()
  console.log(
    `Done. ${result.releasedPackages.length} package${result.releasedPackages.length === 1 ? '' : 's'} released.`,
  )

  // Clean up plan file on success
  yield* fs.remove(planPath)
})

const layer = Layer.mergeAll(
  Env.Live,
  NodeFileSystem.layer,
  NodePath.layer,
  Git.GitLive,
)

Effect.runPromise(Effect.provide(program, layer)).catch((error) => {
  console.error('Error:', error.message ?? error)
  process.exit(1)
})
