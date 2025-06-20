# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Kit (`@wollybeard/kit`) is a TypeScript utility library providing functional programming utilities and data structure operations. The project emphasizes type safety, consistent APIs, and modular architecture.

## Code Quality Checks

After making code changes, ensure these checks pass:

1. **Type checking**: `pnpm check:types`
2. **Tests**: `pnpm test` (for specific modules: `pnpm test src/module-name/`)
3. **Formatting**: `pnpm fix:format` (always run the formatter to auto-fix any style issues)

Run all checks with: `pnpm check`

## Development Commands

```bash
# Building
pnpm build          # Compile TypeScript
pnpm dev            # Watch mode (no type checking)
pnpm build:clean    # Clean build artifacts

# Testing
pnpm test           # Run tests with Vitest
pnpm test:unit      # Same as test

# Code Quality
pnpm check:types    # TypeScript type checking
pnpm check:format   # Check formatting with dprint
pnpm fix:format     # Auto-format with dprint
pnpm check:package:circular  # Check circular dependencies

# Combined Commands
pnpm check          # Run all check:* commands
pnpm fix            # Run all fix:* commands
pnpm fixcheck       # Run fix then check

# Release
pnpm release        # Release stable version with dripip
```

## Architecture

The project uses a highly modular architecture with 30+ specialized modules in `src/`. Each module follows these patterns:

1. **File Structure**: `src/module-name/{$.ts, $$.ts, *.ts, $.test.ts}`
   - `$$.ts` - Barrel file exporting all functions/types
   - `$.ts` - Namespace file exporting the module namespace
   - `*.ts` - Implementation files
   - `$.test.ts` - Module tests
2. **Internal Imports**: Use `#` imports (e.g., `import { Fn } from '#fn'`)
3. **Namespace Exports**: All modules export as PascalCase namespaces
4. **Currying Pattern**: Functions support currying with `*On` and `*With` variants
5. **Universal Operations**: Consistent operations across modules (merge, by, is)

### Key Modules

- **Data Structures**: `arr`, `obj`, `str`, `rec`, `group`, `idx`, `tree`
- **Functional Programming**: `fn`, `prom`, `cache`
- **I/O & External**: `fs`, `fs-layout`, `fs-relative`, `http`, `cli`, `url`
- **Type/Value**: `bool`, `null`, `undefined`, `value`
- **Development**: `debug`, `ts`, `language`, `codec`, `json`
- **Error Handling**: `err` (includes `try` utilities)

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

Refer to CONTRIBUTING.md for detailed architectural patterns and API design principles.
