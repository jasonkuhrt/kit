## Implementation Plan: FsManager API with Static Path Parsing

### Overview

Create a fluent file system manager API with static type inference for path strings, enabling type-safe file/directory operations with special handling for JSON files.

### 1. **New Module: `fs-loc/parse`** - Static Path String Parsing

Create type-level utilities to parse string literals into FsLoc types:

**File: `src/utils/fs-loc/parse/parse.ts`**

- Type-level parser that analyzes string literals to determine if they're files or directories
- Special detection for `.json` files
- Key types:
  - `ParsePath<T>` - Main parser that returns `'file' | 'dir' | 'json'`
  - `InferFsLoc<T>` - Maps parsed type to corresponding FsLoc type
  - `ParsedFile<T>` - Extract file info with name and extension
- Rules:
  - Strings ending with `/` → directory
  - Strings with extensions → file (`.json` → special json type)
  - Strings without extensions → directory (unless in specific context)

### 2. **New Module: `fs-manager`** - Main FsManager API

Create the manager pattern with Effect-based operations:

**File: `src/utils/fs-manager/fs-manager.ts`**

```typescript
class FsManager {
  constructor(private baseDir: FsLoc.AbsDir)

  // Single file write with inferred types
  write<T extends string>(
    path: T,
    content: InferContent<T>,
  ): Effect<void>

  // Batch write with nested structure
  write(
    entries: NestedEntry[],
  ): Effect<void>
}
```

**Key Features:**

- Overloaded `write` method:
  - Single file: `write('package.json', { name: 'test' })`
  - Nested structure: `write([['src', [['app.js', 'code']]]])`
- Type inference:
  - JSON files accept any JSON-serializable value
  - Regular files accept strings
  - Directories rejected in single-file write
- Effect-based for composability

### 3. **Type System Integration**

**Nested Entry Types:**

```typescript
type NestedEntry =
  | FileEntry // ['file.txt', string] or ['file.json', JsonValue]
  | DirEntry // ['dirname', NestedEntry[]]

type FileEntry<Path extends string = string> = [
  path: Path,
  content: InferContent<Path>,
]

type DirEntry = [path: string, entries: NestedEntry[]]

type InferContent<T extends string> = ParsePath<T> extends 'json' ? JsonValue
  : ParsePath<T> extends 'file' ? string
  : never // directories can't have content in single write
```

### 4. **Implementation Details**

- Use Effect's FileSystem service for actual I/O
- Leverage existing `FsLoc` decode/encode for runtime validation
- Static parsing must align with runtime `FsLoc.decode` behavior
- Support both absolute and relative base directories
- Automatic directory creation for nested paths
- JSON values automatically stringified with proper formatting

### 5. **Testing Strategy**

- Type-level tests for path parsing (`parse.test-d.ts`)
- Runtime tests with `FsMemory` for manager operations
- Property-based tests to ensure static/runtime parsing alignment
- Test cases:
  - JSON file detection and type inference
  - Directory vs file disambiguation
  - Nested structure creation
  - Error cases (invalid paths, type mismatches)

### 6. **File Structure**

```
src/utils/
  fs-loc/
    parse/
      $.ts          # Namespace export
      $$.ts         # Barrel export
      parse.ts      # Type-level parsing utilities
      parse.test-d.ts
  fs-manager/
    $.ts            # Namespace export
    $$.ts           # Barrel export
    fs-manager.ts   # Main FsManager class
    types.ts        # NestedEntry types
    $.test.ts       # Runtime tests
```

### Benefits

- Type-safe path handling at compile time
- Intuitive API matching user's mental model
- Automatic JSON handling
- Composable with Effect ecosystem
- No runtime overhead from type inference
