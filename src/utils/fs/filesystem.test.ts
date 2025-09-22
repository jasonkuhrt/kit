import { FsLoc } from '#fs-loc'
import '../fs-loc/$.test-matchers.js'
import { FileSystem } from '@effect/platform'
import { Effect, Option } from 'effect'
import { describe, expect, test, vi } from 'vitest'
import * as Fs from './filesystem.js'

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

  test('read wraps fs.readFile for files', () => {
    const mockContent = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
    const mockFs: Partial<FileSystem.FileSystem> = {
      readFile: vi.fn(() => Effect.succeed(mockContent)),
    }

    const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.read(fileLoc),
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

  test('write wraps fs.writeFile for files', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      writeFile: vi.fn(() => Effect.succeed(undefined)),
    }

    const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
    const content = new Uint8Array([72, 101, 108, 108, 111])
    const effect = Effect.gen(function*() {
      yield* Effect.provideService(
        Fs.write(fileLoc, content),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
    })

    return Effect.runPromise(effect).then(() => {
      expect(mockFs.writeFile).toHaveBeenCalledWith('/test/file.txt', content, {})
    })
  })

  test('write wraps fs.makeDirectory for directories', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeDirectory: vi.fn(() => Effect.succeed(undefined)),
    }

    const dirLoc = FsLoc.AbsDir.decodeSync('/test/dir/')
    const effect = Effect.gen(function*() {
      yield* Effect.provideService(
        Fs.write(dirLoc),
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

  test('read wraps fs.readDirectory for directories and returns FsLoc array', () => {
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
    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.read(dirLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    })

    return Effect.runPromise(effect).then(result => {
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
    })
  })

  test('read returns relative FsLoc for relative directories', () => {
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
    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.read(dirLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    })

    return Effect.runPromise(effect).then(result => {
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
    })
  })
})

describe('two-path operations', () => {
  test('copy uses fs.copyFile for file-to-file operations', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      copyFile: vi.fn(() => Effect.succeed(undefined)),
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
      expect(mockFs.copyFile).toHaveBeenCalledWith('/test/source.txt', '/test/dest.txt')
      expect(mockFs.copy).not.toHaveBeenCalled()
    })
  })

  test('copy uses fs.copy for directory operations', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      copyFile: vi.fn(() => Effect.succeed(undefined)),
      copy: vi.fn(() => Effect.succeed(undefined)),
    }

    const sourceLoc = FsLoc.AbsDir.decodeSync('/test/source/')
    const destLoc = FsLoc.AbsDir.decodeSync('/test/dest/')
    const effect = Effect.gen(function*() {
      yield* Effect.provideService(
        Fs.copy(sourceLoc, destLoc),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
    })

    return Effect.runPromise(effect).then(() => {
      expect(mockFs.copy).toHaveBeenCalledWith('/test/source/', '/test/dest/', {})
      expect(mockFs.copyFile).not.toHaveBeenCalled()
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
  test('makeTemp with type directory returns an AbsDir', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/temp123')),
    }

    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.makeTemp({ type: 'directory' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    })

    return Effect.runPromise(effect).then(result => {
      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/temp123/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({})
    })
  })

  test('makeTempDirectory returns an AbsDir', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/test-dir-abc')),
    }

    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.makeTempDirectory({ prefix: 'test-' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    })

    return Effect.runPromise(effect).then(result => {
      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/test-dir-abc/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({ prefix: 'test-' })
    })
  })

  test('makeTempDirectory adds trailing slash if missing', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeTempDirectory: vi.fn(() => Effect.succeed('/tmp/no-trailing-slash')),
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
      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/no-trailing-slash/')
      expect(mockFs.makeTempDirectory).toHaveBeenCalledWith({})
    })
  })

  test('makeTempDirectoryScoped returns an AbsDir', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeTempDirectoryScoped: vi.fn(() => Effect.succeed('/tmp/scoped-dir')),
    }

    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.makeTempDirectoryScoped({ directory: '/custom/tmp', prefix: 'build-' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    }).pipe(Effect.scoped)

    return Effect.runPromise(effect).then(result => {
      expect(result).toBeDir()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/scoped-dir/')
      expect(mockFs.makeTempDirectoryScoped).toHaveBeenCalledWith({ directory: '/custom/tmp', prefix: 'build-' })
    })
  })

  test('makeTemp with type file returns an AbsFile', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      makeTempFile: vi.fn(() => Effect.succeed('/tmp/tempfile123.tmp')),
    }

    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.makeTemp({ type: 'file' }),
        FileSystem.FileSystem,
        mockFs as FileSystem.FileSystem,
      )
      return result
    })

    return Effect.runPromise(effect).then(result => {
      expect(result).toBeFile()
      expect(result).toBeAbs()
      expect(result).toEncodeTo('/tmp/tempfile123.tmp')
      expect(mockFs.makeTempFile).toHaveBeenCalledWith({})
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
  test('readString wraps fs.readFileString for files', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      readFileString: vi.fn(() => Effect.succeed('file content')),
    }

    const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
    const effect = Effect.gen(function*() {
      const result = yield* Effect.provideService(
        Fs.readString(fileLoc),
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

  test('writeString wraps fs.writeFileString for files', () => {
    const mockFs: Partial<FileSystem.FileSystem> = {
      writeFileString: vi.fn(() => Effect.succeed(undefined)),
    }

    const fileLoc = FsLoc.AbsFile.decodeSync('/test/file.txt')
    const content = 'file content'
    const effect = Effect.gen(function*() {
      yield* Effect.provideService(
        Fs.writeString(fileLoc, content),
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
