import type { Prom } from '#prom'
import type { Ts } from '#ts'
import type { Pipeline } from '../$$.js'
import type { ResultSuccess } from '../Result.js'
import type { Step } from '../Step.js'
import type { StepTrigger } from '../StepTrigger.js'
import type { StepTriggerEnvelope } from '../StepTriggerEnvelope.js'

export type InterceptorOptions = {
  retrying: boolean
}

export namespace Interceptor {
  // dprint-ignore
  export interface InferFromPipeline<
    $Pipeline extends Pipeline = Pipeline,
  > // $Options extends InterceptorOptions = InterceptorOptions,
  {
    (stepTriggers: Ts.Simplify.Top<InferStepTriggerParameters<$Pipeline>>):
      Promise<
        | $Pipeline['output']
        | StepTriggerEnvelope
      >
  }

  // dprint-ignore
  type InferStepTriggerParameters<
    $Pipeline extends Pipeline,
    __Steps extends readonly Step[] = $Pipeline['steps'],
    __PipelineOutput = $Pipeline['output'],
  > =
    __Steps extends readonly [infer $NextStep extends Step, ...infer $NextNextSteps extends readonly Step[]]
      ? & {
            [_ in $NextStep['name']]:
              StepTrigger.Infer<
                $NextStep,
                $NextNextSteps,
                __PipelineOutput
              >
          }
        & InferStepTriggerParameters<$Pipeline, $NextNextSteps, __PipelineOutput>
      : {}
}

export type InterceptorGeneric = NonRetryingInterceptor | RetryingInterceptor

export interface NonRetryingInterceptor {
  retrying: false
  name: string
  entrypoint: string
  body: Prom.Deferred<unknown>
  currentChunk: Prom.Deferred<StepTriggerEnvelope | ResultSuccess>
}

export interface RetryingInterceptor {
  retrying: true
  name: string
  entrypoint: string
  body: Prom.Deferred<unknown>
  currentChunk: Prom.Deferred<StepTriggerEnvelope | Error | ResultSuccess>
}

export const createRetryingInterceptor = (interceptor: NonRetryingInterceptorInput): RetryingInterceptorInput => {
  return {
    retrying: true,
    run: interceptor,
  }
}

// export interface InterceptorInput {
//   name: string
//   // entrypoint: string
//   // body: Deferred<unknown>
//   // currentChunk: Deferred<SomePublicHookEnvelope | Error /* | unknown (result) */>
// }

// export type ExtensionInput<$Input extends object = object> = (input: $Input) => MaybePromise<unknown>
export type InterceptorInput<$Input extends object = any> =
  | NonRetryingInterceptorInput<$Input>
  | RetryingInterceptorInput<$Input>

export type NonRetryingInterceptorInput<$Input extends object = any> = (
  input: $Input,
) => Prom.Maybe<unknown>

export type RetryingInterceptorInput<$Input extends object = any> = {
  retrying: boolean
  run: (input: $Input) => Prom.Maybe<unknown>
}
