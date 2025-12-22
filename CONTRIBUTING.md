# Contributing

This project is designed for Claude Code-assisted development. Common workflows are automated through skills.

## Skills

| Skill | Purpose |
|-------|---------|
| `running-scripts` | Turbo commands, caching, and test execution |
| `creating-packages` | Create new packages with full scaffolding |
| `creating-modules` | Add modules to existing packages |
| `implementing-functions` | Function design with currying patterns |
| `writing-tests` | Test patterns and organization |
| `committing-changes` | Conventional commits and changesets |
| `authoring-global-scripts` | Manage `_:*` template scripts |
| `syncing-tsconfig-paths` | Keep tsconfig paths in sync with imports |
| `refreshing-docs` | Update README tables |
| `auditing-project` | Check for out-of-band inconsistencies |

Just describe what you need and Claude Code will handle it.

## Architecture

Kit is a pnpm workspace monorepo with packages under `packages/`. All packages are scoped under `@kouka/` except the `kouka` aggregator-package.

**Build system**: Turbo + tsgo (TypeScript Go port)

```bash
pnpm turbo run build                        # All packages
pnpm turbo run build --filter=@kouka/core   # Single package
```

**Cross-package dependencies**: Use `workspace:*` and import by package name. Note that `#` imports are scoped per-package - cross-package `#` imports are not valid.

## Common Errors

### TS2742: Inferred Type Cannot Be Named

```
error TS2742: The inferred type of 'X' cannot be named without a reference to
'../node_modules/@kouka/core/build/optic/lenses/returned.js'.
```

**Cause**: TypeScript cannot find a "portable" path to reference an inferred type during declaration emit. This happens when types are re-exported through ESM namespaces (`export * as X from`).

**Solution**: Add internal subpath exports to package.json and empty type imports in the library's public barrel:

```json
// package.json
{
  "exports": {
    "./_internal/optic-lenses/returned": "./build/optic/lenses/returned.js"
  }
}
```

```typescript
// In the library's source file
import type {} from '@kouka/core/_internal/optic-lenses/returned'
```

See [TypeScript Issue #61700](https://github.com/microsoft/TypeScript/issues/61700) for full explanation.
