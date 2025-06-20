# Migration Plan: @wollybeard/kit → New Style Guide

## Overview

This migration plan transforms the kit package to use the adapted Local Libraries pattern with `{$, $$, $.test.ts}` structure while making the codebase runnable directly from TypeScript source.

## Step 0: Source Code Runnable Setup

**Goal**: Make the codebase runnable directly from TypeScript source files instead of requiring build step.

### Current Issues:

- Code imports from `#*` paths that resolve to `build/*`
- `.js` extensions in imports that don't match source `.ts` files
- Build-dependent workflow that blocks development iteration

### Step 0 Tasks:

#### 0.1 Update TypeScript Configuration

- Configure `tsconfig.json` for source execution
- Add module resolution for `.ts` files
- Enable source maps for debugging

#### 0.2 Update Package.json Imports

- Change `#*` imports to point to `src/*` instead of `build/*`
- Add TypeScript file extensions support
- Configure for source execution

#### 0.3 Update Import Extensions

- Change all `.js` imports to `.ts` in source files
- Update relative imports to use actual file extensions
- Fix any broken import paths

#### 0.4 Add Development Scripts

- Add `pnpm dev` script for source execution
- Update existing scripts to work with source files
- Add watch mode for development

### Expected Outcome:

- `pnpm dev` runs tests and type checking from source
- No build step required for development
- Faster iteration cycle

### ✅ Status: COMPLETED

- Updated package.json imports to use `src/*` instead of `build/*`
- Enabled `allowImportingTsExtensions` in TypeScript config
- Changed all `.js` imports to `.ts` in source files
- Added `tsx` scripts for source execution
- Simple tests (like `src/eq/type.test.ts`) run successfully from source
- Note: Some complex modules with platform imports may need additional configuration

---

## Adapted Style Guide for Kit

### Directory Structure Pattern:

```
src/
├── exports/           # Exception - main package exports
└── <module-name>/     # Each module follows library pattern
    ├── $.ts          # Namespace export: export * as ModuleName from './$$.ts'
    ├── $$.ts         # Barrel export: export * from './module.ts'
    ├── $.test.ts     # Library tests (import from namespace)
    ├── $.test-d.ts   # Type tests (optional)
    └── *.ts          # Implementation modules
```

### Package.json Imports:

```json
{
  "imports": {
    "#arr": "./src/arr/$.ts",
    "#arr/arr": "./src/arr/$$.ts",
    "#bool": "./src/bool/$.ts",
    "#bool/bool": "./src/bool/$$.ts"
  }
}
```

## Current vs New Structure

### Current Structure:

```
src/arr/
├── arr.ts        # Implementation
└── index.ts      # export * as Arr from './arr.js'
```

### New Structure:

```
src/arr/
├── $.ts          # export * as Arr from './$$.ts'
├── $$.ts         # export * from './arr.ts'
├── $.test.ts     # Test via namespace import
├── $.test-d.ts   # Type tests (if needed)
└── arr.ts        # Implementation (unchanged)
```

## Migration Steps

### ✅ Step 1: Transform Each Module Directory (IN PROGRESS - 17/31 modules complete)

**Completed modules:**

- `arr/` - Migrated to {$, $$, $.test.ts} pattern with 15 comprehensive tests
- `bool/` - Migrated to {$, $$, $.test.ts} pattern with 5 tests covering all exports
- `eq/` - Migrated to {$, $$, $.test.ts} pattern with 12 tests including type guards
- `null/` - Migrated to {$, $$, $.test.ts} pattern with 8 comprehensive type guard tests
- `undefined/` - Migrated to {$, $$, $.test.ts} pattern with 11 tests including filtering
- `value/` - Migrated to {$, $$, $.test.ts} pattern with 13 tests for lazy value handling
- `cache/` - Migrated to {$, $$, $.test.ts} pattern with 7 tests for memoization functionality
- `codec/` - Migrated to {$, $$, $.test.ts} pattern with 11 tests for encoding/decoding
- `url/` - Migrated to {$, $$, $.test.ts} pattern with 12 tests for URL factory pattern
- `fn/` - Migrated to {$, $$, $.test.ts} pattern with 17 tests for functional programming utilities
- `idx/` - Migrated to {$, $$, $.test.ts} pattern with comprehensive indexed collection tests
- `pat/` - Migrated to {$, $$, $.test.ts} pattern with 14 tests for pattern matching including array reference checks
- `ts/` - Migrated supporting module for TypeScript utilities
- `rec/` - Migrated supporting module for record types
- `language/` - Migrated supporting module (basic structure)
- `group/` - Migrated to {$, $$, $.test.ts} pattern with 4 tests for grouping operations
- `prom/` - Migrated to {$, $$, $.test.ts} pattern with 5 tests for promise utilities
- `name/` - Migrated to {$, $$, $.test.ts} pattern with 4 tests for random name generation
- `test/` - Migrated supporting module for test utilities
- (json pending dependencies, tree deferred due to API complexity)

**Notes:**

- Cross-dependencies between migrated and non-migrated modules cause test failures
- Need to migrate dependency chains to resolve import issues
- Some modules depend on non-migrated modules (ts, pat, language, etc.)

**Next Priority:** Migrate dependency modules (ts, pat, language) to unlock remaining tests

**Updated package.json imports:**

- Added specific import paths for migrated modules
- `#arr` → `./src/arr/$.ts` (namespace)
- `#arr/arr` → `./src/arr/$$.ts` (direct)
- Similar patterns for `bool` and `eq`

**Verified working:**

- All tests pass for migrated modules
- Both namespace (`#arr`) and direct (`#arr/arr`) imports work correctly
- Source execution works perfectly

### Step 1: Transform Each Module Directory

For each module in `src/`, apply this transformation:

#### Template Files:

**`src/{module}/$.ts` (Namespace Export):**

```typescript
export * as {ModuleName} from './$$.ts'
```

**`src/{module}/$$.ts` (Barrel Export):**

```typescript
export * from './{module}.ts'
// export * from './other-modules.ts' (if any)
```

**`src/{module}/$.test.ts` (Library Tests):**

```typescript
import { {ModuleName} } from './$.ts'
import { describe, expect, test } from 'vitest'

// No top-level describe for module name
// One describe per exported function

describe('functionName', () => {
  test('basic functionality', () => {
    // Test via namespace
    expect({ModuleName}.functionName(input)).toBe(expected)
  })
})
```

### Step 2: Module-by-Module Migration

#### Simple Modules (Single Implementation File):

- `arr/`, `bool/`, `eq/`, `null/`, `undefined/`, `value/`, `url/`

**Example - arr module:**

```typescript
// src/arr/$.ts
export * as Arr from './$$.ts'

// src/arr/$$.ts
export * from './arr.ts'

// src/arr/$.test.ts
import { describe, expect, test } from 'vitest'
import { Arr } from './$.ts'

describe('is', () => {
  test('returns true for arrays', () => {
    expect(Arr.is([])).toBe(true)
  })
})

describe('create', () => {
  test('creates empty array', () => {
    expect(Arr.create()).toEqual([])
  })
})

// ... one describe per exported function

// Delete: src/arr/index.ts (no longer needed)
```

#### Complex Modules (Multiple Implementation Files):

- `str/`, `err/`, `fs/`, `http/`, `obj/`, `cli/`

**Example - str module:**

```typescript
// src/str/$.ts
export * as Str from './$$.ts'

// src/str/$$.ts
export * from './builder.ts'
export * from './case/index.ts' // Keep existing sub-modules
export * from './char/index.ts'
export * from './match.ts'
export * from './misc.ts'
export * from './replace.ts'
export * from './split.ts'
export * from './table.ts'
export * from './template.ts'
export * from './text.ts'
export * from './type.ts'

// src/str/$.test.ts
import { describe, expect, test } from 'vitest'
import { Str } from './$.ts'

describe('Builder', () => {
  test('creates string builder', () => {
    const builder = Str.Builder()
    builder('line 1')
    expect(builder.render()).toBe('line 1')
  })
})

// ... keep individual module tests for complex internals:
// src/str/builder.test.ts (keep existing)
// src/str/match.test-d.ts (keep existing)

// Delete: src/str/index.ts
```

### Step 3: Update Package.json

#### New Imports Section:

```json
{
  "imports": {
    "#arr": "./src/arr/$.ts",
    "#arr/arr": "./src/arr/$$.ts",
    "#bool": "./src/bool/$.ts",
    "#bool/bool": "./src/bool/$$.ts",
    "#cache": "./src/cache/$.ts",
    "#cache/cache": "./src/cache/$$.ts",
    "#cli": "./src/cli/$.ts",
    "#cli/cli": "./src/cli/$$.ts",
    "#codec": "./src/codec/$.ts",
    "#codec/codec": "./src/codec/$$.ts",
    "#debug": "./src/debug/$.ts",
    "#debug/debug": "./src/debug/$$.ts",
    "#eq": "./src/eq/$.ts",
    "#eq/eq": "./src/eq/$$.ts",
    "#err": "./src/err/$.ts",
    "#err/err": "./src/err/$$.ts",
    "#fn": "./src/fn/$.ts",
    "#fn/fn": "./src/fn/$$.ts",
    "#fs": "./src/fs/$.ts",
    "#fs/fs": "./src/fs/$$.ts",
    "#fs-layout": "./src/fs-layout/$.ts",
    "#fs-layout/fs-layout": "./src/fs-layout/$$.ts",
    "#fs-relative": "./src/fs-relative/$.ts",
    "#fs-relative/fs-relative": "./src/fs-relative/$$.ts",
    "#group": "./src/group/$.ts",
    "#group/group": "./src/group/$$.ts",
    "#http": "./src/http/$.ts",
    "#http/http": "./src/http/$$.ts",
    "#idx": "./src/idx/$.ts",
    "#idx/idx": "./src/idx/$$.ts",
    "#json": "./src/json/$.ts",
    "#json/json": "./src/json/$$.ts",
    "#language": "./src/language/$.ts",
    "#language/language": "./src/language/$$.ts",
    "#manifest": "./src/manifest/$.ts",
    "#manifest/manifest": "./src/manifest/$$.ts",
    "#name": "./src/name/$.ts",
    "#name/name": "./src/name/$$.ts",
    "#null": "./src/null/$.ts",
    "#null/null": "./src/null/$$.ts",
    "#obj": "./src/obj/$.ts",
    "#obj/obj": "./src/obj/$$.ts",
    "#package-manager": "./src/package-manager/$.ts",
    "#package-manager/package-manager": "./src/package-manager/$$.ts",
    "#pat": "./src/pat/$.ts",
    "#pat/pat": "./src/pat/$$.ts",
    "#path": "./src/path/$.ts",
    "#path/path": "./src/path/$$.ts",
    "#prom": "./src/prom/$.ts",
    "#prom/prom": "./src/prom/$$.ts",
    "#rec": "./src/rec/$.ts",
    "#rec/rec": "./src/rec/$$.ts",
    "#resource": "./src/resource/$.ts",
    "#resource/resource": "./src/resource/$$.ts",
    "#str": "./src/str/$.ts",
    "#str/str": "./src/str/$$.ts",
    "#test": "./src/test/$.ts",
    "#test/test": "./src/test/$$.ts",
    "#tree": "./src/tree/$.ts",
    "#tree/tree": "./src/tree/$$.ts",
    "#ts": "./src/ts/$.ts",
    "#ts/ts": "./src/ts/$$.ts",
    "#undefined": "./src/undefined/$.ts",
    "#undefined/undefined": "./src/undefined/$$.ts",
    "#url": "./src/url/$.ts",
    "#url/url": "./src/url/$$.ts",
    "#value": "./src/value/$.ts",
    "#value/value": "./src/value/$$.ts",
    "#zod-aid": "./src/zod-aid/$.ts",
    "#zod-aid/zod-aid": "./src/zod-aid/$$.ts"
  }
}
```

#### New Exports Section:

```json
{
  "exports": {
    ".": "./build/exports/index.js",
    "./arr": "./build/arr/$.js",
    "./bool": "./build/bool/$.js",
    "./cache": "./build/cache/$.js",
    "./cli": "./build/cli/$.js",
    "./codec": "./build/codec/$.js",
    "./debug": "./build/debug/$.js",
    "./eq": "./build/eq/$.js",
    "./err": "./build/err/$.js",
    "./fn": "./build/fn/$.js",
    "./fs": "./build/fs/$.js",
    "./fs-layout": "./build/fs-layout/$.js",
    "./fs-relative": "./build/fs-relative/$.js",
    "./group": "./build/group/$.js",
    "./http": "./build/http/$.js",
    "./idx": "./build/idx/$.js",
    "./json": "./build/json/$.js",
    "./language": "./build/language/$.js",
    "./manifest": "./build/manifest/$.js",
    "./name": "./build/name/$.js",
    "./null": "./build/null/$.js",
    "./obj": "./build/obj/$.js",
    "./package-manager": "./build/package-manager/$.js",
    "./pat": "./build/pat/$.js",
    "./path": "./build/path/$.js",
    "./prom": "./build/prom/$.js",
    "./rec": "./build/rec/$.js",
    "./resource": "./build/resource/$.js",
    "./str": "./build/str/$.js",
    "./test": "./build/test/$.js",
    "./tree": "./build/tree/$.js",
    "./ts": "./build/ts/$.js",
    "./undefined": "./build/undefined/$.js",
    "./url": "./build/url/$.js",
    "./value": "./build/value/$.js",
    "./zod-aid": "./build/zod-aid/$.js"
  }
}
```

### Step 4: Update Internal Imports

Transform all internal imports to use new paths:

```typescript
// Current
import { Arr } from '#arr/index.js'
import { Obj } from '#obj/index.js'

// New
import { Arr } from '#arr'
import { Obj } from '#obj'

// Or direct imports
import { map } from '#arr/arr'
import { merge } from '#obj/obj'
```

### Step 5: Testing Migration

#### Move Existing Tests:

- **Simple modules**: Move all tests to `$.test.ts`
- **Complex modules**: Keep `[module].test.ts` for internal testing, add `$.test.ts` for public API

#### Update Test Imports:

```typescript
// Current
import * as Arr from './arr.ts'

// New
import { Arr } from './$.ts'
```

## Migration Schedule

### Week 1: Foundation (Step 0 + Setup)

- [ ] **Step 0**: Make codebase source-runnable
- [ ] Update package.json imports/exports for source execution
- [ ] Migrate 3 simple modules: `arr`, `bool`, `eq`
- [ ] Verify build and import paths work

### Week 2: Core Modules

- [ ] Migrate: `str`, `obj`, `err`, `fn`
- [ ] Update cross-references
- [ ] Test public APIs

### Week 3: Utility Modules

- [ ] Migrate: `json`, `codec`, `value`, `url`, `null`, `undefined`
- [ ] Update internal imports

### Week 4: Complex Modules

- [ ] Migrate: `fs`, `http`, `cli`, `manifest`
- [ ] Handle multi-file modules carefully

### Week 5: Remaining Modules

- [ ] Migrate: `debug`, `cache`, `test`, `tree`, `ts`, `zod-aid`
- [ ] Final import updates

### Week 6: Cleanup

- [ ] Remove all `index.ts` files
- [ ] Final testing and verification
- [ ] Update any documentation

## Benefits

1. **Consistent Pattern**: Every module follows `{$, $$, $.test.ts}` pattern
2. **Better Imports**: `import { Arr } from '#arr'` vs `import { Arr } from '#arr/index.js'`
3. **Direct Access**: `import { map } from '#arr/arr'` for tree-shaking
4. **Focused Testing**: One test file per module testing public API
5. **Source Runnable**: No build step required for development
6. **Future Ready**: Prepared for potential module extraction

## Risk Mitigation

1. **Incremental**: Migrate 3-5 modules at a time
2. **Verification**: Test each batch before proceeding
3. **Rollback Plan**: Keep git history clean for easy rollback
4. **Build Testing**: Verify exports work after each batch
5. **Source First**: Step 0 ensures development workflow isn't broken

This migration maintains the same benefits while being specifically adapted for the kit package structure and enabling source-first development.
