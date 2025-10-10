# Drillable Namespace Pattern

The **Drillable Namespace Pattern** is a module organization approach that enables dual import forms for your modules, giving users flexibility in how they access your library's functionality.

## What is it?

The Drillable Namespace Pattern allows a module to be imported in two equivalent ways:

```typescript
// Form 1: Named import from main package
import { Err } from '@wollybeard/kit'

// Form 2: Namespace import from subpath
import * as Err from '@wollybeard/kit/err'
```

Both import forms provide **exactly the same API** - they're just different syntactic ways to access the same functionality.

## Why use it?

### Benefits for Users

1. **Flexibility**: Users can choose their preferred import style
2. **Bundle optimization**: Subpath imports can enable better tree-shaking in some bundlers
3. **Explicit dependencies**: Subpath imports make it clear which modules are being used
4. **Namespace clarity**: Named imports from the main package clearly show the module structure

### When to Use

Use the Drillable Namespace Pattern when:

- Your module is a cohesive namespace with multiple related functions
- Users would benefit from flexible import options
- The module represents a significant domain concept (e.g., `Err`, `Test`, `Num`)

**Don't use it** for:

- Simple utility functions without a clear namespace identity
- Internal-only modules
- Temporary or experimental APIs

## How it Works

### File Structure

The pattern requires a specific file organization:

```
src/utils/err/
├── $.ts           # Public API (points to $$.ts)
├── $$.ts          # Re-exports from implementation
└── err.ts         # Implementation
```

### Implementation

**1. Implementation file (`err.ts`):**

```typescript
// Contains all the actual implementation
export const fromUnknown = (error: unknown): Error => {
  // ... implementation
}

export const toString = (error: Error): string => {
  // ... implementation
}
```

**2. Internal barrel (`$$.ts`):**

```typescript
// Re-exports everything from implementation
export * from './err.js'
```

**3. Public API (`$.ts`):**

```typescript
/**
 * Error handling utilities.
 *
 * Provides functions for working with JavaScript errors.
 */
export * as Err from './$$.js'
```

The key is the **`export * as Err from './$$.js'`** pattern in the public API file. This creates the drillable namespace.

### Package Configuration

Your `package.json` must expose both entry points:

```json
{
  "exports": {
    ".": "./build/index.js", // Main package entry
    "./err": "./build/utils/err/$.js" // Subpath entry
  }
}
```

## Detection

The documentation generator automatically detects the Drillable Namespace Pattern by looking for:

1. An entrypoint file with `export * as Name from './$'` or similar pattern
2. The pattern references an implementation file (often `$$.ts`)
3. The package exports both the main entry and the subpath

When detected, the API documentation will show both import forms:

```typescript
// Namespace import from main package
import { Err } from '@wollybeard/kit'

// OR namespace import from subpath
import * as Err from '@wollybeard/kit/err'
```

## Examples from Kit

### Error Handling (`Err`)

```typescript
// Both forms work identically
import { Err } from '@wollybeard/kit'
import * as Err from '@wollybeard/kit/err'

// Use the API
const error = new Error('Something went wrong')
Err.toString(error)
```

### Testing Utilities (`Test`)

```typescript
// Named import from main package
import { Test } from '@wollybeard/kit'

Test.describe('my test')
  .i<string>()
  .o<boolean>()
  .cases()
  /* ... */
  .test()

// Namespace import from subpath
import * as Test from '@wollybeard/kit/test'

Test.describe('my test')
// ... same API
```

### Numeric Types (`Num`)

```typescript
// Both forms provide the same namespaced API
import { Num } from '@wollybeard/kit'
import * as Num from '@wollybeard/kit/num'

// Access nested namespaces
Num.Positive.from(42)
Num.InRange.from(5, 0, 10)
```

## Comparison with Simple Entrypoints

### Simple Entrypoint

For modules without the drillable pattern, only the subpath import is available:

```typescript
// Only form available
import { someFunction } from '@wollybeard/kit/utilities'
```

The API documentation shows a single import form.

### Drillable Namespace

Modules using the pattern offer both:

```typescript
// Form 1: From main package
import { Module } from '@wollybeard/kit'

// Form 2: From subpath
import * as Module from '@wollybeard/kit/module'
```

The API documentation explicitly shows both forms, helping users choose.

## Best Practices

1. **Use meaningful names**: The namespace name should clearly represent the module's purpose
2. **Keep cohesive**: Only group related functionality under one namespace
3. **Document clearly**: Add JSDoc to the `export * as Name` statement to describe the module
4. **Consistent API**: Ensure all functions use consistent naming and patterns
5. **Avoid deep nesting**: Keep namespace hierarchies shallow (2-3 levels max)

## Migration Guide

To convert an existing module to use the Drillable Namespace Pattern:

1. **Create the file structure** if not already present (`$.ts`, `$$.ts`, implementation)
2. **Add the export pattern** in `$.ts`:
   ```typescript
   export * as ModuleName from './$$.js'
   ```
3. **Update package.json** to expose the subpath
4. **Add JSDoc** to describe the module's purpose
5. **Regenerate documentation** to see both import forms

The pattern is backward compatible - existing subpath imports continue to work.
