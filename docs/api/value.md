# Value

General value utilities for common JavaScript values and patterns.

Provides utilities for lazy values, type guards for symbols and dates, identity proxies, and lazy value resolution. Includes helpers for working with deferred computations and value type checking.

## Import

::: code-group

```typescript [Namespace]
import { Value } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Value from '@wollybeard/kit/value'
```

:::

## Lazy Values

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Lazy`

```typescript
type Lazy<$Value> = () => $Value
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L9" />

A lazy value that is computed when called.

$Value

- The type of value that will be returned when the lazy function is invoked

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `lazy`

```typescript
<value>(value: value): Lazy<value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L27" />

**Parameters:**

- `value` - The value to wrap in a lazy computation

**Returns:** A function that returns the wrapped value when called

Creates a lazy value that returns the given value when invoked.

value

- The type of the value to be lazily returned

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:lazy:1]
const lazyNumber = Value.lazy(42)
// [!code word:log:1]
console.log(lazyNumber()) // 42

// [!code word:lazy:1]
const lazyObject = Value.lazy({ foo: 'bar' })
// [!code word:log:1]
console.log(lazyObject()) // { foo: 'bar' }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `LazyMaybe`

```typescript
type LazyMaybe<$Value = unknown> = $Value | Lazy<$Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L35" />

A value that may be either immediate or lazy.

$Value

- The type of the value, whether immediate or lazy

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `resolveLazy`

```typescript
type resolveLazy<$LazyMaybeValue extends LazyMaybe<any>> =
  $LazyMaybeValue extends Lazy<infer __value__> ? __value__ : $LazyMaybeValue
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L45" />

Type-level resolution of a LazyMaybe value. Extracts the underlying value type whether it's lazy or immediate.

$LazyMaybeValue

- A value that may be lazy or immediate

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `resolveLazy`

```typescript
<lazyMaybeValue extends LazyMaybe>(lazyMaybeValue: lazyMaybeValue): resolveLazy<lazyMaybeValue>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L66" />

**Parameters:**

- `lazyMaybeValue` - A value that may be lazy (function) or immediate

**Returns:** The resolved value

Resolves a value that may be lazy or immediate. If the value is a function (lazy), it calls it to get the result. If the value is immediate, it returns it as-is.

lazyMaybeValue

- The type of the potentially lazy value

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:log:1]
// [!code word:resolveLazy:1]
console.log(Value.resolveLazy(42)) // 42
// [!code word:log:1]
// [!code word:resolveLazy:1]
console.log(Value.resolveLazy(() => 42)) // 42

const lazyConfig = () => ({ port: 3000 })
// [!code word:log:1]
// [!code word:resolveLazy:1]
console.log(Value.resolveLazy(lazyConfig)) // { port: 3000 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `resolveLazyFactory`

```typescript
<value>(lazyMaybeValue: LazyMaybe<value>): () => value
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L94" />

**Parameters:**

- `lazyMaybeValue` - A value that may be lazy (function) or immediate

**Returns:** A function that when called, resolves and returns the value

Creates a factory function that resolves a lazy or immediate value when called. This is useful when you want to defer the resolution of a LazyMaybe value.

value

- The type of the value to be resolved

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:resolveLazyFactory:1]
const getValue = Value.resolveLazyFactory(42)
// [!code word:log:1]
console.log(getValue()) // 42

// [!code word:resolveLazyFactory:1]
const getLazyValue = Value.resolveLazyFactory(() => 42)
// [!code word:log:1]
console.log(getLazyValue()) // 42

// Useful for configuration that may be lazy
// [!code word:resolveLazyFactory:1]
const getConfig = Value.resolveLazyFactory(() => ({ apiUrl: 'https://api.example.com' }))
// [!code word:log:1]
console.log(getConfig()) // { apiUrl: 'https://api.example.com' }
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isSymbol`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L130" />

**Parameters:**

- `value` - The value to check

**Returns:** True if the value is a symbol

Type guard to check if a value is a symbol.

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:isSymbol:1]
Value.isSymbol(Symbol('test'))  // true
// [!code word:isSymbol:1]
Value.isSymbol('test')  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isDate`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L155" />

**Parameters:**

- `value` - The value to check

**Returns:** True if the value is a Date

Type guard to check if a value is a Date instance.

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:isDate:1]
Value.isDate(new Date())  // true
// [!code word:isDate:1]
Value.isDate('2024-01-01')  // false
// [!code word:isDate:1]
// [!code word:now:1]
Value.isDate(Date.now())  // false
```

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `identityProxy`

```typescript
{ }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/value/value.ts#L113" />

A proxy that returns itself for any property access. Useful for default values or chaining patterns.

**Examples:**

```typescript twoslash
// @noErrors
import { Value } from '@wollybeard/kit/value'
// ---cut---
// [!code word:baz:1]
Value.identityProxy.foo.bar.baz  // Returns identityProxy
// [!code word:anything:1]
Value.identityProxy.anything()  // Returns identityProxy
```
