import { Test } from '#test'
import '../test/matchers/$.js'
import { Schema as S } from 'effect'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { FsLoc } from './$.js'
import './$.test-matchers.js'

const P = FsLoc.Path
const F = FsLoc.File
const l = FsLoc.fromString

// dprint-ignore
Test.describe('.decodeSync')
  .on(S.decodeSync(FsLoc.FsLoc))
  .describe('AbsFile')
  .casesAsArg(
    '/file.txt',
    '/home/user/doc.pdf',
    '/a/b/c/d/e.js',
    '/archive.tar.gz',
    '/.config.json',
    '/my docs/file name.txt',
  )
  .describe('RelFile')
  .casesAsArg(
    'file.txt',
    './file.txt',
    '../file.txt',
    'src/index.ts',
    '../../lib/util.js',
    './src/components/App.tsx',
  )
  .describe('AbsDir')
  .casesAsArg(
    '/',
    '/home/',
    '/home',
    '/usr/local/bin/',
    '/a/b/c/d/e/',
    '/my documents/projects/',
  )
  .describe('RelDir')
  .casesAsArg(
    './',
    'src/',
    '../',
    'src/components/',
    '../../lib/',
    './src/',
    '../src/lib/utils/',
    'src',
  )
  .test()

const LocLoose = FsLoc.FsLocLoose.make
// dprint-ignore
Test.describe('.FsLocLoose.decodeSync')
  .i<string>()
  .o<FsLoc.FsLocLoose.FsLocLooseClass>()
  .cases(
    ['abs file',      ['/home/file.txt'],           LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: F.make({ name: 'file', extension: '.txt' }) })],
    ['abs dir',       ['/home/'],                   LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: null })],
    ['rel file',      ['file.txt'],                 LocLoose({ path: P.Rel.make({ segments: [] }), file: F.make({ name: 'file', extension: '.txt' }) })],
    ['rel dir',       ['src/'],                     LocLoose({ path: P.Rel.make({ segments: ['src'] }), file: null })],
    ['root',          ['/'],                        LocLoose({ path: P.Abs.make({ segments: [] }), file: null })],
    // Files without extensions are treated as directories - changed to .js extension
    ['complex path',  ['/usr/local/bin/node.js'],   LocLoose({ path: P.Abs.make({ segments: ['usr', 'local', 'bin'] }), file: F.make({ name: 'node', extension: '.js' }) })],
  )
  .test((i: string, o: any) => {
    const result = FsLoc.FsLocLoose.decodeSync(i)
    expect(result).toBeEquivalent(o, FsLoc.FsLocLoose.FsLocLooseClass)
  })

describe('.Constants', () => {
  describe('absDirRoot', () => {
    it('represents the root directory /', () => {
      expect(FsLoc.Constants.absDirRoot).toEqual(l('/'))
      expect(S.encodeSync(FsLoc.AbsDir.String as any)(FsLoc.Constants.absDirRoot)).toBe('/')
    })
  })

  describe('relDirCurrent', () => {
    it('represents the current directory .', () => {
      expect(FsLoc.Constants.relDirCurrent).toEqual(l('./'))
      expect(S.encodeSync(FsLoc.RelDir.String as any)(FsLoc.Constants.relDirCurrent)).toBe('./')
    })
  })

  describe('relDirParent', () => {
    it('represents the parent directory ..', () => {
      expect(FsLoc.Constants.relDirParent).toEqual(l('../'))
      expect(S.encodeSync(FsLoc.RelDir.String as any)(FsLoc.Constants.relDirParent)).toBe('./../')
    })
  })
})

describe('.fromString', () => {
  it('returns AbsFile for absolute file paths', () => {
    const result = FsLoc.fromString('/path/file.txt')
    expect(result._tag).toBe('LocAbsFile')
    expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile>()
  })

  it('returns RelFile for relative file paths', () => {
    const result = FsLoc.fromString('file.txt')
    expect(result._tag).toBe('LocRelFile')
    expectTypeOf(result).toEqualTypeOf<FsLoc.RelFile>()
  })

  it('returns AbsDir for absolute directory paths', () => {
    const result = FsLoc.fromString('/home/')
    expect(result._tag).toBe('LocAbsDir')
    expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
  })

  it('returns RelDir for relative directory paths', () => {
    const result = FsLoc.fromString('./src/')
    expect(result._tag).toBe('LocRelDir')
    expectTypeOf(result).toEqualTypeOf<FsLoc.RelDir>()
  })

  it('type-errors when given non-literal string', () => {
    // @ts-expect-error: fromString requires a literal string
    FsLoc.fromString('/' as string)
  })
})

// dprint-ignore
Test.describe('Groups *.assert')
  .i<string>()
  .o<{ assert: Function; pass: boolean }>()
  .cases(
    ['Rel passes for file.txt',      ['file.txt'],  { assert: FsLoc.Groups.Rel.assert,  pass: true }],
    ['Rel fails for /file.txt',      ['/file.txt'], { assert: FsLoc.Groups.Rel.assert,  pass: false }],

    ['Abs passes for /file.txt',     ['/file.txt'], { assert: FsLoc.Groups.Abs.assert,  pass: true }],
    ['Abs fails for file.txt',       ['file.txt'],  { assert: FsLoc.Groups.Abs.assert,  pass: false }],

    ['File passes for file.txt',     ['file.txt'],  { assert: FsLoc.Groups.File.assert, pass: true }],
    ['File fails for ./src/',        ['./src/'],    { assert: FsLoc.Groups.File.assert, pass: false }],

    ['Dir passes for ./src/',        ['./src/'],    { assert: FsLoc.Groups.Dir.assert,  pass: true }],
    ['Dir fails for file.txt',       ['file.txt'],  { assert: FsLoc.Groups.Dir.assert,  pass: false }],

    ['AbsFile passes for /file.txt',  ['/file.txt'],  { assert: S.asserts(FsLoc.AbsFile),  pass: true }],
    ['AbsFile fails for file.txt',    ['file.txt'],   { assert: S.asserts(FsLoc.AbsFile),  pass: false }],
    ['AbsFile fails for /dir/',       ['/dir/'],      { assert: S.asserts(FsLoc.AbsFile),  pass: false }],

    ['RelFile passes for file.txt',   ['file.txt'],   { assert: S.asserts(FsLoc.RelFile),  pass: true }],
    ['RelFile fails for /file.txt',   ['/file.txt'],  { assert: S.asserts(FsLoc.RelFile),  pass: false }],
    ['RelFile fails for ./dir/',      ['./dir/'],     { assert: S.asserts(FsLoc.RelFile),  pass: false }],

    ['AbsDir passes for /dir/',       ['/dir/'],      { assert: S.asserts(FsLoc.AbsDir),   pass: true }],
    ['AbsDir fails for ./dir/',       ['./dir/'],     { assert: S.asserts(FsLoc.AbsDir),   pass: false }],
    ['AbsDir fails for /file.txt',    ['/file.txt'],  { assert: S.asserts(FsLoc.AbsDir),   pass: false }],

    ['RelDir passes for ./dir/',      ['./dir/'],     { assert: S.asserts(FsLoc.RelDir),   pass: true }],
    ['RelDir fails for /dir/',        ['/dir/'],      { assert: S.asserts(FsLoc.RelDir),   pass: false }],
    ['RelDir fails for file.txt',     ['file.txt'],   { assert: S.asserts(FsLoc.RelDir),   pass: false }],
  )
  .test((i: string, o: any) => {
    const loc = FsLoc.decodeSync(i)
    if (o.pass) {
      expect(() => o.assert(loc)).not.toThrow()
    } else {
      expect(() => o.assert(loc)).toThrow()
    }
  })
