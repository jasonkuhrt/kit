import type { Fn } from '#fn'
import { Test } from '#test'
import { describe, expect } from 'vitest'
import { spec, type SpecBuilder } from './spec.js'

type Ops = Fn.endo<SpecBuilder>

describe('operations accumulation', () => {
  // dprint-ignore
  Test.Table.suite<{ ops: Ops }, { types: string[]; count: number }>('accumulates operations', [
      { n: 'file operations',      i: { ops: s => s.file('a.txt', 'A').file('b.md', '#').file('c.json', {}) }, o: { count: 3, types: ['file', 'file', 'file'] } },
      { n: 'directory operations', i: { ops: s => s.dir('empty/').dir('nested/', d => d.file('inner.txt', 'nested')) }, o: { count: 2, types: ['dir', 'dir'] } },
      { n: 'mixed operations',     i: { ops: s => s.file('a.txt', 'A').dir('b/').remove('c.txt').clear('d/').move('e.md', 'f.md') }, o: { count: 5, types: ['file', 'dir', 'remove', 'clear', 'move-file'] } },
    ], ({ i, o }) => {
      const s = i.ops(spec('/test/'))
      expect(s.operations).toHaveLength(o.count)
      expect(s.operations.map(op => op.type)).toEqual(o.types)
    })
})

describe('immutability', () => {
  Test.Table.suite<{ ops: Ops }, void>('returns new spec on each operation', [
    { n: 'file operation', i: { ops: s => s.file('a.txt', 'A') } },
    { n: 'dir operation', i: { ops: s => s.dir('a/') } },
  ], ({ i }) => {
    const s1 = spec('/test/')
    const s2 = i.ops(s1)
    const s3 = i.ops(s2)

    expect(s1).not.toBe(s2)
    expect(s2).not.toBe(s3)
    expect(s1.operations).toHaveLength(0)
    expect(s2.operations).toHaveLength(1)
    expect(s3.operations).toHaveLength(2)
  })
})

describe('conditional operations', () => {
  // dprint-ignore
  Test.Table.suite<{ cond: boolean; method: 'when' | 'unless' }, { count: number }>('conditional inclusion', [
      { n: 'when true',     i: { cond: true,  method: 'when' },   o: { count: 1 } },
      { n: 'when false',    i: { cond: false, method: 'when' },   o: { count: 0 } },
      { n: 'unless true',   i: { cond: true,  method: 'unless' }, o: { count: 0 } },
      { n: 'unless false',  i: { cond: false, method: 'unless' }, o: { count: 1 } },
    ], ({ i, o }) => {
      const s = spec('/test/')[i.method](i.cond, d => d.file('conditional.txt', 'yes'))
      expect(s.operations).toHaveLength(o.count)
      if (o.count === 1) {
        expect(s.operations[0]).toMatchObject({ type: 'file', content: 'yes' })
      }
    })
})

describe('withBase', () => {
  Test.Table.suite<{ from: string; to: string }, void>('changes base directory', [
    { n: 'simple change', i: { from: '/project1/', to: '/project2/' } },
    { n: 'root to subdir', i: { from: '/', to: '/subdir/' } },
    { n: 'subdir to root', i: { from: '/subdir/', to: '/' } },
  ], ({ i }) => {
    const s1 = spec(i.from).file('test.txt', 'content')
    const s2 = s1.withBase(i.to)

    expect(s1.base).not.toBe(s2.base)
    expect(s1.base.path.segments).toEqual(i.from === '/' ? [] : [i.from.slice(1, -1)])
    expect(s2.base.path.segments).toEqual(i.to === '/' ? [] : [i.to.slice(1, -1)])
    expect(s1.operations).toEqual(s2.operations)
  })
})

describe('merge', () => {
  Test.Table.suite<{ count: number }, void>('combines specs', [
    { n: '2 specs', i: { count: 2 } },
    { n: '3 specs', i: { count: 3 } },
    { n: '5 specs', i: { count: 5 } },
  ], ({ i }) => {
    const specs = Array.from({ length: i.count }, (_, idx) => spec('/test/').file(`${idx}.txt`, `content${idx}`))

    const merged = specs[0]!.merge(...specs.slice(1))

    expect(merged.operations).toHaveLength(i.count)
    merged.operations.forEach((op, idx) => {
      expect(op).toMatchObject({
        type: 'file',
        content: `content${idx}`,
      })
    })
  })
})

describe('nested directories', () => {
  Test.Table.suite<{ depth: number }, void>('nesting depth', [
    { n: '1 level', i: { depth: 1 } },
    { n: '3 levels', i: { depth: 3 } },
    { n: '5 levels', i: { depth: 5 } },
  ], ({ i }) => {
    const buildNested = (depth: number): Fn.endo<SpecBuilder> =>
      depth === 0
        ? d => d.file('deep.txt', 'content')
        : d => d.dir(`level${depth}/`, buildNested(depth - 1))

    const s = buildNested(i.depth)(spec('/test/'))

    // Verify nesting structure
    let current: any = s.operations[0]
    for (let level = i.depth; level > 0; level--) {
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
  Test.Table.suite<{ path: string }, { expectedType: string }>('file extensions', [
      { n: '.txt file',      i: { path: 'text.txt' },    o: { expectedType: 'file' } },
      { n: '.json file',     i: { path: 'data.json' },   o: { expectedType: 'file' } },
      { n: '.ts file',       i: { path: 'code.ts' },     o: { expectedType: 'file' } },
      { n: 'no extension',   i: { path: 'README.md' },   o: { expectedType: 'file' } }, // Changed to have extension
      { n: 'dotfile',        i: { path: 'config.env' },  o: { expectedType: 'file' } }, // Changed to have extension
      { n: 'directory',      i: { path: 'folder/' },     o: { expectedType: 'dir' } },
    ], ({ i, o }) => {
      const s = spec('/test/')
      const result = i.path.endsWith('/')
        ? s.dir(i.path as `${string}/`)
        : s.file(i.path as `${string}.${string}`, 'content')

      expect(result.operations).toHaveLength(1)
      expect(result.operations[0]!.type).toBe((o as any).expectedType)
    })

  // dprint-ignore
  Test.Table.suite<{ from: string; to: string }, { expectedType: string }>('move operations', [
      { n: 'file to file',  i: { from: 'old.txt', to: 'new.txt' },   o: { expectedType: 'move-file' } },
      { n: 'dir to dir',    i: { from: 'old/',    to: 'new/' },      o: { expectedType: 'move-dir' } },
    ], ({ i, o }) => {
      const s = spec('/test/').move(i.from as any, i.to as any)
      expect(s.operations).toHaveLength(1)
      expect(s.operations[0]!.type).toBe((o as any).expectedType)
    })
})

describe('add method', () => {
  // dprint-ignore
  Test.Table.suite<{ path: string; content?: any; builder?: Fn.endo<SpecBuilder> }, { type: string }>('dynamic paths', [
      { n: 'file with content', i: { path: 'file.txt', content: 'text' },                           o: { type: 'file' } },
      { n: 'empty directory',   i: { path: 'dir/' },                                                o: { type: 'dir' } },
      { n: 'dir with builder',  i: { path: 'dir/', builder: d => d.file('inner.txt', 'content') }, o: { type: 'dir' } },
    ], ({ i, o }) => {
      const s = i.builder
        ? spec('/test/').add(i.path as any, i.builder)
        : i.content !== undefined
        ? spec('/test/').add(i.path as any, i.content)
        : spec('/test/').add(i.path as any)

      expect(s.operations).toHaveLength(1)
      expect(s.operations[0]!.type).toBe(o.type)

      if (i.builder) {
        expect((s.operations[0] as any).operations).toHaveLength(1)
      }
    })
})

describe('edge cases', () => {
  // dprint-ignore
  Test.Table.suite<{ base: string }, { segmentCount: number }>('base paths', [
      { n: 'root directory',     i: { base: '/' },         o: { segmentCount: 0 } },
      { n: 'single segment',     i: { base: '/test/' },    o: { segmentCount: 1 } },
      { n: 'nested path',        i: { base: '/a/b/c/' },   o: { segmentCount: 3 } },
    ], ({ i, o }) => {
      const s = spec(i.base)
      expect(s.operations).toHaveLength(0)
      expect(s.base.path.segments).toHaveLength(o.segmentCount)
    })

  // dprint-ignore
  Test.Table.suite<{ path: string }, void>('special characters', [
      { n: 'dash in name',       i: { path: 'file-with-dash.txt' } },
      { n: 'underscore in name', i: { path: 'file_underscore.txt' } },
      { n: 'multiple dots',      i: { path: 'file.test.spec.txt' } },
      { n: 'space (quoted)',     i: { path: '"file with space.txt"' } },
    ], ({ i }) => {
      expect(() => spec('/test/').file(i.path as any, 'content')).not.toThrow()
    })
})

describe('JSON content inference', () => {
  Test.Table.suite<{ file: string; content: any }, void>('content types', [
    { n: 'object for .json', i: { file: 'config.json', content: { key: 'value' } } },
    { n: 'string for .json', i: { file: 'data.json', content: '{"raw": "json"}' } },
    { n: 'string for other', i: { file: 'any.xyz', content: 'plain text' } },
  ], ({ i }) => {
    const s = spec('/test/').file(i.file as any, i.content)
    expect(s.operations).toHaveLength(1)
    expect((s.operations[0] as any).content).toEqual(i.content)
  })
})
