# Traits

## Overview

- Kit has a utility named Traitor
- Traitor provides building blocks for implementing a traits system.
- Kit's traits system is similar to those in other languages/tools:
  - FP TS (fp-ts)
  - Effect (effect)
  - Haskell Type Classes
  - Rust Traits
  - PHP Traits

## Package Exports

- Developers can access Traits as namespaces exported out of Kit: `import { Eq, Type, Ord, ... } from '@wollybeard/kit'`
- Ditto domains: `import { Str, Num, Arr, ... } from '@wollybeard/kit'`
- Therefore domains and trait names must be unique between one another.
- Source traits are single files in `src/traits/*.ts` for simplicity
- Generated traits are multi-file modules in `src/generated/traits/*/` for tree-shaking

## Defining Domains

- Domains are type categories like `Str`, `Num`, `Arr`
- A domain definition has a name and type witness in order to sepcify what its type is at the type level.
  ```typescript
  export const domain = Traitor.domain('Str', '' /* type: string */)
  ```
- The type witness approach is useful because TS does not suppport partial function type paramter application and Traitor NEEDS to know what the domain type is statically. These would be alterant APIs:
  ```typescript
  Traitor.domain<'Str', String>('Str')
  Traitor.domain('Str').type<string>()
  // ...
  ```

## Defining Traits

- Traits define interfaces domains can implement
- Created via `Glo.traitor.trait()`:
  ```typescript
  export const Eq = Glo.traitor.trait('Eq', {
    base(domain, self) {
      return {
        is: (a, b) => {
          if (!domain.Type.is(b)) return false
          return domain.Eq.is(a, b)
        },
        isOn: (a) => (b) => self.is(a, b),
      }
    },
  })
  ```
- Base function adds common logic before delegating to domain
- Dependencies declared in trait interface definition
- Traits may depend on their implementators having implemented other traits. For example Eq requires implementors to have implemented Type.
- Trait dependencies are unidirectional. Two traits cannot depend on their implementor having implemented one another.

### Internals Versus Externals

- Traits always ahve an external interface
- Traits also have an internal interface which by default is a copy of its external interface.
- The difference is that
  - External interfaces are what users consume, while internal interfaces are what domains implement.
  - External interfaces maximize type safety using techniques like conditional types
  - Internal interfaces are simple by virtual of being generic and not using, for example, output types conditonal to intput types.
- The rational for this is that internally we can never satisfy the complex external types so why bother, nor are they much help as the external has to deal with a "before" and "after" context (of using this method) whereas the implementation context is nil, needing only to, for example "receive string, return boolean" without caring about the special mappings between those types.
- Example external interface:
  ```typescript
  { is<a extends string, b = a>(a: a, b: ValidateComparable<a, b>): boolean }
  ```
- Example internal interface:
  ```typescript
  { is(a: string, b: string): boolean }
  ```

## Domains Implementing Traits

- Traits are implemented by what Kit refers to as "domains".
- Domains are namespaces under Kit like Arr, Str, Num.
- Kit authors use sugar to implmeent traits: `<Trait Reference>.$.implement()`
- This sugar is transpiled into plain ESM exports later during production build (describe in later sections).
- Example:
  ```typescript
  export const Eq = EqTrait.$.implement(domain, {
    is(a, b) {
      return a === b
    },
  })
  ```
-

## Using Traits Via Domains

- Once a domain implements a trait a developer can use that domain's trait implementation via its namespace `<Domain Namespace>.<Trait Namespace>.<Trait Method>`
- Example:
  ```typescript
  import { Str } from '@wollybeard/kit'
  Str.Eq.is('hello', 'world') // false
  ```

## Trait Laws

- Laws are mathematical properties that valid implementations must satisfy
- They enable property-based testing of trait implementations
- Laws apply to the trait as a whole, testing relationships between methods
- Example: Eq trait has reflexivity, symmetry, and transitivity laws
- Usage:
  ```typescript
  import { Eq, Str } from '@wollybeard/kit'
  import * as fc from 'fast-check'

  // Test that Str.Eq satisfies all Eq laws
  fc.assert(Eq.$.Laws.all(fc.string(), Str.Eq))
  ```

## Using Traits Directly

- Once a domain implements a trait a developer can use the Trait directly on values of type `<Domain>`: `<Trait Namespace>.<Trait Method>(... <Domain Value>... )`
- Example:
  ```typescript
  import { Eq } from '@wollybeard/kit'
  Eq.is('hello', 'world') // false (strings)
  Eq.is([1, 2], [1, 2]) // true (arrays)
  ```
- When a trait is imported there is a side-effect wherein its registry (traits that implement it) is attached to a global variable. This enables dispatch described below.
- When a trait is used directly it works polymorphically on any value type of a domain that implements the trait.
- Trait methods dispatch to domain implementations.
- Traits use runtime value type checking to determin the doain a value belongs to in order to know which to dispatch to.
- Once the domain is identified the domain implementation is found via a mutable global state. A registry of domain implementations to traits.
- Traits CAN include initial logic on methods. In these cases Traits are more than just dispatchers but also generic logic applicable to all domains. For example the Eq trait `is` method checks if the two given values are of the same domain before dispatching to the domain implementation. This makes sense because two values of different domains will _never_ be equal.

## Tree Shakability Via Rollup Plugin

- Kit aims to be maximally tree shakable.
- Traits by default do not support tree shaking because traits and domains implmementations are defined as objects with many methods. Contrast with the fact that tree shaking operates on bare exports of ESM modules.
- To resolve this we offer a Rollup plugin that transforms traits code into minimal tree-shakable code on the fly based on usage.

### Example 1: Domain Trait Call

```typescript
import { Str } from '@wollybeard/kit'
Str.Eq.is('hello', 'world')
```

The original:

- `Eq` trait
- `Str` domain implementation

Looks this:

```typescript
// DOMAIN - build/domains/str/traits/eq.ts

import { Eq as EqTrait } from '#eq'
import { Traitor } from '#traitor'

export const Eq = Traitor.implement(EqTrait, domain, {
  is(a, b) {
    return a === b
  },
})

// --- TRAIT - #eq -> build/traits/eq/$.ts

import { Traitor } from '#traitor'

export interface Eq {/* ... */}

export const Eq = Traitor.define<Eq>('Eq', {
  hooks({ domain }) {
    return {
      is: {
        pre: (a, b) => {
          if (!domain.Type.is(b)) return false
        },
      },
      isOn: {
        default: (trait) => (a) => (b) => trait.is(a, b),
      },
    }
  },
})
```

The transformed modules look like this:

```typescript
// DOMAIN
// --- @wollybeard/kit/build/domains/str/traits/eq/$.js

export * as Eq from 'virtual:kit:domains:str:traits:eq:$$'

// --- virtual:kit:domains:str:traits:eq:$$

import { Type as StrType } from '@wollybeard/kit'
import { Fn } from '@wollybeard/kit'
import * as EqHooks from 'virtual:kit:traits:eq:hooks:$$'

export const is = Fn.withHooks(
  EqHooks.is({
    Type: {
      is: StrType.is,
    },
  }),
  (a, b) => a === b,
)

export const isOn = (a) => (b) => is(a, b)

// TRAIT

// --- virtual:kit:traits:eq:hooks:$$

import { Fn } from '@wollybeard/kit'

export const is = (domain) =>
  Fn.defineHooks({
    pre(a, b) {
      if (domain.Type.is(b)) return false
    },
  })
```

#### Summary

1. When a domain implementation is imported (@wollybeard/kit/build/domains/:domain/traits/:trait/$.js) its implementation is statically analyzed.
   - Each method is transformed into a module export using Fn.withHooks.
   - Two things must be analyzed: 1) the method; 2) The `domain` argument.
     - 1
       - The method is copied verbatim as the function to pass to Fn.withHooks.
     - 2
       - The trait method is analyzed to understand what other trait implementations does it depend on (e.g., Type).
       - The analysis is used to assemble the 'doain' argument to the trait methods hooks constructor.
   - It imports Trait hooks (virtual:kit:traits:<trait>:hooks:$$)

2. When a trait hooks module is imported (virtual:kit:traits:<trait>:hooks:$$) it returns a set of module exports of function hook definitions which in sum are equivilant to the original Trait definition hooks which were one module export of a Trait definition object.
   - If there are no domain trait implementation dependencies then the module export can be directly a `Fn.defineHooks` value (no constructor needed)
   - If there is use of `default` for a method in Trait definition, and domain does not implement it, then that default is inlined into the domain module. the paramter `trait` namespace if used is stripped.

### Example 2: Trait Call

When using polymorphic trait calls (not domain-specific), the plugin must include dispatch infrastructure while minimizing bundle size:

```ts
import { Eq } from '@wollybeard/kit'
Eq.is(value1, value2)  // value1's type unknown at compile time

The original trait with dispatch looks like:

// TRAIT - build/traits/eq/$.ts
export const Eq = Traitor.define<Eq>('Eq', {
  hooks({ domain }) {
    return {
      is: {
        pre: (a, b) => {
          if (!domain.Type.is(b)) return false
        },
      },
      isOn: {
        default: (trait) => (a) => (b) => trait.is(a, b),
      },
    }
  },
})
```

The transformed modules look like this:

```ts
// --- @wollybeard/kit/build/traits/eq/$.js
export * as Eq from 'virtual:kit:traits:eq:interface:$$'

// --- virtual:kit:traits:eq:interface:$$
import { detectDomain } from '@wollybeard/kit'
import { Fn } from '@wollybeard/kit'
import * as EqHooks from 'virtual:kit:traits:eq:hooks:$$'

// Only import domains detected via type flow analysis
import * as Arr from 'virtual:kit:domains:arr:traits:eq:$$'
import * as Num from 'virtual:kit:domains:num:traits:eq:$$'
import * as Str from 'virtual:kit:domains:str:traits:eq:$$'
// ... other domains based on static analysis

// Per-method dispatch to enable tree shaking
export const is = (a, b) => {
  const domain = detectDomain(a)
  const impl = {
    Str: Str.is,
    Num: Num.is,
    Arr: Arr.is,
    // ... only domains actually needed
  }[domain]

  if (!impl) throw new Error(`No Eq.is implementation for domain: ${domain}`)
  return impl(a, b)
}

export const isOn = (a) => (b) => is(a, b)
```

Type Flow Analysis

The plugin minimizes domain imports by analyzing value types flowing into trait calls:

```ts
// User code examples:
const nums = [1, 2, 3]
Eq.is(nums, [4, 5]) // Plugin detects: Arr<Num> → imports Arr + Num domains

function compare<T extends string | number>(a: T, b: T) {
  return Eq.is(a, b) // Plugin detects: string | number → imports Str + Num domains
}

// Literals and constructors
Eq.is('hello', 'world') // String literals → imports Str domain
Eq.is(new Date(), new Date()) // Constructor calls → imports Date domain
```

Summary

1. When a trait is imported directly (@wollybeard/kit/build/traits/:trait/$.js), the plugin:

- Uses TypeScript compiler API to trace types flowing into trait method calls
- Generates a minimal dispatcher importing only required domain implementations
- Creates per-method dispatch objects using property access (e.g., Str: Str.is) to preserve tree shaking

2. Tree shaking optimization:

- Using { Str: Str.is } instead of { Str: StrEq } ensures only used methods are included
- If user only calls Eq.is, the isOn implementations can be tree-shaken
- Each method's dispatcher includes only domains detected through type analysis

3. Conservative fallbacks:

- When type analysis cannot determine domains (e.g., unknown types), include all implementations
- For generic functions with unconstrained type parameters, include all possible domains
- Provide build-time configuration for users to hint at domain usage patterns

This approach balances correctness with optimal bundle size by leveraging static analysis to include only the trait implementations that could actually be called at runtime.

### Optimizing Bundle Sizes Regarding Domains to Import For Dispatch

Bundle Optimization Strategies

The plugin offers two strategies for optimizing trait dispatchers:

Option 1: Automatic Type Flow Analysis (Complex but Optimal)

The plugin performs whole-program analysis before transformation:

- Phase 1: Scan entire codebase to discover all trait usage sites
- Phase 2: Use TypeScript compiler API to trace types flowing into each trait call
- Phase 3: Build a map of required domains per trait method across all modules
- Phase 4: Generate minimal dispatchers that import only detected domains

Benefits:

- Optimal bundle size with no manual configuration
- Automatically adapts as code changes

Drawbacks:

- Requires analyzing entire codebase on each build (performance impact)
- Complex implementation requiring deep TypeScript API integration
- May miss dynamic imports or runtime-loaded modules
- Cannot analyze external packages that consume the library

Option 2: Explicit Configuration (Simple but Manual)

Users explicitly declare which domains their application uses:

```ts
// kit.config.js
export default {
  domains: ['Str', 'Num', 'Arr'], // Only include these domains
  traits: {
    Eq: ['is'], // Only these methods
    Ord: ['compare', 'min', 'max'],
  },
}
```

The plugin then:

- Generates dispatchers that only import configured domains
- Excludes trait methods not listed in configuration
- Falls back to including all implementations if no config provided

Benefits:

- Fast builds with no analysis overhead
- Predictable and debuggable output
- Users have full control over bundle optimization
- Simple plugin implementation

Drawbacks:

- Requires manual configuration maintenance
- Risk of runtime errors if configuration is incomplete
- Less convenient for users who want automatic optimization

Recommendation: Start with Option 2 (explicit configuration) as it provides immediate value with low implementation complexity. The configuration approach can later be enhanced with an optional analysis
mode that generates configuration suggestions based on detected usage patterns.
