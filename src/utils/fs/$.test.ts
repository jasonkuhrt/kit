import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import { Ts } from '#ts'
import '../test/matchers/$.js'
import { FileSystem } from '@effect/platform'
import { Array, Effect, Layer, Option } from 'effect'
import { expect, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

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
  A<Effect.Effect<Option.Option<FsLoc.AbsFile>, Error, FileSystem.FileSystem>>().on(fileResult)

  // Test with only directories - should return Option<AbsDir>
  const onlyDirs = [fx.dir.rel, l('./test/')]
  const dirResult = Fs.findFirstUnderDir(absDirTest)(onlyDirs)
  A<Effect.Effect<Option.Option<FsLoc.AbsDir>, Error, FileSystem.FileSystem>>().on(dirResult)

  // Test with mixed - should return Option<Abs>
  const mixed = [fx.a.rel, fx.dir.rel]
  const mixedResult = Fs.findFirstUnderDir(absDirTest)(mixed)
  A<Effect.Effect<Option.Option<FsLoc.Groups.Abs.Abs>, Error, FileSystem.FileSystem>>().on(mixedResult)
})

// dprint-ignore
Test.describe('.findFirstUnderDir')
  .inputType<{ dir?: FsLoc.AbsDir; paths: FsLoc.Groups.Rel.Rel[] }>()
  .outputType<FsLoc.Groups.Abs.Abs | null>()
  .contextType<{ data?: FsLoc.FsLoc[] }>()
  .cases(
    { comment: 'finds single file',
      input: { paths: [fx.a.rel] }, output: fx.a.abs },

    { comment: 'finds first file when both exist',
      input: { paths: [fx.a.rel, fx.b.rel] }, output: fx.a.abs },

    { comment: 'finds second file when only second exists',
      input: { paths: [fx.a.rel, fx.b.rel] }, data: [fx.b.abs], output: fx.b.abs },

    { comment: 'finds directory',
      input: { paths: [fx.dir.rel] }, output: fx.dir.abs },

    { comment: 'finds first of mixed types',
      input: { paths: [fx.a.rel, fx.dir.rel] }, output: fx.a.abs },

    { comment: 'returns None when nothing exists',
      input: { paths: [fx.a.rel, fx.b.rel] }, data: [], output: null },
  )
  .layerEach((testCase) => {
    const fixture = testCase.data ?? [
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
  })
  .testEffect(({ input, output }) =>
    Effect.gen(function*() {
      const result = yield* Fs.findFirstUnderDir(input.dir ?? absDirTest)(input.paths)

      if (output) {
        expect(Option.isSome(result)).toBe(true)
        if (Option.isSome(result)) {
          expect(result.value).toBeEquivalent(output, FsLoc.FsLoc)
        }
      } else {
        expect(Option.isNone(result)).toBe(true)
      }
    })
  )
