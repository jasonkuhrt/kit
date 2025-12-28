import { NodeFileSystem } from '@effect/platform-node'
import { Changelog } from '@kitz/changelog'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Oak } from '@kitz/oak'
import { Effect, Layer, Option, Schema } from 'effect'
import { load } from '../config.js'
import { discover, type Package } from '../discovery.js'
import { extractImpacts, findLatestTagVersion } from '../version.js'

/**
 * release log [pkg]
 *
 * Output changelog for package(s).
 */
const args = await Oak.Command.create()
  .description('Output changelog for package(s)')
  .parameter(
    'pkg p',
    Schema.UndefinedOr(Schema.String).pipe(
      Schema.annotations({ description: 'Specific package to show changelog for' }),
    ),
  )
  .parameter(
    'format f',
    Schema.transform(
      Schema.UndefinedOr(Schema.Literal('md', 'json')),
      Schema.Literal('md', 'json'),
      {
        strict: true,
        decode: (v) => v ?? 'md',
        encode: (v) => v,
      },
    ).pipe(
      Schema.annotations({ description: 'Output format (md or json)', default: 'md' }),
    ),
  )
  .parameter(
    'since s',
    Schema.UndefinedOr(Schema.String).pipe(
      Schema.annotations({ description: 'Changes since specific tag' }),
    ),
  )
  .parse()

/**
 * Generate changelog for a package.
 */
const generatePackageChangelog = (
  pkg: Package,
  tags: string[],
  commits: Array<{ hash: string; message: string }>,
) =>
  Effect.gen(function*() {
    // Find current version
    const currentVersion = findLatestTagVersion(pkg.name, tags)

    // Extract impacts for this package
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts({ hash: c.hash, message: c.message })),
      { concurrency: 'unbounded' },
    )

    // Filter to this package's commits
    const packageImpacts = allImpacts.flat().filter((i) => i.scope === pkg.scope)

    if (packageImpacts.length === 0) {
      return null
    }

    // Calculate next version (for display)
    const nextVersion = Option.isSome(currentVersion)
      ? `${currentVersion.value.version.toString()}+unreleased`
      : '0.0.1'

    // Build commits array for changelog
    const changelogCommits = packageImpacts.map((i) => ({
      type: i.commit.type,
      message: i.commit.message,
      hash: i.commit.hash,
      breaking: i.commit.breaking,
    }))

    // Generate changelog - use ternary to get proper type inference
    const changelog = yield* Changelog.generate(
      Option.isSome(currentVersion)
        ? {
          scope: pkg.name,
          commits: changelogCommits,
          previousVersion: currentVersion.value.version.toString(),
          newVersion: nextVersion,
        }
        : { scope: pkg.name, commits: changelogCommits, newVersion: nextVersion },
    )

    return {
      package: pkg.name,
      version: nextVersion,
      changelog,
    }
  })

const program = Effect.gen(function*() {
  const git = yield* Git.Git

  // Load config and discover packages
  const _config = yield* load(process.cwd()).pipe(Effect.orElseSucceed(() => undefined))
  const packages = yield* discover

  if (packages.length === 0) {
    console.log('No packages found.')
    return
  }

  // Filter to specific package if requested
  const targetPackages = args.pkg
    ? packages.filter((p) => p.name === args.pkg || p.scope === args.pkg)
    : packages

  if (targetPackages.length === 0) {
    console.log(`Package '${args.pkg}' not found.`)
    return
  }

  // Get all tags and commits
  const tags = yield* git.getTags()

  // Determine the base tag for fetching commits
  let sinceTag: string | undefined = args.since

  if (!sinceTag && targetPackages.length === 1) {
    // For single package, use its latest tag
    const latest = findLatestTagVersion(targetPackages[0]!.name, tags)
    if (Option.isSome(latest)) {
      sinceTag = `${targetPackages[0]!.name}@${latest.value.version}`
    }
  }

  const commits = yield* git.getCommitsSince(sinceTag)

  // Generate changelogs
  const results = yield* Effect.all(
    targetPackages.map((pkg) =>
      generatePackageChangelog(pkg, tags, commits.map((c) => ({ hash: c.hash, message: c.message })))
    ),
    { concurrency: 'unbounded' },
  )

  const changelogs = results.filter((r): r is NonNullable<typeof r> => r !== null)

  if (changelogs.length === 0) {
    console.log('No unreleased changes found.')
    return
  }

  // Output based on format
  if (args.format === 'json') {
    console.log(JSON.stringify(changelogs, null, 2))
  } else {
    for (const result of changelogs) {
      console.log(result.changelog.markdown)
    }
  }
})

const layer = Layer.mergeAll(Env.Live, NodeFileSystem.layer, Git.GitLive)

Effect.runPromise(Effect.provide(program, layer)).catch((error) => {
  console.error('Error:', error.message ?? error)
  process.exit(1)
})
