import type { PipelineDefinition } from './_.js'

export namespace States {
  export interface Empty extends PipelineDefinition {
    steps: []
    overloads: []
  }
}
