import { Effect } from 'effect'
import type { Plan } from '../plan/models/plan.js'
import { executeWorkflow } from '../workflow.js'
import type { ApplyOptions } from './models/options.js'
import type { Result } from './models/result.js'

/**
 * Apply a release plan.
 *
 * Uses a durable workflow backed by SQLite for resumable execution.
 * On partial failure, rerunning with the same plan will automatically
 * resume from where it left off (activities are idempotent).
 *
 * **Execution order:**
 * 1. Preflight checks (npm auth, git clean, tags don't exist)
 * 2. Publish all packages (with version injection/restoration)
 * 3. Create git tags locally
 * 4. Push all tags to remote
 *
 * @example
 * ```ts
 * const result = yield* Release.apply(plan)
 * ```
 */
export const apply = (
  plan: Plan,
  options?: ApplyOptions,
) =>
  Effect.gen(function*() {
    // Combine primary releases and cascades
    const allReleases = [...plan.releases, ...plan.cascades]

    if (allReleases.length === 0) {
      return { released: [], tags: [] } as Result
    }

    // Execute the durable workflow
    // Note: Requires workflow runtime layer to be provided by caller
    const workflowResult = yield* executeWorkflow(
      plan,
      {
        ...(options?.dryRun !== undefined && { dryRun: options.dryRun }),
        ...(options?.tag && { tag: options.tag }),
        ...(options?.registry && { registry: options.registry }),
      },
    )

    // Build result from workflow output
    const released = allReleases.filter((r) => workflowResult.releasedPackages.includes(r.package.name.moniker))

    return {
      released,
      tags: workflowResult.createdTags,
    } as Result
  })
