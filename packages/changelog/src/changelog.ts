import { Effect } from 'effect'

/**
 * Options for generating a changelog.
 */
export interface GenerateOptions {
  /** The package scope (e.g., "@kitz/core") */
  readonly scope: string
  /** Commits to include in the changelog */
  readonly commits: readonly CommitEntry[]
  /** Previous version (for comparison link) */
  readonly previousVersion?: string
  /** New version being released */
  readonly newVersion: string
}

/**
 * A commit entry for changelog generation.
 */
export interface CommitEntry {
  readonly type: string
  readonly message: string
  readonly hash: string
  readonly breaking: boolean
}

/**
 * Generated changelog content.
 */
export interface Changelog {
  readonly markdown: string
  readonly hasBreakingChanges: boolean
}

/**
 * Generate a changelog from commits.
 *
 * @example
 * ```ts
 * const changelog = Effect.runSync(generate({
 *   scope: '@kitz/core',
 *   commits: [{ type: 'feat', message: 'add new API', hash: 'abc123', breaking: false }],
 *   newVersion: '1.0.0',
 * }))
 * ```
 */
export const generate = (options: GenerateOptions): Effect.Effect<Changelog> =>
  Effect.sync(() => {
    const { scope, commits, newVersion } = options

    const breaking = commits.filter((c) => c.breaking)
    const features = commits.filter((c) => c.type === 'feat' && !c.breaking)
    const fixes = commits.filter((c) => c.type === 'fix' && !c.breaking)

    const lines: string[] = [`## ${scope} v${newVersion}`, '']

    if (breaking.length > 0) {
      lines.push('### Breaking Changes', '')
      for (const c of breaking) {
        lines.push(`- ${c.message} (${c.hash.slice(0, 7)})`)
      }
      lines.push('')
    }

    if (features.length > 0) {
      lines.push('### Features', '')
      for (const c of features) {
        lines.push(`- ${c.message} (${c.hash.slice(0, 7)})`)
      }
      lines.push('')
    }

    if (fixes.length > 0) {
      lines.push('### Bug Fixes', '')
      for (const c of fixes) {
        lines.push(`- ${c.message} (${c.hash.slice(0, 7)})`)
      }
      lines.push('')
    }

    return {
      markdown: lines.join('\n'),
      hasBreakingChanges: breaking.length > 0,
    }
  })
