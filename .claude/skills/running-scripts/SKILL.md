---
name: running-scripts
description: How to run scripts in this pnpm + turbo monorepo. Covers turbo task filtering, caching, package-local scripts, and common pitfalls.
---

# Running Scripts

## Key Principle

**Always run from root directory** unless you specifically need package-local behavior. Turbo handles dependencies automatically.

## Common Commands

### Building

```bash
# Build all packages (respects dependency order)
pnpm turbo run build

# Build specific package
pnpm turbo run build --filter=@kouka/core

# Build package and its dependencies
pnpm turbo run build --filter=@kouka/assert...

# Force rebuild (bypass cache)
pnpm turbo run build --filter=@kouka/core --force
```

### Type Checking

```bash
# Type check all packages
pnpm turbo run check:types

# Type check specific package
pnpm turbo run check:types --filter=@kouka/assert
```

### Testing

```bash
# Run tests for specific file (use vitest directly)
pnpm vitest packages/core/src/arr/_.test.ts --run

# Run tests for a package directory
pnpm vitest packages/core/src/arr/ --run

# ALWAYS use --run to avoid watch mode
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

## Turbo Cache

Turbo caches task outputs. If you change source files, it rebuilds. If nothing changed, it replays cached output.

**Cache hit** = "replaying logs" in output (task skipped)

To force fresh run:

```bash
pnpm turbo run build --force
```

Or delete the build folder:

```bash
rm -rf packages/core/build && pnpm turbo run build --filter=@kouka/core
```

## Package-Local Scripts

Some packages have scripts in `scripts/` directories that aren't npm scripts. Run with tsx:

```bash
# Assert package - regenerate builder code
tsx packages/assert/scripts/generate-builder.ts
```

## Common Pitfalls

| Problem                             | Solution                                       |
| ----------------------------------- | ---------------------------------------------- |
| Cache hit when you expected rebuild | Use `--force` or delete `build/` folder        |
| Tests stuck in watch mode           | Always use `--run` flag with vitest            |
| Build order wrong                   | Turbo handles this via `dependsOn: ["^build"]` |

## Task Dependencies (turbo.json)

- `build`: Depends on dependencies being built first (`^build`)
- `check:types`: Depends on dependencies being built first
- `check:package`: Depends on own build completing first
- `test`: Depends on dependencies being built first
