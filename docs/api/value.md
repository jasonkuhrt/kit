# Value

General value utilities for common JavaScript values and patterns.

Provides utilities for lazy values, type guards for symbols and dates,
identity proxies, and lazy value resolution. Includes helpers for working
with deferred computations and value type checking.

## Import

```typescript
import { Value } from '@wollybeard/kit/value'
```

## Functions

### lazy <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L23)</sub>

```typescript
;(<const value>(value: value) => Lazy<value>)
```

### resolveLazyFactory <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L82)</sub>

```typescript
;(<value>(lazyMaybeValue: LazyMaybe<value>) => () => value)
```

### isSymbol <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L114)</sub>

```typescript
(value: unknown) => value is symbol
```

### isDate <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L137)</sub>

```typescript
(value: unknown) => value is Date
```

## Constants

### identityProxy <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L99)</sub>

```typescript
{}
```

## Types

### Lazy <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L7)</sub>

A lazy value that is computed when called.

```typescript
export type Lazy<$Value> = () => $Value
```

### LazyMaybe <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L29)</sub>

A value that may be either immediate or lazy.

```typescript
export type LazyMaybe<$Value = unknown> = $Value | Lazy<$Value>
```

### resolveLazy <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/value/value.ts#L37)</sub>

Type-level resolution of a LazyMaybe value.
Extracts the underlying value type whether it's lazy or immediate.

```typescript
export type resolveLazy<$LazyMaybeValue extends LazyMaybe<any>> =
  $LazyMaybeValue extends Lazy<infer __value__> ? __value__ : $LazyMaybeValue
```
