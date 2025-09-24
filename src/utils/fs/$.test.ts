import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../test/matchers/$.js'
import { FileSystem } from '@effect/platform'
import { Array, Effect, Layer, Option } from 'effect'
import { expect, expectTypeOf, test } from 'vitest'

const l = FsLoc.fromString

const absDirTest = l('/a/')

const fx = {
  a: {
    rel: l('./a.json'),
    abs: l('/a/a.json'),
  },
  b: {
    rel: l('./b.json'),
    abs: l('/a/b.json'),
  },
  dir: {
    rel: l('./c/'),
    abs: l('/a/c/'),
  },
}

test('.findFirstUnderDir type inference', () => {
  // Test with only files - should return Option<AbsFile>
  const onlyFiles = [fx.a.rel, fx.b.rel]
  const fileResult = Fs.findFirstUnderDir(absDirTest)(onlyFiles)
  expectTypeOf(fileResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.AbsFile>, Error, FileSystem.FileSystem>
  >()

  // Test with only directories - should return Option<AbsDir>
  const onlyDirs = [fx.dir.rel, l('./test/')]
  const dirResult = Fs.findFirstUnderDir(absDirTest)(onlyDirs)
  expectTypeOf(dirResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.AbsDir>, Error, FileSystem.FileSystem>
  >()

  // Test with mixed - should return Option<Abs>
  const mixed = [fx.a.rel, fx.dir.rel]
  const mixedResult = Fs.findFirstUnderDir(absDirTest)(mixed)
  expectTypeOf(mixedResult).toEqualTypeOf<
    Effect.Effect<Option.Option<FsLoc.Groups.Abs.Abs>, Error, FileSystem.FileSystem>
  >()
})

Test.Table.suiteWithDynamicLayers<
  { dir?: FsLoc.AbsDir; paths: FsLoc.Groups.Rel.Rel[] },
  FsLoc.Groups.Abs.Abs | null,
  { data?: FsLoc.FsLoc[] }
>({
  description: '.findFirstUnderDir',
  // dprint-ignore
  cases: [
    { n: 'finds single file',
      i: { paths: [fx.a.rel] }, o: fx.a.abs },

    { n: 'finds first file when both exist',
      i: { paths: [fx.a.rel, fx.b.rel] }, o: fx.a.abs },

    { n: 'finds second file when only second exists',
      i: { paths: [fx.a.rel, fx.b.rel] }, data: [fx.b.abs], o: fx.b.abs },

    { n: 'finds directory',
      i: { paths: [fx.dir.rel] }, o: fx.dir.abs },

    { n: 'finds first of mixed types',
      i: { paths: [fx.a.rel, fx.dir.rel] }, o: fx.a.abs },

    { n: 'returns None when nothing exists',
      i: { paths: [fx.a.rel, fx.b.rel] }, data: [], o: null },
  ],
  layer: ({ data }) => {
    const fixture = data ?? [
      fx.a.abs,
      fx.b.abs,
      fx.dir.abs,
    ]

    return Layer.mock(FileSystem.FileSystem, {
      exists: (path: string) => {
        const pathLoc = FsLoc.decodeSync(path)
        const exists = Array.containsWith(FsLoc.equivalence)(fixture, pathLoc as FsLoc.FsLoc)
        return Effect.succeed(exists)
      },
      sink: () => undefined as any,
    })
  },
  test: ({ i, o }) =>
    Effect.gen(function*() {
      const result = yield* Fs.findFirstUnderDir(i.dir ?? absDirTest)(i.paths)

      if (o) {
        expect(Option.isSome(result)).toBe(true)
        if (Option.isSome(result)) {
          expect(result.value).toBeEquivalent(o, FsLoc.FsLoc)
        }
      } else {
        expect(Option.isNone(result)).toBe(true)
      }
    }),
})
