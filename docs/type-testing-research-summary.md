# Type Testing Library Research - Summary & Links

**Date:** 2025-01-13
**GitHub Issue:** [#10 - Type Testing Library Enhancement](https://github.com/jasonkuhrt/kit/issues/10)
**Status:** Research Complete, Awaiting Implementation Decision

---

## Quick Links

- **Main Enhancement Issue:** [#10 - Type Testing Library Enhancement](https://github.com/jasonkuhrt/kit/issues/10)
- **Attest Evaluation:** [#12 - Evaluate Attest for Type Testing](https://github.com/jasonkuhrt/kit/issues/12)
- **TypeScript Limitation:** [#13 - Partial Inference Limitation](https://github.com/jasonkuhrt/kit/issues/13) (explains `<T>()(v)` pattern)
- **Deep Analysis:** `../tmp/type-testing-deep-analysis.md`
- **Attest Integration Examples:** `../tmp/attest-integration-examples.md`
- **Current Implementation:** `../src/utils/ts/test/`

---

## Executive Summary

Comprehensive competitive analysis of TypeScript type testing libraries reveals **Kit has superior type-relationship analysis** but lacks **ergonomic fluent API** that makes competitors popular. Opportunity to combine Kit's precision with ecosystem's convenience, plus add breakthrough features from Attest and 15+ novel ideas.

---

## Libraries Analyzed

### 1. **tsd** (Sindre Sorhus)

- ⭐ 109 npm dependents
- CLI-based, static analysis
- Battle-tested (DefinitelyTyped)
- **Weakness:** 2.6MB size, poor generic/any/never handling

### 2. **expect-type** (mmkal)

- ⭐ 26 npm dependents, core of Vitest
- Fluent chainable API
- Lightweight, zero runtime
- **Strength:** Ergonomics - `expectTypeOf(value).toBeString()`

### 3. **Vitest's expectTypeOf**

- Most popular modern approach
- Same as expect-type, integrated with test runner
- **Strength:** Co-location of type and runtime tests

### 4. **Attest** (ArkType - Alpha)

- 🔥 **Type instantiation benchmarking** - measure compiler performance
- 🔥 **Completion snapshotting** - test IDE autocomplete
- 🔥 **JSDoc assertions** - verify documentation
- 🔥 **Simultaneous runtime+type** - both checked at once
- **Innovation leader**

---

## Kit's Current State

### Strengths ✅

- **Superior type relationships:** `exact`, `equiv`, `sub`, `sup`, `subNoExcess`
- **Advanced architecture:** HKT pattern, GetRelation utility
- **Excellent errors:** StaticErrorAssertion with MESSAGE/EXPECTED/ACTUAL/TIP
- **Rich coverage:** Property testing, special types, negative assertions, const variants
- **Dual modes:** Type-level `Cases<>` and value-level testing

### Critical Gap ⚠️

**Ergonomics** - Lacks fluent API and type-specific matchers

```typescript
// Current (powerful but verbose)
Ts.Assert.sub<string>()(value)
Ts.Assert.parameters<[number, number]>()(fn)

// Ecosystem (discoverable, intuitive)
expectTypeOf(value).toBeString()
expectTypeOf(fn).parameter(0).toBeNumber()
```

---

## Top 10 Gaps vs Ecosystem

| Gap                                           | Priority    | Impact                     |
| --------------------------------------------- | ----------- | -------------------------- |
| 1. Fluent/chainable API                       | 🔥 Critical | High - DX, discoverability |
| 2. Type-specific matchers (.toBeString, etc.) | 🔥 High     | High - convenience         |
| 3. Function helpers (.parameter(n))           | 🔥 High     | Medium - granular testing  |
| 4. Union operations (.extract/.exclude)       | 🔥 Medium   | High - union testing       |
| 5. Promise .resolves                          | 🔥 Medium   | Medium - consistency       |
| 6. Property access (.toHaveProperty)          | 💡 Lower    | Low - syntax sugar         |
| 7. Doc/deprecation checks                     | 💡 Lower    | Very Low - niche           |
| 8. Branded type comparison                    | 💡 Lower    | None - Kit already good    |
| 9. Simpler mental model                       | 💡 Medium   | Medium - learning curve    |
| 10. Test runner integration                   | 💡 Medium   | Medium - convenience       |

---

## 15 Novel Ideas (Never Been Done)

These could make Kit **best-in-class**:

1. **Type transformation testing** - Test round-trips, preservations
2. **Type inference quality metrics** - Score specificity (avoid `any` pollution)
3. **Type diff visualization** - Git-style diffs for mismatches
4. **Algebraic property testing** - Verify commutativity, associativity, distributivity
5. **Type complexity scoring** - Warn on overly complex types, set budgets
6. **Bidirectional runtime/type** - Ensure validators match types (Zod, ArkType)
7. **Type evolution tracking** - Breaking change detection, semver for types
8. **Interactive type REPL** - Explore relationships interactively
9. **Type-level fuzzing** - Property-based testing with random type generation
10. **Type contract testing** - Verify implementations satisfy contracts
11. **Type coverage metrics** - Like code coverage but for types (% with non-any)
12. **Variance testing** - Explicit co/contra/invariance verification
13. **Type soundness verification** - Prevent unsound operations
14. **Gradual typing support** - Help migrate from `any` to specific types
15. **Type dependency graph** - Visualize type relationships, detect circularity

---

## Implementation Roadmap

### Phase 1: Ergonomic Foundations (2-3 weeks)

**Goal:** Match expect-type's convenience

1. **Fluent API wrapper** - `expectTypeOf(value).toBeString()`
2. **Type-specific matchers** - 20+ methods (toBeNumber, toBeArray, etc.)
3. **Function helpers** - `.returns`, `.parameter(n)`, `.parameters`
4. **Keep existing API** - Backward compatible, both coexist

**Impact:** High - Makes type testing intuitive and discoverable

---

### Phase 2: Attest-Inspired (3-4 weeks)

**Goal:** Add breakthrough features

5. **Type instantiation benchmarking**
   ```typescript
   Test.bench('complex type', () => {
     return {} as ComplexTransform<'input'>
   }).snapshots({ instantiations: 150, maxInstantiations: 200 })
   ```

6. **Completion snapshotting**
   ```typescript
   attest(() => type({ a: 'a' })).completions({
     a: ['any', 'alpha', 'alphanumeric'],
   })
   ```

7. **JSDoc assertions** - Test documentation propagation

**Impact:** Medium-High - Unique features, valuable for library authors

---

### Phase 3: Novel Innovations (4-6 weeks)

**Goal:** Revolutionary features

8. **Type diff visualization** - Show only differences
9. **Algebraic property testing** - Mathematical laws
10. **Type complexity analysis** - CI budgets
11. **Type-level fuzzing** - Find edge cases

**Impact:** High - Differentiation, best-in-class

---

### Phase 4: Advanced (TBD)

**Goal:** Long-term vision

12. **Type evolution tracking**
13. **Bidirectional runtime/type testing**
14. **Interactive REPL**
15. **Coverage metrics**
16. **Type dependency graphs**

**Impact:** Very High - Ecosystem leadership

---

## Key Design Decisions

### 1. Dual API Approach (Recommended)

Keep both APIs for smooth migration:

```typescript
// Existing API (unchanged)
Ts.Assert.exact<T, U>()
Ts.Assert.sub<T>()(value)

// New fluent API (additive)
expectTypeOf(value).toBeString()
expectTypeOf(value).toEqualTypeOf<T>()
```

**Benefits:**

- ✅ Backward compatible (no breaking changes)
- ✅ Gradual migration path
- ✅ Power users keep precision
- ✅ New users get convenience

---

### 2. Precision vs Convenience

**Kit's strength:** Precise type relationships (exact/equiv/sub)
**Ecosystem's strength:** Convenient API (fluent, discoverable)

**Resolution:** Combine both!

- Fluent API maps to precise implementations
- Document semantics clearly (`.toBeString()` = `sub<string>`)
- Provide both for different use cases

---

### 3. Performance Trade-offs

**Benchmarking:** Heavy overhead (requires compiler), run separately
**Completion testing:** Moderate overhead (language service), cache aggressively
**Fluent API:** Minimal overhead (thin wrapper)

**Strategy:** Make expensive features opt-in, optimize common cases

---

## Technical Architecture

### Current: HKT Pattern

```typescript
interface SubKind {
  parameters: [$Expected, $Actual]
  return: /* conditional type logic */
}

type Apply<Kind, Args> = /* evaluation */
const sub: AssertionFn<SubKind> = runtime
```

**Strengths:** Extensible, type-safe, composable
**Weaknesses:** Complex, not discoverable

---

### Proposed: Hybrid Architecture

```typescript
// Layer 1: HKT Foundation (unchanged)
interface SubKind { /* ... */ }
export type sub<$E, $A> = Apply<SubKind, [$E, $A]>

// Layer 2: Fluent API (new, thin wrapper)
export const expectTypeOf = <$T>(value?: $T) => ({
  toBeString: () => sub<string>()(value as any),
  toBeNumber: () => sub<number>()(value as any),
  returns: /* ... */,
  not: { /* ... */ }
})
```

**Benefits:**

- Keep HKT power for advanced use cases
- Add fluent convenience for common cases
- Minimal duplication (thin wrapper)
- Both APIs maintained

---

## Next Steps

1. **Gather feedback** on issue #10
2. **Decide priorities** - Which phases to implement?
3. **Prototype fluent API** - Validate approach
4. **Create RFCs** - Detailed design for each major feature
5. **Implement incrementally** - Ship Phase 1, iterate

---

## Resources

### Documentation

- **Main Issue:** https://github.com/jasonkuhrt/kit/issues/10
- **Deep Analysis:** See `../tmp/type-testing-deep-analysis.md`
- **Current Tests:** `../src/utils/ts/test/$$.test-d.ts`

### References

- tsd: https://github.com/tsdjs/tsd
- expect-type: https://github.com/mmkal/expect-type
- Vitest: https://vitest.dev/guide/testing-types
- Attest: https://github.com/arktypeio/arktype/tree/main/ark/attest

---

## Estimated Effort

**Total:** 8-12 weeks for full implementation

- Phase 1 (Fluent API): 2-3 weeks
- Phase 2 (Attest features): 3-4 weeks
- Phase 3 (Novel features): 4-6 weeks
- Phase 4 (Advanced): TBD

**Risk:** Medium (architectural changes, tooling integration)
**Reward:** High (best type testing library in ecosystem)

---

## Key Quotes from Research

> "expectTypeOf checks generics properly and strictly, handles any, unknown, and never better than tsd"

> "Attest benchmarks the number of instantiations contributed by any expression - ensuring accurate and performant inference"

> "The fluent API makes the difference between actual and expected clear, helpful with complex types"

---

**Status:** ✅ Research complete, ready for decision and implementation
**Last Updated:** 2025-01-13
**Next Review:** After community feedback on issue #10
