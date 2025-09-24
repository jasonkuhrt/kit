import { FsLoc } from '#fs-loc'
import { FsMemory } from '#fs-memory'
import { FileSystem } from '@effect/platform'
import { Effect, Schema as S } from 'effect'
import { describe, expect, it } from 'vitest'
import { Dir } from './$.js'

// Local helper function for decoding
const decodeAbsDir = S.decodeSync(FsLoc.AbsDir.String)

describe('Dir', () => {
  describe('chaining API', () => {
    it('creates files and directories', async () => {
      // Setup memory filesystem
      const memoryFs = FsMemory.layer({})

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        // Create a directory with chaining
        const dir = Dir.withChaining(Dir.create('/test'))

        yield* dir
          .file('README.md', '# Test Project')
          .file('package.json', { name: 'test', version: '1.0.0' })
          .dir('src/', _ =>
            _
              .file('index.ts', 'export const hello = "world"')
              .file('utils.ts', 'export const id = <T>(x: T) => x'))
          .dir('tests/')
          .commit()

        // Verify files were created
        const readme = yield* fs.readFileString('/test/README.md')
        expect(readme).toBe('# Test Project')

        const pkg = yield* fs.readFileString('/test/package.json')
        expect(JSON.parse(pkg)).toEqual({ name: 'test', version: '1.0.0' })

        const index = yield* fs.readFileString('/test/src/index.ts')
        expect(index).toBe('export const hello = "world"')

        const utils = yield* fs.readFileString('/test/src/utils.ts')
        expect(utils).toBe('export const id = <T>(x: T) => x')

        // Verify directories exist
        const srcExists = yield* fs.exists('/test/src')
        expect(srcExists).toBe(true)

        const testsExists = yield* fs.exists('/test/tests')
        expect(testsExists).toBe(true)
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })

    it('supports conditional operations', async () => {
      const memoryFs = FsMemory.layer({})

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        const isDev = true
        const isProd = false

        const dir = Dir.withChaining(Dir.create('/app'))

        yield* dir
          .file('app.js', 'console.log("app")')
          .when(isDev, _ =>
            _
              .file('env.txt', 'DEBUG=true')
              .dir('debug/'))
          .unless(isProd, _ =>
            _
              .file('dev.config.js', 'module.exports = {}'))
          .commit()

        // Verify conditional files
        const envExists = yield* fs.exists('/app/env.txt')
        expect(envExists).toBe(true)

        const debugExists = yield* fs.exists('/app/debug/')
        expect(debugExists).toBe(true)

        const devConfigExists = yield* fs.exists('/app/dev.config.js')
        expect(devConfigExists).toBe(true)
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })

    it('handles remove and clear operations', async () => {
      const memoryFs = FsMemory.layer({
        '/workspace/old.txt': 'old content',
        '/workspace/cache/file1.txt': 'cache1',
        '/workspace/cache/file2.txt': 'cache2',
        '/workspace/keep.txt': 'keep this',
      })

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        const dir = Dir.withChaining(Dir.create('/workspace'))

        yield* dir
          .remove('old.txt')
          .clear('cache/')
          .file('new.txt', 'new content')
          .commit()

        // Verify removals
        const oldExists = yield* fs.exists('/workspace/old.txt')
        expect(oldExists).toBe(false)

        // Verify cache was cleared but directory still exists
        const cacheExists = yield* fs.exists('/workspace/cache')
        expect(cacheExists).toBe(true)

        const cache1Exists = yield* fs.exists('/workspace/cache/file1.txt')
        expect(cache1Exists).toBe(false)

        const cache2Exists = yield* fs.exists('/workspace/cache/file2.txt')
        expect(cache2Exists).toBe(false)

        // Verify kept file
        const keepContent = yield* fs.readFileString('/workspace/keep.txt')
        expect(keepContent).toBe('keep this')

        // Verify new file
        const newContent = yield* fs.readFileString('/workspace/new.txt')
        expect(newContent).toBe('new content')
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })

    it('handles move operations', async () => {
      const memoryFs = FsMemory.layer({
        '/project/draft.md': 'Draft content',
        '/project/old-name.txt': 'File content',
      })

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        const dir = Dir.withChaining(Dir.create('/project'))

        yield* dir
          .move('draft.md', 'README.md')
          .move('old-name.txt', 'new-name.txt')
          .commit()

        // Verify moves
        const draftExists = yield* fs.exists('/project/draft.md')
        expect(draftExists).toBe(false)

        const readmeContent = yield* fs.readFileString('/project/README.md')
        expect(readmeContent).toBe('Draft content')

        const oldNameExists = yield* fs.exists('/project/old-name.txt')
        expect(oldNameExists).toBe(false)

        const newNameContent = yield* fs.readFileString('/project/new-name.txt')
        expect(newNameContent).toBe('File content')
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })

    it('handles binary content', async () => {
      const memoryFs = FsMemory.layer({})

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        const dir = Dir.withChaining(Dir.create('/data'))

        const uint8Array = new Uint8Array([0, 1, 2, 3, 4])
        const buffer = Buffer.from([5, 6, 7, 8, 9])

        yield* dir
          .file('data1.bin', uint8Array)
          .file('data2.bin', buffer)
          .commit()

        // Verify binary files
        const data1 = yield* fs.readFile('/data/data1.bin')
        expect(data1).toBeInstanceOf(Uint8Array)
        expect(Array.from(data1)).toEqual([0, 1, 2, 3, 4])

        const data2 = yield* fs.readFile('/data/data2.bin')
        expect(data2).toBeInstanceOf(Uint8Array)
        expect(Array.from(data2)).toEqual([5, 6, 7, 8, 9])
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })

    it('creates nested directory structures', async () => {
      const memoryFs = FsMemory.layer({})

      const program = Effect.gen(function*() {
        const fs = yield* FileSystem.FileSystem

        const dir = Dir.withChaining(Dir.create('/app'))

        yield* dir
          .dir('src/', _ =>
            _
              .file('index.ts', 'export {}')
              .dir('components/', _ =>
                _
                  .file('Button.tsx', 'export const Button = () => {}')
                  .dir('icons/', _ =>
                    _
                      .file('Arrow.tsx', 'export const Arrow = () => {}')))
              .dir('utils/', _ =>
                _
                  .file('helpers.ts', 'export const help = () => {}')))
          .commit()

        // Verify deeply nested structure
        const arrow = yield* fs.readFileString('/app/src/components/icons/Arrow.tsx')
        expect(arrow).toBe('export const Arrow = () => {}')

        const helpers = yield* fs.readFileString('/app/src/utils/helpers.ts')
        expect(helpers).toBe('export const help = () => {}')
      })

      await Effect.runPromise(
        Effect.provide(program, memoryFs),
      )
    })
  })

  describe('create functions', () => {
    it('creates a Dir with absolute path', () => {
      const dir = Dir.create('/absolute/path')
      expect(dir.base.path.segments).toEqual(['absolute', 'path'])
    })

    it('creates a Dir with FsLoc.AbsDir', () => {
      const absDir = decodeAbsDir('/test/')
      const dir = Dir.create(absDir)
      expect(dir.base).toBe(absDir)
    })
  })
})
