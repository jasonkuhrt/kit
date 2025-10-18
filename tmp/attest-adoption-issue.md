# Evaluate Attest (ArkType) for Type Testing - Integration Analysis

**Related:** #10 (Type Testing Library Enhancement)
**Type:** Research & Decision
**Priority:** P3 (Nice to have, not urgent)

---

## 🎯 Purpose

Evaluate whether Kit should adopt [Attest](https://github.com/arktypeio/arktype/tree/main/ark/attest) (ArkType's type testing framework) or implement its breakthrough features into our existing type testing infrastructure.

**TL;DR Recommendation:** ❌ Don't adopt Attest directly, ✅ but implement its best features in Kit (aligned with #10 roadmap).

---

## 📖 Background

While researching type testing libraries for #10, I discovered **Attest**, ArkType's experimental testing framework with several unique features:

1. 🔥 **Type instantiation benchmarking** - Measure compiler performance
2. 🔥 **Completion snapshotting** - Test IDE autocomplete behavior
3. 🔥 **JSDoc assertions** - Verify documentation propagation
4. 🔥 **Type snapshots** - Jest-like snapshots for types
5. 🔥 **Simultaneous runtime+type testing** - Both checked in one assertion

**Question:** Should we use Attest, or build these features ourselves?

---

## ⚙️ How Attest Works (Technical Architecture)

Understanding Attest's implementation reveals why it can do things other libraries can't.

### Setup & Execution Flow

Attest uses a **global setup/teardown pattern** that differs fundamentally from traditional test libraries:

**Configuration:**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: ['setupVitest.ts'],
  },
})

// setupVitest.ts
import { setup } from '@ark/attest'
export default () => setup({})
```

### Three-Phase Architecture

#### Phase 1: Setup (Before Tests)

- **Scans codebase** for all `attest()` calls using static analysis
- **Extracts types** using the TypeScript Compiler API
- **Pre-caches type data** in `.attest/` directory
- **No TSServer per test** - All type information is cached upfront
- **Performance benefit**: Tests run fast because types are pre-computed

#### Phase 2: Test Execution

- Tests reference pre-cached type data (not re-computing types)
- For benchmarks: triggers `tsc --generateTrace` to create trace files
- Generates `trace.json` files in `.attest/` directory
- Runtime assertions execute normally

#### Phase 3: Analysis

- Uses Microsoft's `@typescript/analyze-trace` package
- Parses `trace.json` to identify type instantiation hotspots
- CLI commands:
  - `attest stats` - Show type instantiation summary
  - `attest trace` - Generate detailed trace analysis
- Output viewable at [perfetto.dev](https://perfetto.dev) (Chrome tracing visualizer)

### Key Technical Innovations

**1. TypeScript Compiler API Integration**

- Direct access to TypeScript's type checker
- Extracts type information without running TSServer
- Enables features like JSDoc extraction, completion simulation

**2. Type Pre-Caching**

- Scan once, test many times
- Eliminates redundant type computation
- Makes large test suites feasible

**3. Trace-Based Benchmarking**

- Uses `tsc --generateTrace` (official TypeScript flag)
- Same mechanism TypeScript team uses for performance analysis
- Reliable, standardized measurements

**4. Completion Snapshotting via Language Service API**

- Programmatically queries TypeScript Language Service
- Simulates IDE autocomplete behavior
- Tests what developers actually see

### Performance Characteristics

**Traditional approach (tsd, expect-type):**

```
For each test:
  1. TSServer checks types
  2. Compile-time only (no runtime overhead)
  3. Fast for small test suites
  4. Slows down with many tests (O(n) TSServer invocations)
```

**Attest's approach:**

```
Setup phase (once):
  1. Scan all tests (fast)
  2. Pre-cache all types (one-time cost)
  3. Store in .attest/ (persistent)

Test phase (per test):
  1. Read from cache (fast)
  2. No type re-computation
  3. O(1) per test after setup
```

**Trade-off:**

- Higher upfront cost (setup phase)
- Much faster iteration once set up
- Enables features impossible with per-test type checking

### Why This Enables Unique Features

**Benchmarking:** Direct access to `--generateTrace` output

**Completions:** Language Service API queries

**JSDoc:** Compiler API extracts documentation

**Snapshots:** Can serialize and store type representations

These features require going beyond what `tsc` alone provides, which is why traditional libraries can't do them.

---

## 🔬 Analysis Summary

I've created a comprehensive analysis comparing Kit's current approach with Attest's features, including real translations of Kit's tests.

**Document:** `tmp/attest-integration-examples.md` (2000+ words)

**Key sections:**

- Setup & installation comparison
- Basic type assertions side-by-side
- Attest's 5 unique features with examples
- Real Kit tests translated to both syntaxes
- Integration challenges
- Feature-by-feature trade-off analysis
- Detailed recommendations

---

## 🏆 What Attest Does Better

### 1. Type Instantiation Benchmarking

**Attest:**

```typescript
import { bench } from '@ark/attest'

bench('complex type transformation', () => {
  return {} as DeepReadonly<ComplexNestedType>
}).types([234, 'instantiations'])
//          ^^^  Snapshot - fails if significantly changes
```

**Kit:**

```typescript
// ❌ No equivalent feature
```

**Use cases in Kit:**

- Benchmark `GetRelation` type utility performance
- Ensure refactoring doesn't regress compilation speed
- Set CI budgets for type complexity
- Identify type instantiation hotspots

---

### 2. Completion Snapshotting

**Attest:**

```typescript
test('string literal union completions', () => {
  type Status = 'pending' | 'complete' | 'failed'

  // @ts-expect-error (intentional for completion test)
  attest(() => {
    const x: Status = ''
    //                ^ Test completions at cursor
  }).completions({
    '': ['pending', 'complete', 'failed'],
  })
})
```

**Kit:**

```typescript
// ❌ No equivalent feature
```

**Use cases in Kit:**

- Test `Str.Case` conversion types show correct completions
- Validate template literal types work in autocomplete
- Ensure branded types don't break IDE suggestions
- Verify discriminated unions suggest correct keys

---

### 3. JSDoc Assertions

**Attest:**

```typescript
test('JSDoc propagation', () => {
  const T = type({
    /** The user's unique identifier */
    id: 'string',

    /** @deprecated Use email instead */
    username: 'string',
  })

  // Test that JSDoc is preserved through transformations
  attest(T.infer.id).jsdoc.includes('unique identifier')
  attest(T.infer.username).jsdoc.includes('@deprecated')
})
```

**Kit:**

```typescript
// ❌ No equivalent feature
```

**Use cases in Kit:**

- Ensure JSDoc on type utilities is preserved
- Test that mapped types maintain documentation
- Validate hover text in IDE shows correct info

---

### 4. Type Snapshots

**Attest:**

```typescript
test('complex type inference', () => {
  // Snapshot the inferred type (like Jest snapshots)
  attest(someComplexFunction).type.toString.snap(`
    <T extends object>(input: T) => {
      readonly data: T
      readonly metadata: {
        timestamp: number
        version: string
      }
    }
  `)
})
```

**Kit:**

```typescript
// ❌ No equivalent feature
// We have pass/fail only, no regression snapshots
```

**Use cases:**

- Catch unintended type changes in refactoring
- Document expected complex type shapes
- Regression testing for utility types

---

### 5. Simpler Syntax

**Attest:**

```typescript
attest<string>('hello') // Simple, one function
```

**Kit:**

```typescript
Ts.Assert.sub<string>()('hello') // Two-step, explicit
```

**Trade-off:** Attest is shorter, Kit is more precise (exact/equiv/sub/sup).

---

## ⚔️ What Kit Does Better

### 1. Type Relationship Precision (CRITICAL)

**Kit:**

```typescript
// Distinguish between different relationships
Ts.Assert.exact<T, U>() // Structural equality (strict)
Ts.Assert.equiv<T, U>() // Mutual assignability (semantic)
Ts.Assert.sub<T, U>() // Subtype relationship
Ts.Assert.sup<T, U>() // Supertype relationship

// This precision is UNIQUE to Kit
```

**Attest:**

```typescript
attest<T>(value) // Only checks assignability
// ❌ No way to distinguish exact vs equiv vs sub
```

**Analysis:** Kit's type relationship analysis is sophisticated and valuable. **This is our differentiator.**

---

### 2. Excess Property Detection (UNIQUE)

**Kit:**

```typescript
test('catch config typos', () => {
  type QueryOptions = { limit?: number; offset?: number }

  // Catches typo: "offest" instead of "offset"
  // @ts-expect-error - Excess property!
  Ts.Assert.subNoExcess<QueryOptions>()({ limit: 10, offest: 20 })

  // Correct spelling passes
  Ts.Assert.subNoExcess<QueryOptions>()({ limit: 10, offset: 20 })
})
```

**Attest:**

```typescript
// ❌ No subNoExcess equivalent
// This typo would pass in Attest (assignability allows excess)
attest<QueryOptions>({ limit: 10, offest: 20 }) // ✓ Passes (wrong!)
```

**Analysis:** Kit's `subNoExcess` catches real bugs that Attest misses. **Extremely valuable feature.**

---

### 3. Property-Specific Testing

**Kit:**

```typescript
Ts.Assert.propertiesSub<{ name: string }, User>()
Ts.Assert.propertiesExact<{ role: 'admin' | 'user' }, User>()
Ts.Assert.propertiesEquiv<{ count: number }, User>()
```

**Attest:**

```typescript
// ❌ No equivalent - must test entire object
```

---

### 4. Negative Assertions

**Kit:**

```typescript
Ts.Assert.Not.promise<number>() // Assert NOT a Promise
Ts.Assert.Not.array<string>() // Assert NOT an array
Ts.Assert.Not.sub<T, U>() // Assert U doesn't extend T
```

**Attest:**

```typescript
// ⚠️ Limited negative testing
```

---

### 5. Type Relationship Analysis

**Kit:**

```typescript
type Rel = Ts.GetRelation<T, U>
// Returns: 'equivalent' | 'subtype' | 'supertype' | 'overlapping' | 'disjoint'

// Test edge cases
test('GetRelation with edge cases', () => {
  type T1 = Ts.GetRelation<never, never> // 'equivalent'
  type T2 = Ts.GetRelation<string, never> // 'subtype'
  type T3 = Ts.GetRelation<never, string> // 'supertype'

  const _t1: T1 = 'equivalent'
  const _t2: T2 = 'subtype'
  const _t3: T3 = 'supertype'
})
```

**Attest:**

```typescript
// ❌ No GetRelation equivalent
// ❌ No type relationship analysis
```

**Analysis:** This is sophisticated type theory that Attest doesn't have. **Unique to Kit.**

---

### 6. Stability & Maturity

**Kit:**

- ✅ Battle-tested in real projects
- ✅ Stable API
- ✅ Comprehensive documentation
- ✅ Well-understood patterns

**Attest:**

- ⚠️ **Alpha status**: "This package is still in alpha! Your feedback will help us iterate toward a stable 1.0."
- ⚠️ API may change
- ⚠️ Limited real-world usage (~5 dependents, mostly ArkType internal)
- ⚠️ Sparse documentation

---

## 🔴 Integration Challenges

### 1. Philosophy Mismatch

**Kit's Philosophy:**

- Pure compile-time testing
- Type relationships (exact/equiv/sub)
- Zero runtime overhead
- Explicit semantics

**Attest's Philosophy:**

- Runtime + compile-time (isomorphic)
- Type snapshots (regression testing)
- Runtime validation library focus
- Simpler syntax, less precision

**Conflict:** These are fundamentally different approaches. Kit users expect compile-time purity.

---

### 2. Alpha Instability

```
⚠️ WARNING: Alpha software
"This package is still in alpha! Your feedback will help us
iterate toward a stable 1.0."
```

**Risks:**

- API breaking changes
- Bugs and edge cases
- Limited community support
- Maintenance burden

**Recommendation:** Too risky for production use.

---

### 3. Missing Kit's Core Features

Attest **cannot replace** Kit's core features:

- ❌ No `exact` vs `equiv` vs `sub` distinction
- ❌ No `subNoExcess` (excess property detection)
- ❌ No `GetRelation` (type relationship analysis)
- ❌ No property-specific testing
- ❌ No negative assertions namespace

**Conclusion:** Attest is not a replacement, it's complementary at best.

---

### 4. Additional Dependency

**Current:** Kit has no type testing dependencies (pure TypeScript)

**With Attest:**

```json
{
  "devDependencies": {
    "@ark/attest": "^0.48.2" // Alpha package
  }
}
```

**Concerns:**

- Bundle size increase
- Dependency on alpha software
- Potential security issues (less vetted)
- Breaking changes in future versions

---

## 📊 Feature Comparison Matrix

| Feature                             | Kit                    | Attest               | Winner        | Notes                |
| ----------------------------------- | ---------------------- | -------------------- | ------------- | -------------------- |
| **Type relationship precision**     | ✅ exact/equiv/sub/sup | ⚠️ Assignability only | 🏆 **Kit**    | Kit's differentiator |
| **Excess property detection**       | ✅ `subNoExcess`       | ❌ None              | 🏆 **Kit**    | Catches typos        |
| **Type relationship analysis**      | ✅ `GetRelation`       | ❌ None              | 🏆 **Kit**    | Unique to Kit        |
| **Property-specific testing**       | ✅ properties* helpers | ❌ None              | 🏆 **Kit**    | Granular testing     |
| **Negative assertions**             | ✅ `Not.*` namespace   | ⚠️ Limited            | 🏆 **Kit**    | Comprehensive        |
| **Stability**                       | ✅ Stable              | ⚠️ Alpha              | 🏆 **Kit**    | Production ready     |
| **Documentation**                   | ✅ Comprehensive       | ⚠️ Sparse             | 🏆 **Kit**    | Well documented      |
|                                     |                        |                      |               |                      |
| **Type instantiation benchmarking** | ❌ None                | ✅ Built-in          | 🏆 **Attest** | Unique feature       |
| **Completion snapshotting**         | ❌ None                | ✅ Built-in          | 🏆 **Attest** | Unique feature       |
| **JSDoc assertions**                | ❌ None                | ✅ Built-in          | 🏆 **Attest** | Unique feature       |
| **Type snapshots**                  | ❌ None                | ✅ Built-in          | 🏆 **Attest** | Regression testing   |
| **Runtime + type testing**          | ❌ Compile-time only   | ✅ Isomorphic        | 🏆 **Attest** | For validators       |
| **Syntax brevity**                  | ⚠️ `sub<T>()(v)`        | ✅ `attest<T>(v)`    | 🏆 **Attest** | Shorter              |

**Score:** Kit wins on **core type testing** (6-0), Attest wins on **innovative features** (6-0)

**Conclusion:** They excel in different areas. Not competitors, but complementary.

---

## 🎯 Recommendations

### ❌ Option 1: Don't Adopt Attest

**DON'T:** Use Attest as Kit's type testing solution

**Reasons:**

1. Alpha status too risky for production
2. Philosophy mismatch (runtime vs compile-time)
3. Missing Kit's core features (exact/equiv/sub, subNoExcess)
4. Kit's approach is superior for type relationships
5. Additional dependency on unstable package

---

### ⚠️ Option 2: Use Attest for Specific Features (Hybrid)

**Selective adoption:** Use Attest only for features Kit lacks

**Use Attest for:**

- 🟢 Type instantiation benchmarking
- 🟢 Completion snapshotting
- 🟢 JSDoc assertions

**Use Kit for:**

- 🟢 All type relationship testing
- 🟢 Excess property detection
- 🟢 Property-specific assertions
- 🟢 Negative assertions

**Example:**

```typescript
// Kit for precision
type _ = Ts.Assert.Cases<
  Ts.Assert.exact<Expected, Actual>,
  Ts.Assert.subNoExcess<Config, Value>
>

// Attest for benchmarking
bench('type complexity', () => {
  return {} as ComplexType
}).types([150, 'instantiations'])
```

**Pros:**

- Best of both worlds
- Use each tool's strengths

**Cons:**

- Two different syntaxes to learn
- Dependency on alpha software
- Potential API conflicts
- Complexity in docs and examples

**Verdict:** Possible but awkward, not recommended.

---

### ✅ Option 3: Implement Attest Features in Kit (RECOMMENDED)

**Best approach:** Learn from Attest, build features into Kit

**Roadmap (aligned with #10):**

#### Phase 1: Ergonomics (2-3 weeks)

```typescript
// Fluent API (from #10)
Ts.Assert.expect(value).toBeString()
Ts.Assert.expect(fn).returns.toBeNumber()
```

#### Phase 2: Attest-Inspired Features (3-4 weeks)

```typescript
// Type instantiation benchmarking
Ts.Assert.bench('complex type', () => {
  return {} as ComplexTransform<T>
}).snapshots({
  instantiations: 150,
  maxInstantiations: 200,
})

// Completion snapshotting
Ts.Assert.completions<Status>()
  .at({ key: 'status' })
  .expects(['pending', 'complete', 'failed'])

// JSDoc assertions
Ts.Assert.jsdoc(Type.properties.id)
  .includes('unique identifier')

// Type snapshots
Ts.Assert.snapshot(complexType)
  .expect('ComplexReturn<T>')
```

#### Phase 3: Novel Features (4-6 weeks)

```typescript
// Features no one has (from #10)
Ts.Assert.diff<Expected, Actual>()  // Visual diff
Ts.Assert.algebraic<Union>().commutative()
Ts.Assert.coverage('./src').expectMinimum(0.9)
Ts.Assert.fuzzing<DeepReadonly>().property(...)
```

**Benefits:**

- ✅ Keep Kit's precision (exact/equiv/sub)
- ✅ Add Attest's innovations (benchmarking, completions)
- ✅ Add novel features (diffs, coverage, fuzzing)
- ✅ Single consistent API
- ✅ No alpha dependency
- ✅ Full control over implementation
- ✅ **Best-in-class result**

**Drawbacks:**

- 🔴 Significant implementation effort (8-12 weeks)
- 🔴 Need TypeScript Compiler API integration
- 🔴 Maintenance burden

**Verdict:** This creates the best type testing library in the ecosystem!

---

## 🚀 Proposed Action

### Immediate: Close as "Won't Do" with clarification

**Decision:** Don't adopt Attest directly.

**Rationale:**

1. Alpha status too risky
2. Philosophy doesn't align with Kit
3. Kit's core features are superior
4. Attest can't replace Kit's type relationship testing

### Future: Implement inspired features (Issue #10)

**Follow #10 roadmap:**

- **Phase 1:** Fluent API (weeks 1-2)
- **Phase 2:** Attest-inspired features (weeks 3-5)
  - Type instantiation benchmarking
  - Completion snapshotting
  - JSDoc assertions
  - Type snapshots
- **Phase 3:** Novel features (weeks 6-12)
  - Type diffs, algebraic testing, coverage, etc.

**Result:** Kit becomes the best type testing library by combining:

- Kit's precision (exact/equiv/sub/subNoExcess)
- Attest's innovations (benchmarking, completions)
- Novel features (diffs, coverage, fuzzing)

---

## 📚 References

**Primary Analysis:**

- `tmp/attest-integration-examples.md` - Comprehensive 2000+ word analysis

**Related Issues:**

- #10 - Type Testing Library Enhancement (main roadmap)

**External Links:**

- Attest: https://github.com/arktypeio/arktype/tree/main/ark/attest
- ArkType: https://arktype.io/
- Attest npm: https://www.npmjs.com/package/@ark/attest

---

## 💬 Discussion Points

1. **Are there any Attest features I missed** that would change the recommendation?

2. **Should we reach out to ArkType team** for collaboration/feedback before building our own?

3. **Is the 8-12 week effort justified** for implementing these features?

4. **Should we prioritize any Attest-inspired features** over the novel features in #10?

5. **Would anyone use the hybrid approach** (both Kit and Attest)?

---

## ✅ Success Criteria

This issue is resolved when we:

1. ✅ Make a decision: Adopt, hybrid, or build our own
2. ✅ Document the decision and rationale
3. ✅ Update #10 roadmap if needed
4. ✅ Create specific implementation issues for chosen features

---

**Labels:** research, decision, type-testing, wont-do
**Linked Issues:** #10
**Priority:** P3 (Not urgent, but important for long-term direction)
**Effort:** Small (decision only, implementation tracked in #10)
