# Str.Text

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Text
```

```typescript [Barrel]
import { Text } from '@wollybeard/kit/str'
```

:::

## Text Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultIndentCharacter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L17" /> {#c-default-indent-character-17}

```typescript
' '
```

Default character used for indentation (non-breaking space).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultLineSeparator`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L23" /> {#c-default-line-separator-23}

```typescript
'\n'
```

Default line separator character (newline).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Column`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L31" /> {#t-column-31}

```typescript
type Column = string[]
```

A column is a vertical stack of lines.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `lines`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L47" /> {#c-lines-47}

```typescript
(value: string) => string[]
```

Split text into an array of lines. Pre-configured splitWith using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:lines:1]
Str.Text.lines('hello\nworld\n!') // ['hello', 'world', '!']
// [!code word:lines:1]
Str.Text.lines('single line') // ['single line']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `unlines`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L61" /> {#c-unlines-61}

```typescript
;((value: string[]) => string)
```

Join an array of lines into text. Pre-configured joinWith using newline separator.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:unlines:1]
Str.Text.unlines(['hello', 'world', '!']) // 'hello\nworld\n!'
// [!code word:unlines:1]
Str.Text.unlines(['single line']) // 'single line'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L77" /> {#f-indent-77}

```typescript
(text: string, size?: number | undefined): string
```

**Parameters:**

- `text` - The text to indent
- `size` - Number of spaces to indent (default: defaultIndentSize)

**Returns:** The indented text

Indent each line of text by a specified number of spaces.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indent:1]
Str.Text.indent('hello\nworld') // '  hello\n  world'
// [!code word:indent:1]
Str.Text.indent('line1\nline2', 4) // '    line1\n    line2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L88" /> {#c-indent-on-88}

```typescript
;((text: string) => (size?: number | undefined) => string)
```

Curried version of indent with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L101" /> {#c-indent-with-101}

```typescript
;((size?: number | undefined) => (text: string) => string)
```

Curried version of indent with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indentWith:1]
const indent4 = Str.Text.indentWith(4)
indent4('hello\nworld') // '    hello\n    world'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `indentBy`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L124" /> {#f-indent-by-124}

```typescript
(text: string, prefixOrFn: string | ((line: string, lineIndex: number) => string)): string
```

**Parameters:**

- `text` - The text to indent
- `prefixOrFn` - String to prepend to each line, or function `(line: string, lineIndex: number) => string`

**Returns:** The indented text

Indent each line using a custom prefix string or function. When given a function, it receives both the line content and index, allowing for content-aware indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Fixed string prefix
// [!code word:indentBy:1]
Str.Text.indentBy('hello\nworld', '>>> ') // '>>> hello\n>>> world'

// Dynamic prefix based on line index (ignore line content with _)
// [!code word:indentBy:1]
Str.Text.indentBy('line1\nline2\nline3', (_, i) => `${i + 1}. `)
// '1. line1\n2. line2\n3. line3'

// Content-aware indentation
// [!code word:indentBy:1]
Str.Text.indentBy('title\nitem', (line, i) => line === 'title' ? '' : '  ')
// 'title\n  item'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L139" /> {#c-indent-by-on-139}

```typescript
;((text: string) =>
(prefixOrFn: string | ((line: string, lineIndex: number) => string)) => string)
```

Curried version of indentBy with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `indentByWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L160" /> {#c-indent-by-with-160}

```typescript
;((prefixOrFn: string | ((line: string, lineIndex: number) => string)) =>
(text: string) => string)
```

Curried version of indentBy with prefix first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:indentByWith:1]
const addArrow = Str.Text.indentByWith('→ ')
addArrow('hello\nworld') // '→ hello\n→ world'

// [!code word:indentByWith:1]
const numbered = Str.Text.indentByWith((_, i) => `${i}. `)
numbered('first\nsecond') // '0. first\n1. second'

// [!code word:indentByWith:1]
const conditionalIndent = Str.Text.indentByWith((line, i) =>
  // [!code word:startsWith:1]
  line.startsWith('#') ? '' : '  '
)
conditionalIndent('# Title\nContent') // '# Title\n  Content'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `stripIndent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L182" /> {#f-strip-indent-182}

```typescript
(text: string): string
```

**Parameters:**

- `text` - The text to dedent

**Returns:** The dedented text

Remove common leading whitespace from all lines. Finds the minimum indentation across all non-empty lines and removes that amount from every line. This is useful for dedenting code blocks or template strings while preserving relative indentation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:stripIndent:1]
Str.Text.stripIndent('    line1\n      line2\n    line3')
// 'line1\n  line2\nline3'

// [!code word:stripIndent:1]
Str.Text.stripIndent('  code\n    nested\n  code')
// 'code\n  nested\ncode'

// Empty lines are ignored when calculating minimum indent
// [!code word:stripIndent:1]
Str.Text.stripIndent('    line1\n\n    line2')
// 'line1\n\nline2'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultPadCharacter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L208" /> {#c-default-pad-character-208}

```typescript
' '
```

Default character used for padding.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pad`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L225" /> {#f-pad-225}

```typescript
(text: string, size: number, side?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

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
// [!code word:pad:1]
Str.Text.pad('hello', 3, 'left') // '   hello'
// [!code word:pad:1]
Str.Text.pad('hello', 3, 'right') // 'hello   '
// [!code word:pad:1]
Str.Text.pad('hello', 2, 'left', '-') // '--hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L240" /> {#c-pad-on-240}

```typescript
;((text: string) =>
(size: number) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of pad with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L248" /> {#c-pad-with-248}

```typescript
;((size: number) =>
(text: string) =>
(side?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of pad with size first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padLeft`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L263" /> {#f-pad-left-263}

```typescript
(text: string, size: number, char?: string = defaultPadCharacter): string
```

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
// [!code word:padLeft:1]
Str.Text.padLeft('hello', 3) // '   hello'
// [!code word:padLeft:1]
Str.Text.padLeft('hello', 2, '0') // '00hello'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L273" /> {#c-pad-left-on-273}

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

Curried version of padLeft with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padLeftWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L286" /> {#c-pad-left-with-286}

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

Curried version of padLeft with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padLeftWith:1]
const pad3 = Str.Text.padLeftWith(3)
pad3('hi') // '   hi'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `padRight`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L301" /> {#f-pad-right-301}

```typescript
(text: string, size: number, char?: string = defaultPadCharacter): string
```

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
// [!code word:padRight:1]
Str.Text.padRight('hello', 3) // 'hello   '
// [!code word:padRight:1]
Str.Text.padRight('hello', 2, '.') // 'hello..'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L311" /> {#c-pad-right-on-311}

```typescript
;((text: string) => (size: number) => (char?: string | undefined) => string)
```

Curried version of padRight with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padRightWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L324" /> {#c-pad-right-with-324}

```typescript
;((size: number) => (text: string) => (char?: string | undefined) => string)
```

Curried version of padRight with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padRightWith:1]
const pad3 = Str.Text.padRightWith(3)
pad3('hi') // 'hi   '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `span`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L351" /> {#f-span-351}

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

**Parameters:**

- `text` - The text to align
- `width` - Target width (in characters)
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** The aligned text

Align text within a specified width by adding padding.

This ensures text spans exactly the target width, aligning content to the left or right. If the text is already wider than the target width, no padding is added.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Left-align (pad right)
// [!code word:span:1]
Str.span('hi', 5, 'left') // 'hi   '

// Right-align (pad left)
// [!code word:span:1]
Str.span('hi', 5, 'right') // '   hi'

// Text already wider - no padding added
// [!code word:span:1]
Str.span('hello world', 5, 'left') // 'hello world' (unchanged)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L368" /> {#c-span-on-368}

```typescript
;((text: string) =>
(width: number) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of span with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L383" /> {#c-span-with-383}

```typescript
;((width: number) =>
(text: string) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of span with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:spanWith:1]
const span8 = Str.spanWith(8)
span8('Name', 'left') // 'Name    '
span8('Age', 'right') // '     Age'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L427" /> {#f-fit-427}

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

**Parameters:**

- `text` - The text to constrain
- `width` - Exact target width (in characters)
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** Text constrained to exact width

Constrain text to exact width by cropping and/or padding.

Unlike span which only pads (leaving text unchanged if too long), this function guarantees the exact width by:

- Cropping text if it exceeds the target width
- Padding text if it's shorter than the target width

This is useful for fixed-width layouts where column widths must be exact, such as table columns, CSV files, and fixed-format text files.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Text too long - gets cropped
// [!code word:fit:1]
Str.fit('hello world', 5, 'left') // 'hello'

// Text too short - gets padded
// [!code word:fit:1]
Str.fit('hi', 5, 'left') // 'hi   '
// [!code word:fit:1]
Str.fit('hi', 5, 'right') // '   hi'

// Perfect fit - unchanged
// [!code word:fit:1]
Str.fit('exact', 5, 'left') // 'exact'

// Use case: Fixed-width table columns
const columns = ['Name', 'Email', 'Status'].map(
  // [!code word:fit:1]
  (header, i) => Str.fit(header, [10, 20, 8][i], 'left'),
)
// ['Name      ', 'Email               ', 'Status  ']

// CSV formatting with fixed columns
const row = [name, email, status].map((val, i) =>
  // [!code word:fit:1]
  Str.fit(val, [20, 30, 10][i], 'left')
).join(',')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L443" /> {#c-fit-on-443}

```typescript
;((text: string) =>
(width: number) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of fit with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L462" /> {#c-fit-with-462}

```typescript
;((width: number) =>
(text: string) =>
(align?: 'left' | 'right' | undefined) =>
(char?: string | undefined) => string)
```

Curried version of fit with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Create fixed-width formatters
// [!code word:fitWith:1]
const nameColumn = Str.fitWith(20)
// [!code word:fitWith:1]
const statusColumn = Str.fitWith(10)

nameColumn('John Doe', 'left') // 'John Doe            '
statusColumn('Active', 'left') // 'Active    '
statusColumn('Very Long Status', 'left') // 'Very Long '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapLines`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L479" /> {#f-map-lines-479}

```typescript
(text: string, fn: (line: string, index: number) => string): string
```

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
// [!code word:mapLines:1]
// [!code word:toUpperCase:1]
Str.Text.mapLines('hello\nworld', (line) => line.toUpperCase())
// 'HELLO\nWORLD'

// [!code word:mapLines:1]
Str.Text.mapLines('a\nb\nc', (line, i) => `${i}: ${line}`)
// '0: a\n1: b\n2: c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L489" /> {#c-map-lines-on-489}

```typescript
;((text: string) => (fn: (line: string, index: number) => string) => string)
```

Curried version of mapLines with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mapLinesWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L502" /> {#c-map-lines-with-502}

```typescript
;((fn: (line: string, index: number) => string) => (text: string) => string)
```

Curried version of mapLines with function first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:mapLinesWith:1]
// [!code word:toUpperCase:1]
const uppercase = Str.Text.mapLinesWith((line) => line.toUpperCase())
uppercase('hello\nworld') // 'HELLO\nWORLD'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StyledPrefix`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L512" /> {#t-styled-prefix-512}

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

Styled prefix that can have an optional color function. Used with formatBlock for colored line prefixes.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `formatBlock`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L566" /> {#f-format-block-566}

```typescript
(block: string, opts: { prefix?: string | StyledPrefix; indent?: number; excludeFirstLine?: boolean; }): string
```

**Parameters:**

- `block` - The text block to format
- `opts` - Formatting options

**Returns:** Formatted text block

Format a multi-line text block with line-by-line transformations.

Processes each line of text, adding a prefix and optional indentation. Supports excluding the first line and styled prefixes with colors.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Simple string prefix
// [!code word:formatBlock:1]
Str.Text.formatBlock('line1\nline2\nline3', { prefix: '> ' })
// '> line1\n> line2\n> line3'

// With indentation
// [!code word:formatBlock:1]
Str.Text.formatBlock('line1\nline2', { prefix: '| ', indent: 2 })
// '|   line1\n|   line2'

// Exclude first line (useful for continuing indentation)
// [!code word:formatBlock:1]
Str.Text.formatBlock('header\nline1\nline2', {
  prefix: '  ',
  excludeFirstLine: true,
})
// 'header\n  line1\n  line2'

// Single line - returned as-is
// [!code word:formatBlock:1]
Str.Text.formatBlock('single', { prefix: '> ' })
// 'single'

// Styled prefix with color function
// [!code word:formatBlock:1]
Str.Text.formatBlock('data\nmore data', {
  prefix: {
    symbol: '│ ',
    color: (text) => `\x1b[90m${text}\x1b[0m`, // gray color
  },
  indent: 2,
})
// '\x1b[90m│ \x1b[0m  data\n\x1b[90m│ \x1b[0m  more data'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `formatBlockOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L598" /> {#c-format-block-on-598}

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

Curried version of formatBlock with block first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `formatBlockWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L612" /> {#c-format-block-with-612}

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

Curried version of formatBlock with options first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:formatBlockWith:1]
const addSpine = Str.Text.formatBlockWith({ prefix: '│ ', indent: 2 })
addSpine('line1\nline2\nline3')
// '│   line1\n│   line2\n│   line3'
```

## Text Formatting 2

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `defaultIndentSize`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/text.ts#L11" /> {#c-default-indent-size-11}

```typescript
2
```

Default indentation size in characters.
