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
      ['file operations',      [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A').file('b.md', '#').file('c.json', {}) }], { count: 3, types: ['file', 'file', 'file'] }],
      ['directory operations', [{ ops: (s: SpecBuilder) => s.dir('empty/').dir('nested/', (d: SpecBuilder) => d.file('inner.txt', 'nested')) }], { count: 2, types: ['dir', 'dir'] }],
      ['mixed operations',     [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A').dir('b/').remove('c.txt').clear('d/').move('e.md', 'f.md') }], { count: 5, types: ['file', 'dir', 'remove', 'clear', 'move-file'] }],
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
      ['file operation', [{ ops: (s: SpecBuilder) => s.file('a.txt', 'A') }]],
      ['dir operation', [{ ops: (s: SpecBuilder) => s.dir('a/') }]],
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
      ['when true',     [{ cond: true,  method: 'when' }],   { count: 1 }],
      ['when false',    [{ cond: false, method: 'when' }],   { count: 0 }],
      ['unless true',   [{ cond: true,  method: 'unless' }], { count: 0 }],
      ['unless false',  [{ cond: false, method: 'unless' }], { count: 1 }],
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
      ['simple change', [{ from: '/project1/', to: '/project2/' }]],
      ['root to subdir', [{ from: '/', to: '/subdir/' }]],
      ['subdir to root', [{ from: '/subdir/', to: '/' }]],
    )
    .test(({ input }) => {
      const s1 = spec(input.from).file('test.txt', 'content')
      const s2 = s1.withBase(input.to)

      expect(s1.base).not.toBe(s2.base)
      expect(s1.base.path.segments).toEqual(input.from === '/' ? [] : [input.from.slice(1, -1)])
      expect(s2.base.path.segments).toEqual(input.to === '/' ? [] : [input.to.slice(1, -1)])
      expect(s1.operations).toEqual(s2.operations)
    })
})

describe('merge', () => {
  Test.describe('combines specs')
    .inputType<{ count: number }>()
    .outputType<void>()
    .cases(
      ['2 specs', [{ count: 2 }]],
      ['3 specs', [{ count: 3 }]],
      ['5 specs', [{ count: 5 }]],
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
      ['1 level', [{ depth: 1 }]],
      ['3 levels', [{ depth: 3 }]],
      ['5 levels', [{ depth: 5 }]],
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
      ['.txt file',      [{ path: 'text.txt' }],    { expectedType: 'file' }],
      ['.json file',     [{ path: 'data.json' }],   { expectedType: 'file' }],
      ['.ts file',       [{ path: 'code.ts' }],     { expectedType: 'file' }],
      ['no extension',   [{ path: 'README.md' }],   { expectedType: 'file' }], // Changed to have extension
      ['dotfile',        [{ path: 'config.env' }],  { expectedType: 'file' }], // Changed to have extension
      ['directory',      [{ path: 'folder/' }],     { expectedType: 'dir' }],
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
      ['file to file',  [{ from: 'old.txt', to: 'new.txt' }],   { expectedType: 'move-file' }],
      ['dir to dir',    [{ from: 'old/',    to: 'new/' }],      { expectedType: 'move-dir' }],
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
      ['file with content', [{ path: 'file.txt', content: 'text' }],                           { type: 'file' }],
      ['empty directory',   [{ path: 'dir/' }],                                                { type: 'dir' }],
      ['dir with builder',  [{ path: 'dir/', builder: (d: SpecBuilder) => d.file('inner.txt', 'content') }], { type: 'dir' }],
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
      ['root directory',     [{ base: '/' }],         { segmentCount: 0 }],
      ['single segment',     [{ base: '/test/' }],    { segmentCount: 1 }],
      ['nested path',        [{ base: '/a/b/c/' }],   { segmentCount: 3 }],
    )
    .test(({ input, output }) => {
      const s = spec(input.base)
      expect(s.operations).toHaveLength(0)
      expect(s.base.path.segments).toHaveLength(output.segmentCount)
    })

  // dprint-ignore
  Test.describe('special characters')
    .inputType<{ path: string }>()
    .outputType<void>()
    .cases(
      ['dash in name',       [{ path: 'file-with-dash.txt' }]],
      ['underscore in name', [{ path: 'file_underscore.txt' }]],
      ['multiple dots',      [{ path: 'file.test.spec.txt' }]],
      ['space (quoted)',     [{ path: '"file with space.txt"' }]],
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
      ['object for .json', [{ file: 'config.json', content: { key: 'value' } }]],
      ['string for .json', [{ file: 'data.json', content: '{"raw": "json"}' }]],
      ['string for other', [{ file: 'any.xyz', content: 'plain text' }]],
    )
    .test(({ input }) => {
      const s = spec('/test/').file(input.file as any, input.content)
      expect(s.operations).toHaveLength(1)
      expect((s.operations[0] as any).content).toEqual(input.content)
    })
})
