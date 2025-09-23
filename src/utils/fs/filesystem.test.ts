import { FsLoc } from '#fs-loc'
import '../fs-loc/$.test-matchers.js'
import { FileSystem } from '@effect/platform'
import { describe, expect, it, vi } from '@effect/vitest'
import { Effect, Option } from 'effect'
import * as Fs from './filesystem.js'

describe('single-path operations', () => {
  it.effect('.exists', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        exists: vi.fn((path: string) => Effect.succeed(path === '/test/file.txt')),
      }

      const result = yield* Effect.provideService(
        Fs.exists('/test/file.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBe(true)
      expect(mockFs.exists).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('.read file', () =>
    Effect.gen(function*() {
      const mockContent = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFile: vi.fn(() => Effect.succeed(mockContent)),
      }

      const result = yield* Effect.provideService(
        Fs.read('/test/file.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toEqual(mockContent)
      expect(mockFs.readFile).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('.write file', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFile: vi.fn(() => Effect.succeed(undefined)),
        makeDirectory: vi.fn(() => Effect.succeed(undefined)),
      }

      const content = new Uint8Array([72, 101, 108, 108, 111])
      yield* Effect.provideService(
        Fs.write('/test/file.txt', content),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.makeDirectory).toHaveBeenCalledWith('/test/', { recursive: true })
      expect(mockFs.writeFile).toHaveBeenCalledWith('/test/file.txt', content, {})
    }))

  it.effect('.write dir', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeDirectory: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.write('/test/dir/'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.makeDirectory).toHaveBeenCalledWith('/test/dir/', { recursive: false })
    }))

  it.effect('.write dir with options', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeDirectory: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.write('/test/dir/', { recursive: true }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.makeDirectory).toHaveBeenCalledWith('/test/dir/', { recursive: true })
    }))

  it.effect('.remove', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        remove: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.remove('/test/file.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.remove).toHaveBeenCalledWith('/test/file.txt', { recursive: false })
    }))

  it.effect('.stat', () =>
    Effect.gen(function*() {
      const mockStat = {
        type: 'File' as const,
        size: 100n,
        mtime: new Date(),
        atime: new Date(),
      }
      const mockFs: Partial<FileSystem.FileSystem> = {
        stat: vi.fn(() => Effect.succeed(mockStat as any)),
      }

      const result = yield* Effect.provideService(
        Fs.stat('/test/file.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toEqual(mockStat)
      expect(mockFs.stat).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('.read dir returns FsLoc array', () =>
    Effect.gen(function*() {
      const mockEntries = ['file1.txt', 'file2.txt', 'subdir']
      const mockFs: Partial<FileSystem.FileSystem> = {
        readDirectory: vi.fn(() => Effect.succeed(mockEntries)),
        stat: vi.fn((path: string) => {
          // Mock stat to return file info for .txt files, directory for others
          const isFile = path.endsWith('.txt')
          return Effect.succeed({
            type: isFile ? 'File' as const : 'Directory' as const,
            mtime: Option.some(new Date()),
            atime: Option.some(new Date()),
            birthtime: Option.none(),
            size: 100n as FileSystem.Size,
            mode: 0o644,
            dev: 0,
            ino: Option.none(),
            nlink: Option.none(),
            uid: Option.none(),
            gid: Option.none(),
            rdev: Option.none(),
            blksize: Option.none(),
            blocks: Option.none(),
          } as FileSystem.File.Info)
        }),
      }

      const result = yield* Effect.provideService(
        Fs.read('/test/dir/'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toHaveLength(3)

      // Check first two are files
      expect(result[0]!).toBeFile()
      expect(result[0]!).toBeAbs()
      expect(result[0]!).toEncodeTo('/test/dir/file1.txt')

      expect(result[1]!).toBeFile()
      expect(result[1]!).toBeAbs()
      expect(result[1]!).toEncodeTo('/test/dir/file2.txt')

      // Check third is a directory
      expect(result[2]!).toBeDir()
      expect(result[2]!).toBeAbs()
      expect(result[2]!).toEncodeTo('/test/dir/subdir/')

      expect(mockFs.readDirectory).toHaveBeenCalledWith('/test/dir/')
      expect(mockFs.stat).toHaveBeenCalledTimes(3)
    }))

  it.effect('.read rel dir returns rel FsLoc', () =>
    Effect.gen(function*() {
      const mockEntries = ['file.js', 'folder']
      const mockFs: Partial<FileSystem.FileSystem> = {
        readDirectory: vi.fn(() => Effect.succeed(mockEntries)),
        stat: vi.fn((path: string) => {
          // Check the filename part specifically, not the whole path
          const filename = path.split('/').pop() || ''
          const isFile = filename.includes('.') && !filename.startsWith('.')
          return Effect.succeed({
            type: isFile ? 'File' as const : 'Directory' as const,
            mtime: Option.some(new Date()),
            atime: Option.some(new Date()),
            birthtime: Option.none(),
            size: 100n as FileSystem.Size,
            mode: 0o644,
            dev: 0,
            ino: Option.none(),
            nlink: Option.none(),
            uid: Option.none(),
            gid: Option.none(),
            rdev: Option.none(),
            blksize: Option.none(),
            blocks: Option.none(),
          } as FileSystem.File.Info)
        }),
      }

      const result = yield* Effect.provideService(
        Fs.read('./src/'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toHaveLength(2)

      // Check first is a relative file
      expect(result[0]!).toBeFile()
      expect(result[0]!).toBeRel()
      expect(result[0]!).toEncodeTo('./file.js')

      // Check second is a relative directory
      expect(result[1]!).toBeDir()
      expect(result[1]!).toBeRel()
      expect(result[1]!).toEncodeTo('./folder/')

      expect(mockFs.readDirectory).toHaveBeenCalledWith('./src/')
    }))
})

describe('two-path operations', () => {
  it.effect('.copy file to file', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        copyFile: vi.fn(() => Effect.succeed(undefined)),
        copy: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.copy('/test/source.txt', '/test/dest.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.copyFile).toHaveBeenCalledWith('/test/source.txt', '/test/dest.txt')
      expect(mockFs.copy).not.toHaveBeenCalled()
    }))

  it.effect('.copy dir to dir', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        copyFile: vi.fn(() => Effect.succeed(undefined)),
        copy: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.copy('/test/source/', '/test/dest/'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.copy).toHaveBeenCalledWith('/test/source/', '/test/dest/', {})
      expect(mockFs.copyFile).not.toHaveBeenCalled()
    }))

  it.effect('.rename', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        rename: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.rename('/test/old.txt', '/test/new.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.rename).toHaveBeenCalledWith('/test/old.txt', '/test/new.txt')
    }))

  it.effect('.link', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        link: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.link('/test/target.txt', '/test/link.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.link).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
    }))

  it.effect('.symlink', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        symlink: vi.fn(() => Effect.succeed(undefined)),
      }

      yield* Effect.provideService(
        Fs.symlink('/test/target.txt', '/test/link.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.symlink).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
    }))
})

describe('path-returning operations', () => {
  it.effect('.makeTemp type dir', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/temp123')),
      }

      const result = yield* Effect.provideService(
        Fs.makeTemp({ type: 'directory' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/temp123/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({})
    }))

  it.effect('.makeTempDirectory', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/test-dir-abc')),
      }

      const result = yield* Effect.provideService(
        Fs.makeTempDirectory({ prefix: 'test-' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/test-dir-abc/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({ prefix: 'test-' })
    }))

  it.effect('.makeTempDirectory adds trailing slash', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/no-trailing-slash')),
      }

      const result = yield* Effect.provideService(
        Fs.makeTempDirectory(),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/no-trailing-slash/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({})
    }))

  it.scoped('.makeTempDirectoryScoped', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempDirectoryScoped: vi.fn(() => Effect.succeed('/tmp/scoped-dir')),
      }

      const result = yield* Effect.provideService(
        Fs.makeTempDirectoryScoped({ directory: '/custom/tmp', prefix: 'build-' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/scoped-dir/')
      expect(mockFs.makeTempDirectoryScoped).toHaveBeenCalledWith({ directory: '/custom/tmp', prefix: 'build-' })
    }))

  it.effect('.makeTemp type file', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeTempFile: vi.fn(() => Effect.succeed('/tmp/tempfile123.tmp')),
      }

      const result = yield* Effect.provideService(
        Fs.makeTemp({ type: 'file' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBeFile()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/tempfile123.tmp')
      expect(mockFs.makeTempFile).toHaveBeenCalledWith({})
    }))

  it.effect('.realPath', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        realPath: vi.fn((path: string) =>
          Effect.succeed(path === '/test/link.txt' ? '/real/path/file.txt' : '/real/path/dir/')
        ),
      }

      const result = yield* Effect.provideService(
        Fs.realPath('/test/link.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(FsLoc.FsLocLoose.is(result)).toBe(true)
      expect(FsLoc.FsLocLoose.encodeSync(result)).toBe('/real/path/file.txt')
      expect(mockFs.realPath).toHaveBeenCalledWith('/test/link.txt')
    }))
})

describe('stream operations', () => {
  it.effect('.readString', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFileString: vi.fn(() => Effect.succeed('file content')),
      }

      const result = yield* Effect.provideService(
        Fs.readString('/test/file.txt'),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBe('file content')
      expect(mockFs.readFileString).toHaveBeenCalledWith('/test/file.txt', 'utf-8')
    }))

  it.effect('.writeString (deprecated - use write instead)', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFileString: vi.fn(() => Effect.succeed(undefined)),
      }

      const content = 'file content'
      yield* Effect.provideService(
        Fs.writeString('/test/file.txt', content),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.writeFileString).toHaveBeenCalledWith('/test/file.txt', content, {})
    }))

  it.skip('.stream', () => {
    // Stream and Sink are lazy - they don't call the underlying functions until evaluated
    // This requires more complex testing setup
  })

  it.skip('.sink', () => {
    // Stream and Sink are lazy - they don't call the underlying functions until evaluated
    // This requires more complex testing setup
  })
})
