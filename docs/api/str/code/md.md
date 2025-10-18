# Str.Code.Md

_Str.Code_ / **Md**

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Code.Md.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Code.Md.someFunction()
```

:::

## Namespaces

- [**`md`**](/api/str/code/md/md) - Structured markdown helpers.

These helpers generate properly formatted markdown elements. All helpers return `Raw` (already formatted) or `null` for graceful handling.

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `raw`

```typescript
(content: string): Raw
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L38" />

Mark content as already-formatted markdown (won't be processed further).

Use this for pre-formatted markdown syntax that should be injected as-is.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:raw:1]
const formattedLink = Str.Code.Md.raw('[Example](https://example.com)')
const doc = builder()
doc`Check out ${formattedLink}`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `code`

```typescript
(value: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L56" />

Wrap value in markdown inline code (backticks).

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:code:1]
Str.Code.Md.code('hello') // '`hello`'
// [!code word:code:1]
Str.Code.Md.code('Array<T>') // '`Array<T>`'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `link`

```typescript
(url: string, text?: string | undefined): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L76" />

Create a markdown inline link.

If text is not provided, the URL is used as both the link text and target.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:link:1]
Str.Code.Md.link('https://example.com', 'Example')
// '[Example](https://example.com)'

// [!code word:link:1]
Str.Code.Md.link('https://example.com')
// '[https://example.com](https://example.com)'

// Compose for bold code links:
// [!code word:link:1]
Str.Code.Md.link('/api/foo', `**${code('Foo')}**`)
// '[**`Foo`**](/api/foo)'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `heading`

```typescript
(level: number, text: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L88" />

Create a markdown heading.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `codeFence`

```typescript
(code: string, language?: string = 'typescript', modifiers?: string | undefined): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L95" />

Create a code fence with optional language and modifiers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `codeGroup`

```typescript
(tabs: { label: string; code: string; language?: string; modifiers?: string; }[]): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L111" />

Create a VitePress code group with multiple tabs.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:codeGroup:1]
Str.Code.Md.codeGroup([
  { label: 'npm', code: 'npm install foo', language: 'bash' },
  { label: 'pnpm', code: 'pnpm add foo', language: 'bash' },
])
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `container`

```typescript
(type: "warning" | "tip" | "info" | "danger", title: string, content: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L126" />

Create a VitePress custom container (warning, tip, etc.).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `deprecation`

```typescript
(message: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L133" />

Create a deprecation warning with proper link conversion.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `listItem`

```typescript
(text: string, level?: number = 0): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L140" />

Create an unordered list item.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sub`

```typescript
(text: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L148" />

Create a sub-text annotation (smaller font).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `convertJSDocLinks`

```typescript
(text: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L161" />

Convert JSDoc

tags to markdown links.

Patterns:

- Identifier → [`Identifier`](url) -

→ [description](url)

For Effect library references (String._, Array._, etc.), links to Effect documentation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `demoteHeadings`

```typescript
(markdown: string, levels: number): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L190" />

**Parameters:**

- `markdown` - The markdown content to transform
- `levels` - Number of heading levels to add (e.g., 2 transforms ## to ####)

**Returns:** Transformed markdown with demoted headings

Demote markdown headings by adding a specified number of levels.

This is used to ensure JSDoc descriptions don't break the document hierarchy. For example, if an export is h3, its description headings should be h4+.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sections`

```typescript
(...parts?: (string | false | null | undefined)[]): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L204" />

Join markdown sections with double newlines, filtering out empty sections.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `kebab`

```typescript
(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L211" />

Convert string to kebab-case.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `table`

```typescript
(rows: Record<string, string | null | undefined>): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L236" />

Generate a markdown table from key-value pairs.

Automatically filters out undefined and null values. Returns empty string if no valid entries remain after filtering.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:table:1]
Str.Code.Md.table({
  'Name': 'Alice',
  'Age': '30',
  'City': undefined, // filtered out
})
// | | |
// | - | - |
// | **Name** | Alice |
// | **Age** | 30 |
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `builder`

```typescript
(): Builder
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L520" />

Create a new markdown builder for imperative construction.

Perfect for markdown generation with conditionals, loops, and complex logic.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:builder:1]
const doc = Str.Code.Md.builder()

doc`# ${title}`
// [!code word:blank:1]
doc.blank()
doc`Main description`

if (showExample) {
  // [!code word:codeFence:1]
  doc.codeFence('const x = 1', 'ts')
}

// [!code word:build:1]
return doc.build()
```

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `template`

```typescript
Template
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L759" />

Tagged template for building markdown content. Also provides `.builder()` for imperative construction and `.md` for element helpers.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Template mode
const doc = template`
  # API Reference

  ${description}

// [!code word:link:1]
  ${Str.Code.Md.template.md.link('Docs', 'https://example.com')}
`

// Builder mode for complex logic
// [!code word:builder:1]
const doc = Str.Code.Md.template.builder()
// [!code word:heading:1]
doc.heading(1, 'API Reference')
// [!code word:blank:1]
doc.blank()
if (hasDescription) {
  // [!code word:add:1]
  doc.add(description)
}
// [!code word:build:1]
return doc.build()
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Raw`

```typescript
interface Raw {
  readonly __markdownFormatted: true
  readonly content: string
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L21" />

Branded type for markdown content that's already formatted and safe.

Use raw to create values of this type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Builder`

````typescript
interface Builder {
  /**
   * Add a line to the markdown via tagged template.
   * Use empty template for blank lines: `doc\`\``
   */
  (
    strings: TemplateStringsArray,
    ...values: Array<string | number | Raw | null | undefined>
  ): Builder

  /**
 * Add content directly. Skips if null/undefined.
 * Perfect for chaining with optional content.
 *
 * @example
 *
```ts
   * doc
   *   .add(description)  // skips if null/undefined
   *   .add('## Info')
   * ```
   */
  add(content: string | null | undefined): Builder

  /**
   * Add raw formatted markdown without processing. Skips if null/undefined.
   *
   * @example
   * ```ts
   * doc.addRaw(preFormattedMarkdown)
   * ```
   */
  addRaw(content: string | null | undefined): Builder

  /**
   * Add a blank line.
   *
   * @example
   * ```ts
   * doc
   *   .add('First paragraph')
   *   .blank()
   *   .add('Second paragraph')
   * ```
   */
  blank(): Builder

  /**
   * Add a markdown heading.
   *
   * @example
   * ```ts
   * doc.heading(2, 'API Reference')
   * ```
   */
  heading(level: number, text: string): Builder

  /**
   * Add a markdown link.
   * If text is not provided, url is used as both text and URL.
   *
   * @example
   * ```ts
   * doc.link('https://example.com', 'Example')
   * doc.link('https://example.com')  // text defaults to URL
   * // Compose for bold code: doc`[**\`Foo\`**](/api/foo)`
   * ```
   */
  link(url: string, text?: string): Builder

  /**
   * Add a code fence with optional language.
   * Skips if code is null/undefined.
   *
   * @example
   * ```ts
   * doc.codeFence('const x = 1', 'typescript')
   * ```
   */
  codeFence(
    code: string | null | undefined,
    language?: string,
    modifiers?: string,
  ): Builder

  /**
   * Add a VitePress code group with multiple tabs.
   *
   * @example
   * ```ts
   * doc.codeGroup([
   *   { label: 'npm', code: 'npm install foo', language: 'bash' },
   *   { label: 'pnpm', code: 'pnpm add foo', language: 'bash' }
   * ])
   * ```
   */
  codeGroup(
    tabs: Array<
      { label: string; code: string; language?: string; modifiers?: string }
    >,
  ): Builder

  /**
   * Add a list item.
   *
   * @example
   * ```ts
   * doc.listItem('First item')
   * doc.listItem('Nested item', 1)
   * ```
   */
  listItem(text: string, level?: number): Builder

  /**
   * Add a markdown table from key-value pairs.
   * Automatically filters out undefined/null values.
   *
   * @example
   * ```ts
   * doc.table({
   *   'Type': 'string',
   *   'Required': 'Yes'
   * })
   * ```
   */
  table(rows: Record<string, string | Raw | undefined | null>): Builder

  /**
   * Add a VitePress container.
   *
   * @example
   * ```ts
   * doc.container('warning', 'Deprecated', 'Use newMethod() instead')
   * ```
   */
  container(
    type: 'warning' | 'tip' | 'info' | 'danger',
    title: string,
    content: string,
  ): Builder

  /**
   * Build the final markdown string with whitespace normalization.
   */
  build(): string
}
````

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L369" />

Markdown builder interface for imperative markdown construction.

Provides a fluent API for building markdown with conditionals, loops, and helpers.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const doc = builder()

doc`# API Reference`
// [!code word:blank:1]
doc.blank()
doc`Main description here.`

if (showTable) {
  // [!code word:table:1]
  doc.table({ 'Type': 'string', 'Required': 'Yes' })
}

// [!code word:codeFence:1]
doc.codeFence('const x = 1', 'typescript')

// [!code word:build:1]
return doc.build()
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Template`

````typescript
interface Template {
  /**
 * Tagged template for building markdown content.
 *
 * @example
 *
```ts
   * const doc = template`
   *   # ${title}
   *
   *   ${description}
   *
   *   ${md.link('Example', 'https://example.com')}
   * `
   * ```
   */
  (
    strings: TemplateStringsArray,
    ...values: Array<string | number | Raw | null | undefined>
  ): string

  /**
   * Create a new markdown builder for imperative construction.
   */
  builder: typeof builder

  /**
   * Create a markdown generator function from a builder callback.
   * Automatically calls `.build()` and returns the result.
   *
   * @example
   * ```ts
   * export const getDoc = factory<[title: string, items: string[]]>((doc, title, items) => {
   *   doc.heading(1, title)
   *   doc.blank()
   *   items.forEach(item => doc.listItem(item))
   * })
   *
   * // Usage: getDoc('My Title', ['item1', 'item2']) -> string
   * ```
   */
  factory: <$Args extends any[]>(
    fn: (doc: Builder, ...args: $Args) => void,
  ) => (...args: $Args) => string

  /**
   * Markdown element helpers for generating formatted elements.
   */
  md: typeof md
}
````

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L689" />

Markdown template function type with builder property.
