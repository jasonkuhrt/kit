import { Fs } from '#fs'
import type { Json } from '#json'
import { Schema as S } from 'effect'
import { join } from 'node:path'

/**
 * Flat filesystem layout representation.
 * Maps absolute file paths to their contents.
 */
export interface Layout {
  [absolutePath: string]: string | Uint8Array
}

/**
 * Represents a single file system operation to be executed.
 */
export type Operation =
  | { type: 'file'; path: Fs.Path.RelFile; content: any } // Keep as any to preserve original types
  | { type: 'dir'; path: Fs.Path.RelDir; operations: Operation[] }
  | { type: 'remove'; path: Fs.Path.RelFile | Fs.Path.RelDir }
  | { type: 'clear'; path: Fs.Path.RelDir }
  | { type: 'move-file'; from: Fs.Path.RelFile; to: Fs.Path.RelFile }
  | { type: 'move-dir'; from: Fs.Path.RelDir; to: Fs.Path.RelDir }

/**
 * A specification for directory operations.
 * This is a pure data structure that accumulates operations without executing them.
 */
export interface SpecBuilder {
  readonly base: Fs.Path.AbsDir
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
  file<path extends Fs.Path.RelFile | string>(
    path: Fs.Path.Guard.RelFile<path>,
    content: path extends Fs.Path.RelFile ? Fs.InferFileContent<path>
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
  dir<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
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
  remove<path extends Fs.Path.$Rel | string>(
    path: Fs.Path.Guard.Rel<path>,
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
  clear<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
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
    from extends Fs.Path.RelFile | string,
    to extends Fs.Path.RelFile | string,
  >(
    from: Fs.Path.Guard.RelFile<from>,
    to: Fs.Path.Guard.RelFile<to>,
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
    from extends Fs.Path.RelDir | string,
    to extends Fs.Path.RelDir | string,
  >(
    from: Fs.Path.Guard.RelDir<from>,
    to: Fs.Path.Guard.RelDir<to>,
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
  add<path extends Fs.Path.RelFile | string>(
    path: Fs.Path.Guard.RelFile<path>,
    content: path extends Fs.Path.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object
      : never,
  ): SpecBuilder

  // Overload for directory paths - optional builder
  add<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
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
  withBase(base: Fs.Path.Input.AbsDir): SpecBuilder

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

  /**
   * Convert spec to flat layout representation.
   *
   * Walks the operations tree and builds a flat object mapping absolute paths to file contents.
   * Automatically stringifies objects to JSON for `.json` files.
   *
   * @returns Flat layout object
   *
   * @example
   * ```ts
   * const layout = spec('/')
   *   .add('package.json', { name: 'x' })
   *   .add('src/index.ts', 'export {}')
   *   .toLayout()
   * // { '/package.json': '{"name":"x"}', '/src/index.ts': 'export {}' }
   * ```
   */
  toLayout(): Layout

  // TODO: Add import feature
  // Import would read from absolute paths outside the sandbox to seed the spec
  // Signature: import(source: Fs.Path.AbsFile | Fs.Path.AbsDir, dest?: string): SpecBuilder
  // This would be a chain-only operation (not in spec) that executes immediately
  // Alternative: Dir.specFromDisk('/absolute/path') to create a spec from existing filesystem
}

/**
 * Convert spec to flat layout representation.
 *
 * Walks the operations tree and builds a flat object mapping absolute paths to file contents.
 * Automatically stringifies objects to JSON for `.json` files.
 *
 * @param spec - The spec to convert
 * @returns Flat layout object
 *
 * @example
 * ```ts
 * const mySpec = Dir.spec('/').add('package.json', { name: 'x' })
 * const layout = Dir.toLayout(mySpec)
 * // { '/package.json': '{"name":"x"}' }
 * ```
 */
export const toLayout = (spec: SpecBuilder): Layout => {
  const result: Layout = {}

  const processOp = (basePath: string, op: Operation): void => {
    switch (op.type) {
      case 'file': {
        const fullPath = join(basePath, op.path.toString())
        // Auto-stringify JSON objects for .json files
        if (
          typeof op.content === 'object'
          && op.content !== null
          && !ArrayBuffer.isView(op.content)
          && fullPath.endsWith('.json')
        ) {
          result[fullPath] = JSON.stringify(op.content)
        } else {
          result[fullPath] = op.content
        }
        break
      }
      case 'dir': {
        const dirPath = join(basePath, op.path.toString())
        op.operations.forEach(subOp => processOp(dirPath, subOp))
        break
      }
        // Ignore remove, clear, move operations - only extract file structure
    }
  }

  spec.operations.forEach(op => processOp(spec.base.toString(), op))
  return result
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
  base: Fs.Path.Input.AbsDir,
): SpecBuilder => {
  const absBase = Fs.Path.normalizeDynamicInput(Fs.Path.AbsDir.Schema)(base) as Fs.Path.AbsDir
  const operations: Operation[] = []

  const createSpec = (baseDir: Fs.Path.AbsDir, ops: Operation[]): SpecBuilder => {
    const self: SpecBuilder = {
      base: baseDir,
      operations: ops,

      file(path, content) {
        const relFile = typeof path === 'string'
          ? S.decodeSync(Fs.Path.RelFile.Schema)(path as string)
          : path as Fs.Path.RelFile
        const newOps = [...ops, { type: 'file' as const, path: relFile, content }]
        return createSpec(baseDir, newOps)
      },

      dir(path, builder?) {
        const relDir = typeof path === 'string'
          ? S.decodeSync(Fs.Path.RelDir.Schema)(path as string)
          : path as Fs.Path.RelDir

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
          ? Fs.Path.fromString(path) as Fs.Path.$Rel
          : path
        // Determine if it's a file or directory for the operation
        const operationPath = Fs.Path.$File.is(fsPath)
          ? fsPath as Fs.Path.RelFile
          : fsPath as Fs.Path.RelDir
        const newOps = [...ops, { type: 'remove' as const, path: operationPath }]
        return createSpec(baseDir, newOps)
      },

      clear(path) {
        let relDir: Fs.Path.RelDir
        if (typeof path === 'string') {
          // Handle special case for current directory
          const dirPath = path === '.' ? './' : path as string
          relDir = S.decodeSync(Fs.Path.RelDir.Schema)(dirPath)
        } else {
          relDir = path as Fs.Path.RelDir
        }
        const newOps = [...ops, { type: 'clear' as const, path: relDir }]
        return createSpec(baseDir, newOps)
      },

      move(from: any, to: any) {
        // Handle string inputs
        if (typeof from === 'string' && typeof to === 'string') {
          const fromLoc = Fs.Path.fromString(from)
          const toLoc = Fs.Path.fromString(to)

          // Check if both are files or both are directories
          if (Fs.Path.$File.is(fromLoc) && Fs.Path.$File.is(toLoc)) {
            // Both are files
            const newOps = [...ops, {
              type: 'move-file' as const,
              from: fromLoc as Fs.Path.RelFile,
              to: toLoc as Fs.Path.RelFile,
            }]
            return createSpec(baseDir, newOps)
          } else if (!Fs.Path.$File.is(fromLoc) && !Fs.Path.$File.is(toLoc)) {
            // Both are directories
            const newOps = [...ops, {
              type: 'move-dir' as const,
              from: fromLoc as Fs.Path.RelDir,
              to: toLoc as Fs.Path.RelDir,
            }]
            return createSpec(baseDir, newOps)
          } else {
            throw new Error('Cannot move between file and directory')
          }
        } else {
          // Already typed - TypeScript ensures they match via overloads
          if (Fs.Path.$File.is(from)) {
            const newOps = [...ops, {
              type: 'move-file' as const,
              from: from as Fs.Path.RelFile,
              to: to as Fs.Path.RelFile,
            }]
            return createSpec(baseDir, newOps)
          } else {
            const newOps = [...ops, {
              type: 'move-dir' as const,
              from: from as Fs.Path.RelDir,
              to: to as Fs.Path.RelDir,
            }]
            return createSpec(baseDir, newOps)
          }
        }
      },

      add(path: any, contentOrBuilder?: any) {
        // Determine if path is a file or directory
        if (typeof path === 'string') {
          const parsed = Fs.Path.fromString(path)
          if (Fs.Path.$File.is(parsed)) {
            // It's a file - already correctly typed
            const newOps = [...ops, {
              type: 'file' as const,
              path: parsed as Fs.Path.RelFile,
              content: contentOrBuilder,
            }]
            return createSpec(baseDir, newOps)
          } else {
            // It's a directory - already correctly typed
            if (contentOrBuilder && typeof contentOrBuilder === 'function') {
              // Has a builder function
              const subSpec = createSpec(baseDir, [])
              const result = contentOrBuilder(subSpec)
              const subOps = result.operations as Operation[]
              const newOps = [...ops, {
                type: 'dir' as const,
                path: parsed as Fs.Path.RelDir,
                operations: subOps,
              }]
              return createSpec(baseDir, newOps)
            } else {
              // Empty directory
              const newOps = [...ops, {
                type: 'dir' as const,
                path: parsed as Fs.Path.RelDir,
                operations: [],
              }]
              return createSpec(baseDir, newOps)
            }
          }
        } else {
          // Already typed FsLoc
          if (Fs.Path.$File.is(path)) {
            // It's a file
            const newOps = [...ops, { type: 'file' as const, path: path as Fs.Path.RelFile, content: contentOrBuilder }]
            return createSpec(baseDir, newOps)
          } else {
            // It's a directory
            if (contentOrBuilder && typeof contentOrBuilder === 'function') {
              const subSpec = createSpec(baseDir, [])
              const result = contentOrBuilder(subSpec)
              const subOps = result.operations as Operation[]
              const newOps = [...ops, { type: 'dir' as const, path: path as Fs.Path.RelDir, operations: subOps }]
              return createSpec(baseDir, newOps)
            } else {
              const newOps = [...ops, { type: 'dir' as const, path: path as Fs.Path.RelDir, operations: [] }]
              return createSpec(baseDir, newOps)
            }
          }
        }
      },

      withBase(
        newBase: Fs.Path.Input.AbsDir,
      ): SpecBuilder {
        const absNewBase = Fs.Path.normalizeDynamicInput(Fs.Path.AbsDir.Schema)(newBase) as Fs.Path.AbsDir
        return createSpec(absNewBase, ops)
      },

      merge(...specs: SpecBuilder[]): SpecBuilder {
        const allOps = [...ops]
        for (const spec of specs) {
          allOps.push(...(spec.operations as Operation[]))
        }
        return createSpec(baseDir, allOps)
      },

      toLayout(): Layout {
        return toLayout(self)
      },
    }

    return self
  }

  return createSpec(absBase, operations)
}
