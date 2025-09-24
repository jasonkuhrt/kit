import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import type { Json } from '#json'
import { Schema as S } from 'effect'

/**
 * Represents a single file system operation to be executed.
 */
export type Operation =
  | { type: 'file'; path: FsLoc.RelFile; content: any } // Keep as any to preserve original types
  | { type: 'dir'; path: FsLoc.RelDir; operations: Operation[] }
  | { type: 'remove'; path: FsLoc.RelFile | FsLoc.RelDir }
  | { type: 'clear'; path: FsLoc.RelDir }
  | { type: 'move-file'; from: FsLoc.RelFile; to: FsLoc.RelFile }
  | { type: 'move-dir'; from: FsLoc.RelDir; to: FsLoc.RelDir }

/**
 * A specification for directory operations.
 * This is a pure data structure that accumulates operations without executing them.
 */
export interface SpecBuilder {
  readonly base: FsLoc.AbsDir
  readonly operations: ReadonlyArray<Operation>

  /**
   * Add a file to the directory specification.
   *
   * @param path - The file path (relative to base)
   * @param content - The file content (type depends on extension)
   * @returns A new spec with the file added
   *
   * @example
   * ```ts
   * spec
   *   .file('README.md', '# My Project')
   *   .file('data.json', { version: '1.0' })
   *   .file('image.png', uint8Array)
   * ```
   */
  file<path extends FsLoc.RelFile | string>(
    path: FsLoc.Inputs.Guard.RelFile<path>,
    content: path extends FsLoc.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object // Dynamic path, allow all content types
      : never,
  ): SpecBuilder

  /**
   * Add a directory to the specification.
   *
   * @param path - The directory path (relative to base)
   * @param builder - Optional function to add contents to the directory
   * @returns A new spec with the directory added
   *
   * @example
   * ```ts
   * spec
   *   .dir('src', _ =>
   *     _.file('index.ts', 'export const x = 1'))
   *   .dir('tests') // empty directory
   * ```
   */
  dir<path extends FsLoc.RelDir | string>(
    path: FsLoc.Inputs.Guard.RelDir<path>,
    builder?: (_: SpecBuilder) => SpecBuilder,
  ): SpecBuilder

  /**
   * Conditionally apply operations.
   *
   * @param condition - Whether to apply the operations
   * @param builder - Function that builds operations to apply
   * @returns A new spec with conditional operations
   *
   * @example
   * ```ts
   * spec
   *   .when(isDev, _ =>
   *     _.file('.env', 'DEBUG=true'))
   * ```
   */
  when(
    condition: boolean,
    builder: (_: SpecBuilder) => SpecBuilder,
  ): SpecBuilder

  /**
   * Conditionally apply operations (inverse of when).
   *
   * @param condition - Whether to skip the operations
   * @param builder - Function that builds operations to apply
   * @returns A new spec with conditional operations
   *
   * @example
   * ```ts
   * spec
   *   .unless(isProd, _ =>
   *     _.file('dev.config.js', devConfig))
   * ```
   */
  unless(
    condition: boolean,
    builder: (_: SpecBuilder) => SpecBuilder,
  ): SpecBuilder

  /**
   * Remove a file or directory.
   *
   * @param path - The path to remove (relative to base)
   * @returns A new spec with the removal operation
   *
   * @example
   * ```ts
   * spec.remove('old-file.txt')
   * ```
   */
  remove<path extends FsLoc.Groups.Rel.Rel | string>(
    path: FsLoc.Inputs.Guard.Rel<path>,
  ): SpecBuilder

  /**
   * Clear the contents of a directory (keep the directory itself).
   *
   * @param path - The directory path to clear (relative to base)
   * @returns A new spec with the clear operation
   *
   * @example
   * ```ts
   * spec.clear('build/')
   * ```
   */
  clear<path extends FsLoc.RelDir | string>(
    path: FsLoc.Inputs.Guard.RelDir<path>,
  ): SpecBuilder

  /**
   * Move/rename a file.
   *
   * @param from - The source file path (relative to base)
   * @param to - The destination file path (relative to base)
   * @returns A new spec with the move operation
   *
   * @example
   * ```ts
   * spec.move('draft.md', 'README.md')
   * ```
   */
  move<
    from extends FsLoc.RelFile | string,
    to extends FsLoc.RelFile | string,
  >(
    from: FsLoc.Inputs.Guard.RelFile<from>,
    to: FsLoc.Inputs.Guard.RelFile<to>,
  ): SpecBuilder

  /**
   * Move/rename a directory.
   *
   * @param from - The source directory path (relative to base)
   * @param to - The destination directory path (relative to base)
   * @returns A new spec with the move operation
   *
   * @example
   * ```ts
   * spec.move('old-dir/', 'new-dir/')
   * ```
   */
  move<
    from extends FsLoc.RelDir | string,
    to extends FsLoc.RelDir | string,
  >(
    from: FsLoc.Inputs.Guard.RelDir<from>,
    to: FsLoc.Inputs.Guard.RelDir<to>,
  ): SpecBuilder

  /**
   * Add a file or directory based on the path type.
   *
   * For files (paths with extensions), content is required.
   * For directories (paths ending with / or without extensions), an optional builder can be provided.
   *
   * @param path - The file or directory path (relative to base)
   * @param contentOrBuilder - File content for files, or builder function for directories
   * @returns A new spec with the operation added
   *
   * @example
   * ```ts
   * spec
   *   .add('config.json', { version: '1.0' })  // File - requires content
   *   .add('src/')                             // Empty directory
   *   .add('tests/', d =>                      // Directory with contents
   *     d.add('unit.test.ts', testCode))
   * ```
   */
  // Overload for file paths - requires content
  add<path extends FsLoc.RelFile | string>(
    path: FsLoc.Inputs.Guard.RelFile<path>,
    content: path extends FsLoc.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object
      : never,
  ): SpecBuilder

  // Overload for directory paths - optional builder
  add<path extends FsLoc.RelDir | string>(
    path: FsLoc.Inputs.Guard.RelDir<path>,
    builder?: (_: SpecBuilder) => SpecBuilder,
  ): SpecBuilder

  /**
   * Create a new spec with a different base directory.
   *
   * @param base - The new base directory
   * @returns A new spec with the same operations but different base
   *
   * @example
   * ```ts
   * const spec1 = spec('/project').file('test.txt', 'content')
   * const spec2 = spec1.withBase('/other')
   * ```
   */
  withBase(base: FsLoc.Inputs.Input.AbsDir): SpecBuilder

  /**
   * Merge multiple specs into this one.
   *
   * @param specs - The specs to merge
   * @returns A new spec with all operations combined
   *
   * @example
   * ```ts
   * const combined = spec1.merge(spec2, spec3)
   * ```
   */
  merge(...specs: SpecBuilder[]): SpecBuilder

  // TODO: Add import feature
  // Import would read from absolute paths outside the sandbox to seed the spec
  // Signature: import(source: FsLoc.AbsFile | FsLoc.AbsDir, dest?: string): SpecBuilder
  // This would be a chain-only operation (not in spec) that executes immediately
  // Alternative: Dir.specFromDisk('/absolute/path') to create a spec from existing filesystem
}

/**
 * Create a new directory specification.
 *
 * @param base - The base directory path
 * @returns A new DirSpec builder
 *
 * @example
 * ```ts
 * const spec = Dir.spec('/project')
 *   .file('README.md', '# Title')
 *   .dir('src/', _ => _.file('index.ts', 'export {}'))
 * ```
 */
export const spec = (
  base: FsLoc.Inputs.Input.AbsDir,
): SpecBuilder => {
  const absBase = FsLoc.normalizeInput(base) as FsLoc.AbsDir
  const operations: Operation[] = []

  const createSpec = (baseDir: FsLoc.AbsDir, ops: Operation[]): SpecBuilder => {
    const self: SpecBuilder = {
      base: baseDir,
      operations: ops,

      file(path, content) {
        const relFile = typeof path === 'string'
          ? S.decodeSync(FsLoc.RelFile.String)(path as string)
          : path as FsLoc.RelFile
        const newOps = [...ops, { type: 'file' as const, path: relFile, content }]
        return createSpec(baseDir, newOps)
      },

      dir(path, builder?) {
        const relDir = typeof path === 'string'
          ? S.decodeSync(FsLoc.RelDir.String)(path as string)
          : path as FsLoc.RelDir

        if (builder) {
          // Create a sub-spec to collect nested operations
          const subSpec = createSpec(baseDir, [])
          const result = builder(subSpec)
          const subOps = result.operations as Operation[]
          const newOps = [...ops, { type: 'dir' as const, path: relDir, operations: subOps }]
          return createSpec(baseDir, newOps)
        } else {
          const newOps = [...ops, { type: 'dir' as const, path: relDir, operations: [] }]
          return createSpec(baseDir, newOps)
        }
      },

      when(condition: boolean, builder: (_: SpecBuilder) => SpecBuilder): SpecBuilder {
        if (condition) {
          const result = builder(self)
          return createSpec(baseDir, result.operations as Operation[])
        }
        return self
      },

      unless(condition: boolean, builder: (_: SpecBuilder) => SpecBuilder): SpecBuilder {
        if (!condition) {
          const result = builder(self)
          return createSpec(baseDir, result.operations as Operation[])
        }
        return self
      },

      remove(path) {
        const fsPath = typeof path === 'string'
          ? FsLoc.decodeSync(path) as FsLoc.Groups.Rel.Rel
          : path
        // Determine if it's a file or directory for the operation
        const operationPath = FsLoc.Groups.File.is(fsPath)
          ? fsPath as FsLoc.RelFile
          : fsPath as FsLoc.RelDir
        const newOps = [...ops, { type: 'remove' as const, path: operationPath }]
        return createSpec(baseDir, newOps)
      },

      clear(path) {
        let relDir: FsLoc.RelDir
        if (typeof path === 'string') {
          // Handle special case for current directory
          const dirPath = path === '.' ? './' : path as string
          relDir = S.decodeSync(FsLoc.RelDir.String)(dirPath)
        } else {
          relDir = path as FsLoc.RelDir
        }
        const newOps = [...ops, { type: 'clear' as const, path: relDir }]
        return createSpec(baseDir, newOps)
      },

      move(from: any, to: any) {
        // Handle string inputs
        if (typeof from === 'string' && typeof to === 'string') {
          const fromLoc = FsLoc.FsLocLoose.decodeSync(from)
          const toLoc = FsLoc.FsLocLoose.decodeSync(to)

          // Check if both are files or both are directories
          if (fromLoc.file && toLoc.file) {
            // Both are files - reconstruct as RelFile
            const fromFile = FsLoc.RelFile.make({
              path: (fromLoc.path as any),
              file: fromLoc.file,
            })
            const toFile = FsLoc.RelFile.make({
              path: (toLoc.path as any),
              file: toLoc.file,
            })
            const newOps = [...ops, { type: 'move-file' as const, from: fromFile, to: toFile }]
            return createSpec(baseDir, newOps)
          } else if (!fromLoc.file && !toLoc.file) {
            // Both are directories - reconstruct as RelDir
            const fromDir = FsLoc.RelDir.make({
              path: (fromLoc.path as any),
            })
            const toDir = FsLoc.RelDir.make({
              path: (toLoc.path as any),
            })
            const newOps = [...ops, { type: 'move-dir' as const, from: fromDir, to: toDir }]
            return createSpec(baseDir, newOps)
          } else {
            throw new Error('Cannot move between file and directory')
          }
        } else {
          // Already typed - TypeScript ensures they match via overloads
          if (FsLoc.Groups.File.is(from)) {
            const newOps = [...ops, {
              type: 'move-file' as const,
              from: from as FsLoc.RelFile,
              to: to as FsLoc.RelFile,
            }]
            return createSpec(baseDir, newOps)
          } else {
            const newOps = [...ops, {
              type: 'move-dir' as const,
              from: from as FsLoc.RelDir,
              to: to as FsLoc.RelDir,
            }]
            return createSpec(baseDir, newOps)
          }
        }
      },

      add(path: any, contentOrBuilder?: any) {
        // Determine if path is a file or directory
        if (typeof path === 'string') {
          const parsed = FsLoc.FsLocLoose.decodeSync(path)
          if (parsed.file) {
            // It's a file - treat as file operation
            const relFile = FsLoc.RelFile.make({
              path: (parsed.path as any),
              file: parsed.file,
            })
            const newOps = [...ops, { type: 'file' as const, path: relFile, content: contentOrBuilder }]
            return createSpec(baseDir, newOps)
          } else {
            // It's a directory - treat as directory operation
            const relDir = FsLoc.RelDir.make({
              path: (parsed.path as any),
            })
            if (contentOrBuilder && typeof contentOrBuilder === 'function') {
              // Has a builder function
              const subSpec = createSpec(baseDir, [])
              const result = contentOrBuilder(subSpec)
              const subOps = result.operations as Operation[]
              const newOps = [...ops, { type: 'dir' as const, path: relDir, operations: subOps }]
              return createSpec(baseDir, newOps)
            } else {
              // Empty directory
              const newOps = [...ops, { type: 'dir' as const, path: relDir, operations: [] }]
              return createSpec(baseDir, newOps)
            }
          }
        } else {
          // Already typed FsLoc
          if (FsLoc.Groups.File.is(path)) {
            // It's a file
            const newOps = [...ops, { type: 'file' as const, path: path as FsLoc.RelFile, content: contentOrBuilder }]
            return createSpec(baseDir, newOps)
          } else {
            // It's a directory
            if (contentOrBuilder && typeof contentOrBuilder === 'function') {
              const subSpec = createSpec(baseDir, [])
              const result = contentOrBuilder(subSpec)
              const subOps = result.operations as Operation[]
              const newOps = [...ops, { type: 'dir' as const, path: path as FsLoc.RelDir, operations: subOps }]
              return createSpec(baseDir, newOps)
            } else {
              const newOps = [...ops, { type: 'dir' as const, path: path as FsLoc.RelDir, operations: [] }]
              return createSpec(baseDir, newOps)
            }
          }
        }
      },

      withBase(
        newBase: FsLoc.Inputs.Input.AbsDir,
      ): SpecBuilder {
        const absNewBase = FsLoc.normalizeInput(newBase) as FsLoc.AbsDir
        return createSpec(absNewBase, ops)
      },

      merge(...specs: SpecBuilder[]): SpecBuilder {
        const allOps = [...ops]
        for (const spec of specs) {
          allOps.push(...(spec.operations as Operation[]))
        }
        return createSpec(baseDir, allOps)
      },
    }

    return self
  }

  return createSpec(absBase, operations)
}
