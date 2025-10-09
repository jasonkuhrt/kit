# Test

Enhanced test utilities for table-driven testing with Vitest.

Provides builder API and type-safe utilities for parameterized tests with
built-in support for todo, skip, and only cases.

@example Basic table-driven testing with builder API

```typescript
const add = (a: number, b: number) => a + b

Test.describe('addition')
  .on(add)
  .cases(
    [[2, 3], 5],
    [[0, 0], 0],
    [[-1, 1], 0],
  )
  .test()
```

@example Custom test logic

```typescript
Test.describe('validation')
  .i<string>()
  .o<boolean>()
  .cases(
    { n: 'valid email', i: 'user@example.com', o: true },
    { n: 'invalid', i: 'not-email', o: false },
    { n: 'future feature', todo: 'Not implemented yet' },
  )
  .test((input, expected) => {
    expect(isValid(input)).toBe(expected)
  })
```

@example Property-based testing

```typescript
Test.property(
  'reversing array twice returns original',
  fc.array(fc.integer()),
  (arr) => {
    const reversed = arr.slice().reverse()
    const reversedTwice = reversed.slice().reverse()
    expect(reversedTwice).toEqual(arr)
  },
)
```

## Import

```typescript
import { Test } from '@wollybeard/kit/test'
```

## Namespaces

- [**Matchers**](/api/test/matchers)

## Functions

### property <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/test/property.ts#L38)</sub>

```typescript
;(<Ts extends [unknown, ...unknown[]]>(
  ...args: [
    description: string,
    ...arbitraries: { [K in keyof Ts]: Arbitrary<Ts[K]> },
    predicate: (...args: Ts) => boolean | void,
  ]
) => void )
```

### on <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/test/table/constructors.ts#L117)</sub>

Creates a test table builder for testing a specific function.

This is a shorthand for `describe().on(fn)` when you don't need a describe block.
Types are automatically inferred from the function signature, making it ideal for
quick function testing with minimal boilerplate.

#### Case Formats

Test cases can be specified in multiple formats:

**Tuple Format** (most common):

- `[[arg1, arg2], expected]` - Test with expected output
- `['name', [arg1, arg2], expected]` - Named test case
- `[[arg1, arg2]]` - Snapshot test (no expected value)

**Object Format** (more verbose but clearer):

- `{ input: [arg1, arg2], output: expected }`
- `{ input: [arg1, arg2], output: expected, skip: true, comment: 'name' }`
- `{ todo: 'Not implemented yet', comment: 'name' }`

```typescript
export function on<$fn extends Fn.AnyAny>(
  $fn: $fn,
): TestBuilder<UpdateState<BuilderTypeStateEmpty, { fn: $fn }>>
```

**Examples:**

```ts twoslash
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

```ts twoslash
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

### describe <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/test/table/constructors.ts#L233)</sub>

Creates a test table builder for property-based and example-based testing.

Test tables allow you to define multiple test cases with inputs and expected outputs,
reducing boilerplate and making tests more maintainable. The builder supports two modes:

#### Modes

**Function Mode** - Test a specific function with `.on(fn)`:

- Types are automatically inferred from the function signature
- Test cases specify function arguments and expected return values
- Default assertion compares actual vs expected using Effect's equality

**Generic Mode** - Define custom types with `.i<T>()` and `.o<T>()`:

- Explicitly specify input and output types
- Provide custom test logic to validate cases
- Useful for testing complex behaviors beyond simple function calls

#### Features

**Nested Describes** - Use `>` separator to create nested describe blocks:

- `Test.describe('Parent > Child')` creates `describe('Parent', () => describe('Child', ...))`
- Multiple tests with the same prefix share the outer describe block
- Supports any depth: `'API > Users > Create'` creates three levels

**Matrix Testing** - Use `.matrix()` to run cases across parameter combinations:

- Generates cartesian product of all matrix value arrays
- Each test case runs once for each combination
- Matrix values available as `matrix` in test context
- Combines with nested describes for organized test suites

```typescript
export function describe(description?: string): TestBuilderEmpty
```

**Examples:**

```ts twoslash
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

Test.describe('Transform > Number') // Shares 'Transform' parent describe
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
