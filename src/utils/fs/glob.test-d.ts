import { Fs } from '#fs'
import { Ts } from '#ts'
import { Effect } from 'effect'
import { glob, globSync } from './glob.js'

// Test onlyFiles option behavior
type _GlobOnlyFiles = Ts.Assert.Cases<
  // onlyFiles: true with relative paths (default)
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyFiles: true }>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >,
  // Default behavior (onlyFiles is default true when options is undefined)
  Ts.Assert.exact.of<
    ReturnType<typeof glob<undefined>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // Empty options object (should behave as default - onlyFiles true)
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{}>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >
>

// Test onlyDirectories option behavior
type _GlobOnlyDirectories = Ts.Assert.Cases<
  // onlyDirectories: true with relative paths
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyDirectories: true }>>,
    Effect.Effect<Fs.Path.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsDir[], Error>
  >
>

// Test onlyFiles: false behavior (returns both files and dirs)
type _GlobBothFilesAndDirs = Ts.Assert.Cases<
  // onlyFiles: false with relative paths
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyFiles: false }>>,
    Effect.Effect<Fs.Path.$Rel[], Error>
  >,
  // onlyFiles: false with absolute paths
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ onlyFiles: false; absolute: true }>>,
    Effect.Effect<Fs.Path.$Abs[], Error>
  >
>

// Test globSync has same type inference behavior
type _GlobSyncTypes = Ts.Assert.Cases<
  // onlyFiles: true with relative paths
  Ts.Assert.exact.of<
    ReturnType<typeof globSync<{ onlyFiles: true }>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  Ts.Assert.exact.of<
    ReturnType<typeof globSync<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >,
  // onlyDirectories: true with relative paths
  Ts.Assert.exact.of<
    ReturnType<typeof globSync<{ onlyDirectories: true }>>,
    Effect.Effect<Fs.Path.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  Ts.Assert.exact.of<
    ReturnType<typeof globSync<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<Fs.Path.AbsDir[], Error>
  >,
  // Default behavior
  Ts.Assert.exact.of<
    ReturnType<typeof globSync<undefined>>,
    Effect.Effect<Fs.Path.RelFile[], Error>
  >
>

// Test that the user's specific use case works as expected
type _UserExample = Ts.Assert.Cases<
  Ts.Assert.exact.of<
    ReturnType<typeof glob<{ absolute: true; onlyFiles: true }>>,
    Effect.Effect<Fs.Path.AbsFile[], Error>
  >
>
