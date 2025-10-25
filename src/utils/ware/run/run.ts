import type { Pipeline } from '../Pipeline/Pipeline.js'
import type { Result } from '../Result.js'
import { createRunner, type Params } from './runner.js'

type Run = <
  $Pipeline extends Pipeline,
  $Params extends Params<$Pipeline>,
>(
  pipeline: $Pipeline,
  params?: $Params,
) => Promise<Result<$Pipeline['output']>>

/**
 * todo
 */
export const run: Run = async (pipeline, params) => {
  const runner = createRunner(pipeline)
  return await runner(params as any) as any
}
