import type { Ts } from '#ts'
import type { Tup } from '#tup'
import type { Undefined } from '#undefined'

// Utility type from Graffle prelude
type IntersectionIgnoreNeverOrAny<$T> = Ts.Inhabitance.IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
import type { PipelineDefinition } from '../__.js'
import type { Overload } from '../Overload/_.js'
import type { Config } from '../PipelineDefinition/Config.js'
import type { Step } from '../Step.js'
import type { StepDefinition } from '../StepDefinition.js'
import type { StepRunner } from '../StepRunner.js'

export interface Pipeline {
  readonly config: Config
  readonly input: object
  readonly steps: readonly Step[]
  readonly stepsIndex: StepsIndex
  readonly output: any
}

export type StepsIndex<
  $Name extends Step['name'] = Step['name'],
  $ExecutableStep extends Step = Step,
> = Map<$Name, $ExecutableStep>

export const createStepsIndex = <$Steps extends Step[]>(steps: $Steps): StepsIndex => {
  return new Map(steps.map(step => [step.name, step]))
}

export namespace Pipeline {
  export const create = <$PipelineDef extends PipelineDefinition>(
    definition: $PipelineDef,
  ): Ts.Simplify.Top<InferFromDefinition<$PipelineDef>> => {
    let steps = definition.steps as unknown as Step[]
    if (definition.overloads.length > 0) {
      steps = steps.map((step): Step => {
        const stepOverloads = definition.overloads
          .map(overload => {
            const stepOverload = overload.steps[step.name]
            if (!stepOverload) return null
            return {
              ...(stepOverload as unknown as Step),
              discriminant: overload.discriminant,
            }
          })
          .filter(_ => _ !== null)

        const stepWithOverloads = {
          name: step.name,
          run: (...args: Parameters<StepRunner>) => {
            const input = args[0] as Record<string, unknown>
            const stepOverload = stepOverloads.find(stepOverload => {
              return input[stepOverload.discriminant.name] === stepOverload.discriminant.value
            })
            if (stepOverload) return stepOverload.run(...args)
            return step.run(...args)
          },
          slots: {
            ...step.slots,
            ...stepOverloads.reduce((acc, stepOverload) => {
              return {
                ...acc,
                ...stepOverload.slots,
              }
            }, {}),
          },
        }

        return stepWithOverloads as Step
      })
    }

    const stepsIndex = createStepsIndex(steps)

    return {
      ...definition,
      steps, // todo: it is a bug to not have this here, but removing it and no anyware test breaks!
      stepsIndex,
    } as any
  }

  // dprint-ignore
  export type InferFromDefinition<
    $PipelineDef extends PipelineDefinition,
    VAR_Steps extends readonly Step[] = InferSteps<$PipelineDef>
  > = {
    readonly config: $PipelineDef['config']
    readonly steps: VAR_Steps
    readonly stepsIndex: StepsIndex<
      $PipelineDef['steps'][number]['name'],
      VAR_Steps[number]
    >
    readonly input: VAR_Steps extends Tup.NonEmpty
      ? VAR_Steps[0]['input']
      : $PipelineDef['input']
    readonly output:
      VAR_Steps extends Tup.NonEmpty
        ? Awaited<Tup.GetLastValue<VAR_Steps>['output']>
        : $PipelineDef['input']
  }

  // dprint-ignore
  type InferSteps<
    $PipelineDef extends PipelineDefinition,
    VAR_StepDefs extends readonly StepDefinition[] = $PipelineDef['steps'],
    VAR_IsHasNoOverloads extends boolean = $PipelineDef['overloads'] extends Tup.NonEmpty ? false : true,
  > =  {
    readonly [i in keyof VAR_StepDefs]: {
      readonly name: VAR_StepDefs[i]['name']
      readonly input:
        VAR_IsHasNoOverloads extends true
          ? VAR_StepDefs[i]['input']
          : Ts.Simplify.Top<
              & VAR_StepDefs[i]['input']
              & InferStepInputFromOverload<
                  i,
                  VAR_StepDefs[i]['name'],
                  $PipelineDef['overloads'][number]
                >
            >
      readonly output: VAR_IsHasNoOverloads extends true
        ? VAR_StepDefs[i]['output']
        : Ts.Simplify.Top<
          & VAR_StepDefs[i]['output']
          & InferStepOutputFromOverloads<
              VAR_StepDefs[i]['name'],
              $PipelineDef['overloads'][number]
            >
        >
      readonly slots: VAR_IsHasNoOverloads extends true
        ? VAR_StepDefs[i]['slots']
        : InferStepSlots<
            VAR_StepDefs[i],
            $PipelineDef['overloads']
          >
      readonly run: Ts.Inhabitance.IsUnknown<VAR_StepDefs[i]['run']> extends true
        ? StepRunner
        : Undefined.Exclude<VAR_StepDefs[i]['run']>
    }
  }

  type InferStepSlots<
    $Step extends StepDefinition,
    $Overloads extends readonly Overload.Data[],
  > =
    & $Step['slots']
    & InferStepSlots_<$Step, $Overloads>
  // todo try putting the helper type below into a type variable above
  // dprint-ignore
  type InferStepSlots_<$Step extends StepDefinition, $Overloads extends readonly Overload.Data[]> =
    Tup.IntersectItems<{
      [$Index in keyof $Overloads]:
        Ts.Inhabitance.IsUnknown<$Overloads[$Index]['steps'][$Step['name']]> extends true
          ? unknown
          : $Overloads[$Index]['steps'][$Step['name']]['slots']
    }>

  // dprint-ignore
  type InferStepOutputFromOverloads<
    $StepName extends Step['name'],
    $Overload extends Overload.Data,
  > =
    $Overload extends Ts.Union.__FORCE_DISTRIBUTION__ ?

    // 1. The discriminant
    & $Overload extends never ? never : {
        [_ in $Overload['discriminant']['name']]: $Overload['discriminant']['value']
      }
    // 2. The output
    & IntersectionIgnoreNeverOrAny<$Overload['steps'][$StepName]['output']>


    : never

  // dprint-ignore
  type InferStepInputFromOverload<
    $StepIndex extends Tup.IndexKey,
    $StepName extends Step['name'],
    $Overload extends Overload.Data,
  > =
    $Overload extends Ts.Union.__FORCE_DISTRIBUTION__ ?

    // 1. The discriminant
    & {
        [_ in $Overload['discriminant']['name']]: $Overload['discriminant']['value']
      }
    // 2. The input
    & IntersectionIgnoreNeverOrAny<$Overload['steps'][$StepName]['input']>
    // 3. If this is the first step, then the pipeline input contributions, if any:
    & ($StepIndex extends '0'
        ? $Overload['configurationMount'] extends string
          ? { [_ in $Overload['configurationMount']]: $Overload['configurator']['input'] }
          : $Overload['configurator']['input']
        : {}
      )

  : never
}

// type x = never extends 1 ? true:false
