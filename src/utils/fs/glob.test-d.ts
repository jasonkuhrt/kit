import { FsLoc } from '#fs-loc'
import { Ts } from '#ts'
import { Effect } from 'effect'
import { glob, globSync } from './glob.js'

// Test onlyFiles option behavior
type _GlobOnlyFiles = Ts.Cases<
  // onlyFiles: true with relative paths (default)
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyFiles: true }>>,
    Effect.Effect<FsLoc.RelFile.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<FsLoc.AbsFile.AbsFile[], Error>
  >,
  // Default behavior (onlyFiles is default true when options is undefined)
  Ts.AssertEqual<
    ReturnType<typeof glob<undefined>>,
    Effect.Effect<FsLoc.RelFile.RelFile[], Error>
  >,
  // Empty options object (should behave as default - onlyFiles true)
  Ts.AssertEqual<
    ReturnType<typeof glob<{}>>,
    Effect.Effect<FsLoc.RelFile.RelFile[], Error>
  >
>

// Test onlyDirectories option behavior
type _GlobOnlyDirectories = Ts.Cases<
  // onlyDirectories: true with relative paths
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyDirectories: true }>>,
    Effect.Effect<FsLoc.RelDir.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<FsLoc.AbsDir.AbsDir[], Error>
  >
>

// Test onlyFiles: false behavior (returns both files and dirs)
type _GlobBothFilesAndDirs = Ts.Cases<
  // onlyFiles: false with relative paths
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyFiles: false }>>,
    Effect.Effect<FsLoc.Groups.Rel.Rel[], Error>
  >,
  // onlyFiles: false with absolute paths
  Ts.AssertEqual<
    ReturnType<typeof glob<{ onlyFiles: false; absolute: true }>>,
    Effect.Effect<FsLoc.Groups.Abs.Abs[], Error>
  >
>

// Test globSync has same type inference behavior
type _GlobSyncTypes = Ts.Cases<
  // onlyFiles: true with relative paths
  Ts.AssertEqual<
    ReturnType<typeof globSync<{ onlyFiles: true }>>,
    Effect.Effect<FsLoc.RelFile.RelFile[], Error>
  >,
  // onlyFiles: true with absolute paths
  Ts.AssertEqual<
    ReturnType<typeof globSync<{ onlyFiles: true; absolute: true }>>,
    Effect.Effect<FsLoc.AbsFile.AbsFile[], Error>
  >,
  // onlyDirectories: true with relative paths
  Ts.AssertEqual<
    ReturnType<typeof globSync<{ onlyDirectories: true }>>,
    Effect.Effect<FsLoc.RelDir.RelDir[], Error>
  >,
  // onlyDirectories: true with absolute paths
  Ts.AssertEqual<
    ReturnType<typeof globSync<{ onlyDirectories: true; absolute: true }>>,
    Effect.Effect<FsLoc.AbsDir.AbsDir[], Error>
  >,
  // Default behavior
  Ts.AssertEqual<
    ReturnType<typeof globSync<undefined>>,
    Effect.Effect<FsLoc.RelFile.RelFile[], Error>
  >
>

// Test that the user's specific use case works as expected
type _UserExample = Ts.Cases<
  Ts.AssertEqual<
    ReturnType<typeof glob<{ absolute: true; onlyFiles: true }>>,
    Effect.Effect<FsLoc.AbsFile.AbsFile[], Error>
  >
>
