import { Fs } from '#fs'
import { Test } from '#test'
import { Ts } from '#ts'
import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

// === String Decoding Tests ===

// dprint-ignore
Test.describe('String decoding')
  .inputType<string>()
  .outputType<{ is: (value: any) => boolean }>()
  .cases(
    // AbsFile
    ['/file.txt',                  Fs.Path.AbsFile],
    ['/home/user/doc.pdf',         Fs.Path.AbsFile],
    ['/a/b/c/d/e.js',              Fs.Path.AbsFile],
    ['/archive.tar.gz',            Fs.Path.AbsFile],
    ['/.config.json',              Fs.Path.AbsFile],
    ['/my docs/file name.txt',     Fs.Path.AbsFile],

    // RelFile
    ['file.txt',                   Fs.Path.RelFile],
    ['./file.txt',                 Fs.Path.RelFile],
    ['../file.txt',                Fs.Path.RelFile],
    ['src/index.ts',               Fs.Path.RelFile],
    ['../../lib/util.js',          Fs.Path.RelFile],
    ['./src/components/App.tsx',   Fs.Path.RelFile],

    // AbsDir
    ['/',                          Fs.Path.AbsDir],
    ['/home/',                     Fs.Path.AbsDir],
    ['/home',                      Fs.Path.AbsDir],
    ['/usr/local/bin/',            Fs.Path.AbsDir],
    ['/a/b/c/d/e/',                Fs.Path.AbsDir],
    ['/my documents/projects/',    Fs.Path.AbsDir],

    // RelDir
    ['./',                         Fs.Path.RelDir],
    ['src/',                       Fs.Path.RelDir],
    ['../',                        Fs.Path.RelDir],
    ['src/components/',            Fs.Path.RelDir],
    ['../../lib/',                 Fs.Path.RelDir],
    ['./src/',                     Fs.Path.RelDir],
    ['../src/lib/utils/',          Fs.Path.RelDir],
    ['src',                        Fs.Path.RelDir],
  )
  .test(({ input, output }) => {
    const result = Fs.Path.fromString(input)
    expect(output.is(result)).toBe(true)
  })

// === Constants Tests ===

describe('Constants', () => {
  test('absDirRoot represents /', () => {
    const root = Fs.Path.absDirRoot()
    expect(Fs.Path.AbsDir.is(root)).toBe(true)
    expect(root.segments).toEqual([])
    expect(Fs.Path.AbsDir.toString(root)).toBe('/')
  })

  test('relDirCurrent represents ./', () => {
    const current = Fs.Path.relDirCurrent()
    expect(Fs.Path.RelDir.is(current)).toBe(true)
    expect(current.segments).toEqual([])
    expect(Fs.Path.RelDir.toString(current)).toBe('./')
  })

  test('relDirParent represents ../', () => {
    const parent = Fs.Path.relDirParent()
    expect(Fs.Path.RelDir.is(parent)).toBe(true)
    expect(parent.segments).toEqual(['..'])
    expect(Fs.Path.RelDir.toString(parent)).toBe('./../')
  })
})

// === Group Assertions Tests ===

// dprint-ignore
Test.describe('Groups *.is')
  .inputType<string>()
  .outputType<{ check: Function; pass: boolean }>()
  .cases(
    ['file.txt',  { check: Fs.Path.$Rel.is,  pass: true }],
    ['/file.txt', { check: Fs.Path.$Rel.is,  pass: false }],

    ['/file.txt', { check: Fs.Path.$Abs.is,  pass: true }],
    ['file.txt',  { check: Fs.Path.$Abs.is,  pass: false }],

    ['file.txt',  { check: Fs.Path.$File.is, pass: true }],
    ['./src/',    { check: Fs.Path.$File.is, pass: false }],

    ['./src/',    { check: Fs.Path.$Dir.is,  pass: true }],
    ['file.txt',  { check: Fs.Path.$Dir.is,  pass: false }],

    ['/file.txt',  { check: Fs.Path.AbsFile.is,  pass: true }],
    ['file.txt',   { check: Fs.Path.AbsFile.is,  pass: false }],
    ['/dir/',      { check: Fs.Path.AbsFile.is,  pass: false }],

    ['file.txt',   { check: Fs.Path.RelFile.is,  pass: true }],
    ['/file.txt',  { check: Fs.Path.RelFile.is,  pass: false }],
    ['./dir/',     { check: Fs.Path.RelFile.is,  pass: false }],

    ['/dir/',      { check: Fs.Path.AbsDir.is,   pass: true }],
    ['./dir/',     { check: Fs.Path.AbsDir.is,   pass: false }],
    ['/file.txt',  { check: Fs.Path.AbsDir.is,   pass: false }],

    ['./dir/',     { check: Fs.Path.RelDir.is,   pass: true }],
    ['/dir/',      { check: Fs.Path.RelDir.is,   pass: false }],
    ['file.txt',   { check: Fs.Path.RelDir.is,   pass: false }],
  )
  .test(({ input, output }) => {
    const path = Fs.Path.fromString(input)
    expect(output.check(path)).toBe(output.pass)
  })

// === Operation Tests ===

describe('Operations', () => {
  describe('join', () => {
    Test.on(Fs.Path.join)
      .cases(
        [
          [
            Fs.Path.AbsDir.fromString('/home/user/'),
            Fs.Path.RelFile.fromString('src/index.ts'),
          ],
          Fs.Path.AbsFile.fromString('/home/user/src/index.ts'),
        ],
        [
          [Fs.Path.AbsDir.fromString('/home/user/'), Fs.Path.RelDir.fromString('src/lib/')],
          Fs.Path.AbsDir.fromString('/home/user/src/lib/'),
        ],
        [
          [
            Fs.Path.RelDir.fromString('src/'),
            Fs.Path.RelFile.fromString('lib/utils.ts'),
          ],
          Fs.Path.RelFile.fromString('src/lib/utils.ts'),
        ],
        [
          [
            Fs.Path.AbsDir.fromString('/home/user/src/'),
            Fs.Path.RelDir.fromString('../docs/'),
          ],
          Fs.Path.AbsDir.fromString('/home/user/docs/'),
        ],
      )
      .test()
  })

  describe('toAbs', () => {
    Test.on(Fs.Path.toAbs)
      .cases(
        [
          [
            Fs.Path.RelFile.fromString('src/index.ts'),
            Fs.Path.AbsDir.fromString('/home/user/'),
          ],
          Fs.Path.AbsFile.fromString('/home/user/src/index.ts'),
        ],
        [
          [Fs.Path.RelDir.fromString('src/lib/'), Fs.Path.AbsDir.fromString('/home/user/')],
          Fs.Path.AbsDir.fromString('/home/user/src/lib/'),
        ],
      )
      .test()
  })

  describe('toRel', () => {
    Test.on(Fs.Path.toRel)
      .cases(
        [
          [
            Fs.Path.AbsFile.fromString('/home/user/src/index.ts'),
            Fs.Path.AbsDir.fromString('/home/user/'),
          ],
          Fs.Path.RelFile.fromString('src/index.ts'),
        ],
        [
          [
            Fs.Path.AbsDir.fromString('/home/user/src/lib/'),
            Fs.Path.AbsDir.fromString('/home/user/'),
          ],
          Fs.Path.RelDir.fromString('src/lib/'),
        ],
        [
          [Fs.Path.AbsDir.fromString('/home/user/'), Fs.Path.AbsDir.fromString('/home/user/')],
          Fs.Path.RelDir.fromString('./'),
        ],
      )
      .test()
  })

  describe('toDir', () => {
    Test.on(Fs.Path.toDir)
      .cases(
        [
          [Fs.Path.AbsFile.fromString('/home/user/src/index.ts')],
          Fs.Path.AbsDir.fromString('/home/user/src/'),
        ],
        [
          [Fs.Path.RelFile.fromString('src/index.ts')],
          Fs.Path.RelDir.fromString('src/'),
        ],
      )
      .test()
  })

  describe('name', () => {
    Test.on(Fs.Path.name)
      .cases(
        [
          [Fs.Path.AbsFile.fromString('/home/user/index.ts')],
          'index.ts',
        ],
        [
          [Fs.Path.RelFile.fromString('src/README.md')],
          'README.md',
        ],
        [[Fs.Path.AbsDir.fromString('/home/user/docs/')], 'docs'],
        [[Fs.Path.AbsDir.fromString('/')], ''],
      )
      .test()
  })

  describe('stem', () => {
    Test.on(Fs.Path.stem)
      .cases(
        [
          [Fs.Path.AbsFile.fromString('/home/index.ts')],
          'index',
        ],
        [[Fs.Path.RelDir.fromString('src/lib/')], 'lib'],
      )
      .test()
  })

  describe('extension', () => {
    Test.on(Fs.Path.extension)
      .cases(
        [
          [Fs.Path.AbsFile.fromString('/home/index.ts')],
          '.ts',
        ],
        [
          [Fs.Path.RelFile.fromString('src/README.md')],
          '.md',
        ],
        [[Fs.Path.AbsDir.fromString('/home/user/')], null],
      )
      .test()
  })
})

// === States Tests ===

describe('States', () => {
  describe('isRoot', () => {
    Test.on(Fs.Path.States.isRoot)
      .cases(
        [[Fs.Path.AbsDir.fromString('/')], true],
        [[Fs.Path.RelDir.fromString('./')], true],
        [[Fs.Path.AbsDir.fromString('/home/')], false],
        [[Fs.Path.RelDir.fromString('src/')], false],
        [[Fs.Path.AbsDir.fromString('/home/user/')], false],
      )
      .test()
  })

  describe('isTop', () => {
    Test.on(Fs.Path.States.isTop)
      .cases(
        [[Fs.Path.AbsDir.fromString('/home/')], true],
        [[Fs.Path.RelDir.fromString('src/')], true],
        [[Fs.Path.AbsDir.fromString('/')], false],
        [[Fs.Path.AbsDir.fromString('/home/user/')], false],
        [[Fs.Path.RelDir.fromString('src/lib/')], false],
      )
      .test()
  })

  describe('isSub', () => {
    Test.on(Fs.Path.States.isSub)
      .cases(
        [[Fs.Path.AbsDir.fromString('/home/user/')], true],
        [[Fs.Path.RelDir.fromString('src/lib/')], true],
        [[Fs.Path.AbsDir.fromString('/a/b/c/')], true],
        [[Fs.Path.AbsDir.fromString('/')], false],
        [[Fs.Path.AbsDir.fromString('/home/')], false],
        [[Fs.Path.RelDir.fromString('src/')], false],
      )
      .test()
  })
})

// === Input System Tests ===

describe('Input System', () => {
  describe('normalizeInput', () => {
    const normalizeAbsFile = Fs.Path.normalizeInput(Fs.Path.AbsFile.Schema)
    const normalizeRelDir = Fs.Path.normalizeInput(Fs.Path.RelDir.Schema)

    test('converts string to AbsFile', () => {
      const result = normalizeAbsFile('/home/file.txt')
      expect(Fs.Path.AbsFile.is(result)).toBe(true)
      expect(result.segments).toEqual(['home'])
    })

    test('passes through AbsFile instance', () => {
      const input = Fs.Path.AbsFile.fromString('/home/file.txt')
      const result = normalizeAbsFile(input)
      expect(result).toBe(input)
    })

    test('converts string to RelDir', () => {
      const result = normalizeRelDir('./src/')
      expect(Fs.Path.RelDir.is(result)).toBe(true)
      expect(result.segments).toEqual(['src'])
    })

    test('passes through RelDir instance', () => {
      const input = Fs.Path.RelDir.fromString('src/')
      const result = normalizeRelDir(input)
      expect(result).toBe(input)
    })
  })

  describe('normalizeDynamicInput', () => {
    const normalizeDynamicAbsFile = Fs.Path.normalizeDynamicInput(Fs.Path.AbsFile.Schema)

    test('converts string to AbsFile', () => {
      const result = normalizeDynamicAbsFile('/home/file.txt')
      expect(Fs.Path.AbsFile.is(result)).toBe(true)
      expect(result.segments).toEqual(['home'])
    })

    test('passes through AbsFile instance', () => {
      const input = Fs.Path.AbsFile.fromString('/home/file.txt')
      const result = normalizeDynamicAbsFile(input)
      expect(result).toBe(input)
    })
  })
})
