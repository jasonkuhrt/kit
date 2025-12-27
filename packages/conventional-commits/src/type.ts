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
