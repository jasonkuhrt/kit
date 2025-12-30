# Contributing

This project is designed for Claude Code-assisted development. Common workflows are automated through skills.

## Skills

| Skill                      | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `running-scripts`          | Turbo commands, caching, and test execution     |
| `creating-packages`        | Create new packages with full scaffolding       |
| `creating-modules`         | Add modules to existing packages                |
| `implementing-functions`   | Function design with currying patterns          |
| `writing-tests`            | Test patterns and organization                  |
| `committing-changes`       | Conventional commits and CI validation          |
| `authoring-global-scripts` | Manage `_:*` template scripts                   |
| `syncing-tsconfig-paths`   | Keep tsconfig paths in sync with imports        |
| `refreshing-docs`          | Update README tables                            |
| `auditing-project`         | Check for out-of-band inconsistencies           |
| `using-effect-schema`      | Effect Schema classes and conventions           |
| `using-effect-match`       | Pattern matching with Effect Match              |
| `using-lookup-tables`      | Type-safe lookup tables for tag-to-value maps   |
| `using-string-builder`     | Multi-line string construction with Str.Builder |
| `organizing-services`      | Effect services with multiple implementations   |

Just describe what you need and Claude Code will handle it.

## Architecture

Kitz is a pnpm workspace monorepo with packages under `packages/`. All packages are scoped under `@kitz/` except the `kitz` aggregator-package.

**Build system**: Turbo + tsgo (TypeScript Go port)

```bash
pnpm turbo run build                        # All packages
pnpm turbo run build --filter=@kitz/core   # Single package
```

**Cross-package dependencies**: Use `workspace:*` and import by package name. Note that `#` imports are scoped per-package - cross-package `#` imports are not valid.

## Common Errors

### TS2742: Inferred Type Cannot Be Named

```
error TS2742: The inferred type of 'X' cannot be named without a reference to
'../node_modules/@kitz/core/build/optic/lenses/returned.js'.
```

**Cause**: TypeScript declaration emit cannot do novel module resolution - it only uses specifiers resolved during program creation. When types are re-exported through ESM namespaces (`export * as X from`), TypeScript cannot discover a portable path to reference those types.

**Solution**: Library-side fix in `@kitz/core` (no consumer action needed):

1. Add internal subpath exports to `package.json`:

```json
{
  "exports": {
    "./_internal/optic-lenses/returned": "./build/optic/lenses/returned.js"
  }
}
```

2. In the library's barrel file, import and USE the internal modules in an exported type:

```typescript
// In @kitz/core/src/optic/__.ts
import type * as __returned from '@kitz/core/_internal/optic-lenses/returned'

/**
 * @internal DO NOT USE - Forces TypeScript to include internal module references
 * in declaration output. Required for consumer type inference.
 */
export type __InternalLensResolution = __returned.Get<never> | ...
```

**Key insight**: Empty imports (`import type {} from '...'`) and unused namespace imports get elided from `.d.ts` output. You must USE the imports in an exported type to preserve them in declarations.

See [TypeScript Issue #61700](https://github.com/microsoft/TypeScript/issues/61700) for full explanation.
