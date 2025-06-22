# Namespace as Interface Implementation

## Problem

Can we use TypeScript namespace imports to satisfy trait interfaces? This would allow automatic verification that modules implement traits correctly.

## Test Results

✅ **It works!** Namespace imports can satisfy interfaces:

```typescript
// foo.ts
export const a = 1

// bar.ts
import * as Foo from './foo.ts'
interface Blah {
  a: number
}
const fooBlah: Blah = Foo // ✅ Type checks successfully
```

TypeScript properly catches missing properties:

```typescript
interface BlahWithMissing {
  a: number
  b: string // Missing from Foo
}
const shouldFail: BlahWithMissing = Foo // ❌ Correctly fails
// Error: Property 'b' is missing in type 'typeof import("foo")'
// but required in type 'BlahWithMissing'
```

## Benefits for Kit

1. **Compile-time trait verification**
   ```typescript
   interface RangeOps {
     diff: (a: any, b: any) => any[]
     contains: (range: any, value: any) => boolean
   }

   import * as NumRange from '../num/range/traits/range.js'
   const _typeCheck: RangeOps = NumRange // Automatic verification!
   ```

2. **Direct namespace registration**
   ```typescript
   registerTrait('Range', 'NumRange', NumRange) // No wrapper needed
   ```

3. **Automatic consistency across codebase**

## Downsides

### 1. Interface Pollution

```typescript
// Module might have internal exports
export const diff = (a, b) => {/* trait method */}
export const _internalHelper = () => {/* not part of trait! */}

// But namespace satisfies interface anyway (only checks minimum properties)
const ops: RangeOps = NumRange // ✅ Passes, includes extra stuff
```

### 2. Implementation Leakage

```typescript
registerTrait('Range', 'NumRange', NumRange)
const impl = getTrait('Range', 'NumRange')
impl._internalHelper() // Oops! Accessing internals through trait
```

### 3. Naming Conflicts

```typescript
export const contains = (range, value) => boolean // Trait method
export const toString = () => 'custom' // Conflicts with Object.prototype
```

### 4. Versioning Brittleness

Interface evolution becomes harder when namespaces must satisfy multiple versions.

### 5. Loss of Explicit Contract

```typescript
// With namespace, intent is unclear
export const diff = (a, b) => {/* for traits? direct use? both? */}
```

## Solution: Clean Trait Exports

To manage the downsides, we'll use a new file structure pattern:

```
/src/<domain>/
  ├── $.ts              # Namespace export
  ├── $$.ts             # Barrel export + trait re-exports
  ├── traits/
  │   ├── <trait>.ts    # Clean trait implementation
  │   └── <trait>.test.ts # Trait-specific tests
  └── ...               # Other implementation files
```

### Pattern Details

1. **Clean trait exports** in `traits/<trait>.ts`:
   ```typescript
   // src/num/traits/range.ts
   export { contains, diff, union } from '../range/index.js'
   // Only exports what the trait needs - no internals
   ```

2. **Barrel file re-exports** in `$$.ts`:
   ```typescript
   // src/num/$$.ts
   export * from './range/index.js' // Direct usage
   export * from './traits/range.js' // Trait usage (same names, clean interface)
   ```

3. **Compile-time verification**:
   ```typescript
   import * as NumRangeTrait from './traits/range.js'
   const _verify: RangeOps = NumRangeTrait // Clean interface check
   ```

## Proposed Directory Restructure

Moving forward, consider organizing by category:

```
src/
├── traits/
│   └── <trait>/          # Cross-cutting interfaces
├── domains/
│   └── <domain>/         # Data type focused modules  
└── utilities/
    └── <utility>/        # Function-focused modules
```

This would make the distinction between traits, domains, and utilities more explicit.

## Decision

✅ **Use namespace as interface** approach because:

1. Compile-time verification is extremely valuable for Kit's consistency
2. Downsides are manageable with proper file structure
3. Benefits outweigh the complexity for internal Kit development
4. Most issues won't affect Kit's core development workflow

The new trait export pattern provides the safety net needed to keep this approach clean and maintainable.
