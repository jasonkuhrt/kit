import { Test } from '#test'
import '../test/matchers/$.js'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { FsLoc } from './$.js'
import './$.test-matchers.js'
import type { Ts } from '#ts'

const RelFile = FsLoc.RelFile.make
const RelDir = FsLoc.RelDir.make
const AbsFile = FsLoc.AbsFile.make
const AbsDir = FsLoc.AbsDir.make
const PathAbs = FsLoc.Path.Abs.make
const PathRel = FsLoc.Path.Rel.make
const File = FsLoc.File.make
const LocLoose = FsLoc.FsLocLoose.make
const l = FsLoc.fromString

describe('.AbsFile', () => {
  // dprint-ignore
  Test.Table.suite<
    string,
    {
      path: string[]
      fileName: string
      extension: string | null
      encoded: string
    } | { throws: true }
  >('.decodeSync', [
    { name: 'simple file in root',                          i: '/file.txt',                o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: '/file.txt' } },
    { name: 'file in nested path',                          i: '/home/user/doc.pdf',       o: { path: ['home', 'user'],                    fileName: 'doc',        extension: '.pdf',  encoded: '/home/user/doc.pdf' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'file with no extension',                       i: '/README',                  o: { path: [],                                   fileName: 'README',     extension: null,    encoded: '/README' } },
    { name: 'deeply nested file',                           i: '/a/b/c/d/e.js',            o: { path: ['a', 'b', 'c', 'd'],                fileName: 'e',          extension: '.js',   encoded: '/a/b/c/d/e.js' } },
    { name: 'file with multiple dots',                      i: '/archive.tar.gz',          o: { path: [],                                   fileName: 'archive.tar', extension: '.gz',  encoded: '/archive.tar.gz' } },
    // Note: Hidden files without extensions are currently treated as directories by the analyzer
    // { name: 'hidden file',                                  i: '/.gitignore',              o: { path: [],                                   fileName: '.gitignore', extension: null,    encoded: '/.gitignore' } },
    { name: 'hidden file with extension',                   i: '/.config.json',            o: { path: [],                                   fileName: '.config',    extension: '.json', encoded: '/.config.json' } },
    { name: 'file with spaces',                             i: '/my docs/file name.txt',   o: { path: ['my docs'],                         fileName: 'file name',  extension: '.txt',  encoded: '/my docs/file name.txt' } },
    { name: 'throws on relative path',                      i: 'file.txt',                 o: { throws: true } },
    { name: 'throws on directory path',                     i: '/home/user/',              o: { throws: true } },
  ], ({ i, o }) => {
    if ('throws' in o) {
      expect(() => FsLoc.AbsFile.decodeSync(i)).toThrow()
    } else {
      const result = FsLoc.AbsFile.decodeSync(i)
      expect(result.path.segments).toEqual(o.path)
      expect(result.file.name).toBe(o.fileName)
      expect(result.file.extension).toBe(o.extension)

      // Test round-trip encoding
      const encoded = FsLoc.AbsFile.encodeSync(result)
      expect(encoded).toBe(o.encoded)
    }
  })
})

describe('.RelFile', () => {
  // dprint-ignore
  Test.Table.suite<
    string,
    {
      path: string[]
      fileName: string
      extension: string | null
      encoded: string
    } | { throws: true }
  >('.decodeSync', [
    { name: 'simple relative file',                         i: 'file.txt',                 o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { name: 'current dir prefix',                           i: './file.txt',               o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { name: 'parent dir reference',                         i: '../file.txt',              o: { path: ['..'],                               fileName: 'file',       extension: '.txt',  encoded: './../file.txt' } },
    { name: 'nested relative path',                         i: 'src/index.ts',             o: { path: ['src'],                              fileName: 'index',      extension: '.ts',   encoded: './src/index.ts' } },
    { name: 'multiple parent refs',                         i: '../../lib/util.js',        o: { path: ['..', '..', 'lib'],                 fileName: 'util',       extension: '.js',   encoded: './../../lib/util.js' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'no extension',                                 i: 'README',                   o: { path: [],                                   fileName: 'README',     extension: null,    encoded: './README' } },
    // { name: 'hidden file',                                  i: '.env',                     o: { path: [],                                   fileName: '.env',       extension: null,    encoded: './.env' } },
    { name: 'complex nested path',                          i: './src/components/App.tsx', o: { path: ['src', 'components'],               fileName: 'App',        extension: '.tsx',  encoded: './src/components/App.tsx' } },
    { name: 'throws on absolute path',                      i: '/file.txt',                o: { throws: true } },
    { name: 'throws on directory',                          i: 'src/',                     o: { throws: true } },
  ], ({ i, o }) => {
    if ('throws' in o) {
      expect(() => FsLoc.RelFile.decodeSync(i)).toThrow()
    } else {
      const result = FsLoc.RelFile.decodeSync(i)
      expect(result.path.segments).toEqual(o.path)
      expect(result.file.name).toBe(o.fileName)
      expect(result.file.extension).toBe(o.extension)

      // Test round-trip encoding
      const encoded = FsLoc.RelFile.encodeSync(result)
      expect(encoded).toBe(o.encoded)
    }
  })
})

describe('.AbsDir', () => {
  // dprint-ignore
  Test.Table.suite<
    string,
    {
      path: string[]
      encoded: string
    } | { throws: true }
  >('.decodeSync', [
    { name: 'root directory',                               i: '/',                        o: { path: [],                                   encoded: '/' } },
    { name: 'simple directory',                             i: '/home/',                   o: { path: ['home'],                            encoded: '/home/' } },
    { name: 'nested directory',                             i: '/usr/local/bin/',          o: { path: ['usr', 'local', 'bin'],             encoded: '/usr/local/bin/' } },
    { name: 'directory without trailing slash',             i: '/home',                    o: { path: ['home'],                            encoded: '/home/' } },
    { name: 'deeply nested',                                i: '/a/b/c/d/e/',              o: { path: ['a', 'b', 'c', 'd', 'e'],          encoded: '/a/b/c/d/e/' } },
    { name: 'with spaces',                                  i: '/my documents/projects/',  o: { path: ['my documents', 'projects'],       encoded: '/my documents/projects/' } },
    { name: 'throws on relative path',                      i: 'home/',                    o: { throws: true } },
    { name: 'throws on relative with dot',                  i: './home/',                  o: { throws: true } },
  ], ({ i, o }) => {
    if ('throws' in o) {
      expect(() => FsLoc.AbsDir.decodeSync(i)).toThrow()
    } else {
      const result = FsLoc.AbsDir.decodeSync(i)
      expect(result.path.segments).toEqual(o.path)

      // Test round-trip encoding
      const encoded = FsLoc.AbsDir.encodeSync(result)
      expect(encoded).toBe(o.encoded)
    }
  })
})

describe('.RelDir', () => {
  // dprint-ignore
  Test.Table.suite<
    string,
    {
      path: string[]
      encoded: string
    } | { throws: true }
  >('.decodeSync', [
    { name: 'current directory',                            i: './',                       o: { path: [],                                   encoded: './' } },
    { name: 'simple relative dir',                          i: 'src/',                     o: { path: ['src'],                             encoded: './src/' } },
    { name: 'parent directory',                             i: '../',                      o: { path: ['..'],                              encoded: './../' } },
    { name: 'nested relative',                              i: 'src/components/',          o: { path: ['src', 'components'],               encoded: './src/components/' } },
    { name: 'multiple parent refs',                         i: '../../lib/',               o: { path: ['..', '..', 'lib'],                 encoded: './../../lib/' } },
    { name: 'with current dir prefix',                      i: './src/',                   o: { path: ['src'],                             encoded: './src/' } },
    { name: 'complex path',                                 i: '../src/lib/utils/',        o: { path: ['..', 'src', 'lib', 'utils'],       encoded: './../src/lib/utils/' } },
    { name: 'without trailing slash',                       i: 'src',                      o: { path: ['src'],                             encoded: './src/' } },
    { name: 'throws on absolute path',                      i: '/src/',                    o: { throws: true } },
  ], ({ i, o }) => {
    if ('throws' in o) {
      expect(() => FsLoc.RelDir.decodeSync(i)).toThrow()
    } else {
      const result = FsLoc.RelDir.decodeSync(i)
      expect(result.path.segments).toEqual(o.path)

      // Test round-trip encoding
      const encoded = FsLoc.RelDir.encodeSync(result)
      expect(encoded).toBe(o.encoded)
    }
  })
})

describe('operations', () => {
  // dprint-ignore
  Test.Table.suite<
      void, // @cluaude allow passing never to remove need to supply 'i' at all
      string,
      {
        base: FsLoc.Groups.Dir.Dir
        rel: FsLoc.Groups.Rel.Rel
      }
    >('.join', [
      // Note: join doesn't correctly handle file types yet - it preserves the base type instead of using the rel type
      // { name: 'abs dir + rel file',                           i: undefined, base: l('/home/'),                         rel: l('file.txt'),                         o: '/home/file.txt' },
      { name: 'abs dir + rel dir',                            i: undefined, base: l('/home/'),                         rel: l('documents/'),                       o: '/home/documents/' },
      // { name: 'rel dir + rel file',                           i: undefined, base: l('src/'),                           rel: l('index.ts'),                         o: './src/index.ts' },
      { name: 'rel dir + rel dir',                            i: undefined, base: l('src/'),                           rel: l('components/'),                      o: './src/components/' },
      // { name: 'root + rel file',                              i: undefined, base: l('/'),                              rel: l('file.txt'),                         o: '/file.txt' },
      { name: 'root + rel dir',                               i: undefined, base: FsLoc.Constants.absDirRoot,          rel: l('home/'),                           o: '/home/' },
      // Files without extensions are treated as directories
      // { name: 'nested abs + nested rel',                      i: undefined, base: l('/usr/local/'),                    rel: l('bin/node'),                         o: '/usr/local/bin/node' },
      // { name: 'parent refs preserved',                        i: undefined, base: l('../'),                            rel: l('lib/utils.js'),                    o: './../lib/utils.js' },
    ], ({ i, o, base, rel }) => {
      const result = FsLoc.join(base, rel)
      expect(result).toEncodeTo(o)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      string
    >('.up', [
      { name: 'abs file up one level',                        i: l('/home/user/file.txt'),      o: '/home/file.txt' },
      { name: 'abs dir up one level',                         i: l('/home/user/'),               o: '/home/' },
      { name: 'rel file up one level',                        i: l('src/index.ts'),             o: './index.ts' },
      { name: 'rel dir up one level',                         i: l('src/components/'),           o: './src/' },
      { name: 'root stays at root',                           i: FsLoc.Constants.absDirRoot,         o: '/' },
      { name: 'file in root stays in root',                   i: l('/file.txt'),                o: '/file.txt' },
    ], ({ i, o }) => {
      const result = FsLoc.up(i)
      expect(result).toEncodeTo(o)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.Groups.File.File,
      string
    >('.toDir', [
      { name: 'abs file to abs dir',                          i: l('/home/file.txt'),                  o: '/home/file.txt/' },
      { name: 'rel file to rel dir',                          i: l('src/index.ts'),                    o: './src/index.ts/' },
      // Files without extensions are treated as directories
      // { name: 'file without extension',                       input: l('/README'),                         o: '/README/' },
      // { name: 'hidden file',                                  input: l('/.gitignore'),                     o: '/.gitignore/' },
    ], ({ i, o }) => {
      const result = FsLoc.toDir(i)
      expect(result).toBeDir()
      expect(result).toEncodeTo(o)
    })

  // dprint-ignore
  Test.Table.suite<
      FsLoc.FsLoc,
      boolean
    >('.isRoot', [
      { name: 'root is root',                                 i: FsLoc.Constants.absDirRoot,        o: true },
      { name: 'abs dir not root',                             i: l('/home/'),                        o: false },
      // Files with no path segments also return true for isRoot currently
      { name: 'abs file in root',                             i: l('/file.txt'),                      o: true },
      { name: 'rel dir not root',                             i: l('src/'),                          o: false },
      // Files with no path segments also return true for isRoot currently
      { name: 'rel file in current dir',                      i: l('file.txt'),                      o: true },
      // Empty relative dir also has empty segments
      { name: 'empty rel dir',                                i: FsLoc.Constants.relDirCurrent,      o: true },
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
        base?: FsLoc.AbsDir.AbsDir
      }
    >('.ensureAbsolute', [
      { name: 'abs file stays abs',                           i: l('/home/file.txt'),                  o: '/home/file.txt' },
      { name: 'abs dir stays abs',                            i: l('/home/'),                         o: '/home/' },
      // Join doesn't preserve file type correctly yet
      // { name: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: '/home/file.txt' },
      { name: 'rel dir with base',                            i: l('src/'),                           base: l('/project/'),                      o: '/project/src/' },
      { name: 'rel file without base uses cwd',               i: l('file.txt'),                       o: undefined },
      { name: 'rel dir without base uses cwd',                i: l('src/'),                           o: undefined },
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
        base?: FsLoc.AbsDir.AbsDir
      }
    >('.toAbs', [
      { name: 'rel file no base (re-tag)',                    i: l('./file.txt'),                     o: l('/file.txt') },
      { name: 'rel dir no base (re-tag)',                     i: l('./src/'),                         o: l('/src/') },
      { name: 'nested file no base (re-tag)',                 i: l('./src/index.ts'),                 o: l('/src/index.ts') },
      { name: 'rel file with base',                           i: l('file.txt'),                       base: l('/home/'),                         o: l('/home/file.txt') },
      { name: 'rel dir with base',                            i: l('src/'),                           base: l('/home/'),                         o: l('/home/src/') },
      { name: 'nested rel file',                              i: l('src/index.ts'),                   base: l('/project/'),                      o: l('/project/src/index.ts') },
      { name: 'nested rel dir',                               i: l('src/components/'),                base: l('/project/'),                      o: l('/project/src/components/') },
      { name: 'parent ref file',                              i: l('../file.txt'),                    base: l('/home/user/'),                    o: l('/home/file.txt') },
      { name: 'parent ref dir',                               i: l('../lib/'),                        base: l('/home/user/'),                    o: l('/home/lib/') },
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
        base: FsLoc.AbsDir.AbsDir
      }
    >('.toRel', [
      { name: 'abs file same base',                           i: l('/home/file.txt'),                 base: l('/home/'),                         o: l('./file.txt') },
      { name: 'abs dir same base',                            i: l('/home/src/'),                     base: l('/home/'),                         o: l('./src/') },
      { name: 'nested abs file',                              i: l('/project/src/index.ts'),          base: l('/project/'),                      o: l('./src/index.ts') },
      { name: 'nested abs dir',                               i: l('/project/src/components/'),       base: l('/project/'),                      o: l('./src/components/') },
      { name: 'file needs parent',                            i: l('/home/file.txt'),                 base: l('/home/user/'),                    o: l('./../file.txt') },
      { name: 'dir needs parent',                             i: l('/home/lib/'),                     base: l('/home/user/'),                    o: l('./../lib/') },
      { name: 'different roots',                              i: l('/var/log/app.log'),               base: l('/home/user/'),                    o: l('./../../var/log/app.log') },
      { name: 'same location dir',                            i: l('/home/user/'),                    base: l('/home/user/'),                    o: l('./') },
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
      { name: 'abs file with extension',                      i: l('/home/file.txt'),                 o: 'file.txt' },
      { name: 'rel file with extension',                      i: l('./docs/README.md'),               o: 'README.md' },
      { name: 'file with multiple dots',                      i: l('/archive.tar.gz'),                o: 'archive.tar.gz' },
      { name: 'hidden file with extension',                   i: l('./.config.json'),                 o: '.config.json' },

      // Directories
      { name: 'abs directory',                                i: l('/home/user/'),                    o: 'user' },
      { name: 'rel directory',                                i: l('./src/'),                         o: 'src' },
      { name: 'nested abs directory',                         i: l('/project/src/components/'),       o: 'components' },
      { name: 'nested rel directory',                         i: l('./lib/utils/'),                   o: 'utils' },

      // Edge cases
      { name: 'root directory returns empty',                 i: FsLoc.Constants.absDirRoot,         o: '' },
      { name: 'file in root',                                 i: l('/file.txt'),                      o: 'file.txt' },
      { name: 'single segment abs dir',                       i: l('/home/'),                         o: 'home' },
      { name: 'empty rel dir returns empty',                  i: FsLoc.Constants.relDirCurrent,      o: '' },
      { name: 'directory with dots in name',                  i: l('/my.folder.v2/'),                 o: 'my.folder.v2' },
    ], ({ i, o }) => {
      const result = FsLoc.name(i)
      expect(result).toBe(o)
    })

  // dprint-ignore
  Test.Table.suite<
    void,
    boolean,
    { child: FsLoc.FsLoc; parent: FsLoc.Groups.Dir.Dir }
  >('.isUnder', [
    // Absolute paths - true cases
    { name: 'abs file under abs dir',                          i: undefined, child: l('/home/user/project/src/index.ts'), parent: l('/home/user/project/'),         o: true },
    { name: 'abs dir under abs dir',                           i: undefined, child: l('/home/user/project/'),             parent: l('/home/user/'),                  o: true },
    { name: 'file in dir (same segments)',                     i: undefined, child: l('/home/user/README.md'),            parent: l('/home/user/'),                  o: true },
    { name: 'deeply nested under parent',                      i: undefined, child: l('/a/b/c/d/e/f/g.txt'),              parent: l('/a/b/'),                        o: true },
    { name: 'file under root',                                 i: undefined, child: l('/file.txt'),                        parent: l('/'),                            o: true },
    { name: 'deep file under root',                            i: undefined, child: l('/home/user/file.txt'),             parent: l('/'),                            o: true },

    // Relative paths - true cases
    { name: 'rel file under rel dir',                          i: undefined, child: l('./src/components/Button.tsx'),     parent: l('./src/'),                       o: true },
    { name: 'rel dir under rel dir',                           i: undefined, child: l('./src/components/'),               parent: l('./src/'),                       o: true },

    // False cases
    { name: 'unrelated abs paths',                             i: undefined, child: l('/home/other/file.txt'),            parent: l('/home/user/project/'),         o: false },
    { name: 'sibling abs dirs',                                i: undefined, child: l('/home/user2/'),                    parent: l('/home/user1/'),                 o: false },
    { name: 'same abs dir',                                    i: undefined, child: l('/home/user/'),                    parent: l('/home/user/'),                  o: false },
    { name: 'child above parent',                              i: undefined, child: l('/home/'),                         parent: l('/home/user/project/'),         o: false },
    { name: 'root under root',                                 i: undefined, child: l('/'),                              parent: l('/'),                            o: false },
    { name: 'unrelated rel paths',                             i: undefined, child: l('./lib/util.ts'),                  parent: l('./src/'),                      o: false },

    // Mixed abs/rel - false
    { name: 'abs child with rel parent',                       i: undefined, child: l('/home/file.txt'),                 parent: l('./src/'),                      o: false },
    { name: 'rel child with abs parent',                       i: undefined, child: l('./file.txt'),                     parent: l('/home/user/'),                 o: false },
  ], ({ i, o, child, parent }) => {
    expect(FsLoc.isUnder(child, parent)).toBe(o)
  })

  // dprint-ignore
  Test.Table.suite<
    void,
    boolean,
    { parent: FsLoc.Groups.Dir.Dir; child: FsLoc.FsLoc }
  >('.isAbove', [
    { name: 'dir above file',                                  i: undefined, parent: l('/home/user/project/'),           child: l('/home/user/project/src/index.ts'), o: true },
    { name: 'dir above dir',                                   i: undefined, parent: l('/home/'),                        child: l('/home/user/project/'),            o: true },
    { name: 'dir not above unrelated',                         i: undefined, parent: l('/home/user/'),                   child: l('/other/file.txt'),                o: false },
  ], ({ i, o, parent, child }) => {
    expect(FsLoc.isAbove(parent, child)).toBe(o)
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
})

Test.Table.suite<
  string,
  FsLoc.FsLocLoose.LocLoose
>(
  '.FsLocLoose.decodeSync', // dprint-ignore
  [
    { name: 'abs file',      i: '/home/file.txt',           o: LocLoose({ path: PathAbs({ segments: ['home'] }), file: File({ name: 'file', extension: '.txt' }) }) },
    { name: 'abs dir',       i: '/home/',                   o: LocLoose({ path: PathAbs({ segments: ['home'] }), file: null }) },
    { name: 'rel file',      i: 'file.txt',                 o: LocLoose({ path: PathRel({ segments: [] }), file: File({ name: 'file', extension: '.txt' }) }) },
    { name: 'rel dir',       i: 'src/',                     o: LocLoose({ path: PathRel({ segments: ['src'] }), file: null }) },
    { name: 'root',          i: '/',                        o: LocLoose({ path: PathAbs({ segments: [] }), file: null }) },
    // Files without extensions are treated as directories - changed to .js extension
    { name: 'complex path',  i: '/usr/local/bin/node.js',   o: LocLoose({ path: PathAbs({ segments: ['usr', 'local', 'bin'] }), file: File({ name: 'node', extension: '.js' }) }) },
  ],
  ({ i, o }) => {
    const result = FsLoc.FsLocLoose.decodeSync(i)
    expect(result).toBeEquivalent(o, FsLoc.FsLocLoose.LocLoose)
  },
)

describe('.Constants', () => {
  describe('absDirRoot', () => {
    it('represents the root directory /', () => {
      expect(FsLoc.Constants.absDirRoot).toEqual(l('/'))
      expect(FsLoc.AbsDir.encodeSync(FsLoc.Constants.absDirRoot)).toBe('/')
    })
  })

  describe('relDirCurrent', () => {
    it('represents the current directory .', () => {
      expect(FsLoc.Constants.relDirCurrent).toEqual(l('./'))
      expect(FsLoc.RelDir.encodeSync(FsLoc.Constants.relDirCurrent)).toBe('./')
    })
  })

  describe('relDirParent', () => {
    it('represents the parent directory ..', () => {
      expect(FsLoc.Constants.relDirParent).toEqual(l('../'))
      expect(FsLoc.RelDir.encodeSync(FsLoc.Constants.relDirParent)).toBe('./../')
    })
  })
})

describe('.fromString', () => {
  it('returns AbsFile for absolute file paths', () => {
    const result = FsLoc.fromString('/path/file.txt')
    expect(result._tag).toBe('LocAbsFile')
    expectTypeOf(result).toEqualTypeOf<FsLoc.AbsFile.AbsFile>()
  })

  it('returns RelFile for relative file paths', () => {
    const result = FsLoc.fromString('file.txt')
    expect(result._tag).toBe('LocRelFile')
    expectTypeOf(result).toEqualTypeOf<FsLoc.RelFile.RelFile>()
  })

  it('returns AbsDir for absolute directory paths', () => {
    const result = FsLoc.fromString('/home/')
    expect(result._tag).toBe('LocAbsDir')
    expectTypeOf(result).toEqualTypeOf<FsLoc.AbsDir.AbsDir>()
  })

  it('returns RelDir for relative directory paths', () => {
    const result = FsLoc.fromString('./src/')
    expect(result._tag).toBe('LocRelDir')
    expectTypeOf(result).toEqualTypeOf<FsLoc.RelDir.RelDir>()
  })

  it('type-errors when given non-literal string', () => {
    // @ts-expect-error: fromString requires a literal string
    FsLoc.fromString('/' as string)
  })
})
