---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "@wollybeard/kit"
  text: "TypeScript Utility Library"
  tagline: Functional programming utilities with consistent APIs and strong type safety
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API Reference
      link: /api/

features:
  - title: Type-Safe
    details: Built with TypeScript from the ground up, providing excellent type inference and compile-time safety
  - title: Functional
    details: Embraces functional programming patterns with currying, composition, and immutability
  - title: Modular
    details: Tree-shakeable architecture ensures you only bundle what you use
  - title: Consistent
    details: Unified API patterns across all modules make the library predictable and easy to learn
---

## Quick Start

```bash
npm install @wollybeard/kit
```

```typescript
import { Arr, Num, Obj, Str } from '@wollybeard/kit'

// Array utilities
const doubled = Arr.map([1, 2, 3], x => x * 2)
// [2, 4, 6]

// Object utilities
const picked = Obj.pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])
// { a: 1, c: 3 }

// String utilities
const slug = Str.Case.kebab('Hello World')
// 'hello-world'

// Number utilities
const clamped = Num.clamp(150, 0, 100)
// 100
```

## Why Kit?

**Kit** provides a comprehensive set of utilities that work together seamlessly:

- **30+ specialized modules** covering arrays, objects, strings, promises, and more
- **Consistent currying patterns** with `*With` and `*On` variants
- **Property-based testing** ensuring reliability with thousands of test cases
- **Zero dependencies** for the core utilities
- **ESM-first** with full tree-shaking support

## Philosophy

Kit follows these core principles:

1. **Type Safety First** - Leverage TypeScript's type system for maximum safety
2. **Functional Patterns** - Immutable operations and composable functions
3. **Consistent APIs** - Learn one module, understand them all
4. **No Magic** - Explicit, predictable behavior with no hidden surprises
5. **Performance** - Efficient implementations without sacrificing readability
