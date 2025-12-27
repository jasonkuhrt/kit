/**
 * @module observable
 *
 * Generic observable workflow infrastructure for activity lifecycle tracking.
 *
 * Provides {@link ObservableActivity} - a drop-in replacement for `Activity.make()`
 * that emits lifecycle events when {@link WorkflowEvents} service is available.
 *
 * @example
 * ```ts
 * // Instead of Activity.make, use ObservableActivity.make
 * yield* ObservableActivity.make({
 *   name: 'SendEmail',
 *   error: SendEmailError,
 *   execute: sendEmail(to, subject, body),
 * })
 * ```
 */

import { Activity } from '@effect/workflow'
import { Context, Effect, PubSub, Schema } from 'effect'

// ============================================================================
// Event Types
// ============================================================================

/**
 * Activity lifecycle event.
 */
export type ActivityEvent =
  | ActivityStarted
  | ActivityCompleted
  | ActivityFailed
  | WorkflowCompleted
  | WorkflowFailed

/**
 * Activity started executing.
 */
export interface ActivityStarted {
  readonly _tag: 'ActivityStarted'
  readonly activity: string
  readonly timestamp: Date
  /** True if this activity was already completed (resumed from checkpoint) */
  readonly resumed: boolean
}

/**
 * Activity completed successfully.
 */
export interface ActivityCompleted {
  readonly _tag: 'ActivityCompleted'
  readonly activity: string
  readonly timestamp: Date
  /** True if this activity was already completed (resumed from checkpoint) */
  readonly resumed: boolean
  /** Duration in milliseconds (very short if resumed) */
  readonly durationMs: number
}

/**
 * Activity failed.
 */
export interface ActivityFailed {
  readonly _tag: 'ActivityFailed'
  readonly activity: string
  readonly timestamp: Date
  readonly error: string
}

/**
 * Workflow completed successfully.
 */
export interface WorkflowCompleted {
  readonly _tag: 'WorkflowCompleted'
  readonly timestamp: Date
  readonly durationMs: number
}

/**
 * Workflow failed.
 */
export interface WorkflowFailed {
  readonly _tag: 'WorkflowFailed'
  readonly timestamp: Date
  readonly error: string
}

// ============================================================================
// Event PubSub Service
// ============================================================================

/**
 * Service for publishing workflow events.
 *
 * When provided, {@link ObservableActivity.make} emits lifecycle events.
 * When not provided, activities execute normally without event emission.
 */
export class WorkflowEvents extends Context.Tag('@kitz/flo/WorkflowEvents')<
  WorkflowEvents,
  PubSub.PubSub<ActivityEvent>
>() {}

// ============================================================================
// Observable Activity
// ============================================================================

/** Threshold in ms - activities completing faster than this are considered resumed */
const RESUME_THRESHOLD_MS = 50

/**
 * Observable drop-in replacement for `Activity.make()`.
 *
 * When {@link WorkflowEvents} service is provided, emits lifecycle events:
 * - `ActivityStarted` when activity begins
 * - `ActivityCompleted` when activity succeeds
 * - `ActivityFailed` when activity fails
 *
 * When WorkflowEvents is not provided, behaves exactly like `Activity.make()`.
 *
 * **Resume detection**: Activities completing in <50ms are flagged with `resumed: true`,
 * indicating they were replayed from a checkpoint rather than freshly executed.
 *
 * @example
 * ```ts
 * // Basic usage - same as Activity.make
 * yield* ObservableActivity.make({
 *   name: 'PublishPackage',
 *   error: PublishError,
 *   execute: publishToNpm(packageName, version),
 * })
 *
 * // With retry
 * yield* ObservableActivity.make({
 *   name: 'PushTags',
 *   error: GitError,
 *   execute: git.pushTags(),
 *   retry: { times: 2 },
 * })
 * ```
 */
export const ObservableActivity = {
  /**
   * Create an observable activity.
   *
   * Same API as `Activity.make()` but emits lifecycle events.
   *
   * @param config.retry - Optional retry configuration (mirrors Activity.retry)
   */
  make: <R, E extends Schema.Schema.All = typeof Schema.Never>(config: {
    readonly name: string
    readonly error?: E | undefined
    readonly execute: Effect.Effect<void, E['Type'], R>
    readonly retry?: { times: number }
  }): Effect.Effect<void, E['Type'], R> =>
    Effect.gen(function*() {
      const maybePubsub = yield* Effect.serviceOption(WorkflowEvents)

      // Create the underlying activity (with optional retry)
      let activity: Effect.Effect<void, E['Type'], any> = Activity.make({
        name: config.name,
        error: config.error,
        execute: config.execute,
      })
      if (config.retry) {
        activity = activity.pipe(Activity.retry(config.retry))
      }

      // No event service - just run the activity
      if (maybePubsub._tag === 'None') {
        return yield* activity
      }

      const pubsub = maybePubsub.value
      const startTime = new Date()

      // Emit started
      yield* pubsub.publish({
        _tag: 'ActivityStarted',
        activity: config.name,
        timestamp: startTime,
        resumed: false,
      }).pipe(Effect.ignore)

      // Run the actual activity
      const result = yield* activity.pipe(
        Effect.tapError((error) => {
          const errorMessage = typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : String(error)
          return pubsub.publish({
            _tag: 'ActivityFailed',
            activity: config.name,
            timestamp: new Date(),
            error: errorMessage,
          }).pipe(Effect.ignore)
        }),
      )

      // Emit completed
      const now = new Date()
      const durationMs = now.getTime() - startTime.getTime()
      yield* pubsub.publish({
        _tag: 'ActivityCompleted',
        activity: config.name,
        timestamp: now,
        resumed: durationMs < RESUME_THRESHOLD_MS,
        durationMs,
      }).pipe(Effect.ignore)

      return result
    }) as any, // Cast needed because serviceOption changes R
}
