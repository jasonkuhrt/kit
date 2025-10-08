import { Test } from '#test'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { Analyzer } from './$.js'

describe('Analyzer', () => {
  describe('analyze', () => {
    // dprint-ignore
    Test.describe('path analysis')
      .inputType<string>()
      .outputType<{
        _tag: 'file' | 'dir'
        pathType?: 'absolute' | 'relative'
        path?: string[]
        file?: { stem: string; extension: string | null }
      }>()
      .cases(
        // Files with extensions
        ['file with extension',           ['file.txt'],          { _tag: 'file', file: { stem: 'file', extension: '.txt' } }],
        ['multiple dots in filename',     ['file.test.ts'],      { _tag: 'file', file: { stem: 'file.test', extension: '.ts' } }],
        ['hidden file with extension',    ['.env.local'],        { _tag: 'file', file: { stem: '.env', extension: '.local' } }],

        // Directories
        ['directory with trailing slash', ['dir/'],             { _tag: 'dir', path: ['dir'] }],
        ['directory without extension',   ['src'],              { _tag: 'dir', path: ['src'] }],
        ['hidden file without extension', ['.gitignore'],       { _tag: 'dir' }], // No extension = directory
        ['root directory',                ['/'],                { _tag: 'dir', path: [] }],
        ['current directory dot',         ['.'],                { _tag: 'dir' }],
        ['current directory dot slash',   ['./'],               { _tag: 'dir' }],
        ['parent directory',              ['..'],               { _tag: 'dir' }],

        // Absolute vs relative paths
        ['absolute file path',            ['/path/file.txt'],   { _tag: 'file', pathType: 'absolute', file: { stem: 'file', extension: '.txt' } }],
        ['relative file path',            ['./path/file.txt'],  { _tag: 'file', pathType: 'relative', file: { stem: 'file', extension: '.txt' } }],
      )
      .test(( i, o ) => {
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
        expect(result.file.stem).toBe(o.file.stem)
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
