import { Test } from '#test'
import '../test/matchers/$.js'
import { Schema as S } from 'effect'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { FsLoc } from './$.js'
import './$.test-matchers.js'

const P = FsLoc.Path
const F = FsLoc.File
const AbsFile = FsLoc.AbsFile
const RelFile = FsLoc.RelFile
const AbsDir = FsLoc.AbsDir
const RelDir = FsLoc.RelDir
const l = FsLoc.fromString

// Local helper functions for decoding
const decodeAbsFile = S.decodeSync(FsLoc.AbsFile.String)
const decodeRelFile = S.decodeSync(FsLoc.RelFile.String)
const decodeAbsDir = S.decodeSync(FsLoc.AbsDir.String)
const decodeRelDir = S.decodeSync(FsLoc.RelDir.String)

describe('*.decodeSync', () => {
  // dprint-ignore
  Test.Table.suite<
    string,
    { loc: FsLoc.FsLoc; encoded: string } | { throws: true },
    { fsloc: typeof FsLoc.AbsFile | typeof FsLoc.RelFile | typeof FsLoc.AbsDir | typeof FsLoc.RelDir }
  >('.decodeSync', [
    // AbsFile cases
    { n: 'AbsFile: simple file in root',        fsloc: FsLoc.AbsFile, i: '/file.txt',                o: { loc: AbsFile.make({ path: P.Abs.make({ segments: [] }),                     file: F.make({ name: 'file',        extension: '.txt' }) }),  encoded: '/file.txt' } },
    { n: 'AbsFile: file in nested path',        fsloc: FsLoc.AbsFile, i: '/home/user/doc.pdf',       o: { loc: AbsFile.make({ path: P.Abs.make({ segments: ['home', 'user'] }),       file: F.make({ name: 'doc',         extension: '.pdf' }) }),  encoded: '/home/user/doc.pdf' } },
    { n: 'AbsFile: deeply nested file',         fsloc: FsLoc.AbsFile, i: '/a/b/c/d/e.js',            o: { loc: AbsFile.make({ path: P.Abs.make({ segments: ['a', 'b', 'c', 'd'] }),   file: F.make({ name: 'e',           extension: '.js' }) }),   encoded: '/a/b/c/d/e.js' } },
    { n: 'AbsFile: file with multiple dots',    fsloc: FsLoc.AbsFile, i: '/archive.tar.gz',          o: { loc: AbsFile.make({ path: P.Abs.make({ segments: [] }),                     file: F.make({ name: 'archive.tar', extension: '.gz' }) }),   encoded: '/archive.tar.gz' } },
    { n: 'AbsFile: hidden file with extension', fsloc: FsLoc.AbsFile, i: '/.config.json',            o: { loc: AbsFile.make({ path: P.Abs.make({ segments: [] }),                     file: F.make({ name: '.config',     extension: '.json' }) }), encoded: '/.config.json' } },
    { n: 'AbsFile: file with spaces',           fsloc: FsLoc.AbsFile, i: '/my docs/file name.txt',   o: { loc: AbsFile.make({ path: P.Abs.make({ segments: ['my docs'] }),            file: F.make({ name: 'file name',   extension: '.txt' }) }),  encoded: '/my docs/file name.txt' } },
    { n: 'AbsFile: throws on relative path',    fsloc: FsLoc.AbsFile, i: 'file.txt',                 o: { throws: true } },
    { n: 'AbsFile: throws on directory path',   fsloc: FsLoc.AbsFile, i: '/home/user/',              o: { throws: true } },

    // RelFile cases
    { n: 'RelFile: simple relative file',       fsloc: FsLoc.RelFile, i: 'file.txt',                 o: { loc: RelFile.make({ path: P.Rel.make({ segments: [] }),                     file: F.make({ name: 'file',  extension: '.txt' }) }),  encoded: './file.txt' } },
    { n: 'RelFile: current dir prefix',         fsloc: FsLoc.RelFile, i: './file.txt',               o: { loc: RelFile.make({ path: P.Rel.make({ segments: [] }),                     file: F.make({ name: 'file',  extension: '.txt' }) }),  encoded: './file.txt' } },
    { n: 'RelFile: parent dir reference',       fsloc: FsLoc.RelFile, i: '../file.txt',              o: { loc: RelFile.make({ path: P.Rel.make({ segments: ['..'] }),                 file: F.make({ name: 'file',  extension: '.txt' }) }),  encoded: './../file.txt' } },
    { n: 'RelFile: nested relative path',       fsloc: FsLoc.RelFile, i: 'src/index.ts',             o: { loc: RelFile.make({ path: P.Rel.make({ segments: ['src'] }),                file: F.make({ name: 'index', extension: '.ts' }) }),   encoded: './src/index.ts' } },
    { n: 'RelFile: multiple parent refs',       fsloc: FsLoc.RelFile, i: '../../lib/util.js',        o: { loc: RelFile.make({ path: P.Rel.make({ segments: ['..', '..', 'lib'] }),    file: F.make({ name: 'util',  extension: '.js' }) }),   encoded: './../../lib/util.js' } },
    { n: 'RelFile: complex nested path',        fsloc: FsLoc.RelFile, i: './src/components/App.tsx', o: { loc: RelFile.make({ path: P.Rel.make({ segments: ['src', 'components'] }),  file: F.make({ name: 'App',   extension: '.tsx' }) }),  encoded: './src/components/App.tsx' } },
    { n: 'RelFile: throws on absolute path',    fsloc: FsLoc.RelFile, i: '/file.txt',                o: { throws: true } },
    { n: 'RelFile: throws on directory',        fsloc: FsLoc.RelFile, i: 'src/',                     o: { throws: true } },

    // AbsDir cases
    { n: 'AbsDir: root directory',              fsloc: FsLoc.AbsDir,  i: '/',                        o: { loc: AbsDir.make({ path: P.Abs.make({ segments: [] }) }),                                                          encoded: '/' } },
    { n: 'AbsDir: simple directory',            fsloc: FsLoc.AbsDir,  i: '/home/',                   o: { loc: AbsDir.make({ path: P.Abs.make({ segments: ['home'] }) }),                                                    encoded: '/home/' } },
    { n: 'AbsDir: nested directory',            fsloc: FsLoc.AbsDir,  i: '/usr/local/bin/',          o: { loc: AbsDir.make({ path: P.Abs.make({ segments: ['usr', 'local', 'bin'] }) }),                                     encoded: '/usr/local/bin/' } },
    { n: 'AbsDir: without trailing slash',      fsloc: FsLoc.AbsDir,  i: '/home',                    o: { loc: AbsDir.make({ path: P.Abs.make({ segments: ['home'] }) }),                                                    encoded: '/home/' } },
    { n: 'AbsDir: deeply nested',               fsloc: FsLoc.AbsDir,  i: '/a/b/c/d/e/',              o: { loc: AbsDir.make({ path: P.Abs.make({ segments: ['a', 'b', 'c', 'd', 'e'] }) }),                                   encoded: '/a/b/c/d/e/' } },
    { n: 'AbsDir: with spaces',                 fsloc: FsLoc.AbsDir,  i: '/my documents/projects/',  o: { loc: AbsDir.make({ path: P.Abs.make({ segments: ['my documents', 'projects'] }) }),                                encoded: '/my documents/projects/' } },
    { n: 'AbsDir: throws on relative path',     fsloc: FsLoc.AbsDir,  i: 'home/',                    o: { throws: true } },
    { n: 'AbsDir: throws on relative with dot', fsloc: FsLoc.AbsDir,  i: './home/',                  o: { throws: true } },

    // RelDir cases
    { n: 'RelDir: current directory',           fsloc: FsLoc.RelDir,  i: './',                       o: { loc: RelDir.make({ path: P.Rel.make({ segments: [] }) }),                                                          encoded: './' } },
    { n: 'RelDir: simple relative dir',         fsloc: FsLoc.RelDir,  i: 'src/',                     o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['src'] }) }),                                                     encoded: './src/' } },
    { n: 'RelDir: parent directory',            fsloc: FsLoc.RelDir,  i: '../',                      o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['..'] }) }),                                                      encoded: './../' } },
    { n: 'RelDir: nested relative',             fsloc: FsLoc.RelDir,  i: 'src/components/',          o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['src', 'components'] }) }),                                       encoded: './src/components/' } },
    { n: 'RelDir: multiple parent refs',        fsloc: FsLoc.RelDir,  i: '../../lib/',               o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['..', '..', 'lib'] }) }),                                         encoded: './../../lib/' } },
    { n: 'RelDir: with current dir prefix',     fsloc: FsLoc.RelDir,  i: './src/',                   o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['src'] }) }),                                                     encoded: './src/' } },
    { n: 'RelDir: complex path',                fsloc: FsLoc.RelDir,  i: '../src/lib/utils/',        o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['..', 'src', 'lib', 'utils'] }) }),                               encoded: './../src/lib/utils/' } },
    { n: 'RelDir: without trailing slash',      fsloc: FsLoc.RelDir,  i: 'src',                      o: { loc: RelDir.make({ path: P.Rel.make({ segments: ['src'] }) }),                                                     encoded: './src/' } },
    { n: 'RelDir: throws on absolute path',     fsloc: FsLoc.RelDir,  i: '/src/',                    o: { throws: true } },
  ], ({ i, o, fsloc }) => {
    if ('throws' in o) {
      expect(() => S.decodeSync(fsloc.String as any)(i)).toThrow()
    } else {
      const result = S.decodeSync(fsloc.String as any)(i)
      expect(result).toBeEquivalent(o.loc, FsLoc.FsLoc)
      // Test round-trip encoding
      const encoded = S.encodeSync(fsloc.String as any)(result as any)
      expect(encoded).toBe(o.encoded)
    }
  })
})

const LocLoose = FsLoc.FsLocLoose.make
Test.Table.suite<
  string,
  FsLoc.FsLocLoose.FsLocLooseClass
>(
  '.FsLocLoose.decodeSync', // dprint-ignore
  [
    { n: 'abs file',      i: '/home/file.txt',           o: LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: F.make({ name: 'file', extension: '.txt' }) }) },
    { n: 'abs dir',       i: '/home/',                   o: LocLoose({ path: P.Abs.make({ segments: ['home'] }), file: null }) },
    { n: 'rel file',      i: 'file.txt',                 o: LocLoose({ path: P.Rel.make({ segments: [] }), file: F.make({ name: 'file', extension: '.txt' }) }) },
    { n: 'rel dir',       i: 'src/',                     o: LocLoose({ path: P.Rel.make({ segments: ['src'] }), file: null }) },
    { n: 'root',          i: '/',                        o: LocLoose({ path: P.Abs.make({ segments: [] }), file: null }) },
    // Files without extensions are treated as directories - changed to .js extension
    { n: 'complex path',  i: '/usr/local/bin/node.js',   o: LocLoose({ path: P.Abs.make({ segments: ['usr', 'local', 'bin'] }), file: F.make({ name: 'node', extension: '.js' }) }) },
  ],
  ({ i, o }) => {
    const result = FsLoc.FsLocLoose.decodeSync(i)
    expect(result).toBeEquivalent(o, FsLoc.FsLocLoose.FsLocLooseClass)
  },
)

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

describe('*.assert', () => {
  // dprint-ignore
  Test.Table.suite<string, { assert: Function; pass: boolean }>('Groups', [
    { n: 'Rel passes for file.txt',      i: 'file.txt',  o: { assert: FsLoc.Groups.Rel.assert,  pass: true } },
    { n: 'Rel fails for /file.txt',      i: '/file.txt', o: { assert: FsLoc.Groups.Rel.assert,  pass: false } },

    { n: 'Abs passes for /file.txt',     i: '/file.txt', o: { assert: FsLoc.Groups.Abs.assert,  pass: true } },
    { n: 'Abs fails for file.txt',       i: 'file.txt',  o: { assert: FsLoc.Groups.Abs.assert,  pass: false } },

    { n: 'File passes for file.txt',     i: 'file.txt',  o: { assert: FsLoc.Groups.File.assert, pass: true } },
    { n: 'File fails for ./src/',        i: './src/',    o: { assert: FsLoc.Groups.File.assert, pass: false } },

    { n: 'Dir passes for ./src/',        i: './src/',    o: { assert: FsLoc.Groups.Dir.assert,  pass: true } },
    { n: 'Dir fails for file.txt',       i: 'file.txt',  o: { assert: FsLoc.Groups.Dir.assert,  pass: false } },

    { n: 'AbsFile passes for /file.txt',  i: '/file.txt',  o: { assert: S.asserts(FsLoc.AbsFile),  pass: true } },
    { n: 'AbsFile fails for file.txt',    i: 'file.txt',   o: { assert: S.asserts(FsLoc.AbsFile),  pass: false } },
    { n: 'AbsFile fails for /dir/',       i: '/dir/',      o: { assert: S.asserts(FsLoc.AbsFile),  pass: false } },

    { n: 'RelFile passes for file.txt',   i: 'file.txt',   o: { assert: S.asserts(FsLoc.RelFile),  pass: true } },
    { n: 'RelFile fails for /file.txt',   i: '/file.txt',  o: { assert: S.asserts(FsLoc.RelFile),  pass: false } },
    { n: 'RelFile fails for ./dir/',      i: './dir/',     o: { assert: S.asserts(FsLoc.RelFile),  pass: false } },

    { n: 'AbsDir passes for /dir/',       i: '/dir/',      o: { assert: S.asserts(FsLoc.AbsDir),   pass: true } },
    { n: 'AbsDir fails for ./dir/',       i: './dir/',     o: { assert: S.asserts(FsLoc.AbsDir),   pass: false } },
    { n: 'AbsDir fails for /file.txt',    i: '/file.txt',  o: { assert: S.asserts(FsLoc.AbsDir),   pass: false } },

    { n: 'RelDir passes for ./dir/',      i: './dir/',     o: { assert: S.asserts(FsLoc.RelDir),   pass: true } },
    { n: 'RelDir fails for /dir/',        i: '/dir/',      o: { assert: S.asserts(FsLoc.RelDir),   pass: false } },
    { n: 'RelDir fails for file.txt',     i: 'file.txt',   o: { assert: S.asserts(FsLoc.RelDir),   pass: false } },
  ], ({ i, o }) => {
    const loc = FsLoc.decodeSync(i)
    if (o.pass) {
      expect(() => o.assert(loc)).not.toThrow()
    } else {
      expect(() => o.assert(loc)).toThrow()
    }
  })
})
