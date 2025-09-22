import { FsLoc } from '#fs-loc'
import '../fs-loc/$.test-matchers.js'
import { FileSystem } from '@effect/platform'
import { describe, expect, it, vi } from '@effect/vitest'
import { Effect, Option } from 'effect'
import * as Fs from './filesystem.js'

describe('single-path operations', () => {
  it.effect('exists wraps fs.exists with FsLoc', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        exists: vi.fn((path: string) => Effect.succeed(path === '/test/file.txt')),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const result = yield* Effect.provideService(
        Fs.exists(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBe(true)
      expect(mockFs.exists).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('read wraps fs.readFile for files', () =>
    Effect.gen(function*() {
      const mockContent = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFile: vi.fn(() => Effect.succeed(mockContent)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const result = yield* Effect.provideService(
        Fs.read(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toEqual(mockContent)
      expect(mockFs.readFile).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('write wraps fs.writeFile for files', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFile: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const content = new Uint8Array([72, 101, 108, 108, 111])
      yield* Effect.provideService(
        Fs.write(fileLoc, content),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.writeFile).toHaveBeenCalledWith('/test/file.txt', content, {})
    }))

  it.effect('write wraps fs.makeDirectory for directories', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        makeDirectory: vi.fn(() => Effect.succeed(undefined)),
      }

      const dirLoc = FsLoc.AbsDir.decodeSync('/test/dir/')
      yield* Effect.provideService(
        Fs.write(dirLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.makeDirectory).toHaveBeenCalledWith('/test/dir/', { recursive: false })
    }))

  it.effect('remove wraps fs.remove with FsLoc', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        remove: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      yield* Effect.provideService(
        Fs.remove(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.remove).toHaveBeenCalledWith('/test/file.txt', { recursive: false })
    }))

  it.effect('stat wraps fs.stat with FsLoc', () =>
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

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const result = yield* Effect.provideService(
        Fs.stat(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toEqual(mockStat)
      expect(mockFs.stat).toHaveBeenCalledWith('/test/file.txt')
    }))

  it.effect('read wraps fs.readDirectory for directories and returns FsLoc array', () =>
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

      const dirLoc = FsLoc.AbsDir.decodeSync('/test/dir/')
      const result = yield* Effect.provideService(
        Fs.read(dirLoc),
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

  it.effect('read returns relative FsLoc for relative directories', () =>
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

      const dirLoc = FsLoc.RelDir.decodeSync('./src/')
      const result = yield* Effect.provideService(
        Fs.read(dirLoc),
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
  it.effect('copy uses fs.copyFile for file-to-file operations', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        copyFile: vi.fn(() => Effect.succeed(undefined)),
        copy: vi.fn(() => Effect.succeed(undefined)),
      }

      const sourceLoc = FsLoc.AbsFile.decodeSync('/test/source.txt')
      const destLoc = FsLoc.AbsFile.decodeSync('/test/dest.txt')
      yield* Effect.provideService(
        Fs.copy(sourceLoc, destLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.copyFile).toHaveBeenCalledWith('/test/source.txt', '/test/dest.txt')
      expect(mockFs.copy).not.toHaveBeenCalled()
    }))

  it.effect('copy uses fs.copy for directory operations', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        copyFile: vi.fn(() => Effect.succeed(undefined)),
        copy: vi.fn(() => Effect.succeed(undefined)),
      }

      const sourceLoc = FsLoc.AbsDir.decodeSync('/test/source/')
      const destLoc = FsLoc.AbsDir.decodeSync('/test/dest/')
      yield* Effect.provideService(
        Fs.copy(sourceLoc, destLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.copy).toHaveBeenCalledWith('/test/source/', '/test/dest/', {})
      expect(mockFs.copyFile).not.toHaveBeenCalled()
    }))

  it.effect('rename wraps fs.rename with FsLoc', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        rename: vi.fn(() => Effect.succeed(undefined)),
      }

      const oldLoc = FsLoc.AbsFile.decodeSync('/test/old.txt')
      const newLoc = FsLoc.AbsFile.decodeSync('/test/new.txt')
      yield* Effect.provideService(
        Fs.rename(oldLoc, newLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.rename).toHaveBeenCalledWith('/test/old.txt', '/test/new.txt')
    }))

  it.effect('link wraps fs.link with FsLoc', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        link: vi.fn(() => Effect.succeed(undefined)),
      }

      const targetLoc = FsLoc.AbsFile.decodeSync('/test/target.txt')
      const linkLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      yield* Effect.provideService(
        Fs.link(targetLoc, linkLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.link).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
    }))

  it.effect('symlink wraps fs.symlink with FsLoc', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        symlink: vi.fn(() => Effect.succeed(undefined)),
      }

      const targetLoc = FsLoc.AbsFile.decodeSync('/test/target.txt')
      const linkLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      yield* Effect.provideService(
        Fs.symlink(targetLoc, linkLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.symlink).toHaveBeenCalledWith('/test/target.txt', '/test/link.txt')
    }))
})

describe('path-returning operations', () => {
  it.effect('makeTemp with type directory returns an AbsDir', () =>
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

  it.effect('makeTempDirectory returns an AbsDir', () =>
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

  it.effect('makeTempDirectory adds trailing slash if missing', () =>
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

  it.scoped('makeTempDirectoryScoped returns an AbsDir', () =>
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

  it.effect('makeTemp with type file returns an AbsFile', () =>
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

  it.effect('realPath returns FsLocLoose', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        realPath: vi.fn((path: string) =>
          Effect.succeed(path === '/test/link.txt' ? '/real/path/file.txt' : '/real/path/dir/')
        ),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/link.txt')
      const result = yield* Effect.provideService(
        Fs.realPath(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(FsLoc.FsLocLoose.is(result)).toBe(true)
      expect(FsLoc.FsLocLoose.encodeSync(result)).toBe('/real/path/file.txt')
      expect(mockFs.realPath).toHaveBeenCalledWith('/test/link.txt')
    }))
})

describe('stream operations', () => {
  it.effect('readString wraps fs.readFileString for files', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        readFileString: vi.fn(() => Effect.succeed('file content')),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const result = yield* Effect.provideService(
        Fs.readString(fileLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(result).toBe('file content')
      expect(mockFs.readFileString).toHaveBeenCalledWith('/test/file.txt', 'utf-8')
    }))

  it.effect('writeString wraps fs.writeFileString for files', () =>
    Effect.gen(function*() {
      const mockFs: Partial<FileSystem.FileSystem> = {
        writeFileString: vi.fn(() => Effect.succeed(undefined)),
      }

      const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
      const content = 'file content'
      yield* Effect.provideService(
        Fs.writeString(fileLoc, content),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )

      expect(mockFs.writeFileString).toHaveBeenCalledWith('/test/file.txt', content, {})
    }))

  it.skip('stream wraps fs.stream with FsLoc', () => {
    // Stream and Sink are lazy - they don't call the underlying functions until evaluated
    // This requires more complex testing setup
  })

  it.skip('sink wraps fs.sink with FsLoc', () => {
    // Stream and Sink are lazy - they don't call the underlying functions until evaluated
    // This requires more complex testing setup
  })
})
