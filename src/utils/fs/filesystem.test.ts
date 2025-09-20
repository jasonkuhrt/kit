import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { FileSystem } from '@effect/platform'
import { Effect } from 'effect'
import { describe, expect, test, vi } from 'vitest'

describe('filesystem wrapped functions', () => {
  describe('single-path operations', () => {
    test('exists wraps fs.exists with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        exists: vi.fn((path: string) => Effect.succeed(path === '/test/file.txt')),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.exists(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(result).toBe(true)
        expect(mockFs.exists).toHaveBeenCalledWith('/test/file.txt')
      })
    })

    test('readFile wraps fs.readFile with FsLoc', () => {
      const mockContent = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFile: vi.fn(() => Effect.succeed(mockContent)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.readFile(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(result).toEqual(mockContent)
        expect(mockFs.readFile).toHaveBeenCalledWith('/test/file.txt')
      })
    })

    test('writeFile wraps fs.writeFile with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFile: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const content = new Uint8Array([72, 101, 108, 108, 111])
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.writeFile(fileLoc, content),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.writeFile).toHaveBeenCalledWith('/test/file.txt', content, {})
      })
    })

    test('makeDirectory wraps fs.makeDirectory with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeDirectory: vi.fn(() => Effect.succeed(undefined)),
      }

      const dirLoc = FsLoc.AbsDir.decodeSync('/test/dir/')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.makeDirectory(dirLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.makeDirectory).toHaveBeenCalledWith('/test/dir/', { recursive: false })
      })
    })

    test('remove wraps fs.remove with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        remove: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.remove(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.remove).toHaveBeenCalledWith('/test/file.txt', { recursive: false })
      })
    })

    test('stat wraps fs.stat with FsLoc', () => {
      const mockStat = {
        type: 'File' as const,
        size: 100n,
        mtime: new Date(),
        atime: new Date(),
      }
      const mockFs: Partial<FileSystem.FileSystem> = {
        stat: vi.fn(() => Effect.succeed(mockStat as any)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.stat(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(result).toEqual(mockStat)
        expect(mockFs.stat).toHaveBeenCalledWith('/test/file.txt')
      })
    })

    test('readDirectory wraps fs.readDirectory with FsLoc', () => {
      const mockEntries = ['file1.txt', 'file2.txt', 'subdir']
      const mockFs: Partial<FileSystem.FileSystem> = {
        readDirectory: vi.fn(() => Effect.succeed(mockEntries)),
      }

      const dirLoc = FsLoc.AbsDir.decodeSync('/test/dir/')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.readDirectory(dirLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(result).toEqual(mockEntries)
        expect(mockFs.readDirectory).toHaveBeenCalledWith('/test/dir/')
      })
    })
  })

  describe('two-path operations', () => {
    test('copy wraps fs.copy with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        copy: vi.fn(() => Effect.succeed(undefined)),
      }

      const sourceLoc = FsLoc.AbsFile.decodeSync('/test/source.txt')
      const destLoc = FsLoc.AbsFile.decodeSync('/test/dest.txt')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.copy(sourceLoc, destLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.copy).toHaveBeenCalledWith('/test/source.txt', '/test/dest.txt', {})
      })
    })

    test('rename wraps fs.rename with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        rename: vi.fn(() => Effect.succeed(undefined)),
      }

      const oldLoc = FsLoc.AbsFile.decodeSync('/test/old.txt')
      const newLoc = FsLoc.AbsFile.decodeSync('/test/new.txt')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.rename(oldLoc, newLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.rename).toHaveBeenCalledWith('/test/old.txt', '/test/new.txt')
      })
    })

    test('link wraps fs.link with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        link: vi.fn(() => Effect.succeed(undefined)),
      }

      const targetLoc = FsLoc.AbsFile.decodeSync('/test/target.txt')
      const linkLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.link(targetLoc, linkLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.link).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
      })
    })

    test('symlink wraps fs.symlink with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        symlink: vi.fn(() => Effect.succeed(undefined)),
      }

      const targetLoc = FsLoc.AbsFile.decodeSync('/test/target.txt')
      const linkLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.symlink(targetLoc, linkLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.symlink).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
      })
    })
  })

  describe('path-returning operations', () => {
    test('makeTempDirectory returns an AbsDir', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/temp123')),
      }

      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.makeTempDirectory(),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(FsLoc.AbsDir.is(result)).toBe(true)
        expect(FsLoc.encodeSync(result)).toBe('/tmp/temp123/')
        expect(mockFs.makeTempDirectory).toHaveBeenCalledWith()
      })
    })

    test('makeTempFile returns an AbsFile', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempFile: vi.fn(() => Effect.succeed('/tmp/tempfile123.tmp')),
      }

      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.makeTempFile(),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(FsLoc.AbsFile.is(result)).toBe(true)
        expect(FsLoc.encodeSync(result)).toBe('/tmp/tempfile123.tmp')
        expect(mockFs.makeTempFile).toHaveBeenCalledWith()
      })
    })

    test('realPath returns FsLocLoose', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        realPath: vi.fn((path: string) =>
          Effect.succeed(path === '/test/link.txt' ? '/real/path/file.txt' : '/real/path/dir/')
        ),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.realPath(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(FsLoc.FsLocLoose.is(result)).toBe(true)
        expect(FsLoc.FsLocLoose.encodeSync(result)).toBe('/real/path/file.txt')
        expect(mockFs.realPath).toHaveBeenCalledWith('/test/link.txt')
      })
    })
  })

  describe('stream operations', () => {
    test('readFileString wraps fs.readFileString with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFileString: vi.fn(() => Effect.succeed('file content')),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const effect = Effect.gen(function*() {
        const result = yield* Effect.provideService(
          Fs.readFileString(fileLoc),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
        return result
      })

      return Effect.runPromise(effect).then(result => {
        expect(result).toBe('file content')
        expect(mockFs.readFileString).toHaveBeenCalledWith('/test/file.txt', 'utf-8')
      })
    })

    test('writeFileString wraps fs.writeFileString with FsLoc', () => {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFileString: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const content = 'file content'
      const effect = Effect.gen(function*() {
        yield* Effect.provideService(
          Fs.writeFileString(fileLoc, content),
          FileSystem.FileSystem,
          mockFs as FileSystem.FileSystem,
        )
      })

      return Effect.runPromise(effect).then(() => {
        expect(mockFs.writeFileString).toHaveBeenCalledWith('/test/file.txt', content, {})
      })
    })

    test.skip('stream wraps fs.stream with FsLoc', () => {
      // Stream and Sink are lazy - they don't call the underlying functions until evaluated
      // This requires more complex testing setup
    })

    test.skip('sink wraps fs.sink with FsLoc', () => {
      // Stream and Sink are lazy - they don't call the underlying functions until evaluated
      // This requires more complex testing setup
    })
  })
})
