import { Test } from '#test'
import { Ts } from '#ts'
import { describe, expect, it } from 'vitest'
import { Analyzer } from './$.js'

const A = Ts.Assert.exact.ofAs

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
        ['file.txt',          { _tag: 'file', file: { stem: 'file', extension: '.txt' } }],
        ['file.test.ts',      { _tag: 'file', file: { stem: 'file.test', extension: '.ts' } }],
        ['.env.local',        { _tag: 'file', file: { stem: '.env', extension: '.local' } }],

        // Directories
        ['dir/',             { _tag: 'dir', path: ['dir'] }],
        ['src',              { _tag: 'dir', path: ['src'] }],
        ['.gitignore',       { _tag: 'dir' }], // No extension = directory
        ['/',                { _tag: 'dir', path: [] }],
        ['.', { _tag: 'dir' }],
        ['./', { _tag: 'dir' }],
        ['..', { _tag: 'dir' }],

        // Absolute vs relative paths
        ['/path/file.txt',   { _tag: 'file', pathType: 'absolute', file: { stem: 'file', extension: '.txt' } }],
        ['./path/file.txt',  { _tag: 'file', pathType: 'relative', file: { stem: 'file', extension: '.txt' } }],
      )
      .test(({ input, output }) => {
      const result = Analyzer.analyze(input)

      expect(result._tag).toBe(output._tag)

      if (output.pathType) {
        expect(result.pathType).toBe(output.pathType)
        if (output.pathType === 'absolute') {
          expect(result.isPathAbsolute).toBe(true)
        } else {
          expect(result.isPathRelative).toBe(true)
        }
      }

      if (output.path !== undefined) {
        expect(result.path).toEqual(output.path)
      }

      if (output.file && result._tag === 'file') {
        expect(result.file.stem).toBe(output.file.stem)
        expect(result.file.extension).toBe(output.file.extension)
      }
      })
  })

  describe('type-level tests', () => {
    it('file with extension type', () => {
      type R = Analyzer.Analyze<'file.txt'>
      A<'file'>().onAs<R['_tag']>()
    })

    it('directory with trailing slash type', () => {
      type R = Analyzer.Analyze<'dir/'>
      A<'dir'>().onAs<R['_tag']>()
    })

    it('directory without extension type', () => {
      type R = Analyzer.Analyze<'src'>
      A<'dir'>().onAs<R['_tag']>()
    })

    it('absolute vs relative paths type', () => {
      type Abs = Analyzer.Analyze<'/path/file.txt'>
      type Rel = Analyzer.Analyze<'./path/file.txt'>
      A<'absolute'>().onAs<Abs['pathType']>()
      A<'relative'>().onAs<Rel['pathType']>()
    })

    it('special directory paths type', () => {
      type Dot = Analyzer.Analyze<'.'>
      type DotSlash = Analyzer.Analyze<'./'>
      type DotDot = Analyzer.Analyze<'..'>
      A<'dir'>().onAs<Dot['_tag']>()
      A<'dir'>().onAs<DotSlash['_tag']>()
      A<'dir'>().onAs<DotDot['_tag']>()
    })

    it('hidden files type', () => {
      type NoExt = Analyzer.Analyze<'.gitignore'>
      type WithExt = Analyzer.Analyze<'.env.local'>
      A<'dir'>().onAs<NoExt['_tag']>()
      A<'file'>().onAs<WithExt['_tag']>()
    })

    it('multiple dots in filename type', () => {
      type R = Analyzer.Analyze<'file.test.ts'>
      A<'file'>().onAs<R['_tag']>()
    })

    it('root directory type', () => {
      type R = Analyzer.Analyze<'/'>
      A<'dir'>().onAs<R['_tag']>()
    })
  })

  it('non-literal string returns Analysis union', () => {
    function processPath(path: string) {
      const result = Analyzer.analyze(path)
      // With non-literal string, should return the union type
      A<Analyzer.Analysis>().on(result)
      return result
    }

    // Runtime still works correctly
    const result = processPath('file.txt')
    expect(result._tag).toBe('file')
  })
})
