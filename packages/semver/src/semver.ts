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

/**
 * Schema alias for Effect S.Class usage.
 *
 * Note: This is a transform schema, which has limitations when used inside
 * S.Class (no `fields` property). May need refactoring to a proper Struct.
 */
export const SemverSchema = Semver

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
 * Version bump type for stable releases.
 */
export const BumpType = S.Enums({
  major: 'major',
  minor: 'minor',
  patch: 'patch',
} as const)
export type BumpType = typeof BumpType.Type

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

// ============================================================================
// Phase Detection
// ============================================================================

/**
 * Check if version is in initial development phase (0.x.x).
 *
 * During initial development, breaking changes are expected and
 * bump minor instead of major. See {@link mapBumpForPhase}.
 */
export const isPhaseInitial = (version: Semver): boolean => version.major === 0

/**
 * Check if version has public API guarantee (1.x.x+).
 *
 * Public API versions follow standard semver semantics where
 * breaking changes bump major.
 */
export const isPhasePublic = (version: Semver): boolean => version.major >= 1

/**
 * Map a bump type to the appropriate increment for the version's phase.
 *
 * - Initial phase (0.x.x): major/minor → minor, patch → patch
 * - Public phase (1.x.x+): standard semver semantics
 */
export const mapBumpForPhase = (
  version: Semver,
  bump: BumpType,
): BumpType => {
  if (isPhasePublic(version)) {
    return bump // Standard semantics
  }
  // Initial phase: breaking/features → minor, fixes → patch
  return bump === 'patch' ? 'patch' : 'minor'
}
