# Str.Tpl

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Tpl
```

```typescript [Barrel]
import { Tpl } from '@wollybeard/kit/str'
```

:::

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Tpl`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L19" /> {#t-tpl-19}

```typescript
type Tpl = TemplateStringsArray
```

Convenience re-export of the built-in TemplateStringsArray type. Contains the string parts of a tagged template literal along with a `raw` property.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(strings: Str.Tpl.Tpl.Array, ...values: unknown[]) {
  // strings is TemplateStringsArray
  // strings[0] = "Hello "
  // strings[1] = "!"
  // strings.raw contains raw string values
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L38" /> {#f-is-38}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - Value to check

**Returns:** True if value is a TemplateStringsArray

Type guard to check if a value is a TemplateStringsArray. Used to detect when a function is called as a tagged template literal.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArray(args[0])) {
    // Called as tag`template`
  } else {
    // Called as tag()
  }
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `CallInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L57" /> {#t-call-input-57}

```typescript
type CallInput = [Tpl, ...unknown[]]
```

Tagged template literal arguments tuple. First element is the template strings array, followed by interpolated values.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const [strings, ...values] = args
    // Process template literal
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isCallInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L75" /> {#f-is-call-input-75}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - Function arguments to check

**Returns:** True if args are tagged template literal arguments

Type guard to check if function arguments are from a tagged template literal.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const [strings, ...values] = args
    // Process as template literal
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalizeCall`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L102" /> {#f-normalize-call-102}

```typescript
(callInput: CallInput): Call
```

**Parameters:**

- `callInput` - Tagged template literal arguments

**Returns:** Object with parts (TemplateStringsArray) and values (unknown[])

Parse tagged template literal arguments into structured parts and values.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const { parts, values } = parse(args)
    // parts[0] = "Hello "
    // parts[1] = "!"
    // values[0] = name
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `renderWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L125" /> {#f-render-with-125}

```typescript
(mapper: (value: unknown) => string): (callInput: CallInput) => string
```

**Parameters:**

- `mapper` - Function to convert interpolated values to strings

**Returns:** Function that takes template args and returns rendered string

Render tagged template literal arguments using a custom value renderer.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Custom renderer for JSON values
// [!code word:renderWith:1]
// [!code word:stringify:1]
const renderJson = Str.Tpl.renderWith(v => JSON.stringify(v))
function tag(...args: unknown[]) {
  if (isArgs(args)) return renderJson(args)
}
tag`Value: ${{ foo: 'bar' }}` // "Value: {\"foo\":\"bar\"}"

// Custom renderer that prefixes values
// [!code word:renderWith:1]
const renderPrefixed = Str.Tpl.renderWith(v => `[${v}]`)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `render`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L150" /> {#c-render-150}

```typescript
((callInput: CallInput) => string)
```

Render tagged template literal arguments to a string. Interpolated values are converted using plain `String()` coercion.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    // [!code word:render:1]
    return Str.Tpl.render(args)
  }
}
tag`Hello ${name}!` // "Hello World!"
tag`Count: ${42}` // "Count: 42"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `passthrough`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L166" /> {#f-passthrough-166}

```typescript
(strings: TemplateStringsArray, ...values?: unknown[]): string
```

**Parameters:**

- `strings` - Template string parts
- `values` - Interpolated values

**Returns:** The composed string with values interpolated

A passthrough tagged template literal that returns the interpolated string as-is. Useful for semantic clarity in code without any processing.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const template = passthrough
const message = template`Hello ${name}, you have ${count} items.`
// Result: "Hello Alice, you have 5 items."
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `dedent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L209" /> {#f-dedent-209}

```typescript
(strings: TemplateStringsArray, ...values?: unknown[]): string
```

**Parameters:**

- `strings` - Template string parts (uses raw strings to preserve escapes)
- `values` - Interpolated values

**Returns:** Dedented string with common indentation removed

Tagged template literal that removes common indentation from all lines. Automatically indents multi-line interpolated values to match their context.

Uses the raw template strings to preserve escape sequences (e.g., `\n` stays as backslash-n). Trims leading and trailing blank lines from the result.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const code = dedent`
  function greet() {
    console.log('Hello')
  }
`
// Result: "function greet() {\n  console.log('Hello')\n}"
```

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Multi-line values are auto-indented
const inner = 'line1\nline2'
const code = dedent`
  outer:
    ${inner}
`
// Result: "outer:\n  line1\n  line2"
```

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Escape sequences are preserved
const path = dedent`
  C:\Users\name\Documents
`
// Result: "C:\\Users\\name\\Documents" (backslashes preserved)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HighlightTag`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L250" /> {#t-highlight-tag-250}

```typescript
type HighlightTag = typeof passthrough
```

Type for a tagged template literal function used for syntax highlighting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `highlight`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L297" /> {#c-highlight-297}

```typescript
{
  ts: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  js: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  html: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  css: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  sql: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  json: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  yaml: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  yml: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  graphql: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  gql: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
  iso: ;
  ; ((strings: TemplateStringsArray, ...values: unknown[]) => string)
}
```

Object containing language-specific template tag functions for syntax highlighting. Each property is a tagged template function that provides editor syntax highlighting for that language (when supported by the editor).

**Automatically dedents content**

- Removes common indentation and trims blank lines, allowing you to write naturally indented template literals in your source code while producing clean output. Relative indentation is preserved.

Implemented as a Proxy that returns the same dedent function for all properties, allowing destructuring and property access to work seamlessly.

Supported languages are based on common supported editor injection patterns:

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

// [!code word:highlight:1]
const { ts, html, sql } = Str.Tpl.highlight

// Source indentation is automatically removed
const code = ts`
  export const add = (a: number, b: number) => {
    return a + b
  }
`
// Result: "export const add = (a: number, b: number) => {\n  return a + b\n}"
// ^ Clean output with relative indentation preserved

const markup = html`
  <div class="container">
    <h1>Title</h1>
  </div>
` // Gets HTML syntax highlighting, auto-dedented

const query = sql`
  SELECT * FROM users
  WHERE id = ${userId}
` // Gets SQL syntax highlighting, auto-dedented
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Call`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L79" /> {#i-call-79}

```typescript
interface Call {
  template: Tpl
  args: unknown[]
}
```
