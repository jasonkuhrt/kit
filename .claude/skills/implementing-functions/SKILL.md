---
name: implementing-functions
description: Implements functions following project conventions. Applies data-first parameter order, currying patterns with *On and *With variants, and consistent universal operation names.
---

# Implementing Functions

## Steps

1. **Data first**: Accept data as the first parameter
2. **Curry when sensible**: Typically for 2-parameter functions
3. **Provide both curried variants** for most functions

## Reference

### Currying Pattern

```typescript
// Base function - data first
export const split = (value: string, separator: string): string[] => { ... }

// *On variant - data first, returns function waiting for second arg
export const splitOn = Fn.curry(split)
// Usage: Str.splitOn(data)(separator)

// *With variant - flipped, returns function waiting for data
export const splitWith = Fn.flipCurried(Fn.curry(split))
// Usage: Str.splitWith(separator)(data)
```

### When to Use Each Variant

**`*On`** - When you have data and want to try different operations:
```typescript
const data = 'name,age,city'
const splitData = Str.splitOn(data)
splitData(',')  // ['name', 'age', 'city']
splitData('')   // individual chars
```

**`*With`** - When you have an operation and want to apply to different data:
```typescript
const splitByComma = Str.splitWith(',')
splitByComma('john,25')     // ['john', '25']
splitByComma('laptop,999')  // ['laptop', '999']
```

### Universal Operations

Maintain consistent names across data structures:

| Operation | Purpose | Examples |
|-----------|---------|----------|
| `merge` | Combine two instances | `Arr.merge`, `Obj.merge`, `Str.merge` |
| `by` | Group/index by key | `Group.by(array, 'field')` |
| `is` | Type predicate | `Arr.is`, `Obj.is`, `Undefined.is` |

### Namespace Name Elision

Do NOT repeat the namespace name in function names:

```typescript
// Correct
Group.by(array, key)
Undefined.is(value)
Str.merge(a, b)

// Incorrect
Group.groupBy(array, key)
Undefined.isUndefined(value)
```

## Notes

- Some functions have only data parameters → only `*On` variant needed
- Functions with >2 parameters: currying less common, use judgment
- Data-first enables natural left-to-right composition
