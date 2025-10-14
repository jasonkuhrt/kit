# Using Attest in Kit - Practical Examples

This document shows what using Attest (ArkType's type testing framework) would look like in the Kit project, comparing current tests with Attest equivalents.

---

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Basic Type Assertions](#basic-type-assertions)
3. [Attest's Unique Features](#attests-unique-features)
4. [Real Kit Tests Translated](#real-kit-tests-translated)
5. [Integration Challenges](#integration-challenges)
6. [Trade-offs Analysis](#trade-offs-analysis)

---

## Setup & Installation

### Current Kit Setup

```bash
# Already using Vitest
pnpm add -D vitest
```

```typescript
// src/utils/ts/test/$$.test-d.ts
import { Ts } from '#ts'
import { test } from 'vitest'

test('my types', () => {
  Ts.Test.sub<string>()('hello')
})
```

### Attest Setup

```bash
# Install Attest (alpha)
pnpm add -D @ark/attest

# Optional: Setup script
pnpm attest setup
```

```typescript
// src/utils/ts/test/$$.test-d.ts
import { attest } from '@ark/attest'
import { test } from 'vitest'

test('my types', () => {
  attest<string>('hello') // Both type and runtime assertion
})
```

**Key Difference:** Attest tests types AND runtime values simultaneously.

---

## Basic Type Assertions

### Example 1: Subtype Testing

**Kit's Current Approach:**

```typescript
test('sub (subtype)', () => {
  // Test that 'hello' extends string
  Ts.Test.sub<string>()('hello')

  // Test that object literal extends object
  Ts.Test.sub<object>()({ a: 1 })

  // Should fail - 'world' doesn't extend 'hello'
  // @ts-expect-error
  Ts.Test.sub<'hello'>()('world')
})
```

**Attest Equivalent:**

```typescript
test('sub (subtype)', () => {
  // Attest checks type assignability
  attest<string>('hello') // ✓ 'hello' is assignable to string

  attest<object>({ a: 1 }) // ✓ object literal is assignable

  // Should fail both at type-level and runtime
  // @ts-expect-error
  attest<'hello'>('world') // ✗ Type error AND runtime error
})
```

**Analysis:**

- 🟢 **Attest:** Simpler syntax, single function call
- 🟢 **Kit:** More precise control (sub vs exact vs equiv)
- 🟡 **Attest:** Tests both compile-time AND runtime
- 🟡 **Kit:** Pure compile-time (by design)

---

### Example 2: Exact Type Equality

**Kit's Current Approach:**

```typescript
test('exact (exact structural equality)', () => {
  Ts.Test.exact<string>()('hello')
  Ts.Test.exact<{ a: 1 }>()({ a: 1 } as { a: 1 })

  // @ts-expect-error - Too narrow
  Ts.Test.exact<string | number>()('hello')
})
```

**Attest Equivalent:**

```typescript
test('exact type equality', () => {
  // Attest uses .type property for exact type checks
  attest('hello').type.toString.snap('string')

  attest({ a: 1 }).type.toString.snap('{ a: number }')

  // Or use inline type assertion
  attest<string>('hello')

  // @ts-expect-error
  attest<string | number>('hello') // Type error: string not exact match
})
```

**Analysis:**

- 🟡 **Attest:** `.type.toString.snap()` for type snapshots (different paradigm)
- 🟢 **Kit:** `exact` vs `equiv` vs `sub` - explicit semantics
- 🔴 **Attest:** Less precise about exact vs assignable

---

### Example 3: Type Error Testing

**Kit's Current Approach:**

```typescript
test('type errors', () => {
  // Must use @ts-expect-error comments
  // @ts-expect-error - Type error expected here
  Ts.Test.sub<string>()(42)
})
```

**Attest Equivalent:**

```typescript
test('type errors', () => {
  // Attest has dedicated error assertion
  attest(() => {
    // @ts-expect-error
    const invalid: string = 42
  }).type.errors.snap(
    'Type "number" is not assignable to type "string"',
  )
})
```

**Analysis:**

- 🟢 **Attest:** Can snapshot exact error messages
- 🟢 **Attest:** Validates error text doesn't regress
- 🟡 **Kit:** Relies on `@ts-expect-error` (standard TS)

---

## Attest's Unique Features

These are features Attest has that Kit doesn't (yet):

### 1. Type Instantiation Benchmarking 🔥

**What it does:** Measures how many type instantiations TypeScript creates

```typescript
import { bench } from '@ark/attest'

// Benchmark a complex type transformation
bench('deep readonly transformation', () => {
  type Input = {
    user: {
      profile: {
        name: string
        settings: {
          theme: 'light' | 'dark'
        }
      }
    }
  }

  return {} as DeepReadonly<Input>
}).types([234, 'instantiations'])
//          ^^^  Snapshot - will fail if it changes significantly
```

**Use cases in Kit:**

- Benchmark `GetRelation` type utility (complex conditional)
- Test that type refactoring doesn't regress performance
- Set CI budgets for type complexity

**Current Kit situation:** ❌ No equivalent feature

---

### 2. Completion Snapshotting 🔥

**What it does:** Tests IDE autocomplete suggestions

```typescript
import { attest } from '@ark/attest'

test('string literal union completions', () => {
  type Status = 'pending' | 'complete' | 'failed'

  // @ts-expect-error (intentional for completion test)
  attest(() => {
    const x: Status = ''
    //                ^ Test completions here
  }).completions({
    '': ['pending', 'complete', 'failed'],
  })
})
```

**Use cases in Kit:**

- Test `Str.Case` conversion types show correct completions
- Validate template literal types work in autocomplete
- Ensure branded types don't break suggestions

**Current Kit situation:** ❌ No equivalent feature

---

### 3. JSDoc Assertions 🔥

**What it does:** Tests documentation content

```typescript
import { attest, type } from '@ark/attest'

test('JSDoc propagation', () => {
  const T = type({
    /** The user's unique identifier */
    id: 'string',

    /** @deprecated Use email instead */
    username: 'string',
  })

  // Test that JSDoc is preserved
  attest(T.infer.id)
    .jsdoc.includes('unique identifier')

  // Test deprecation
  attest(T.infer.username)
    .jsdoc.includes('@deprecated')
})
```

**Use cases in Kit:**

- Ensure JSDoc on type utilities is preserved
- Test that mapped types maintain documentation
- Validate hover text in IDE

**Current Kit situation:** ❌ No equivalent feature

---

### 4. Simultaneous Runtime + Type Testing 🔥

**What it does:** Single assertion tests both type error AND runtime error

```typescript
test('runtime validators match types', () => {
  const evenNumber = type('number%2')

  // Both type-level AND runtime-level check
  attest(() => evenNumber(42)).completions()

  // Test that both type error and runtime error occur
  attest(() => evenNumber(41))
    .throwsAndHasTypeError(
      'Must be divisible by 2',
    )
})
```

**Use cases in Kit:**

- None directly (Kit is not a runtime validator)
- But: could test that type guards work correctly
- Could validate `Err.try` types match runtime behavior

**Current Kit situation:** ⚠️ Partially relevant (could test type guards)

---

### 5. Type Snapshots

**What it does:** Snapshot complex inferred types (like Jest snapshots)

```typescript
test('complex type inference', () => {
  // Snapshot the inferred type for regression testing
  attest(someComplexFunction)
    .type.toString.snap(`
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

**Use cases in Kit:**

- Snapshot utility type outputs
- Catch unintended type changes
- Document expected type shapes

**Current Kit situation:** ❌ No snapshots (only pass/fail)

---

## Real Kit Tests Translated

Let's translate actual Kit tests to Attest:

### Test 1: `subNoExcess` (Typo Detection)

**Current Kit Code:**

```typescript
test('subNoExcess - typo detection', () => {
  type QueryOptions = { limit?: number; offset?: number }

  // Common typo: "offest" instead of "offset"
  // @ts-expect-error - Catches typo!
  Ts.Test.subNoExcess<QueryOptions>()({ limit: 10, offest: 20 })

  // Correct spelling passes
  Ts.Test.subNoExcess<QueryOptions>()({ limit: 10, offset: 20 })
})
```

**Attest Translation:**

```typescript
test('excess property detection', () => {
  type QueryOptions = { limit?: number; offset?: number }

  // Attest checks both type and structure
  attest<QueryOptions>({ limit: 10, offset: 20 })

  // @ts-expect-error - Excess property
  attest<QueryOptions>({ limit: 10, offest: 20 })
  // ⚠️ Attest doesn't have subNoExcess equivalent
  // It checks assignability, not excess properties
})
```

**Analysis:**

- 🔴 **Attest limitation:** No `subNoExcess` equivalent
- 🟢 **Kit advantage:** Catches config typos that Attest misses
- 💡 **Kit's `subNoExcess` is unique and valuable**

---

### Test 2: Type Relationship Testing

**Current Kit Code:**

```typescript
test('GetRelation with edge cases', () => {
  type Test1 = Ts.GetRelation<never, never> // 'equivalent'
  type Test2 = Ts.GetRelation<string, never> // 'subtype'
  type Test3 = Ts.GetRelation<never, string> // 'supertype'

  const _test1: Test1 = 'equivalent'
  const _test2: Test2 = 'subtype'
  const _test3: Test3 = 'supertype'
})
```

**Attest Translation:**

```typescript
test('type relationships', () => {
  // Attest doesn't have GetRelation equivalent
  // Must test manually

  attest<never>(null as never) // ✓ never equals never

  // @ts-expect-error
  attest<string>(null as never) // ✗ never not assignable to string

  attest<never>('hello' as never) // ✗ string not assignable to never
})
```

**Analysis:**

- 🔴 **Attest limitation:** No type relationship analysis
- 🟢 **Kit advantage:** `GetRelation` is sophisticated and unique
- 💡 **This is Kit's differentiator**

---

### Test 3: Const Variant Testing

**Current Kit Code:**

```typescript
test('exactConst - preserves literal types', () => {
  Ts.Test.exactConst<'hello'>()('hello')
  Ts.Test.exactConst<42>()(42)
  Ts.Test.exactConst<{ readonly a: 1 }>()({ a: 1 })
})
```

**Attest Translation:**

```typescript
test('literal type preservation', () => {
  // Attest preserves literals automatically with type assertions
  attest<'hello'>('hello')
  attest<42>(42)
  attest<{ readonly a: 1 }>({ a: 1 } as const)

  // Or use .type to verify inference
  attest('hello').type.toString.snap('"hello"')
  attest(42).type.toString.snap('42')
})
```

**Analysis:**

- 🟡 **Attest:** Type snapshots are interesting alternative
- 🟢 **Kit:** Explicit const variants are clearer
- 🟡 **Different philosophies:** snapshot vs assertion

---

### Test 4: Promise Testing

**Current Kit Code:**

```typescript
const syncValue = 42
const asyncValue = Promise.resolve(42)

test('promise', () => {
  Ts.Test.promise<number>()(asyncValue)
  // @ts-expect-error - Not a Promise
  Ts.Test.promise<number>()(syncValue)
})
```

**Attest Translation:**

```typescript
const syncValue = 42
const asyncValue = Promise.resolve(42)

test('promise types', () => {
  // Attest can check Promise types
  attest<Promise<number>>(asyncValue)

  // @ts-expect-error - Not a promise
  attest<Promise<number>>(syncValue)

  // Can also check resolved type
  attest(asyncValue).type.toString.snap('Promise<number>')
})
```

**Analysis:**

- 🟢 **Both:** Handle Promise testing well
- 🟡 **Attest:** Snapshots are nice for complex Promise chains

---

## Integration with Kit's Architecture

### Scenario 1: Using Both

```typescript
// Kit's HKT-based tests for precision
type _Tests = Ts.Test.Cases<
  Ts.Test.exact<Expected, Actual>,
  Ts.Test.subNoExcess<Config, { id: true }>,
  Ts.Test.equiv<Union1, Union2>
>

// Attest for benchmarking and completions
bench('type complexity', () => {
  return {} as ComplexType
}).types([150, 'instantiations'])

attest(() => {
  const x: Status = ''
}).completions({
  '': ['pending', 'complete'],
})
```

**Benefits:**

- 🟢 Use Kit for type relationships
- 🟢 Use Attest for performance + DX testing
- 🟢 Best of both worlds

**Drawbacks:**

- 🔴 Two different syntaxes to learn
- 🔴 More dependencies
- 🔴 Potential conflicts

---

### Scenario 2: Adding Attest Features to Kit

Instead of using Attest directly, implement its features in Kit:

```typescript
// Proposed Kit API with Attest-inspired features
Ts.Test.bench('complex type', () => {
  return {} as ComplexTransform<T>
}).snapshots({
  instantiations: 150,
  maxInstantiations: 200,
})

Ts.Test.completions<Status>()
  .at({ key: 'status' })
  .expects(['pending', 'complete', 'failed'])
```

**Benefits:**

- 🟢 Consistent API
- 🟢 Kit's precision + Attest's features
- 🟢 No dependency on alpha software

**Drawbacks:**

- 🔴 Significant implementation effort
- 🔴 Need TypeScript Compiler API integration
- 🔴 Maintenance burden

---

## Integration Challenges

### 1. Alpha Status

```
⚠️ Attest is in ALPHA
"This package is still in alpha! Your feedback will help us
iterate toward a stable 1.0."
```

**Risk:** API might change, bugs exist, limited community support

---

### 2. Different Philosophy

**Kit:** Pure compile-time, precise relationships

```typescript
Ts.Test.exact<T, U>() // Structural equality
Ts.Test.equiv<T, U>() // Mutual assignability
Ts.Test.sub<T, U>() // Subtype relationship
```

**Attest:** Runtime + compile-time, snapshots

```typescript
attest<T>(value) // Assignability + runtime
attest(value).type.toString.snap() // Snapshot type string
```

**Conflict:** Fundamentally different approaches

---

### 3. Setup Overhead

```bash
# Attest requires setup
pnpm attest setup

# Creates configuration
{
  "attest": {
    "tsconfig": "./tsconfig.json",
    "updateSnapshots": false
  }
}
```

**Concern:** Additional tooling in CI/CD

---

### 4. Limited Ecosystem

- **tsd:** 109 dependents
- **expect-type:** 26 dependents
- **Attest:** ~5 dependents (mostly ArkType internal)

**Risk:** Limited battle-testing, few real-world examples

---

## Trade-offs Analysis

### What Attest Does Better

| Feature                         | Attest            | Kit                     | Winner    |
| ------------------------------- | ----------------- | ----------------------- | --------- |
| Type instantiation benchmarking | ✅ Built-in       | ❌ None                 | 🏆 Attest |
| Completion snapshotting         | ✅ Built-in       | ❌ None                 | 🏆 Attest |
| JSDoc assertions                | ✅ Built-in       | ❌ None                 | 🏆 Attest |
| Type snapshots                  | ✅ Built-in       | ❌ None                 | 🏆 Attest |
| Runtime + type testing          | ✅ Core feature   | ❌ Pure compile-time    | 🏆 Attest |
| Syntax brevity                  | ✅ `attest<T>(v)` | ⚠️ `Ts.Test.sub<T>()(v)` | 🏆 Attest |

### What Kit Does Better

| Feature                     | Kit                     | Attest               | Winner |
| --------------------------- | ----------------------- | -------------------- | ------ |
| Type relationship precision | ✅ exact/equiv/sub/sup  | ⚠️ Only assignability | 🏆 Kit |
| Excess property detection   | ✅ `subNoExcess`        | ❌ None              | 🏆 Kit |
| Type-level utilities        | ✅ GetRelation, IsExact | ❌ Limited           | 🏆 Kit |
| Negative assertions         | ✅ `Not.*` namespace    | ⚠️ Limited            | 🏆 Kit |
| Property-specific testing   | ✅ properties* helpers  | ❌ None              | 🏆 Kit |
| Maturity                    | ✅ Battle-tested        | ⚠️ Alpha              | 🏆 Kit |
| Documentation               | ✅ Comprehensive JSDoc  | ⚠️ Limited            | 🏆 Kit |
| Stability                   | ✅ Stable API           | ⚠️ Alpha (changing)   | 🏆 Kit |

---

## Recommendations

### Option 1: Don't Use Attest Directly ❌

**Reasoning:**

- Alpha status too risky
- Philosophy mismatch (runtime vs compile-time)
- Kit's type relationship testing is superior
- Attest doesn't add enough value to justify dependency

**Better:** Take inspiration, build features into Kit

---

### Option 2: Use Attest for Specific Features ⚠️

**Use Attest for:**

- 🟢 Benchmarking type instantiations
- 🟢 Testing IDE completions
- 🟢 JSDoc propagation tests

**Use Kit for:**

- 🟢 All type relationship testing
- 🟢 Excess property detection
- 🟢 Property-specific assertions

**Example:**

```typescript
// Kit for type assertions
type _ = Ts.Test.Cases<
  Ts.Test.exact<Expected, Actual>,
  Ts.Test.subNoExcess<Config, Value>
>

// Attest for performance
bench('type complexity', () => {
  return {} as ComplexType
}).types([150, 'instantiations'])
```

---

### Option 3: Implement Attest Features in Kit ✅ RECOMMENDED

**Roadmap:**

1. **Phase 1:** Add fluent API (issue #10)
2. **Phase 2:** Implement Attest-inspired features
   - Type instantiation benchmarking
   - Completion snapshotting
   - Type snapshots
3. **Phase 3:** Novel features (algebraic testing, coverage, etc.)

**Benefits:**

- 🟢 Keep Kit's precision
- 🟢 Add Attest's innovations
- 🟢 Single consistent API
- 🟢 No alpha dependency
- 🟢 Best-in-class result

**This is the approach outlined in issue #10!**

---

## Example: Ideal Future Kit API

Combining Kit's precision with Attest's features:

```typescript
import { Ts } from '#ts'

test('comprehensive type testing', () => {
  // Kit's precision
  Ts.Test.exact<Expected, Actual>()
  Ts.Test.subNoExcess<Config>()({ id: true })

  // Fluent API (Phase 1)
  Ts.Test.expect(value).toBeString()
  Ts.Test.expect(fn).returns.toBeNumber()

  // Attest-inspired (Phase 2)
  Ts.Test.bench('complex type', () => {
    return {} as ComplexType
  }).snapshots({ instantiations: 150 })

  Ts.Test.completions<Status>()
    .expects(['pending', 'complete', 'failed'])

  // Novel features (Phase 3)
  Ts.Test.diff<Expected, Actual>() // Visual diff
  Ts.Test.algebraic<Union>().commutative()
  Ts.Test.coverage('./src').expectMinimum(0.9)
})
```

**This would be REVOLUTIONARY! 🚀**

---

## Conclusion

### Should Kit Use Attest?

**Direct integration:** ❌ No

- Alpha status too risky
- Philosophy mismatch
- Kit's approach is better for type relationships

**Inspiration:** ✅ YES!

- Benchmarking is brilliant
- Completion testing is unique
- JSDoc assertions are valuable
- Snapshots are interesting

### The Path Forward

**Implement Attest's innovations in Kit** (as outlined in issue #10):

1. Keep Kit's superior type relationship testing
2. Add Attest's breakthrough features:
   - Type instantiation benchmarking
   - Completion snapshotting
   - Type snapshots
3. Add novel features no one has:
   - Type diffs
   - Algebraic property testing
   - Type coverage
   - Type fuzzing

**Result:** Best type testing library in the ecosystem!

---

## Quick Reference

### When to use what:

**Kit's `exact`** - Structural equality matters

```typescript
Ts.Test.exact<{ a: 1 }, { a: 1 }>() // ✓
Ts.Test.exact<1 | 2, 2 | 1>() // ✗ Different structure
```

**Kit's `equiv`** - Semantic equality

```typescript
Ts.Test.equiv<1 | 2, 2 | 1>() // ✓ Same computed type
Ts.Test.equiv<string & {}, string>() // ✓ Both compute to string
```

**Kit's `sub`** - Subtype checking

```typescript
Ts.Test.sub<string, 'hello'>() // ✓ 'hello' extends string
Ts.Test.sub<object, { a: 1 }>() // ✓ Object literal extends object
```

**Kit's `subNoExcess`** - Typo detection

```typescript
Ts.Test.subNoExcess<Config>()({ id: true, typo: 1 }) // ✗ Catches typo!
```

**Attest's `attest`** - Runtime + type (if using it)

```typescript
attest<string>('hello') // ✓ Both type and runtime check
```

**Attest's `bench`** - Performance (if using it)

```typescript
bench('type', () => ComplexType).types([150, 'instantiations'])
```

---

**Next:** See issue #10 for implementation plan!
