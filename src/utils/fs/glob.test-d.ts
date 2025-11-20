import type { Type as A } from '#assert/assert'
import { Fs } from '#fs'
import { Ts } from '#ts'
import { Effect } from 'effect'
import { glob, globSync } from './glob.js'

// Test onlyFiles option behavior
type _GlobOnlyFiles = A.Cases<
  // onlyFiles: true with relative paths (default)
  A.exact.of<
    ReturnType<typeof glob<{ onlyFiles: true }>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  A.exact.of<
    ReturnType<typeof glob<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >,
  // Default behavior (onlyFiles is default true when options is undefined)
  A.exact.of<
    ReturnType<typeof glob<undefined>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // Empty options object (should behave as default - onlyFiles true)
  A.exact.of<
    ReturnType<typeof glob<{}>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >
>

// Test onlyDirectories option behavior
type _GlobOnlyDirectories = A.Cases<
  // onlyDirectories: true with relative paths
  A.exact.of<
    ReturnType<typeof glob<{ onlyDirectories: true }>>,
    Effect.Effect<Fs.Path.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  A.exact.of<
    ReturnType<typeof glob<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsDir[], Error>
  >
>

// Test onlyFiles: false behavior (returns both files and dirs)
type _GlobBothFilesAndDirs = A.Cases<
  // onlyFiles: false with relative paths
  A.exact.of<
    ReturnType<typeof glob<{ onlyFiles: false }>>,
    Effect.Effect<Fs.Path.$Rel[], Error>
  >,
  // onlyFiles: false with absolute paths
  A.exact.of<
    ReturnType<typeof glob<{ onlyFiles: false; absolute: true }>>,
    Effect.Effect<Fs.Path.$Abs[], Error>
  >
>

// Test globSync has same type inference behavior
type _GlobSyncTypes = A.Cases<
  // onlyFiles: true with relative paths
  A.exact.of<
    ReturnType<typeof globSync<{ onlyFiles: true }>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  A.exact.of<
    ReturnType<typeof globSync<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >,
  // onlyDirectories: true with relative paths
  A.exact.of<
    ReturnType<typeof globSync<{ onlyDirectories: true }>>,
    Effect.Effect<Fs.Path.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  A.exact.of<
    ReturnType<typeof globSync<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsDir[], Error>
  >,
  // Default behavior
  A.exact.of<
    ReturnType<typeof globSync<undefined>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >
>

// Test that the user's specific use case works as expected
type _UserExample = A.Cases<
  A.exact.of<
    ReturnType<typeof glob<{ absolute: true; onlyFiles: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >
>
