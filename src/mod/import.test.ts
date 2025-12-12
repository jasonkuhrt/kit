import { Assert } from '#assert'
import { Fs } from '#fs'
import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { describe, expect, it, vi } from '@effect/vitest'
import { Effect, Option } from 'effect'
import { fileURLToPath } from 'node:url'
import * as Import from './import.js'

// Resolve fixture path from this file's location
const fixtureUrl = new URL('./__fixtures/sample-module.ts', import.meta.url)
const fixturePath = Fs.Path.AbsFile.fromString(fileURLToPath(fixtureUrl))

// Type for the fixture module
interface SampleModule extends Import.EsModule {
  default: { readonly name: 'sample' }
  helper: () => string
}

describe('dynamicImportFile', () => {
  it.effect('imports module without options', () =>
    Effect.gen(function*() {
      const effect = Import.dynamicImportFile(fixturePath)
      Assert.on(effect).exact.ofAs<Effect.Effect<Import.EsModule, Import.ImportError, never>>()
      const mod = yield* effect
      Assert.on(mod).exact.ofAs<Import.EsModule>()
      expect(mod.default).toEqual({ name: 'sample' })
    }))

  it.effect('imports module with typed default', () =>
    Effect.gen(function*() {
      const effect = Import.dynamicImportFile<SampleModule>(fixturePath)
      Assert.on(effect).exact.ofAs<Effect.Effect<SampleModule, Import.ImportError, never>>()
      const mod = yield* effect
      Assert.on(mod).exact.ofAs<SampleModule>()
      expect(mod.default.name).toBe('sample')
      expect(mod.helper()).toBe('helper')
    }))

  it.effect('imports with bustCache: false', () =>
    Effect.gen(function*() {
      const effect = Import.dynamicImportFile(fixturePath, { bustCache: false })
      Assert.on(effect).exact.ofAs<Effect.Effect<Import.EsModule, Import.ImportError, never>>()
      const mod = yield* effect
      expect(mod.default).toEqual({ name: 'sample' })
    }))

  it.effect('imports with bustCache: true', () =>
    Effect.gen(function*() {
      const effect = Import.dynamicImportFile(fixturePath, { bustCache: true })
      Assert.on(effect).exact.ofAs<
        Effect.Effect<Import.EsModule, Import.ImportError | PlatformError, FileSystem.FileSystem>
      >()
      const mod = yield* effect
      expect(mod.default).toEqual({ name: 'sample' })
    }).pipe(
      Effect.provideService(FileSystem.FileSystem, {
        stat: vi.fn(() =>
          Effect.succeed({
            type: 'File' as const,
            mtime: Option.some(new Date(1234567890)),
          } as FileSystem.File.Info)
        ),
      } as unknown as FileSystem.FileSystem),
    ))

  it.effect('returns ImportErrorNotFound for non-existent file', () =>
    Effect.gen(function*() {
      const nonExistentPath = Fs.Path.AbsFile.fromString('/non/existent/module.js')
      const result = yield* Import.dynamicImportFile(nonExistentPath).pipe(Effect.either)
      expect(result._tag).toBe('Left')
      if (result._tag === 'Left') {
        expect(result.left._tag).toBe('KitModImportErrorNotFound')
        expect(result.left.context.path).toBe(nonExistentPath)
        expect(result.left.cause).toBeInstanceOf(Error)
      }
    }))
})

describe('importDefault', () => {
  it.effect('extracts default export', () =>
    Effect.gen(function*() {
      const effect = Import.importDefault<SampleModule['default']>(fixturePath)
      Assert.on(effect).exact.ofAs<Effect.Effect<SampleModule['default'], Import.ImportError, never>>()
      const defaultExport = yield* effect
      Assert.on(defaultExport).exact.ofAs<SampleModule['default']>()
      expect(defaultExport).toEqual({ name: 'sample' })
    }))

  it.effect('with bustCache: true', () =>
    Effect.gen(function*() {
      const effect = Import.importDefault<SampleModule['default'], { bustCache: true }>(fixturePath, {
        bustCache: true,
      })
      Assert.on(effect).exact.ofAs<
        Effect.Effect<SampleModule['default'], Import.ImportError | PlatformError, FileSystem.FileSystem>
      >()
      const defaultExport = yield* effect
      expect(defaultExport).toEqual({ name: 'sample' })
    }).pipe(
      Effect.provideService(FileSystem.FileSystem, {
        stat: vi.fn(() =>
          Effect.succeed({
            type: 'File' as const,
            mtime: Option.some(new Date(1234567890)),
          } as FileSystem.File.Info)
        ),
      } as unknown as FileSystem.FileSystem),
    ))
})
