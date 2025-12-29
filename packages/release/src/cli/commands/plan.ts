import { FileSystem, Path } from '@effect/platform'
import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Str } from '@kitz/core'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Effect, Layer, Option, Schema } from 'effect'
import * as Api from '../../api/__.js'

const PLAN_DIR = '.release'
const PLAN_FILE = 'plan.json'

/**
 * Format a planned release for display.
 */
const formatRelease = (release: Api.Plan.PlannedRelease, prefix: string = ''): string => {
  const currentVersion = Api.Plan.getCurrentVersion(release)
  const nextVersion = Api.Plan.getNextVersion(release)
  const bump = Api.Plan.getBumpType(release)
  const current = currentVersion.pipe(Option.map((v) => v.version), Option.getOrElse(() => '(none)'))
  const next = nextVersion.version
  const commitCount = release.commits.length

  return [
    `${prefix}${release.package.name}`,
    `${prefix}  ${current} → ${next} (${bump ?? 'cascade'})`,
    `${prefix}  ${commitCount} commit${commitCount === 1 ? '' : 's'}`,
  ].join(Str.Char.newline)
}

/**
 * Serialize plan to JSON for storage.
 */
const serializePlan = (plan: Api.Plan.ReleasePlan, type: string): string => {
  const serializeRelease = (r: Api.Plan.PlannedRelease) => ({
    package: r.package.name,
    path: r.package.path,
    currentVersion: Api.Plan.getCurrentVersion(r).pipe(Option.map((v) => v.version), Option.getOrNull),
    nextVersion: Api.Plan.getNextVersion(r).version,
    bump: Api.Plan.getBumpType(r),
    commits: r.commits.map((c) => ({
      hash: c.hash,
      type: c.type,
      message: c.message,
      breaking: c.breaking,
    })),
  })

  const serialized = {
    type,
    timestamp: new Date().toISOString(),
    releases: plan.releases.map(serializeRelease),
    cascades: plan.cascades.map(serializeRelease),
  }
  return JSON.stringify(serialized, null, 2)
}

/**
 * release plan <type>
 *
 * Generate a release plan. Writes to .release/plan.json.
 *
 * Types:
 * - stable  - Standard semver release
 * - preview - Pre-release to @next tag
 * - pr      - PR preview release
 */
const args = await Oak.Command.create()
  .description('Generate a release plan')
  .parameter(
    'type',
    Schema.Literal('stable', 'preview', 'pr').pipe(
      Schema.annotations({ description: 'Release type: stable, preview, or pr' }),
    ),
  )
  .parameter(
    'pkg p',
    Schema.UndefinedOr(Schema.Array(Schema.String)).pipe(
      Schema.annotations({ description: 'Only include specific package(s)' }),
    ),
  )
  .parameter(
    'exclude x',
    Schema.UndefinedOr(Schema.Array(Schema.String)).pipe(
      Schema.annotations({ description: 'Exclude package(s)' }),
    ),
  )
  .parameter(
    'tag t',
    Schema.UndefinedOr(Schema.String).pipe(
      Schema.annotations({ description: 'Dist-tag for preview (default: next)' }),
    ),
  )
  .parse()

const program = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path

  // Load config and discover packages
  const _config = yield* Api.Config.load(process.cwd()).pipe(Effect.orElseSucceed(() => undefined))
  const packages = yield* Api.Workspace.discover

  if (packages.length === 0) {
    console.log('No packages found.')
    return
  }

  // Build release options
  const options = {
    ...(args.pkg && { packages: args.pkg }),
    ...(args.exclude && { exclude: args.exclude }),
  }

  // Generate plan based on type
  console.log(`Generating ${args.type} release plan...`)
  console.log()

  let plan: Api.Plan.ReleasePlan

  switch (args.type) {
    case 'stable':
      plan = yield* Api.Plan.stable({ packages }, options)
      break
    case 'preview':
      plan = yield* Api.Plan.preview({ packages }, options)
      break
    case 'pr':
      plan = yield* Api.Plan.pr({ packages }, options)
      break
  }

  if (plan.releases.length === 0) {
    console.log('No releases planned - no unreleased changes found.')
    return
  }

  // Display plan
  console.log('Primary releases:')
  for (const release of plan.releases) {
    console.log(formatRelease(release, '  '))
    console.log()
  }

  if (plan.cascades.length > 0) {
    console.log('Cascade releases (dependencies):')
    for (const cascade of plan.cascades) {
      console.log(formatRelease(cascade, '  '))
      console.log()
    }
  }

  // Write plan file
  const planDir = path.join(process.cwd(), PLAN_DIR)
  const planPath = path.join(planDir, PLAN_FILE)

  yield* fs.makeDirectory(planDir, { recursive: true })
  yield* fs.writeFileString(planPath, serializePlan(plan, args.type))

  console.log(`Plan written to ${PLAN_DIR}/${PLAN_FILE}`)
  console.log(`Run 'release apply' to execute.`)
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
