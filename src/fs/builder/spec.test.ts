import type { Fn } from '#fn'
import { Test } from '#test'
import { describe, expect } from 'vitest'
import { spec, type SpecBuilder } from './spec.js'

type Ops = Fn.endo<SpecBuilder>

describe('operations accumulation', () => {
  // dprint-ignore
  Test.describe('accumulates operations')
    .inputType<{ ops: Ops }>()
    .outputType<{ types: string[]; count: number }>()
    .cases(
      [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A').file('b.md', '#').file('c.json', {}) }, { count: 3, types: ['file', 'file', 'file'] }],
      [{ ops: (s: SpecBuilder) => s.dir('empty/').dir('nested/', (d: SpecBuilder) => d.file('inner.txt', 'nested')) }, { count: 2, types: ['dir', 'dir'] }],
      [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A').dir('b/').remove('c.txt').clear('d/').move('e.md', 'f.md') }, { count: 5, types: ['file', 'dir', 'remove', 'clear', 'move-file'] }],
    )
    .test(({ input, output }) => {
      const s = input.ops(spec('/test/'))
      expect(s.operations).toHaveLength(output.count)
      expect(s.operations.map(op => op.type)).toEqual(output.types)
    })
})

describe('immutability', () => {
  Test.describe('returns new spec on each operation')
    .inputType<{ ops: Ops }>()
    .outputType<void>()
    .cases(
      [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A') }],
      [{ ops: (s: SpecBuilder) => s.dir('a/') }],
    )
    .test(({ input }) => {
      const s1 = spec('/test/')
      const s2 = input.ops(s1)
      const s3 = input.ops(s2)

      expect(s1).not.toBe(s2)
      expect(s2).not.toBe(s3)
      expect(s1.operations).toHaveLength(0)
      expect(s2.operations).toHaveLength(1)
      expect(s3.operations).toHaveLength(2)
    })
})

describe('conditional operations', () => {
  // dprint-ignore
  Test.describe('conditional inclusion')
    .inputType<{ cond: boolean; method: 'when' | 'unless' }>()
    .outputType<{ count: number }>()
    .cases(
      [{ cond: true,  method: 'when' },   { count: 1 }],
      [{ cond: false, method: 'when' },   { count: 0 }],
      [{ cond: true,  method: 'unless' }, { count: 0 }],
      [{ cond: false, method: 'unless' }, { count: 1 }],
    )
    .test(({ input, output }) => {
      const s = spec('/test/')[input.method](input.cond, d => d.file('conditional.txt', 'yes'))
      expect(s.operations).toHaveLength(output.count)
      if (output.count === 1) {
        expect(s.operations[0]).toMatchObject({ type: 'file', content: 'yes' })
      }
    })
})

describe('withBase', () => {
  Test.describe('changes base directory')
    .inputType<{ from: string; to: string }>()
    .outputType<void>()
    .cases(
      [{ from: '/project1/', to: '/project2/' }],
      [{ from: '/', to: '/subdir/' }],
      [{ from: '/subdir/', to: '/' }],
    )
    .test(({ input }) => {
      const s1 = spec(input.from).file('test.txt', 'content')
      const s2 = s1.withBase(input.to)

      expect(s1.base).not.toBe(s2.base)
      expect(s1.base.segments).toEqual(input.from === '/' ? [] : [input.from.slice(1, -1)])
      expect(s2.base.segments).toEqual(input.to === '/' ? [] : [input.to.slice(1, -1)])
      expect(s1.operations).toEqual(s2.operations)
    })
})

describe('merge', () => {
  Test.describe('combines specs')
    .inputType<{ count: number }>()
    .outputType<void>()
    .cases(
      [{ count: 2 }],
      [{ count: 3 }],
      [{ count: 5 }],
    )
    .test(({ input }) => {
      const specs = Array.from({ length: input.count }, (_, idx) => spec('/test/').file(`${idx}.txt`, `content${idx}`))

      const merged = specs[0]!.merge(...specs.slice(1))

      expect(merged.operations).toHaveLength(input.count)
      merged.operations.forEach((op, idx) => {
        expect(op).toMatchObject({
          type: 'file',
          content: `content${idx}`,
        })
      })
    })
})

describe('nested directories', () => {
  Test.describe('nesting depth')
    .inputType<{ depth: number }>()
    .outputType<void>()
    .cases(
      [{ depth: 1 }],
      [{ depth: 3 }],
      [{ depth: 5 }],
    )
    .test(({ input }) => {
      const buildNested = (depth: number): Fn.endo<SpecBuilder> =>
        depth === 0
          ? d => d.file('deep.txt', 'content')
          : d => d.dir(`level${depth}/`, buildNested(depth - 1))

      const s = buildNested(input.depth)(spec('/test/'))

      // Verify nesting structure
      let current: any = s.operations[0]
      for (let level = input.depth; level > 0; level--) {
        expect(current.type).toBe('dir')
        expect(current.operations).toHaveLength(1)
        current = current.operations[0]
      }
      expect(current.type).toBe('file')
      expect(current.content).toBe('content')
    })
})

describe('path types', () => {
  // dprint-ignore
  Test.describe('file extensions')
    .inputType<{ path: string }>()
    .outputType<{ expectedType: string }>()
    .cases(
      [{ path: 'text.txt' },    { expectedType: 'file' }],
      [{ path: 'data.json' },   { expectedType: 'file' }],
      [{ path: 'code.ts' },     { expectedType: 'file' }],
      [{ path: 'README.md' },   { expectedType: 'file' }], // Changed to have extension
      [{ path: 'config.env' },  { expectedType: 'file' }], // Changed to have extension
      [{ path: 'folder/' },     { expectedType: 'dir' }],
    )
    .test(({ input, output }) => {
      const s = spec('/test/')
      const result = input.path.endsWith('/')
        ? s.dir(input.path as `${string}/`)
        : s.file(input.path as `${string}.${string}`, 'content')

      expect(result.operations).toHaveLength(1)
      expect(result.operations[0]!.type).toBe((output as any).expectedType)
    })

  // dprint-ignore
  Test.describe('move operations')
    .inputType<{ from: string; to: string }>()
    .outputType<{ expectedType: string }>()
    .cases(
      [{ from: 'old.txt', to: 'new.txt' },   { expectedType: 'move-file' }],
      [{ from: 'old/',    to: 'new/' },      { expectedType: 'move-dir' }],
    )
    .test(({ input, output }) => {
      const s = spec('/test/').move(input.from as any, input.to as any)
      expect(s.operations).toHaveLength(1)
      expect(s.operations[0]!.type).toBe((output as any).expectedType)
    })
})

describe('add method', () => {
  // dprint-ignore
  Test.describe('dynamic paths')
    .inputType<{ path: string; content?: any; builder?: Fn.endo<SpecBuilder> }>()
    .outputType<{ type: string }>()
    .cases(
      [{ path: 'file.txt', content: 'text' },                           { type: 'file' }],
      [{ path: 'dir/' },                                                { type: 'dir' }],
      [{ path: 'dir/', builder: (d: SpecBuilder) => d.file('inner.txt', 'content') }, { type: 'dir' }],
    )
    .test(({ input, output }) => {
      const s = input.builder
        ? spec('/test/').add(input.path as any, input.builder)
        : input.content !== undefined
        ? spec('/test/').add(input.path as any, input.content)
        : spec('/test/').add(input.path as any)

      expect(s.operations).toHaveLength(1)
      expect(s.operations[0]!.type).toBe(output.type)

      if (input.builder) {
        expect((s.operations[0] as any).operations).toHaveLength(1)
      }
    })
})

describe('edge cases', () => {
  // dprint-ignore
  Test.describe('base paths')
    .inputType<{ base: string }>()
    .outputType<{ segmentCount: number }>()
    .cases(
      [{ base: '/' },         { segmentCount: 0 }],
      [{ base: '/test/' },    { segmentCount: 1 }],
      [{ base: '/a/b/c/' },   { segmentCount: 3 }],
    )
    .test(({ input, output }) => {
      const s = spec(input.base)
      expect(s.operations).toHaveLength(0)
      expect(s.base.segments).toHaveLength(output.segmentCount)
    })

  // dprint-ignore
  Test.describe('special characters')
    .inputType<{ path: string }>()
    .outputType<void>()
    .cases(
      [{ path: 'file-with-dash.txt' }],
      [{ path: 'file_underscore.txt' }],
      [{ path: 'file.test.spec.txt' }],
      [{ path: '"file with space.txt"' }],
    )
    .test(({ input }) => {
      expect(() => spec('/test/').file(input.path as any, 'content')).not.toThrow()
    })
})

describe('JSON content inference', () => {
  Test.describe('content types')
    .inputType<{ file: string; content: any }>()
    .outputType<void>()
    .cases(
      [{ file: 'config.json', content: { key: 'value' } }],
      [{ file: 'data.json', content: '{"raw": "json"}' }],
      [{ file: 'any.xyz', content: 'plain text' }],
    )
    .test(({ input }) => {
      const s = spec('/test/').file(input.file as any, input.content)
      expect(s.operations).toHaveLength(1)
      expect((s.operations[0] as any).content).toEqual(input.content)
    })
})
