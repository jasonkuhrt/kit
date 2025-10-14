# Str.AxisHand.AxisHand

_Str.AxisHand_ / **AxisHand**

AxisHand provides a logical, orientation-aware coordinate system for box model properties.

Unlike physical coordinates (top/left/etc), AxisHand uses logical properties relative to flow direction:

- **main axis**: The primary flow direction (set by orientation)

- **cross axis**: Perpendicular to the main axis

Each axis has **start** and **end** positions, creating a coordinate system that adapts to orientation.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.AxisHand.AxisHand.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.AxisHand.AxisHand.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parse`

```typescript
<$value = number>(input: Input<$value>): Partial<Logical<$value>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/axishand/axishand.ts#L102" />

**Parameters:**

- `input` - AxisHand input in any supported format

**Returns:** Partial logical properties

Parse AxisHand input into logical properties.

Handles all input formats and returns a partial Logical object with only the specified properties.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Logical`

```typescript
type Logical<$value = number> = {
  mainStart?: $value
  mainEnd?: $value
  crossStart?: $value
  crossEnd?: $value
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/axishand/axishand.ts#L47" />

AxisHand provides a logical, orientation-aware coordinate system for box model properties.

Unlike physical coordinates (top/left/etc), AxisHand uses logical properties relative to flow direction:

- **main axis**: The primary flow direction (set by orientation)

- **cross axis**: Perpendicular to the main axis

Each axis has **start** and **end** positions, creating a coordinate system that adapts to orientation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Global number - all sides
AxisHand.parse(2)
// → { mainStart: 2, mainEnd: 2, crossStart: 2, crossEnd: 2 }

// Axis shorthands
AxisHand.parse([2, 4])
// → { mainStart: 2, mainEnd: 2, crossStart: 4, crossEnd: 4 }

// Binary axis - nested arrays
AxisHand.parse([[1, 2], [3, 4]])
// → { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }

// Per-axis array with shorthand
AxisHand.parse([[1, 2], 4])
// → { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }

// Object syntax
AxisHand.parse({ main: [1, 2], cross: 4 })
// → { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }

// Sparse values
AxisHand.parse([[2], [, 4]])
// → { mainStart: 2, crossEnd: 4 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `AxisValue`

```typescript
type AxisValue<$value = number> =
  | $value // shorthand: both sides
  | [$value] // [start]
  | [$value, $value] // [start, end]
  | [$value, undefined] // [start only]
  | [undefined, $value] // [end only]
  | { start?: $value; end?: $value }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/axishand/axishand.ts#L64" />

Value specification for a single axis.

Can be:

- A value (shorthand for both start and end)

- An array

[start, end]

or sparse

[start]

,

[, end]

- An object with explicit

start

and

end

properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Input`

```typescript
type Input<$value = number> =
  | $value // all sides
  | [$value, $value] // [main, cross] - axis shorthands
  | [AxisValue<$value>, AxisValue<$value>] // [[main...], [cross...]] - binary axis
  | [AxisValue<$value>] // [[main...]] - main axis only
  | { main?: AxisValue<$value>; cross?: AxisValue<$value> } // object with axes
  | Logical<$value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/axishand/axishand.ts#L85" />

Input format for AxisHand.

Supports multiple syntaxes for progressive complexity:

1. Global value:

2

→ all sides

2. Axis shorthands:

[2, 4]

→ [main, cross]

3. Binary axis:

[[1, 2], [3, 4]]

→ [[main], [cross]]

4. Sparse binary:

[[2]]

→ main only

5. Object syntax:

{ main: [1, 2], cross: 4 }

6. Explicit logical:

{ mainStart: 1, mainEnd: 2, ... }
