import { expect, expectTypeOf, it } from 'vitest'
import { Analyzer } from './$.js'

it('file with extension', () => {
  const result = Analyzer.analyze('file.txt')
  expect(result._tag).toBe('file')
  if (result._tag === 'file') {
    expect(result.file.name).toBe('file')
    expect(result.file.extension).toBe('.txt')
  }

  // Type-level test via inference from literal string
  expectTypeOf(result._tag).toEqualTypeOf<'file'>()
})

it('directory with trailing slash', () => {
  const result = Analyzer.analyze('dir/')
  expect(result._tag).toBe('dir')
  expect(result.path).toEqual(['dir'])

  type R = Analyzer.Analyze<'dir/'>
  expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
})

it('directory without extension', () => {
  const result = Analyzer.analyze('src')
  expect(result._tag).toBe('dir')
  expect(result.path).toEqual(['src'])

  type R = Analyzer.Analyze<'src'>
  expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
})

it('absolute vs relative paths', () => {
  const abs = Analyzer.analyze('/path/file.txt')
  expect(abs.pathType).toBe('absolute')
  expect(abs.isPathAbsolute).toBe(true)

  const rel = Analyzer.analyze('./path/file.txt')
  expect(rel.pathType).toBe('relative')
  expect(rel.isPathRelative).toBe(true)

  type Abs = Analyzer.Analyze<'/path/file.txt'>
  type Rel = Analyzer.Analyze<'./path/file.txt'>
  expectTypeOf<Abs['pathType']>().toEqualTypeOf<'absolute'>()
  expectTypeOf<Rel['pathType']>().toEqualTypeOf<'relative'>()
})

it('special directory paths', () => {
  const dot = Analyzer.analyze('.')
  expect(dot._tag).toBe('dir')

  const dotSlash = Analyzer.analyze('./')
  expect(dotSlash._tag).toBe('dir')

  const dotDot = Analyzer.analyze('..')
  expect(dotDot._tag).toBe('dir')

  type Dot = Analyzer.Analyze<'.'>
  type DotSlash = Analyzer.Analyze<'./'>
  type DotDot = Analyzer.Analyze<'..'>
  expectTypeOf<Dot['_tag']>().toEqualTypeOf<'dir'>()
  expectTypeOf<DotSlash['_tag']>().toEqualTypeOf<'dir'>()
  expectTypeOf<DotDot['_tag']>().toEqualTypeOf<'dir'>()
})

it('hidden files', () => {
  const noExt = Analyzer.analyze('.gitignore')
  expect(noExt._tag).toBe('dir') // No extension = directory

  const withExt = Analyzer.analyze('.env.local')
  expect(withExt._tag).toBe('file')
  if (withExt._tag === 'file') {
    expect(withExt.file.name).toBe('.env')
    expect(withExt.file.extension).toBe('.local')
  }

  type NoExt = Analyzer.Analyze<'.gitignore'>
  type WithExt = Analyzer.Analyze<'.env.local'>
  expectTypeOf<NoExt['_tag']>().toEqualTypeOf<'dir'>()
  expectTypeOf<WithExt['_tag']>().toEqualTypeOf<'file'>()
})

it('multiple dots in filename', () => {
  const result = Analyzer.analyze('file.test.ts')
  expect(result._tag).toBe('file')
  if (result._tag === 'file') {
    expect(result.file.name).toBe('file.test')
    expect(result.file.extension).toBe('.ts')
  }

  type R = Analyzer.Analyze<'file.test.ts'>
  expectTypeOf<R['_tag']>().toEqualTypeOf<'file'>()
})

it('root directory', () => {
  const result = Analyzer.analyze('/')
  expect(result._tag).toBe('dir')
  expect(result.path).toEqual([])

  type R = Analyzer.Analyze<'/'>
  expectTypeOf<R['_tag']>().toEqualTypeOf<'dir'>()
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
