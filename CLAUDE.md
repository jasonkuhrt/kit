<!-- flo: local extension enabled -->

# CLAUDE.md

**CRITICAL**: If a file named `.claude/CLAUDE.local.md` exists in this project, read it immediately and follow its instructions. This file contains context-specific information for the current work (e.g., GitHub issue details).

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Kit is a TypeScript standard library providing data structures, utilities, primitives, and domains. The project is organized as a `@kouka` scoped monorepo with multiple packages. It emphasizes type safety, consistent APIs, and modular architecture.

## Backwards Compatibility

**Default stance: Breaking changes are acceptable.**

This is a pre-1.0 library under active development. Unless explicitly instructed otherwise for a specific task, you should:

- Prioritize clean design over backwards compatibility
- Make breaking changes freely when they improve the API
- Not worry about migration paths or deprecation warnings
- Focus on the best long-term solution

Backwards compatibility will ONLY be considered when explicitly mentioned in the task requirements.

## Code Quality Checks

After making code changes, ensure these checks pass:

1. **Type checking**: `pnpm check:types`
2. **Tests**: `pnpm test:unit src/path/to/file.test.ts --run` (ALWAYS specify path - never run full suite)
3. **Formatting**: `pnpm fix:format` (always run the formatter to auto-fix any style issues)

Run all checks with: `pnpm check` (but prefer targeted test runs during development)

### TypeScript Configuration

The project uses two TypeScript configurations for optimal development experience:

- **`tsconfig.json`** (Development - Fast):
  - Excludes `**/*.bench-d.ts` files
  - Used by default for `pnpm check:types`
  - Provides fast feedback during development
  - Benchmarks contain intentionally expensive type operations and slow down type checking

- **`tsconfig.all.json`** (CI/Complete):
  - Includes all files including benchmarks
  - Use with `pnpm check:types:all` for complete verification
  - Recommended for CI or before releases
  - Ensures benchmarks are type-safe

**Why separate configs?** Type benchmarks measure expensive type operations (recursive types, complex conditionals). Including them in development type checking creates a poor DX with slow feedback loops.

## Development Commands

```bash
# Building
pnpm build          # Build all packages

# Testing (run from root)
# Uses vitest with root config - tests can import across packages via aliases
pnpm vitest packages/core/src/path/to/file.test.ts --run  # Run single test file
pnpm vitest packages/core/src/module/ --run               # Run tests in directory

# Code Quality
pnpm check:types        # TypeScript type checking across all packages
pnpm check:format       # Check formatting with dprint
pnpm fix:format         # Auto-format with dprint
pnpm check:lint         # Lint all packages
pnpm check:publint      # Validate package.json exports

# Combined Commands
pnpm check          # Run all check:* commands
pnpm fix            # Run all fix:* commands

# Release
pnpm release        # Publish with changesets
```

## Architecture

The project is a pnpm workspace monorepo with packages in `packages/`:

- **`@kouka/core`** - Core utilities (30+ modules: arr, obj, str, fn, err, etc.)
- **`@kouka/test`** - Test utilities (vitest helpers, property-based testing)
- **`@kouka/assert`** - Assertion utilities
- **`@kouka/oak`** - CLI argument parsing

### Module Structure (within packages)

Each module in `@kouka/core` follows these patterns:

1. **File Structure**: `src/module-name/{_.ts, __.ts, *.ts, _.test.ts}`
   - `__.ts` - Barrel file exporting all functions/types
   - `_.ts` - Namespace file exporting the module namespace
   - `*.ts` - Implementation files
   - `_.test.ts` - Module tests
2. **Internal Imports**: Use `#` imports (e.g., `import { Fn } from '#fn'`)
3. **Namespace Exports**: All modules export as PascalCase namespaces
4. **Currying Pattern**: Functions support currying with `*On` and `*With` variants

### Key Modules in @kouka/core

- **Data Structures**: `arr`, `obj`, `str`, `rec`, `tup`
- **Functional Programming**: `fn`, `prom`, `prox`
- **Type/Value**: `bool`, `null`, `undefined`, `num`
- **Development**: `ts`, `lang`, `pat`, `optic`
- **Error Handling**: `err`

## Important Patterns

1. **Currying Functions**: When implementing functions that take multiple parameters, provide curried versions:
   - Base function: `doSomething(a, b)`
   - Curried variants: `doSomethingWith(a)(b)`, `doSomethingOn(b)(a)`

2. **Module Exports**: Always export as a namespace object:
   ```typescript
   export * as ModuleName from './module-name.js'
   ```

3. **Type Exports**: Include type exports in the namespace when relevant:
   ```typescript
   export type * from './types.js'
   ```

4. **Error Handling**: Use the `err` module's `try` utilities for consistent error handling patterns

5. **Testing**: Tests use Vitest and follow the pattern `*.test.ts` or `*.test-d.ts` for type tests
   - **Type Assertions**: Use value-level `Assert.exact.ofAs<E>().on(value)` API (reports ALL errors)
   - **DO NOT use `Assert.Cases<>` or `Assert.Case<>`** unless explicitly instructed - they short-circuit on first failure
   - See `~/.claude/CLAUDE.md` "Type Testing" section for detailed rationale

6. **Type-Level Transformations**: Prefer conditional types over function overloads:
   ```typescript
   // ✅ Good - Type-level transformation
   type Abs<T extends number> =
     T extends Negative ? Positive :
     T extends NonPositive ? NonNegative :
     NonNegative

   const abs = <T extends number>(value: T): Abs<T> => ...

   // ❌ Avoid - Function overloads
   function abs(value: Negative): Positive
   function abs(value: NonPositive): NonNegative
   function abs(value: number): NonNegative
   ```
   Benefits: Cleaner API, better type inference, easier to maintain

Refer to CONTRIBUTING.md for detailed architectural patterns and API design principles.
