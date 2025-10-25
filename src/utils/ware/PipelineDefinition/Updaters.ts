import type { ConfigManager } from '#config-manager'
import type { Overload } from '../Overload/$.js'
import type { StepDefinition } from '../StepDefinition.js'
import type { PipelineDefinition } from './$.js'

export namespace Updaters {
  export type SetInput<
    $PipelineDef extends PipelineDefinition,
    $Input extends object,
  > = ConfigManager.SetKey<$PipelineDef, 'input', $Input>

  export type AddStep<
    $PipelineDef extends PipelineDefinition,
    $Step extends StepDefinition,
  > = ConfigManager.UpdateKeyWithAppendOne<$PipelineDef, 'steps', $Step>

  export type AddOverload<
    $PipelineDef extends PipelineDefinition,
    $Overload extends Overload.Data,
  > = ConfigManager.UpdateKeyWithAppendOne<$PipelineDef, 'overloads', $Overload>

  export type AddOverloadMany<
    $PipelineDef extends PipelineDefinition,
    $Overloads extends readonly Overload.Data[],
  > = ConfigManager.UpdateKeyWithAppendMany<$PipelineDef, 'overloads', $Overloads>
}
