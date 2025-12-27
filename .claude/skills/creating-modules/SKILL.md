---
name: creating-modules
description: Creates new modules within existing packages following project conventions. Handles file structure, barrel exports, namespace files, package.json imports/exports, and internal import patterns.
---

# Creating Modules

## Steps

1. **Create module directory**: `packages/<pkg>/src/<module-name>/`

2. **Create implementation files**: `<module-name>.ts` or split across multiple files

3. **Create barrel file** `__.ts`:
   ```typescript
   export * from './implementation.js'
   export type * from './types.js'
   ```

4. **Create namespace file** `_.ts`:
   ```typescript
   export * as ModuleName from './__.js'
   ```

5. **Add to package.json imports**:
   ```json
   {
     "imports": {
       "#module-name": "./build/module-name/_.js",
       "#module-name/*": "./build/module-name/*.js"
     }
   }
   ```

6. **Add to package.json exports**:
   ```json
   {
     "exports": {
       "./module-name": "./build/module-name/__.js"
     }
   }
   ```

7. **Sync tsconfig paths** (run `syncing-tsconfig-paths` skill script)

8. **Add to main exports** in `src/index.ts`:
   ```typescript
   export * from '#module-name'
   ```

## Reference

### Module Structure

```
src/module-name/
├── _.ts              # Namespace file - exports the namespace
├── _.test.ts         # Module tests
├── __.ts             # Barrel file - exports all functions/types
└── *.ts              # Implementation files
```

### Import System

**Within a package** - use `#` imports:

```typescript
// ✅ Correct - use # imports internally
import { Fn } from '#fn'
import { Obj } from '#obj'

// ❌ Incorrect - don't use relative or package imports internally
import { Obj } from '@kitz/core/obj'
import { Fn } from '../fn/_.js'
```

**Cross-package imports** - ALWAYS use namespace (root path), never barrel (`/__`):

```typescript
// ✅ Correct - namespace import from root
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Fs } from '@kitz/fs'

// ❌ Incorrect - barrel imports
import { Git } from '@kitz/git/__'
import * as Semver from '@kitz/semver/__'
import { Path } from '@kitz/fs/__'
```

Access members via the namespace (e.g., `Git.Git`, `Git.GitError`, `Semver.fromString()`).

**Exception**: The `kitz` aggregator package re-exports barrels to compose the umbrella package.

### Naming

- **Directory**: kebab-case (`group-by/`)
- **Namespace export**: PascalCase (`GroupBy`)
- **Functions**: camelCase, no namespace prefix (`by`, not `groupBy`)

## Notes

- Each package defines its own `#` imports in package.json
- Cross-package `#` imports are not valid - use package name imports
