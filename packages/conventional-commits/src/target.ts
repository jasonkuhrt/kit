import { Schema } from 'effect'

/**
 * A release target representing a type-scope-breaking tuple for one package.
 * Used in MultiTargetCommit where each scope can have its own type and breaking indicator.
 */
export class Target extends Schema.TaggedClass<Target>()('Target', {
  /** Commit type (e.g., "feat", "fix", "chore") */
  type: Schema.String,
  /** Package scope (e.g., "core", "cli") */
  scope: Schema.String,
  /** Whether this target represents a breaking change */
  breaking: Schema.Boolean,
}) {}
