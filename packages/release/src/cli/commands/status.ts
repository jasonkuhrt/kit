import { NodeFileSystem } from '@effect/platform-node'
import { Cli } from '@kitz/cli'
import { Str } from '@kitz/core'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Console, Effect, Layer, Option, Schema } from 'effect'
import * as Api from '../../api/__.js'

/**
 * Format a planned release for display.
 */
const formatRelease = (release: Api.Plan.Item): string => {
  const current = release.currentVersion.pipe(Option.map((v) => v.version), Option.getOrElse(() => '(none)'))
  const next = release.nextVersion.version
  const commitCount = release.commits.length

  return [
    `${release.package.name} (${current} → ${next}) [${release.bumpType ?? 'cascade'}]`,
    `  ${commitCount} commit${commitCount === 1 ? '' : 's'}`,
  ].join(Str.Char.newline)
}

/**
 * Format cascade info for a package.
 */
const formatCascade = (
  pkg: string,
  dependents: readonly Api.Plan.Item[],
): string => {
  if (dependents.length === 0) {
    return `${pkg}: No cascades needed`
  }

  const lines = [`${pkg}:`]
  for (const dep of dependents) {
    const ver = dep.currentVersion.pipe(
      Option.map((v) => v.version),
      Option.getOrElse(() => '0.0.0'),
    )
    lines.push(`  ├── ${dep.package.name} depends (workspace:* → ^${ver})`)
  }
  return lines.join(Str.Char.newline)
}

/**
 * release status [pkg...]
 *
 * Show unreleased changes. If packages specified, also shows cascade analysis.
 */
const args = Oak.Command.create()
  .description('Show unreleased changes and cascade analysis')
  .parameter(
    'packages',
    Schema.UndefinedOr(Schema.Array(Schema.String)).pipe(
      Schema.annotations({ description: 'Specific packages to analyze cascades for' }),
    ),
  )
  .parse()

Cli.run(Layer.mergeAll(Env.Live, NodeFileSystem.layer, Git.GitLive))(
  Effect.gen(function*() {
    const env = yield* Env.Env

    // Load config and scan packages
    const config = yield* Api.Config.load()
    const packages = yield* Api.Workspace.scan

    if (packages.length === 0) {
      yield* Console.log('No packages found.')
      return
    }

    // Plan what would be released
    const plan = yield* Api.Plan.stable({ packages })

    if (plan.releases.length === 0) {
      yield* Console.log('No unreleased changes.')
      return
    }

    // Display all pending releases
    const output = Str.Builder()
    output`Unreleased changes:`
    output``
    for (const release of plan.releases) {
      output(formatRelease(release))
      output``
    }
    yield* Console.log(output.render())

    // If specific packages requested, show cascade analysis
    if (args.packages && args.packages.length > 0) {
      const tags = yield* Git.Git.pipe(Effect.flatMap((git) => git.getTags()))
      const dependencyGraph = yield* Api.Cascade.buildDependencyGraph(packages)

      const cascade = Str.Builder()
      cascade``
      cascade`Cascade analysis:`
      cascade``
      for (const pkgName of args.packages) {
        const pkg = packages.find((p) => p.name.moniker === pkgName || p.scope === pkgName)
        if (!pkg) {
          cascade`${pkgName}: Not found`
          continue
        }

        // Find releases for this package
        const pkgReleases = plan.releases.filter((r) => r.package.name.moniker === pkg.name.moniker)
        const cascades = Api.Cascade.detect(packages, pkgReleases, dependencyGraph, tags)
        cascade(formatCascade(pkg.name.moniker, cascades))
      }
      yield* Console.log(cascade.render())
    }
  }),
)
