# Type Inference

## Problem

Can TypeScript properly infer types when using trait dispatch? How do we maintain type safety across the dispatch boundary?

## Challenges

### 1. Lost Type Information

```typescript
// Direct call - TypeScript knows exact types
const result = NumRange.diff(numRange1, numRange2) // result: NumRange

// Trait dispatch - Type information lost?
const result = Range.diff(numRange1, numRange2) // result: unknown?
```

### 2. Mixed Type Prevention

```typescript
// Should be compile-time error
Range.diff(numRange, dateRange) // TypeScript can't catch this?
```

### 3. Return Type Inference

```typescript
// How does TypeScript know what diff returns?
const result = Range.diff(a, b) // Need to infer based on input types
```

## Possible Solutions

### 1. Overloaded Signatures

```typescript
interface RangeOps {
  diff(a: NumRange, b: NumRange): NumRange
  diff(a: DateRange, b: DateRange): DateRange
  diff(a: StringRange, b: StringRange): StringRange
  // ... for each type
}
```

**Pros:**

- Full type safety
- Exact return types
- IDE autocomplete works

**Cons:**

- Must maintain overloads
- Not extensible
- Lots of boilerplate

### 2. Conditional Types

```typescript
type RangeOf<T> = T extends NumRange ? NumRange
  : T extends DateRange ? DateRange
  : T extends StringRange ? StringRange
  : never

interface RangeOps {
  diff<T extends { __brand: string }>(a: T, b: T): RangeOf<T>
}
```

**Pros:**

- Single signature
- Type safe
- Extensible pattern

**Cons:**

- Complex type gymnastics
- Can hit TS limits
- Slower compilation

### 3. Generic Constraints

```typescript
interface RangeOps {
  diff<T extends Range>(a: T, b: T): T
  contains<T extends Range>(range: T, value: ValueOf<T>): boolean
}

type ValueOf<T> = T extends NumRange ? number
  : T extends DateRange ? Date
  : unknown
```

**Pros:**

- Maintains type relationships
- Prevents mixed types
- Clean signatures

**Cons:**

- Need helper types
- Not perfect inference
- Some type assertions needed

### 4. Type Registry Pattern

```typescript
interface RangeTypeRegistry {
  NumRange: {
    range: NumRange
    value: number
    diff: (a: NumRange, b: NumRange) => NumRange
  }
  DateRange: {
    range: DateRange
    value: Date
    diff: (a: DateRange, b: DateRange) => DateRange
  }
}

type RangeBrand<T> = T extends { __brand: infer B } ? B : never

interface RangeOps {
  diff<T extends { __brand: keyof RangeTypeRegistry }>(
    a: T,
    b: T,
  ): RangeTypeRegistry[RangeBrand<T>]['range']
}
```

**Pros:**

- Extensible via interface merging
- Type safe
- Good inference

**Cons:**

- Complex setup
- Requires brands
- Registry maintenance

### 5. Proxy Type Magic

```typescript
type TraitProxy<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? <U extends Parameters<T[K]>[0]>(...args: A) => R
    : never
}

const Range = new Proxy({} as TraitProxy<RangeOps>, {
  // Implementation
})
```

**Pros:**

- Dynamic type generation
- Flexible
- No manual overloads

**Cons:**

- Complex types
- Poor error messages
- IDE struggles

## Real-World Example

```typescript
// What we want to work
const numResult = Range.diff(num1, num2) // inferred as NumRange
const dateResult = Range.diff(date1, date2) // inferred as DateRange
Range.diff(num1, date1) // Compile error!

// With conditional types
type InferRange<T> = T extends { __brand: infer Brand }
  ? Brand extends keyof RangeRegistry ? RangeRegistry[Brand]
  : never
  : never

declare const Range: {
  diff<T extends { __brand: string }>(a: T, b: T): InferRange<T>
}
```

## Recommendation

Use a combination:

1. **Brands** for runtime type detection
2. **Conditional types** for type inference
3. **Generic constraints** to prevent mixed types
4. **Type registry** for extensibility

Accept that perfect inference might not be possible - document type assertions where needed.

The goal is "good enough" type safety that catches common errors while remaining usable.
