import { Schema } from 'effect'

// ─── Impact ─────────────────────────────────────────────────────

/**
 * Semantic version impact levels.
 * Note: `major` comes from breaking change flags, not from the type itself.
 */
export const ImpactValues = {
  none: 'none',
  patch: 'patch',
  minor: 'minor',
} as const

export const Impact = Schema.Enums(ImpactValues)
export type Impact = typeof Impact.Type

// ─── Standard Value ─────────────────────────────────────────────

/**
 * The 11 standard conventional commit types (Angular convention).
 */
export const StandardValues = {
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
} as const

export const StandardValue = Schema.Enums(StandardValues)
export type StandardValue = typeof StandardValue.Type

// ─── Standard Impact Mapping ────────────────────────────────────

/**
 * Static impact mapping for standard types.
 */
export const StandardImpact: Record<StandardValue, Impact> = {
  feat: 'minor',
  fix: 'patch',
  docs: 'patch',
  perf: 'patch',
  style: 'none',
  refactor: 'none',
  test: 'none',
  build: 'none',
  ci: 'none',
  chore: 'none',
  revert: 'none',
}

// ─── Standard Type ──────────────────────────────────────────────

/**
 * A known conventional commit type.
 */
export class Standard extends Schema.TaggedClass<Standard>()('Standard', {
  value: StandardValue,
}) {}

// ─── Custom Type ────────────────────────────────────────────────

/**
 * A custom/unknown commit type.
 */
export class Custom extends Schema.TaggedClass<Custom>()('Custom', {
  value: Schema.String,
}) {}

// ─── Type Union ─────────────────────────────────────────────────

/**
 * Commit type: either a standard type or a custom extension.
 */
export const Type = Schema.Union(Standard, Custom)
export type Type = typeof Type.Type

// ─── Type Guards ────────────────────────────────────────────────

/**
 * Check if a Type is a standard type.
 */
export const isStandard = (type: Type): type is Standard => type._tag === 'Standard'

/**
 * Check if a Type is a custom type.
 */
export const isCustom = (type: Type): type is Custom => type._tag === 'Custom'

// ─── Accessors ──────────────────────────────────────────────────

/**
 * Extract the raw string value from any Type.
 */
export const value = (type: Type): string => type.value

/**
 * Get impact for a Standard type.
 * For Custom types, use release config lookup instead.
 */
export const impact = (type: Standard): Impact => StandardImpact[type.value]
