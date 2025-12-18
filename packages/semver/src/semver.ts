import { Range as VltRange, Version as VltVersion } from '@vltpkg/semver'
import { Schema as S } from 'effect'
import { Equivalence, Order, ParseResult } from 'effect'
import { OfficialRelease } from './official-release.js'
import { PreRelease } from './pre-release.js'

// ============================================================================
// Schema
// ============================================================================

const Encoded = S.String

const Decoded = S.Union(OfficialRelease, PreRelease).annotations({
  identifier: 'Semver',
  title: 'Semantic Version',
  description: 'A semantic version following SemVer specification',
})

/**
 * Schema for semantic version strings using @vltpkg/semver for validation
 */
export const Semver = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    decode: (value, _, ast) => {
      try {
        const version = VltVersion.parse(value)
        const base = {
          major: version.major,
          minor: version.minor,
          patch: version.patch,
          build: version.build && version.build.length > 0 ? version.build : undefined,
          version,
        }

        if (version.prerelease && version.prerelease.length > 0) {
          return ParseResult.succeed({
            _tag: 'SemverPreRelease' as const,
            ...base,
            prerelease: version.prerelease as [string | number, ...(string | number)[]],
          })
        } else {
          return ParseResult.succeed({
            _tag: 'SemverOfficialRelease' as const,
            ...base,
          })
        }
      } catch (error) {
        return ParseResult.fail(
          new ParseResult.Type(ast, value, `Invalid semver: ${error}`),
        )
      }
    },
    encode: (semver) => ParseResult.succeed(semver.version.toString()),
  },
)

// ============================================================================
// Type
// ============================================================================

export type Semver = typeof Semver.Type

// ============================================================================
// Constructors
// ============================================================================

// Note: No make constructor for transform schemas - use fromString or fromParts instead

// ============================================================================
// Ordering
// ============================================================================

export const order: Order.Order<Semver> = Order.make((a, b) => a.version.compare(b.version))

export const min = Order.min(order)

export const max = Order.max(order)

export const lessThan = Order.lessThan(order)

export const greaterThan = Order.greaterThan(order)

// ============================================================================
// Equivalence
// ============================================================================

export const equivalence: Equivalence.Equivalence<Semver> = Equivalence.make((a, b) =>
  a.version.compare(b.version) === 0
)

// ============================================================================
// Type Guard
// ============================================================================

export const is = S.is(Semver)

// ============================================================================
// Importers
// ============================================================================

export const fromString = (value: string): Semver => S.decodeSync(Semver)(value)

/**
 * Create semver from individual parts
 */
export const make = (
  major: number,
  minor: number = 0,
  patch: number = 0,
  prerelease?: string,
  build?: string,
): Semver => {
  const prereleaseStr = prerelease ? `-${prerelease}` : ''
  const buildStr = build ? `+${build}` : ''
  const version = `${major}.${minor}.${patch}${prereleaseStr}${buildStr}`
  return fromString(version)
}

// ============================================================================
// Domain Logic
// ============================================================================

/**
 * Get the prerelease identifiers (only available on pre-release versions)
 */
export const getPrerelease = (version: Semver): ReadonlyArray<string | number> | undefined =>
  version._tag === 'SemverPreRelease' ? version.prerelease : undefined

/**
 * Increment a version
 */
export const increment = (
  version: Semver,
  release: 'major' | 'minor' | 'patch' | 'premajor' | 'preminor' | 'prepatch' | 'prerelease',
  identifier?: string,
): Semver => {
  // Create a copy since inc modifies in place
  const copy = VltVersion.parse(version.version.toString())
  const incremented = copy.inc(release, identifier)
  return fromString(incremented.toString())
}

/**
 * Check if version satisfies a range
 *
 * @throws {Error} If the range string is invalid
 */
export const satisfies = (version: Semver, range: string): boolean => {
  const vltRange = new VltRange(range)
  return version.version.satisfies(vltRange)
}

/**
 * Pattern match on Semver variants
 */
export const match = <$A>(
  onOfficialRelease: (release: OfficialRelease) => $A,
  onPreRelease: (preRelease: PreRelease) => $A,
) =>
(semver: Semver): $A => semver._tag === 'SemverOfficialRelease' ? onOfficialRelease(semver) : onPreRelease(semver)
