# Trait Laws and Testing

## Problem

How do we ensure that all implementations of a trait follow the expected "laws" or contracts? How can we test that implementations are correct and consistent?

## What Are Trait Laws?

Laws are properties that all implementations must satisfy. For example:

### Eq Laws

- **Reflexivity**: `a.equals(a) === true`
- **Symmetry**: `a.equals(b) === b.equals(a)`
- **Transitivity**: If `a.equals(b)` and `b.equals(c)`, then `a.equals(c)`

### Range Laws

- **Contains self**: `Range.contains(range, range.start) === true`
- **Empty range**: If `start > end`, `Range.isEmpty(range) === true`
- **Overlap symmetry**: `Range.overlaps(a, b) === Range.overlaps(b, a)`

## Testing Approaches

### 1. Property-Based Testing

```typescript
import * as fc from 'fast-check'

export const testRangeLaws = <T>(
  ops: RangeOps<T>,
  arbitrary: fc.Arbitrary<T>,
  rangeArbitrary: fc.Arbitrary<Range<T>>,
) => {
  describe('Range Laws', () => {
    test('contains start and end', () => {
      fc.assert(
        fc.property(rangeArbitrary, (range) => {
          expect(ops.contains(range, range.start)).toBe(true)
          expect(ops.contains(range, range.end)).toBe(true)
        }),
      )
    })

    test('overlap is symmetric', () => {
      fc.assert(
        fc.property(rangeArbitrary, rangeArbitrary, (a, b) => {
          expect(ops.overlaps(a, b)).toBe(ops.overlaps(b, a))
        }),
      )
    })
  })
}

// Usage
testRangeLaws(NumRangeOps, fc.float(), arbNumRange)
testRangeLaws(DateRangeOps, fc.date(), arbDateRange)
```

**Pros:**

- Tests many cases automatically
- Finds edge cases
- Reusable across implementations

**Cons:**

- Requires property-based testing knowledge
- Need to define arbitraries
- Can be slow

### 2. Law Test Suites

```typescript
export interface RangeLawSuite<T> {
  createRange(start: T, end: T): Range<T>
  createValue(seed: number): T
  ops: RangeOps<T>
}

export const runRangeLaws = <T>(suite: RangeLawSuite<T>) => {
  describe('Range Laws', () => {
    test('empty range behavior', () => {
      const range = suite.createRange(
        suite.createValue(10),
        suite.createValue(5),
      )
      expect(suite.ops.isEmpty(range)).toBe(true)
    })

    // ... more laws
  })
}
```

**Pros:**

- Standardized test suite
- Easy to apply to new types
- Ensures consistency

**Cons:**

- Need to implement suite interface
- Less flexible than property testing
- Manual test cases

### 3. Static Verification

```typescript
// Use TypeScript to enforce some laws
interface EqLaws<T> {
  // Reflexivity encoded in type
  equals(a: T, b: T): boolean
  // Can't encode symmetry/transitivity in types
}

// Phantom type to mark law-abiding implementations
type LawfulEq<T> = Eq<T> & { __lawful: true }

// Only accept lawful implementations
function sort<T>(items: T[], eq: LawfulEq<T>) {}
```

**Pros:**

- Compile-time checking (where possible)
- No runtime overhead
- Self-documenting

**Cons:**

- Can't encode most laws in types
- Requires discipline
- Limited verification

### 4. Documentation-Driven Testing

```typescript
/**
 * Range operations
 *
 * Laws:
 * 1. contains(range, start) === true
 * 2. isEmpty(range) === start > end
 * 3. overlaps(a, b) === overlaps(b, a)
 *
 * @lawTest ./range.laws.test.ts
 */
interface RangeOps<T> {
  // ...
}

// Generate tests from documentation
generateLawTests('RangeOps', RangeOps)
```

**Pros:**

- Laws are documented
- Tests generated from docs
- Single source of truth

**Cons:**

- Requires tooling
- Complex to implement
- May miss edge cases

### 5. Trait Test Helpers

```typescript
export const RangeTest = {
  assertValidRange<T>(range: Range<T>, ops: RangeOps<T>) {
    expect(ops.contains(range, range.start)).toBe(true)
    if (ops.isEmpty(range)) {
      expect(range.start > range.end).toBe(true)
    }
  },

  assertOverlapSymmetric<T>(a: Range<T>, b: Range<T>, ops: RangeOps<T>) {
    expect(ops.overlaps(a, b)).toBe(ops.overlaps(b, a))
  },
}

// In implementation tests
test('NumRange follows laws', () => {
  RangeTest.assertValidRange(numRange, NumRangeOps)
})
```

**Pros:**

- Reusable assertions
- Easy to understand
- Flexible usage

**Cons:**

- Manual test writing
- May miss cases
- Not exhaustive

## Enforcement Strategies

### 1. CI Requirement

```yaml
# .github/workflows/trait-laws.yml
- name: Run trait law tests
  run: npm run test:laws
  
- name: Check law coverage
  run: npm run laws:coverage
```

### 2. Registration Validation

```typescript
function registerTrait<T>(name: string, impl: TraitImpl<T>) {
  // Run law tests before accepting registration
  if (!validateLaws(name, impl)) {
    throw new Error(`Implementation doesn't satisfy ${name} laws`)
  }
  registry.set(name, impl)
}
```

### 3. Type-Level Markers

```typescript
// Mark implementations that have been tested
interface NumRangeOps extends RangeOps<NumRange>, LawTested {
  __lawTests: './num-range.laws.test.ts'
}
```

## Recommendation

Use a multi-layered approach:

1. **Document laws** clearly in trait interfaces
2. **Provide property-based test suites** for thoroughness
3. **Create test helpers** for common assertions
4. **Enforce in CI** to ensure all implementations are tested
5. **Consider runtime validation** for critical applications

The goal is to make it easy to write lawful implementations and hard to write unlawful ones.
