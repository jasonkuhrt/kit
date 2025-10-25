import { describe, expect, test, vi } from 'vitest'
import { PipelineDefinition } from '../$$.js'
import {
  initialInput2,
  oops,
  pipeline,
  pipelineWithOptions,
  run,
  runRetrying,
  type TestInterceptor,
} from '../_.test-helpers.js'
import { ContextualError } from '../_errors.js'
import { Pipeline } from '../Pipeline/Pipeline.js'
import { successfulResult } from '../Result.js'
import { StepDefinition } from '../StepDefinition.js'

describe(`no interceptors`, () => {
  test(`passthrough to implementation`, async () => {
    const result = await run()
    expect(result).toEqual({ value: { value: `initial+a+b` } })
  })
})

describe(`one extension`, () => {
  test(`can return own result`, async () => {
    expect(
      await run(async ({ a }) => {
        const { b } = await a(a.input)
        await b({ input: b.input })
        return 0
      }),
    ).toEqual(successfulResult(0))
    expect(pipeline.stepsIndex.get('a')?.run.mock.calls[0]?.[0]).toMatchObject({ value: `initial` })
    expect(pipeline.stepsIndex.get('a')?.run).toHaveBeenCalled()
    expect(pipeline.stepsIndex.get('b')?.run).toHaveBeenCalled()
  })
  test('can call hook with no input, making the original input be used', async () => {
    await expect(
      run(async ({ a }) => {
        return await a()
      }),
    ).resolves.toEqual({ value: { value: 'initial+a+b' } })
    expect(pipeline.stepsIndex.get('a')?.run).toHaveBeenCalled()
    expect(pipeline.stepsIndex.get('b')?.run).toHaveBeenCalled()
  })
  describe(`can short-circuit`, () => {
    test(`at start, return input`, async () => {
      expect(
        // todo arrow function expression parsing not working
        await run(({ a }) => {
          return a.input
        }),
      ).toEqual({ value: { value: `initial` } })
      expect(pipeline.stepsIndex.get('a')?.run).not.toHaveBeenCalled()
      expect(pipeline.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
    })
    test(`at start, return own result`, async () => {
      expect(
        // todo arrow function expression parsing not working
        await run(({ a }) => {
          return 0
        }),
      ).toEqual({ value: 0 })
      expect(pipeline.stepsIndex.get('a')?.run).not.toHaveBeenCalled()
      expect(pipeline.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
    })
    test(`after first hook, return own result`, async () => {
      expect(
        await run(async ({ a }) => {
          const { b } = await a({ input: a.input })
          return b.input.value + `+x`
        }),
      ).toEqual(successfulResult(`initial+a+x`))
      expect(pipeline.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
    })
  })
  describe(`can partially apply`, () => {
    test(`only first hook`, async () => {
      expect(
        await run(async ({ a }) => {
          return await a({ input: { value: a.input.value + `+ext` } })
        }),
      ).toEqual(successfulResult({ value: `initial+ext+a+b` }))
    })
    test(`only second hook`, async () => {
      expect(
        await run(async ({ b }) => {
          return await b({ input: { value: b.input.value + `+ext` } })
        }),
      ).toEqual(successfulResult({ value: `initial+a+ext+b` }))
    })
    test(`only second hook + end`, async () => {
      expect(
        await run(async ({ b }) => {
          const result = await b({ input: { value: b.input.value + `+ext` } })
          return result.value + `+end`
        }),
      ).toEqual(successfulResult(`initial+a+ext+b+end`))
    })
  })
})

describe(`two interceptors`, () => {
  test(`first can short-circuit`, async () => {
    // Do not require selection mode so that we can use a mock interceptor.
    const { run, pipelineE } = pipelineWithOptions({ entrypointSelectionMode: 'optional' })
    const i1: TestInterceptor = async ({ a }) => ({ value: '1' })
    const i2: TestInterceptor = vi.fn().mockImplementation(({ a }) => ({ value: '2' }))
    expect(await run(i1, i2)).toEqual(successfulResult({ value: '1' }))
    expect(i2).not.toHaveBeenCalled()
    expect(pipelineE.stepsIndex.get('a')?.run).not.toHaveBeenCalled()
    expect(pipelineE.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
  })

  test(`each can adjust first hook then passthrough`, async () => {
    const i1: TestInterceptor = async ({ a }) => a({ input: { value: a.input.value + `+ex1` } })
    const i2: TestInterceptor = async ({ a }) => a({ input: { value: a.input.value + `+ex2` } })
    expect(await run(i1, i2)).toEqual(successfulResult({ value: `initial+ex1+ex2+a+b` }))
  })

  test(`each can adjust each hook`, async () => {
    const i1: TestInterceptor = async ({ a }) => {
      const { b } = await a({ input: { value: a.input.value + `+ex1` } })
      return await b({ input: { value: b.input.value + `+ex1` } })
    }
    const i2: TestInterceptor = async ({ a }) => {
      const { b } = await a({ input: { value: a.input.value + `+ex2` } })
      return await b({ input: { value: b.input.value + `+ex2` } })
    }
    expect(await run(i1, i2)).toEqual(successfulResult({ value: `initial+ex1+ex2+a+ex1+ex2+b` }))
  })

  test(`second can skip hook a`, async () => {
    const i1: TestInterceptor = async ({ a }) => {
      const { b } = await a({ input: { value: a.input.value + `+ex1` } })
      return await b({ input: { value: b.input.value + `+ex1` } })
    }
    const i2: TestInterceptor = async ({ b }) => {
      return await b({ input: { value: b.input.value + `+ex2` } })
    }
    expect(await run(i1, i2)).toEqual(successfulResult({ value: `initial+ex1+a+ex1+ex2+b` }))
  })
  test(`second can short-circuit before step a`, async () => {
    let ex1AfterA = false
    expect(
      await run(async ({ a }) => {
        const { b } = await a({ input: { value: a.input.value + `+ex1` } })
        ex1AfterA = true
        return b()
      }, async ({ a }) => ({ value: '2' })),
    ).toEqual(successfulResult({ value: '2' }))
    expect(ex1AfterA).toBe(false)
    expect(pipeline.stepsIndex.get('a')?.run).not.toHaveBeenCalled()
    expect(pipeline.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
  })
  test(`second can short-circuit after step a`, async () => {
    let ex1AfterB = false
    expect(
      await run(async ({ a }) => {
        const { b } = await a({ input: { value: a.input.value + `+ex1` } })
        await b({ input: { value: b.input.value + `+ex1` } })
        ex1AfterB = true
        return { value: '' }
      }, async ({ a }) => {
        await a({ input: { value: a.input.value + `+ex2` } })
        return { value: `early` }
      }),
    ).toEqual(successfulResult({ value: `early` }))
    expect(ex1AfterB).toBe(false)
    expect(pipeline.stepsIndex.get('a')?.run).toHaveBeenCalledOnce()
    expect(pipeline.stepsIndex.get('b')?.run).not.toHaveBeenCalled()
  })
})

describe(`errors`, () => {
  test(`extension that throws a non-error is wrapped in error`, async () => {
    const result = await run(async ({ a }) => {
      throw `oops`
    }) as ContextualError
    expect({
      result,
      context: result.context,
      cause: result.cause,
    }).toMatchInlineSnapshot(`
      {
        "cause": [Error: oops],
        "context": {
          "hookName": "a",
          "interceptorName": "anonymous",
          "source": "extension",
        },
        "result": [ContextualError: There was an error in the interceptor "anonymous" (use named functions to improve this error message) while running hook "a".],
      }
    `)
  })
  test(`extension throws asynchronously`, async () => {
    const result = await run(async ({ a }) => {
      throw oops
    }) as ContextualError
    expect({
      result,
      context: result.context,
      cause: result.cause,
    }).toMatchInlineSnapshot(`
      {
        "cause": [Error: oops],
        "context": {
          "hookName": "a",
          "interceptorName": "anonymous",
          "source": "extension",
        },
        "result": [ContextualError: There was an error in the interceptor "anonymous" (use named functions to improve this error message) while running hook "a".],
      }
    `)
  })

  test(`if implementation fails, without interceptors, result is the error`, async () => {
    pipeline.stepsIndex.get('a')?.run.mockReset().mockRejectedValueOnce(oops)
    const result = await run() as ContextualError
    expect({
      result,
      context: result.context,
      cause: result.cause,
    }).toMatchInlineSnapshot(`
      {
        "cause": [Error: oops],
        "context": {
          "hookName": "a",
          "source": "implementation",
        },
        "result": [ContextualError: There was an error in the core implementation of hook "a".],
      }
    `)
  })
  test('calling a step trigger twice leads to clear error', async () => {
    let neverRan = true
    const result = await run(async ({ a }) => {
      await a()
      await a()
      neverRan = false
    }) as ContextualError
    expect(neverRan).toBe(true)
    const cause = result.cause as ContextualError
    expect(cause.message).toMatchInlineSnapshot(
      `"Only a retrying extension can retry hooks."`,
    )
    expect(cause.context).toMatchInlineSnapshot(`
      {
        "extensionsAfter": [],
        "hookName": "a",
      }
    `)
  })
  describe('certain errors can be configured to be re-thrown without wrapping error', () => {
    class SpecialError1 extends Error {}
    class SpecialError2 extends Error {}
    const stepA = StepDefinition.createWithInput<{ throws: Error }>()({
      name: 'a',
      run: (input) => {
        if (input.throws) throw input.throws
      },
    })

    test('via passthroughErrorInstanceOf (one)', async () => {
      const pipelineE = PipelineDefinition.create({
        passthroughErrorInstanceOf: [SpecialError1],
      }).input<{ throws: Error }>().step(stepA).type
      const exPipeline = Pipeline.create(pipelineE)

      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new Error('oops') }, interceptors: [] })).resolves.toBeInstanceOf(ContextualError)
      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new SpecialError1('oops') }, interceptors: [] })).resolves.toBeInstanceOf(SpecialError1)
    })
    test('via passthroughErrorInstanceOf (multiple)', async () => {
      const pipelineE = PipelineDefinition.create({
        passthroughErrorInstanceOf: [SpecialError1, SpecialError2],
      }).input<{ throws: Error }>().step(stepA).type
      const exPipeline = Pipeline.create(pipelineE)
      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new Error('oops') }, interceptors: [] })).resolves.toBeInstanceOf(ContextualError)
      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new SpecialError2('oops') }, interceptors: [] })).resolves.toBeInstanceOf(SpecialError2)
    })
    test('via passthroughWith', async () => {
      const pipelineE = PipelineDefinition.create({
        // todo type-safe hook name according to values passed to constructor
        // todo type-tests on signal { hookName, source, error }
        passthroughErrorWith: (signal) => {
          return signal.error instanceof SpecialError1
        },
      }).input<{ throws: Error }>().step(stepA).type
      const exPipeline = Pipeline.create(pipelineE)
      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new Error('oops') }, interceptors: [] })).resolves.toBeInstanceOf(ContextualError)
      // dprint-ignore
      await expect(PipelineDefinition.run(exPipeline, { initialInput: { throws: new SpecialError1('oops') }, interceptors: [] })).resolves.toBeInstanceOf(SpecialError1)
    })
  })
})

describe('retrying extension', () => {
  test('if hook fails, extension can retry, then short-circuit', async () => {
    pipeline.stepsIndex.get('a')?.run.mockReset().mockRejectedValueOnce(oops).mockResolvedValueOnce({ value: 'retry' })
    const result = await runRetrying(async function foo({ a }) {
      const result1 = await a()
      expect(result1).toEqual(oops)
      const result2 = await a()
      expect(typeof result2.b).toEqual('function')
      expect(result2.b.input).toEqual({ value: 'retry' })
      return result2.b.input
    })
    expect(result).toEqual(successfulResult({ value: 'retry' }))
  })

  describe('errors', () => {
    // test('not last extension', async () => {
    //   const result = await run(
    //     createRetryingInterceptor(async function foo({ a }) {
    //       return a()
    //     }),
    //     async function bar({ a }) {
    //       return a()
    //     },
    //   )
    //   expect(result).toMatchInlineSnapshot(`[ContextualError: Only the last extension can retry hooks.]`)
    //   expect((result as ContextualError).context).toMatchInlineSnapshot(`
    //     {
    //       "extensionsAfter": [
    //         {
    //           "name": "bar",
    //         },
    //       ],
    //     }
    //   `)
    // })
    test('call hook twice even though it succeeded the first time', async () => {
      let neverRan = true
      const result = await runRetrying(
        async function foo({ a }) {
          const result1 = await a()
          expect('b' in result1).toBe(true)
          await a() // <-- Extension bug here under test.
          neverRan = false
        },
      )
      expect(neverRan).toBe(true)
      expect(result).toMatchInlineSnapshot(
        `[ContextualError: There was an error in the interceptor "foo".]`,
      )
      expect((result as ContextualError).context).toMatchInlineSnapshot(
        `
        {
          "hookName": "a",
          "interceptorName": "foo",
          "source": "extension",
        }
      `,
      )
      expect((result as ContextualError).cause).toMatchInlineSnapshot(
        `[ContextualError: Only after failure can a hook be called again by a retrying extension.]`,
      )
    })
  })
})

describe('slots', () => {
  test('have defaults that are called by default', async () => {
    await run()
    expect(pipeline.stepsIndex.get('a')?.slots.append.mock.calls[0]).toMatchObject(['a'])
    expect(pipeline.stepsIndex.get('b')?.slots.append.mock.calls[0]).toMatchObject(['b'])
  })
  test('extension can provide own function to slot on just one of a set of hooks', async () => {
    const result = await run(async ({ a }) => {
      return a({ using: { append: () => 'x' } })
    })
    expect(pipeline.stepsIndex.get('a')?.slots.append).not.toBeCalled()
    expect(pipeline.stepsIndex.get('b')?.slots.append.mock.calls[0]).toMatchObject(['b'])
    expect(result).toEqual(successfulResult({ value: 'initial+x+b' }))
  })
  test('extension can provide own functions to slots on multiple of a set of hooks', async () => {
    const result = await run(async ({ a }) => {
      return a({ using: { append: () => 'x', appendExtra: () => '+x2' } })
    })
    expect(result).toEqual(successfulResult({ value: 'initial+x+x2+b' }))
  })
  // todo hook with two slots
  test('two extensions can each provide own function to same slot on just one of a set of hooks, and the later one wins', async () => {
    const result = await run(async ({ a }) => {
      const { b } = await a({ using: { append: () => 'x' } })
      return b({ using: { append: () => 'y' } })
    })
    expect(pipeline.stepsIndex.get('a')?.slots.append).not.toBeCalled()
    expect(pipeline.stepsIndex.get('b')?.slots.append).not.toBeCalled()
    expect(result).toEqual(successfulResult({ value: 'initial+x+y' }))
  })
})

describe('step runner parameter - previous', () => {
  test('contains inputs of previous hooks', async () => {
    await run(async ({ a }) => {
      return a()
    })
    expect(pipeline.stepsIndex.get('a')?.run.mock.calls[0]?.[2]).toEqual({})
    expect(pipeline.stepsIndex.get('b')?.run.mock.calls[0]?.[2]).toEqual({ a: { input: initialInput2 } })
  })

  test('contains the final input actually passed to the hook', async () => {
    const customInput = { value: 'custom' }
    await run(async ({ a }) => {
      return a({ input: customInput })
    })
    expect(pipeline.stepsIndex.get('a')?.run.mock.calls[0]?.[2]).toEqual({})
    expect(pipeline.stepsIndex.get('b')?.run.mock.calls[0]?.[2]).toEqual({ a: { input: customInput } })
  })
})

describe('overloads', () => {
  const discriminant1 = { name: 'x', value: 1 } as const
  const discriminant2 = { name: 'x', value: 2 } as const
  test('overloaded step runners are run', async () => {
    const p = PipelineDefinition
      .create()
      .input<{ value: string }>()
      .step('a')
      .step('b')
      .overload(o =>
        o
          .create({ discriminant: discriminant1 })
          .step('a', {
            // todo make it a type error to not propagate the discriminant
            run: (input) => ({ ...input, value: input.value + '+a' }),
          })
          .step('b', {
            run: (input) => ({ value: input.value + '+b' }),
          })
      )
      .type
    const exP = Pipeline.create(p)
    const result = await PipelineDefinition.run(exP, { initialInput: { value: 'initial', x: 1 } })
    expect(result).toEqual(successfulResult({ value: 'initial+a+b' }))
  })
  test('two overloads can be used; runtime discriminant decides which one is used', async () => {
    const p = PipelineDefinition
      .create()
      .input<{ value: string }>()
      .step('a')
      .step('b')
      .overload(o =>
        o.create({ discriminant: discriminant1 })
          .step('a', { run: (input) => ({ ...input, value: input.value + '+a' }) })
          .step('b', { run: (input) => ({ value: input.value + '+b' }) })
      )
      .overload(o =>
        o
          .create({ discriminant: discriminant2 })
          .step('a', { run: (input) => ({ ...input, value: input.value + '+a2' }) })
          .step('b', { run: (input) => ({ value: input.value + '+b2' }) })
      )
      .type
    const exP = Pipeline.create(p)
    const result1 = await PipelineDefinition.run(exP, { initialInput: { value: 'initial', x: 1 } })
    expect(result1).toEqual(successfulResult({ value: 'initial+a+b' }))
    const result2 = await PipelineDefinition.run(exP, { initialInput: { value: 'initial', x: 2 } })
    expect(result2).toEqual(successfulResult({ value: 'initial+a2+b2' }))
  })
})
