# Layered Import Architecture Checker

This script enforces a layered architecture to prevent circular dependencies while allowing controlled cross-module imports.

## Definitions

| Term            | Definition                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| Core Module     | Module with zero non-core dependencies. Located in `<namespace>/core/*.ts`, exported via `#<namespace>/core`. |
| Standard Module | Regular module building on cores, may cross-reference other namespaces.                                       |
| Barrel File     | Re-export file (`$$.ts` or `$.ts`) providing public API surface.                                              |
| Namespace       | Logical grouping of related modules (e.g., `fn`, `str`, `obj`).                                               |
| Subpath Import  | Package import using subpath pattern (e.g., `#fn/core`) that bypasses the main barrel.                        |
| External Core   | A core module from a different namespace (e.g., `#str/core` is external to `fn/core`).                        |

## Rules

**Core Modules** (`<namespace>/core/*.ts`):

- Zero dependencies on non-core internal modules
- Import other cores via `#namespace/core` subpath
- Import same-namespace core siblings via relative paths: `./curry.js`
- Never import full namespace (`#fn` ❌, use `#fn/core` ✅)

**Standard Modules**:

- Import cores via `#namespace/core` subpath
- Import namespaces via `#namespace` for non-core utilities
- Never import own namespace barrel

**Custom DAG Constraints** (Core-to-Core):

- `fn/core`: Can only import `lang/core` (allowed exception for type guards and language primitives)

## Examples

```typescript
// ✅ Core importing external core via subpath
import { CoreFn } from '#fn/core'

// ✅ Core importing same-namespace sibling via relative
import { curry } from './curry.js'

// ✅ Standard importing from other namespace
import { Str } from '#str'

// ❌ Core importing full namespace
import { Str } from '#str'

// ❌ Standard importing own namespace barrel
import { Str } from '#str' // in str/replace.ts

// ❌ fn/core importing external core (except lang/core)
import { CoreStr } from '#str/core' // in fn/core/curry.ts

// ✅ fn/core importing lang/core (allowed exception)
import { Lang } from '#lang/core' // in fn/core/base.ts
```

## Rationale

**Subpath Imports**: Bypass the main barrel file to prevent circular dependencies through re-export chains. Module evaluation order becomes predictable.

**Core Layer**: Foundational utilities needed across modules. Without it, `str/replace` needs `curry` from `fn`, `fn/analyze` needs `split` from `str` → cycle. With cores: `str` → `fn/core` (✓), `fn` → `str` (✓).

**Relative Imports Within Core**: Same-layer, same-namespace boundary. No hierarchy violation.

## Module-Level Side Effects

Avoid module-level side effects - they execute during module loading and are fragile with complex barrel import chains.

```typescript
// ❌ BAD
const padding = repeatOn(Char.spaceNoBreak) // Executes at module load
export const table = (data) => gap = padding(size)

// ✅ GOOD
export const table = (data) => {
  const padding = repeatOn(Char.spaceNoBreak) // Lazy
  const gap = padding(size)
}
```

## Implementation Status

This script currently serves as **documentation only**. The validation logic will be implemented in a future iteration using:

- Madge API for dependency graph analysis
- ts-morph or TypeScript Compiler API for import statement parsing
- Custom rule validation based on the architecture defined above
