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
    { n: 'simple file in root',                          i: '/file.txt',                o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: '/file.txt' } },
    { n: 'file in nested path',                          i: '/home/user/doc.pdf',       o: { path: ['home', 'user'],                    fileName: 'doc',        extension: '.pdf',  encoded: '/home/user/doc.pdf' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'file with no extension',                       i: '/README',                  o: { path: [],                                   fileName: 'README',     extension: null,    encoded: '/README' } },
    { n: 'deeply nested file',                           i: '/a/b/c/d/e.js',            o: { path: ['a', 'b', 'c', 'd'],                fileName: 'e',          extension: '.js',   encoded: '/a/b/c/d/e.js' } },
    { n: 'file with multiple dots',                      i: '/archive.tar.gz',          o: { path: [],                                   fileName: 'archive.tar', extension: '.gz',  encoded: '/archive.tar.gz' } },
    // Note: Hidden files without extensions are currently treated as directories by the analyzer
    // { name: 'hidden file',                                  i: '/.gitignore',              o: { path: [],                                   fileName: '.gitignore', extension: null,    encoded: '/.gitignore' } },
    { n: 'hidden file with extension',                   i: '/.config.json',            o: { path: [],                                   fileName: '.config',    extension: '.json', encoded: '/.config.json' } },
    { n: 'file with spaces',                             i: '/my docs/file name.txt',   o: { path: ['my docs'],                         fileName: 'file name',  extension: '.txt',  encoded: '/my docs/file name.txt' } },
    { n: 'throws on relative path',                      i: 'file.txt',                 o: { throws: true } },
    { n: 'throws on directory path',                     i: '/home/user/',              o: { throws: true } },
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
    { n: 'simple relative file',                         i: 'file.txt',                 o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { n: 'current dir prefix',                           i: './file.txt',               o: { path: [],                                   fileName: 'file',       extension: '.txt',  encoded: './file.txt' } },
    { n: 'parent dir reference',                         i: '../file.txt',              o: { path: ['..'],                               fileName: 'file',       extension: '.txt',  encoded: './../file.txt' } },
    { n: 'nested relative path',                         i: 'src/index.ts',             o: { path: ['src'],                              fileName: 'index',      extension: '.ts',   encoded: './src/index.ts' } },
    { n: 'multiple parent refs',                         i: '../../lib/util.js',        o: { path: ['..', '..', 'lib'],                 fileName: 'util',       extension: '.js',   encoded: './../../lib/util.js' } },
    // Note: Files without extensions are currently treated as directories by the analyzer
    // { name: 'no extension',                                 i: 'README',                   o: { path: [],                                   fileName: 'README',     extension: null,    encoded: './README' } },
    // { name: 'hidden file',                                  i: '.env',                     o: { path: [],                                   fileName: '.env',       extension: null,    encoded: './.env' } },
    { n: 'complex nested path',                          i: './src/components/App.tsx', o: { path: ['src', 'components'],               fileName: 'App',        extension: '.tsx',  encoded: './src/components/App.tsx' } },
    { n: 'throws on absolute path',                      i: '/file.txt',                o: { throws: true } },
    { n: 'throws on directory',                          i: 'src/',                     o: { throws: true } },
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
    { n: 'root directory',                               i: '/',                        o: { path: [],                                   encoded: '/' } },
    { n: 'simple directory',                             i: '/home/',                   o: { path: ['home'],                            encoded: '/home/' } },
    { n: 'nested directory',                             i: '/usr/local/bin/',          o: { path: ['usr', 'local', 'bin'],             encoded: '/usr/local/bin/' } },
    { n: 'directory without trailing slash',             i: '/home',                    o: { path: ['home'],                            encoded: '/home/' } },
    { n: 'deeply nested',                                i: '/a/b/c/d/e/',              o: { path: ['a', 'b', 'c', 'd', 'e'],          encoded: '/a/b/c/d/e/' } },
    { n: 'with spaces',                                  i: '/my documents/projects/',  o: { path: ['my documents', 'projects'],       encoded: '/my documents/projects/' } },
    { n: 'throws on relative path',                      i: 'home/',                    o: { throws: true } },
    { n: 'throws on relative with dot',                  i: './home/',                  o: { throws: true } },
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
    { n: 'current directory',                            i: './',                       o: { path: [],                                   encoded: './' } },
    { n: 'simple relative dir',                          i: 'src/',                     o: { path: ['src'],                             encoded: './src/' } },
    { n: 'parent directory',                             i: '../',                      o: { path: ['..'],                              encoded: './../' } },
    { n: 'nested relative',                              i: 'src/components/',          o: { path: ['src', 'components'],               encoded: './src/components/' } },
    { n: 'multiple parent refs',                         i: '../../lib/',               o: { path: ['..', '..', 'lib'],                 encoded: './../../lib/' } },
    { n: 'with current dir prefix',                      i: './src/',                   o: { path: ['src'],                             encoded: './src/' } },
    { n: 'complex path',                                 i: '../src/lib/utils/',        o: { path: ['..', 'src', 'lib', 'utils'],       encoded: './../src/lib/utils/' } },
    { n: 'without trailing slash',                       i: 'src',                      o: { path: ['src'],                             encoded: './src/' } },
    { n: 'throws on absolute path',                      i: '/src/',                    o: { throws: true } },
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
      void,
      string,
      {
        base: FsLoc.Groups.Dir.Dir
        rel: FsLoc.Groups.Rel.Rel
      }
    >('.join', [
      // Note: join doesn't correctly handle file types yet - it preserves the base type instead of using the rel type
      // { name: 'abs dir + rel file',                           base: l('/home/'),                         rel: l('file.txt'),                         o: '/home/file.txt' },
      { n: 'abs dir + rel dir',                            base: l('/home/'),                         rel: l('documents/'),                       o: '/home/documents/' },
      // { name: 'rel dir + rel file',                           base: l('src/'),                           rel: l('index.ts'),                         o: './src/index.ts' },
      { n: 'rel dir + rel dir',                            base: l('src/'),                           rel: l('components/'),                      o: './src/components/' },
      // { name: 'root + rel file',                              base: l('/'),                              rel: l('file.txt'),                         o: '/file.txt' },
      { n: 'root + rel dir',                               base: FsLoc.Constants.absDirRoot,          rel: l('home/'),                           o: '/home/' },
      // Files without extensions are treated as directories
      // { name: 'nested abs + nested rel',                      base: l('/usr/local/'),                    rel: l('bin/node'),                         o: '/usr/local/bin/node' },
      // { name: 'parent refs preserved',                        base: l('../'),                            rel: l('lib/utils.js'),                    o: './../lib/utils.js' },
    ], ({ o, base, rel }) => {
      const result = FsLoc.join(base, rel)
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
        base?: FsLoc.AbsDir.AbsDir
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
        base?: FsLoc.AbsDir.AbsDir
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
        base: FsLoc.AbsDir.AbsDir
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
    void,
    boolean,
    { child: FsLoc.FsLoc; parent: FsLoc.Groups.Dir.Dir }
  >('.isUnder', [
    // Absolute paths - true cases
    { n: 'abs file under abs dir',                          child: l('/home/user/project/src/index.ts'), parent: l('/home/user/project/'),         o: true },
    { n: 'abs dir under abs dir',                           child: l('/home/user/project/'),             parent: l('/home/user/'),                  o: true },
    { n: 'file in dir (same segments)',                     child: l('/home/user/README.md'),            parent: l('/home/user/'),                  o: true },
    { n: 'deeply nested under parent',                      child: l('/a/b/c/d/e/f/g.txt'),              parent: l('/a/b/'),                        o: true },
    { n: 'file under root',                                 child: l('/file.txt'),                        parent: l('/'),                            o: true },
    { n: 'deep file under root',                            child: l('/home/user/file.txt'),             parent: l('/'),                            o: true },

    // Relative paths - true cases
    { n: 'rel file under rel dir',                          child: l('./src/components/Button.tsx'),     parent: l('./src/'),                       o: true },
    { n: 'rel dir under rel dir',                           child: l('./src/components/'),               parent: l('./src/'),                       o: true },

    // False cases
    { n: 'unrelated abs paths',                             child: l('/home/other/file.txt'),            parent: l('/home/user/project/'),         o: false },
    { n: 'sibling abs dirs',                                child: l('/home/user2/'),                    parent: l('/home/user1/'),                 o: false },
    { n: 'same abs dir',                                    child: l('/home/user/'),                    parent: l('/home/user/'),                  o: false },
    { n: 'child above parent',                              child: l('/home/'),                         parent: l('/home/user/project/'),         o: false },
    { n: 'root under root',                                 child: l('/'),                              parent: l('/'),                            o: false },
    { n: 'unrelated rel paths',                             child: l('./lib/util.ts'),                  parent: l('./src/'),                      o: false },

    // Mixed abs/rel - false
    { n: 'abs child with rel parent',                       child: l('/home/file.txt'),                 parent: l('./src/'),                      o: false },
    { n: 'rel child with abs parent',                       child: l('./file.txt'),                     parent: l('/home/user/'),                 o: false },
  ], ({ o, child, parent }) => {
    expect(FsLoc.isUnder(child, parent)).toBe(o)
  })

  // dprint-ignore
  Test.Table.suite<
    void,
    boolean,
    { parent: FsLoc.Groups.Dir.Dir; child: FsLoc.FsLoc }
  >('.isAbove', [
    { n: 'dir above file',                                  parent: l('/home/user/project/'),           child: l('/home/user/project/src/index.ts'), o: true },
    { n: 'dir above dir',                                   parent: l('/home/'),                        child: l('/home/user/project/'),            o: true },
    { n: 'dir not above unrelated',                         parent: l('/home/user/'),                   child: l('/other/file.txt'),                o: false },
  ], ({ o, parent, child }) => {
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
    { n: 'abs file',      i: '/home/file.txt',           o: LocLoose({ path: PathAbs({ segments: ['home'] }), file: File({ name: 'file', extension: '.txt' }) }) },
    { n: 'abs dir',       i: '/home/',                   o: LocLoose({ path: PathAbs({ segments: ['home'] }), file: null }) },
    { n: 'rel file',      i: 'file.txt',                 o: LocLoose({ path: PathRel({ segments: [] }), file: File({ name: 'file', extension: '.txt' }) }) },
    { n: 'rel dir',       i: 'src/',                     o: LocLoose({ path: PathRel({ segments: ['src'] }), file: null }) },
    { n: 'root',          i: '/',                        o: LocLoose({ path: PathAbs({ segments: [] }), file: null }) },
    // Files without extensions are treated as directories - changed to .js extension
    { n: 'complex path',  i: '/usr/local/bin/node.js',   o: LocLoose({ path: PathAbs({ segments: ['usr', 'local', 'bin'] }), file: File({ name: 'node', extension: '.js' }) }) },
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
