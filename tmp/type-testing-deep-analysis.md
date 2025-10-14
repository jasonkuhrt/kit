# Type Testing Library - Deep Technical Analysis

**Related Issue:** #10
**Date:** 2025-01-XX
**Author:** Research Analysis

---

## Table of Contents

1. [Architecture Deep Dive](#architecture-deep-dive)
2. [Feature-by-Feature Analysis](#feature-by-feature-analysis)
3. [API Design Explorations](#api-design-explorations)
4. [Implementation Strategies](#implementation-strategies)
5. [Trade-off Analysis](#trade-off-analysis)
6. [Performance Considerations](#performance-considerations)
7. [Testing the Type Tester](#testing-the-type-tester)

---

## Architecture Deep Dive

### Current Architecture Analysis

Kit's type testing library uses a sophisticated HKT (Higher-Kinded Types) pattern:

```typescript
// Core pattern: Kind interface
interface SubKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  return: /* conditional type logic */
}

// Apply type "calls" the kind
type Apply<$Kind extends Kind, $Args> = /* evaluation */

// Generic assertion function type
type AssertionFn<$Assertion extends Kind> = /* dual-mode function */
```

**Strengths:**

- ✅ **Extensible** - Easy to add new assertions
- ✅ **Type-safe** - Assertion logic is strongly typed
- ✅ **Composable** - Can combine assertions
- ✅ **Reusable** - Same infrastructure for all tests

**Limitations:**

- ⚠️ **Complex** - High barrier to contribution
- ⚠️ **Not discoverable** - IDE can't suggest assertions
- ⚠️ **Verbose** - Requires understanding of HKT

### Proposed Hybrid Architecture

Keep HKT as foundation, add fluent layer on top:

```typescript
// Layer 1: HKT Foundation (unchanged)
interface SubKind { /* ... */ }
export type sub<$Expected, $Actual> = Apply<SubKind, [$Expected, $Actual]>
export const sub: AssertionFn<SubKind> = runtime

// Layer 2: Fluent API (new)
export const expectTypeOf = <$T>(value?: $T) => {
  return {
    // Map to existing implementations
    toBeString: () => sub<string>()(value as any),
    toBeNumber: () => sub<number>()(value as any),

    // Chainable properties
    not: createNegated(value),

    // Function-specific
    ...(isFunction(value) ? {
      returns: createReturnsChain(value),
      parameter: (n: number) => createParameterChain(value, n)
    } : {}),

    // Object-specific
    ...(isObject(value) ? {
      toHaveProperty: (key: string) => /* ... */
    } : {})
  }
}
```

**Benefits:**

- ✅ Both APIs coexist (backward compatible)
- ✅ Fluent API is thin wrapper (minimal overhead)
- ✅ Existing power remains accessible
- ✅ Can gradually migrate tests

---

## Feature-by-Feature Analysis

### 1. Fluent API

**Problem:** Current syntax requires memorizing function names and type parameters

**Solution:** Chainable API with IDE autocomplete

**Implementation Complexity:** Medium

- Need conditional types for method availability
- Type inference must flow through chains
- Negation (`not`) requires doubling all methods

**Code Example:**

```typescript
interface ExpectTypeOf<$T> {
  // Core assertions
  toEqualTypeOf: <$U>() => void
  toMatchTypeOf: <$U>() => void

  // Type checks
  toBeString: () => void
  toBeNumber: () => void
  // ... 20+ more

  // Modifiers
  not: ExpectTypeOfNot<$T>

  // Conditional methods
  returns: $T extends (...args: any[]) => any ? ExpectReturns<ReturnType<$T>>
    : never
  parameter: $T extends (...args: any[]) => any
    ? <N extends number>(n: N) => ExpectParameter<Parameters<$T>[N]>
    : never
}
```

**Challenges:**

1. **TypeScript method overloading** - Can't have truly conditional methods
2. **Type inference** - Preserving literal types through chains
3. **Error messages** - Keeping them clear through indirection

**Mitigation:**

- Use branded types for chains to improve errors
- Document common patterns
- Provide TypeScript plugin hints

---

### 2. Union Operations (extract/exclude)

**Problem:** Testing discriminated unions requires manual type construction

**Solution:** Built-in extract/exclude helpers

**Implementation:**

```typescript
interface ExpectTypeOf<$T> {
  extract: <$U>() => ExpectTypeOf<Extract<$T, $U>>
  exclude: <$U>() => ExpectTypeOf<Exclude<$T, $U>>
}

// Usage
expectTypeOf<'a' | 'b' | 'c'>()
  .extract<'a' | 'b'>()
  .toEqualTypeOf<'a' | 'b'>()
```

**Edge Cases:**

- Empty unions after extraction
- Nested extractions
- Extract with incompatible types

**Testing Strategy:**

```typescript
// Test suite for union operations
type _ = Ts.Test.Cases<
  // Basic extraction
  Ts.Test.exact<
    ExtractResult<'a' | 'b' | 'c', 'a' | 'b'>,
    'a' | 'b'
  >,
  // Exclusion
  Ts.Test.exact<
    ExcludeResult<'a' | 'b' | 'c', 'a'>,
    'b' | 'c'
  >,
  // Empty result
  Ts.Test.equalNever<
    ExtractResult<'a' | 'b', 'c'>
  >,
  // Nested unions
  Ts.Test.exact<
    ExtractResult<{ type: 'a'; x: 1 } | { type: 'b'; y: 2 }, { type: 'a' }>,
    { type: 'a'; x: 1 }
  >
>
```

---

### 3. Type Instantiation Benchmarking

**Problem:** No visibility into type-checking performance

**Solution:** Measure and snapshot instantiation counts (inspired by Attest)

**Technical Approach:**

1. **Use TypeScript Compiler API**
   ```typescript
   import ts from 'typescript'

   function measureInstantiations(code: string): number {
     let count = 0
     const originalInstantiate = (ts as any).instantiateType
     ;(ts as any).instantiateType = function(...args: any[]) {
       count++
       return originalInstantiate.apply(this, args)
     }

     // Type check the code
     const program = ts.createProgram([/* ... */], {})
     program.getTypeChecker()

     return count
   }
   ```

2. **Snapshot Format**
   ```typescript
   // test.bench.ts
   Test.bench('complex generic', () => {
     type Result = ComplexUtility<'input', { deeply: { nested: true } }>
     return null as Result
   }).snapshots({
     instantiations: 234, // Exact count
     maxInstantiations: 250, // Threshold
     checkTime: 450, // ms
     maxCheckTime: 500, // ms
   })
   ```

3. **CI Integration**
   ```bash
   # Snapshot mode (like Jest snapshots)
   pnpm test:types --update-snapshots

   # Check mode (CI)
   pnpm test:types --check-snapshots
   ```

**Challenges:**

- **Overhead** - Running compiler is slow
- **Nondeterminism** - Counts can vary slightly
- **Caching** - TypeScript caches aggressively

**Solutions:**

- Warm up compiler before measuring
- Allow tolerance ranges (±5%)
- Disable incremental compilation for benchmarks
- Run in isolated processes

**Use Cases:**

- Ensure refactoring doesn't hurt performance
- Find instantiation hotspots
- Set performance budgets for APIs

---

### 4. Completion Snapshotting

**Problem:** IDE autocomplete is critical but untested

**Solution:** Snapshot expected completions (from Attest)

**Implementation:**

```typescript
Test.completions<'Status'>()
  .at({ line: 10, character: 25 })
  .expects(['pending', 'complete', 'failed'])

// Or declarative
Test.completions(value as Status)
  .forKey('status')
  .expects(['pending', 'complete', 'failed'])
```

**Technical Implementation:**

1. **TypeScript Language Service API**
   ```typescript
   import ts from 'typescript/lib/tsserverlibrary'

   function getCompletions(
     fileName: string,
     position: number,
     languageService: ts.LanguageService,
   ): string[] {
     const completions = languageService.getCompletionsAtPosition(
       fileName,
       position,
       {},
     )

     return completions?.entries.map(e => e.name) ?? []
   }
   ```

2. **Position Calculation**
   ```typescript
   // Find position of specific token
   function findTokenPosition(
     sourceFile: ts.SourceFile,
     tokenText: string,
   ): number {
     // AST traversal to find token
     return position
   }
   ```

**Challenges:**

- **Setup** - Need full language service
- **Slow** - Language service is heavy
- **Brittle** - Position-based testing

**Solutions:**

- Cache language service between tests
- Use markers in code (`/*^*/` for cursor position)
- Fuzzy matching for partial completion lists

**Use Cases:**

- Template literal types
- String literal unions
- Discriminated unions
- Branded types

---

### 5. Type Diff Visualization

**Problem:** When types don't match, error shows full types (unreadable for complex types)

**Solution:** Git-style diff showing only differences

**Implementation:**

```typescript
// Type diff algorithm
function diffTypes(expected: ts.Type, actual: ts.Type): TypeDiff {
  if (expected === actual) return { kind: 'equal' }

  if (expected.flags !== actual.flags) {
    return { kind: 'different', expected, actual }
  }

  if (expected.isUnion() && actual.isUnion()) {
    return diffUnions(expected, actual)
  }

  if (expected.isObject() && actual.isObject()) {
    return diffObjects(expected, actual)
  }

  // ... more cases
}

function diffObjects(expected: ObjectType, actual: ObjectType): ObjectDiff {
  const expectedProps = expected.getProperties()
  const actualProps = actual.getProperties()

  const added = actualProps.filter(p => !expectedProps.has(p.name))
  const removed = expectedProps.filter(p => !actualProps.has(p.name))
  const modified = expectedProps
    .filter(p => actualProps.has(p.name))
    .filter(p => !typesEqual(p.type, actualProps.get(p.name)!.type))

  return { added, removed, modified }
}
```

**Output Format:**

```
Type mismatch at User:
  {
    name: string,
-   age: number,
+   age: number | null,
-   email: string,
    phone?: string,
+   address: Address
  }
```

**Advanced Features:**

- **Nested diffs** - Drill down into objects
- **Union diffs** - Show added/removed union members
- **Color coding** - Red for removed, green for added
- **Contextual info** - Show surrounding unchanged types

---

### 6. Algebraic Property Testing

**Problem:** Complex type operations might violate mathematical laws

**Solution:** Test algebraic properties systematically

**Properties to Test:**

```typescript
// Commutativity: f(a, b) = f(b, a)
Test.algebraic<Union>()
  .commutative()
  .verify<'a' | 'b', 'b' | 'a'>()

// Associativity: f(f(a, b), c) = f(a, f(b, c))
Test.algebraic<Union>()
  .associative()
  .verify<('a' | 'b') | 'c', 'a' | ('b' | 'c')>()

// Identity: f(a, identity) = a
Test.algebraic<Intersection>()
  .identity<unknown>()
  .verify<T & unknown, T>()

// Absorption: f(a, zero) = zero
Test.algebraic<Intersection>()
  .absorption<never>()
  .verify<T & never, never>()

// Distributivity: (A|B) & C = (A&C) | (B&C)
Test.algebraic()
  .distributive<Union, Intersection>()
  .verify<('a' | 'b') & 'c', ('a' & 'c') | ('b' & 'c')>()

// Idempotence: f(f(a)) = f(a)
Test.algebraic<Union>()
  .idempotent()
  .verify<('a' | 'b') | ('a' | 'b'), 'a' | 'b'>()
```

**Implementation:**

```typescript
interface AlgebraicTests<$Op> {
  commutative(): CommutativityTest<$Op>
  associative(): AssociativityTest<$Op>
  identity<$Identity>(): IdentityTest<$Op, $Identity>
  absorption<$Zero>(): AbsorptionTest<$Op, $Zero>
  idempotent(): IdempotenceTest<$Op>
}

// Example: test that Union is commutative
type CommutativityTest<$Op> = {
  verify: <$A, $B>() => Apply<$Op, [$A, $B]> extends Apply<$Op, [$B, $A]>
    ? Apply<$Op, [$B, $A]> extends Apply<$Op, [$A, $B]> ? true
    : false
    : false
}
```

**Use Cases:**

- Utility type libraries
- Validating custom type operators
- Educational tool for type theory

---

### 7. Type-Level Fuzzing (Property-Based Testing)

**Problem:** Hard to find edge cases in complex type transformations

**Solution:** Generate random types and test invariants

**Approach:**

1. **Type Generator**
   ```typescript
   type RandomPrimitive = string | number | boolean | null | undefined

   type RandomObject<Depth extends number = 3> =
     Depth extends 0
       ? RandomPrimitive
       : {
           [K in RandomKey]: RandomType<Decrement<Depth>>
         }

   type RandomUnion<Size extends number = 3> =
     /* generate union of Size random types */

   type RandomType<Depth extends number = 3> =
     | RandomPrimitive
     | RandomObject<Depth>
     | RandomUnion
     | Array<RandomType<Decrement<Depth>>>
   ```

2. **Invariant Testing**
   ```typescript
   Test.fuzzing<DeepReadonly>()
     .generate(1000, { maxDepth: 5 })
     .property((T) => {
       // Idempotence: DeepReadonly<DeepReadonly<T>> = DeepReadonly<T>
       Test.exact<
         DeepReadonly<DeepReadonly<T>>,
         DeepReadonly<T>
       >()
     })
   ```

**Challenges:**

- **Type generation is slow** - Each type needs compilation
- **Infinite types** - Recursive types can be infinite
- **Representativity** - Random types may not cover real patterns

**Solutions:**

- Depth limits and size limits
- Constrained generation (only useful shapes)
- Hybrid: random + hand-picked edge cases

**Invariants to Test:**

```typescript
// Idempotence
f(f(x)) = f(x)

// Preservation
keys(f(x)) = keys(x)

// Monotonicity
x <: y => f(x) <: f(y)

// Reversibility
g(f(x)) = x  (when g is inverse of f)
```

---

### 8. Type Coverage Metrics

**Problem:** No way to know how much of codebase has proper types

**Solution:** Coverage metrics like code coverage

**Metrics:**

1. **`any` Coverage** - % of positions with explicit types
   ```typescript
   function process(data: any) { // 0% coverage
     const x: number = data // 100% coverage
     return x * 2 // Inferred, counts as 100%
   }
   // Function coverage: 66.7%
   ```

2. **Specificity Score** - How specific types are
   ```typescript
   const a: unknown = ...  // Score: 0 (most general)
   const b: object = ...   // Score: 0.3
   const c: { x: number } = ... // Score: 0.8
   const d: { x: 42 } = ...     // Score: 1.0 (most specific)
   ```

3. **Annotation Ratio** - Explicit vs. inferred
   ```typescript
   // Explicit annotations
   function add(a: number, b: number): number {
     return a + b
   }
   // Ratio: 3 explicit / 4 total = 75%
   ```

**Implementation:**

```typescript
import ts from 'typescript'

function analyzeCoverage(sourceFile: ts.SourceFile): CoverageReport {
  const checker = program.getTypeChecker()
  const metrics = {
    totalNodes: 0,
    typedNodes: 0,
    anyNodes: 0,
    unknownNodes: 0,
    explicitNodes: 0,
  }

  function visit(node: ts.Node) {
    if (isExpression(node)) {
      metrics.totalNodes++
      const type = checker.getTypeAtLocation(node)

      if (type.flags & ts.TypeFlags.Any) {
        metrics.anyNodes++
      } else {
        metrics.typedNodes++
      }

      if (hasExplicitType(node)) {
        metrics.explicitNodes++
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return {
    coverage: metrics.typedNodes / metrics.totalNodes,
    anyRate: metrics.anyNodes / metrics.totalNodes,
    annotationRate: metrics.explicitNodes / metrics.totalNodes,
  }
}
```

**CLI:**

```bash
$ pnpm test:types --coverage

Type Coverage Report:
  src/utils/
    coverage: 94.2%
    any rate: 3.1%
    annotation: 67.8%

  src/domains/
    coverage: 89.5%
    any rate: 8.2%
    annotation: 45.3%

  Overall:
    coverage: 91.8%
    any rate: 5.7%
    annotation: 56.5%
```

---

## API Design Explorations

### Design Philosophy

**Tension:** Precision vs. Convenience

Current Kit approach: **Precision first**

- Separate functions for each relationship (exact/equiv/sub)
- Explicit type parameters
- Clear semantics

Ecosystem approach: **Convenience first**

- Single entry point (expectTypeOf)
- Inferred types
- Fluent API

**Proposed:** Both! Precision for power users, convenience for common cases

### API Option 1: Thin Wrapper

```typescript
// Just map existing functions
export const expect = <T>(value?: T) => ({
  toBeString: () => sub<string>()(value as any),
  toEqualType: <U>() => exact<U, T>(),
  // ...
})
```

**Pros:** Simple, minimal code
**Cons:** Loses some type safety, error messages indirect

### API Option 2: Proper Integration

```typescript
// Build fluent API into HKT system
interface ExpectTypeOfKind {
  parameters: [$T: unknown, $Method: string]
  return: /* method-specific logic */
}

export const expectTypeOf = <T>(value?: T): ExpectTypeOfChain<T>
```

**Pros:** Type-safe, good errors
**Cons:** More complex implementation

### API Option 3: Dual Export

```typescript
// Keep both styles
export const Ts = {
  Test: {
    // Current API
    exact: <Expected, Actual>() => /* ... */,
    sub: <Expected, Actual>() => /* ... */,

    // Fluent API
    expect: <T>(value?: T) => /* ... */
  }
}

// Also export fluent directly
export const expectTypeOf = Ts.Test.expect
```

**Pros:** Best of both worlds, gradual migration
**Cons:** API surface is larger

**Recommendation:** Option 3 - Dual export

---

## Implementation Strategies

### Phase 1: Fluent API (Weeks 1-2)

**Week 1: Core Infrastructure**

- Create `ExpectTypeOf` type
- Implement primitive matchers (toBeString, etc.)
- Add `not` modifier
- Tests for basic usage

**Week 2: Advanced Matchers**

- Function testing (returns, parameters)
- Promise/async (resolves)
- Object testing (toHaveProperty)
- Union operations (extract, exclude)

**Deliverable:** `expectTypeOf` with parity to expect-type

### Phase 2: Attest Features (Weeks 3-5)

**Week 3: Benchmarking Infrastructure**

- Integrate TypeScript Compiler API
- Instantiation counter
- Snapshot system
- CLI integration

**Week 4: Completion Snapshotting**

- Language service setup
- Completion extraction
- Position markers
- Snapshot format

**Week 5: JSDoc Testing**

- JSDoc extraction
- Assertion API
- Integration with existing tests

**Deliverable:** Attest-like features for Kit

### Phase 3: Novel Features (Weeks 6-12)

**Week 6-7: Type Diff Visualization**

- Diff algorithm
- Terminal formatting
- JSON output
- Integration with test reporters

**Week 8-9: Algebraic Testing**

- Property definitions
- Verification framework
- Test suite for common operations

**Week 10-11: Fuzzing**

- Type generator
- Property-based test runner
- Edge case detection

**Week 12: Coverage**

- AST analysis
- Metrics calculation
- Reporting

**Deliverable:** Revolutionary features no one else has

---

## Trade-off Analysis

### Precision vs. Convenience

**Scenario:** Testing that a value is a string

**Precision approach (current):**

```typescript
Ts.Test.sub<string>()(value)
// Clear: value extends string
// Explicit relationship: subtype
```

**Convenience approach (fluent):**

```typescript
expectTypeOf(value).toBeString()
// Shorter, more readable
// But: is this exact match or subtype? Unclear!
```

**Resolution:** Document semantics clearly

- `toBeString()` means `sub<string>`
- `toEqualTypeOf<string>()` means `exact<string>`

### Type Safety vs. Runtime Safety

**Issue:** Type tests have no runtime meaning

```typescript
expectTypeOf(value).toBeString() // Compiles, does nothing at runtime

// If value is actually a number at runtime, this passes!
```

**Options:**

1. **Pure compile-time** (current approach)
   - No runtime overhead
   - But: can't catch runtime type mismatches

2. **Runtime validation** (Attest approach)
   ```typescript
   attest(value).is<string>()
   // Checks type at compile-time AND validates at runtime
   ```

3. **Hybrid** (proposed)
   ```typescript
   expectTypeOf(value).toBeString() // Compile-time only
   expectTypeOf(value).toBeString().atRuntime() // Add runtime check
   ```

**Recommendation:** Hybrid - default to compile-time, opt-in to runtime

### Backward Compatibility vs. Clean API

**Challenge:** Kit has existing users with existing tests

**Options:**

1. **Breaking change** - Replace old API
   - Clean, modern API
   - But: breaks existing tests

2. **Deprecation** - Mark old API deprecated
   - Gradual migration
   - But: noise in IDE

3. **Coexistence** - Both APIs forever
   - No breaking changes
   - But: larger API surface

**Recommendation:** Coexistence with gentle nudges

- Keep old API
- Add fluent API
- Documentation favors fluent
- Eventually (2.0), deprecate old API

---

## Performance Considerations

### Type-Checking Performance

**Concern:** Complex type testing can slow compilation

**Measurements needed:**

- Baseline: current test suite compile time
- With fluent API: overhead from wrapper types
- With benchmarking: overhead from compiler hooks

**Optimizations:**

- Cache language service
- Incremental type checking
- Lazy evaluation of chains

### Runtime Performance

**Concern:** Test suite execution time

**Impact:**

- Compile-time assertions: zero runtime cost
- Benchmarking: significant overhead (must recompile)
- Completion testing: moderate overhead (language service)

**Strategies:**

- Run benchmarks separately (`pnpm test:types:bench`)
- Cache results between runs
- Parallel execution where possible

### Bundle Size

**Concern:** Type testing library increases package size

**Current:** ~50KB (types only)
**With fluent API:** +10KB
**With compiler integration:** +2MB (TypeScript)

**Mitigation:**

- Compiler features optional (peer dependency)
- Tree-shaking friendly
- Separate packages (`@kit/test`, `@kit/test-bench`)

---

## Testing the Type Tester

**Meta-question:** How do we test the type testing library?

### Approach 1: Dogfooding

Use Kit's type tester to test itself:

```typescript
// Test that exact() works correctly
Test.exact<typeof Test.exact, AssertionFn<ExactKind>>()

// Test that sub() catches errors
// @ts-expect-error Should fail
Test.sub<string, number>()
```

### Approach 2: Integration Tests

Test against known good/bad types:

```typescript
test('exact matches structural equality', () => {
  // Should compile (good types)
  Test.exact<string, string>()
  Test.exact<{ a: 1 }, { a: 1 }>()

  // Should error (bad types)
  // @ts-expect-error
  Test.exact<string, number>()
  // @ts-expect-error
  Test.exact<{ a: 1 }, { a: 2 }>()
})
```

### Approach 3: Compiler Tests

Run TypeScript compiler and assert on diagnostics:

```typescript
function testTypeErrors(code: string): Diagnostic[] {
  const program = ts.createProgram([...], {})
  return ts.getPreEmitDiagnostics(program)
}

test('sub generates error for non-subtypes', () => {
  const diagnostics = testTypeErrors(`
    import { Test } from '@kit/ts'
    Test.sub<string, number>()
  `)

  expect(diagnostics).toHaveLength(1)
  expect(diagnostics[0].messageText).toContain('does not extend')
})
```

### Approach 4: Snapshot Testing

Capture error messages and snapshot:

```typescript
test('error messages are helpful', () => {
  const error = getTypeError(`Test.exact<string, number>()`)

  expect(error).toMatchSnapshot(`
    Types are not exactly equal
    EXPECTED: string
    ACTUAL: number
  `)
})
```

**Recommendation:** All four! Comprehensive testing at multiple levels

---

## Next Steps

1. **Prototype fluent API** - Build minimal version for validation
2. **Benchmark current tests** - Measure compile time baseline
3. **User research** - What do Kit users need most?
4. **RFC process** - Detailed design doc for each major feature
5. **Incremental rollout** - Ship fluent API first, advanced features later

---

## Open Questions

1. **Should we auto-generate fluent API from HKT definitions?**
   - Could reduce duplication
   - But: more magic, harder to debug

2. **How to handle branded types?**
   - Current: works transparently
   - Fluent: might break with `.branded` workaround

3. **Integration with vitest?**
   - Should Kit's `expectTypeOf` be compatible with Vitest's?
   - Same API? Superset?

4. **Naming:**
   - `expectTypeOf` vs `expect` vs `assertType`?
   - `toEqualTypeOf` vs `toEqual` vs `equals`?

5. **Documentation strategy:**
   - Separate docs for each API?
   - Migration guide?
   - Video tutorials?

---

## Conclusion

Kit's type testing library has a **solid foundation** with superior type relationship analysis. By adding:

- **Fluent API** (ergonomics)
- **Attest features** (innovation)
- **Novel features** (differentiation)

We can create the **best-in-class** TypeScript type testing experience.

The key is balancing **precision** (Kit's strength) with **convenience** (ecosystem's strength), resulting in a library that's both powerful and pleasant to use.

**Estimated effort:** 8-12 weeks for full implementation
**Risk:** Medium (architectural changes, tooling integration)
**Reward:** High (best type testing library in ecosystem)

---

**Next:** Wait for feedback on issue #10, then begin prototyping Phase 1.
