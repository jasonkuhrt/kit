# Mixed Type Errors

## Problem

How do we prevent users from mixing different types in trait operations? This should ideally be caught at compile-time, not runtime.

## Examples of Mixed Type Errors

```typescript
// Should not compile
Range.diff(numRange, dateRange)
Range.overlaps(stringRange, numRange)
Eq.equals(user, product)

// Should compile
Range.diff(numRange1, numRange2)
Range.overlaps(dateRange1, dateRange2)
Eq.equals(user1, user2)
```

## Challenges

### 1. TypeScript Limitations

```typescript
// TypeScript can't enforce this without help
function diff(a: any, b: any) {
  // How to ensure a and b are same type?
}
```

### 2. Generic Constraints

```typescript
// This allows mixed types!
function diff<T, U>(a: T, b: U) {}

// This is better but not perfect
function diff<T>(a: T, b: T) {}
diff(numRange, dateRange) // Still compiles if both extend base type
```

### 3. Union Types

```typescript
type AnyRange = NumRange | DateRange | StringRange

function diff(a: AnyRange, b: AnyRange) {}
// Allows diff(numRange, dateRange) - bad!
```

## Possible Solutions

### 1. Branded Types with Exact Matching

```typescript
interface NumRange {
  __brand: 'NumRange'
  start: number
  end: number
}

interface DateRange {
  __brand: 'DateRange'
  start: Date
  end: Date
}

// Enforce same brand
function diff<T extends { __brand: string }>(
  a: T,
  b: T & { __brand: T['__brand'] },
): T {
  return dispatch('diff', a, b)
}

// This ensures both have exact same brand
```

**Pros:**

- Compile-time safety
- Clear errors
- Works with dispatch

**Cons:**

- Requires brands
- Verbose types
- Not all types have brands

### 2. Conditional Type Guards

```typescript
type SameType<T, U> = T extends U ? U extends T ? true : false : false

function diff<T, U>(
  a: T,
  b: U & (SameType<T, U> extends true ? U : never),
) {
  // Implementation
}

diff(numRange, numRange) // OK
diff(numRange, dateRange) // Error: Type 'DateRange' is not assignable to type 'never'
```

**Pros:**

- No brands needed
- Flexible
- Good error messages

**Cons:**

- Complex types
- Can be circumvented
- Performance impact

### 3. Overloaded Signatures

```typescript
interface RangeOps {
  diff(a: NumRange, b: NumRange): NumRange
  diff(a: DateRange, b: DateRange): DateRange
  diff(a: StringRange, b: StringRange): StringRange
  // No mixed signatures!
}
```

**Pros:**

- Crystal clear
- Best IDE support
- No runtime overhead

**Cons:**

- Lots of boilerplate
- Not extensible
- Maintenance burden

### 4. Phantom Type Parameter

```typescript
interface Range<T> {
  __phantom: T
  start: T
  end: T
}

function diff<T>(a: Range<T>, b: Range<T>): Range<T> {
  // Types must match
}

const numRange: Range<number> = { ... }
const dateRange: Range<Date> = { ... }

diff(numRange, dateRange) // Error: Type 'Date' is not assignable to type 'number'
```

**Pros:**

- Type parameter enforces matching
- Clean implementation
- Extensible

**Cons:**

- Extra type parameter everywhere
- Phantom field (never used)
- More complex types

### 5. Runtime + Compile-Time Validation

```typescript
// Compile-time
function diff<T extends { __type: string }>(
  a: T,
  b: T,
): T {
  // Runtime double-check
  if (a.__type !== b.__type) {
    throw new TypeError(`Cannot diff ${a.__type} with ${b.__type}`)
  }
  return dispatch('diff', a, b)
}
```

**Pros:**

- Belt and suspenders approach
- Clear runtime errors
- Compile-time hints

**Cons:**

- Runtime overhead
- Requires type field
- Not purely static

### 6. Type-Level Functions

```typescript
type AssertSameType<T, U> = T extends U ? U extends T ? T
  : ['Types must be the same', T, 'is not', U]
  : ['Types must be the same', T, 'is not', U]

function diff<T, U>(
  a: T,
  b: U & AssertSameType<T, U>,
): T {
  // Implementation
}

// Good error messages!
diff(numRange, dateRange)
// Error: Type '["Types must be the same", NumRange, "is not", DateRange]' is not assignable to type 'DateRange'
```

**Pros:**

- Custom error messages
- Flexible validation
- No runtime overhead

**Cons:**

- Complex types
- Can be hard to read
- TS version dependent

## Recommendation

Use a combination:

1. **Primary**: Branded types with exact matching
   - Most reliable
   - Works with dispatch
   - Clear semantics

2. **Fallback**: Runtime validation
   - Catch any edge cases
   - Better error messages
   - Safety net

3. **Future**: Type-level functions for better errors
   - As TypeScript improves
   - Better developer experience

The key is making illegal states unrepresentable at the type level.
