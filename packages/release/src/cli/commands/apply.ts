import { NodeFileSystem } from '@effect/platform-node'
import { Cli } from '@kitz/cli'
import { Str } from '@kitz/core'
import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Console, Effect, Fiber, Layer, Match, Option, Schema, Stream } from 'effect'
import * as Api from '../../api/__.js'

/**
 * release apply
 *
 * Execute the release plan. Requires plan file from 'release plan'.
 */
const args = Oak.Command.create()
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

Cli.run(Layer.mergeAll(Env.Live, NodeFileSystem.layer, Git.GitLive))(
  Effect.gen(function*() {
    const env = yield* Env.Env

    // Load plan file using schema-validated resource
    const planDir = Fs.Path.join(env.cwd, Api.Plan.PLAN_DIR)
    const planFileOption = yield* Api.Plan.resource.read(planDir)

    if (Option.isNone(planFileOption)) {
      const b = Str.Builder()
      b`No release plan found at ${Fs.Path.toString(Api.Plan.PLAN_FILE)}`
      b`Run 'release plan <type>' first to generate a plan.`
      yield* Console.error(b.render())
      return env.exit(1)
    }

    // Load config (scanning packages is no longer needed - plan has full PlannedRelease data)
    const _config = yield* Api.Config.load()

    // Plan file now stores rich PlannedRelease data directly - no conversion needed
    const plan = planFileOption.value
    const { type, releases, cascades } = plan

    const totalReleases = releases.length + cascades.length

    // Confirmation prompt (unless --yes)
    if (!args.yes && !args.dryRun) {
      const b = Str.Builder()
      b`Applying ${type} release plan...`
      b`${String(totalReleases)} package${totalReleases === 1 ? '' : 's'} to release`
      b``
      b`Releases:`
      for (const r of plan.releases) {
        b`  ${r.package.name.moniker}@${r.nextVersion.version.toString()}`
      }
      for (const r of plan.cascades) {
        b`  ${r.package.name.moniker}@${r.nextVersion.version.toString()} (cascade)`
      }
      b``
      b`This will:`
      b`  1. Run preflight checks`
      b`  2. Publish all packages to npm`
      b`  3. Create git tags`
      b`  4. Push tags to remote`
      b``
      b`Use --yes to skip this prompt.`
      yield* Console.log(b.render())
      return
    }

    if (args.dryRun) {
      const b = Str.Builder()
      b`[DRY RUN] Would execute:`
      for (const r of [...plan.releases, ...plan.cascades]) {
        b`  - Publish ${r.package.name.moniker}@${r.nextVersion.version.toString()}`
      }
      b`  - Create ${String(totalReleases)} git tag${totalReleases === 1 ? '' : 's'}`
      b`  - Push tags to origin`
      yield* Console.log(b.render())
      return
    }

    // Execute with observable workflow
    const { events, execute } = yield* Api.Workflow.executeWorkflowObservable(plan, {
      dryRun: args.dryRun,
      ...(args.tag && { tag: args.tag }),
    })

    // Fork event consumer to stream status updates
    const eventFiber = yield* events.pipe(
      Stream.tap((event) =>
        Match.value(event).pipe(
          Match.tags({
            ActivityStarted: (e) => Console.log(`  Starting: ${e.activity}`),
            ActivityCompleted: (e) => Console.log(`✓ Completed: ${e.activity}`),
            ActivityFailed: (e) => Console.error(`✗ Failed: ${e.activity} - ${e.error}`),
          }),
          Match.orElse(() => Effect.void),
        )
      ),
      Stream.runDrain,
      Effect.fork,
    )

    // Run workflow
    const result = yield* execute

    // Wait for events to flush
    yield* Fiber.join(eventFiber)

    const done = Str.Builder()
    done``
    done`Done. ${String(result.releasedPackages.length)} package${
      result.releasedPackages.length === 1 ? '' : 's'
    } released.`
    yield* Console.log(done.render())

    // Clean up plan file on success
    const planPath = Fs.Path.join(env.cwd, Api.Plan.PLAN_FILE)
    yield* Fs.remove(planPath)
  }),
)
