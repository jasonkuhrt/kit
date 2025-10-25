import { Ts } from '#ts'
import { test } from 'vitest'
import { Pipeline } from '../$$.js'
import type { initialInput } from '../_.test-helpers.js'
import { PipelineDefinition } from '../PipelineDefinition/$.js'
import type { Result } from '../Result.js'

const def = PipelineDefinition.create().input<initialInput>()

test(`returns input if no steps`, async () => {
  const d = def.type
  const p = Pipeline.create(d)
  const r = await PipelineDefinition.run(p)
  Ts.Assert.exact.ofAs<Result<initialInput>>().on(r)
})

test(`returns last step output if steps`, async () => {
  const d = def.step({ name: `a`, run: () => 2 as const }).type
  const p = Pipeline.create(d)
  const r = await PipelineDefinition.run(p)
  Ts.Assert.exact.ofAs<Result<2>>().on(r)
})

test(`can return a promise`, async () => {
  const d = def.step({ name: `a`, run: () => Promise.resolve(2 as const) }).type
  const p = Pipeline.create(d)
  const r = await PipelineDefinition.run(p)
  Ts.Assert.exact.ofAs<Result<2>>().on(r)
})
