import { describe, expect, test } from 'vitest'
import { initialInput, stepA, stepB } from './_.test-helpers.js'
import { PipelineDefinition } from './__.js'
import type { ContextualAggregateError } from './_errors.js'

const run = async (interceptor: (...args: any[]) => any) => {
  const pipeline = PipelineDefinition.create().step(stepA).step(stepB).done()
  return PipelineDefinition.run(pipeline, {
    initialInput,
    interceptors: [interceptor],
  })
}

describe(`invalid destructuring cases`, () => {
  test(`noParameters`, async () => {
    const result = await run(() => undefined) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(`
      {
        "context": {
          "issue": "noParameters",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `)
  })
  test(`destructuredWithoutEntryHook`, async () => {
    const result = await run(async ({}) => {}) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(
      `
      {
        "context": {
          "issue": "noParameters",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `,
    )
  })
  test(`multipleParameters`, async () => {
    const result = await run(async ({ x }, y) => {}) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(
      `
      {
        "context": {
          "issue": "multipleParameters",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `,
    )
  })
  test(`notDestructured`, async () => {
    const result = await run(async (_) => {}) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(`
      {
        "context": {
          "issue": "notDestructured",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `)
  })
  test(`multipleDestructuredHookNames`, async () => {
    const result = await run(async ({ a, b }) => {}) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(`
      {
        "context": {
          "issue": "multipleDestructuredHookNames",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `)
  })
  test(`invalidDestructuredHookNames`, async () => {
    const result = await run(async ({ y, z }) => {}) as ContextualAggregateError
    expect({
      result,
      errors: result.errors,
      context: result.errors[0]?.context,
    }).toMatchInlineSnapshot(`
      {
        "context": {
          "issue": "invalidDestructuredHookNames",
        },
        "errors": [
          [ContextualError: Interceptor must destructure the first parameter passed to it and select exactly one step.],
        ],
        "result": [ContextualAggregateError: One or more extensions are invalid.],
      }
    `)
  })
})
