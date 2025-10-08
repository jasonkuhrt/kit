import { Test } from '#test'
import { describe, expect } from 'vitest'

describe('onSetup', () => {
  // dprint-ignore
  Test
    .describe('with generic mode')
    .inputType<number>()
    .outputType<{ value: number }>()
    .onSetup(() => ({ multiplier: 2 }))
    .cases(
      ({ multiplier }) => [[5], { value: 5 * multiplier }],
      ({ multiplier }) => [[10], { value: 10 * multiplier }],
    )
    .test((input, expected) => {
      expect({ value: input * 2 }).toEqual(expected)
    })

  // dprint-ignore
  Test
    .on((x: number) => x * 2)
    .onSetup(() => ({ base: 10 }))
    .cases(
      ({ base }) => [[base], 20],
      ({ base }) => [[base + 5], 30],
    )
    .test()

  // Multiple onSetup calls - contexts merge
  // dprint-ignore
  Test
    .describe('multiple onSetup')
    .inputType<number>()
    .outputType<number>()
    .onSetup(() => ({ a: 1 }))
    .onSetup(() => ({ b: 2 }))
    .cases(
      ({ a, b }) => [[a + b], a + b],
    )
    .test((input, expected) => {
      expect(input).toBe(expected)
    })
})
