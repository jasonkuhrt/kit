# Contributing to Kit

This document serves as both a contributor guide and project memory/development context for the Kit TypeScript utility library. Update this document as patterns evolve!

## Project Overview

Kit is a comprehensive TypeScript utility library providing functional programming utilities, data structure operations, and common development helpers. The library emphasizes type safety, consistent APIs, and functional programming patterns.

## Recent Major Changes

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
├── module-name.ts    # Main implementation
└── index.ts          # Exports: export * as ModuleName from './module-name.js'
```

### Import System

**Use `#` imports** for internal module references:

```typescript
// ✅ Correct
import { Obj } from "#obj/index.js";
import { Fn } from "#fn/index.js";

// ❌ Incorrect
import { Obj } from "../obj/index.js";
```

**Configuration:**

- TypeScript: `"paths": { "#*": ["./src/*"] }` in `tsconfig.json`
- Node.js: `"imports": { "#*": { "default": "./build/*" } }` in `package.json`

### Namespace Name Elision

Module exports should NOT repeat the namespace name:

```typescript
// ✅ Correct
Group.by(array, key); // not Group.groupBy
Undefined.is(value); // not Undefined.isUndefined
Str.merge(a, b); // not Str.mergeStrings

// ❌ Incorrect
Group.groupBy(array, key);
Undefined.isUndefined(value);
```

### Function Design

#### Overview

1. When introducing a function have it accept data as the first parameter. Sometimes there is no clear concept of a "data" parameter. An example is `Arr.map` which accepts an array and a mapper function.

2. When currying makes sense for a function do it. Typically we do not curry functions with more than two parameters. There are some exceptions.

3. We have a few patterns of curried functions, each with their corresponding naming pattern.

   1. When data is first then we use `<functionName>On` to represent a factory that will return a function that operations on that data.
   2. When data is second then we use `<functionName>With` to represent a factory that will operate with that configuration (e.g. mapper function).

4. Some functions have only data parameters and as such only have a `*On` curried variant.

#### Example Currying

For most 2-parameter functions, provide both curried variants:

```typescript
// Base function
export const split = (value: string, separator: string): string[] => { ... }

// Curried version (partial application of first parameter)
export const splitOn = Fn.curry(split)

// Flipped curry (partial application of second parameter)
export const splitWith = Fn.flipCurried(splitOn)
```

#### Example Curry Variant Use Cases

```typescript
// splitOn - useful when you have data and want different separators
const csvLine = "name,age,city";
const splitByComa = Str.splitOn(csvLine);
const fields = splitByComa(","); // ['name', 'age', 'city']
const chars = splitByComa(""); // ['n','a','m','e',',','a','g','e'...]

// splitWith - useful when you have a separator and different data
const splitByComma = Str.splitWith(",");
const userFields = splitByComma("john,25,nyc"); // ['john', '25', 'nyc']
const productFields = splitByComma("laptop,999"); // ['laptop', '999']

// trimWith - useful when you have a character set to trim different strings
const trimSpaces = Str.trimWith(" \t");
const clean1 = trimSpaces("  hello  "); // 'hello'
const clean2 = trimSpaces("\thello\t"); // 'hello'
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
2. **Implement main file**: `src/new-module/new-module.ts`
3. **Create index file**: `src/new-module/index.ts`
   ```typescript
   export * as NewModule from "./new-module.js";
   ```
4. **Add to package.json exports**:
   ```json
   "./new-module": "./build/new-module/new-module.js"
   ```
5. **Add to main exports**: `src/exports/index.ts`
   ```typescript
   export * from "../new-module/index.js";
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

- Place tests adjacent to implementation: `module.test.ts`
- Use descriptive test names
- Test both happy path and edge cases
- Include type-level tests for complex generic types

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
  deep?: boolean;
  arrays?: "replace" | "concat";
}
```

### Type Guards

```typescript
export const is = (value: unknown): value is ModuleType => {
  // Implementation
};
```

## Release Process

1. Ensure all tests pass
2. Update version following semver
3. Run `pnpm build` to verify build
4. Commit changes
5. Use `pnpm release` for automated release
