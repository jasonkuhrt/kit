# Str

String utilities for text manipulation and analysis.

Provides comprehensive string operations including case conversion, splitting, matching, replacement, templating, and character utilities. Features type-safe APIs with strong inference for string literals and patterns.

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

| Namespace                   | Description                                  |
| --------------------------- | -------------------------------------------- |
| [**`Char`**](/api/str/char) | Uppercase letter.                            |
| [**`Code`**](/api/str/code) | Code generation and documentation utilities. |

Provides tools for generating markdown, TSDoc/JSDoc, and TypeScript code. Includes safe JSDoc generation with escaping, builder API, and structured tag helpers. |
| [**`Text`**](/api/str/text) | Multi-line text formatting and layout utilities.

Provides functions specifically for working with multi-line strings treated as text content: - **Line operations**: Split into lines, join lines, map transformations per line - **Indentation**: Add/remove indentation, strip common leading whitespace - **Alignment**: Pad text, span to width, fit to exact width - **Block formatting**: Format blocks with prefixes, styled borders

**Use Text for**: Operations that treat strings as multi-line content with visual layout (indentation, padding for tables, line-by-line transformations).

**Use root Str for**: Primitive string operations (split, join, replace, match, trim) that work on strings as atomic values. |
| [**`Visual`**](/api/str/visual) | Visual-aware string utilities that handle ANSI escape codes and grapheme clusters.

These functions measure and manipulate strings based on their visual appearance, not raw character count. Useful for terminal output, tables, and formatted text. |

## Builder

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultRender`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L12" /> {#c-default-render-12}

```typescript
;((value: string[]) => string)
```

Default render function for string builders. Joins lines with newline characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L19" /> {#i-builder-19}

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

String builder interface for constructing multi-line strings. Supports both function call syntax and template literal syntax.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `Builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L92" /> {#f-builder-92}

```typescript
(options?: { join?: string; } | undefined): Builder
```

**Returns:** A new builder instance

Create a new string builder for constructing multi-line strings.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:Builder:1]
const b = Str.Builder()
b('Line 1')
b('Line 2', 'Line 3')
b`Template line`
// [!code word:log:1]
// [!code word:render:1]
console.log(b.render()) // "Line 1\nLine 2\nLine 3\nTemplate line"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LinesInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L53" /> {#t-lines-input-53}

```typescript
type LinesInput = (Line | null)[]
```

Input type for lines

- allows null values which are filtered out.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Lines`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L59" /> {#t-lines-59}

```typescript
type Lines = Line[]
```

Array of line strings.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Line`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L65" /> {#t-line-65}

```typescript
type Line = string
```

A single line of text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `State`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L71" /> {#i-state-71}

```typescript
interface State {
  /**
   * Accumulated lines.
   */
  lines: Lines
}
```

Internal state of the string builder.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L30" /> {#c-empty-30}

```typescript
''
```

Empty string constant.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const result = someCondition ? 'hello' : Empty
```

## Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `table`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/table.ts#L32" /> {#f-table-32}

```typescript
(input: { data: Record<string, string>; separator?: string | false | undefined; separatorAlignment?: boolean; }): string
```

**Parameters:**

- `input` - Configuration object

**Returns:** Formatted table string with aligned columns

Format a key-value object as an aligned table string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:table:1]
Str.table({
  data: { name: 'John', age: '25', city: 'NYC' },
})
// Returns:
// name → John
// age  → 25
// city → NYC

// [!code word:table:1]
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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pattern`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L53" /> {#f-pattern-53}

```typescript
<matches extends Matches>(pattern: RegExp): Pattern<matches>
```

**Parameters:**

- `pattern` - The regular expression pattern

**Returns:** A typed pattern that preserves capture group information

Create a typed pattern from a regular expression. Enables type-safe capture groups when used with match.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const p = pattern<{ groups: ['name', 'age'] }>(/(?<name>\w+) is (?<age>\d+)/)
const result = match('John is 25', p)
// [!code word:isSome:1]
if (Option.isSome(result)) {
  // [!code word:log:1]
  // [!code word:name:1]
  console.log(result.value.groups.name) // 'John' (typed)
  // [!code word:log:1]
  // [!code word:age:1]
  console.log(result.value.groups.age) // '25' (typed)
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `match`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L80" /> {#f-match-80}

```typescript
<matches extends Matches>(string: string, pattern: RegExp | Pattern<matches>): Option<RegExpMatchResult<matches>>
```

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
// [!code word:match:1]
const result = Str.match('hello world', /hello (\w+)/)
// [!code word:isSome:1]
if (Option.isSome(result)) {
  // [!code word:log:1]
  // [!code word:value:1]
  console.log(result.value[0]) // 'hello world'
  // [!code word:log:1]
  // [!code word:value:1]
  console.log(result.value[1]) // 'world'
}
```

## Predicates

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatch`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L105" /> {#f-is-match-105}

```typescript
(value: string, pattern: PatternInput): boolean
```

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
// [!code word:isMatch:1]
Str.isMatch('hello', 'hello') // true
// [!code word:isMatch:1]
Str.isMatch('hello', /^h.*o$/) // true
// [!code word:isMatch:1]
Str.isMatch('world', 'hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L124" /> {#c-is-match-on-124}

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

Curried version of isMatch with value first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isMatchOn:1]
const isHello = Str.isMatchOn('hello')
isHello('hello') // true
isHello(/^h.*o$/) // true
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L138" /> {#c-is-match-with-138}

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

Curried version of isMatch with pattern first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isMatchWith:1]
const matchesHello = Str.isMatchWith('hello')
matchesHello('hello') // true
matchesHello('world') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isntMatch`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L152" /> {#f-isnt-match-152}

```typescript
(pattern: PatternInput): (value: string) => boolean
```

**Parameters:**

- `pattern` - String for exact match or RegExp for pattern match

**Returns:** Function that takes a value and returns true if it doesn't match

Check if a string does not match a pattern.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isntMatch:1]
const notHello = Str.isntMatch('hello')
notHello('world') // true
notHello('hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L162" /> {#c-isnt-match-on-162}

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

Curried version of isntMatch with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L170" /> {#c-isnt-match-with-170}

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

Curried version of isntMatch with pattern first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatchAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L189" /> {#f-is-match-any-189}

```typescript
(value: string, patterns: PatternsInput): boolean
```

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
// [!code word:isMatchAny:1]
Str.isMatchAny('hello', ['hello', 'world']) // true
// [!code word:isMatchAny:1]
Str.isMatchAny('hello', [/^h/, /o$/]) // true
// [!code word:isMatchAny:1]
Str.isMatchAny('foo', ['hello', 'world']) // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L200" /> {#c-is-match-any-on-200}

```typescript
;((value: string) => (patterns: PatternsInput) => boolean)
```

Curried version of isMatchAny with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L215" /> {#c-is-match-any-with-215}

```typescript
;((patterns: PatternsInput) => (value: string) => boolean)
```

Curried version of isMatchAny with patterns first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isMatchAnyWith:1]
const matchesGreeting = Str.isMatchAnyWith(['hello', 'hi', /^hey/])
matchesGreeting('hello') // true
matchesGreeting('hey there') // true
matchesGreeting('goodbye') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNotMatchAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L229" /> {#f-is-not-match-any-229}

```typescript
(patternOrPatterns: PatternsInput): (value: string) => boolean
```

**Parameters:**

- `patternOrPatterns` - Array of strings or RegExp patterns (or a single pattern)

**Returns:** Function that takes a value and returns true if it doesn't match any pattern

Check if a string does not match any of the provided patterns.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isNotMatchAny:1]
const notGreeting = Str.isNotMatchAny(['hello', 'hi'])
notGreeting('goodbye') // true
notGreeting('hello') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L239" /> {#c-is-not-match-any-on-239}

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

Curried version of isNotMatchAny with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L247" /> {#c-is-not-match-any-with-247}

```typescript
;((value: string) => (patternOrPatterns: PatternsInput) => boolean)
```

Curried version of isNotMatchAny with patterns first.

## Runtime Utilities $S - The string to measure

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `length`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/length.ts#L253" /> {#f-length-253}

```typescript
<$S extends string>(s: $S): Length<$S, boolean>
```

Get the length of a string.

Runtime function with type-level literal inference. For literal strings, the return type is the exact length. For non-literal strings, returns `number`.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:length:1]
const len1 = Str.length('hello') // Type: 5, Runtime: 5
// [!code word:length:1]
const len2 = Str.length('') // Type: 0, Runtime: 0

declare const s: string
// [!code word:length:1]
const len3 = Str.length(s) // Type: number, Runtime: s.length
```

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `interpolate`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L18" /> {#f-interpolate-18}

```typescript
(template: string): (args: TemplateArgs) => string
```

**Parameters:**

- `template` - Template string containing $variable placeholders

**Returns:** Function that takes args object and returns interpolated string

Interpolate variables into a template string using $variable syntax.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:interpolate:1]
const greeting = Str.interpolate('Hello ${name}, you are ${age} years old')
greeting({ name: 'John', age: 25 }) // 'Hello John, you are 25 years old'

// [!code word:interpolate:1]
const template = Str.interpolate('${greeting} ${name}!')
template({ greeting: 'Hi', name: 'Alice' }) // 'Hi Alice!'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `templateVariablePattern`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L30" /> {#c-template-variable-pattern-30}

```typescript
RegExp
```

Regular expression pattern to match template variables in $variable format. Captures the variable name inside the braces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TemplateArgs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L37" /> {#t-template-args-37}

```typescript
type TemplateArgs = Record<string, Json.Value>
```

Arguments object for template interpolation. Maps variable names to their JSON-serializable values.

## Text Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Box`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L1248" /> {#class-box-1248}

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

**Properties:**

- `String` - Schema for encoding Box to string representation.

This is a one-way transformation - boxes can be encoded to strings, but cannot be decoded from strings.

Box structure with content and optional styling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `OrientationSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L137" /> {#c-orientation-schema-137}

```typescript
Literal<['vertical', 'horizontal']>
```

Orientation determines the flow direction of the box.

- `vertical`: Content flows top-to-bottom (main axis = vertical)
- `horizontal`: Content flows left-to-right (main axis = horizontal)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Orientation`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L144" /> {#t-orientation-144}

```typescript
type Orientation = typeof OrientationSchema.Type
```

Orientation type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PaddingSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L155" /> {#c-padding-schema-155}

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

Padding configuration using logical properties.

Logical properties adapt to orientation:

- `mainStart`/`mainEnd`: Along the flow direction
- `crossStart`/`crossEnd`: Perpendicular to flow

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Padding`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L190" /> {#t-padding-190}

```typescript
type Padding = typeof PaddingSchema.Type
```

Padding configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `PaddingInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L205" /> {#u-padding-input-205}

```typescript
type PaddingInput = AxisHand.Input | WithHooks<Padding, 'padding'>
```

Padding input accepting AxisHand notation and hook functions.

Supports AxisHand patterns:

- Single value: `2` → all sides
- Axis shorthands: `[2, 4]` → [main, cross]
- Binary axis: `[[1, 2], [3, 4]]` → [[mainStart, mainEnd], [crossStart, crossEnd]]
- Per-axis arrays: `[[1, 2], 4]` → asymmetric main, symmetric cross
- Object: `{ main: [1, 2], cross: 4 }`
- With hooks: `{ main: { start: (ctx) => 2 } }`

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MarginSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L214" /> {#c-margin-schema-214}

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

Margin configuration using logical properties.

Logical properties adapt to orientation (same as Padding).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Margin`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L249" /> {#t-margin-249}

```typescript
type Margin = typeof MarginSchema.Type
```

Margin configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `MarginInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L258" /> {#u-margin-input-258}

```typescript
type MarginInput = AxisHand.Input | WithHooks<Margin, 'margin'>
```

Margin input accepting AxisHand notation and hook functions.

Supports AxisHand patterns (same as PaddingInput).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `SpanValue`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L268" /> {#u-span-value-268}

```typescript
type SpanValue = number | bigint
```

Span value type

- size in characters or percentage of parent.

- `number` (1): Absolute size in characters
- `bigint`: Percentage of parent span (e.g., `50n` = 50%)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SpanSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L281" /> {#c-span-schema-281}

```typescript
Struct<
  {
    main: optional<Union<[typeof Number, typeof BigIntFromSelf]>>
    cross: optional<Union<[typeof Number, typeof BigIntFromSelf]>>
  }
>
```

Span configuration using logical properties.

Defines exact/desired size along each axis:

- `main`: Size along flow direction (mainSpan)
- `cross`: Size perpendicular to flow (crossSpan)

Percentage values (bigint) are resolved relative to parent's available span.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Span`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L306" /> {#t-span-306}

```typescript
type Span = typeof SpanSchema.Type
```

Span configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SpanInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L320" /> {#t-span-input-320}

```typescript
type SpanInput = AxisHand.Input<SpanValue>
```

Span input accepting AxisHand notation.

Supports AxisHand patterns with SpanValue (number | bigint):

- Single value: `80` → main and cross both 80 chars
- Single percentage: `50n` → main and cross both 50% of parent
- Axis shorthands: `[50n, 80]` → main 50%, cross 80 chars
- Binary axis: `[[40, 50n], [80, 100]]` → different start/end (unusual for span)
- Object: `{ main: 50n, cross: 80 }`

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SpanRangeSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L327" /> {#c-span-range-schema-327}

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

Span range constraints (min/max) using logical properties.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SpanRange`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L350" /> {#t-span-range-350}

```typescript
type SpanRange = typeof SpanRangeSchema.Type
```

Span range configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `GapSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L361" /> {#c-gap-schema-361}

```typescript
Struct<{ main: optional<typeof Number>; cross: optional<typeof Number> }>
```

Gap configuration using logical properties.

Defines space between array items (container property):

- Vertical orientation: main=newlines between items, cross=spaces between items
- Horizontal orientation: main=spaces between items, cross=newlines between items

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Gap`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L382" /> {#t-gap-382}

```typescript
type Gap = typeof GapSchema.Type
```

Gap configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `GapInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L392" /> {#u-gap-input-392}

```typescript
type GapInput = number | Gap
```

Gap input accepting number or object with logical properties.

- `number`: Same gap on both axes
- `{ main?: number, cross?: number }`: Per-axis gaps

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderStyleSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L399" /> {#c-border-style-schema-399}

```typescript
Literal<['single', 'double', 'rounded', 'bold', 'ascii']>
```

Border style presets.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderStyle`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L406" /> {#t-border-style-406}

```typescript
type BorderStyle = typeof BorderStyleSchema.Type
```

Border style preset type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderEdgesSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L413" /> {#c-border-edges-schema-413}

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

Border edge characters (physical coordinates).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderEdges`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L440" /> {#t-border-edges-440}

```typescript
type BorderEdges = typeof BorderEdgesSchema.Type
```

Border edge configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderCornersSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L447" /> {#c-border-corners-schema-447}

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

Border corner characters (physical coordinates).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderCorners`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L474" /> {#t-border-corners-474}

```typescript
type BorderCorners = typeof BorderCornersSchema.Type
```

Border corner configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BorderEdgesInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L489" /> {#u-border-edges-input-489}

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

Border edge input supporting Clockhand notation, CharStyle, and hook functions.

Supports Clockhand patterns:

- Single value: `'─'` → all edges
- Single styled: `{ char: '─', color: { foreground: 'blue' } }` → all edges
- Array: `['─', '│', '─', '│']` → [top, right, bottom, left]
- Object: `{ top: '─', left: '│' }`
- Object with CharStyle: `{ top: { char: '─', color: { foreground: 'red' } } }`
- With hooks: `{ top: (ctx) => '─' }`

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BorderCornersInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L512" /> {#u-border-corners-input-512}

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

Border corner input supporting Clockhand notation, CharStyle, and hook functions.

Supports Clockhand patterns:

- Single value: `'+'` → all corners
- Single styled: `{ char: '+', color: { foreground: 'yellow' }, bold: true }` → all corners
- Array: `['┌', '┐', '┘', '└']` → [topLeft, topRight, bottomRight, bottomLeft] (clockwise)
- Object: `{ topLeft: '┌', topRight: '┐' }`
- Object with CharStyle: `{ topLeft: { char: '┌', color: { foreground: 'red' }, bold: true } }`
- With hooks: `{ topLeft: (ctx) => '┌' }`

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderCharsInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L527" /> {#t-border-chars-input-527}

```typescript
type BorderCharsInput = {
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}
```

Border character configuration input with nested edges/corners.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BorderSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L540" /> {#c-border-schema-540}

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

Border configuration.

Can specify a preset style, custom edges, custom corners, or a combination. Resolution order: style → edges override → corners override.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Border`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L564" /> {#t-border-564}

```typescript
type Border = typeof BorderSchema.Type
```

Border configuration type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BorderInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L578" /> {#t-border-input-578}

```typescript
type BorderInput = {
  style?: BorderStyle
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}
```

Border configuration input with hook support.

Supports:

- `style`: Preset border style (provides edges and corners)
- `edges`: Edge characters (with Clockhand support)
- `corners`: Corner characters (with Clockhand support)

Resolution order: style → edges/corners override

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `BoxContent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/box/box.ts#L1241" /> {#u-box-content-1241}

```typescript
type BoxContent = string | StyledText | readonly (string | StyledText | Box)[]
```

Content type for Box

- can be a string, styled text, or array of these and boxes.

Supports:

- Plain strings: `'Hello'`
- Styled text: `{ text: 'Hello', color: { foreground: 'red' }, bold: true }`
- Arrays: `['Header', { text: 'Body', color: { foreground: 'green' } }, Box.make(...)]`

## Traits

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/eq.ts#L20" /> {#c-eq-20}

```typescript
Eq<string>
```

Eq trait implementation for strings.

Provides string equality comparison using strict equality (===). String comparison is case-sensitive and considers all Unicode characters.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

// [!code word:is:1]
Str.Eq.is('hello', 'hello') // true
// [!code word:is:1]
Str.Eq.is('hello', 'Hello') // false (case-sensitive)
// [!code word:is:1]
Str.Eq.is('', '') // true (empty strings)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/type.ts#L19" /> {#c-type-19}

```typescript
Type<string>
```

Type trait implementation for strings.

Provides type guard for checking if a value is a string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

// [!code word:is:1]
Str.Type.is('hello') // true
// [!code word:is:1]
Str.Type.is(123) // false
// [!code word:is:1]
Str.Type.is(null) // false
```

## Transformation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `titlizeSlug`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L17" /> {#f-titlize-slug-17}

```typescript
(str: string): string
```

**Parameters:**

- `str` - The slug string to convert

**Returns:** The title-cased string

Convert a URL slug to title case. Replaces URL path separators with spaces and converts to title case.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:titlizeSlug:1]
Str.titlizeSlug('foo/bar/baz') // 'Foo Bar Baz'
// [!code word:titlizeSlug:1]
Str.titlizeSlug('the/quick/brown/fox') // 'The Quick Brown Fox'
// [!code word:titlizeSlug:1]
Str.titlizeSlug('hello-world') // 'Hello-World' (hyphens are preserved)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensureEnd`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L28" /> {#f-ensure-end-28}

```typescript
(string: string, ending: string): string
```

**Parameters:**

- `string` - The string to check
- `ending` - The ending to ensure

**Returns:** The string with the ending ensured

Ensure a string ends with a specific ending, adding it if not present.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `trim`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L27" /> {#f-trim-27}

```typescript
(value: string): string
```

**Parameters:**

- `value` - The string to trim

**Returns:** The trimmed string

:::warning DEPRECATED
Use String.trim from Effect instead
:::

Remove whitespace from both ends of a string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:trim:1]
Str.trim('  hello  ') // 'hello'
// [!code word:trim:1]
Str.trim('\n\thello\n\t') // 'hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeading`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L52" /> {#f-replace-leading-52}

```typescript
(replacement: string, matcher: string, value: string): string
```

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
// [!code word:replaceLeading:1]
Str.replaceLeading('$', '//', '// comment') // '$ comment'
// [!code word:replaceLeading:1]
Str.replaceLeading('', 'www.', 'www.example.com') // 'example.com'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L63" /> {#f-replace-leading-with-63}

```typescript
(replacement: string): (matcher: string) => (value: string) => string
```

**Parameters:**

- `replacement` - The string to replace the matcher with

**Returns:** Function that takes matcher, then value

Curried version of replaceLeading with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L73" /> {#f-replace-leading-on-73}

```typescript
(value: string): (replacement: string) => (matcher: string) => string
```

**Parameters:**

- `value` - The string to operate on

**Returns:** Function that takes replacement, then matcher

Curried version of replaceLeading with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `stripLeading`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L89" /> {#c-strip-leading-89}

```typescript
;((matcher: string) => (value: string) => string)
```

Remove the leading occurrence of a matcher string. Alias for `replaceLeadingWith('')`.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:stripLeading:1]
const removePrefix = Str.stripLeading('//')
removePrefix('// comment') // ' comment'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replace`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L114" /> {#f-replace-114}

```typescript
(replacement: string, matcher: PatternsInput, value: string): string
```

**Parameters:**

- `replacement` - The string to replace matches with
- `matcher` - String or RegExp pattern(s) to match
- `value` - The string to operate on

**Returns:** The string with all matches replaced

:::warning DEPRECATED
Use String.replace or String.replaceAll from Effect instead
:::

Replace all occurrences of patterns with a replacement string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:replace:1]
Str.replace('_', ' ', 'hello world') // 'hello_world'
// [!code word:replace:1]
Str.replace('X', /[aeiou]/g, 'hello') // 'hXllX'
// [!code word:replace:1]
Str.replace('-', [' ', '_'], 'hello world_test') // 'hello-world-test'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L127" /> {#f-replace-with-127}

```typescript
(replacement: string): (matcher: PatternsInput) => (value: string) => string
```

**Parameters:**

- `replacement` - The string to replace matches with

**Returns:** Function that takes matcher, then value

Curried version of replace with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L137" /> {#f-replace-on-137}

```typescript
(value: string): (replacement: string) => (matcher: PatternsInput) => string
```

**Parameters:**

- `value` - The string to operate on

**Returns:** Function that takes replacement, then matcher

Curried version of replace with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `append`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L162" /> {#f-append-162}

```typescript
(value1: string, value2: string): string
```

**Parameters:**

- `value1` - The base string
- `value2` - The string to append

**Returns:** The concatenated string

:::warning DEPRECATED
Use String.concat from Effect instead
:::

Append a string to another string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:append:1]
Str.append('hello', ' world') // 'hello world'
// [!code word:append:1]
Str.append('foo', 'bar') // 'foobar'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L172" /> {#c-append-on-172}

```typescript
;((value1: string) => (value2: string) => string)
```

Curried version of append with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L185" /> {#c-append-with-185}

```typescript
;((value2: string) => (value1: string) => string)
```

Curried version of append with value2 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:appendWith:1]
const addWorld = Str.appendWith(' world')
addWorld('hello') // 'hello world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prepend`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L202" /> {#f-prepend-202}

```typescript
(value1: string, value2: string): string
```

**Parameters:**

- `value1` - The string to prepend
- `value2` - The base string

**Returns:** The concatenated string with value1 first

:::warning DEPRECATED
Use String.concat from Effect instead (with arguments swapped)
:::

Prepend a string to another string.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:prepend:1]
Str.prepend('hello ', 'world') // 'hello world'
// [!code word:prepend:1]
Str.prepend('pre', 'fix') // 'prefix'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L212" /> {#c-prepend-on-212}

```typescript
;((value1: string) => (value2: string) => string)
```

Curried version of prepend with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L225" /> {#c-prepend-with-225}

```typescript
;((value2: string) => (value1: string) => string)
```

Curried version of prepend with value2 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:prependWith:1]
const toWorld = Str.prependWith('world')
toWorld('hello ') // 'hello world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `repeat`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L249" /> {#f-repeat-249}

```typescript
(value: string, count: number): string
```

**Parameters:**

- `value` - The string to repeat
- `count` - The number of times to repeat

**Returns:** The repeated string

:::warning DEPRECATED
Use String.repeat from Effect instead
:::

Repeat a string a specified number of times.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:repeat:1]
Str.repeat('a', 3) // 'aaa'
// [!code word:repeat:1]
Str.repeat('hello', 2) // 'hellohello'
// [!code word:repeat:1]
Str.repeat('-', 10) // '----------'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L259" /> {#c-repeat-on-259}

```typescript
;((value: string) => (count: number) => string)
```

Curried version of repeat with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L272" /> {#c-repeat-with-272}

```typescript
;((count: number) => (value: string) => string)
```

Curried version of repeat with count first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:repeatWith:1]
const triple = Str.repeatWith(3)
triple('ha') // 'hahaha'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `removeSurrounding`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L295" /> {#f-remove-surrounding-295}

```typescript
(str: string, target: string): string
```

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
// [!code word:removeSurrounding:1]
Str.removeSurrounding('   hello   ', ' ') // 'hello'
// [!code word:removeSurrounding:1]
Str.removeSurrounding('***test***', '*') // 'test'
// [!code word:removeSurrounding:1]
Str.removeSurrounding('aaa', 'a') // ''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L321" /> {#c-remove-surrounding-on-321}

```typescript
;((str: string) => (target: string) => string)
```

Curried version of removeSurrounding with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L329" /> {#c-remove-surrounding-with-329}

```typescript
;((target: string) => (str: string) => string)
```

Curried version of removeSurrounding with target first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `truncate`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L352" /> {#f-truncate-352}

```typescript
(str: string, maxLength?: number = 80): string
```

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
// [!code word:truncate:1]
Str.truncate('hello world', 8) // 'hello...'
// [!code word:truncate:1]
Str.truncate('short', 10) // 'short'
// [!code word:truncate:1]
Str.truncate('very long text that needs truncating') // 'very long text that needs truncating...' (if > 80 chars)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L366" /> {#c-truncate-on-366}

```typescript
;((str: string) => (maxLength?: number | undefined) => string)
```

Curried version of truncate with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L379" /> {#c-truncate-with-379}

```typescript
;((maxLength?: number | undefined) => (str: string) => string)
```

Curried version of truncate with maxLength first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:truncateWith:1]
const truncate10 = Str.truncateWith(10)
truncate10('hello world') // 'hello w...'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `strip`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L401" /> {#c-strip-401}

```typescript
;((matcher: PatternsInput) => (value: string) => string)
```

Remove all occurrences of patterns from a string. Alias for `replaceWith('')`.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:strip:1]
const removeVowels = Str.strip(/[aeiou]/g)
removeVowels('hello world') // 'hll wrld'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceRegular`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L410" /> {#c-remove-surrounding-space-regular-410}

```typescript
;((str: string) => string)
```

Remove regular spaces from the beginning and end of a string. Pre-configured removeSurroundingWith for regular spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceNoBreak`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L419" /> {#c-remove-surrounding-space-no-break-419}

```typescript
;((str: string) => string)
```

Remove non-breaking spaces from the beginning and end of a string. Pre-configured removeSurroundingWith for non-breaking spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `split`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L18" /> {#f-split-18}

```typescript
(value: string, separator: string): string[]
```

**Parameters:**

- `value` - The string to split
- `separator` - The separator to split on

**Returns:** Array of substrings

:::warning DEPRECATED
Use String.split from Effect instead
:::

Split a string into an array of substrings using a separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:split:1]
Str.split('a,b,c', ',') // ['a', 'b', 'c']
// [!code word:split:1]
Str.split('hello world', ' ') // ['hello', 'world']
// [!code word:split:1]
Str.split('', ',') // []
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L29" /> {#c-split-on-29}

```typescript
(value: string) => (separator: string) => string[]
```

Curried version of split with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L42" /> {#c-split-with-42}

```typescript
(separator: string) => (value: string) => string[]
```

Curried version of split with separator first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:splitWith:1]
const splitByComma = Str.splitWith(',')
splitByComma('a,b,c') // ['a', 'b', 'c']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `join`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L58" /> {#f-join-58}

```typescript
(value: string[], separator: string): string
```

**Parameters:**

- `value` - Array of strings to join
- `separator` - The separator to place between strings

**Returns:** The joined string

:::warning DEPRECATED
Use Array.join from Effect instead
:::

Join an array of strings into a single string with a separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:join:1]
Str.join(['a', 'b', 'c'], ',') // 'a,b,c'
// [!code word:join:1]
Str.join(['hello', 'world'], ' ') // 'hello world'
// [!code word:join:1]
Str.join([], ',') // ''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L68" /> {#c-join-on-68}

```typescript
;((value: string[]) => (separator: string) => string)
```

Curried version of join with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L81" /> {#c-join-with-81}

```typescript
;((separator: string) => (value: string[]) => string)
```

Curried version of join with separator first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:joinWith:1]
const joinWithComma = Str.joinWith(',')
joinWithComma(['a', 'b', 'c']) // 'a,b,c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `merge`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L96" /> {#f-merge-96}

```typescript
(string1: string, string2: string): string
```

**Parameters:**

- `string1` - The first string
- `string2` - The second string

**Returns:** The concatenated string

:::warning DEPRECATED
Use String.concat from Effect instead
:::

Merge two strings together (concatenate).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:merge:1]
Str.merge('hello', ' world') // 'hello world'
// [!code word:merge:1]
Str.merge('foo', 'bar') // 'foobar'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L111" /> {#c-merge-on-111}

```typescript
;((string1: string) => (string2: string) => string)
```

Curried version of merge with string1 first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:mergeOn:1]
const mergeWithHello = Str.mergeOn('hello')
mergeWithHello(' world') // 'hello world'
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L14" /> {#f-is-empty-14}

```typescript
(value: string): boolean
```

**Parameters:**

- `value` - The string to check

**Returns:** True if the string is empty

:::warning DEPRECATED
Use String.isEmpty from Effect instead
:::

Type guard to check if a string is empty.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:isEmpty:1]
Str.isEmpty('') // true
// [!code word:isEmpty:1]
Str.isEmpty('hello') // false
// [!code word:isEmpty:1]
Str.isEmpty(' ') // false
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L20" /> {#t-empty-20}

```typescript
type Empty = ''
```

Type for an empty string.

## Type-Level Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetKindCase`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L34" /> {#t-get-kind-case-34}

```typescript
type GetKindCase<$S extends string> = string extends $S ? 'string' : 'literal'
```

Determine if a string type is a literal or the generic `string` type.

Returns `'literal'` for concrete string literals, `'string'` for the `string` type. Template literals with string interpolations will be detected by the consuming utilities during their normal computation and will return `number`.

Useful for discriminated type branching with indexed access patterns.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Discriminated branching pattern
type Result<$S extends string> = {
  string: number
  literal: ComputeExactValue<$S>
}[Str.GetKindCase<$S>]

type R1 = Result<'hello'> // ComputeExactValue<'hello'>
type R2 = Result<string> // number
type R3 = Result<`prefix-${string}`> // number (detected during computation)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `EndsWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L40" /> {#t-ends-with-40}

```typescript
type EndsWith<S extends string, T extends string> = S extends `${string}${T}`
  ? true
  : false
```

Check if a string ends with a specific suffix.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StartsWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L46" /> {#t-starts-with-46}

```typescript
type StartsWith<S extends string, T extends string> = S extends `${T}${string}`
  ? true
  : false
```

Check if a string starts with a specific prefix.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LastSegment`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L52" /> {#t-last-segment-52}

```typescript
type LastSegment<S extends string> = S extends `${string}/${infer Rest}`
  ? LastSegment<Rest>
  : S
```

Extract the last segment from a path-like string (after the last '/').

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RemoveTrailingSlash`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L59" /> {#t-remove-trailing-slash-59}

```typescript
type RemoveTrailingSlash<S extends string> = S extends `${infer Rest}/`
  ? Rest extends '' ? '/' : Rest
  : S
```

Remove trailing slash from a string.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Split`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L67" /> {#t-split-67}

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

Split a string by a delimiter, filtering out empty segments and '.' segments. This is useful for path-like strings.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Contains`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L78" /> {#t-contains-78}

```typescript
type Contains<S extends string, C extends string> = S extends
  `${string}${C}${string}` ? true : false
```

Check if string contains a character.

## Type-Level Utilities $S - The string to measure $AllowSlow - Local override for allowSlow setting (defaults to global setting)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Length`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/length.ts#L206" /> {#t-length-206}

```typescript
type Length<
  $S extends string,
  $AllowSlow extends boolean = KitLibrarySettings.Perf.Settings['allowSlow'],
> = {
  string: number
  literal: LengthFast<$S> extends never
    ? NormalizeAllowSlow<$AllowSlow> extends true ? LengthSlow<$S>
    : Ts.Err.StaticError<
      'String length exceeds fast path limit (20 chars)',
      {
        hint:
          'Pass true as second parameter or set KitLibrarySettings.Perf.Settings.allowSlow to true'
        limit: '0-20 chars (fast) | 21-4000 chars (slow, opt-in)'
        received: $S
      }
    >
    : LengthFast<$S>
}[GetKindCase<$S>]
```

Get the length of a string literal type.

For non-literal strings (type `string`), returns `number`. For literal strings, returns exact length or error based on settings.

**Performance characteristics:**

- **0-20 chars**: Instant evaluation via pattern matching lookup table (6-362 instantiations)
- **21-4000 chars**: Requires KitLibrarySettings.Perf.Settings.allowSlow flag or local override

- When enabled: Uses tail-recursive 4x unrolling (597-2053 instantiations)

- Limit: ~4000 chars (1000 tail recursion limit × 4 chars/recursion)

- When disabled: Returns helpful error with instructions to enable
- **4000+ chars**: Exceeds TypeScript's tail recursion depth limit, will fail
- **Non-literal (`string`)**: Returns `number` (cannot determine length at compile time)

**Implementation details:** The 4000 character limit is specific to this utility's 4x unrolling strategy. Other utilities may have different limits based on their unrolling factor and type complexity. Fast path covers 95% of real-world use cases with zero performance cost.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Fast path (instant)
type L1 = Str.Length<'hello'> // 5
type L2 = Str.Length<''> // 0
type L3 = Str.Length<'a'> // 1

// Non-literal string
type L4 = Str.Length<string> // number

// Exceeds fast path without flag
type L5 = Str.Length<'this string is over 20 chars long'>
// Error: String length exceeds fast path limit (20 chars)
//        Set KitLibrarySettings.Perf.Settings.allowSlow to true

// Local override - no global setting needed
type L6 = Str.Length<'this string is over 20 chars long', true> // 38 (works, slower compilation)

// With global allowSlow flag enabled
declare global {
  namespace KitLibrarySettings {
    namespace Perf {
      interface Settings {
        allowSlow: true
      }
    }
  }
}
type L7 = Str.Length<'this string is over 20 chars long'> // 38 (works, slower compilation)
```

## Type-Level Utilities $S - The string to pad $TargetLen - The desired final length $Fill - The character to use for padding (default: '_') $Acc - Accumulator for recursion depth tracking (internal)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PadEnd`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L116" /> {#t-pad-end-116}

```typescript
type PadEnd<
  $S extends string,
  $TargetLen extends number,
  $Fill extends string = '_',
  $Acc extends 0[] = [],
> = Length<$S> extends $TargetLen ? $S
  : $Acc['length'] extends 50 // Recursion limit safety
    ? $S
  : PadEnd<`${$S}${$Fill}`, $TargetLen, $Fill, [...$Acc, 0]>
```

Pad a string to a target length by appending a fill character.

If the string is already at or exceeds the target length, returns it unchanged. Limited by TypeScript's recursion depth (~50 iterations).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
type P1 = Str.PadEnd<'foo', 10, '_'> // 'foo_______'
type P2 = Str.PadEnd<'hello', 3, '_'> // 'hello' (already longer)
type P3 = Str.PadEnd<'abc', 5, '0'> // 'abc00'
```

## Type-Level Utilities $S - The string to pad $TargetLen - The desired final length $Fill - The character to use for padding (default: '0') $Acc - Accumulator for recursion depth tracking (internal)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PadStart`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L146" /> {#t-pad-start-146}

```typescript
type PadStart<
  $S extends string,
  $TargetLen extends number,
  $Fill extends string = '0',
  $Acc extends 0[] = [],
> = Length<$S> extends $TargetLen ? $S
  : $Acc['length'] extends 50 // Recursion limit safety
    ? $S
  : PadStart<`${$Fill}${$S}`, $TargetLen, $Fill, [...$Acc, 0]>
```

Pad a string to a target length by prepending a fill character.

If the string is already at or exceeds the target length, returns it unchanged. Limited by TypeScript's recursion depth (~50 iterations).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
type P1 = Str.PadStart<'42', 5, '0'> // '00042'
type P2 = Str.PadStart<'hello', 3, '0'> // 'hello' (already longer)
type P3 = Str.PadStart<'x', 3, ' '> // '  x'
```

## Type-Level Utilities T - The string type to check $ErrorMessage - Custom error message to display when T is not a literal

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LiteralOnly`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L87" /> {#t-literal-only-87}

```typescript
type LiteralOnly<
  T extends string,
  $ErrorMessage extends string = 'Expected a literal string',
> = string extends T ? Ts.Err.StaticError<
    $ErrorMessage,
    { ReceivedType: T; tip: 'Use a string literal instead of string type' }
  >
  : T
```

Constraint that only accepts literal strings. Returns StaticError for non-literal string type with customizable error message.
