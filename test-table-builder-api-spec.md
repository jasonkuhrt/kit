# Test Table Builder API Specification

## Overview

A fluent builder API for table-driven testing in TypeScript that dramatically reduces boilerplate while maintaining type safety and flexibility. The API provides a progressive disclosure model - start simple with minimal syntax, drop down to more control when needed.

## API Entry Points

### `Test.table()` - Main Entry Point

```typescript
// Without description - no describe block
Test.table()
  .cases([...])
  .test(...)

// With description - creates describe block
Test.table('suite name')
  .cases([...])
  .test(...)
```

## Builder Methods

### Type Building Methods

These methods must come before `.cases()` or `.case()`:

#### `.i<T>()` - Input Type

```typescript
Test.table()
  .i<string>()  // Declares input type
  .cases([...])
```

#### `.o<T>()` - Output Type

```typescript
Test.table()
  .i<string>()
  .o<number>()  // Declares output type
  .cases([...])
```

### Function Testing Methods

#### `.on(fn)` - Test Against Function

Enables automatic test execution with smart defaults:

```typescript
Test.table()
  .on(myFunction)  // Sets function under test
  .cases([...])    // Automatically executes tests
```

### Case Definition Methods

#### `.cases(cases)` - Define Multiple Cases

Accepts either tuple syntax OR object syntax (cannot mix):

**Tuple Syntax** (for simple cases):

```typescript
.cases([
  [input, output],                    // Unnamed test
  ['name', input, output],            // Named test
  [input],                            // Unnamed snapshot
  ['name', input],                    // Named snapshot
])
```

**Object Syntax** (when you need more control):

```typescript
.cases([
  { n: 'name', i: [input], o: output },
  { n: 'name', i: [input], skip: 'reason' },
  { n: 'name', todo: 'implement later' },
  { n: 'name', i: [input], only: true },
])
```

#### `.case(...)` - Define Single Case

Accepts parameters directly or as an object:

```typescript
.case('name', input, output)  // Named with output
.case(input, output)           // Unnamed with output
.case('name', input)           // Named snapshot
.case(input)                   // Unnamed snapshot
.case({ n: 'name', i: [input], o: output, skip: true })  // Object for control
```

### Configuration Methods

#### `.name(template)` - Test Name Template

```typescript
.name('$i → $o')  // Template for test names
```

#### `.only()` - Focus Tests

```typescript
.only()  // Run only these tests
```

#### `.skip(reason?)` - Skip Tests

```typescript
.skip()           // Skip all tests in suite
.skip('reason')   // Skip with reason
```

#### `.skipIf(condition)` - Conditional Skip

```typescript
.skipIf(() => process.env.CI === 'true')
```

#### `.concurrent()` - Run Tests Concurrently

```typescript
.concurrent()  // Run test cases in parallel
```

#### `.tags(tags)` - Tag Tests

```typescript
.tags(['slow', 'integration'])
```

#### `.onlyMatching(matcher)` - Custom Matcher

```typescript
.onlyMatching('toMatchPath')  // Use custom matcher instead of toBe
```

### Effect/Layer Methods

#### `.layer(layer)` - Static Layer

```typescript
.layer(TestLayers.schema)  // Same layer for all tests
```

#### `.layerEach(factory)` - Dynamic Layer

```typescript
.layerEach(({ mocks }) => Layer.mock(HttpClient, mocks))
```

### Terminal Methods

#### `.test(fn)` - Custom Test Function

Executes the test suite with custom logic:

```typescript
.test(( i, o ) => {
  expect(transform(i)).toBe(o)
})
```

**Note**: When using `.on()`, this is optional - tests execute automatically.

#### `.testEffect(fn)` - Effect-based Test

Available after `.layer()` or `.layerEach()`:

```typescript
.testEffect(( i, o ) => Effect.gen(function* () {
  const result = yield* process(i)
  expect(result).toBe(o)
}))
```

## Usage Patterns

### Basic Input/Output Testing

```typescript
// Simplest form
Test.table()
  .cases<{ input: string; expected: string }>([
    { n: 'uppercase', input: 'hello', expected: 'HELLO' },
    { n: 'lowercase', input: 'WORLD', expected: 'world' },
  ])
  .test(({ input, expected }) => {
    expect(transform(input)).toBe(expected)
  })
```

### Function Testing with `.on()`

When using `.on(fn)`:

- Input is ALWAYS a tuple of the function's parameters: `[param1, param2, ...]`
- Output is the function's return type
- For single-param functions, input is still a tuple: `[param]`

```typescript
// Multi-param function: add(a: number, b: number): number
Test.table()
  .on(add)
  .cases([
    [[2, 3], 5], // Input: [2, 3], Output: 5
    ['negative', [-1, -2], -3], // Named, Input: [-1, -2], Output: -3
    [[10, 10]], // Input: [10, 10], Snapshot output
  ])
// Automatically runs: expect(add(2, 3)).toBe(5)

// Single-param function: upperCase(s: string): string
Test.table()
  .on(upperCase)
  .cases([
    [['hello'], 'HELLO'], // Input: ['hello'], Output: 'HELLO'
    ['test name', ['world'], 'WORLD'], // Named test
    [['snapshot me']], // Input: ['snapshot me'], Snapshot
  ])

// Zero-param function: getRandom(): number
Test.table()
  .on(getRandom)
  .cases([
    [[], 42], // Input: [], Output: 42
    ['with seed', [], 7], // Named test
    [[]], // Snapshot
  ])
```

### Snapshot Testing

```typescript
// Any returned value from .test() is automatically snapshotted
Test.table()
  .cases([{ n: 'complex', data: input }])
  .test(({ data }) => {
    const result = process(data)
    expect(result.status).toBe('ok') // Assertion
    return result // Automatically snapshotted
  })

// With .on() - omit output for automatic snapshots
Test.table()
  .on(generateReport)
  .cases([
    ['Q1 2024', { quarter: 1 }], // No output = snapshot
    ['Q2 2024', { quarter: 2 }],
  ])
```

### Complex Cases with Object Syntax

```typescript
Test.table('validation suite')
  .on(validate)
  .cases([
    { n: 'valid email', i: ['user@example.com'], o: true },
    { n: 'unicode', i: ['用户@example.com'], o: true, tags: ['i18n'] },
    { n: 'IPv6', todo: 'Implement IPv6 email support' },
    { n: 'security', i: ['xss@evil.com'], o: false, only: true },
    { n: 'huge input', i: [hugeString], skip: 'Too slow for CI' },
  ])
```

### Progressive Test Building

```typescript
const suite = Test.table('payments')
  .on(processPayment)

// Add cases conditionally
if (ENABLE_USD) {
  suite.case(['USD', 100, 'USD', { success: true }])
}

if (ENABLE_EUR) {
  suite.case(['EUR', 100, 'EUR', { success: true }])
}

// Add bulk cases
suite.cases(standardPaymentTests)

// Add edge cases
suite.case({
  n: 'negative amount',
  i: [-10, 'USD'],
  o: { success: false },
  tags: ['edge-case'],
})
```

### Effect-based Testing

```typescript
Test.table('schema operations')
  .layer(SchemaLayer)
  .cases<{ i: string; o: Result }>([
    { n: 'valid', i: 'config', o: { valid: true } },
    { n: 'invalid', i: 'bad', o: { valid: false } },
  ])
  .testEffect((i, o) =>
    Effect.gen(function*() {
      const result = yield* Schema.validate(i)
      expect(result).toEqual(o)
    })
  )
```

## Type System

### Core Types

```typescript
namespace Test {
  // Entry point
  function table(): TableBuilder<{}>
  function table(description: string): TableBuilder<{}>

  // Case types for .on() - P is always a tuple of function params
  type CaseTuple<P extends any[], R> =
    | [P] // Just input tuple (snapshot)
    | [string, P] // Name + input tuple (snapshot)
    | [P, R] // Input tuple + output
    | [string, P, R] // Name + input tuple + output

  // Case type for object syntax
  type CaseObject<P extends any[], R> = {
    n: string // Name (required)
    i?: P // Input parameters
    o?: R // Expected output
    todo?: boolean | string // Todo marker
    skip?: boolean | string // Skip marker
    skipIf?: () => boolean // Conditional skip
    only?: boolean // Focus marker
    tags?: string[] // Test tags
  }
}
```

## Automatic Behaviors

### Auto-naming

When test names are omitted in tuple syntax, names are generated:

- Function calls: `"fn(arg1, arg2) → result"`
- Simple values: `"input → output"`
- Objects: Pretty-printed representation

### Snapshot Testing

- Any non-undefined value returned from `.test()` is automatically snapshotted
- When using `.on()` without output, results are snapshotted by default

### Type Inference

- `.on(fn)` automatically infers parameter and return types
- `.i<T>()` and `.o<T>()` progressively build the test case type
- Full type safety throughout the builder chain

## Migration Guide

### From Current API

```typescript
// Before: Test.Table.suite
Test.Table.suite<{ input: string; expected: string }>('my tests', [
  { name: 'test 1', input: 'hello', expected: 'HELLO' },
], ({ input, expected }) => {
  expect(transform(input)).toBe(expected)
})

// After: Test.table with builder
Test.table('my tests')
  .i<string>()
  .o<string>()
  .cases([
    ['test 1', 'hello', 'HELLO'],
  ])
  .test((i, o) => {
    expect(transform(i)).toBe(o)
  })

// Or even simpler with .on()
Test.table('my tests')
  .on(transform)
  .cases([
    ['test 1', 'hello', 'HELLO'],
  ])
```

## Best Practices

1. **Start Simple** - Use tuple syntax for straightforward cases
2. **Use `.on()`** - When testing pure functions for automatic execution
3. **Snapshot by Default** - Omit expected output to snapshot complex results
4. **Progressive Enhancement** - Start with tuples, convert to objects when needed
5. **Mix `.case()` and `.cases()`** - Build test suites incrementally
6. **Return for Snapshots** - Return values from `.test()` for automatic snapshots

## Implementation Notes

- Tuples and objects cannot be mixed within a single `.cases()` call
- When using `.on()`, the function's arity determines parameter detection
- The builder executes tests at the terminal method (`.test()`, `.testEffect()`, or automatically after `.cases()` when using `.on()`)
- All builder methods return a new builder instance for immutability
