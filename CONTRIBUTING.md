# Contributing to Kit

This document serves as both a contributor guide and project memory/development context for the Kit TypeScript utility library. Update this document as patterns evolve!

## Project Overview

Kit is a comprehensive TypeScript utility library providing functional programming utilities, data structure operations, and common development helpers. The library emphasizes type safety, consistent APIs, and functional programming patterns.

## Recent Major Changes

### 2025 Module Structure Refactoring

1. **Module Organization**: Migrated all modules to use `$` (namespace) and `$$` (barrel) pattern
2. **Import Path Simplification**: Removed `.js` extensions from internal imports
3. **Circular Dependency Resolution**: Fixed circular dependencies using deep imports where needed
4. **Test Utilities Enhancement**: Improved property-based testing error messages
5. **Fast-check Migration**: Standardized all tests to use default export pattern

### 2024 Refactoring

1. **Import System Migration**: Converted all relative imports (`../`) to `#` syntax
2. **Group Module**: Extracted indexing functionality from `Rec` → new top-level `Group` module
3. **Universal Merge**: Implemented `merge` operations across `Arr`, `Obj`, `Str`, `Path`, `Rec`, `Group`
4. **Undefined Module**: New module for undefined handling with proper TypeScript utility types

## Architecture & Patterns

### Module Structure

Every module follows a consistent pattern:

```
src/module-name/
├── $$.ts             # Barrel exports (all functions/types)
├── $.ts              # Namespace export
├── $.test.ts         # Module tests
└── *.ts              # Implementation files
```

The `$` and `$$` naming convention:

- `$$` (barrel file) - Exports all individual functions/types from the module
- `$` (namespace file) - Creates and exports the namespace object

### Import System

**Use `#` imports** for internal module references:

```typescript
// ✅ Correct
import { Fn } from '#fn'
import { Obj } from '#obj'

// ❌ Incorrect
import { Fn } from '#fn/index.js' // Don't include .js extension
import { Obj } from '../obj'
```

**Configuration:**

- TypeScript: `"paths": { "#*": ["./src/*.ts"] }` in `tsconfig.json`
- Package.json: `"imports": { "#*": { "default": "./src/*.ts" } }` for mapping imports

### Namespace Name Elision

Module exports should NOT repeat the namespace name:

```typescript
// ✅ Correct
Group.by(array, key) // not Group.groupBy
Undefined.is(value) // not Undefined.isUndefined
Str.merge(a, b) // not Str.mergeStrings

// ❌ Incorrect
Group.groupBy(array, key)
Undefined.isUndefined(value)
```

### Function Design

#### Overview

1. When introducing a function have it accept data as the first parameter. Sometimes there is no clear concept of a "data" parameter. An example is `Arr.map` which accepts an array and a mapper function.

2. When currying makes sense for a function do it. Typically we do not curry functions with more than two parameters. There are some exceptions.

3. We have a few patterns of curried functions, each with their corresponding naming pattern.

   1. When data is first then we use `<functionName>On` to represent a factory that will return a function that operates on that data.
   2. When data is second then we use `<functionName>With` to represent a factory that will operate with that configuration (e.g. mapper function).

4. Some functions have only data parameters and as such only have a `*On` curried variant.

#### Example Currying

For most 2-parameter functions, provide both curried variants:

```typescript
// Base function
export const split = (value: string, separator: string): string[] => { ... }

// Curried version - data first (operates ON the data)
export const splitOn = Fn.curry(split)

// Flipped curry - data second (operates WITH the separator)
export const splitWith = Fn.flipCurried(Fn.curry(split))
```

#### Example Curry Variant Use Cases

```typescript
// splitOn - useful when you have data and want different separators
const csvLine = 'name,age,city'
const splitByComa = Str.splitOn(csvLine)
const fields = splitByComa(',') // ['name', 'age', 'city']
const chars = splitByComa('') // ['n','a','m','e',',','a','g','e'...]

// splitWith - useful when you have a separator and different data
const splitByComma = Str.splitWith(',')
const userFields = splitByComma('john,25,nyc') // ['john', '25', 'nyc']
const productFields = splitByComma('laptop,999') // ['laptop', '999']

// trimWith - useful when you have a character set to trim different strings
const trimSpaces = Str.trimWith(' \t')
const clean1 = trimSpaces('  hello  ') // 'hello'
const clean2 = trimSpaces('\thello\t') // 'hello'
```

### Universal Operations

We maintain some consistent operation names across data structures:

| Operation   | Purpose               | Examples                                            |
| ----------- | --------------------- | --------------------------------------------------- |
| **`merge`** | Combine two instances | `Arr.merge`, `Obj.merge`, `Str.merge`, `Path.merge` |
| **`by`**    | Group/index by key    | `Group.by(array, 'field')`                          |
| **`is`**    | Type predicate        | `Arr.is`, `Obj.is`, `Undefined.is`                  |

## Module Guide

### Core Data Structures

- **`Arr`** - Array utilities (merge, partition, map variants)
- **`Obj`** - Object utilities (merge, entries, type checking)
- **`Str`** - String utilities (merge, replace, template, case conversion)
- **`Path`** - File path utilities (merge via join, resolution)
- **`Rec`** - Record utilities (merge, type checking)
- **`Group`** - Array grouping/indexing (by, merge)
- **`Tree`** - Tree data structure utilities (map, filter, reduce, path operations, arbitrary generation)

### Utility Modules

- **`Undefined`** - undefined handling (is, filter, orElse, type utilities)
- **`Fn`** - Function utilities (curry, pipe, composition)
- **`Bool`** - Boolean utilities (predicates, logical operations)
- **`Language`** - TypeScript language utilities
- **`Value`** - General value utilities

### I/O & External

- **`Fs`** - File system operations
- **`Http`** - HTTP utilities
- **`Json`** - JSON parsing/serialization
- **`Cli`** - Command line utilities

## Development Workflow

### Automated PR Reviews

This repository uses AI-powered automated code reviews for all pull requests. When you open or update a PR:

1. **Automatic Review**: An AI reviewer (GPT-4o) analyzes your code changes
2. **Intelligent Feedback**: Receives comments on:
   - Code quality and best practices
   - Potential bugs and type safety issues
   - Performance improvements
   - Security concerns
   - Consistency with repository patterns
3. **Interactive**: You can respond to review comments for clarification

See [`.github/PR_REVIEW.md`](.github/PR_REVIEW.md) for complete documentation.

### Setup

```bash
pnpm install
```

### Development Commands

```bash
pnpm check:types        # TypeScript type checking
pnpm build              # Compile to build/
pnpm fix:format         # Auto-format with dprint
pnpm check:format       # Check formatting
pnpm test               # Run tests
```

### Adding a New Module

1. **Create module directory**: `src/new-module/`
2. **Create barrel file**: `src/new-module/$$.ts`
   ```typescript
   export * from './implementation.js'
   export * from './types.js'
   // etc.
   ```
3. **Create namespace file**: `src/new-module/$.ts`
   ```typescript
   export * as NewModule from './$$.js'
   ```
4. **Add import mapping**: Update `package.json`
   ```json
   {
     "imports": {
       "#new-module": "./src/new-module/$.ts",
       "#new-module/new-module": "./src/new-module/$$.ts"
     }
   }
   ```
5. **Add to package.json exports**:
   ```json
   "./new-module": "./build/new-module/new-module.js"
   ```
6. **Add to main exports**: `src/exports/index.ts`
   ```typescript
   export * from '#new-module'
   ```

### TypeScript Guidelines

- **Strict mode**: Project uses strictest TypeScript settings
- **Explicit types**: Prefer explicit return types for public APIs
- **Generic constraints**: Use meaningful constraint names (`$Type`, `$Key`)
- **Conditional types**: Use dprint-ignore for complex conditional types

### Naming Conventions

- **Files**: kebab-case (`group-by.ts`)
- **Directories**: kebab-case (`fs-layout/`)
- **Exports**: PascalCase namespaces (`Group`, `Undefined`)
- **Functions**: camelCase (`merge`, `orElse`)
- **Types**: PascalCase for public types, camelCase for function return types

### API Design Principles

1. **Functional first**: Prefer pure functions over mutations
2. **Type safety**: Leverage TypeScript's type system fully
3. **Consistency**: Similar operations should have similar names across modules
4. **Discoverability**: Function names should be obvious within their namespace
5. **Composability**: Support functional composition patterns

## Testing

### Running Tests

Tests are separated into two independent categories:

**Runtime Tests (`test:unit`)**

- Tests runtime behavior in `.test.ts` files
- Does NOT validate type-level assertions (attest snapshots)
- Fast feedback loop for development
- Run locally: `pnpm test:unit [pattern] [--run]`
- CI job: `test-unit`

**Type Tests (`test:types`)**

- Validates TypeScript type correctness (`.test-d.ts` files via `tsc`)
- Validates attest type snapshots (`.snap()` calls in `.test.ts` files)
- More comprehensive but slower
- Run locally: `pnpm test:types`
- CI job: `test-types`

**Both (`test`)**

- Runs both runtime and type tests sequentially
- Run locally: `pnpm test [--run]` (defaults to watch mode for unit tests)
- Use this before pushing to ensure everything passes in CI

### Writing Tests

- Do colocate tests to modules.
- For modules that have simple interfaces prefer putting all tests into `$.test.ts` and then access the interface(s) under test via the module namespace. For example this layout:

  ```
  src/foo/{$.ts, $.test.ts, $$.ts, implementation.ts}
  ```

  With this content:

  ```ts
  // $.ts
  export * as Foo from './$$.js'
  ```

  ```ts
  // $.test.ts
  import { Foo } from './$.js'

  test('...', () => { Foo... })
  ```

- For modules with complex parts you may create a test file for each such part, while still keeping the rest of the simpler tests, if any, in `$.test.ts`. Example:

  ```
  src/bar/{$.ts, $.test.ts, $$.ts, bar.ts, thing-complex.ts, thing-complex.test.ts}
  ```

- Prefer using Vitest `test.for` feature to cover many cases in a succinct way. Use Kit's own `Test` module to support writing such tests.
- Do include type-level tests for complex generic types
- Do _not_ write sprawling test code. _Do_ be as concise as possible.
- Do _not_ use top-level `describe` blocks that repeat the module name. Instead, use `test` directly for each test case or group of related tests.
- Do _not_ wrap `Test.describe()` or `Test.on()` calls inside Vitest `describe` blocks. The `Test` module creates its own describe blocks internally. Use `Test.describe()` directly at the top level.

  ```typescript
  // ✅ Correct - Test.describe() at top level
  Test.describe('addition')
    .on(add)
    .cases([[1, 2], 3])
    .test()

  // ❌ Incorrect - wrapping Test in describe
  describe('addition', () => {
    Test.on(add)
      .cases([[1, 2], 3])
      .test()
  })
  ```
- Prefer using `fast-check` for property-based runtime testing where applicable.

## Common Patterns

### Error Handling

```typescript
// Use Result/Either pattern or explicit error returns
export const parseJson = (text: string): Json.Value | Error => { ... }
```

### Optional Parameters

```typescript
// Use options objects for complex configurations
export interface MergeOptions {
  deep?: boolean
  arrays?: 'replace' | 'concat'
}
```

### Type Guards

```typescript
export const is = (value: unknown): value is ModuleType => {
  // Implementation
}
```

## Release Process

1. Ensure all tests pass
2. Update version following semver
3. Run `pnpm build` to verify build
4. Commit changes
5. Use `pnpm release` for automated release
