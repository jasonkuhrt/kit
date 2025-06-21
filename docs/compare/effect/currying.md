# Currying Approaches: Kit vs Effect

This document compares how Kit and Effect handle currying and dual APIs for functional programming patterns.

## Overview

Both Kit and Effect need to support two calling styles:

- **Data-first**: `map(array, fn)` - Traditional, familiar style
- **Data-last**: `map(fn)(array)` - Composable, pipe-friendly style

## Kit's Approach: Multiple Named Functions

Kit uses three separate functions with clear naming conventions:

```typescript
// Kit style - 3 separate functions with clear names
map(array, fn) // normal signature
mapOn(array)(fn) // "map on this array" - data first partial
mapWith(fn)(array) // "map with this function" - function first partial

// Usage examples
map([1, 2, 3], x => x * 2) // [2,4,6]
mapOn([1, 2, 3])(x => x * 2) // [2,4,6]
mapWith(x => x * 2)([1, 2, 3]) // [2,4,6]

// In pipes
pipe(
  [1, 2, 3],
  mapWith(x => x * 2),
  filterWith(x => x > 3),
)
```

## Effect's Approach: Single Dual Function

Effect uses a single function that can be called both ways:

```typescript
// Effect style - one function that works both ways
import { dual } from 'effect/Function'

const map = dual(
  2, // arity
  // data-first signature
  <A, B>(self: Array<A>, f: (a: A) => B): Array<B> => {/*...*/},
  // data-last signature
  <A, B>(f: (a: A) => B) => (self: Array<A>): Array<B> => {/*...*/},
)

// Usage - same function, different call patterns
map([1, 2, 3], x => x * 2) // data-first
map(x => x * 2)([1, 2, 3]) // data-last via currying

// In pipes
pipe(
  [1, 2, 3],
  map(x => x * 2), // Same function!
  filter(x => x > 3),
)
```

### Effect's Implementation

Effect uses runtime arity checking to determine which version to use:

```typescript
// Simplified version of Effect's dual
function dual(arity, dataFirst, dataLast) {
  return function(...args) {
    if (args.length >= arity) {
      return dataFirst(...args)
    } else {
      return dataLast(...args)
    }
  }
}
```

## Key Difference: Missing Pattern

**Effect has no equivalent to Kit's `*On` pattern**. Effect's dual functions only support:

- Full application: `map(array, fn)`
- Function-first partial: `map(fn)` (like Kit's `*With`)

But NOT:

- Data-first partial: `map(array)` ❌ (would be Kit's `*On`)

This means Effect cannot express certain patterns that Kit can.

## Comparison

### Kit's Advantages

1. **Explicit intent**: `mapOn` vs `mapWith` clearly shows what's partially applied
2. **Better TypeScript inference**: Each function has one clear signature
3. **No runtime overhead**: No need to check arity at runtime
4. **Easier to understand**: Function name tells you exactly how to use it
5. **Tree-shaking friendly**: If you only use `map`, you don't bundle `mapOn` and `mapWith`
6. **Principle of least surprise**: Each function does exactly one thing
7. **More partial application options**: Can partially apply either argument

### Effect's Advantages

1. **Less API surface**: One function name instead of three
2. **Familiar to FP users**: Similar to Ramda's approach
3. **Consistent naming**: Don't need to remember `On` vs `With` patterns
4. **Migration friendly**: Easier to convert existing code

## Examples in Practice

### Kit Style

```typescript
// For piping - function first (*With pattern)
const doubleAll = mapWith(x => x * 2) // (array) => array
const numbersOnly = filterWith(isNumber) // (array) => array
const firstFive = takeWith(5) // (array) => array

pipe(
  [1, 2, 3, 4, 5, 6],
  doubleAll,
  numbersOnly,
  firstFive,
)

// For partial application with data (*On pattern)
const mapOnUsers = mapOn(users) // (fn) => result
const filterOnPosts = filterOn(posts) // (predicate) => result

// Apply different operations to the same data
const userNames = mapOnUsers(user => user.name)
const userAges = mapOnUsers(user => user.age)
const activePosts = filterOnPosts(post => post.isActive)
const draftPosts = filterOnPosts(post => post.isDraft)
```

### Effect Style

```typescript
// Only supports function-first partial application
const doubleAll = map(x => x * 2)
const numbersOnly = filter(isNumber)
const firstFive = take(5)

// Cannot partially apply data!
const mapOnUsers = map(users) // ❌ This will error - expects a function
// Effect's dual would interpret this as partial application waiting for second arg

// Must use closure instead
const mapOnUsers = (fn) => map(users, fn) // Manual wrapper needed
```

## Conclusion

Kit's approach trades verbosity for clarity. While Effect's dual functions reduce API surface, Kit's explicit naming makes code more readable and intentions clearer. The performance benefit of avoiding runtime arity checks is a nice bonus.

For a utility library meant to be approachable and tree-shakeable, Kit's design choice aligns well with its goals.
