# Getting Started

Welcome to **@wollybeard/kit**! This guide will help you get up and running with this comprehensive TypeScript utility library.

## What is Kit?

Kit is a modular TypeScript utility library that provides functional programming utilities and data structure operations. It emphasizes:

- **Type safety** with excellent TypeScript support
- **Consistent APIs** across all modules
- **Functional programming** patterns
- **Tree-shakeable** architecture

## Installation

::: code-group

```bash [pnpm]
pnpm add @wollybeard/kit
```

```bash [npm]
npm install @wollybeard/kit
```

```bash [yarn]
yarn add @wollybeard/kit
```

:::

## Basic Usage

Kit exports all modules as namespaces, making it easy to use specific utilities:

```typescript
// Import specific modules from the main package
import { Arr, Obj, Str } from '@wollybeard/kit'

// Use array utilities
const numbers = [1, 2, 3, 4, 5]
const evens = Arr.filter(numbers, n => n % 2 === 0)
// [2, 4]

// Use object utilities
const user = { id: 1, name: 'Alice', email: 'alice@example.com' }
const publicData = Obj.omit(user, ['email'])
// { id: 1, name: 'Alice' }

// Use string utilities
const title = 'hello world from kit'
const formatted = Str.Case.title(title)
// 'Hello World From Kit'
```

### Alternative Import Forms

Many modules support the [Drillable Namespace Pattern](./drillable-namespace-pattern), which allows you to import from subpaths as well:

```typescript
// Import from main package
import { Err } from '@wollybeard/kit'

// OR import from subpath
import * as Err from '@wollybeard/kit/err'

// Both provide the same API
Err.fromUnknown(new Error('oops'))
```

This gives you flexibility in how you structure your imports based on your project's needs.

## Module Structure

Kit is organized into specialized modules, each focused on a specific domain:

### Data Structures

- `Arr` - Array operations
- `Obj` - Object manipulation
- `Str` - String utilities
- `Rec` - Record operations
- `Tree` - Tree structure operations

### Functional Programming

- `Fn` - Function composition and utilities
- `Prom` - Promise utilities
- `Cache` - Memoization and caching

### Type/Value Operations

- `Bool` - Boolean utilities
- `Num` - Number operations
- `Null` - Null handling
- `Undefined` - Undefined handling
- `Value` - General value utilities

### I/O & External

- `Fs` - File system operations
- `Http` - HTTP utilities
- `Cli` - CLI helpers
- `Url` - URL manipulation

## Currying Pattern

Most functions in Kit support currying with consistent naming:

```typescript
import { Arr } from '@wollybeard/kit'

// Standard function
Arr.map([1, 2, 3], x => x * 2)

// Curried with data first
Arr.mapOn([1, 2, 3])(x => x * 2)

// Curried with function first
Arr.mapWith(x => x * 2)([1, 2, 3])
```

This pattern enables powerful function composition:

```typescript
import { Arr, Fn, Num } from '@wollybeard/kit'

const processNumbers = Fn.pipe(
  Arr.filterWith(Num.isPositive),
  Arr.mapWith(x => x * 2),
  Arr.reduceWith(Num.add, 0),
)

processNumbers([1, -2, 3, -4, 5])
// 18 (sum of doubled positive numbers)
```

## Next Steps

- Learn about [Installation](./installation) options and configuration
- Understand the [Philosophy](./philosophy) behind Kit
- Explore the [Module Structure](./module-structure) in detail
- Learn about the [Drillable Namespace Pattern](./drillable-namespace-pattern) for flexible imports
- Master the [Currying Pattern](./currying) for function composition
- Browse the complete [API Reference](/api/)
