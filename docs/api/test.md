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

### on

```typescript
export function on<$fn extends Fn.AnyAny>(
  $fn: $fn,
): Types.TestBuilder<
  Types.UpdateState<Types.BuilderTypeStateEmpty, { fn: $fn }>
> {
  const initialState = {
    ...Builder.defaultState,
    fn: Option.some($fn),
  }
  return Builder.create(initialState) as any
}
```

### describe

```typescript
export function describe(
  description?: string,
): Types.TestBuilderEmpty {
  const initialState = description
    ? { ...Builder.defaultState, config: { description } }
    : Builder.defaultState
  return Builder.create(initialState)
}
```
