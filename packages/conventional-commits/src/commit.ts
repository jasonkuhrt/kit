import { Schema } from 'effect'
import { MultiTargetCommit } from './multi-target-commit.js'
import { SingleTargetCommit } from './single-target-commit.js'

/**
 * A conventional commit—either single-target (standard CC) or multi-target (extended for monorepos).
 */
export const ConventionalCommit = Schema.Union(SingleTargetCommit, MultiTargetCommit)

/**
 * Type alias for the ConventionalCommit union.
 */
export type ConventionalCommit = typeof ConventionalCommit.Type

/**
 * Type guard for SingleTargetCommit.
 */
export const isSingleTarget = Schema.is(SingleTargetCommit)

/**
 * Type guard for MultiTargetCommit.
 */
export const isMultiTarget = Schema.is(MultiTargetCommit)
