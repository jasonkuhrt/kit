import { Fs } from '#fs'
import { Test } from '#test'
import { describe, expect, test } from 'vitest'

const p = Fs.Path.fromLiteral

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
    expect(parent.back).toBe(1)
    expect(parent.segments).toEqual([])
    expect(Fs.Path.RelDir.toString(parent)).toBe('../')
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
        // Basic forward joins
        [[p('/home/user/'), p('src/index.ts')], p('/home/user/src/index.ts')],
        [[p('/home/user/'), p('src/lib/')], p('/home/user/src/lib/')],
        [[p('src/'), p('lib/utils.ts')], p('./src/lib/utils.ts')],
        // Back path joins - consumes base segments
        [[p('/home/user/src/'), p('../docs/')], p('/home/user/docs/')],
        [[p('/home/user/src/'), p('../docs/readme.md')], p('/home/user/docs/readme.md')],
        // Back path that exceeds base (AbsDir - clamped at root)
        [[p('/home/'), p('../../../other/')], p('/other/')],
        // Back path that exceeds base (RelDir - propagates remaining back)
        [[p('src/'), p('../../lib/')], p('../lib/')],
        [[p('src/'), p('../../../lib/file.ts')], p('../../lib/file.ts')],
        // RelDir with back as base
        [[p('../src/'), p('file.ts')], p('../src/file.ts')],
        [[p('../../'), p('lib/')], p('../../lib/')],
      )
      .test()
  })

  describe('up', () => {
    Test.on(Fs.Path.up)
      .cases(
        // AbsDir
        [[p('/home/user/docs/')], p('/home/user/')],
        [[p('/')], p('/')],
        // RelDir
        [[p('./src/lib/')], p('./src/')],
        [[p('./')], p('../')],
        [[p('../')], p('../../')],
        [[p('../src/')], p('../')],
        // RelFile
        [[p('./src/lib/file.ts')], p('./src/file.ts')],
        [[p('./file.ts')], p('../file.ts')],
      )
      .test()
  })

  describe('toAbs', () => {
    Test.on(Fs.Path.toAbs)
      .cases(
        // Forward paths
        [[p('src/index.ts'), p('/home/user/')], p('/home/user/src/index.ts')],
        [[p('src/lib/'), p('/home/user/')], p('/home/user/src/lib/')],
        // Back paths - go up from base
        [[p('../file.ts'), p('/home/user/')], p('/home/file.ts')],
        [[p('../../'), p('/home/user/src/')], p('/home/')],
        [[p('../../lib/util.ts'), p('/home/user/src/')], p('/home/lib/util.ts')],
      )
      .test()
  })

  describe('toRel', () => {
    Test.on(Fs.Path.toRel)
      .cases(
        // Forward paths (path is descendant of base)
        [[p('/home/user/src/index.ts'), p('/home/user/')], p('./src/index.ts')],
        [[p('/home/user/src/lib/'), p('/home/user/')], p('./src/lib/')],
        [[p('/home/user/'), p('/home/user/')], p('./')],
        // Back paths (path not descendant of base) - Issue #122
        [[p('/a/b/c/scalars.ts'), p('/a/b/c/graffle/modules/')], p('../../scalars.ts')],
        [[p('/home/user/docs/'), p('/home/user/src/lib/')], p('../../docs/')],
        [[p('/other/place/file.ts'), p('/home/user/')], p('../../other/place/file.ts')],
      )
      .test()
  })

  describe('toDir', () => {
    Test.on(Fs.Path.toDir)
      .cases(
        // Standard cases
        [[p('/home/user/src/index.ts')], p('/home/user/src/')],
        [[p('src/index.ts')], p('./src/')],
        // Back paths - preserve back value
        [[p('../file.ts')], p('../')],
        [[p('../../src/file.ts')], p('../../src/')],
        // File in current dir
        [[p('./file.ts')], p('./')],
      )
      .test()
  })

  describe('name', () => {
    Test.on(Fs.Path.name)
      .cases(
        // Standard cases
        [[p('/home/user/index.ts')], 'index.ts'],
        [[p('src/README.md')], 'README.md'],
        [[p('/home/user/docs/')], 'docs'],
        [[p('/')], ''],
        // Back-only paths (empty segments)
        [[p('./')], ''],
        [[p('../')], ''],
        [[p('../../')], ''],
        // Back paths with fileName still have a name
        [[p('../file.ts')], 'file.ts'],
        [[p('../../file.ts')], 'file.ts'],
      )
      .test()
  })

  describe('stem', () => {
    Test.on(Fs.Path.stem)
      .cases(
        // Standard cases
        [[p('/home/index.ts')], 'index'],
        [[p('src/lib/')], 'lib'],
        // Back-only paths
        [[p('./')], ''],
        [[p('../')], ''],
        // Back paths with fileName
        [[p('../file.ts')], 'file'],
      )
      .test()
  })

  describe('extension', () => {
    Test.on(Fs.Path.extension)
      .cases(
        [[p('/home/index.ts')], '.ts'],
        [[p('src/README.md')], '.md'],
        [[p('/home/user/')], null],
      )
      .test()
  })
})

// === Back Field & Normalization Tests ===

describe('Back field model', () => {
  describe('Internal structure (back and segments)', () => {
    // RelDir
    Test.describe('RelDir internal structure')
      .inputType<string>()
      .outputType<{ back: number; segments: readonly string[] }>()
      .cases(
        // Forward paths (back: 0)
        ['./', { back: 0, segments: [] }],
        ['./src/', { back: 0, segments: ['src'] }],
        ['src/', { back: 0, segments: ['src'] }],
        ['src/lib/', { back: 0, segments: ['src', 'lib'] }],
        // Back paths (back > 0)
        ['../', { back: 1, segments: [] }],
        ['../../', { back: 2, segments: [] }],
        ['../src/', { back: 1, segments: ['src'] }],
        ['../../lib/', { back: 2, segments: ['lib'] }],
        ['../../lib/utils/', { back: 2, segments: ['lib', 'utils'] }],
      )
      .test(({ input, output }) => {
        const result = Fs.Path.RelDir.fromString(input)
        expect(result.back).toBe(output.back)
        expect(result.segments).toEqual(output.segments)
      })

    // RelFile
    Test.describe('RelFile internal structure')
      .inputType<string>()
      .outputType<{ back: number; segments: readonly string[] }>()
      .cases(
        // Forward paths (back: 0)
        ['file.txt', { back: 0, segments: [] }],
        ['./file.txt', { back: 0, segments: [] }],
        ['src/file.txt', { back: 0, segments: ['src'] }],
        ['./src/file.txt', { back: 0, segments: ['src'] }],
        ['src/lib/file.txt', { back: 0, segments: ['src', 'lib'] }],
        // Back paths (back > 0)
        ['../file.txt', { back: 1, segments: [] }],
        ['../../file.txt', { back: 2, segments: [] }],
        ['../src/file.txt', { back: 1, segments: ['src'] }],
        ['../../lib/file.txt', { back: 2, segments: ['lib'] }],
        ['../../lib/utils/file.txt', { back: 2, segments: ['lib', 'utils'] }],
      )
      .test(({ input, output }) => {
        const result = Fs.Path.RelFile.fromString(input)
        expect(result.back).toBe(output.back)
        expect(result.segments).toEqual(output.segments)
      })
  })

  describe('Normalization (.. resolution)', () => {
    // RelDir normalization
    Test.describe('RelDir normalization')
      .inputType<string>()
      .outputType<{ back: number; segments: readonly string[] }>()
      .cases(
        // Inline .. that can be resolved
        ['./a/../b/', { back: 0, segments: ['b'] }],
        ['a/b/../c/', { back: 0, segments: ['a', 'c'] }],
        ['a/b/c/../../d/', { back: 0, segments: ['a', 'd'] }],
        ['a/b/c/../../../d/', { back: 0, segments: ['d'] }],
        // Inline .. that escapes (becomes back)
        ['a/../../../b/', { back: 2, segments: ['b'] }],
        ['a/b/../../c/../../../d/', { back: 2, segments: ['d'] }],
      )
      .test(({ input, output }) => {
        const result = Fs.Path.RelDir.fromString(input)
        expect(result.back).toBe(output.back)
        expect(result.segments).toEqual(output.segments)
      })

    // RelFile normalization
    Test.describe('RelFile normalization')
      .inputType<string>()
      .outputType<{ back: number; segments: readonly string[] }>()
      .cases(
        // Inline .. that can be resolved
        ['./a/../file.txt', { back: 0, segments: [] }],
        ['a/b/../file.txt', { back: 0, segments: ['a'] }],
        ['a/b/c/../../file.txt', { back: 0, segments: ['a'] }],
        // Inline .. that escapes (becomes back)
        ['a/../../../file.txt', { back: 2, segments: [] }],
        ['a/b/../../c/../../../file.txt', { back: 2, segments: [] }],
      )
      .test(({ input, output }) => {
        const result = Fs.Path.RelFile.fromString(input)
        expect(result.back).toBe(output.back)
        expect(result.segments).toEqual(output.segments)
      })
  })

  describe('Round-trip encoding (parse → encode)', () => {
    // This is the main bug fix validation - ensure paths encode correctly
    Test.describe('RelDir round-trip')
      .inputType<string>()
      .outputType<string>()
      .cases(
        // Forward paths
        ['./', './'],
        ['./src/', './src/'],
        ['src/', './src/'],
        ['src/lib/', './src/lib/'],
        // Back paths - THE BUG FIX: these should NOT have ./ prefix
        ['../', '../'],
        ['../../', '../../'],
        ['../src/', '../src/'],
        ['../../lib/', '../../lib/'],
        ['../../lib/utils/', '../../lib/utils/'],
        // Normalized paths encode to canonical form
        ['./a/../b/', './b/'],
        ['a/../../../b/', '../../b/'],
      )
      .test(({ input, output }) => {
        const parsed = Fs.Path.RelDir.fromString(input)
        const encoded = Fs.Path.RelDir.toString(parsed)
        expect(encoded).toBe(output)
      })

    Test.describe('RelFile round-trip')
      .inputType<string>()
      .outputType<string>()
      .cases(
        // Forward paths
        ['file.txt', './file.txt'],
        ['./file.txt', './file.txt'],
        ['src/file.txt', './src/file.txt'],
        ['./src/file.txt', './src/file.txt'],
        // Back paths - THE BUG FIX: these should NOT have ./ prefix
        ['../file.txt', '../file.txt'],
        ['../../file.txt', '../../file.txt'],
        ['../src/file.txt', '../src/file.txt'],
        ['../../lib/file.txt', '../../lib/file.txt'],
        // Normalized paths encode to canonical form
        ['./a/../file.txt', './file.txt'],
        ['a/../../../file.txt', '../../file.txt'],
      )
      .test(({ input, output }) => {
        const parsed = Fs.Path.RelFile.fromString(input)
        const encoded = Fs.Path.RelFile.toString(parsed)
        expect(encoded).toBe(output)
      })
  })
})

// === States Tests ===

describe('States', () => {
  describe('isRoot', () => {
    Test.on(Fs.Path.States.isRoot)
      .cases(
        // True cases - at root/reference point
        [[p('/')], true],
        [[p('./')], true],
        // False cases - has segments
        [[p('/home/')], false],
        [[p('src/')], false],
        [[p('/home/user/')], false],
        // False cases - back paths (above reference point, NOT at root)
        [[p('../')], false],
        [[p('../../')], false],
        [[p('../src/')], false],
      )
      .test()
  })

  describe('isTop', () => {
    Test.on(Fs.Path.States.isTop)
      .cases(
        [[p('/home/')], true],
        [[p('src/')], true],
        [[p('/')], false],
        [[p('/home/user/')], false],
        [[p('src/lib/')], false],
      )
      .test()
  })

  describe('isSub', () => {
    Test.on(Fs.Path.States.isSub)
      .cases(
        [[p('/home/user/')], true],
        [[p('src/lib/')], true],
        [[p('/a/b/c/')], true],
        [[p('/')], false],
        [[p('/home/')], false],
        [[p('src/')], false],
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
      const input = p('/home/file.txt')
      const result = normalizeAbsFile(input)
      expect(result).toBe(input)
    })

    test('converts string to RelDir', () => {
      const result = normalizeRelDir('./src/')
      expect(Fs.Path.RelDir.is(result)).toBe(true)
      expect(result.segments).toEqual(['src'])
    })

    test('passes through RelDir instance', () => {
      const input = p('src/')
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
      const input = p('/home/file.txt')
      const result = normalizeDynamicAbsFile(input)
      expect(result).toBe(input)
    })
  })
})
