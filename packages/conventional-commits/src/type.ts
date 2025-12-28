import { Semver } from '@kitz/semver'
import { Option, Schema } from 'effect'

/**
 * Re-export BumpType from @kitz/semver for convenience.
 */
export type BumpType = Semver.BumpType

// ─── Standard Value ─────────────────────────────────────────────

/**
 * The 11 standard conventional commit types (Angular convention).
 */
export const StandardValue = Schema.Enums({
  feat: 'feat',
  fix: 'fix',
  docs: 'docs',
  style: 'style',
  refactor: 'refactor',
  perf: 'perf',
  test: 'test',
  build: 'build',
  ci: 'ci',
  chore: 'chore',
  revert: 'revert',
})
export type StandardValue = typeof StandardValue.Type

// ─── Standard Impact Mapping ────────────────────────────────────

/**
 * Static impact mapping for standard types.
 *
 * Returns `Option.none()` for types that don't trigger a release (style, refactor, etc.)
 */
export const StandardImpact: Record<StandardValue, Option.Option<BumpType>> = {
  feat: Option.some('minor'),
  fix: Option.some('patch'),
  docs: Option.some('patch'),
  perf: Option.some('patch'),
  style: Option.none(),
  refactor: Option.none(),
  test: Option.none(),
  build: Option.none(),
  ci: Option.none(),
  chore: Option.none(),
  revert: Option.none(),
}

// ─── Standard Type ──────────────────────────────────────────────

/**
 * A known conventional commit type.
 */
export class Standard extends Schema.TaggedClass<Standard>()('Standard', {
  value: StandardValue,
}) {
  static is = Schema.is(Standard)
}

// ─── Custom Type ────────────────────────────────────────────────

/**
 * A custom/unknown commit type.
 */
export class Custom extends Schema.TaggedClass<Custom>()('Custom', {
  value: Schema.String,
}) {
  static is = Schema.is(Custom)
}

// ─── Type Union ─────────────────────────────────────────────────

/**
 * Commit type: either a standard type or a custom extension.
 */
export const Type = Schema.Union(Standard, Custom)
export type Type = typeof Type.Type

// ─── Accessors ──────────────────────────────────────────────────

/**
 * Extract the raw string value from any Type.
 */
export const value = (type: Type): string => type.value

/**
 * Get impact for a Standard type.
 *
 * Returns `Option.some(BumpType)` for types that trigger a release,
 * or `Option.none()` for types that don't (style, refactor, etc.)
 *
 * For Custom types, use release config lookup instead.
 */
export const impact = (type: Standard): Option.Option<BumpType> => StandardImpact[type.value]!

// ─── Smart Constructor ──────────────────────────────────────────

/**
 * Type-level narrowing: returns Standard for known types, Custom otherwise.
 */
type From<$value extends string> = $value extends StandardValue ? Standard : Custom

/**
 * Create a Type from a raw string.
 * Known types become Standard, unknown become Custom.
 * Return type narrows based on input literal.
 */
export const from = <$value extends string>(value: $value): From<$value> => {
  if (value in StandardValue.enums) {
    return new Standard({ value: value as StandardValue }) as From<$value>
  }
  return new Custom({ value }) as From<$value>
}
