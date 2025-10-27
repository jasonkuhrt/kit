# Test

Enhanced test utilities for table-driven testing with Vitest.

Provides builder API and type-safe utilities for parameterized tests with built-in support for todo, skip, and only cases.

## Import

::: code-group

```typescript [Namespace]
import { Test } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Test from '@wollybeard/kit/test'
```

:::

## Property Testing

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `property`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/property.ts#L40" /> {#f-property-40}

```typescript
<Ts extends [unknown, ...unknown[]]>(...args ?: [description: string, ...arbitraries: { [K in keyof Ts]: Arbitrary<Ts[K]>; }, predicate: (...args: Ts) => boolean | void]): void
```

**Parameters:**

- `args` - Test arguments in order: - description: The test description - arbitraries: Fast-check arbitraries for generating test values - predicate: Function that should hold true for all generated values

Create a property-based test using fast-check within vitest.

Ts

- Tuple type of the arbitrary values.

**Examples:**

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// test that array reverse twice returns original
// [!code word:property:1]
Test.property(
  'reversing array twice returns original',
  // [!code word:array:1]
  // [!code word:integer:1]
  fc.array(fc.integer()),
  (arr) => {
    // [!code word:slice:1]
    const reversed = arr.slice().reverse()
    // [!code word:slice:1]
    const reversedTwice = reversed.slice().reverse()
    expect(reversedTwice).toEqual(arr)
  },
)

// test with multiple arbitraries
// [!code word:property:1]
Test.property(
  'addition is commutative',
  // [!code word:integer:1]
  fc.integer(),
  // [!code word:integer:1]
  fc.integer(),
  (a, b) => {
    expect(a + b).toBe(b + a)
  },
)
```

## Test Builders

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `on`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/table/constructors.ts#L155" /> {#f-on-155}

```typescript
// [!code word:only:1]
<$fn extends Fn.AnyAny>($fn: $fn): TestBuilder

  // Chainable methods:
// [!code word:skip:1]
  .only(): TestBuilder
// [!code word:skipIf:1]
    .skip(reason ?: string | undefined): TestBuilder
// [!code word:concurrent:1]
      .skipIf(condition: () => boolean): TestBuilder
// [!code word:tags:1]
        .concurrent(): TestBuilder
// [!code word:name:1]
          .tags(tags: string[]): TestBuilder
// [!code word:onlyMatching:1]
            .name(template: string): TestBuilder
// [!code word:inputType:1]
              .onlyMatching(matcher: string): TestBuilder
// [!code word:contextType:1]
                .inputType<I>(): TestBuilder
// [!code word:matrix:1]
                  .contextType < Ctx extends { } = { }> (): TestBuilder
// [!code word:snapshotSerializer:1]
                    .matrix<$values extends Rec.AnyReadonlyKeyTo<Arr.Any>>(values: $values): TestBuilder
// [!code word:snapshotSchemas:1]
                      .snapshotSerializer(serializer: (output: any, context: { i: State["input"]; n: string; o: State["output"]; } & State["context"]) => string): TestBuilder
// [!code word:on:1]
                        .snapshotSchemas(schemas: any[]): TestBuilder
// [!code word:cases:1]
                          .on<Fn extends Fn.AnyAny>(fn: Fn): TestBuilder
// [!code word:case:1]
                            .cases < Cases extends readonly any[] = readonly[] > (...cases ?: State["fn"] extends undefined ? GenericCase < State["input"], State["output"], State["context"] > [] : State["fn"] extends AnyAny ? (FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> | ((ctx: State["context"]) => FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]>))[] : GenericCase < State["input"], State["output"], State["context"] > []): TestBuilder
// [!code word:case:1]
                              .case(...args ?: State["fn"] extends undefined ? GenericCaseSingleParams<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? CaseSingleParams<EffectiveInput<State>, EffectiveOutput<State>> : never): TestBuilder
// [!code word:case$:1]
                                .case(name: string, runner: (context: State["context"]) => any): TestBuilder
// [!code word:casesInput:1]
                                  .case$(caseObj: GenericCase<State["input"], State["output"], State["context"]>): TestBuilder
// [!code word:describeInputs:1]
                                    .casesInput(...inputs ?: UnwrappedInput < State > []): TestBuilder
// [!code word:describe:1]
                                      .describeInputs(name: string, inputs: readonly UnwrappedInput < State > []): TestBuilder
// [!code word:describe:1]
                                        .describe(name: string, cases: readonly(State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> : GenericCase<State["input"], State["output"], State["context"]>)[]): TestBuilder
// [!code word:onSetup:1]
                                          .describe < ChildContext extends object = {}, ChildI = State['input'], ChildO = State['output'] > (name: string, callback: (builder: TestBuilder<State>) => TestBuilder<{ context: ChildContext; input: ChildI; output: ChildO; fn: State["fn"]; matrix: State["matrix"]; }>): TestBuilder
// [!code word:outputType:1]
                                            .onSetup<Ctx extends object>(factory: () => Ctx): TestBuilder

                                              // Terminal methods:
// [!code word:outputDefault:1]
                                              .outputType<O>(): State["fn"] extends undefined ? TestBuilder<UpdateState<State, { output: O; }>> : never
                                                .outputDefault<R>(provider: State["output"] extends undefined ? (context: State["context"]) => R : (context: State["context"]) => State["output"]): State["output"] extends undefined ? TestBuilder<UpdateState<State, { output: R; }>> : TestBuilder<State>
// [!code word:test:1]
                                                  .onOutput<MappedInput>(mapper: State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? (output: MappedInput, context: { i: EffectiveInput<State>; n: string; o: MappedInput; } & State["context"]) => EffectiveOutput<State> : never): State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? TestBuilder<UpdateState<State, { output: MappedInput; }>> : never
                                                    .test(): void
// [!code word:test:1]
  .test(fn: State["fn"] extends undefined ? GenericTestFn<State> : State["fn"] extends AnyAny ? FunctionTestFn<State> : GenericTestFn<State>): void

// Transform methods:
// [!code word:layer:1]
// [!code word:layerEach:1]
  .layer<R>(layer: Layer<R, never, never>): TestBuilderWithLayers
  .layerEach<R>(factory: State["fn"] extends undefined ? (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never> : State["fn"] extends AnyAny ? (testCase: { i: EffectiveInput<State>; o?: EffectiveOutput<State>; }) => Layer<R, never, never> : (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never>): TestBuilderWithLayers
```

Creates a test table builder for testing a specific function.

This is a shorthand for `describe().on(fn)` when you don't need a describe block. Types are automatically inferred from the function signature, making it ideal for quick function testing with minimal boilerplate.

#### Case Formats

Test cases can be specified in multiple formats:

**Tuple Format** (most common):

- `[[arg1, arg2], expected]`
- Test with expected output
- `[[arg1, arg2], expected, { comment: 'name' }]`
- Named test case (context is 3rd element)
- `[[arg1, arg2]]`
- Snapshot test (no expected value)

**Object Format** (more verbose but clearer):

- `{ input: [arg1, arg2], output: expected }`
- `{ input: [arg1, arg2], output: expected, skip: true, comment: 'name' }`
- `{ todo: 'Not implemented yet', comment: 'name' }`

**Examples:**

## Snapshot Mode with Error Handling

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// Basic function testing
// [!code word:on:1]
Test.on(add)
  .cases(
    [[2, 3], 5], // add(2, 3) === 5
    [[0, 0], 0], // add(0, 0) === 0
    [[-1, 1], 0], // add(-1, 1) === 0
  )
  .test()

// Using different case formats
// [!code word:on:1]
Test.on(multiply)
  .cases(
    [[2, 3], 6], // Tuple format
    [[5, 0], 0, { comment: 'zero case' }], // Named tuple with context
    { input: [-2, 3], output: -6 }, // Object format
    { input: [100, 100], output: 10000, comment: 'large numbers' },
  )
  .test()

// Custom assertions
// [!code word:on:1]
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
// [!code word:on:1]
Test.on(createUser)
  // [!code word:input:1]
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
// [!code word:on:1]
Test.on(parseInt)
  .cases(
    ['42'], // Returns: 42
    ['hello'], // Returns: NaN
  )
  .test()

// Validation functions - errors documented in snapshots
// [!code word:on:1]
// [!code word:from:1]
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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `describe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/test/table/constructors.ts#L296" /> {#f-describe-296}

```typescript
(description: string, cases: any[]): TestBuilder

  // Chainable methods:
  .only(): TestBuilder
    .skip(reason?: string | undefined): TestBuilder
      .skipIf(condition: () => boolean): TestBuilder
        .concurrent(): TestBuilder
          .tags(tags: string[]): TestBuilder
            .name(template: string): TestBuilder
              .onlyMatching(matcher: string): TestBuilder
                .inputType<I>(): TestBuilder
// [!code word:matrix:1]
                  .contextType<Ctx extends {} = { }> (): TestBuilder
// [!code word:snapshotSerializer:1]
                    .matrix<$values extends Rec.AnyReadonlyKeyTo<Arr.Any>>(values: $values): TestBuilder
// [!code word:snapshotSchemas:1]
                      .snapshotSerializer(serializer: (output: any, context: { i: State["input"]; n: string; o: State["output"]; } & State["context"]) => string): TestBuilder
// [!code word:on:1]
                        .snapshotSchemas(schemas: any[]): TestBuilder
// [!code word:cases:1]
                          .on<Fn extends Fn.AnyAny>(fn: Fn): TestBuilder
// [!code word:case:1]
                            .cases < Cases extends readonly any[] = readonly[] > (...cases ?: State["fn"] extends undefined ? GenericCase < State["input"], State["output"], State["context"] > [] : State["fn"] extends AnyAny ? (FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> | ((ctx: State["context"]) => FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]>))[] : GenericCase < State["input"], State["output"], State["context"] > []): TestBuilder
// [!code word:case:1]
                              .case(...args ?: State["fn"] extends undefined ? GenericCaseSingleParams<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? CaseSingleParams<EffectiveInput<State>, EffectiveOutput<State>> : never): TestBuilder
// [!code word:case$:1]
                                .case(name: string, runner: (context: State["context"]) => any): TestBuilder
// [!code word:casesInput:1]
                                  .case$(caseObj: GenericCase<State["input"], State["output"], State["context"]>): TestBuilder
// [!code word:describeInputs:1]
                                    .casesInput(...inputs ?: UnwrappedInput < State > []): TestBuilder
// [!code word:describe:1]
                                      .describeInputs(name: string, inputs: readonly UnwrappedInput < State > []): TestBuilder
// [!code word:describe:1]
                                        .describe(name: string, cases: readonly(State["fn"] extends undefined ? GenericCase<State["input"], State["output"], State["context"]> : State["fn"] extends AnyAny ? FunctionCase<EffectiveInput<State>, EffectiveOutput<State>, State["context"]> : GenericCase<State["input"], State["output"], State["context"]>)[]): TestBuilder
// [!code word:onSetup:1]
                                          .describe < ChildContext extends object = {}, ChildI = State['input'], ChildO = State['output'] > (name: string, callback: (builder: TestBuilder<State>) => TestBuilder<{ context: ChildContext; input: ChildI; output: ChildO; fn: State["fn"]; matrix: State["matrix"]; }>): TestBuilder
// [!code word:outputType:1]
                                            .onSetup<Ctx extends object>(factory: () => Ctx): TestBuilder

                                              // Terminal methods:
// [!code word:outputDefault:1]
                                              .outputType<O>(): State["fn"] extends undefined ? TestBuilder<UpdateState<State, { output: O; }>> : never
                                                .outputDefault<R>(provider: State["output"] extends undefined ? (context: State["context"]) => R : (context: State["context"]) => State["output"]): State["output"] extends undefined ? TestBuilder<UpdateState<State, { output: R; }>> : TestBuilder<State>
// [!code word:test:1]
                                                  .onOutput<MappedInput>(mapper: State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? (output: MappedInput, context: { i: EffectiveInput<State>; n: string; o: MappedInput; } & State["context"]) => EffectiveOutput<State> : never): State["fn"] extends undefined ? never : State["fn"] extends AnyAny ? TestBuilder<UpdateState<State, { output: MappedInput; }>> : never
                                                    .test(): void
// [!code word:test:1]
  .test(fn: State["fn"] extends undefined ? GenericTestFn<State> : State["fn"] extends AnyAny ? FunctionTestFn<State> : GenericTestFn<State>): void

// Transform methods:
// [!code word:layer:1]
// [!code word:layerEach:1]
  .layer<R>(layer: Layer<R, never, never>): TestBuilderWithLayers
  .layerEach<R>(factory: State["fn"] extends undefined ? (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never> : State["fn"] extends AnyAny ? (testCase: { i: EffectiveInput<State>; o?: EffectiveOutput<State>; }) => Layer<R, never, never> : (testCase: { i: State["input"]; o: State["output"]; } & State["context"]) => Layer<R, never, never>): TestBuilderWithLayers
```

Creates a test table builder for property-based and example-based testing.

**CRITICAL**: The builder supports chaining multiple `.describe(name, cases)` calls to organize related test groups. Each `.describe()` adds a new test group and returns the builder for continued chaining. The chain must end with `.test()` to execute all groups.

Test tables allow you to define multiple test cases with inputs and expected outputs, reducing boilerplate and making tests more maintainable. The builder supports two modes:

#### Modes

**Function Mode**

- Test a specific function with `.on(fn)`:
- Types are automatically inferred from the function signature
- Test cases specify function arguments and expected return values
- Default assertion compares actual vs expected using Effect's equality

**Generic Mode**

- Define custom types with `.i<T>` and `.o<T>`:
- Explicitly specify input and output types
- Provide custom test logic to validate cases
- Useful for testing complex behaviors beyond simple function calls

#### Features

**Nested Describes**

- Use `>` separator to create nested describe blocks:
- `Test.describe('Parent > Child')` creates `describe('Parent', () => describe('Child', ...))`
- Chain multiple `.describe()` calls: each adds a test group under its specified path
- Supports any depth: `'API > Users > Create'` creates three levels

**Matrix Testing**

- Use `.matrix()` to run cases across parameter combinations:
- Generates cartesian product of all matrix value arrays
- Each test case runs once for each combination
- Matrix values available as `matrix` in test context
- Combines with nested describes for organized test suites

**Examples:**

```typescript twoslash
// @noErrors
import { Test } from '@wollybeard/kit/test'
// ---cut---
// ✅ CORRECT - Chain .describe() calls to add multiple test groups
// [!code word:describe:1]
Test
  .describe('decodeSync > basic', [
    [['1.2.3']],
    [['invalid']],
  ])
  .describe('decodeSync > union', [
    [['1.2.3-beta']],
    [['1.2.3+build']],
  ])
  .test()

// Alternative: Single describe with all cases
// [!code word:describe:1]
Test.describe('decodeSync > basic')
  .on(decodeSync)
  .cases([['1.2.3']], [['invalid']])
  .test()

// Function mode - testing a math function
// [!code word:describe:1]
Test.describe('addition')
  .on(add)
  .cases(
    [[2, 3], 5], // add(2, 3) should return 5
    [[-1, -2], -3, { comment: 'negative' }], // Named test case with context
    [[0, 0], 0], // Edge case
  )
  .test() // Uses default assertion (Effect's Equal.equals)

// Generic mode - custom validation logic
// [!code word:describe:1]
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

// Nested describe blocks with ' > ' separator - chained
// [!code word:describe:1]
Test
  .describe('Transform > String', [
    ['hello', 'HELLO'],
  ])
  .describe('Transform > Number', [
    [42, 42],
  ])
  .test(({ input, output }) => {
    // Custom test logic for both groups
    if (typeof input === 'string') {
      // [!code word:toUpperCase:1]
      expect(input.toUpperCase()).toBe(output)
    } else {
      expect(input).toBe(output)
    }
  })

// Matrix testing - runs each case for all parameter combinations
// [!code word:describe:1]
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
    // [!code word:prefix:1]
    if (matrix.prefix) result = matrix.prefix + result
    // [!code word:uppercase:1]
    // [!code word:toUpperCase:1]
    if (matrix.uppercase) result = result.toUpperCase()

    let expected = output
    // [!code word:prefix:1]
    if (matrix.prefix) expected = matrix.prefix + expected
    // [!code word:uppercase:1]
    // [!code word:toUpperCase:1]
    if (matrix.uppercase) expected = expected.toUpperCase()

    expect(result).toBe(expected)
  })
```
