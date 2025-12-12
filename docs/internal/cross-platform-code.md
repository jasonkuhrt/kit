# Cross-Platform Code Guide

This document explains how kit handles code that needs to run differently across JavaScript runtimes (Node.js, Bun, Deno, Browser).

## Overview

Kit uses **conditional exports** in `package.json` to load different implementations based on the runtime. This is the standard mechanism defined by Node.js and supported by all major runtimes and bundlers.

## How Conditional Exports Work

### Runtime Default Conditions

Each runtime activates specific **conditions** when resolving imports:

| Runtime | Default Active Conditions | Documentation |
|---------|---------------------------|---------------|
| **Node.js** | `["node", "import"]` (ESM) or `["node", "require"]` (CJS) | [Node.js Packages Docs](https://nodejs.org/api/packages.html#conditional-exports) |
| **Bun** | `["bun", "node", "import"/"require", "default"]` | [Bun Module Resolution](https://bun.com/docs/runtime/module-resolution) |
| **Deno** | `["deno", "node", "import"]` | [Deno Node Compatibility](https://docs.deno.com/runtime/fundamentals/node/) |
| **Bundlers** (Vite, webpack, esbuild) | `["browser", ...]` when targeting browser | Varies by bundler |

### Key Points

1. **Order matters** - Earlier conditions take precedence. Put specific conditions (`deno`, `bun`) before generic ones (`node`, `default`).

2. **`default` is the fallback** - Always matches if no other condition does. Use for Node.js since it doesn't activate `"node"` for subpath imports.

3. **`browser` is bundler-only** - Runtimes (Node/Bun/Deno) don't activate `browser`. Only bundlers do when building for browser target.

4. **Conditions are arbitrary strings** - You can define any condition, but it only works if the runtime/tool activates it.

## Implementation Pattern

### package.json Configuration

```json
{
  "imports": {
    "#platform:modulename/*": {
      "deno": "./build/modulename/*.deno.js",
      "bun": "./build/modulename/*.bun.js",
      "browser": "./build/modulename/*.browser.js",
      "default": "./build/modulename/*.node.js"
    }
  }
}
```

### File Naming Convention

```
src/modulename/
├── live.node.ts      # Node.js implementation (also fallback)
├── live.bun.ts       # Bun-specific implementation
├── live.deno.ts      # Deno-specific implementation
├── live.browser.ts   # Browser implementation
└── __.ts             # Barrel file that imports from #platform:modulename/live
```

### Barrel File Usage

```typescript
// __.ts - imports resolve to correct platform file automatically
export * from '#platform:modulename/live'
export * from './shared-code.js'
```

## Typing Runtime Globals

When using runtime-specific globals (like `Deno.*` or `Bun.*`), declare minimal local types instead of installing full type packages:

```typescript
// live.deno.ts

/**
 * Minimal Deno global type declarations for APIs used in this module.
 * @see https://docs.deno.com/api/deno/
 */
declare namespace Deno {
  export function cwd(): string
  export const args: string[]
  export const env: {
    toObject(): Record<string, string>
  }
  export const build: {
    os: string
    arch: string
  }
  export function exit(code?: number): never
}

// ... rest of implementation
```

**Why local declarations?**
- Self-contained, no extra dependencies
- Only declares APIs actually used
- Avoids potential conflicts between runtime type packages
- Clear documentation of which APIs the module depends on

## Runtime-Specific APIs Reference

### Node.js
- `process.cwd()` - Current working directory
- `process.argv` - Command line arguments
- `process.env` - Environment variables
- `process.platform` / `process.arch` - OS and architecture
- `process.exit()` - Exit process

Documentation: https://nodejs.org/api/process.html

### Bun
- `process.*` - Full Node.js compatibility
- `Bun.env` - Environment variables (alternative to process.env)
- `Bun.argv` - Raw args including Bun flags (prefer `process.argv` for scripts)

Documentation: https://bun.sh/docs/runtime/environment-variables

### Deno
- `Deno.cwd()` - Current working directory
- `Deno.args` - Command line arguments (doesn't include executable)
- `Deno.env.get()` / `Deno.env.toObject()` - Environment variables
- `Deno.build.os` / `Deno.build.arch` - OS and architecture
- `Deno.exit()` - Exit process

Documentation: https://docs.deno.com/api/deno/

### Browser
- No direct equivalents for most process APIs
- Provide sensible defaults or throw errors

## Example: Env Module

See `src/env/` for a complete example:

- `live.node.ts` - Uses `process.*` APIs
- `live.bun.ts` - Uses `Bun.env`, rest via `process.*`
- `live.deno.ts` - Uses native `Deno.*` APIs
- `live.browser.ts` - Provides defaults/stubs

## Testing Cross-Platform Code

Cross-platform files are only type-checked, not runtime-tested in other runtimes. The type system ensures API compatibility.

To actually test in other runtimes:
```bash
# Test in Bun
bun test

# Test in Deno
deno test
```

## Adding New Platform-Specific Code

1. Create implementation files with `.node.ts`, `.bun.ts`, `.deno.ts`, `.browser.ts` suffixes
2. Add conditional export mapping in `package.json` under `"imports"`
3. Import via the `#platform:` prefix in your barrel file
4. Add minimal type declarations for runtime-specific globals
5. Document the APIs used with `@see` JSDoc links

## References

- [Node.js Conditional Exports](https://nodejs.org/api/packages.html#conditional-exports)
- [Bun Module Resolution](https://bun.com/docs/runtime/module-resolution)
- [Deno Node Compatibility](https://docs.deno.com/runtime/fundamentals/node/)
- [Deno Conditional Exports Discussion](https://github.com/denoland/deno/discussions/17964)
- [Package.json Exports Guide](https://hirok.io/posts/package-json-exports)
