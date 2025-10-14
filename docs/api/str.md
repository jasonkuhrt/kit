# Str

String utilities for text manipulation and analysis.

Provides comprehensive string operations including case conversion, splitting,

matching, replacement, templating, and character utilities. Features type-safe

APIs with strong inference for string literals and patterns.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'
```

:::

## Namespaces

- [**`AxisHand`**](/api/str/axis-hand)
- [**`Case`**](/api/str/case)
- [**`Char`**](/api/str/char) - Uppercase letter.
- [**`Nat`**](/api/str/nat)
- [**`Tpl`**](/api/str/tpl)
- [**`Code`**](/api/str/code)
- [**`Text`**](/api/str/text)
- [**`Visual`**](/api/str/visual)

## Builder

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultRender`

```typescript
;((value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L12" />

Default render function for string builders.

Joins lines with newline characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Builder`

```typescript
interface Builder {
  /**
   * Add lines to the builder.
   * @param linesInput - Lines to add (null values are filtered out)
   * @returns The builder instance for chaining
   */
  (...linesInput: LinesInput): Builder
  /**
   * Add content using template literal syntax.
   * @param strings - Template string array
   * @param values - Interpolated values
   * @returns The builder instance for chaining
   */
  (strings: TemplateStringsArray, ...values: string[]): Builder
  /**
   * The internal state containing accumulated lines.
   */
  state: State
  /**
   * Render the accumulated lines into a single string.
   * @returns The rendered string
   */
  render: () => string
  /**
   * Alias for render() to support string coercion.
   * @returns The rendered string
   */
  toString(): string
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L19" />

String builder interface for constructing multi-line strings.

Supports both function call syntax and template literal syntax.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LinesInput`

```typescript
type LinesInput = (Line | null)[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L53" />

Input type for lines

- allows null values which are filtered out.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Lines`

```typescript
type Lines = Line[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L59" />

Array of line strings.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Line`

```typescript
type Line = string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L65" />

A single line of text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `State`

```typescript
interface State {
  /**
   * Accumulated lines.
   */
  lines: Lines
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L71" />

Internal state of the string builder.

## Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `table`

```typescript
(input: { data: Record<string, string>; separator?: string | false | undefined; separatorAlignment?: boolean; }): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/table.ts#L32" />

**Parameters:**

- `input` - Configuration object

**Returns:** Formatted table string with aligned columns

Format a key-value object as an aligned table string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.table({
  data: { name: 'John', age: '25', city: 'NYC' },
})
// Returns:
// name → John
// age  → 25
// city → NYC

Str.table({
  data: { foo: 'bar', hello: 'world' },
  separator: ' = ',
  separatorAlignment: false,
})
// Returns:
// foo =   bar
// hello = world
```

## Pattern Matching

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pattern`

```typescript
<matches extends Matches>(pattern: RegExp): Pattern<matches>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L53" />

**Parameters:**

- `pattern` - The regular expression pattern

**Returns:** A typed pattern that preserves capture group information

Create a typed pattern from a regular expression.

Enables type-safe capture groups when used with

match

.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const p = pattern<{ groups: ['name', 'age'] }>(/(?<name>\w+) is (?<age>\d+)/)
const result = match('John is 25', p)
if (Option.isSome(result)) {
  console.log(result.value.groups.name) // 'John' (typed)
  console.log(result.value.groups.age) // '25' (typed)
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `match`

```typescript
<matches extends Matches>(string: string, pattern: RegExp | Pattern<matches>): Option<RegExpMatchResult<matches>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L80" />

**Parameters:**

- `string` - The string to match against
- `pattern` - Regular expression or typed pattern

**Returns:** Option of match result with typed capture groups, or None if no match

Match a string against a pattern with type-safe results.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const result = Str.match('hello world', /hello (\w+)/)
if (Option.isSome(result)) {
  console.log(result.value[0]) // 'hello world'
  console.log(result.value[1]) // 'world'
}
```

## Predicates

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatch`

```typescript
(value: string, pattern: PatternInput): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L105" />

**Parameters:**

- `value` - The string to test
- `pattern` - String for exact match or RegExp for pattern match

**Returns:** True if the value matches the pattern

Check if a string matches a pattern.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.isMatch('hello', 'hello') // true
Str.isMatch('hello', /^h.*o$/) // true
Str.isMatch('world', 'hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchOn`

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L124" />

Curried version of

isMatch

with value first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const isHello = Str.isMatchOn('hello')
isHello('hello') // true
isHello(/^h.*o$/) // true
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchWith`

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L138" />

Curried version of

isMatch

with pattern first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const matchesHello = Str.isMatchWith('hello')
matchesHello('hello') // true
matchesHello('world') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isntMatch`

```typescript
(pattern: PatternInput): (value: string) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L152" />

**Parameters:**

- `pattern` - String for exact match or RegExp for pattern match

**Returns:** Function that takes a value and returns true if it doesn't match

Check if a string does not match a pattern.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const notHello = Str.isntMatch('hello')
notHello('world') // true
notHello('hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchOn`

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L162" />

Curried version of

isntMatch

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchWith`

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L170" />

Curried version of

isntMatch

with pattern first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatchAny`

```typescript
(value: string, patterns: PatternsInput): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L189" />

**Parameters:**

- `value` - The string to test
- `patterns` - Array of strings or RegExp patterns (or a single pattern)

**Returns:** True if the value matches any pattern

Check if a string matches any of the provided patterns.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.isMatchAny('hello', ['hello', 'world']) // true
Str.isMatchAny('hello', [/^h/, /o$/]) // true
Str.isMatchAny('foo', ['hello', 'world']) // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyOn`

```typescript
;((value: string) => (patterns: PatternsInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L200" />

Curried version of

isMatchAny

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyWith`

```typescript
;((patterns: PatternsInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L215" />

Curried version of

isMatchAny

with patterns first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const matchesGreeting = Str.isMatchAnyWith(['hello', 'hi', /^hey/])
matchesGreeting('hello') // true
matchesGreeting('hey there') // true
matchesGreeting('goodbye') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNotMatchAny`

```typescript
(patternOrPatterns: PatternsInput): (value: string) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L229" />

**Parameters:**

- `patternOrPatterns` - Array of strings or RegExp patterns (or a single pattern)

**Returns:** Function that takes a value and returns true if it doesn't match any pattern

Check if a string does not match any of the provided patterns.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const notGreeting = Str.isNotMatchAny(['hello', 'hi'])
notGreeting('goodbye') // true
notGreeting('hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyOn`

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L239" />

Curried version of

isNotMatchAny

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyWith`

```typescript
;((value: string) => (patternOrPatterns: PatternsInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L247" />

Curried version of

isNotMatchAny

with patterns first.

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `interpolate`

```typescript
(template: string): (args: TemplateArgs) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L18" />

**Parameters:**

- `template` - Template string containing $

variable

placeholders

**Returns:** Function that takes args object and returns interpolated string

Interpolate variables into a template string using $

variable

syntax.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const greeting = Str.interpolate('Hello ${name}, you are ${age} years old')
greeting({ name: 'John', age: 25 }) // 'Hello John, you are 25 years old'

const template = Str.interpolate('${greeting} ${name}!')
template({ greeting: 'Hi', name: 'Alice' }) // 'Hi Alice!'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `templateVariablePattern`

```typescript
RegExp
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L30" />

Regular expression pattern to match template variables in $

variable

format.

Captures the variable name inside the braces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TemplateArgs`

```typescript
type TemplateArgs = Record<string, Json.Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L37" />

Arguments object for template interpolation.

Maps variable names to their JSON-serializable values.

## Text Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Box`

```typescript
class {

  // Properties
  paddingHooks: Partial<Record<"mainStart" | "mainEnd" | "crossStart" | "crossEnd", ((ctx: any) => number | ((v: number) => number))[]>>
  marginHooks: Partial<Record<"mainStart" | "mainEnd" | "crossStart" | "crossEnd", ((ctx: any) => number | ((v: number) => number))[]>>
  borderEdgeHooks: Partial<Record<"left" | "right" | "top" | "bottom", ((ctx: any) => string | ((v: string) => string))[]>>
  borderCornerHooks: Partial<Record<"topLeft" | "topRight" | "bottomRight" | "bottomLeft", ((ctx: any) => string | ((v: string) => string))[]>>
  borderEdgeStyles: Partial<Record<"left" | "right" | "top" | "bottom", Style>>
  borderCornerStyles: Partial<Record<"topLeft" | "topRight" | "bottomRight" | "bottomLeft", Style>>
  static String: transformOrFail<typeof Box, typeof String, never>

  // Methods
  toString(): string
  content$(content: string | (string | Box)[]): this
  pad$(padding: PaddingInput): this
  margin$(margin: MarginInput): this
  border$(border: BorderInput): this
  span$(span: SpanInput): this
  spanRange$(spanRange: { readonly main?: { readonly min?: number | undefined; readonly max?: number | undefined; } | undefined; readonly cross?: { readonly min?: number | undefined; readonly max?: number | undefined; } | undefined; }): this
  gap$(gap: GapInput): this
  static content(box: Box, content: string | (string | Box)[]): Box
  static pad(box: Box, padding: PaddingInput): Box
  static margin(box: Box, margin: MarginInput): Box
  static border(box: Box, border: BorderInput): Box
  static span(box: Box, span: SpanInput): Box
  static spanRange(box: Box, spanRange: { readonly main?: { readonly min?: number | undefined; readonly max?: number | undefined; } | undefined; readonly cross?: { readonly min?: number | undefined; readonly max?: number | undefined; } | undefined; }): Box
  static gap(box: Box, gap: GapInput): Box
  static encode(box: Box): string
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L1248" />

**Properties:**

- `String` - Schema for encoding Box to string representation.

This is a one-way transformation - boxes can be encoded to strings,

but cannot be decoded from strings.

Box structure with content and optional styling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `OrientationSchema`

```typescript
Literal<['vertical', 'horizontal']>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L137" />

Orientation determines the flow direction of the box.

-

vertical

: Content flows top-to-bottom (main axis = vertical)

-

horizontal

: Content flows left-to-right (main axis = horizontal)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Orientation`

```typescript
type Orientation = typeof OrientationSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L144" />

Orientation type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PaddingSchema`

```typescript
Struct<
  {
    mainStart: optional<typeof Number>
    mainEnd: optional<typeof Number>
    crossStart: optional<typeof Number>
    crossEnd: optional<typeof Number>
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L155" />

Padding configuration using logical properties.

Logical properties adapt to orientation:

-

mainStart

/

mainEnd

: Along the flow direction

-

crossStart

/

crossEnd

: Perpendicular to flow

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Padding`

```typescript
type Padding = typeof PaddingSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L190" />

Padding configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `PaddingInput`

```typescript
type PaddingInput = AxisHand.Input | WithHooks<Padding, 'padding'>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L205" />

Padding input accepting AxisHand notation and hook functions.

Supports AxisHand patterns:

- Single value:

2

→ all sides

- Axis shorthands:

[2, 4]

→ [main, cross]

- Binary axis:

[[1, 2], [3, 4]]

→ [[mainStart, mainEnd], [crossStart, crossEnd]]

- Per-axis arrays:

[[1, 2], 4]

→ asymmetric main, symmetric cross

- Object:

{ main: [1, 2], cross: 4 }

- With hooks:

{ main: { start: (ctx) =&gt; 2 } }

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MarginSchema`

```typescript
Struct<
  {
    mainStart: optional<typeof Number>
    mainEnd: optional<typeof Number>
    crossStart: optional<typeof Number>
    crossEnd: optional<typeof Number>
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L214" />

Margin configuration using logical properties.

Logical properties adapt to orientation (same as Padding).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Margin`

```typescript
type Margin = typeof MarginSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L249" />

Margin configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `MarginInput`

```typescript
type MarginInput = AxisHand.Input | WithHooks<Margin, 'margin'>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L258" />

Margin input accepting AxisHand notation and hook functions.

Supports AxisHand patterns (same as PaddingInput).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `SpanValue`

```typescript
type SpanValue = number | bigint
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L268" />

Span value type

- size in characters or percentage of parent.

-

number

(

1): Absolute size in characters

-

bigint

: Percentage of parent span (e.g.,

50n

= 50%)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SpanSchema`

```typescript
Struct<
  {
    main: optional<Union<[typeof Number, typeof BigIntFromSelf]>>
    cross: optional<Union<[typeof Number, typeof BigIntFromSelf]>>
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L281" />

Span configuration using logical properties.

Defines exact/desired size along each axis:

-

main

: Size along flow direction (mainSpan)

-

cross

: Size perpendicular to flow (crossSpan)

Percentage values (bigint) are resolved relative to parent's available span.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Span`

```typescript
type Span = typeof SpanSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L306" />

Span configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SpanInput`

```typescript
type SpanInput = AxisHand.Input<SpanValue>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L320" />

Span input accepting AxisHand notation.

Supports AxisHand patterns with SpanValue (number | bigint):

- Single value:

80

→ main and cross both 80 chars

- Single percentage:

50n

→ main and cross both 50% of parent

- Axis shorthands:

[50n, 80]

→ main 50%, cross 80 chars

- Binary axis:

[[40, 50n], [80, 100]]

→ different start/end (unusual for span)

- Object:

{ main: 50n, cross: 80 }

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SpanRangeSchema`

```typescript
Struct<
  {
    main: optional<
      Struct<{ min: optional<typeof Number>; max: optional<typeof Number> }>
    >
    cross: optional<
      Struct<{ min: optional<typeof Number>; max: optional<typeof Number> }>
    >
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L327" />

Span range constraints (min/max) using logical properties.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SpanRange`

```typescript
type SpanRange = typeof SpanRangeSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L350" />

Span range configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `GapSchema`

```typescript
Struct<{ main: optional<typeof Number>; cross: optional<typeof Number> }>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L361" />

Gap configuration using logical properties.

Defines space between array items (container property):

- Vertical orientation: main=newlines between items, cross=spaces between items

- Horizontal orientation: main=spaces between items, cross=newlines between items

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Gap`

```typescript
type Gap = typeof GapSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L382" />

Gap configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `GapInput`

```typescript
type GapInput = number | Gap
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L392" />

Gap input accepting number or object with logical properties.

-

number

: Same gap on both axes

-

{ main?: number, cross?: number }

: Per-axis gaps

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderStyleSchema`

```typescript
Literal<['single', 'double', 'rounded', 'bold', 'ascii']>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L399" />

Border style presets.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderStyle`

```typescript
type BorderStyle = typeof BorderStyleSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L406" />

Border style preset type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderEdgesSchema`

```typescript
Struct<
  {
    top: optional<typeof String>
    right: optional<typeof String>
    bottom: optional<typeof String>
    left: optional<typeof String>
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L413" />

Border edge characters (physical coordinates).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderEdges`

```typescript
type BorderEdges = typeof BorderEdgesSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L440" />

Border edge configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderCornersSchema`

```typescript
Struct<
  {
    topLeft: optional<typeof String>
    topRight: optional<typeof String>
    bottomRight: optional<typeof String>
    bottomLeft: optional<typeof String>
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L447" />

Border corner characters (physical coordinates).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderCorners`

```typescript
type BorderCorners = typeof BorderCornersSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L474" />

Border corner configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BorderEdgesInput`

```typescript
type BorderEdgesInput =
  | Clockhand.Value<string | CharStyle>
  | WithHooks<BorderEdges, 'border.edges'>
  | {
    [K in keyof BorderEdges]?:
      | string
      | CharStyle
      | WithHook<
        string | undefined,
        StyleCategoryMap[`border.edges.${K & string}`]
      >
  }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L489" />

Border edge input supporting Clockhand notation, CharStyle, and hook functions.

Supports Clockhand patterns:

- Single value:

'─'

→ all edges

- Single styled:

{ char: '─', color: { foreground: 'blue' } }

→ all edges

- Array:

['─', '│', '─', '│']

→ [top, right, bottom, left]

- Object:

{ top: '─', left: '│' }

- Object with CharStyle:

{ top: { char: '─', color: { foreground: 'red' } } }

- With hooks:

{ top: (ctx) =&gt; '─' }

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BorderCornersInput`

```typescript
type BorderCornersInput =
  | Clockhand.Value<string | CharStyle>
  | WithHooks<BorderCorners, 'border.corners'>
  | {
    [K in keyof BorderCorners]?:
      | string
      | CharStyle
      | WithHook<
        string | undefined,
        StyleCategoryMap[`border.corners.${K & string}`]
      >
  }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L512" />

Border corner input supporting Clockhand notation, CharStyle, and hook functions.

Supports Clockhand patterns:

- Single value:

'+'

→ all corners

- Single styled:

{ char: '+', color: { foreground: 'yellow' }, bold: true }

→ all corners

- Array:

['┌', '┐', '┘', '└']

→ [topLeft, topRight, bottomRight, bottomLeft] (clockwise)

- Object:

{ topLeft: '┌', topRight: '┐' }

- Object with CharStyle:

{ topLeft: { char: '┌', color: { foreground: 'red' }, bold: true } }

- With hooks:

{ topLeft: (ctx) =&gt; '┌' }

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderCharsInput`

```typescript
type BorderCharsInput = {
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L527" />

Border character configuration input with nested edges/corners.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderSchema`

```typescript
Struct<
  {
    style: optional<Literal<['single', 'double', 'rounded', 'bold', 'ascii']>>
    edges: optional<
      Struct<
        {
          top: optional<typeof String>
          right: optional<typeof String>
          bottom: optional<typeof String>
          left: optional<typeof String>
        }
      >
    >
    corners: optional<
      Struct<
        {
          topLeft: optional<typeof String>
          topRight: optional<typeof String>
          bottomRight: optional<typeof String>
          bottomLeft: optional<typeof String>
        }
      >
    >
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L540" />

Border configuration.

Can specify a preset style, custom edges, custom corners, or a combination.

Resolution order: style → edges override → corners override.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Border`

```typescript
type Border = typeof BorderSchema.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L564" />

Border configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderInput`

```typescript
type BorderInput = {
  style?: BorderStyle
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L578" />

Border configuration input with hook support.

Supports:

-

style

: Preset border style (provides edges and corners)

-

edges

: Edge characters (with Clockhand support)

-

corners

: Corner characters (with Clockhand support)

Resolution order: style → edges/corners override

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BoxContent`

```typescript
type BoxContent = string | StyledText | readonly (string | StyledText | Box)[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L1241" />

Content type for Box

- can be a string, styled text, or array of these and boxes.

Supports:

- Plain strings:

'Hello'

- Styled text:

{ text: 'Hello', color: { foreground: 'red' }, bold: true }

- Arrays:

['Header', { text: 'Body', color: { foreground: 'green' } }, Box.make(...)]

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultIndentCharacter`

```typescript
' '
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L17" />

Default character used for indentation (non-breaking space).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultLineSeparator`

```typescript
'\n'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L23" />

Default line separator character (newline).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Column`

```typescript
type Column = string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L31" />

A column is a vertical stack of lines.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `lines`

```typescript
(value: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L47" />

Split text into an array of lines.

Pre-configured

splitWith

using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.Text.lines('hello\nworld\n!') // ['hello', 'world', '!']
Str.Text.lines('single line') // ['single line']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `unlines`

```typescript
;((value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L61" />

Join an array of lines into text.

Pre-configured

joinWith

using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.Text.unlines(['hello', 'world', '!']) // 'hello\nworld\n!'
Str.Text.unlines(['single line']) // 'single line'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indent`

```typescript
(text: string, size?: number | undefined): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L77" />

**Parameters:**

- `text` - The text to indent
- `size` - Number of spaces to indent (default:

defaultIndentSize

)

**Returns:** The indented text

Indent each line of text by a specified number of spaces.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.indent('hello\nworld') // '  hello\n  world'
Str.indent('line1\nline2', 4) // '    line1\n    line2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentOn`

```typescript
;((text: string) => (size?: number | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L88" />

Curried version of

indent

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentWith`

```typescript
;((size?: number | undefined) => (text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L101" />

Curried version of

indent

with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const indent4 = Str.indentWith(4)
indent4('hello\nworld') // '    hello\n    world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indentBy`

```typescript
(text: string, prefixOrFn: string | ((line: string, lineIndex: number) => string)): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L124" />

**Parameters:**

- `text` - The text to indent
- `prefixOrFn` - String to prepend to each line, or function

(line: string, lineIndex: number) => string

**Returns:** The indented text

Indent each line using a custom prefix string or function.

When given a function, it receives both the line content and index, allowing for content-aware indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Fixed string prefix
Str.indentBy('hello\nworld', '>>> ') // '>>> hello\n>>> world'

// Dynamic prefix based on line index (ignore line content with _)
Str.indentBy('line1\nline2\nline3', (_, i) => `${i + 1}. `)
// '1. line1\n2. line2\n3. line3'

// Content-aware indentation
Str.indentBy('title\nitem', (line, i) => line === 'title' ? '' : '  ')
// 'title\n  item'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByOn`

```typescript
;((text: string) =>
(prefixOrFn: string | ((line: string, lineIndex: number) => string)) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L139" />

Curried version of

indentBy

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByWith`

```typescript
;((prefixOrFn: string | ((line: string, lineIndex: number) => string)) =>
(text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L160" />

Curried version of

indentBy

with prefix first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const addArrow = Str.indentByWith('→ ')
addArrow('hello\nworld') // '→ hello\n→ world'

const numbered = Str.indentByWith((_, i) => `${i}. `)
numbered('first\nsecond') // '0. first\n1. second'

const conditionalIndent = Str.indentByWith((line, i) =>
  line.startsWith('#') ? '' : '  '
)
conditionalIndent('# Title\nContent') // '# Title\n  Content'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `stripIndent`

```typescript
(text: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L182" />

**Parameters:**

- `text` - The text to dedent

**Returns:** The dedented text

Remove common leading whitespace from all lines.

Finds the minimum indentation across all non-empty lines and removes that amount from every line.

This is useful for dedenting code blocks or template strings while preserving relative indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.stripIndent('    line1\n      line2\n    line3')
// 'line1\n  line2\nline3'

Str.stripIndent('  code\n    nested\n  code')
// 'code\n  nested\ncode'

// Empty lines are ignored when calculating minimum indent
Str.stripIndent('    line1\n\n    line2')
// 'line1\n\nline2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultPadCharacter`

```typescript
' '
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L208" />

Default character used for padding.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pad`

```typescript
(text: string, size: number, side?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L225" />

**Parameters:**

- `text` - The text to pad
- `size` - Number of padding characters to add
- `side` - Which side to add padding ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** The padded text

Add padding characters to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.pad('hello', 3, 'left') // '   hello'
Str.pad('hello', 3, 'right') // 'hello   '
Str.pad('hello', 2, 'left', '-') // '--hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padOn`

```typescript
;((text: string) =>
(size: number) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L240" />

Curried version of

pad

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padWith`

```typescript
;((size: number) =>
(text: string) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L248" />

Curried version of

pad

with size first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padLeft`

```typescript
(text: string, size: number, char?: string = defaultPadCharacter): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L263" />

**Parameters:**

- `text` - The text to pad
- `size` - Number of padding characters to add
- `char` - Character to use for padding (default: space)

**Returns:** The left-padded text

Add left padding to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.padLeft('hello', 3) // '   hello'
Str.padLeft('hello', 2, '0') // '00hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftOn`

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L273" />

Curried version of

padLeft

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftWith`

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L286" />

Curried version of

padLeft

with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const pad3 = Str.padLeftWith(3)
pad3('hi') // '   hi'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padRight`

```typescript
(text: string, size: number, char?: string = defaultPadCharacter): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L301" />

**Parameters:**

- `text` - The text to pad
- `size` - Number of padding characters to add
- `char` - Character to use for padding (default: space)

**Returns:** The right-padded text

Add right padding to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.padRight('hello', 3) // 'hello   '
Str.padRight('hello', 2, '.') // 'hello..'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightOn`

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L311" />

Curried version of

padRight

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightWith`

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L324" />

Curried version of

padRight

with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const pad3 = Str.padRightWith(3)
pad3('hi') // 'hi   '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `span`

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L351" />

**Parameters:**

- `text` - The text to align
- `width` - Target width (in characters)
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** The aligned text

Align text within a specified width by adding padding.

This ensures text spans exactly the target width, aligning content to the left or right.

If the text is already wider than the target width, no padding is added.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Left-align (pad right)
Str.span('hi', 5, 'left') // 'hi   '

// Right-align (pad left)
Str.span('hi', 5, 'right') // '   hi'

// Text already wider - no padding added
Str.span('hello world', 5, 'left') // 'hello world' (unchanged)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanOn`

```typescript
;((text: string) =>
(width: number) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L368" />

Curried version of

span

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanWith`

```typescript
;((width: number) =>
(text: string) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L383" />

Curried version of

span

with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const span8 = Str.spanWith(8)
span8('Name', 'left') // 'Name    '
span8('Age', 'right') // '     Age'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fit`

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L427" />

**Parameters:**

- `text` - The text to constrain
- `width` - Exact target width (in characters)
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** Text constrained to exact width

Constrain text to exact width by cropping and/or padding.

Unlike

span

which only pads (leaving text unchanged if too long),

this function guarantees the exact width by:

- Cropping text if it exceeds the target width

- Padding text if it's shorter than the target width

This is useful for fixed-width layouts where column widths must be exact,

such as table columns, CSV files, and fixed-format text files.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Text too long - gets cropped
Str.fit('hello world', 5, 'left') // 'hello'

// Text too short - gets padded
Str.fit('hi', 5, 'left') // 'hi   '
Str.fit('hi', 5, 'right') // '   hi'

// Perfect fit - unchanged
Str.fit('exact', 5, 'left') // 'exact'

// Use case: Fixed-width table columns
const columns = ['Name', 'Email', 'Status'].map(
  (header, i) => Str.fit(header, [10, 20, 8][i], 'left'),
)
// ['Name      ', 'Email               ', 'Status  ']

// CSV formatting with fixed columns
const row = [name, email, status].map((val, i) =>
  Str.fit(val, [20, 30, 10][i], 'left')
).join(',')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitOn`

```typescript
;((text: string) =>
(width: number) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L443" />

Curried version of

fit

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitWith`

```typescript
;((width: number) =>
(text: string) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L462" />

Curried version of

fit

with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Create fixed-width formatters
const nameColumn = Str.fitWith(20)
const statusColumn = Str.fitWith(10)

nameColumn('John Doe', 'left') // 'John Doe            '
statusColumn('Active', 'left') // 'Active    '
statusColumn('Very Long Status', 'left') // 'Very Long '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapLines`

```typescript
(text: string, fn: (line: string, index: number) => string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L479" />

**Parameters:**

- `text` - The text to transform
- `fn` - Function to apply to each line, receiving the line and its index

**Returns:** The transformed text

Map a transformation function over each line of text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.mapLines('hello\nworld', (line) => line.toUpperCase())
// 'HELLO\nWORLD'

Str.mapLines('a\nb\nc', (line, i) => `${i}: ${line}`)
// '0: a\n1: b\n2: c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesOn`

```typescript
;((text: string) => (fn: (line: string, index: number) => string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L489" />

Curried version of

mapLines

with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesWith`

```typescript
;((fn: (line: string, index: number) => string) => (text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L502" />

Curried version of

mapLines

with function first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const uppercase = Str.mapLinesWith((line) => line.toUpperCase())
uppercase('hello\nworld') // 'HELLO\nWORLD'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StyledPrefix`

```typescript
type StyledPrefix = {
  /**
   * The prefix text/symbol to display.
   */
  symbol: string
  /**
   * Optional function to colorize the prefix.
   */
  color?: (text: string) => string
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L512" />

Styled prefix that can have an optional color function.

Used with

formatBlock

for colored line prefixes.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `formatBlock`

```typescript
(block: string, opts: { prefix?: string | StyledPrefix; indent?: number; excludeFirstLine?: boolean; }): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L566" />

**Parameters:**

- `block` - The text block to format
- `opts` - Formatting options

**Returns:** Formatted text block

Format a multi-line text block with line-by-line transformations.

Processes each line of text, adding a prefix and optional indentation.

Supports excluding the first line and styled prefixes with colors.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Simple string prefix
Str.formatBlock('line1\nline2\nline3', { prefix: '> ' })
// '> line1\n> line2\n> line3'

// With indentation
Str.formatBlock('line1\nline2', { prefix: '| ', indent: 2 })
// '|   line1\n|   line2'

// Exclude first line (useful for continuing indentation)
Str.formatBlock('header\nline1\nline2', {
  prefix: '  ',
  excludeFirstLine: true,
})
// 'header\n  line1\n  line2'

// Single line - returned as-is
Str.formatBlock('single', { prefix: '> ' })
// 'single'

// Styled prefix with color function
Str.formatBlock('data\nmore data', {
  prefix: {
    symbol: '│ ',
    color: (text) => `\x1b[90m${text}\x1b[0m`, // gray color
  },
  indent: 2,
})
// '\x1b[90m│ \x1b[0m  data\n\x1b[90m│ \x1b[0m  more data'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `formatBlockOn`

```typescript
;((block: string) =>
(
  opts: {
    prefix?: string | StyledPrefix
    indent?: number
    excludeFirstLine?: boolean
  },
) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L598" />

Curried version of

formatBlock

with block first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `formatBlockWith`

```typescript
;((
  opts: {
    prefix?: string | StyledPrefix
    indent?: number
    excludeFirstLine?: boolean
  },
) =>
(block: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L612" />

Curried version of

formatBlock

with options first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const addSpine = Str.formatBlockWith({ prefix: '│ ', indent: 2 })
addSpine('line1\nline2\nline3')
// '│   line1\n│   line2\n│   line3'
```

## Text Formatting

2

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultIndentSize`

```typescript
2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L11" />

Default indentation size in characters.

## Traits

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`

```typescript
Eq<string>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/eq.ts#L20" />

Eq

trait implementation for strings.

Provides string equality comparison using strict equality (===).

String comparison is case-sensitive and considers all Unicode characters.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

Str.Eq.is('hello', 'hello') // true
Str.Eq.is('hello', 'Hello') // false (case-sensitive)
Str.Eq.is('', '') // true (empty strings)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`

```typescript
Type<string>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/type.ts#L19" />

Type

trait implementation for strings.

Provides type guard for checking if a value is a string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

Str.Type.is('hello') // true
Str.Type.is(123) // false
Str.Type.is(null) // false
```

## Transformation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `titlizeSlug`

```typescript
(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L17" />

**Parameters:**

- `str` - The slug string to convert

**Returns:** The title-cased string

Convert a URL slug to title case.

Replaces URL path separators with spaces and converts to title case.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.titlizeSlug('foo/bar/baz') // 'Foo Bar Baz'
Str.titlizeSlug('the/quick/brown/fox') // 'The Quick Brown Fox'
Str.titlizeSlug('hello-world') // 'Hello-World' (hyphens are preserved)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensureEnd`

```typescript
(string: string, ending: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L28" />

**Parameters:**

- `string` - The string to check
- `ending` - The ending to ensure

**Returns:** The string with the ending ensured

Ensure a string ends with a specific ending, adding it if not present.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `trim`

```typescript
(value: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L27" />

**Parameters:**

- `value` - The string to trim

**Returns:** The trimmed string

:::warning DEPRECATED
Use

String.trim

from Effect instead
:::

Remove whitespace from both ends of a string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.trim('  hello  ') // 'hello'
Str.trim('\n\thello\n\t') // 'hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeading`

```typescript
(replacement: string, matcher: string, value: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L52" />

**Parameters:**

- `replacement` - The string to replace the matcher with
- `matcher` - The string to match at the beginning
- `value` - The string to operate on

**Returns:** The string with leading matcher replaced

Replace the leading occurrence of a matcher string with a replacement.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.replaceLeading('$', '//', '// comment') // '$ comment'
Str.replaceLeading('', 'www.', 'www.example.com') // 'example.com'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingWith`

```typescript
(replacement: string): (matcher: string) => (value: string) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L63" />

**Parameters:**

- `replacement` - The string to replace the matcher with

**Returns:** Function that takes matcher, then value

Curried version of

replaceLeading

with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingOn`

```typescript
(value: string): (replacement: string) => (matcher: string) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L73" />

**Parameters:**

- `value` - The string to operate on

**Returns:** Function that takes replacement, then matcher

Curried version of

replaceLeading

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `stripLeading`

```typescript
;((matcher: string) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L89" />

Remove the leading occurrence of a matcher string.

Alias for

replaceLeadingWith('')

.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const removePrefix = Str.stripLeading('//')
removePrefix('// comment') // ' comment'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replace`

```typescript
(replacement: string, matcher: PatternsInput, value: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L114" />

**Parameters:**

- `replacement` - The string to replace matches with
- `matcher` - String or RegExp pattern(s) to match
- `value` - The string to operate on

**Returns:** The string with all matches replaced

:::warning DEPRECATED
Use

String.replace

or

String.replaceAll

from Effect instead
:::

Replace all occurrences of patterns with a replacement string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.replace('_', ' ', 'hello world') // 'hello_world'
Str.replace('X', /[aeiou]/g, 'hello') // 'hXllX'
Str.replace('-', [' ', '_'], 'hello world_test') // 'hello-world-test'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceWith`

```typescript
(replacement: string): (matcher: PatternsInput) => (value: string) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L127" />

**Parameters:**

- `replacement` - The string to replace matches with

**Returns:** Function that takes matcher, then value

Curried version of

replace

with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceOn`

```typescript
(value: string): (replacement: string) => (matcher: PatternsInput) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L137" />

**Parameters:**

- `value` - The string to operate on

**Returns:** Function that takes replacement, then matcher

Curried version of

replace

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `append`

```typescript
(value1: string, value2: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L162" />

**Parameters:**

- `value1` - The base string
- `value2` - The string to append

**Returns:** The concatenated string

:::warning DEPRECATED
Use

String.concat

from Effect instead
:::

Append a string to another string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.append('hello', ' world') // 'hello world'
Str.append('foo', 'bar') // 'foobar'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendOn`

```typescript
;((value1: string) => (value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L172" />

Curried version of

append

with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendWith`

```typescript
;((value2: string) => (value1: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L185" />

Curried version of

append

with value2 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const addWorld = Str.appendWith(' world')
addWorld('hello') // 'hello world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prepend`

```typescript
(value1: string, value2: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L202" />

**Parameters:**

- `value1` - The string to prepend
- `value2` - The base string

**Returns:** The concatenated string with value1 first

:::warning DEPRECATED
Use

String.concat

from Effect instead (with arguments swapped)
:::

Prepend a string to another string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.prepend('hello ', 'world') // 'hello world'
Str.prepend('pre', 'fix') // 'prefix'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependOn`

```typescript
;((value1: string) => (value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L212" />

Curried version of

prepend

with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependWith`

```typescript
;((value2: string) => (value1: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L225" />

Curried version of

prepend

with value2 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const toWorld = Str.prependWith('world')
toWorld('hello ') // 'hello world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `repeat`

```typescript
(value: string, count: number): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L249" />

**Parameters:**

- `value` - The string to repeat
- `count` - The number of times to repeat

**Returns:** The repeated string

:::warning DEPRECATED
Use

String.repeat

from Effect instead
:::

Repeat a string a specified number of times.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.repeat('a', 3) // 'aaa'
Str.repeat('hello', 2) // 'hellohello'
Str.repeat('-', 10) // '----------'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatOn`

```typescript
;((value: string) => (count: number) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L259" />

Curried version of

repeat

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatWith`

```typescript
;((count: number) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L272" />

Curried version of

repeat

with count first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const triple = Str.repeatWith(3)
triple('ha') // 'hahaha'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `removeSurrounding`

```typescript
(str: string, target: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L295" />

**Parameters:**

- `str` - The string to process
- `target` - The character to remove from both ends

**Returns:** The string with surrounding target characters removed

Remove all occurrences of a target character from the beginning and end of a string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.removeSurrounding('   hello   ', ' ') // 'hello'
Str.removeSurrounding('***test***', '*') // 'test'
Str.removeSurrounding('aaa', 'a') // ''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingOn`

```typescript
;((str: string) => (target: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L321" />

Curried version of

removeSurrounding

with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingWith`

```typescript
;((target: string) => (str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L329" />

Curried version of

removeSurrounding

with target first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `truncate`

```typescript
(str: string, maxLength?: number = 80): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L352" />

**Parameters:**

- `str` - The string to truncate
- `maxLength` - Maximum length of the result (default: 80)

**Returns:** The truncated string with ellipsis if needed

Truncate a string to a maximum length, adding ellipsis if truncated.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.truncate('hello world', 8) // 'hello...'
Str.truncate('short', 10) // 'short'
Str.truncate('very long text that needs truncating') // 'very long text that needs truncating...' (if > 80 chars)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateOn`

```typescript
;((str: string) => (maxLength?: number | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L366" />

Curried version of

truncate

with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateWith`

```typescript
;((maxLength?: number | undefined) => (str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L379" />

Curried version of

truncate

with maxLength first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const truncate10 = Str.truncateWith(10)
truncate10('hello world') // 'hello w...'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `strip`

```typescript
;((matcher: PatternsInput) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L401" />

Remove all occurrences of patterns from a string.

Alias for

replaceWith('')

.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const removeVowels = Str.strip(/[aeiou]/g)
removeVowels('hello world') // 'hll wrld'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceRegular`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L410" />

Remove regular spaces from the beginning and end of a string.

Pre-configured

removeSurroundingWith

for regular spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceNoBreak`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L419" />

Remove non-breaking spaces from the beginning and end of a string.

Pre-configured

removeSurroundingWith

for non-breaking spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `split`

```typescript
(value: string, separator: string): string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L18" />

**Parameters:**

- `value` - The string to split
- `separator` - The separator to split on

**Returns:** Array of substrings

:::warning DEPRECATED
Use

String.split

from Effect instead
:::

Split a string into an array of substrings using a separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.split('a,b,c', ',') // ['a', 'b', 'c']
Str.split('hello world', ' ') // ['hello', 'world']
Str.split('', ',') // []
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitOn`

```typescript
(value: string) => (separator: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L29" />

Curried version of

split

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitWith`

```typescript
(separator: string) => (value: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L42" />

Curried version of

split

with separator first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const splitByComma = Str.splitWith(',')
splitByComma('a,b,c') // ['a', 'b', 'c']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `join`

```typescript
(value: string[], separator: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L58" />

**Parameters:**

- `value` - Array of strings to join
- `separator` - The separator to place between strings

**Returns:** The joined string

:::warning DEPRECATED
Use

Array.join

from Effect instead
:::

Join an array of strings into a single string with a separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.join(['a', 'b', 'c'], ',') // 'a,b,c'
Str.join(['hello', 'world'], ' ') // 'hello world'
Str.join([], ',') // ''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinOn`

```typescript
;((value: string[]) => (separator: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L68" />

Curried version of

join

with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinWith`

```typescript
;((separator: string) => (value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L81" />

Curried version of

join

with separator first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const joinWithComma = Str.joinWith(',')
joinWithComma(['a', 'b', 'c']) // 'a,b,c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `merge`

```typescript
(string1: string, string2: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L96" />

**Parameters:**

- `string1` - The first string
- `string2` - The second string

**Returns:** The concatenated string

:::warning DEPRECATED
Use

String.concat

from Effect instead
:::

Merge two strings together (concatenate).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.merge('hello', ' world') // 'hello world'
Str.merge('foo', 'bar') // 'foobar'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeOn`

```typescript
;((string1: string) => (string2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L111" />

Curried version of

merge

with string1 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const mergeWithHello = Str.mergeOn('hello')
mergeWithHello(' world') // 'hello world'
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty`

```typescript
(value: string): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L14" />

**Parameters:**

- `value` - The string to check

**Returns:** True if the string is empty

:::warning DEPRECATED
Use

String.isEmpty

from Effect instead
:::

Type guard to check if a string is empty.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
Str.isEmpty('') // true
Str.isEmpty('hello') // false
Str.isEmpty(' ') // false
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Empty`

```typescript
type Empty = ''
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L20" />

Type for an empty string.

## Type-Level Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `EndsWith`

```typescript
type EndsWith<S extends string, T extends string> = S extends `${string}${T}`
  ? true
  : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L13" />

Check if a string ends with a specific suffix.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StartsWith`

```typescript
type StartsWith<S extends string, T extends string> = S extends `${T}${string}`
  ? true
  : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L19" />

Check if a string starts with a specific prefix.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LastSegment`

```typescript
type LastSegment<S extends string> = S extends `${string}/${infer Rest}`
  ? LastSegment<Rest>
  : S
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L25" />

Extract the last segment from a path-like string (after the last '/').

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RemoveTrailingSlash`

```typescript
type RemoveTrailingSlash<S extends string> = S extends `${infer Rest}/`
  ? Rest extends '' ? '/' : Rest
  : S
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L32" />

Remove trailing slash from a string.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Split`

```typescript
type Split<S extends string, D extends string, Acc extends string[] = []> =
  S extends '' ? Acc
    : S extends `${infer Segment}${D}${infer Rest}`
      ? Segment extends '' ? Split<Rest, D, Acc>
      : Segment extends '.' ? Split<Rest, D, Acc>
      : Split<Rest, D, [...Acc, Segment]>
    : S extends '.' ? Acc
    : [...Acc, S]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L40" />

Split a string by a delimiter, filtering out empty segments and '.' segments.

This is useful for path-like strings.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Contains`

```typescript
type Contains<S extends string, C extends string> = S extends
  `${string}${C}${string}` ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L51" />

Check if string contains a character.

## Type-Level Utilities

T - The string type to check

$ErrorMessage - Custom error message to display when T is not a literal

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LiteralOnly`

```typescript
type LiteralOnly<
  T extends string,
  $ErrorMessage extends string = 'Expected a literal string',
> = string extends T ? Ts.StaticError<
    $ErrorMessage,
    { ReceivedType: T },
    'Use a string literal instead of string type'
  >
  : T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L60" />

Constraint that only accepts literal strings.

Returns StaticError for non-literal string type with customizable error message.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Arb`

```typescript
Arb<string>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/arb.ts#L31" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `RegExpMatchResult`

```typescript
type RegExpMatchResult<$Matches extends Matches> =
  & Omit<RegExpMatchArray, 'groups'>
  & {
    groups: $Matches['groups'] extends
      readonly [MatchItem, ...readonly MatchItem[]]
      ? ArrMut.ReduceWithIntersection<ToGroupsProperties<$Matches['groups']>>
      : undefined
  }
  & (
    $Matches extends { indicies: readonly [MatchItem, ...readonly MatchItem[]] }
      ? [originalValue: string, ...$Matches['indicies']]
      : [originalValue: string]
  )
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L17" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Matches`

```typescript
type Matches = {
  groups?: (string | undefined)[]
  indicies?: (string | undefined)[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L58" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `PatternInput`

```typescript
type PatternInput = string | RegExp
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L90" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PatternsInput`

```typescript
type PatternsInput = ArrMut.Maybe<string | RegExp>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L174" />
