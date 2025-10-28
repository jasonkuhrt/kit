import { Test } from '#test'
import { expect } from 'vitest'
import { create, StateSymbol } from './constructor.js'
import type { State } from './state.js'

interface CounterState extends State {
  count: number
}

const counter = create({
  initial: { count: 0 },
  methods: {
    inc: (state) => ({ ...state, count: state.count + 1 }),
    dec: (state) => ({ ...state, count: state.count - 1 }),
    add: (state, n: number) => ({ ...state, count: state.count + n }),
  },
  terminal: {
    value: (state) => state.count,
  },
})

interface ConfigState extends State {
  name: string
  items: string[]
}

const config = create({
  initial: { name: '', items: [] } as ConfigState,
  methods: {
    name: (state, name: string) => ({ ...state, name }),
    item: (state, item: string) => ({ ...state, items: [...state.items, item] }),
  },
  terminal: {
    build: (state) => state,
  },
})

Test.describe('Builder')
  .inputType<{ ops: Array<'inc' | 'dec' | number> }>()
  .outputType<number>()
  .cases(
    [{ ops: ['inc', 'inc', 'inc'] }, 3],
    [{ ops: ['inc', 5, 'dec'] }, 5],
    [{ ops: [10, 'dec', 'dec'] }, 8],
    [{ ops: [] }, 0],
  )
  .test(({ input, output }) => {
    let b = counter
    for (const op of input.ops) {
      if (op === 'inc') b = b.inc()
      else if (op === 'dec') b = b.dec()
      else b = b.add(op)
    }
    expect(b.value()).toBe(output)
  })

Test.describe('Builder > immutability')
  .inputType<{}>()
  .outputType<[number, number]>()
  .cases([{}, [0, 2]])
  .test(({ output }) => {
    const original = counter
    const modified = original.inc().inc()
    expect([original.value(), modified.value()]).toEqual(output)
  })

Test.describe('Builder > symbol state')
  .inputType<{}>()
  .outputType<number>()
  .cases([{}, 3])
  .test(({ output }) => {
    expect(counter.inc().inc().inc()[StateSymbol].count).toBe(output)
  })

Test.describe('Builder > complex state')
  .inputType<{}>()
  .outputType<ConfigState>()
  .cases([{}, { name: 'Test', items: ['a', 'b'] }])
  .test(({ output }) => {
    expect(config.name('Test').item('a').item('b').build()).toEqual(output)
  })

Test.describe('Builder > terminal types')
  .inputType<{ method: 'value' | 'format' | 'positive' }>()
  .outputType<number | string | boolean>()
  .cases(
    [{ method: 'value' }, 15],
    [{ method: 'format' }, '15.00'],
    [{ method: 'positive' }, true],
  )
  .test(({ input, output }) => {
    const calc = create({
      initial: { value: 0 },
      methods: {
        add: (state, n: number) => ({ ...state, value: state.value + n }),
        mul: (state, n: number) => ({ ...state, value: state.value * n }),
      },
      terminal: {
        value: (state) => state.value,
        format: (state, decimals: number) => state.value.toFixed(decimals),
        positive: (state) => state.value > 0,
      },
    })
    const b = calc.add(10).mul(1.5)
    if (input.method === 'value') expect(b.value()).toBe(output)
    else if (input.method === 'format') expect(b.format(2)).toBe(output)
    else expect(b.positive()).toBe(output)
  })
