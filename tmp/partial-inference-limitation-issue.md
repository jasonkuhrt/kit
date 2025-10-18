# [Blocked] Ideal Type Testing API Prevented by TypeScript Partial Inference Limitation

## 🎯 Summary

Kit's type testing API currently requires currying: `Ts.Assert.sub<string>()(value)` instead of the more natural `Ts.Assert.sub<string>(value)`. This is due to a fundamental TypeScript limitation: **no partial type parameter inference**.

This issue documents why we can't have the ideal API today and should be reopened if TypeScript ever adds this feature.

---

## ❌ What We Want (Doesn't Work)

```typescript
// Ideal API - specify Expected, infer Actual
Ts.Assert.sub<string>(value)
Ts.Assert.exact<User>(result)
Ts.Assert.equiv<Config>(input)

// ✗ Error: TypeScript can't infer `value`'s type when we provide `string`
```

---

## ✅ What We Have (Works)

```typescript
// Current API - currying workaround
Ts.Assert.sub<string>()(value)
Ts.Assert.exact<User>()(result)
Ts.Assert.equiv<Config>()(input)

// ✓ Works: Two calls allow separate inference contexts
```

---

## 🔬 The Technical Problem

TypeScript's type inference follows an **all-or-nothing rule**:

```typescript
function test<Expected, Actual>(actual: Actual): void {
  // Check if Actual extends Expected
}

// DOESN'T WORK:
test<string>(value)
// ❌ Error: Expected 2 type arguments, but got 1

// MUST DO THIS:
test<string, typeof value>(value)
// ✓ But defeats the purpose - we want Actual inferred!

// OR THIS (currying):
function test<Expected>() {
  return <Actual>(actual: Actual) => {
    // Check if Actual extends Expected
  }
}

test<string>()(value)
// ✓ Works: Expected is explicit, Actual is inferred
```

**Why?** TypeScript compiler only allows two patterns:

1. Provide **all** type parameters explicitly
2. Let TypeScript infer **all** type parameters

There is no way to say "infer some, I'll provide others."

---

## 📚 TypeScript Proposals

This limitation is well-known and highly requested:

### Issue #26242 (2018 - Still Open)

**Proposal: Partial Type Argument Inference**

- 🔗 https://github.com/microsoft/TypeScript/issues/26242
- ⭐ 950+ reactions
- 💬 100+ comments
- **Status:** Open, no timeline

**Proposed syntax:**

```typescript
function test<Expected, infer Actual>(actual: Actual) { ... }
test<string>(value)  // Would infer Actual
```

### Issue #53999 (2023 - Still Open)

**New type param modifier to allow for partial inference**

- 🔗 https://github.com/microsoft/TypeScript/issues/53999
- ⭐ 200+ reactions
- **Status:** Open, being discussed

**Proposed syntax:**

```typescript
function test<Expected, ? Actual>(actual: Actual) { ... }
test<string>(value)  // ? means "infer this"
```

---

## 🛠️ Workarounds Evaluated

### 1. Currying (Current Solution) ✅

```typescript
const sub = <Expected>() => <Actual>(actual: Actual) => { ... }
sub<string>()(value)
```

**Pros:**

- ✅ Works reliably
- ✅ Type-safe
- ✅ Clear separation of concerns

**Cons:**

- ❌ Verbose: `<T>()(v)` instead of `<T>(v)`
- ❌ Unusual syntax
- ❌ Extra function call (negligible perf cost)

---

### 2. Value-First API (expect-type approach)

```typescript
expectTypeOf(value).toEqualTypeOf<string>()
```

**Pros:**

- ✅ Natural reading order
- ✅ No currying needed
- ✅ Fluent chaining

**Cons:**

- ❌ Can't specify Expected first
- ❌ Different paradigm than Kit's type-first approach
- ❌ Less precise for exact/equiv/sub distinction

**Note:** This is being added in #10 as complementary API, not replacement.

---

### 3. Overloads (Doesn't Solve It)

```typescript
function test<Expected, Actual>(actual: Actual): void
function test<Expected>(actual: any): void
function test(actual: any): void { ... }

test<string>(value)
// ❌ Still doesn't work - overloads don't help with partial inference
```

---

### 4. Helper Types (Not Applicable)

```typescript
type Test<Expected, Actual = never> = ...

// This works for types but not functions
type Result = Test<string, typeof value>
```

---

## 🔮 Future: If TypeScript Adds This Feature

When/if TypeScript implements partial inference (#26242 or #53999), we should:

### 1. Add Non-Curried API

```typescript
// New: Direct call (if TS supports it)
Ts.Assert.sub<string>(value)
Ts.Assert.exact<User>(result)

// Legacy: Curried (keep for compatibility)
Ts.Assert.sub<string>()(value)
Ts.Assert.exact<User>()(result)

// Both would coexist for a deprecation period
```

### 2. Update Documentation

````typescript
/**
 * Assert that a value's type extends the expected type.
 *
 * @example
 * ```ts
 * // Modern (requires TS 5.x+):
 * Ts.Assert.sub<string>(value)
 *
 * // Legacy (all versions):
 * Ts.Assert.sub<string>()(value)
 * ```
 */
````

### 3. Migration Path

```
Version X.0: Add non-curried API
Version X+1.0: Deprecate curried API
Version X+2.0: Remove curried API (breaking)
```

---

## 📖 How Other Libraries Handle This

| Library         | Solution          | Syntax                                            |
| --------------- | ----------------- | ------------------------------------------------- |
| **Kit**         | Currying          | `sub<T>()(v)`                                     |
| **tsd**         | Currying          | `expectType<T>(v)` (also curried internally)      |
| **expect-type** | Value-first       | `expectTypeOf(v).toEqualTypeOf<T>()`              |
| **Attest**      | Generic inference | `attest<T>(v)` (assigns, doesn't infer precisely) |

**Observation:** Everyone either:

1. Uses currying/workarounds
2. Changes API paradigm (value-first, less precise)

No one has solved this because **TypeScript doesn't support it**.

---

## 🎯 Current Recommendation

**Accept the currying pattern as necessary workaround** until TypeScript changes:

```typescript
// Current best practice
Ts.Assert.sub<string>()(value)
Ts.Assert.exact<User>()(result)

// Add fluent API as alternative (#10)
Ts.Assert.expect(value).toBeString()
Ts.Assert.expect(result).toEqualTypeOf<User>()
```

**Why both?**

- Curried: Precise type relationships (exact/equiv/sub)
- Fluent: Better DX for common cases
- Let users choose based on needs

---

## 📋 Action Items

- [x] Document the limitation (this issue)
- [ ] Watch TypeScript issues #26242 and #53999
- [ ] Revisit when/if TypeScript adds partial inference
- [ ] Add fluent API as alternative (#10)
- [ ] Add comment in `helpers.ts` linking to this issue

---

## 🔗 References

**TypeScript Issues:**

- [#26242 - Partial Type Argument Inference](https://github.com/microsoft/TypeScript/issues/26242) (2018, 950+ 👍)
- [#53999 - New type param modifier](https://github.com/microsoft/TypeScript/issues/53999) (2023, 200+ 👍)

**Articles:**

- [Total TypeScript - Partial Inference Problem](https://www.totaltypescript.com/workshops/typescript-generics/advanced-generics/the-partial-inference-problem/solution)
- [Medium - Partial Type Argument Inference Workarounds](https://medium.com/@nandin-borjigin/partial-type-argument-inference-in-typescript-and-workarounds-for-it-d7c772788b2e)
- [Stack Overflow - TypeScript Partial Type Inference](https://stackoverflow.com/questions/63678306/typescript-partial-type-inference)

**Related Kit Issues:**

- #10 - Type Testing Library Enhancement (fluent API as alternative)

---

## 💡 Key Insight

**This is not a Kit limitation - it's a TypeScript limitation.**

Every TypeScript library faces this same problem. The currying pattern is a well-established workaround that:

- ✅ Works reliably across all TS versions
- ✅ Maintains type safety
- ✅ Is understood by TS-savvy users

The verbosity is unfortunate, but unavoidable until TypeScript itself changes.

---

**Status:** Blocked (waiting on TypeScript)
**Labels:** blocked, typescript-limitation, documentation, wont-fix-now
**Priority:** P4 (Document only, revisit if TS changes)
**Linked Issues:** #10 (fluent API as alternative)

---

## 📌 Reopen This Issue If:

1. ✅ TypeScript merges #26242 or #53999
2. ✅ TypeScript adds any form of partial inference
3. ✅ New workaround discovered that maintains type precision

Otherwise, this is **working as intended** given TypeScript's current limitations.
