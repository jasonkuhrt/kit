import { Schema } from 'effect'
import { CommitMulti } from './commit-multi.js'
import { CommitSingle } from './commit-single.js'

/**
 * A conventional commit—either single (standard CC) or multi (extended for monorepos).
 */
export const Commit = Schema.Union(CommitSingle, CommitMulti)

/**
 * Type alias for the Commit union.
 */
export type Commit = typeof Commit.Type
