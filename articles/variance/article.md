# TypeScript Variance, Unknown, and Functions Guide

## Quick Reference (Cheat Sheet)

### Variance Rules

- **Covariant** (output positions): Can assign more specific → less specific
  - ✅ `string` → `string | number` → `unknown`
  - Function return types, readonly properties, getters

- **Contravariant** (input positions): Can assign less specific → more specific
  - ✅ `unknown` → `string | number` → `string`
  - Function parameter types

- **Invariant**: Must match exactly
  - Mutable properties (both read and write)

### Unknown vs Any

```typescript
// unknown = top type (supertype of all)
// any = escape hatch (both sub and supertype)

// Function inputs (contravariant)
type F1 = (x: unknown) => void // ❌ Too restrictive - only accepts unknown
type F2 = (x: any) => void // ✅ Accepts anything

// Function outputs (covariant)
type R1 = () => unknown // ✅ Can return anything
type R2 = () => any // ✅ Can return anything (but loses safety)
```

### Quick Decision Matrix

| Position           | Use `unknown` when...               | Use `any` when...                     |
| ------------------ | ----------------------------------- | ------------------------------------- |
| Function input     | You want to force callers to narrow | Building generic infrastructure       |
| Function output    | Return type is truly unknown        | Never (prefer unknown)                |
| Generic constraint | Want maximum flexibility            | Need to accept any function signature |
| Storage/Registry   | Never                               | Storing arbitrary implementations     |

## Deep Dive with Examples

All examples in this guide are available as runnable TypeScript files in this directory.

### Understanding Variance

See [`01-covariance-basics.ts`](./01-covariance-basics.ts) for covariance examples.

See [`02-contravariance-basics.ts`](./02-contravariance-basics.ts) for contravariance examples.

### Unknown in Function Signatures

See [`03-unknown-contravariance-problem.ts`](./03-unknown-contravariance-problem.ts) for the contravariance issue with `unknown`.

See [`04-registry-any-vs-unknown.ts`](./04-registry-any-vs-unknown.ts) for a real-world registry example.

### Generic Constraints and Variance

See [`05-generic-constraints.ts`](./05-generic-constraints.ts) for generic function constraints.

### Practical Patterns

See [`06-type-safe-wrapper.ts`](./06-type-safe-wrapper.ts) for wrapping `any` with `unknown`.

See [`07-force-narrowing.ts`](./07-force-narrowing.ts) for forcing type narrowing.

See [`08-function-storage.ts`](./08-function-storage.ts) for storing arbitrary functions.

### Mental Model

Think of variance like water flow:

- **Covariant** (outputs): Water flows downhill (specific → general)
- **Contravariant** (inputs): Pipes must handle upstream pressure (general → specific)
- **`unknown`**: The ocean (everything flows into it)
- **`any`**: A magic portal (flows both ways, breaks the rules)

### Common Pitfalls

See [`09-pitfalls.ts`](./09-pitfalls.ts) for common mistakes and how to avoid them.

### Summary

- Use `unknown` for **outputs** and when you want to **force narrowing**
- Use `any` for **infrastructure** and **generic function constraints**
- Remember: variance flips for input positions (contravariant)
- In registries/stores of arbitrary implementations, `any` is often correct
