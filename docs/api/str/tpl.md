# Str.Tpl

_Str_ / **Tpl**

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Tpl.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Tpl.someFunction()
```

:::

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Tpl`

```typescript
type Tpl = TemplateStringsArray
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L19" />

Convenience re-export of the built-in TemplateStringsArray type. Contains the string parts of a tagged template literal along with a raw property.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is TemplateStringsArray
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L38" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `CallInput`

```typescript
type CallInput = [Tpl, ...unknown[]]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L57" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isCallInput`

```typescript
(value: unknown) => value is CallInput
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L75" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalizeCall`

```typescript
;((callInput: CallInput) => Call)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L102" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `renderWith`

```typescript
;((mapper: (value: unknown) => string) => (callInput: CallInput) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L125" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `render`

```typescript
;((callInput: CallInput) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L150" />

Render tagged template literal arguments to a string. Interpolated values are converted using plain String() coercion.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `passthrough`

```typescript
;((strings: TemplateStringsArray, ...values: unknown[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L166" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `dedent`

```typescript
;((strings: TemplateStringsArray, ...values: unknown[]) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L209" />

Tagged template literal that removes common indentation from all lines. Automatically indents multi-line interpolated values to match their context.

Uses the raw template strings to preserve escape sequences (e.g., \n stays as backslash-n). Trims leading and trailing blank lines from the result.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HighlightTag`

```typescript
type HighlightTag = typeof passthrough
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L250" />

Type for a tagged template literal function used for syntax highlighting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `highlight`

```typescript
{
  ts: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  js: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  html: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  css: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  sql: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  json: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  yaml: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  yml: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  graphql: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  gql: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
  iso: ;
  ;((strings: TemplateStringsArray, ...values: unknown[]) => string)
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L285" />

Object containing language-specific template tag functions for syntax highlighting. Each property is a tagged template function that provides editor syntax highlighting for that language (when supported by the editor).

Implemented as a Proxy that returns the same passthrough function for all properties, allowing destructuring and property access to work seamlessly.

Supported languages are based on common supported editor injection patterns:

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

// [!code word:highlight:1]
const { ts, html, sql } = Str.Tpl.highlight

const code = ts`
  export const add = (a: number, b: number) => a + b
` // Gets TypeScript syntax highlighting in editor

const markup = html`
  <div class="container">Hello</div>
` // Gets HTML syntax highlighting

const query = sql`
  SELECT * FROM users WHERE id = ${userId}
` // Gets SQL syntax highlighting
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Call`

```typescript
interface Call {
  template: Tpl
  args: unknown[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L79" />
