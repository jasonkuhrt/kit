import { Err } from '@kitz/core'
import { Schema as S } from 'effect'

const baseTags = ['kit', 'release', 'workflow'] as const

/**
 * Workflow-level publish error.
 */
export const WorkflowPublishError = Err.TaggedContextualError(
  'WorkflowPublishError',
  baseTags,
  {
    context: S.Struct({
      /** Package that failed to publish */
      packageName: S.String,
      /** Details about the failure */
      detail: S.String,
    }),
    message: (ctx) => `Failed to publish ${ctx.packageName}: ${ctx.detail}`,
  },
)

export type WorkflowPublishError = InstanceType<typeof WorkflowPublishError>

/**
 * Workflow-level tag error.
 */
export const WorkflowTagError = Err.TaggedContextualError('WorkflowTagError', baseTags, {
  context: S.Struct({
    /** Git tag that failed */
    tag: S.String,
    /** Details about the failure */
    detail: S.String,
  }),
  message: (ctx) => `Failed to create/push tag ${ctx.tag}: ${ctx.detail}`,
})

export type WorkflowTagError = InstanceType<typeof WorkflowTagError>

/**
 * Workflow-level preflight error.
 */
export const WorkflowPreflightError = Err.TaggedContextualError(
  'WorkflowPreflightError',
  baseTags,
  {
    context: S.Struct({
      /** Preflight check that failed */
      check: S.String,
      /** Details about the failure */
      detail: S.String,
    }),
    message: (ctx) => `Preflight check '${ctx.check}' failed: ${ctx.detail}`,
  },
)

export type WorkflowPreflightError = InstanceType<typeof WorkflowPreflightError>

/**
 * Workflow-level GitHub release error.
 */
export const WorkflowGHReleaseError = Err.TaggedContextualError(
  'WorkflowGHReleaseError',
  baseTags,
  {
    context: S.Struct({
      /** Git tag for the release */
      tag: S.String,
      /** Details about the failure */
      detail: S.String,
    }),
    message: (ctx) => `Failed to create GitHub release for ${ctx.tag}: ${ctx.detail}`,
  },
)

export type WorkflowGHReleaseError = InstanceType<typeof WorkflowGHReleaseError>

/**
 * Union of all workflow errors.
 */
export const ReleaseWorkflowError = S.Union(
  WorkflowPublishError,
  WorkflowTagError,
  WorkflowPreflightError,
  WorkflowGHReleaseError,
)

export type ReleaseWorkflowError =
  | WorkflowPublishError
  | WorkflowTagError
  | WorkflowPreflightError
  | WorkflowGHReleaseError

/** Union of all workflow errors */
export type All = ReleaseWorkflowError
