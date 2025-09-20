import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import { FileSystem } from '@effect/platform'
import { Array, Effect, Layer, Option } from 'effect'
import { expect, expectTypeOf, test } from 'vitest'

const relDir = FsLoc.RelDir.decodeSync
const absDir = FsLoc.AbsDir.decodeSync
const absFile = FsLoc.AbsFile.decodeSync
const relFile = FsLoc.RelFile.decodeSync

const absDirTest = absDir('/a/')

const fx = {
  a: {
    rel: relFile('./a.json'),
    abs: absFile('/a/a.json'),
  },
  b: {
    rel: relFile('./b.json'),
    abs: absFile('/a/b.json'),
  },
  dir: {
    rel: relDir('./c'),
    abs: absDir('/a/c'),
  },
}

test('findFirstUnderDir type inference', () => {
  // Test with only files - should return Option<AbsFile>
  const onlyFiles = [fx.a.rel, fx.b.rel]
  const fileResult = Fs.findFirstUnderDir(absDirTest)(onlyFiles)
  expectTypeOf(fileResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.AbsFile.AbsFile>, Error, FileSystem.FileSystem>
  >()

  // Test with only directories - should return Option<AbsDir>
  const onlyDirs = [fx.dir.rel, relDir('./test/')]
  const dirResult = Fs.findFirstUnderDir(absDirTest)(onlyDirs)
  expectTypeOf(dirResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.AbsDir.AbsDir>, Error, FileSystem.FileSystem>
  >()

  // Test with mixed - should return Option<Abs>
  const mixed = [fx.a.rel, fx.dir.rel]
  const mixedResult = Fs.findFirstUnderDir(absDirTest)(mixed)
  expectTypeOf(mixedResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.Groups.Abs.Abs>, Error, FileSystem.FileSystem>
  >()
})

interface TestCase {
  fixture?: FsLoc.FsLoc[]
  input: {
    dir?: FsLoc.AbsDir.AbsDir
    paths: FsLoc.Groups.Rel.Rel[]
  }
  expected: {
    path: FsLoc.Groups.Abs.Abs | null
  }
}

// dprint-ignore
const cases: Test.Table.Case<TestCase>[] = [
  { name: 'finds single file',
    input: { paths: [fx.a.rel] }, expected: { path: fx.a.abs } },

  { name: 'finds first file when both exist',
    input: { paths: [fx.a.rel, fx.b.rel] }, expected: { path: fx.a.abs } },

  { name: 'finds second file when only second exists',
    input: { paths: [fx.a.rel, fx.b.rel] }, fixture: [fx.b.abs], expected: { path: fx.b.abs } },

  { name: 'finds directory',
    input: { paths: [fx.dir.rel] }, expected: { path: fx.dir.abs } },

  { name: 'finds first of mixed types',
    input: { paths: [fx.a.rel, fx.dir.rel] }, expected: { path: fx.a.abs } },

  { name: 'returns None when nothing exists',
    input: { paths: [fx.a.rel, fx.b.rel] }, fixture: [], expected: { path: null } },
]

Test.Table.suiteWithDynamicLayers<TestCase>({
  description: 'findFirstUnderDir',
  cases,
  layer: ({ fixture: fixtureOverride }) => {
    const fixture = fixtureOverride ?? [
      fx.a.abs,
      fx.b.abs,
      fx.dir.abs,
    ]

    return Layer.mock(FileSystem.FileSystem, {
      exists: (path: string) => {
        const pathLoc = FsLoc.decodeSync(path)
        const exists = Array.containsWith(FsLoc.equivalence)(fixture, pathLoc)
        return Effect.succeed(exists)
      },
      sink: () => undefined as any,
    })
  },
  test: ({ input, expected }) =>
    Effect.gen(function*() {
      const result = yield* Fs.findFirstUnderDir(input.dir ?? absDirTest)(input.paths)

      if (expected.path) {
        expect(Option.isSome(result)).toBe(true)
        if (Option.isSome(result)) {
          const isEqual = FsLoc.equivalence(result.value, expected.path)
          expect(isEqual).toBe(true)
        }
      } else {
        expect(Option.isNone(result)).toBe(true)
      }
    }),
})
