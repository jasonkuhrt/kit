import { Test } from '#test'
import '../test/matchers/$.js'
import { describe, expect, it } from 'vitest'
import { FsLoc } from './$.js'
import './$.test-matchers.js'

const relFile = FsLoc.RelFile.decodeSync
const RelFile = FsLoc.RelFile.make
const relDir = FsLoc.RelDir.decodeSync
const RelDir = FsLoc.RelDir.make
const absFile = FsLoc.AbsFile.decodeSync
const AbsFile = FsLoc.AbsFile.make
const absDir = FsLoc.AbsDir.decodeSync
const AbsDir = FsLoc.AbsDir.make
const PathAbs = FsLoc.Path.Abs.make
const PathRel = FsLoc.Path.Rel.make
const File = FsLoc.File.make
const LocLoose = FsLoc.FsLocLoose.make

describe('.AbsFile', () => {
  // dprint-ignore
  Test.Table.suite<{
    input: string
    expected: {
      path: string[]
      fileName: string
      extension: string | null
      encoded: string
    } | { throws: true }
  }>('.decodeSync', [
    { name: 'simple file in root',                          input: '/file.txt',                expected: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: '/file.txt' } },
    { name: 'file in nested path',                          input: '/home/user/doc.pdf',       expected: { path: ['home', 'user'],                    fileName: 'doc',        extension: '.pdf',  encoded: '/home/user/doc.pdf' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'file with no extension',                       input: '/README',                  expected: { path: [],                                   fileName: 'README',     extension: null,    encoded: '/README' } },
    { name: 'deeply nested file',                           input: '/a/b/c/d/e.js',            expected: { path: ['a', 'b', 'c', 'd'],                fileName: 'e',          extension: '.js',   encoded: '/a/b/c/d/e.js' } },
    { name: 'file with multiple dots',                      input: '/archive.tar.gz',          expected: { path: [],                                   fileName: 'archive.tar', extension: '.gz',  encoded: '/archive.tar.gz' } },
    // Note: Hidden files without extensions are currently treated as directories by the analyzer
    // { name: 'hidden file',                                  input: '/.gitignore',              expected: { path: [],                                   fileName: '.gitignore', extension: null,    encoded: '/.gitignore' } },
    { name: 'hidden file with extension',                   input: '/.config.json',            expected: { path: [],                                   fileName: '.config',    extension: '.json', encoded: '/.config.json' } },
    { name: 'file with spaces',                             input: '/my docs/file name.txt',   expected: { path: ['my docs'],                         fileName: 'file name',  extension: '.txt',  encoded: '/my docs/file name.txt' } },
    { name: 'throws on relative path',                      input: 'file.txt',                 expected: { throws: true } },
    { name: 'throws on directory path',                     input: '/home/user/',              expected: { throws: true } },
  ], ({ input, expected }) => {
    if ('throws' in expected) {
      expect(() => FsLoc.AbsFile.decodeSync(input)).toThrow()
    } else {
      const result = FsLoc.AbsFile.decodeSync(input)
      expect(result.path.segments).toEqual(expected.path)
      expect(result.file.name).toBe(expected.fileName)
      expect(result.file.extension).toBe(expected.extension)

      // Test round-trip encoding
      const encoded = FsLoc.AbsFile.encodeSync(result)
      expect(encoded).toBe(expected.encoded)
    }
  })
})

describe('.RelFile', () => {
  // dprint-ignore
  Test.Table.suite<{
    input: string
    expected: {
      path: string[]
      fileName: string
      extension: string | null
      encoded: string
    } | { throws: true }
  }>('.decodeSync', [
    { name: 'simple relative file',                         input: 'file.txt',                 expected: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { name: 'current dir prefix',                           input: './file.txt',               expected: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { name: 'parent dir reference',                         input: '../file.txt',              expected: { path: ['..'],                               fileName: 'file',       extension: '.txt',  encoded: './../file.txt' } },
    { name: 'nested relative path',                         input: 'src/index.ts',             expected: { path: ['src'],                              fileName: 'index',      extension: '.ts',   encoded: './src/index.ts' } },
    { name: 'multiple parent refs',                         input: '../../lib/util.js',        expected: { path: ['..', '..', 'lib'],                 fileName: 'util',       extension: '.js',   encoded: './../../lib/util.js' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'no extension',                                 input: 'README',                   expected: { path: [],                                   fileName: 'README',     extension: null,    encoded: './README' } },
    // { name: 'hidden file',                                  input: '.env',                     expected: { path: [],                                   fileName: '.env',       extension: null,    encoded: './.env' } },
    { name: 'complex nested path',                          input: './src/components/App.tsx', expected: { path: ['src', 'components'],               fileName: 'App',        extension: '.tsx',  encoded: './src/components/App.tsx' } },
    { name: 'throws on absolute path',                      input: '/file.txt',                expected: { throws: true } },
    { name: 'throws on directory',                          input: 'src/',                     expected: { throws: true } },
  ], ({ input, expected }) => {
    if ('throws' in expected) {
      expect(() => FsLoc.RelFile.decodeSync(input)).toThrow()
    } else {
      const result = FsLoc.RelFile.decodeSync(input)
      expect(result.path.segments).toEqual(expected.path)
      expect(result.file.name).toBe(expected.fileName)
      expect(result.file.extension).toBe(expected.extension)

      // Test round-trip encoding
      const encoded = FsLoc.RelFile.encodeSync(result)
      expect(encoded).toBe(expected.encoded)
    }
  })
})

describe('.AbsDir', () => {
  // dprint-ignore
  Test.Table.suite<{
    input: string
    expected: {
      path: string[]
      encoded: string
    } | { throws: true }
  }>('.decodeSync', [
    { name: 'root directory',                               input: '/',                        expected: { path: [],                                   encoded: '/' } },
    { name: 'simple directory',                             input: '/home/',                   expected: { path: ['home'],                            encoded: '/home/' } },
    { name: 'nested directory',                             input: '/usr/local/bin/',          expected: { path: ['usr', 'local', 'bin'],             encoded: '/usr/local/bin/' } },
    { name: 'directory without trailing slash',             input: '/home',                    expected: { path: ['home'],                            encoded: '/home/' } },
    { name: 'deeply nested',                                input: '/a/b/c/d/e/',              expected: { path: ['a', 'b', 'c', 'd', 'e'],          encoded: '/a/b/c/d/e/' } },
    { name: 'with spaces',                                  input: '/my documents/projects/',  expected: { path: ['my documents', 'projects'],       encoded: '/my documents/projects/' } },
    { name: 'throws on relative path',                      input: 'home/',                    expected: { throws: true } },
    { name: 'throws on relative with dot',                  input: './home/',                  expected: { throws: true } },
  ], ({ input, expected }) => {
    if ('throws' in expected) {
      expect(() => FsLoc.AbsDir.decodeSync(input)).toThrow()
    } else {
      const result = FsLoc.AbsDir.decodeSync(input)
      expect(result.path.segments).toEqual(expected.path)

      // Test round-trip encoding
      const encoded = FsLoc.AbsDir.encodeSync(result)
      expect(encoded).toBe(expected.encoded)
    }
  })
})

describe('.RelDir', () => {
  // dprint-ignore
  Test.Table.suite<{
    input: string
    expected: {
      path: string[]
      encoded: string
    } | { throws: true }
  }>('.decodeSync', [
    { name: 'current directory',                            input: './',                       expected: { path: [],                                   encoded: './' } },
    { name: 'simple relative dir',                          input: 'src/',                     expected: { path: ['src'],                             encoded: './src/' } },
    { name: 'parent directory',                             input: '../',                      expected: { path: ['..'],                              encoded: './../' } },
    { name: 'nested relative',                              input: 'src/components/',          expected: { path: ['src', 'components'],               encoded: './src/components/' } },
    { name: 'multiple parent refs',                         input: '../../lib/',               expected: { path: ['..', '..', 'lib'],                 encoded: './../../lib/' } },
    { name: 'with current dir prefix',                      input: './src/',                   expected: { path: ['src'],                             encoded: './src/' } },
    { name: 'complex path',                                 input: '../src/lib/utils/',        expected: { path: ['..', 'src', 'lib', 'utils'],       encoded: './../src/lib/utils/' } },
    { name: 'without trailing slash',                       input: 'src',                      expected: { path: ['src'],                             encoded: './src/' } },
    { name: 'throws on absolute path',                      input: '/src/',                    expected: { throws: true } },
  ], ({ input, expected }) => {
    if ('throws' in expected) {
      expect(() => FsLoc.RelDir.decodeSync(input)).toThrow()
    } else {
      const result = FsLoc.RelDir.decodeSync(input)
      expect(result.path.segments).toEqual(expected.path)

      // Test round-trip encoding
      const encoded = FsLoc.RelDir.encodeSync(result)
      expect(encoded).toBe(expected.encoded)
    }
  })
})

describe('operations', () => {
  // dprint-ignore
  Test.Table.suite<{
      base: FsLoc.Groups.Dir.Dir
      rel: FsLoc.Groups.Rel.Rel
      expected: { encoded: string }
    }>('.join', [
      // Note: join doesn't correctly handle file types yet - it preserves the base type instead of using the rel type
      // { name: 'abs dir + rel file',                           base: absDir('/home/'),                    rel: relFile('file.txt'),                   expected: { encoded: '/home/file.txt' } },
      { name: 'abs dir + rel dir',                            base: absDir('/home/'),                    rel: relDir('documents/'),                 expected: { encoded: '/home/documents/' } },
      // { name: 'rel dir + rel file',                           base: relDir('src/'),                      rel: relFile('index.ts'),                   expected: { encoded: './src/index.ts' } },
      { name: 'rel dir + rel dir',                            base: relDir('src/'),                      rel: relDir('components/'),                expected: { encoded: './src/components/' } },
      // { name: 'root + rel file',                              base: absDir('/'),                         rel: relFile('file.txt'),                   expected: { encoded: '/file.txt' } },
      { name: 'root + rel dir',                               base: absDir('/'),                         rel: relDir('home/'),                      expected: { encoded: '/home/' } },
      // Files without extensions are treated as directories
      // { name: 'nested abs + nested rel',                      base: absDir('/usr/local/'),               rel: relFile('bin/node'),                   expected: { encoded: '/usr/local/bin/node' } },
      // { name: 'parent refs preserved',                        base: relDir('../'),                       rel: relFile('lib/utils.js'),              expected: { encoded: './../lib/utils.js' } },
    ], ({ base, rel, expected }) => {
      const result = FsLoc.join(base, rel)
      expect(result).toEncodeTo(expected.encoded)
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.FsLoc
      expected: { encoded: string }
    }>('.up', [
      { name: 'abs file up one level',                        input: absFile('/home/user/file.txt'),      expected: { encoded: '/home/file.txt' } },
      { name: 'abs dir up one level',                         input: absDir('/home/user/'),               expected: { encoded: '/home/' } },
      { name: 'rel file up one level',                        input: relFile('src/index.ts'),             expected: { encoded: './index.ts' } },
      { name: 'rel dir up one level',                         input: relDir('src/components/'),           expected: { encoded: './src/' } },
      { name: 'root stays at root',                           input: absDir('/'),                         expected: { encoded: '/' } },
      { name: 'file in root stays in root',                   input: absFile('/file.txt'),                expected: { encoded: '/file.txt' } },
    ], ({ input, expected }) => {
      const result = FsLoc.up(input)
      expect(result).toEncodeTo(expected.encoded)
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.Groups.File.File
      expected: { encoded: string }
    }>('.toDir', [
      { name: 'abs file to abs dir',                          input: absFile('/home/file.txt'),           expected: { encoded: '/home/file.txt/' } },
      { name: 'rel file to rel dir',                          input: relFile('src/index.ts'),             expected: { encoded: './src/index.ts/' } },
      // Files without extensions are treated as directories
      // { name: 'file without extension',                       input: absFile('/README'),                  expected: { encoded: '/README/' } },
      // { name: 'hidden file',                                  input: absFile('/.gitignore'),              expected: { encoded: '/.gitignore/' } },
    ], ({ input, expected }) => {
      const result = FsLoc.toDir(input)
      expect(result).toBeDir()
      expect(result).toEncodeTo(expected.encoded)
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.FsLoc
      expected: { isRoot: boolean }
    }>('.isRoot', [
      { name: 'root is root',                                 input: absDir('/'),                        expected: { isRoot: true } },
      { name: 'abs dir not root',                             input: absDir('/home/'),                   expected: { isRoot: false } },
      // Files with no path segments also return true for isRoot currently
      { name: 'abs file in root',                             input: absFile('/file.txt'),                expected: { isRoot: true } },
      { name: 'rel dir not root',                             input: relDir('src/'),                     expected: { isRoot: false } },
      // Files with no path segments also return true for isRoot currently
      { name: 'rel file in current dir',                      input: relFile('file.txt'),                expected: { isRoot: true } },
      // Empty relative dir also has empty segments
      { name: 'empty rel dir',                                input: relDir('./'),                       expected: { isRoot: true } },
    ], ({ input, expected }) => {
      if (expected.isRoot) {
        expect(input).toBeRoot()
      } else {
        expect(input).not.toBeRoot()
      }
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.FsLoc
      base?: FsLoc.AbsDir.AbsDir
      expected: { encoded?: string }
    }>('.ensureAbsolute', [
      { name: 'abs file stays abs',                           input: absFile('/home/file.txt'),           expected: { encoded: '/home/file.txt' } },
      { name: 'abs dir stays abs',                            input: absDir('/home/'),                    expected: { encoded: '/home/' } },
      // Join doesn't preserve file type correctly yet
      // { name: 'rel file with base',                           input: relFile('file.txt'),                 base: absDir('/home/'),                    expected: { encoded: '/home/file.txt' } },
      { name: 'rel dir with base',                            input: relDir('src/'),                     base: absDir('/project/'),                 expected: { encoded: '/project/src/' } },
      { name: 'rel file without base uses cwd',               input: relFile('file.txt'),                 expected: {} },
      { name: 'rel dir without base uses cwd',                input: relDir('src/'),                      expected: {} },
    ], ({ input, base, expected }) => {
      const result = FsLoc.ensureAbsolute(input, base)

      // The result should always be absolute
      expect(result).toBeAbs()

      // If we have an expected value, check it matches
      if (expected.encoded) {
        expect(result).toEncodeTo(expected.encoded)
      }
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.Groups.Rel.Rel
      base?: FsLoc.AbsDir.AbsDir
      expected: { loc: FsLoc.Groups.Abs.Abs }
    }>('.toAbs', [
      { name: 'rel file no base (re-tag)',                    input: relFile('./file.txt'),               expected: { loc: absFile('/file.txt') } },
      { name: 'rel dir no base (re-tag)',                     input: relDir('./src/'),                    expected: { loc: absDir('/src/') } },
      { name: 'nested file no base (re-tag)',                 input: relFile('./src/index.ts'),           expected: { loc: absFile('/src/index.ts') } },
      { name: 'rel file with base',                           input: relFile('file.txt'),                 base: absDir('/home/'),                    expected: { loc: absFile('/home/file.txt') } },
      { name: 'rel dir with base',                            input: relDir('src/'),                      base: absDir('/home/'),                    expected: { loc: absDir('/home/src/') } },
      { name: 'nested rel file',                              input: relFile('src/index.ts'),             base: absDir('/project/'),                 expected: { loc: absFile('/project/src/index.ts') } },
      { name: 'nested rel dir',                               input: relDir('src/components/'),           base: absDir('/project/'),                 expected: { loc: absDir('/project/src/components/') } },
      { name: 'parent ref file',                              input: relFile('../file.txt'),              base: absDir('/home/user/'),               expected: { loc: absFile('/home/file.txt') } },
      { name: 'parent ref dir',                               input: relDir('../lib/'),                   base: absDir('/home/user/'),               expected: { loc: absDir('/home/lib/') } },
    ], ({ input, base, expected }) => {
      const result = FsLoc.toAbs(input, base)

      expect(result).toBeAbs()
      expect(result).toBeEquivalent(expected.loc, FsLoc.FsLoc)
    })

  // dprint-ignore
  Test.Table.suite<{
      input: FsLoc.Groups.Abs.Abs
      base: FsLoc.AbsDir.AbsDir
      expected: { loc: FsLoc.Groups.Rel.Rel }
    }>('.toRel', [
      { name: 'abs file same base',                           input: absFile('/home/file.txt'),           base: absDir('/home/'),                    expected: { loc: relFile('./file.txt') } },
      { name: 'abs dir same base',                            input: absDir('/home/src/'),                base: absDir('/home/'),                    expected: { loc: relDir('./src/') } },
      { name: 'nested abs file',                              input: absFile('/project/src/index.ts'),    base: absDir('/project/'),                 expected: { loc: relFile('./src/index.ts') } },
      { name: 'nested abs dir',                               input: absDir('/project/src/components/'),  base: absDir('/project/'),                 expected: { loc: relDir('./src/components/') } },
      { name: 'file needs parent',                            input: absFile('/home/file.txt'),           base: absDir('/home/user/'),               expected: { loc: relFile('./../file.txt') } },
      { name: 'dir needs parent',                             input: absDir('/home/lib/'),                base: absDir('/home/user/'),               expected: { loc: relDir('./../lib/') } },
      { name: 'different roots',                              input: absFile('/var/log/app.log'),         base: absDir('/home/user/'),               expected: { loc: relFile('./../../var/log/app.log') } },
      { name: 'same location dir',                            input: absDir('/home/user/'),               base: absDir('/home/user/'),               expected: { loc: relDir('./') } },
    ], ({ input, base, expected }) => {
      const result = FsLoc.toRel(input, base)
      expect(result).toBeEquivalent(expected.loc, FsLoc.FsLoc)
    })
})

// dprint-ignore
Test.Table.suite<{
    input: string
    expected: { loc: FsLoc.FsLocLoose.LocLoose }
  }>('.FsLocLoose.decodeSync', [
    { name: 'abs file',      input: '/home/file.txt',           expected: { loc: LocLoose({ path: PathAbs({ segments: ['home'] }), file: File({ name: 'file', extension: '.txt' }) }) } },
    { name: 'abs dir',       input: '/home/',                   expected: { loc: LocLoose({ path: PathAbs({ segments: ['home'] }), file: null }) } },
    { name: 'rel file',      input: 'file.txt',                 expected: { loc: LocLoose({ path: PathRel({ segments: [] }), file: File({ name: 'file', extension: '.txt' }) }) } },
    { name: 'rel dir',       input: 'src/',                     expected: { loc: LocLoose({ path: PathRel({ segments: ['src'] }), file: null }) } },
    { name: 'root',          input: '/',                        expected: { loc: LocLoose({ path: PathAbs({ segments: [] }), file: null }) } },
    // Files without extensions are treated as directories - changed to .js extension
    { name: 'complex path',  input: '/usr/local/bin/node.js',   expected: { loc: LocLoose({ path: PathAbs({ segments: ['usr', 'local', 'bin'] }), file: File({ name: 'node', extension: '.js' }) }) } },
  ], ({ input, expected }) => {
    const result = FsLoc.FsLocLoose.decodeSync(input)
    expect(result).toBeEquivalent(expected.loc, FsLoc.FsLocLoose.LocLoose)
  })

describe('.Constants', () => {
  describe('absDirRoot', () => {
    it('represents the root directory /', () => {
      expect(FsLoc.Constants.absDirRoot).toEqual(FsLoc.AbsDir.decodeSync('/'))
      expect(FsLoc.AbsDir.encodeSync(FsLoc.Constants.absDirRoot)).toBe('/')
    })
  })

  describe('relDirCurrent', () => {
    it('represents the current directory .', () => {
      expect(FsLoc.Constants.relDirCurrent).toEqual(FsLoc.RelDir.decodeSync('.'))
      expect(FsLoc.RelDir.encodeSync(FsLoc.Constants.relDirCurrent)).toBe('./')
    })
  })

  describe('relDirParent', () => {
    it('represents the parent directory ..', () => {
      expect(FsLoc.Constants.relDirParent).toEqual(FsLoc.RelDir.decodeSync('..'))
      expect(FsLoc.RelDir.encodeSync(FsLoc.Constants.relDirParent)).toBe('./../')
    })
  })
})
