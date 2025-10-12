# Str

String utilities for text manipulation and analysis. Provides comprehensive string operations including case conversion, splitting, matching, replacement, templating, and character utilities. Features type-safe APIs with strong inference for string literals and patterns.

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

- [**`Case`**](/api/str/case) - Convert string to camelCase.
- [**`Char`**](/api/str/char) - Uppercase letter.
- [**`Tpl`**](/api/str/tpl)

## Builder

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultRender`

```typescript
;((value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/builder.ts#L12" />

Default render function for string builders. Joins lines with newline characters.

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

String builder interface for constructing multi-line strings. Supports both function call syntax and template literal syntax.

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
;((
  input: {
    data: Record<string, string>
    separator?: string | false | undefined
    separatorAlignment?: boolean
  },
) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/table.ts#L32" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pattern`

```typescript
;(<matches extends Matches>(pattern: RegExp) => Pattern<matches>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L53" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `match`

```typescript
;(<matches extends Matches>(
  string: string,
  pattern: RegExp | Pattern<matches>,
) => Option<RegExpMatchResult<matches>>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L80" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatch`

```typescript
;((value: string, pattern: PatternInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L105" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchOn`

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L124" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchWith`

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L138" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isntMatch`

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L152" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchOn`

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L162" />

Curried version of isntMatch with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isntMatchWith`

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L170" />

Curried version of isntMatch with pattern first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isMatchAny`

```typescript
;((value: string, patterns: PatternsInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L189" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyOn`

```typescript
;((value: string) => (patterns: PatternsInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L200" />

Curried version of isMatchAny with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isMatchAnyWith`

```typescript
;((patterns: PatternsInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L215" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNotMatchAny`

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L229" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyOn`

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L239" />

Curried version of isNotMatchAny with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isNotMatchAnyWith`

```typescript
;((value: string) => (patternOrPatterns: PatternsInput) => boolean)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/match.ts#L247" />

Curried version of isNotMatchAny with patterns first.

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `interpolate`

```typescript
;((template: string) => (args: TemplateArgs) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L18" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `templateVariablePattern`

```typescript
RegExp
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L30" />

Regular expression pattern to match template variables in $variable format. Captures the variable name inside the braces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TemplateArgs`

```typescript
type TemplateArgs = Record<string, Json.Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/template.ts#L37" />

Arguments object for template interpolation. Maps variable names to their JSON-serializable values.

## Text Formatting

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `lines`

```typescript
(value: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L39" />

Split text into an array of lines. Pre-configured splitWith using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:lines:1]
Str.lines('hello\nworld\n!') // ['hello', 'world', '!']
// [!code word:lines:1]
Str.lines('single line') // ['single line']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `unlines`

```typescript
;((value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L53" />

Join an array of lines into text. Pre-configured joinWith using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:unlines:1]
Str.unlines(['hello', 'world', '!']) // 'hello\nworld\n!'
// [!code word:unlines:1]
Str.unlines(['single line']) // 'single line'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indent`

```typescript
;((text: string, size?: number | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L69" />

Indent each line of text by a specified number of spaces.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indent:1]
Str.indent('hello\nworld') // '  hello\n  world'
// [!code word:indent:1]
Str.indent('line1\nline2', 4) // '    line1\n    line2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentOn`

```typescript
;((text: string) => (size?: number | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L80" />

Curried version of indent with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentWith`

```typescript
;((size?: number | undefined) => (text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L93" />

Curried version of indent with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indentWith:1]
const indent4 = Str.indentWith(4)
indent4('hello\nworld') // '    hello\n    world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indentBy`

```typescript
;((
  text: string,
  prefixOrFn: string | ((line: string, lineIndex: number) => string),
) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L116" />

Indent each line using a custom prefix string or function. When given a function, it receives both the line content and index, allowing for content-aware indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Fixed string prefix
// [!code word:indentBy:1]
Str.indentBy('hello\nworld', '>>> ') // '>>> hello\n>>> world'

// Dynamic prefix based on line index (ignore line content with _)
// [!code word:indentBy:1]
Str.indentBy('line1\nline2\nline3', (_, i) => `${i + 1}. `)
// '1. line1\n2. line2\n3. line3'

// Content-aware indentation
// [!code word:indentBy:1]
Str.indentBy('title\nitem', (line, i) => line === 'title' ? '' : '  ')
// 'title\n  item'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByOn`

```typescript
;((text: string) =>
(prefixOrFn: string | ((line: string, lineIndex: number) => string)) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L131" />

Curried version of indentBy with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByWith`

```typescript
;((prefixOrFn: string | ((line: string, lineIndex: number) => string)) =>
(text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L152" />

Curried version of indentBy with prefix first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indentByWith:1]
const addArrow = Str.indentByWith('→ ')
addArrow('hello\nworld') // '→ hello\n→ world'

// [!code word:indentByWith:1]
const numbered = Str.indentByWith((_, i) => `${i}. `)
numbered('first\nsecond') // '0. first\n1. second'

// [!code word:indentByWith:1]
const conditionalIndent = Str.indentByWith((line, i) =>
  // [!code word:startsWith:1]
  line.startsWith('#') ? '' : '  '
)
conditionalIndent('# Title\nContent') // '# Title\n  Content'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `stripIndent`

```typescript
;((text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L174" />

Remove common leading whitespace from all lines. Finds the minimum indentation across all non-empty lines and removes that amount from every line. This is useful for dedenting code blocks or template strings while preserving relative indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:stripIndent:1]
Str.stripIndent('    line1\n      line2\n    line3')
// 'line1\n  line2\nline3'

// [!code word:stripIndent:1]
Str.stripIndent('  code\n    nested\n  code')
// 'code\n  nested\ncode'

// Empty lines are ignored when calculating minimum indent
// [!code word:stripIndent:1]
Str.stripIndent('    line1\n\n    line2')
// 'line1\n\nline2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultPadCharacter`

```typescript
' '
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L200" />

Default character used for padding.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pad`

```typescript
;((text: string, size: number, side?: 'left' | 'right', char?: string) =>
  string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L217" />

Add padding characters to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:pad:1]
Str.pad('hello', 3, 'left') // '   hello'
// [!code word:pad:1]
Str.pad('hello', 3, 'right') // 'hello   '
// [!code word:pad:1]
Str.pad('hello', 2, 'left', '-') // '--hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padOn`

```typescript
;((text: string) =>
(size: number) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L232" />

Curried version of pad with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padWith`

```typescript
;((size: number) =>
(text: string) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L240" />

Curried version of pad with size first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padLeft`

```typescript
;((text: string, size: number, char?: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L255" />

Add left padding to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padLeft:1]
Str.padLeft('hello', 3) // '   hello'
// [!code word:padLeft:1]
Str.padLeft('hello', 2, '0') // '00hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftOn`

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L265" />

Curried version of padLeft with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftWith`

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L278" />

Curried version of padLeft with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padLeftWith:1]
const pad3 = Str.padLeftWith(3)
pad3('hi') // '   hi'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padRight`

```typescript
;((text: string, size: number, char?: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L293" />

Add right padding to text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padRight:1]
Str.padRight('hello', 3) // 'hello   '
// [!code word:padRight:1]
Str.padRight('hello', 2, '.') // 'hello..'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightOn`

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L303" />

Curried version of padRight with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightWith`

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L316" />

Curried version of padRight with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padRightWith:1]
const pad3 = Str.padRightWith(3)
pad3('hi') // 'hi   '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapLines`

```typescript
;((text: string, fn: (line: string, index: number) => string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L333" />

Map a transformation function over each line of text.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:mapLines:1]
// [!code word:toUpperCase:1]
Str.mapLines('hello\nworld', (line) => line.toUpperCase())
// 'HELLO\nWORLD'

// [!code word:mapLines:1]
Str.mapLines('a\nb\nc', (line, i) => `${i}: ${line}`)
// '0: a\n1: b\n2: c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesOn`

```typescript
;((text: string) => (fn: (line: string, index: number) => string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L343" />

Curried version of mapLines with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesWith`

```typescript
;((fn: (line: string, index: number) => string) => (text: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L356" />

Curried version of mapLines with function first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:mapLinesWith:1]
// [!code word:toUpperCase:1]
const uppercase = Str.mapLinesWith((line) => line.toUpperCase())
uppercase('hello\nworld') // 'HELLO\nWORLD'
```

## Text Formatting 2

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`

```typescript
Type<string>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/traits/type.ts#L19" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `titlizeSlug`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L17" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensureEnd`

```typescript
;((string: string, ending: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/misc.ts#L28" />

Ensure a string ends with a specific ending, adding it if not present.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `trim`

```typescript
;((value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L27" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeading`

```typescript
;((replacement: string, matcher: string, value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L52" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingWith`

```typescript
;((replacement: string) => (matcher: string) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L63" />

Curried version of replaceLeading with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceLeadingOn`

```typescript
;((value: string) => (replacement: string) => (matcher: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L73" />

Curried version of replaceLeading with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `stripLeading`

```typescript
;((matcher: string) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L89" />

Remove the leading occurrence of a matcher string. Alias for replaceLeadingWith('').

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:stripLeading:1]
const removePrefix = Str.stripLeading('//')
removePrefix('// comment') // ' comment'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replace`

```typescript
;((replacement: string, matcher: PatternsInput, value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L114" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceWith`

```typescript
;((replacement: string) => (matcher: PatternsInput) => (value: string) =>
  string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L127" />

Curried version of replace with replacement first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `replaceOn`

```typescript
;((value: string) => (replacement: string) => (matcher: PatternsInput) =>
  string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L137" />

Curried version of replace with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `append`

```typescript
;((value1: string, value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L162" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendOn`

```typescript
;((value1: string) => (value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L172" />

Curried version of append with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `appendWith`

```typescript
;((value2: string) => (value1: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L185" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prepend`

```typescript
;((value1: string, value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L202" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependOn`

```typescript
;((value1: string) => (value2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L212" />

Curried version of prepend with value1 first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `prependWith`

```typescript
;((value2: string) => (value1: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L225" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `repeat`

```typescript
;((value: string, count: number) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L249" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatOn`

```typescript
;((value: string) => (count: number) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L259" />

Curried version of repeat with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `repeatWith`

```typescript
;((count: number) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L272" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `removeSurrounding`

```typescript
;((str: string, target: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L295" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingOn`

```typescript
;((str: string) => (target: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L321" />

Curried version of removeSurrounding with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingWith`

```typescript
;((target: string) => (str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L329" />

Curried version of removeSurrounding with target first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `truncate`

```typescript
;((str: string, maxLength?: number) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L352" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateOn`

```typescript
;((str: string) => (maxLength?: number | undefined) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L366" />

Curried version of truncate with str first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `truncateWith`

```typescript
;((maxLength?: number | undefined) => (str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L379" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `strip`

```typescript
;((matcher: PatternsInput) => (value: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L401" />

Remove all occurrences of patterns from a string. Alias for replaceWith('').

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:strip:1]
const removeVowels = Str.strip(/[aeiou]/g)
removeVowels('hello world') // 'hll wrld'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceRegular`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L410" />

Remove regular spaces from the beginning and end of a string. Pre-configured removeSurroundingWith for regular spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `removeSurroundingSpaceNoBreak`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/replace.ts#L419" />

Remove non-breaking spaces from the beginning and end of a string. Pre-configured removeSurroundingWith for non-breaking spaces.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `split`

```typescript
(value: string, separator: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L18" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitOn`

```typescript
(value: string) => (separator: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L29" />

Curried version of split with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `splitWith`

```typescript
(separator: string) => (value: string) => string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L42" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `join`

```typescript
;((value: string[], separator: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L58" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinOn`

```typescript
;((value: string[]) => (separator: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L68" />

Curried version of join with value first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `joinWith`

```typescript
;((separator: string) => (value: string[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L81" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `merge`

```typescript
;((string1: string, string2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L96" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeOn`

```typescript
;((string1: string) => (string2: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/split.ts#L111" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty`

```typescript
(value: string) => value is ""
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type.ts#L14" />

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

Split a string by a delimiter, filtering out empty segments and '.' segments. This is useful for path-like strings.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Contains`

```typescript
type Contains<S extends string, C extends string> = S extends
  `${string}${C}${string}` ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/type-level.ts#L51" />

Check if string contains a character.

## Type-Level Utilities T - The string type to check $ErrorMessage - Custom error message to display when T is not a literal

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

Constraint that only accepts literal strings. Returns StaticError for non-literal string type with customizable error message.

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
