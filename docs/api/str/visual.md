# Str.Visual

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Visual
```

```typescript [Barrel]
import { Visual } from '@wollybeard/kit/str'
```

:::

## Namespaces

| Namespace                            | Description                                                 |
| ------------------------------------ | ----------------------------------------------------------- |
| [**`Table`**](/api/str/visual/table) | Visual-aware table operations for multi-column text layout. |

## Text Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `width`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L66" /> {#f-width-66}

```typescript
(text: string): number
```

**Parameters:**

- `text` - The text to measure

**Returns:** The visual width of the text

Get the visual width of a string, ignoring ANSI escape codes and counting grapheme clusters.

This is the "true" visual width as it would appear in a terminal:

- ANSI escape codes (colors, styles) are stripped before counting
- Grapheme clusters (emojis, combining characters) count as single units

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// ANSI codes are stripped
// [!code word:width:1]
Str.Visual.width('\x1b[31mred\x1b[0m')  // 3

// Grapheme clusters count as 1
// [!code word:width:1]
Str.Visual.width('👨‍👩‍👧‍👦')              // 1 (family emoji)
// [!code word:width:1]
Str.Visual.width('é')                   // 1 (e + combining accent)
// [!code word:width:1]
Str.Visual.width('🇺🇸')                  // 1 (flag emoji)

// Empty string
// [!code word:width:1]
Str.Visual.width('')                    // 0
// [!code word:width:1]
Str.Visual.width('\x1b[31m\x1b[0m')     // 0 (only ANSI codes)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pad`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L102" /> {#f-pad-102}

```typescript
(text: string, size: number, side?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

**Parameters:**

- `text` - The text to pad
- `size` - Target visual size (including text)
- `side` - Which side to add padding ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** The padded text (or original if already wider than size)

Add padding to text, calculated based on visual length.

The padding size is adjusted to account for ANSI escape codes, so the final output has the desired visual width.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Regular text
// [!code word:pad:1]
Str.Visual.pad('hi', 5, 'right')  // 'hi   ' (visual width 5)

// With ANSI codes - padding accounts for escape codes
const colored = '\x1b[31mOK\x1b[0m'
// [!code word:pad:1]
Str.Visual.pad(colored, 5, 'right')  // Adds 3 spaces (visual: "OK   ")

// Text already wider than target size
// [!code word:pad:1]
Str.Visual.pad('hello', 3, 'left')  // 'hello' (unchanged)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L119" /> {#c-pad-on-119}

```typescript
(text: string) => (size: number) => (side?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of pad with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `padWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L133" /> {#c-pad-with-133}

```typescript
(size: number) => (text: string) => (side?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of pad with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:padWith:1]
const pad10 = Str.Visual.padWith(10)
pad10('\x1b[32mSuccess\x1b[0m', 'right')  // Visual width 10
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `span`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L161" /> {#f-span-161}

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

**Parameters:**

- `text` - The text to align
- `width` - Target visual width
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** The aligned text

Align text within a specified visual width by adding padding.

This ensures text spans exactly the target width, aligning content to the left or right. If the text is already wider than the target width, no padding is added.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Left-align (pad right)
// [!code word:span:1]
Str.Visual.span('hi', 5, 'left')     // 'hi   '

// Right-align (pad left)
// [!code word:span:1]
Str.Visual.span('hi', 5, 'right')    // '   hi'

// With ANSI codes
const colored = '\x1b[34mID\x1b[0m'
// [!code word:span:1]
Str.Visual.span(colored, 6, 'left')  // Visual: "ID    "
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L176" /> {#c-span-on-176}

```typescript
(text: string) => (width: number) => (align?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of span with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spanWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L191" /> {#c-span-with-191}

```typescript
(width: number) => (text: string) => (align?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of span with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:spanWith:1]
const span8 = Str.Visual.spanWith(8)
span8('Name', 'left')   // 'Name    '
span8('Age', 'right')   // '     Age'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L234" /> {#f-fit-234}

```typescript
(text: string, width: number, align?: "left" | "right" = `left`, char?: string = defaultPadCharacter): string
```

**Parameters:**

- `text` - The text to constrain
- `width` - Exact target visual width
- `align` - Content alignment ('left' or 'right')
- `char` - Character to use for padding (default: space)

**Returns:** Text constrained to exact width

Constrain text to exact visual width by cropping and/or padding.

Unlike span which only pads (leaving text unchanged if too long), this function guarantees the exact width by:

- Cropping text if it exceeds the target width
- Padding text if it's shorter than the target width

This is useful for fixed-width layouts where column widths must be exact, such as table columns, status bars, and terminal UIs.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Text too long - gets cropped
// [!code word:fit:1]
Str.Visual.fit('hello world', 5, 'left')  // 'hello'

// Text too short - gets padded
// [!code word:fit:1]
Str.Visual.fit('hi', 5, 'left')           // 'hi   '
// [!code word:fit:1]
Str.Visual.fit('hi', 5, 'right')          // '   hi'

// Perfect fit - unchanged
// [!code word:fit:1]
Str.Visual.fit('exact', 5, 'left')        // 'exact'

// With ANSI codes
const colored = '\x1b[31mvery long colored text\x1b[0m'
// [!code word:fit:1]
Str.Visual.fit(colored, 8, 'left')        // '\x1b[31mvery lon\x1b[0m' (visual: "very lon")

// Use case: Fixed-width table columns
const columns = ['Name', 'Email', 'Status'].map(
// [!code word:fit:1]
  (header, i) => Str.Visual.fit(header, [10, 20, 8][i], 'left')
)
// ['Name      ', 'Email               ', 'Status  ']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L250" /> {#c-fit-on-250}

```typescript
(text: string) => (width: number) => (align?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of fit with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fitWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L269" /> {#c-fit-with-269}

```typescript
(width: number) => (text: string) => (align?: "left" | "right" | undefined) => (char?: string | undefined) => string
```

Curried version of fit with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Create fixed-width formatters
// [!code word:fitWith:1]
const nameColumn = Str.Visual.fitWith(20)
// [!code word:fitWith:1]
const statusColumn = Str.Visual.fitWith(10)

nameColumn('John Doe', 'left')         // 'John Doe            '
statusColumn('Active', 'left')         // 'Active    '
statusColumn('Very Long Status', 'left') // 'Very Long '
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `take`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L295" /> {#f-take-295}

```typescript
(text: string, size: number): string
```

**Parameters:**

- `text` - The text to extract from
- `size` - Visual length to take

**Returns:** The extracted substring

Take a substring by visual length.

Extracts characters from the start of the string up to the specified visual width. Accounts for ANSI codes and grapheme clusters, so the result has the desired visual length.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Regular text
// [!code word:take:1]
Str.Visual.take('hello', 3)  // 'hel'

// With ANSI codes
const colored = '\x1b[31mhello\x1b[0m world'
// [!code word:take:1]
Str.Visual.take(colored, 5)  // '\x1b[31mhello\x1b[0m' (visual: "hello")

// With emoji
// [!code word:take:1]
Str.Visual.take('👋 hello', 2)  // '👋 ' (emoji + space)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `takeOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L312" /> {#c-take-on-312}

```typescript
(text: string) => (size: number) => string
```

Curried version of take with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `takeWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L326" /> {#c-take-with-326}

```typescript
(size: number) => (text: string) => string
```

Curried version of take with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:takeWith:1]
const take10 = Str.Visual.takeWith(10)
take10('a long string here')  // First 10 visual chars
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `takeWords`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L356" /> {#f-take-words-356}

```typescript
(text: string, size: number): { taken: string; remaining: string; }
```

**Parameters:**

- `text` - The text to split
- `size` - Maximum visual length

**Returns:** Object with `taken` words and `remaining` text

Split text into words by visual length, respecting word boundaries.

Extracts words from the start of the string until reaching the visual width limit. Avoids breaking words mid-way when possible (though single words longer than size will be taken anyway).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Splits at word boundaries
// [!code word:takeWords:1]
Str.Visual.takeWords('hello world here', 12)
// { taken: 'hello world', remaining: 'here' }

// Single word too long - takes it anyway
// [!code word:takeWords:1]
Str.Visual.takeWords('verylongword more', 8)
// { taken: 'verylongword', remaining: 'more' }

// With ANSI codes
const colored = '\x1b[32mone\x1b[0m two three'
// [!code word:takeWords:1]
Str.Visual.takeWords(colored, 7)
// { taken: '\x1b[32mone\x1b[0m two', remaining: 'three' }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `takeWordsOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L399" /> {#c-take-words-on-399}

```typescript
(text: string) => (size: number) => { taken: string; remaining: string; }
```

Curried version of takeWords with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `takeWordsWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L414" /> {#c-take-words-with-414}

```typescript
(size: number) => (text: string) => { taken: string; remaining: string; }
```

Curried version of takeWords with size first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:takeWordsWith:1]
const take20 = Str.Visual.takeWordsWith(20)
take20('Lorem ipsum dolor sit amet')
// { taken: 'Lorem ipsum dolor', remaining: 'sit amet' }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `wrap`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L443" /> {#f-wrap-443}

```typescript
(text: string, width: number): string[]
```

**Parameters:**

- `text` - Text to wrap (may contain existing newlines)
- `width` - Maximum visual width per line

**Returns:** Array of wrapped lines

Wrap text to fit within visual width, respecting word boundaries.

Breaks text into lines that fit the specified visual width. Respects existing newlines in the input and breaks long lines at word boundaries when possible.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Basic wrapping
// [!code word:wrap:1]
Str.Visual.wrap('hello world here', 10)
// ['hello', 'world here']

// Respects existing newlines
// [!code word:wrap:1]
Str.Visual.wrap('line one\nline two is long', 10)
// ['line one', 'line two', 'is long']

// With ANSI codes - visual width accounts for escape codes
const colored = '\x1b[31mthis is red text\x1b[0m and normal'
// [!code word:wrap:1]
Str.Visual.wrap(colored, 12)
// ['\x1b[31mthis is red\x1b[0m', 'text and', 'normal']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L466" /> {#c-wrap-on-466}

```typescript
(text: string) => (width: number) => string[]
```

Curried version of wrap with text first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `wrapWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L480" /> {#c-wrap-with-480}

```typescript
(width: number) => (text: string) => string[]
```

Curried version of wrap with width first.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:wrapWith:1]
const wrap80 = Str.Visual.wrapWith(80)
wrap80('long text here...')  // Wraps to 80 columns
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `size`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L507" /> {#f-size-507}

```typescript
(text: string): { maxWidth: number; height: number; }
```

**Parameters:**

- `text` - The text to measure

**Returns:** Object with `maxWidth` and `height` properties

Get the visual size (dimensions) of text.

Returns the maximum visual width (longest line) and height (line count). Accounts for ANSI codes and grapheme clusters.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:size:1]
Str.Visual.size('hello\nworld')
// { maxWidth: 5, height: 2 }

// With ANSI codes
const colored = '\x1b[31mred\x1b[0m\n\x1b[32mgreen!\x1b[0m'
// [!code word:size:1]
Str.Visual.size(colored)
// { maxWidth: 6, height: 2 } (visual: "red" and "green!")

// Empty string
// [!code word:size:1]
Str.Visual.size('')
// { maxWidth: 0, height: 0 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `maxWidth`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual.ts#L535" /> {#f-max-width-535}

```typescript
(text: string): number
```

**Parameters:**

- `text` - The text to measure

**Returns:** The maximum visual width across all lines

Get the maximum visual width of text (longest line).

Convenience function that returns just the width from size. Useful when you only need width and not height.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:maxWidth:1]
Str.Visual.maxWidth('short\nlonger line\nhi')  // 11

// With ANSI codes
// [!code word:maxWidth:1]
Str.Visual.maxWidth('\x1b[31mred\x1b[0m\n\x1b[32mgreen\x1b[0m')  // 5
```
