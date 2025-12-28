import { NodeFileSystem } from '@effect/platform-node'
import { Str } from '@kitz/core'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Effect, Layer, Option, Schema } from 'effect'
import { Cascade, Config, Plan, Workspace } from '../__.js'

/**
 * Format a planned release for display.
 */
const formatRelease = (release: Plan.PlannedRelease): string => {
  const { package: pkg, currentVersion, nextVersion, bump, commits } = release
  const current = currentVersion.pipe(Option.map((v) => v.version), Option.getOrElse(() => '(none)'))
  const next = nextVersion.version
  const commitCount = commits.length

  return [
    `${pkg.name} (${current} → ${next}) [${bump}]`,
    `  ${commitCount} commit${commitCount === 1 ? '' : 's'}`,
  ].join(Str.Char.newline)
}

/**
 * Format cascade info for a package.
 */
const formatCascade = (
  pkg: string,
  dependents: readonly Plan.PlannedRelease[],
): string => {
  if (dependents.length === 0) {
    return `${pkg}: No cascades needed`
  }

  const lines = [`${pkg}:`]
  for (const dep of dependents) {
    const ver = dep.currentVersion.pipe(Option.map((v) => v.version), Option.getOrElse(() => '0.0.0'))
    lines.push(`  ├── ${dep.package.name} depends (workspace:* → ^${ver})`)
  }
  return lines.join(Str.Char.newline)
}

/**
 * release status [pkg...]
 *
 * Show unreleased changes. If packages specified, also shows cascade analysis.
 */
const args = await Oak.Command.create()
  .description('Show unreleased changes and cascade analysis')
  .parameter(
    'packages',
    Schema.UndefinedOr(Schema.Array(Schema.String)).pipe(
      Schema.annotations({ description: 'Specific packages to analyze cascades for' }),
    ),
  )
  .parse()

const program = Effect.gen(function*() {
  const env = yield* Env.Env

  // Load config and discover packages
  const config = yield* Config.load(process.cwd()).pipe(Effect.orElseSucceed(() => undefined))
  const packages = yield* Workspace.discover

  if (packages.length === 0) {
    console.log('No packages found.')
    return
  }

  // Plan what would be released
  const plan = yield* Plan.stable({ packages })

  if (plan.releases.length === 0) {
    console.log('No unreleased changes.')
    return
  }

  // Display all pending releases
  console.log('Unreleased changes:\n')
  for (const release of plan.releases) {
    console.log(formatRelease(release))
    console.log()
  }

  // If specific packages requested, show cascade analysis
  if (args.packages && args.packages.length > 0) {
    const tags = yield* Git.Git.pipe(Effect.flatMap((git) => git.getTags()))
    const dependencyGraph = yield* Cascade.buildDependencyGraph(packages)

    console.log('\nCascade analysis:\n')
    for (const pkgName of args.packages) {
      const pkg = packages.find((p) => p.name === pkgName || p.scope === pkgName)
      if (!pkg) {
        console.log(`${pkgName}: Not found`)
        continue
      }

      // Find releases for this package
      const pkgReleases = plan.releases.filter((r) => r.package.name === pkg.name)
      const cascades = Cascade.detect(packages, pkgReleases, dependencyGraph, tags)
      console.log(formatCascade(pkg.name, cascades))
    }
  }
})

const layer = Layer.mergeAll(Env.Live, NodeFileSystem.layer, Git.GitLive)

Effect.runPromise(Effect.provide(program, layer)).catch((error) => {
  console.error('Error:', error.message ?? error)
  process.exit(1)
})
