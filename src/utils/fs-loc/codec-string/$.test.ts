import { Test } from '#test'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { Analyzer } from './$.js'

describe('Analyzer', () => {
  describe('analyze', () => {
    // dprint-ignore
    Test.Table.suite<
      string,
      {
        _tag: 'file' | 'dir'
        pathType?: 'absolute' | 'relative'
        path?: string[]
        file?: { name: string; extension: string | null }
      }
    >('path analysis', [
      // Files with extensions
      { n: 'file with extension',           i: 'file.txt',          o: { _tag: 'file', file: { name: 'file', extension: '.txt' } } },
      { n: 'multiple dots in filename',     i: 'file.test.ts',      o: { _tag: 'file', file: { name: 'file.test', extension: '.ts' } } },
      { n: 'hidden file with extension',    i: '.env.local',        o: { _tag: 'file', file: { name: '.env', extension: '.local' } } },

      // Directories
      { n: 'directory with trailing slash', i: 'dir/',             o: { _tag: 'dir', path: ['dir'] } },
      { n: 'directory without extension',   i: 'src',              o: { _tag: 'dir', path: ['src'] } },
      { n: 'hidden file without extension', i: '.gitignore',       o: { _tag: 'dir' } }, // No extension = directory
      { n: 'root directory',                i: '/',                o: { _tag: 'dir', path: [] } },
      { n: 'current directory dot',         i: '.',                o: { _tag: 'dir' } },
      { n: 'current directory dot slash',   i: './',               o: { _tag: 'dir' } },
      { n: 'parent directory',              i: '..',               o: { _tag: 'dir' } },

      // Absolute vs relative paths
      { n: 'absolute file path',            i: '/path/file.txt',   o: { _tag: 'file', pathType: 'absolute', file: { name: 'file', extension: '.txt' } } },
      { n: 'relative file path',            i: './path/file.txt',  o: { _tag: 'file', pathType: 'relative', file: { name: 'file', extension: '.txt' } } },
    ], ({ i, o }) => {
      const result = Analyzer.analyze(i)

      expect(result._tag).toBe(o._tag)

      if (o.pathType) {
        expect(result.pathType).toBe(o.pathType)
        if (o.pathType === 'absolute') {
          expect(result.isPathAbsolute).toBe(true)
        } else {
          expect(result.isPathRelative).toBe(true)
        }
      }

      if (o.path !== undefined) {
        expect(result.path).toEqual(o.path)
      }

      if (o.file && result._tag === 'file') {
        expect(result.file.name).toBe(o.file.name)
        expect(result.file.extension).toBe(o.file.extension)
      }
    })
  })

  describe('type-level tests', () => {
    it('file with extension type', () => {
      type R = Analyzer.Analyze<'file.txt'>
      expectTypeOf<R['_tag']>().toEqualTypeOf<'file'>()
    })

    it('directory with trailing slash type', () => {
      type R = Analyzer.Analyze<'dir/'>
      expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
    })

    it('directory without extension type', () => {
      type R = Analyzer.Analyze<'src'>
      expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
    })

    it('absolute vs relative paths type', () => {
      type Abs = Analyzer.Analyze<'/path/file.txt'>
      type Rel = Analyzer.Analyze<'./path/file.txt'>
      expectTypeOf<Abs['pathType']>().toEqualTypeOf<'absolute'>()
      expectTypeOf<Rel['pathType']>().toEqualTypeOf<'relative'>()
    })

    it('special directory paths type', () => {
      type Dot = Analyzer.Analyze<'.'>
      type DotSlash = Analyzer.Analyze<'./'>
      type DotDot = Analyzer.Analyze<'..'>
      expectTypeOf<Dot['_tag']>().toEqualTypeOf<'dir'>()
      expectTypeOf<DotSlash['_tag']>().toEqualTypeOf<'dir'>()
      expectTypeOf<DotDot['_tag']>().toEqualTypeOf<'dir'>()
    })

    it('hidden files type', () => {
      type NoExt = Analyzer.Analyze<'.gitignore'>
      type WithExt = Analyzer.Analyze<'.env.local'>
      expectTypeOf<NoExt['_tag']>().toEqualTypeOf<'dir'>()
      expectTypeOf<WithExt['_tag']>().toEqualTypeOf<'file'>()
    })

    it('multiple dots in filename type', () => {
      type R = Analyzer.Analyze<'file.test.ts'>
      expectTypeOf<R['_tag']>().toEqualTypeOf<'file'>()
    })

    it('root directory type', () => {
      type R = Analyzer.Analyze<'/'>
      expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
    })
  })

  it('non-literal string returns Analysis union', () => {
    function processPath(path: string) {
      const result = Analyzer.analyze(path)
      // With non-literal string, should return the union type
      expectTypeOf(result).toEqualTypeOf<Analyzer.Analysis>()
      return result
    }

    // Runtime still works correctly
    const result = processPath('file.txt')
    expect(result._tag).toBe('file')
  })
})
