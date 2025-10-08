# Test

## Import

```typescript
import { Test } from '@wollybeard/kit/test'
```

## Namespaces

- [**Matchers**](/api/test/matchers)

## Functions

### property

```typescript
property = <Ts extends [unknown, ...unknown[]]>(
  ...args: [
    description: string,
    ...arbitraries: {
      [K in keyof Ts]: fc.Arbitrary<Ts[K]>
    },
    predicate: (...args: Ts) => boolean | void,
  ]
) => {
  const description = args[0]
  const rest = args.slice(1) as Parameters<typeof fc.property>
  Vitest.test('PROPERTY: ' + description, () => {
    const result = fc.check(fc.property(...rest))

    if (result.failed) {
      // Extract just the useful parts from the fast-check error
      const counterexample = result.counterexample?.map((x: unknown) =>
        typeof x === 'string' ? `"${x}"` : JSON.stringify(x)
      ).join(', ') || ''

      // Get the original error if available
      let assertionError = ''
      const r = result as any
      if (r.error && r.error.message) {
        assertionError = r.error.message
      } else if (r.errorInstance) {
        assertionError = String(r.errorInstance)
      }

      const message = [
        `Property failed: ${description}`,
        `Counterexample: [${counterexample}]`,
        assertionError && `\n${assertionError}`,
        `(seed: ${result.seed})`,
      ].filter(Boolean).join('\n')

      throw new Error(message)
    }
  })
}
```

### describe

```typescript
export function describe(): TableBuilderBase<
  { i: unknown; o: unknown; context: {}; fn: Fn.AnyAny }
>
```

### on

```typescript
export function on<$fn extends Fn.AnyAny>(
  $fn: $fn,
): TableBuilderWithFunction<{ i: never; o: never; context: {}; fn: $fn }> {
  const initialState: BuilderState = {
    ...defaultState,
    fn: Option.some($fn),
  }
  return createBuilder({
    ...initialState,
    typeState: { i: undefined, o: undefined, context: {}, fn: $fn },
  }) as TableBuilderWithFunction<
    { i: never; o: never; context: {}; fn: typeof $fn }
  >
}
```

## Types

### Case

```typescript
export type Case<$Input extends object = object> =
  | (object extends $Input ? CaseFilled : (CaseFilled & $Input))
  | CaseTodo
```

### CaseFilled

```typescript
export interface CaseFilled {
  /** Descriptive name for the test case */
  n: string
  /** Skip this test case. If string, provides skip reason */
  skip?: boolean | string
  /** Conditionally skip this test case based on runtime condition */
  skipIf?: () => boolean
  /** Run only this test case (and other test cases marked with only) */
  only?: boolean
  /** Tags for categorizing and filtering test cases */
  tags?: string[]
  /** todo */
  expected?: object
}
```

### CaseTodo

```typescript
export interface CaseTodo {
  /** Descriptive name for the test case */
  n: string
  /** Mark as todo. If string, provides todo reason */
  todo: boolean | string
}
```

### SuiteCaseBase

```typescript
export interface SuiteCaseBase {
  /** Descriptive name for the test case */
  n: string
  /** Skip this test case. If string, provides skip reason */
  skip?: boolean | string
  /** Conditionally skip this test case based on runtime condition */
  skipIf?: () => boolean
  /** Run only this test case (and other test cases marked with only) */
  only?: boolean
  /** Tags for categorizing and filtering test cases */
  tags?: string[]
}
```

### SuiteCase

```typescript
export type SuiteCase<$I, $O, $Custom = {}> =
  & SuiteCaseBase
  & ($I extends void | never ? {} : { i: $I })
  & ($O extends void | never ? {} : { o: $O })
  & $Custom
```

### TestCase

```typescript
export type TestCase<$I, $O, $Custom = {}> =
  | SuiteCase<$I, $O, $Custom>
  | CaseTodo
```
