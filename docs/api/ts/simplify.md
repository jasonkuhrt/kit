# Ts.Simplify

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Simplify
```

```typescript [Barrel]
import { Simplify } from '@wollybeard/kit/ts'
```

:::

## Type Simplification

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `To`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simplify.ts#L49" /> {#t-to-49}

```typescript
type To<
  $DepthRemaining extends Num.Literal,
  $T,
  $Seen = never,
  DN extends Num.Literal = Num.NatDec<$DepthRemaining>,
  SN = $T | $Seen
> =
  // Depth 0 - stop recursing
  $DepthRemaining extends Num.LiteralZero ? $T :
  // Check for circular reference - prevent infinite recursion
  Union.IsHas<$Seen, $T> extends true ? $T :
  // Check if type should be preserved (includes built-ins + user-registered types)
  $T extends GetPreservedTypes ? $T :
  // Handle arrays and tuples - preserve structure with mapped type
  $T extends readonly any[] ? { [K in keyof $T]: To<DN, $T[K], SN> } :
  // Handle Map - traverse both key and value types
  $T extends Map<infer __key__, infer __value__> ? Map<To<DN, __key__, SN>, To<DN, __value__, SN>> :
  // Handle Set - traverse element type
  $T extends Set<infer __element__> ? Set<To<DN, __element__, SN>> :
  // Handle Promise - traverse resolved type
  $T extends Promise<infer __resolved__> ? Promise<To<DN, __resolved__, SN>> :
  // Handle WeakMap - traverse both key and value types
  $T extends WeakMap<infer __key__, infer __value__> ? WeakMap<To<DN, __key__, SN>, To<DN, __value__, SN>> :
  // Handle WeakSet - traverse element type
  $T extends WeakSet<infer __element__> ? WeakSet<To<DN, __element__, SN>> :
  // Try custom types (user-registered via KitLibrarySettings.Simplify.Traversables)
  // Let-Style Binding
  {
    [K in keyof KitLibrarySettings.Simplify.Traversables]:
    KitLibrarySettings.Simplify.Traversables[K] extends { extends: infer __traverse_constraint__, traverse: infer __traverse_kind__ }
    ? $T extends __traverse_constraint__
    ? [Ts.SENTINEL, Kind.Apply<__traverse_kind__, [$T, DN, SN]>]
    : never // pattern doesn't match
    : never // entry malformed
  }[keyof KitLibrarySettings.Simplify.Traversables] extends infer __custom_registry_result__
  ? [__custom_registry_result__] extends [never]
  ? $T extends object
  ? { [k in keyof $T]: To<DN, $T[k], SN> } & {}
  : $T
  : __custom_registry_result__ extends [Ts.SENTINEL, infer __apply_return__]
  ? __apply_return__
  : never // impossible - we've either we dealt with apply return or skipped apply
  : never
```

Simplify a type to a specific depth.

Recursively flattens intersections and mapped types while preserving:

- Error types (Ts.Err.StaticErrorLike)
- Built-in primitives (Date, Error, RegExp, Function)
- Globally registered types (KitLibrarySettings.Ts.PreserveTypes)

Includes circular reference detection to prevent infinite recursion. Traverses into generic containers (Array, Map, Set, Promise, etc.). Supports custom traversal via KitLibrarySettings.Simplify.Traversables.

$DepthRemaining

- How many levels deep to simplify (use -1 for infinite)

$T

- The type to simplify

$Seen

- Internal accumulator for circular reference detection

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Depth 1 - flatten one level
type One = Simplify.To<1, { a: 1 } & { b: { c: 2 } & { d: 3 } }>
// { a: 1; b: { c: 2 } & { d: 3 } } - inner not flattened

// Depth 2 - flatten two levels
type Two = Simplify.To<2, { a: 1 } & { b: { c: 2 } & { d: 3 } }>
// { a: 1; b: { c: 2; d: 3 } } - all levels flattened

// Infinite depth
type All = Simplify.To<-1, DeepType>
// Flattens all levels

// Preserves built-ins
type WithDate = Simplify.To<-1, { created: Date }>
// { created: Date } - Date not expanded

// Traverses containers
type Container = Simplify.To<-1, Map<{ a: 1 } & { b: 2 }, string>>
// Map<{ a: 1; b: 2 }, string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Top`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simplify.ts#L109" /> {#t-top-109}

```typescript
type Top<$T> = To<1, $T>
```

Simplify one level only (top level flattening).

Alias for To1, $T.

$T

- The type to simplify

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Complex = { a: 1 } & { b: { c: 2 } & { d: 3 } }
type Simple = Simplify.Top<Complex>
// { a: 1; b: { c: 2 } & { d: 3 } } - inner not flattened
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Auto`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simplify.ts#L139" /> {#t-auto-139}

```typescript
type Auto<$T> = To<KitLibrarySettings.Perf.Settings['depth'], $T>
```

Simplify using the configured default depth.

Alias for ToKitLibrarySettings.Perf.Settings.depth, $T.

Default depth is 10, configurable via global settings.

$T

- The type to simplify

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// With default depth: 10
type Simple = Simplify.Auto<DeepType>

// Customize depth globally
declare global {
  namespace KitLibrarySettings {
    namespace Perf {
      interface Settings {
        depth: 5
      }
    }
  }
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `All`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simplify.ts#L157" /> {#t-all-157}

```typescript
type All<$T> = To<Num.LiteralInfinity, $T>
```

Simplify all levels (infinite depth).

Alias for To-1, $T.

$T

- The type to simplify

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Complex = { a: 1 } & { b: { c: 2 } & { d: 3 } }
type Simple = Simplify.All<Complex>
// { a: 1; b: { c: 2; d: 3 } } - all levels flattened
```
