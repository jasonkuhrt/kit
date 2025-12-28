import { ConventionalCommits } from '@kitz/conventional-commits'
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Effect, Either, Option, Schema as S } from 'effect'
import {
  encodePreviewPrerelease,
  encodePrPrerelease,
  makePreviewPrerelease,
  makePrPrerelease,
  PreviewPrereleaseSchema,
  PrPrereleaseSchema,
} from './prerelease.js'

/**
 * Version bump type (re-exported from @kitz/semver).
 */
export type BumpType = Semver.BumpType

/**
 * Structured commit information for changelog generation.
 */
export interface StructuredCommit {
  readonly type: string
  readonly message: string
  readonly hash: Git.Sha.Sha
  readonly breaking: boolean
}

/**
 * Information about a commit's effect on a package.
 */
export interface CommitImpact {
  readonly scope: string
  readonly bump: BumpType
  readonly commit: StructuredCommit
}

/**
 * Reduce multiple bump types to the highest one.
 */
export const maxBump = (a: BumpType, b: BumpType): BumpType => {
  const priority: Record<BumpType, number> = { major: 3, minor: 2, patch: 1 }
  return priority[a]! >= priority[b]! ? a : b
}

/**
 * Input for extracting commit impacts.
 */
export interface CommitInput {
  readonly hash: Git.Sha.Sha
  readonly message: string
}

/**
 * Extract package impacts from a commit.
 *
 * Parses the commit title and returns which packages are affected
 * and what bump type each needs. Preserves structured commit info
 * for changelog generation.
 */
export const extractImpacts = (
  commitInput: CommitInput,
): Effect.Effect<CommitImpact[], never> =>
  Effect.gen(function*() {
    // Parse the commit title (first line)
    const title = commitInput.message.split('\n')[0] ?? commitInput.message
    const parsed = yield* Effect.either(ConventionalCommits.parseTitle(title))

    if (Either.isLeft(parsed)) {
      // Not a conventional commit - no impacts
      return []
    }

    const parsedCommit = parsed.right
    const impacts: CommitImpact[] = []

    // Get bump from CC type, returns null for no-impact types
    const getBump = (type: ConventionalCommits.Type.Type, breaking: boolean): BumpType | null => {
      if (breaking) return 'major'
      if (!ConventionalCommits.Type.Standard.is(type)) return 'patch'
      return Option.getOrNull(ConventionalCommits.Type.impact(type))
    }

    if (ConventionalCommits.CommitSingle.is(parsedCommit)) {
      if (parsedCommit.scopes.length === 0) return [] // Scopeless - handled by caller

      const bump = getBump(parsedCommit.type, parsedCommit.breaking)
      if (bump === null) return []

      for (const scope of parsedCommit.scopes) {
        impacts.push({
          scope,
          bump,
          commit: {
            type: parsedCommit.type.value,
            message: parsedCommit.message,
            hash: commitInput.hash,
            breaking: parsedCommit.breaking,
          },
        })
      }
    } else if (ConventionalCommits.CommitMulti.is(parsedCommit)) {
      for (const target of parsedCommit.targets) {
        const bump = getBump(target.type, target.breaking)
        if (bump === null) continue

        impacts.push({
          scope: target.scope,
          bump,
          commit: {
            type: target.type.value,
            message: parsedCommit.message,
            hash: commitInput.hash,
            breaking: target.breaking,
          },
        })
      }
    }

    return impacts
  })

/**
 * Aggregate impacts by package, keeping the highest bump for each.
 */
export const aggregateByPackage = (
  impacts: CommitImpact[],
): Map<string, { bump: BumpType; commits: StructuredCommit[] }> => {
  const result = new Map<string, { bump: BumpType; commits: StructuredCommit[] }>()

  for (const impact of impacts) {
    const existing = result.get(impact.scope)
    if (existing) {
      result.set(impact.scope, {
        bump: maxBump(existing.bump, impact.bump),
        commits: [...existing.commits, impact.commit],
      })
    } else {
      result.set(impact.scope, {
        bump: impact.bump,
        commits: [impact.commit],
      })
    }
  }

  return result
}

/**
 * Calculate the next version given a current version and bump type.
 *
 * Applies phase-aware bump mapping:
 * - Initial phase (0.x.x): major/minor → minor, patch → patch
 * - Public phase (1.x.x+): standard semver semantics
 */
export const calculateNextVersion = (
  current: Option.Option<Semver.Semver>,
  bump: BumpType,
): Semver.Semver =>
  Option.match(current, {
    onNone: () => {
      // First release - ALWAYS start in initial phase (0.x.x)
      switch (bump) {
        case 'major':
        case 'minor':
          return Semver.make(0, 1, 0)
        case 'patch':
          return Semver.make(0, 0, 1)
      }
    },
    onSome: (version) => {
      // Apply phase-aware bump mapping
      const effectiveBump = Semver.mapBumpForPhase(version, bump)
      return Semver.increment(version, effectiveBump)
    },
  })

/**
 * Graduate from initial phase to public phase (1.0.0).
 *
 * This is a one-way operation that declares "the API is now stable".
 * Should only be called explicitly, never automatically from commits.
 */
export const graduatePhase = (): Semver.Semver => Semver.make(1, 0, 0)

/**
 * Find the latest version for a package from git tags.
 *
 * Tags follow the pattern: @scope/package@version or package@version
 */
export const findLatestTagVersion = (
  packageName: string,
  tags: string[],
): Option.Option<Semver.Semver> => {
  // Match tags like @kitz/core@1.0.0 or kitz@1.0.0
  const prefix = `${packageName}@`
  const versions: Semver.Semver[] = []

  for (const tag of tags) {
    if (tag.startsWith(prefix)) {
      const versionPart = tag.slice(prefix.length)
      try {
        versions.push(Semver.fromString(versionPart))
      } catch {
        // Skip invalid version tags
      }
    }
  }

  if (versions.length === 0) return Option.none()

  // Sort and get the highest version
  versions.sort((a, b) => -Semver.order(a, b)) // Descending
  return Option.some(versions[0]!)
}

/**
 * Find the highest preview release number for a package.
 *
 * Preview versions follow the pattern: `${base}-next.${n}`
 * Returns the highest `n` found, or 0 if no preview releases exist.
 */
export const findLatestPreviewNumber = (
  packageName: string,
  baseVersion: Semver.Semver,
  tags: string[],
): number => {
  const prefix = `${packageName}@${baseVersion.version}-`
  let highest = 0

  for (const tag of tags) {
    if (tag.startsWith(prefix)) {
      const prereleasePart = tag.slice(prefix.length)
      const decoded = S.decodeUnknownOption(PreviewPrereleaseSchema)(prereleasePart)
      if (Option.isSome(decoded) && decoded.value.iteration > highest) {
        highest = decoded.value.iteration
      }
    }
  }

  return highest
}

/**
 * Calculate the next preview version.
 *
 * Format: `${nextStableVersion}-next.${n}`
 */
export const calculatePreviewVersion = (
  nextStableVersion: Semver.Semver,
  existingPreviewNumber: number,
): Semver.Semver => {
  const prerelease = makePreviewPrerelease(existingPreviewNumber + 1)
  return Semver.fromString(`${nextStableVersion.version}-${encodePreviewPrerelease(prerelease)}`)
}

/**
 * Find the highest PR release number for a package and PR.
 *
 * PR versions follow the pattern: `0.0.0-pr.${prNum}.${n}.${sha}`
 * Returns the highest `n` found, or 0 if no PR releases exist.
 */
export const findLatestPrNumber = (
  packageName: string,
  prNumber: number,
  tags: string[],
): number => {
  const prefix = `${packageName}@0.0.0-`
  let highest = 0

  for (const tag of tags) {
    if (tag.startsWith(prefix)) {
      const prereleasePart = tag.slice(prefix.length)
      const decoded = S.decodeUnknownOption(PrPrereleaseSchema)(prereleasePart)
      if (Option.isSome(decoded) && decoded.value.prNumber === prNumber && decoded.value.iteration > highest) {
        highest = decoded.value.iteration
      }
    }
  }

  return highest
}

/**
 * Calculate the next PR version.
 *
 * Format: `0.0.0-pr.${prNumber}.${n}.${sha}`
 */
export const calculatePrVersion = (
  prNumber: number,
  existingPrNumber: number,
  sha: Git.Sha.Sha,
): Semver.Semver => {
  const prerelease = makePrPrerelease(prNumber, existingPrNumber + 1, sha)
  return Semver.fromString(`0.0.0-${encodePrPrerelease(prerelease)}`)
}
