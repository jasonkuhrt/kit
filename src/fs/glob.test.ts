import { Env } from '#env'
import { Fs } from '#fs'
import { Test } from '#test'
import { Effect, Schema as S } from 'effect'
import { expect } from 'vitest'

const decodeRelDir = S.decodeSync(Fs.Path.RelDir.Schema)
const decodeAbsDir = S.decodeSync(Fs.Path.AbsDir.Schema)

type Input = { pattern: string; options?: { absolute?: boolean; cwd?: 'srcDir' | 'nonexistent' } }

const resolveOptions = (input: Input, srcDir: Fs.Path.AbsDir): Fs.GlobOptions | undefined => {
  if (input.options?.cwd === 'srcDir') return { ...input.options, cwd: srcDir }
  if (input.options?.cwd === 'nonexistent') return { cwd: decodeAbsDir('/nonexistent/path/') }
  if (input.options?.absolute !== undefined) return { absolute: input.options.absolute }
  return undefined
}

// dprint-ignore
Test.describe('glob')
  .inputType<Input>()
  .casesInput(
    { pattern: 'src/fs/*.ts' },
    { pattern: 'src/fs/*.ts', options: { absolute: true } },
    { pattern: 'fs/*.ts', options: { cwd: 'srcDir' } },
    { pattern: '', options: { cwd: 'nonexistent' } },
  )
  .matrix({ mode: ['async', 'sync'] as const })
  .layer(Env.Live)
  .testEffect(({ input, matrix }) =>
    Effect.gen(function*() {
      const env = yield* Env.Env
      const srcDir = Fs.Path.join(env.cwd, decodeRelDir('./src/')) as Fs.Path.AbsDir
      const options = resolveOptions(input, srcDir)
      const glob = matrix.mode === 'async' ? Fs.glob : Fs.globSync

      if (input.options?.cwd === 'nonexistent') {
        if (matrix.mode === 'async') {
          const result = yield* Fs.glob(input.pattern, options)
          expect(result).toEqual([])
        } else {
          const effect = Fs.globSync(input.pattern, options)
          expect(() => Effect.runSync(effect)).not.toThrow()
        }
      } else {
        const result = yield* glob(input.pattern, options)
        expect(result).toBeInstanceOf(Array)
        expect(result.length).toBeGreaterThan(0)
        expect(result[0]).toHaveProperty('_tag')
      }
    })
  )
