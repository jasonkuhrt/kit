# Installation

## Requirements

- **Node.js** 18.0 or higher
- **TypeScript** 5.0 or higher (for TypeScript projects)
- **ESM** module support

## Package Manager

Kit can be installed using any Node.js package manager:

::: code-group

```bash [pnpm (recommended)]
pnpm add @wollybeard/kit
```

```bash [npm]
npm install @wollybeard/kit
```

```bash [yarn]
yarn add @wollybeard/kit
```

:::

## TypeScript Configuration

Kit is written in TypeScript and provides full type definitions. For the best experience, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    // Required for ESM
    "module": "ESNext",
    "moduleResolution": "bundler", // or "node" with proper config

    // Recommended for type safety
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,

    // For better inference
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## ESM Usage

Kit is an ESM-only package. Ensure your project is configured for ESM:

### Package.json

```json
{
  "type": "module"
}
```

### Import Syntax

```typescript
// ✅ ESM imports
import { Arr, Obj, Str } from '@wollybeard/kit'

// ❌ CommonJS require (not supported)
const { Arr } = require('@wollybeard/kit')
```

## Module Imports

Kit provides multiple ways to import modules:

### Namespace Imports (Recommended)

```typescript
// Import complete namespaces
import { Arr, Num, Obj, Str } from '@wollybeard/kit'

// Use via namespace
const doubled = Arr.map([1, 2, 3], x => x * 2)
const picked = Obj.pick({ a: 1, b: 2 }, ['a'])
```

### Direct Module Imports

```typescript
// Import specific functions from a module
import { filter, map, reduce } from '@wollybeard/kit/arr'
import { merge, omit, pick } from '@wollybeard/kit/obj'

// Use directly
const doubled = map([1, 2, 3], x => x * 2)
```

### Individual Function Imports

For maximum tree-shaking:

```typescript
// Import individual functions
import { map } from '@wollybeard/kit/arr'
import { pick } from '@wollybeard/kit/obj'
```

## Bundle Size Optimization

Kit is designed to be tree-shakeable. Modern bundlers will only include the code you actually use:

```typescript
// Only imports the 'map' function
import { Arr } from '@wollybeard/kit'
const result = Arr.map([1, 2, 3], x => x * 2)
```

### Bundler Configuration

For optimal tree-shaking with various bundlers:

::: code-group

```javascript [Vite]
// vite.config.js
export default {
  build: {
    rollupOptions: {
      // Rollup handles tree-shaking automatically
    },
  },
}
```

```javascript [Webpack]
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
}
```

```javascript [esbuild]
// build.js
require('esbuild').build({
  treeShaking: true,
  // esbuild handles ESM tree-shaking by default
})
```

:::

## Development Setup

For contributing or local development:

```bash
# Clone the repository
git clone https://github.com/jasonkuhrt/kit.git
cd kit

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Run type checking
pnpm check:types
```

## Troubleshooting

### ESM Import Errors

If you encounter ESM import errors:

1. Ensure your project has `"type": "module"` in package.json
2. Use `.js` extensions in relative imports
3. Check your Node.js version (18+ required)

### TypeScript Errors

If TypeScript can't find the types:

1. Check `moduleResolution` in tsconfig.json
2. Ensure TypeScript version is 5.0+
3. Try restarting your TypeScript language server

### Bundle Size Issues

If your bundle includes more than expected:

1. Check that your bundler supports tree-shaking
2. Ensure you're importing from specific modules
3. Verify `sideEffects: false` is respected by your bundler
