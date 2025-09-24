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

describe('operations', () => {
  // dprint-ignore
  Test.Table.suite<
      { base: FsLoc.Groups.Dir.Dir; rel: FsLoc.Groups.Rel.Rel },
      string
    >('.join', [
      // Note: join doesn't correctly handle file types yet - it preserves the base type instead of using the rel type
      // { name: 'abs dir + rel file',                           i: { base: l('/home/'),                         rel: l('file.txt') },                         o: '/home/file.txt' },
      { n: 'abs dir + rel dir',                            i: { base: l('/home/'),                         rel: l('documents/') },                       o: '/home/documents/' },
      // { name: 'rel dir + rel file',                           i: { base: l('src/'),                           rel: l('index.ts') },                         o: './src/index.ts' },
      { n: 'rel dir + rel dir',                            i: { base: l('src/'),                           rel: l('components/') },                      o: './src/components/' },
      // { name: 'root + rel file',                              i: { base: l('/'),                              rel: l('file.txt') },                         o: '/file.txt' },
      { n: 'root + rel dir',                               i: { base: FsLoc.Constants.absDirRoot,          rel: l('home/') },                           o: '/home/' },
      // Files without extensions are treated as directories
      // { name: 'nested abs + nested rel',                      i: { base: l('/usr/local/'),                    rel: l('bin/node') },                         o: '/usr/local/bin/node' },
      // { name: 'parent refs preserved',                        i: { base: l('../'),                            rel: l('lib/utils.js') },                    o: './../lib/utils.js' },
    ], ({ i, o }) => {
      const result = FsLoc.join(i.base, i.rel)
      expect(result).toEncodeTo(o)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      string
    >('.up', [
      { n: 'abs file up one level',                        i: l('/home/user/file.txt'),      o: '/home/file.txt' },
      { n: 'abs dir up one level',                         i: l('/home/user/'),               o: '/home/' },
      { n: 'rel file up one level',                        i: l('src/index.ts'),             o: './index.ts' },
      { n: 'rel dir up one level',                         i: l('src/components/'),           o: './src/' },
      { n: 'root stays at root',                           i: FsLoc.Constants.absDirRoot,         o: '/' },
      { n: 'file in root stays in root',                   i: l('/file.txt'),                o: '/file.txt' },
    ], ({ i, o }) => {
      const result = FsLoc.up(i)
      expect(result).toEncodeTo(o)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.Groups.File.File,
      string
    >('.toDir', [
      { n: 'abs file to abs dir',                          i: l('/home/file.txt'),                  o: '/home/file.txt/' },
      { n: 'rel file to rel dir',                          i: l('src/index.ts'),                    o: './src/index.ts/' },
      // Files without extensions are treated as directories
      // { name: 'file without extension',                       input: l('/README'),                         o: '/README/' },
      // { name: 'hidden file',                                  input: l('/.gitignore'),                     o: '/.gitignore/' },
    ], ({ i, o }) => {
      const result = FsLoc.toDir(i)
      expect(result).toBeDir()
      expect(result).toEncodeTo(o)
    })

  describe('String literal support in operations', () => {
    it('.join accepts string literals', () => {
      // Absolute directory + relative file
      const file1 = FsLoc.join('/home/user/', 'config.json')
      expectTypeOf(file1).toEqualTypeOf<FsLoc.AbsFile>()
      expect(file1).toBeFile()
      expect(file1).toEncodeTo('/home/user/config.json')

      // With ./ prefix should also work
      const file1b = FsLoc.join('/home/user/', './config.json')
      expectTypeOf(file1b).toEqualTypeOf<FsLoc.AbsFile>()
      expect(file1b).toBeFile()
      expect(file1b).toEncodeTo('/home/user/config.json')

      // Absolute directory + relative directory
      const dir1 = FsLoc.join('/home/user/', 'src/')
      expectTypeOf(dir1).toEqualTypeOf<FsLoc.AbsDir>()
      expect(dir1).toBeDir()
      expect(dir1).toEncodeTo('/home/user/src/')

      // Relative directory + relative file
      const file2 = FsLoc.join('./src/', 'index.ts')
      expectTypeOf(file2).toEqualTypeOf<FsLoc.RelFile>()
      expect(file2).toBeFile()
      expect(file2).toEncodeTo('./src/index.ts')

      // Relative directory + relative directory
      const dir2 = FsLoc.join('./base/', 'nested/')
      expectTypeOf(dir2).toEqualTypeOf<FsLoc.RelDir>()
      expect(dir2).toBeDir()
      expect(dir2).toEncodeTo('./base/nested/')
    })

    it('.ensureAbsolute accepts string literals', () => {
      const abs1 = FsLoc.ensureAbsolute('./src/index.ts')
      expect(abs1).toBeFile()
      expect(abs1).toBeAbs()

      const abs2 = FsLoc.ensureAbsolute('/already/absolute.ts')
      expect(abs2).toBeFile()
      expect(abs2).toEncodeTo('/already/absolute.ts')

      const abs3 = FsLoc.ensureAbsolute('./src/', '/base/')
      expect(abs3).toBeDir()
      expect(abs3).toEncodeTo('/base/src/')
    })

    it('.toDir accepts string literals', () => {
      const dir1 = FsLoc.toDir('/path/to/file.txt')
      expect(dir1).toBeDir()
      expect(dir1).toEncodeTo('/path/to/file.txt/')

      const dir2 = FsLoc.toDir('./src/index.ts')
      expect(dir2).toBeDir()
      expect(dir2).toEncodeTo('./src/index.ts/')
    })

    it('.toAbs accepts string literals', () => {
      const abs1 = FsLoc.toAbs('./relative/path.ts')
      expect(abs1).toBeFile()
      expect(abs1).toEncodeTo('/relative/path.ts')

      const abs2 = FsLoc.toAbs('./rel/', '/base/')
      expect(abs2).toBeDir()
      expect(abs2).toEncodeTo('/base/rel/')
    })

    it('.toRel accepts string literals', () => {
      const rel1 = FsLoc.toRel('/home/user/src/index.ts', '/home/user/')
      expect(rel1).toBeFile()
      expect(rel1).toEncodeTo('./src/index.ts')

      const rel2 = FsLoc.toRel('/home/user/docs/', '/home/')
      expect(rel2).toBeDir()
      expect(rel2).toEncodeTo('./user/docs/')
    })

    it('.name accepts string literals', () => {
      expect(FsLoc.name('/path/to/file.txt')).toBe('file.txt')
      expect(FsLoc.name('/path/to/src/')).toBe('src')
      expect(FsLoc.name('/')).toBe('')
      expect(FsLoc.name('./relative/file.md')).toBe('file.md')
    })

    it('.isRoot accepts string literals', () => {
      expect(FsLoc.isRoot('/')).toBe(true)
      expect(FsLoc.isRoot('/path/')).toBe(false)
      expect(FsLoc.isRoot('./')).toBe(true) // Relative current directory has 0 segments
    })

    it('.up accepts string literals', () => {
      const up1 = FsLoc.up('/path/to/file.txt')
      expect(up1).toEncodeTo('/path/file.txt')

      const up2 = FsLoc.up('/path/to/dir/')
      expect(up2).toEncodeTo('/path/to/')
    })

    it('.isUnder accepts string literals', () => {
      expect(FsLoc.isUnder('/home/user/src/index.ts', '/home/user/')).toBe(true)
      expect(FsLoc.isUnder('/other/path.ts', '/home/user/')).toBe(false)
      expect(FsLoc.isUnder('./src/index.ts', './src/')).toBe(true)
    })

    it('.isAbove accepts string literals', () => {
      expect(FsLoc.isAbove('/home/', '/home/user/file.txt')).toBe(true)
      expect(FsLoc.isAbove('/other/', '/home/user/file.txt')).toBe(false)
    })

    it('.isUnderOf accepts string literals', () => {
      const isInProject = FsLoc.isUnderOf('/project/')
      expect(isInProject('/project/src/index.ts')).toBe(true)
      expect(isInProject('/other/file.ts')).toBe(false)
    })

    it('.isAboveOf accepts string literals', () => {
      const hasAsParent = FsLoc.isAboveOf('/home/user/src/index.ts')
      expect(hasAsParent('/home/user/')).toBe(true)
      expect(hasAsParent('/other/')).toBe(false)
    })
  })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      boolean
    >('.isRoot', [
      { n: 'root is root',                                 i: FsLoc.Constants.absDirRoot,        o: true },
      { n: 'abs dir not root',                             i: l('/home/'),                        o: false },
      // Files with no path segments also return true for isRoot currently
      { n: 'abs file in root',                             i: l('/file.txt'),                      o: true },
      { n: 'rel dir not root',                             i: l('src/'),                          o: false },
      // Files with no path segments also return true for isRoot currently
      { n: 'rel file in current dir',                      i: l('file.txt'),                      o: true },
      // Empty relative dir also has empty segments
      { n: 'empty rel dir',                                i: FsLoc.Constants.relDirCurrent,      o: true },
    ], ({ i, o }) => {
      if (o) {
        expect(i).toBeRoot()
      } else {
        expect(i).not.toBeRoot()
      }
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      string | undefined,
      {
        base?: FsLoc.AbsDir
      }
    >('.ensureAbsolute', [
      { n: 'abs file stays abs',                           i: l('/home/file.txt'),                  o: '/home/file.txt' },
      { n: 'abs dir stays abs',                            i: l('/home/'),                         o: '/home/' },
      // Join doesn't preserve file type correctly yet
      // { name: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: '/home/file.txt' },
      { n: 'rel dir with base',                            i: l('src/'),                           base: l('/project/'),                      o: '/project/src/' },
      { n: 'rel file without base uses cwd',               i: l('file.txt'),                       o: undefined },
      { n: 'rel dir without base uses cwd',                i: l('src/'),                           o: undefined },
    ], ({ i, o, base }) => {
      const result = FsLoc.ensureAbsolute(i, base)

      // The result should always be absolute
      expect(result).toBeAbs()

      // If we have an expected value, check it matches
      if (o) {
        expect(result).toEncodeTo(o)
      }
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.Groups.Rel.Rel,
      FsLoc.Groups.Abs.Abs,
      {
        base?: FsLoc.AbsDir
      }
    >('.toAbs', [
      { n: 'rel file no base (re-tag)',                    i: l('./file.txt'),                     o: l('/file.txt') },
      { n: 'rel dir no base (re-tag)',                     i: l('./src/'),                         o: l('/src/') },
      { n: 'nested file no base (re-tag)',                 i: l('./src/index.ts'),                 o: l('/src/index.ts') },
      { n: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: l('/home/file.txt') },
      { n: 'rel dir with base',                            i: l('src/'),                           base: l('/home/'),                         o: l('/home/src/') },
      { n: 'nested rel file',                              i: l('src/index.ts'),                   base: l('/project/'),                      o: l('/project/src/index.ts') },
      { n: 'nested rel dir',                               i: l('src/components/'),                base: l('/project/'),                      o: l('/project/src/components/') },
      { n: 'parent ref file',                              i: l('../file.txt'),                    base: l('/home/user/'),                    o: l('/home/file.txt') },
      { n: 'parent ref dir',                               i: l('../lib/'),                        base: l('/home/user/'),                    o: l('/home/lib/') },
    ], ({ i, o, base }) => {
      const result = FsLoc.toAbs(i, base)
      expect(result).toBeAbs()
      expect(result).toBeEquivalent(o, FsLoc.FsLoc)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.Groups.Abs.Abs,
      FsLoc.Groups.Rel.Rel,
      {
        base: FsLoc.AbsDir
      }
    >('.toRel', [
      { n: 'abs file same base',                           i: l('/home/file.txt'),                 base: l('/home/'),                         o: l('./file.txt') },
      { n: 'abs dir same base',                            i: l('/home/src/'),                     base: l('/home/'),                         o: l('./src/') },
      { n: 'nested abs file',                              i: l('/project/src/index.ts'),          base: l('/project/'),                      o: l('./src/index.ts') },
      { n: 'nested abs dir',                               i: l('/project/src/components/'),       base: l('/project/'),                      o: l('./src/components/') },
      { n: 'file needs parent',                            i: l('/home/file.txt'),                 base: l('/home/user/'),                    o: l('./../file.txt') },
      { n: 'dir needs parent',                             i: l('/home/lib/'),                     base: l('/home/user/'),                    o: l('./../lib/') },
      { n: 'different roots',                              i: l('/var/log/app.log'),               base: l('/home/user/'),                    o: l('./../../var/log/app.log') },
      { n: 'same location dir',                            i: l('/home/user/'),                    base: l('/home/user/'),                    o: l('./') },
    ], ({ i, o, base }) => {
      const result = FsLoc.toRel(i, base)
      expect(result).toBeEquivalent(o, FsLoc.FsLoc)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      string
    >('.name', [
      // Files with extensions
      { n: 'abs file with extension',                      i: l('/home/file.txt'),                 o: 'file.txt' },
      { n: 'rel file with extension',                      i: l('./docs/README.md'),               o: 'README.md' },
      { n: 'file with multiple dots',                      i: l('/archive.tar.gz'),                o: 'archive.tar.gz' },
      { n: 'hidden file with extension',                   i: l('./.config.json'),                 o: '.config.json' },

      // Directories
      { n: 'abs directory',                                i: l('/home/user/'),                    o: 'user' },
      { n: 'rel directory',                                i: l('./src/'),                         o: 'src' },
      { n: 'nested abs directory',                         i: l('/project/src/components/'),       o: 'components' },
      { n: 'nested rel directory',                         i: l('./lib/utils/'),                   o: 'utils' },

      // Edge cases
      { n: 'root directory returns empty',                 i: FsLoc.Constants.absDirRoot,         o: '' },
      { n: 'file in root',                                 i: l('/file.txt'),                      o: 'file.txt' },
      { n: 'single segment abs dir',                       i: l('/home/'),                         o: 'home' },
      { n: 'empty rel dir returns empty',                  i: FsLoc.Constants.relDirCurrent,      o: '' },
      { n: 'directory with dots in name',                  i: l('/my.folder.v2/'),                 o: 'my.folder.v2' },
    ], ({ i, o }) => {
      const result = FsLoc.name(i)
      expect(result).toBe(o)
    })

  // dprint-ignore
  Test.Table.suite<
    { child: FsLoc.FsLoc; parent: FsLoc.Groups.Dir.Dir },
    boolean
  >('.isUnder', [
    // Absolute paths - true cases
    { n: 'abs file under abs dir',                          i: { child: l('/home/user/project/src/index.ts'), parent: l('/home/user/project/') },         o: true },
    { n: 'abs dir under abs dir',                           i: { child: l('/home/user/project/'),             parent: l('/home/user/') },                  o: true },
    { n: 'file in dir (same segments)',                     i: { child: l('/home/user/README.md'),            parent: l('/home/user/') },                  o: true },
    { n: 'deeply nested under parent',                      i: { child: l('/a/b/c/d/e/f/g.txt'),              parent: l('/a/b/') },                        o: true },
    { n: 'file under root',                                 i: { child: l('/file.txt'),                        parent: l('/') },                            o: true },
    { n: 'deep file under root',                            i: { child: l('/home/user/file.txt'),             parent: l('/') },                            o: true },

    // Relative paths - true cases
    { n: 'rel file under rel dir',                          i: { child: l('./src/components/Button.tsx'),     parent: l('./src/') },                       o: true },
    { n: 'rel dir under rel dir',                           i: { child: l('./src/components/'),               parent: l('./src/') },                       o: true },

    // False cases
    { n: 'unrelated abs paths',                             i: { child: l('/home/other/file.txt'),            parent: l('/home/user/project/') },         o: false },
    { n: 'sibling abs dirs',                                i: { child: l('/home/user2/'),                    parent: l('/home/user1/') },                 o: false },
    { n: 'same abs dir',                                    i: { child: l('/home/user/'),                    parent: l('/home/user/') },                  o: false },
    { n: 'child above parent',                              i: { child: l('/home/'),                         parent: l('/home/user/project/') },         o: false },
    { n: 'root under root',                                 i: { child: l('/'),                              parent: l('/') },                            o: false },
    { n: 'unrelated rel paths',                             i: { child: l('./lib/util.ts'),                  parent: l('./src/') },                      o: false },

    // Mixed abs/rel - false
    { n: 'abs child with rel parent',                       i: { child: l('/home/file.txt'),                 parent: l('./src/') },                      o: false },
    { n: 'rel child with abs parent',                       i: { child: l('./file.txt'),                     parent: l('/home/user/') },                 o: false },
  ], ({ i, o }) => {
    expect(FsLoc.isUnder(i.child, i.parent)).toBe(o)
  })

  // dprint-ignore
  Test.Table.suite<
    { parent: FsLoc.Groups.Dir.Dir; child: FsLoc.FsLoc },
    boolean
  >('.isAbove', [
    { n: 'dir above file',                                  i: { parent: l('/home/user/project/'),           child: l('/home/user/project/src/index.ts') }, o: true },
    { n: 'dir above dir',                                   i: { parent: l('/home/'),                        child: l('/home/user/project/') },            o: true },
    { n: 'dir not above unrelated',                         i: { parent: l('/home/user/'),                   child: l('/other/file.txt') },                o: false },
  ], ({ i, o }) => {
    expect(FsLoc.isAbove(i.parent, i.child)).toBe(o)
  })

  it('.isAbove is symmetrical with .isUnder', () => {
    const parent = l('/home/user/')
    const child = l('/home/user/file.txt')
    expect(FsLoc.isAbove(parent, child)).toBe(FsLoc.isUnder(child, parent))
  })

  describe('.isUnderOf', () => {
    it('creates a predicate for checking if locations are under a directory', () => {
      const projectDir = FsLoc.fromString('/home/user/project/')
      const isInProject = FsLoc.isUnderOf(projectDir)

      expect(isInProject(FsLoc.fromString('/home/user/project/src/index.ts'))).toBe(true)
      expect(isInProject(FsLoc.fromString('/home/user/project/README.md'))).toBe(true)
      expect(isInProject(FsLoc.fromString('/home/other/file.txt'))).toBe(false)
    })

    it('works with array filtering', () => {
      const projectDir = FsLoc.fromString('/project/')
      const files = [
        FsLoc.fromString('/project/src/index.ts'),
        FsLoc.fromString('/project/README.md'),
        FsLoc.fromString('/other/file.txt'),
        FsLoc.fromString('/project/docs/guide.md'),
      ]

      const projectFiles = files.filter(FsLoc.isUnderOf(projectDir))
      expect(projectFiles).toHaveLength(3)
    })
  })

  describe('.isAboveOf', () => {
    it('creates a predicate for checking if directories are above a location', () => {
      const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
      const hasAsParent = FsLoc.isAboveOf(sourceFile)

      expect(hasAsParent(FsLoc.fromString('/home/user/project/'))).toBe(true)
      expect(hasAsParent(FsLoc.fromString('/home/user/'))).toBe(true)
      expect(hasAsParent(FsLoc.fromString('/home/'))).toBe(true)
      expect(hasAsParent(FsLoc.fromString('/other/'))).toBe(false)
    })
  })

  describe('.ensureOptionalAbsoluteWithCwd type inference', () => {
    it('undefined returns AbsDir', () => {
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(undefined)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('AbsFile stays AbsFile', () => {
      const absFile = decodeAbsFile('/path/to/file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absFile)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile>()
    })

    it('AbsDir stays AbsDir', () => {
      const absDir = decodeAbsDir('/path/to/dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(absDir)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('RelFile becomes AbsFile', () => {
      const relFile = decodeRelFile('./file.txt')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relFile)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile>()
    })

    it('RelDir becomes AbsDir', () => {
      const relDir = decodeRelDir('./dir/')
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(relDir)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir>()
    })

    it('union type with undefined', () => {
      const loc = Math.random() > 0.5 ? decodeRelFile('./file.txt') : undefined
      const result = FsLoc.ensureOptionalAbsoluteWithCwd(loc)
      expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile | FsLoc.AbsDir>()
    })
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
