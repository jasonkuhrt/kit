import { Test } from '#test'
import { expect } from 'vitest'
import { create, StateSymbol } from './constructor.js'
import type { State } from './state.js'

// Example 1: Simple counter builder
interface CounterState extends State {
  count: number
}

const counterBuilder = create({
  initial: { count: 0 },
  methods: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    add: (state, n: number) => ({ ...state, count: state.count + n }),
  },
  terminal: {
    build: (state) => state.count,
  },
})

Test.describe('Builder > simple counter')
  .inputType<{ operations: Array<'inc' | 'dec' | number> }>()
  .outputType<number>()
  .cases(
    [{ operations: ['inc', 'inc', 'inc'] }, 3],
    [{ operations: ['inc', 5, 'dec'] }, 5],
    [{ operations: [10, 'dec', 'dec'] }, 8],
    [{ operations: [] }, 0],
  )
  .test(({ input, output }) => {
    let builder = counterBuilder
    for (const op of input.operations) {
      if (op === 'inc') builder = builder.increment()
      else if (op === 'dec') builder = builder.decrement()
      else builder = builder.add(op)
    }
    expect(builder.build()).toBe(output)
  })

// Example 2: Configuration builder
interface ConfigState extends State {
  name: string
  enabled: boolean
  items: string[]
}

const configBuilder = create({
  initial: { name: '', enabled: false, items: [] } as ConfigState,
  methods: {
    setName: (state, name: string) => ({ ...state, name }),
    enable: (state) => ({ ...state, enabled: true }),
    disable: (state) => ({ ...state, enabled: false }),
    addItem: (state, item: string) => ({
      ...state,
      items: [...state.items, item],
    }),
  },
  terminal: {
    build: (state) => state,
  },
})

Test.describe('Builder > configuration builder')
  .inputType<{}>()
  .outputType<ConfigState>()
  .cases(
    [{}, {
      name: 'MyConfig',
      enabled: true,
      items: ['first', 'second'],
    }],
  )
  .test(({ output }) => {
    const result = configBuilder
      .setName('MyConfig')
      .enable()
      .addItem('first')
      .addItem('second')
      .build()

    expect(result).toEqual(output)
  })

// Example 3: Immutability test
Test.describe('Builder > immutability')
  .inputType<{}>()
  .outputType<{ originalCount: number; modifiedCount: number }>()
  .cases([{}, { originalCount: 0, modifiedCount: 2 }])
  .test(({ output }) => {
    const original = counterBuilder
    const modified = original.increment().increment()
    const originalCount = original.build()
    const modifiedCount = modified.build()
    expect(originalCount).toBe(output.originalCount) // Original unchanged
    expect(modifiedCount).toBe(output.modifiedCount) // Modified has changes
  })

// Example 4: Symbol-based state access
Test.describe('Builder > symbol state access')
  .inputType<{}>()
  .outputType<number>()
  .cases([{}, 3])
  .test(({ output }) => {
    const builder = counterBuilder.increment().increment().increment()
    const state = builder[StateSymbol]
    expect(state.count).toBe(output)
  })

// Example 5: Methods that don't return state (implicit continue)
interface TaskState extends State {
  tasks: string[]
  completed: string[]
}

const taskBuilder = create({
  initial: { tasks: [], completed: [] } as TaskState,
  methods: {
    addTask: (state, task: string) => ({
      ...state,
      tasks: [...state.tasks, task],
    }),
    complete: (state, task: string) => ({
      ...state,
      tasks: state.tasks.filter((t) => t !== task),
      completed: [...state.completed, task],
    }),
  },
  terminal: {
    build: (state) => state,
    getTasks: (state) => state.tasks,
    getCompleted: (state) => state.completed,
  },
})

Test.describe('Builder > task manager')
  .inputType<{}>()
  .outputType<{ tasks: string[]; completed: string[] }>()
  .cases([{}, { tasks: ['Write docs'], completed: ['Write tests'] }])
  .test(({ output }) => {
    const builder = taskBuilder
      .addTask('Write tests')
      .addTask('Write docs')
      .complete('Write tests')

    expect(builder.getTasks()).toEqual(output.tasks)
    expect(builder.getCompleted()).toEqual(output.completed)
  })

// Example 6: Terminal methods can have different return types
interface CalculatorState extends State {
  value: number
}

const calculator = create({
  initial: { value: 0 },
  methods: {
    add: (state, n: number) => ({ ...state, value: state.value + n }),
    multiply: (state, n: number) => ({ ...state, value: state.value * n }),
  },
  terminal: {
    result: (state) => state.value,
    format: (state, decimals: number) => state.value.toFixed(decimals),
    isPositive: (state) => state.value > 0,
  },
})

Test.describe('Builder > terminal method types')
  .inputType<{ method: 'result' | 'format' | 'isPositive' }>()
  .outputType<number | string | boolean>()
  .cases(
    [{ method: 'result' }, 15],
    [{ method: 'format' }, '15.00'],
    [{ method: 'isPositive' }, true],
  )
  .test(({ input, output }) => {
    const builder = calculator.add(10).multiply(1.5)
    if (input.method === 'result') expect(builder.result()).toBe(output)
    else if (input.method === 'format') expect(builder.format(2)).toBe(output)
    else expect(builder.isPositive()).toBe(output)
  })
