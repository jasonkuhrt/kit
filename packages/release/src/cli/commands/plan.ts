import { NodeFileSystem } from '@effect/platform-node'
import { Cli } from '@kitz/cli'
import { Str } from '@kitz/core'
import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Console, Effect, Layer, Option, Schema } from 'effect'
import * as Api from '../../api/__.js'

/**
 * Format a planned release for display.
 */
const formatRelease = (release: Api.Plan.Item, prefix: string = ''): string => {
  const current = release.currentVersion.pipe(Option.map((v) => v.version), Option.getOrElse(() => '(none)'))
  const next = release.nextVersion.version
  const commitCount = release.commits.length

  return [
    `${prefix}${release.package.name}`,
    `${prefix}  ${current} → ${next} (${release.bumpType ?? 'cascade'})`,
    `${prefix}  ${commitCount} commit${commitCount === 1 ? '' : 's'}`,
  ].join(Str.Char.newline)
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
const args = Oak.Command.create()
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

Cli.run(Layer.mergeAll(Env.Live, NodeFileSystem.layer, Git.GitLive))(
  Effect.gen(function*() {
    // Load config and scan packages
    const _config = yield* Api.Config.load()
    const packages = yield* Api.Workspace.scan

    if (packages.length === 0) {
      yield* Console.log('No packages found.')
      return
    }

    // Build release options
    const options = {
      ...(args.pkg && { packages: args.pkg }),
      ...(args.exclude && { exclude: args.exclude }),
    }

    // Generate plan based on type
    const header = Str.Builder()
    header`Generating ${args.type} release plan...`
    header``
    yield* Console.log(header.render())

    let plan: Api.Plan.Plan

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
      yield* Console.log('No releases planned - no unreleased changes found.')
      return
    }

    // Display plan
    const s = Str.Builder()
    s`Primary releases:`
    for (const release of plan.releases) {
      s(formatRelease(release, '  '))
      s``
    }

    if (plan.cascades.length > 0) {
      s`Cascade releases (dependencies):`
      for (const cascade of plan.cascades) {
        s(formatRelease(cascade, '  '))
        s``
      }
    }
    yield* Console.log(s.render())

    // Write plan file using resource
    const env = yield* Env.Env
    const planDir = Fs.Path.join(env.cwd, Api.Plan.PLAN_DIR)

    // Ensure directory exists
    yield* Fs.write(planDir, { recursive: true })

    // Write plan using schema-validated resource
    yield* Api.Plan.resource.write(plan, planDir)

    const done = Str.Builder()
    done`Plan written to ${Fs.Path.toString(Api.Plan.PLAN_FILE)}`
    done`Run 'release apply' to execute.`
    yield* Console.log(done.render())
  }),
)
