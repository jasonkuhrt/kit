# Philosophy

Kit is built on a set of core principles that guide its design and implementation. Understanding these principles will help you make the most of the library.

## Core Principles

### 1. Type Safety First

TypeScript isn't an afterthought—it's the foundation. Every API is designed to provide:

- **Maximum type inference** - You shouldn't need to annotate types manually
- **Compile-time guarantees** - Catch errors before runtime
- **Type predicates** - Narrow types safely and expressively

```typescript
// The compiler knows 'filtered' only contains positive numbers
const numbers = [1, -2, 3, -4, 5]
const filtered = Arr.filter(numbers, Num.isPositive)
// Type: number[] (but guaranteed positive at runtime)
```

### 2. Functional Programming

Kit embraces functional programming without being dogmatic:

- **Immutability** - All operations return new values
- **Pure functions** - No side effects or hidden state
- **Composition** - Build complex operations from simple ones

```typescript
// Compose operations naturally
const processData = Fn.pipe(
  Arr.filterWith(Num.isPositive),
  Arr.mapWith(x => x * 2),
  Arr.reduceWith(Num.add, 0),
)
```

### 3. Consistent APIs

Learn once, apply everywhere. All modules follow the same patterns:

- **Predictable naming** - Similar operations have similar names
- **Currying conventions** - `*With` and `*On` variants everywhere
- **Universal operations** - `map`, `filter`, `reduce` work similarly across modules

```typescript
// Same patterns across different modules
Arr.map(array, fn) // Transform array elements
Obj.map(object, fn) // Transform object values
Prom.map(promise, fn) // Transform promise result
Tree.map(tree, fn) // Transform tree nodes
```

### 4. No Magic

Explicit is better than implicit:

- **No monkey patching** - No modifications to built-in prototypes
- **No global state** - Each operation is self-contained
- **Clear data flow** - You can trace how data transforms

```typescript
// You always know what's happening
const result = Str.pipe(
  'hello world',
  Str.trim,
  Str.Case.title,
  s => s + '!',
)
// "Hello World!"
```

### 5. Modular Architecture

Use only what you need:

- **Tree-shakeable** - Unused code is eliminated
- **Independent modules** - No unnecessary dependencies
- **Focused APIs** - Each module does one thing well

```typescript
// Import only what you need
import { map } from '@wollybeard/kit/arr'
// Only the map function is included in your bundle
```

## Design Decisions

### Why Namespaces?

Kit uses namespace exports (e.g., `Arr.map`) instead of prefixed functions (e.g., `arrMap`) for several reasons:

1. **Better IntelliSense** - Type `Arr.` and see all array operations
2. **Cleaner imports** - Import one namespace vs many functions
3. **Logical grouping** - Related functions stay together
4. **Avoid naming conflicts** - No collision with your own `map` function

### Why Currying?

Currying enables powerful composition patterns:

```typescript
// Without currying - harder to compose
const doublePositive = (arr) => arr.filter(x => x > 0).map(x => x * 2)

// With currying - composable and reusable
const doublePositive = Fn.pipe(
  Arr.filterWith(Num.isPositive),
  Arr.mapWith(x => x * 2),
)

// Reuse the building blocks
const tripleNegative = Fn.pipe(
  Arr.filterWith(Num.isNegative),
  Arr.mapWith(x => x * 3),
)
```

### Why ESM Only?

ES Modules are the standard:

1. **Better tree-shaking** - Smaller bundles
2. **Static analysis** - Better tooling support
3. **Future-proof** - The JavaScript standard
4. **Cleaner syntax** - No require/exports confusion

## Comparison with Other Libraries

### vs Lodash

- **Type safety**: Kit is TypeScript-first, Lodash added types later
- **Tree-shaking**: Kit's modular design vs Lodash's monolithic approach
- **Modern APIs**: Kit uses modern JavaScript features
- **Functional focus**: Kit provides better composition tools

### vs Ramda

- **Type inference**: Kit's types are more pragmatic and inference-friendly
- **Learning curve**: Kit's familiar patterns vs Ramda's strict FP approach
- **Performance**: Kit balances FP with practical performance
- **Debugging**: Kit's explicit style is easier to debug

### vs Native Methods

Kit enhances native methods with:

- **Consistent behavior** across different types
- **Additional functionality** not available natively
- **Better composition** through currying
- **Type safety** with TypeScript

## Best Practices

### Embrace Composition

Build complex operations from simple ones:

```typescript
// ❌ Imperative and hard to modify
function processUsers(users) {
  const result = []
  for (const user of users) {
    if (user.age >= 18 && user.isActive) {
      result.push({
        ...user,
        name: user.name.toUpperCase(),
      })
    }
  }
  return result
}

// ✅ Composable and clear
const processUsers = Fn.pipe(
  Arr.filterWith(user => user.age >= 18 && user.isActive),
  Arr.mapWith(user => ({
    ...user,
    name: Str.Case.upper(user.name),
  })),
)
```

### Use Type Predicates

Leverage type predicates for safer code:

```typescript
// ❌ Manual type checking
const nums = values.filter(v => typeof v === 'number' && !isNaN(v))
// Type is still (number | string)[]

// ✅ Type predicate narrows the type
const nums = Arr.filter(values, Num.is)
// Type is number[]
```

### Prefer Specific Imports

Import what you need for better tree-shaking:

```typescript
// ❌ Imports entire library
import * as Kit from '@wollybeard/kit'

// ✅ Imports only needed modules
import { Arr, Obj, Str } from '@wollybeard/kit'

// ✅✅ Imports only needed functions (maximum tree-shaking)
import { filter, map } from '@wollybeard/kit/arr'
```
