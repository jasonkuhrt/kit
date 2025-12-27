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
import { Context, Effect, Option, PubSub, Schema } from 'effect'

// ============================================================================
// Event Types
// ============================================================================

/**
 * Activity started executing.
 */
export class ActivityStarted extends Schema.TaggedClass<ActivityStarted>()('ActivityStarted', {
  activity: Schema.String,
  timestamp: Schema.Date,
  /** True if this activity was already completed (resumed from checkpoint) */
  resumed: Schema.Boolean,
}) {}

/**
 * Activity completed successfully.
 */
export class ActivityCompleted extends Schema.TaggedClass<ActivityCompleted>()('ActivityCompleted', {
  activity: Schema.String,
  timestamp: Schema.Date,
  /** True if this activity was already completed (resumed from checkpoint) */
  resumed: Schema.Boolean,
  /** Duration in milliseconds (very short if resumed) */
  durationMs: Schema.Number,
}) {}

/**
 * Activity failed.
 */
export class ActivityFailed extends Schema.TaggedClass<ActivityFailed>()('ActivityFailed', {
  activity: Schema.String,
  timestamp: Schema.Date,
  error: Schema.String,
}) {}

/**
 * Workflow completed successfully.
 */
export class WorkflowCompleted extends Schema.TaggedClass<WorkflowCompleted>()('WorkflowCompleted', {
  timestamp: Schema.Date,
  durationMs: Schema.Number,
}) {}

/**
 * Workflow failed.
 */
export class WorkflowFailed extends Schema.TaggedClass<WorkflowFailed>()('WorkflowFailed', {
  timestamp: Schema.Date,
  error: Schema.String,
}) {}

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
 * Schema for activity lifecycle events.
 */
export const ActivityEvent = Schema.Union(
  ActivityStarted,
  ActivityCompleted,
  ActivityFailed,
  WorkflowCompleted,
  WorkflowFailed,
)

// ============================================================================
// Event PubSub Service
// ============================================================================

/**
 * Service for publishing workflow events.
 *
 * When provided, {@link ObservableActivity.make} emits lifecycle events.
 * When not provided, activities execute normally without event emission.
 */
export class WorkflowEvents extends Context.Tag('WorkflowEvents')<
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
      if (Option.isNone(maybePubsub)) {
        return yield* activity
      }

      const pubsub = maybePubsub.value
      const startTime = new Date()

      // Emit started
      yield* pubsub.publish(
        ActivityStarted.make({
          activity: config.name,
          timestamp: startTime,
          resumed: false,
        }),
      ).pipe(Effect.ignore)

      // Run the actual activity
      const result = yield* activity.pipe(
        Effect.tapError((error) => {
          const errorMessage = typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : String(error)
          return pubsub.publish(
            ActivityFailed.make({
              activity: config.name,
              timestamp: new Date(),
              error: errorMessage,
            }),
          ).pipe(Effect.ignore)
        }),
      )

      // Emit completed
      const now = new Date()
      const durationMs = now.getTime() - startTime.getTime()
      yield* pubsub.publish(
        ActivityCompleted.make({
          activity: config.name,
          timestamp: now,
          resumed: durationMs < RESUME_THRESHOLD_MS,
          durationMs,
        }),
      ).pipe(Effect.ignore)

      return result
    }) as any, // Cast needed because serviceOption changes R
}
