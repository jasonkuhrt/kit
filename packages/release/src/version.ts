import { ConventionalCommits } from '@kitz/conventional-commits'
import { Semver } from '@kitz/semver'
import { Effect, Either } from 'effect'

/**
 * Version bump type.
 */
export type BumpType = 'major' | 'minor' | 'patch'

/**
 * Structured commit information for changelog generation.
 */
export interface StructuredCommit {
  readonly type: string
  readonly message: string
  readonly hash: string
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
 * Determine the bump type from a commit type.
 */
export const bumpFromType = (type: string, breaking: boolean): BumpType => {
  if (breaking) return 'major'
  if (type === 'feat') return 'minor'
  return 'patch'
}

/**
 * Reduce multiple bump types to the highest one.
 */
export const maxBump = (a: BumpType, b: BumpType): BumpType => {
  const priority: Record<BumpType, number> = { major: 3, minor: 2, patch: 1 }
  return priority[a] >= priority[b] ? a : b
}

/**
 * Input for extracting commit impacts.
 */
export interface CommitInput {
  readonly hash: string
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

    if (ConventionalCommits.CommitSingle.is(parsedCommit)) {
      const typeValue = parsedCommit.type.value
      const bump = bumpFromType(typeValue, parsedCommit.breaking)

      if (parsedCommit.scopes.length === 0) {
        // Scopeless commit - affects all packages (handled by caller)
        return []
      }

      for (const scope of parsedCommit.scopes) {
        impacts.push({
          scope,
          bump,
          commit: {
            type: typeValue,
            message: parsedCommit.message,
            hash: commitInput.hash,
            breaking: parsedCommit.breaking,
          },
        })
      }
    } else if (ConventionalCommits.CommitMulti.is(parsedCommit)) {
      // MultiTargetCommit has a shared message at the parent level
      for (const target of parsedCommit.targets) {
        const typeValue = target.type.value
        const bump = bumpFromType(typeValue, target.breaking)
        impacts.push({
          scope: target.scope,
          bump,
          commit: {
            type: typeValue,
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
 */
export const calculateNextVersion = (
  current: Semver.Semver | null,
  bump: BumpType,
): Semver.Semver => {
  if (current === null) {
    // First release - start at appropriate version
    switch (bump) {
      case 'major':
        return Semver.make(1, 0, 0)
      case 'minor':
        return Semver.make(0, 1, 0)
      case 'patch':
        return Semver.make(0, 0, 1)
    }
  }

  return Semver.increment(current, bump)
}

/**
 * Find the latest version for a package from git tags.
 *
 * Tags follow the pattern: @scope/package@version or package@version
 */
export const findLatestTagVersion = (
  packageName: string,
  tags: string[],
): Semver.Semver | null => {
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

  if (versions.length === 0) return null

  // Sort and get the highest version
  versions.sort((a, b) => -Semver.order(a, b)) // Descending
  return versions[0]!
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
  const prefix = `${packageName}@${baseVersion.version}-next.`
  let highest = 0

  for (const tag of tags) {
    if (tag.startsWith(prefix)) {
      const numPart = tag.slice(prefix.length)
      const num = parseInt(numPart, 10)
      if (!isNaN(num) && num > highest) {
        highest = num
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
): Semver.Semver => Semver.fromString(`${nextStableVersion.version}-next.${existingPreviewNumber + 1}`)

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
  const prefix = `${packageName}@0.0.0-pr.${prNumber}.`
  let highest = 0

  for (const tag of tags) {
    if (tag.startsWith(prefix)) {
      // Extract the number from: 0.0.0-pr.PR.N.SHA
      const afterPrefix = tag.slice(prefix.length)
      const parts = afterPrefix.split('.')
      if (parts.length >= 1) {
        const num = parseInt(parts[0]!, 10)
        if (!isNaN(num) && num > highest) {
          highest = num
        }
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
  sha: string,
): Semver.Semver => Semver.fromString(`0.0.0-pr.${prNumber}.${existingPrNumber + 1}.${sha}`)
