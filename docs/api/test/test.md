# Test.Test

_Test_ / **Test**

Custom Vitest matchers for Effect Schema and equivalence testing.

## Import

```typescript
import { Test } from '@wollybeard/kit/test'

// Access via namespace
Test.Test.someFunction()
```

## Namespaces

- [**`Matchers`**](/api/test/test/matchers) - Custom Vitest matchers for Effect Schema and equivalence testing.

## Property Testing

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `property`

```typescript
<Ts extends [unknown, ...unknown[]]>(...args?: [description: string, ...arbitraries: { [K in keyof Ts]: Arbitrary<Ts[K]>; }, predicate: (...args: Ts) => boolean | void]): void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/property.ts#L40" />

**Parameters:**

- `args` - Test arguments in order:

  - description: The test description

  - arbitraries: Fast-check arbitraries for generating test values

  - predicate: Function that should hold true for all generated values

Create a property-based test using fast-check within vitest.

Ts

- Tuple type of the arbitrary values.

**Examples:**

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// test that array reverse twice returns original
Test.Test.property(
  'reversing array twice returns original',
  fc.array(fc.integer()),
  (arr) => {
    const reversed = arr.slice().reverse()
    const reversedTwice = reversed.slice().reverse()
    expect(reversedTwice).toEqual(arr)
  },
)

// test with multiple arbitraries
Test.Test.property(
  'addition is commutative',
  fc.integer(),
  fc.integer(),
  (a, b) => {
    expect(a + b).toBe(b + a)
  },
)
```

## Test Builders

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `on`

```typescript
<$fn extends Fn.AnyAny>($fn: $fn): TestBuilder

// Chainable methods:
  .only(): TestBuilder
  .skip(reason?: string | undefined): TestBuilder
  .skipIf(condition: () => boolean): TestBuilder
  .concurrent(): TestBuilder
  .tags(tags: string[]): TestBuilder
  .name(template: string): TestBuilder
  .onlyMatching(matcher: string): TestBuilder
  .inputType<I>(): TestBuilder
  .contextType<Ctx extends {} = {}>(): TestBuilder
  .matrix<$values extends Rec.AnyReadonlyKeyTo<Arr.Any>>(values: $values): TestBuilder
  .snapshotSerializer(serializer: (output: any, context: { i: State["input"]; n: string; o: State["output"]; } & State["context"]) => string): TestBuilder
  .snapshotSchemas(schemas: any[]): TestBuilder
  .on<Fn extends Fn.AnyAny>(fn: Fn): TestBuilder
  .cases<Cases extends readonly any[] = readonly []>(...cases?: State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]>[] : State["fn"] extends AnyAny ? (FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> | ((ctx: State["context"]) => FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]>))[] : GenericCase<State["input"], State["output"], State["context"]>[]): TestBuilder
  .case(...args?: State["fn"] extends undefined ? GenericCaseSingleParams<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? CaseSingleParams<EffectiveInput<State>, EffectiveOutput<State>> : never): TestBuilder
  .case(name: string, runner: (context: State["context"]) => any): TestBuilder
  .case$(caseObj: GenericCase<State["input"], State["output"], State["context"]>): TestBuilder
  .casesInput(...inputs?: UnwrappedInput<State>[]): TestBuilder
  .describeInputs(name: string, inputs: readonly UnwrappedInput<State>[]): TestBuilder
  .describe(name: string, cases: readonly (State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> : GenericCase<State["input"], State["output"], State["context"]>)[]): TestBuilder
  .describe<ChildContext extends object = {}, ChildI = State['input'], ChildO = State['output']>(name: string, callback: (builder: TestBuilder<State>) => TestBuilder<{ context: ChildContext; input: ChildI; output: ChildO; fn: State["fn"]; matrix: State["matrix"]; }>): TestBuilder
  .onSetup<Ctx extends object>(factory: () => Ctx): TestBuilder

// Terminal methods:
  .outputType<O>(): State["fn"] extends undefined ? TestBuilder<UpdateState<State, { output: O; }>> : never
  .outputDefault<R>(provider: State["output"] extends undefined ? (context: State["context"]) => R : (context: State["context"]) => State["output"]): State["output"] extends undefined ? TestBuilder<UpdateState<State, { output: R; }>> : TestBuilder<State>
  .onOutput<MappedInput>(mapper: State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? (output: MappedInput, context: { i: EffectiveInput<State>; n: string; o: MappedInput; } & State["context"]) => EffectiveOutput<State> : never): State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? TestBuilder<UpdateState<State, { output: MappedInput; }>> : never
  .test(): void
  .test(fn: State["fn"] extends undefined ? GenericTestFn<State> : State["fn"] extends AnyAny ? FunctionTestFn<State> : GenericTestFn<State>): void

// Transform methods:
  .layer<R>(layer: Layer<R, never, never>): TestBuilderWithLayers
  .layerEach<R>(factory: State["fn"] extends undefined ? (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never> : State["fn"] extends AnyAny ? (testCase: { i: EffectiveInput<State>; o?: EffectiveOutput<State>; }) => Layer<R, never, never> : (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never>): TestBuilderWithLayers
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/table/constructors.ts#L155" />

Creates a test table builder for testing a specific function.

This is a shorthand for

describe().on(fn)

when you don't need a describe block.

Types are automatically inferred from the function signature, making it ideal for

quick function testing with minimal boilerplate.

#### Case Formats

Test cases can be specified in multiple formats:

**Tuple Format** (most common):

-

[[arg1, arg2], expected]

- Test with expected output

-

['name', [arg1, arg2], expected]

- Named test case

-

[[arg1, arg2]]

- Snapshot test (no expected value)

**Object Format** (more verbose but clearer):

-

{ input: [arg1, arg2], output: expected }

-

{ input: [arg1, arg2], output: expected, skip: true, comment: 'name' }

-

{ todo: 'Not implemented yet', comment: 'name' }

**Examples:**

## Snapshot Mode with Error Handling

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// Basic function testing
Test.on(add)
  .cases(
    [[2, 3], 5], // add(2, 3) === 5
    [[0, 0], 0], // add(0, 0) === 0
    [[-1, 1], 0], // add(-1, 1) === 0
  )
  .test()

// Using different case formats
Test.on(multiply)
  .cases(
    [[2, 3], 6], // Tuple format
    ['zero case', [5, 0], 0], // Named tuple
    { input: [-2, 3], output: -6 }, // Object format
    { input: [100, 100], output: 10000, comment: 'large numbers' },
  )
  .test()

// Custom assertions
Test.on(divide)
  .cases([[10, 2], 5], [[10, 0], Infinity])
  .test(({ result, output }) => {
    if (output === Infinity) {
      expect(result).toBe(Infinity)
    } else {
      expect(result).toBeCloseTo(output, 2)
    }
  })

// Output transformation - build full expectations from partials
Test.on(createUser)
  .onOutput((partial, context) => ({
    ...defaultUser,
    name: context.input[0],
    ...partial,
  }))
  .cases(
    [['Alice'], { role: 'admin' }], // Only specify differences
    [['Bob'], { role: 'user', age: 30 }],
  )
  .test()
```

## Promise Auto-Awaiting

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// Mix successful and error cases - errors are captured automatically
Test.on(parseInt)
  .cases(
    ['42'], // Returns: 42
    ['hello'], // Returns: NaN
  )
  .test()

// Validation functions - errors documented in snapshots
Test.on(Positive.from)
  .cases(
    [1],
    [10],
    [100], // THEN RETURNS the value
    [0],
    [-1],
    [-10], // THEN THROWS "Value must be positive"
  )
  .test()
```

## Snapshot Format

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
╔══════════════════════════════════════════════════╗ GIVEN ARGUMENTS
hello
╠══════════════════════════════════════════════════╣ THEN RETURNS PROMISE RESOLVING TO STRING
HELLO
╚══════════════════════════════════════════════════╝
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `describe`

```typescript
(description?: string | undefined): TestBuilder

// Chainable methods:
  .only(): TestBuilder
  .skip(reason?: string | undefined): TestBuilder
  .skipIf(condition: () => boolean): TestBuilder
  .concurrent(): TestBuilder
  .tags(tags: string[]): TestBuilder
  .name(template: string): TestBuilder
  .onlyMatching(matcher: string): TestBuilder
  .inputType<I>(): TestBuilder
  .contextType<Ctx extends {} = {}>(): TestBuilder
  .matrix<$values extends Rec.AnyReadonlyKeyTo<Arr.Any>>(values: $values): TestBuilder
  .snapshotSerializer(serializer: (output: any, context: { i: State["input"]; n: string; o: State["output"]; } & State["context"]) => string): TestBuilder
  .snapshotSchemas(schemas: any[]): TestBuilder
  .on<Fn extends Fn.AnyAny>(fn: Fn): TestBuilder
  .cases<Cases extends readonly any[] = readonly []>(...cases?: State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]>[] : State["fn"] extends AnyAny ? (FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> | ((ctx: State["context"]) => FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]>))[] : GenericCase<State["input"], State["output"], State["context"]>[]): TestBuilder
  .case(...args?: State["fn"] extends undefined ? GenericCaseSingleParams<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? CaseSingleParams<EffectiveInput<State>, EffectiveOutput<State>> : never): TestBuilder
  .case(name: string, runner: (context: State["context"]) => any): TestBuilder
  .case$(caseObj: GenericCase<State["input"], State["output"], State["context"]>): TestBuilder
  .casesInput(...inputs?: UnwrappedInput<State>[]): TestBuilder
  .describeInputs(name: string, inputs: readonly UnwrappedInput<State>[]): TestBuilder
  .describe(name: string, cases: readonly (State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> : GenericCase<State["input"], State["output"], State["context"]>)[]): TestBuilder
  .describe<ChildContext extends object = {}, ChildI = State['input'], ChildO = State['output']>(name: string, callback: (builder: TestBuilder<State>) => TestBuilder<{ context: ChildContext; input: ChildI; output: ChildO; fn: State["fn"]; matrix: State["matrix"]; }>): TestBuilder
  .onSetup<Ctx extends object>(factory: () => Ctx): TestBuilder

// Terminal methods:
  .outputType<O>(): State["fn"] extends undefined ? TestBuilder<UpdateState<State, { output: O; }>> : never
  .outputDefault<R>(provider: State["output"] extends undefined ? (context: State["context"]) => R : (context: State["context"]) => State["output"]): State["output"] extends undefined ? TestBuilder<UpdateState<State, { output: R; }>> : TestBuilder<State>
  .onOutput<MappedInput>(mapper: State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? (output: MappedInput, context: { i: EffectiveInput<State>; n: string; o: MappedInput; } & State["context"]) => EffectiveOutput<State> : never): State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? TestBuilder<UpdateState<State, { output: MappedInput; }>> : never
  .test(): void
  .test(fn: State["fn"] extends undefined ? GenericTestFn<State> : State["fn"] extends AnyAny ? FunctionTestFn<State> : GenericTestFn<State>): void

// Transform methods:
  .layer<R>(layer: Layer<R, never, never>): TestBuilderWithLayers
  .layerEach<R>(factory: State["fn"] extends undefined ? (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never> : State["fn"] extends AnyAny ? (testCase: { i: EffectiveInput<State>; o?: EffectiveOutput<State>; }) => Layer<R, never, never> : (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never>): TestBuilderWithLayers
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/table/constructors.ts#L296" />

Creates a test table builder for property-based and example-based testing.

**CRITICAL**: Each call to

Test.describe()

creates a SEPARATE, INDEPENDENT test block.

The builder is NOT reusable

- you CANNOT chain multiple

.cases()

or

.describeInputs()

calls

to add test cases to the same describe block. Each builder must end with

.test()

.

Test tables allow you to define multiple test cases with inputs and expected outputs,

reducing boilerplate and making tests more maintainable. The builder supports two modes:

#### Modes

**Function Mode**

- Test a specific function with

.on(fn)

:

- Types are automatically inferred from the function signature

- Test cases specify function arguments and expected return values

- Default assertion compares actual vs expected using Effect's equality

**Generic Mode**

- Define custom types with

.i&lt;T&gt;

and

.o&lt;T&gt;

:

- Explicitly specify input and output types

- Provide custom test logic to validate cases

- Useful for testing complex behaviors beyond simple function calls

#### Features

**Nested Describes**

- Use

&gt;

separator to create nested describe blocks:

-

Test.describe('Parent &gt; Child')

creates

describe('Parent', () =&gt; describe('Child', ...))

- Multiple SEPARATE Test.describe() calls with the same prefix share the outer describe block

- Supports any depth:

'API &gt; Users &gt; Create'

creates three levels

**Matrix Testing**

- Use

.matrix()

to run cases across parameter combinations:

- Generates cartesian product of all matrix value arrays

- Each test case runs once for each combination

- Matrix values available as

matrix

in test context

- Combines with nested describes for organized test suites

**Examples:**

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// ❌ WRONG - Trying to chain test cases (DOES NOT WORK)
Test.describe('decodeSync > basic')
  .on(decodeSync)
  .cases([['1.2.3']])
  .describeInputs('union', [['1.2.3-beta']]) // ❌ This creates a NESTED describe, not sibling!
  .test()

// ✅ CORRECT - Separate Test.describe() calls for separate test groups
Test.describe('decodeSync > basic')
  .on(decodeSync)
  .cases([['1.2.3']], [['invalid']])
  .test()

Test.describe('decodeSync > union') // Shares 'decodeSync' parent describe
  .on(decodeSync)
  .cases([['1.2.3-beta']], [['1.2.3+build']])
  .test()

// Function mode - testing a math function
Test.describe('addition')
  .on(add)
  .cases(
    [[2, 3], 5], // add(2, 3) should return 5
    ['negative', [-1, -2], -3], // Named test case
    [[0, 0], 0], // Edge case
  )
  .test() // Uses default assertion (Effect's Equal.equals)

// Generic mode - custom validation logic
Test.describe('email validation')
  .inputType<string>()
  .outputType<boolean>()
  .cases(
    ['user@example.com', true],
    ['invalid.com', false],
    ['', false],
  )
  .test(({ input, output }) => {
    const result = isValidEmail(input)
    expect(result).toBe(output)
  })

// Nested describe blocks with ' > ' separator
Test.describe('Transform > String') // Creates nested: Transform -> String
  .inputType<string>()
  .outputType<string>()
  .cases(['hello', 'HELLO'])
  .test(({ input, output }) => {
    expect(input.toUpperCase()).toBe(output)
  })

Test.describe('Transform > Number') // SEPARATE call - Shares 'Transform' parent describe
  .inputType<number>()
  .outputType<number>()
  .cases([42, 42])
  .test(({ input, output }) => {
    expect(input).toBe(output)
  })

// Matrix testing - runs each case for all parameter combinations
Test.describe('string transform')
  .inputType<string>()
  .outputType<string>()
  .matrix({
    uppercase: [true, false],
    prefix: ['', 'pre_'],
  })
  .cases(
    ['hello', 'hello'],
    ['world', 'world'],
  )
  .test(({ input, output, matrix }) => {
    // Runs 4 times (2 cases × 2 uppercase × 2 prefix = 8 tests)
    let result = input
    if (matrix.prefix) result = matrix.prefix + result
    if (matrix.uppercase) result = result.toUpperCase()

    let expected = output
    if (matrix.prefix) expected = matrix.prefix + expected
    if (matrix.uppercase) expected = expected.toUpperCase()

    expect(result).toBe(expected)
  })
```
