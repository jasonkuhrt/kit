import { FileSystem } from '@effect/platform'
import { Err } from '@kitz/core'
import { Fs } from '@kitz/fs'
import { Effect } from 'effect'
import { randomUUID } from 'node:crypto'
import type { PlannedRelease } from './release.js'

/**
 * Default state file name.
 */
export const DEFAULT_STATE_FILE = 'apply.state.json'

/**
 * Status of a step in the apply process.
 */
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'failed'

/**
 * A step in the apply process.
 */
export interface ApplyStep {
  /** Unique step ID */
  readonly id: string
  /** Type of operation */
  readonly type: 'publish' | 'create-tag' | 'push-tags'
  /** Package name (for publish/create-tag) */
  readonly packageName?: string
  /** Version (for publish) */
  readonly version?: string
  /** Tag name (for create-tag) */
  readonly tag?: string
  /** Current status */
  readonly status: StepStatus
  /** Error message if failed */
  readonly error?: string
  /** ISO timestamp when started */
  readonly startedAt?: string
  /** ISO timestamp when completed/failed */
  readonly completedAt?: string
}

/**
 * Persistent state for an apply operation.
 *
 * This is written to disk after each step so that failed
 * applies can be resumed without re-executing completed steps.
 */
export interface ApplyState {
  /** Schema version for forward compatibility */
  readonly version: 1
  /** Unique identifier for this apply run */
  readonly runId: string
  /** ISO timestamp when this run started */
  readonly startedAt: string
  /** Summary of planned releases */
  readonly plan: {
    readonly releases: Array<{
      readonly packageName: string
      readonly version: string
    }>
  }
  /** All steps with their current status */
  readonly steps: ApplyStep[]
  /** Overall status */
  readonly status: 'in-progress' | 'completed' | 'failed' | 'partial'
  /** ISO timestamp when completed/failed */
  readonly completedAt?: string
}

/**
 * Error during state operations.
 */
export const StateError = Err.TaggedContextualError('StateError').constrain<{
  readonly operation: 'read' | 'write' | 'parse' | 'validate'
  readonly detail: string
}>({
  message: (ctx) => `State ${ctx.operation} error: ${ctx.detail}`,
})

export type StateError = InstanceType<typeof StateError>

/**
 * Create initial state from a release plan.
 */
export const createInitialState = (
  releases: PlannedRelease[],
): ApplyState => {
  const now = new Date().toISOString()
  const runId = randomUUID()

  // Build steps: one publish per package, one tag per package, then push-tags
  const steps: ApplyStep[] = []

  // Publish steps (one per package)
  for (const release of releases) {
    steps.push({
      id: `publish-${release.package.name}`,
      type: 'publish',
      packageName: release.package.name,
      version: release.nextVersion,
      status: 'pending',
    })
  }

  // Create-tag steps (one per package)
  for (const release of releases) {
    const tag = `${release.package.name}@${release.nextVersion}`
    steps.push({
      id: `create-tag-${tag}`,
      type: 'create-tag',
      packageName: release.package.name,
      tag,
      status: 'pending',
    })
  }

  // Single push-tags step at the end
  steps.push({
    id: 'push-tags',
    type: 'push-tags',
    status: 'pending',
  })

  return {
    version: 1,
    runId,
    startedAt: now,
    plan: {
      releases: releases.map((r) => ({
        packageName: r.package.name,
        version: r.nextVersion,
      })),
    },
    steps,
    status: 'in-progress',
  }
}

/**
 * Read state from file.
 */
export const readState = (
  stateFile: Fs.Path.AbsFile,
): Effect.Effect<ApplyState | null, StateError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const filePath = Fs.Path.toString(stateFile)

    // Check if file exists
    const exists = yield* fs.exists(filePath).pipe(
      Effect.mapError((cause) =>
        new StateError({
          context: { operation: 'read', detail: `Failed to check file existence: ${filePath}` },
          cause: cause as any,
        })
      ),
    )

    if (!exists) {
      return null
    }

    // Read file content
    const content = yield* fs.readFileString(filePath).pipe(
      Effect.mapError((cause) =>
        new StateError({
          context: { operation: 'read', detail: `Failed to read state file: ${filePath}` },
          cause: cause as any,
        })
      ),
    )

    // Parse JSON
    const state = yield* Effect.try({
      try: () => JSON.parse(content) as ApplyState,
      catch: (cause) =>
        new StateError({
          context: { operation: 'parse', detail: `Invalid JSON in state file: ${filePath}` },
          cause: cause instanceof Error ? cause : new Error(String(cause)),
        }),
    })

    // Validate schema version
    if (state.version !== 1) {
      return yield* Effect.fail(
        new StateError({
          context: {
            operation: 'validate',
            detail: `Unsupported state version: ${state.version}. Expected 1.`,
          },
        }),
      )
    }

    return state
  })

/**
 * Write state to file.
 */
export const writeState = (
  stateFile: Fs.Path.AbsFile,
  state: ApplyState,
): Effect.Effect<void, StateError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const filePath = Fs.Path.toString(stateFile)
    const content = JSON.stringify(state, null, 2) + '\n'

    yield* fs.writeFileString(filePath, content).pipe(
      Effect.mapError((cause) =>
        new StateError({
          context: { operation: 'write', detail: `Failed to write state file: ${filePath}` },
          cause: cause as any,
        })
      ),
    )
  })

/**
 * Delete state file.
 */
export const deleteState = (
  stateFile: Fs.Path.AbsFile,
): Effect.Effect<void, StateError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const filePath = Fs.Path.toString(stateFile)

    yield* fs.remove(filePath).pipe(
      Effect.mapError((cause) =>
        new StateError({
          context: { operation: 'write', detail: `Failed to delete state file: ${filePath}` },
          cause: cause as any,
        })
      ),
    )
  })

/**
 * Update a step's status in the state.
 */
export const updateStep = (
  state: ApplyState,
  stepId: string,
  update: Partial<Pick<ApplyStep, 'status' | 'error' | 'startedAt' | 'completedAt'>>,
): ApplyState => ({
  ...state,
  steps: state.steps.map((step) =>
    step.id === stepId
      ? { ...step, ...update }
      : step
  ),
})

/**
 * Mark state as completed.
 */
export const markCompleted = (state: ApplyState): ApplyState => ({
  ...state,
  status: 'completed',
  completedAt: new Date().toISOString(),
})

/**
 * Mark state as failed.
 */
export const markFailed = (state: ApplyState): ApplyState => ({
  ...state,
  status: 'failed',
  completedAt: new Date().toISOString(),
})

/**
 * Mark state as partial (some succeeded, some failed).
 */
export const markPartial = (state: ApplyState): ApplyState => ({
  ...state,
  status: 'partial',
  completedAt: new Date().toISOString(),
})

/**
 * Check if a state can be resumed.
 *
 * A state can be resumed if:
 * - It's not already completed successfully
 * - The plan matches the releases we want to apply
 */
export const canResume = (
  state: ApplyState,
  releases: PlannedRelease[],
): boolean => {
  // Can't resume a completed run
  if (state.status === 'completed') {
    return false
  }

  // Check that the plan matches
  const statePkgs = new Set(state.plan.releases.map((r) => `${r.packageName}@${r.version}`))
  const currentPkgs = new Set(releases.map((r) => `${r.package.name}@${r.nextVersion}`))

  // Plans must match exactly
  if (statePkgs.size !== currentPkgs.size) {
    return false
  }

  for (const pkg of statePkgs) {
    if (!currentPkgs.has(pkg)) {
      return false
    }
  }

  return true
}

/**
 * Get a summary of state for logging.
 */
export const summarizeState = (state: ApplyState): string => {
  const completed = state.steps.filter((s) => s.status === 'completed').length
  const failed = state.steps.filter((s) => s.status === 'failed').length
  const pending = state.steps.filter((s) => s.status === 'pending').length

  return `Run ${state.runId.slice(0, 8)}: ${completed} completed, ${failed} failed, ${pending} pending`
}

/**
 * Get steps that need to be executed (pending or previously failed).
 */
export const getPendingSteps = (state: ApplyState): ApplyStep[] =>
  state.steps.filter((s) => s.status === 'pending' || s.status === 'failed')

/**
 * Check if all steps are completed.
 */
export const isComplete = (state: ApplyState): boolean => state.steps.every((s) => s.status === 'completed')

/**
 * Check if any step failed.
 */
export const hasFailed = (state: ApplyState): boolean => state.steps.some((s) => s.status === 'failed')
