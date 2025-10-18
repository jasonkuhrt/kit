# Str.Code.Md

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Code.Md
```

```typescript [Barrel]
import { Md } from '@wollybeard/kit/str'
```

:::

## Namespaces

- [**`md`**](/api/str/code/md/md) - Structured markdown helpers.

These helpers generate properly formatted markdown elements. All helpers return `Raw` (already formatted) or `null` for graceful handling.

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `raw`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L38" /> {#f-raw-38}

```typescript
(content: string): Raw
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `code`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L56" /> {#f-code-56}

```typescript
(value: string): string
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `link`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L76" /> {#f-link-76}

```typescript
(url: string, text?: string | undefined): string
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `heading`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L88" /> {#f-heading-88}

```typescript
(level: number, text: string): string
```

Create a markdown heading.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `codeFence`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L95" /> {#f-code-fence-95}

```typescript
(code: string, language?: string = 'typescript', modifiers?: string | undefined): string
```

Create a code fence with optional language and modifiers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `codeGroup`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L111" /> {#f-code-group-111}

```typescript
(tabs: { label: string; code: string; language?: string; modifiers?: string; }[]): string
```

Create a VitePress code group with multiple tabs.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:codeGroup:1]
Str.Code.Md.codeGroup([
  { label: 'npm', code: 'npm install foo', language: 'bash' },
  { label: 'pnpm', code: 'pnpm add foo', language: 'bash' }
])
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `container`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L126" /> {#f-container-126}

```typescript
(type: "warning" | "tip" | "info" | "danger", title: string, content: string): string
```

Create a VitePress custom container (warning, tip, etc.).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `deprecation`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L133" /> {#f-deprecation-133}

```typescript
(message: string): string
```

Create a deprecation warning with proper link conversion.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `listItem`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L140" /> {#f-list-item-140}

```typescript
(text: string, level?: number = 0): string
```

Create an unordered list item.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sub`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L148" /> {#f-sub-148}

```typescript
(text: string): string
```

Create a sub-text annotation (smaller font).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `convertJSDocLinks`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L161" /> {#f-convert-jsdoc-links-161}

```typescript
(text: string): string
```

Convert JSDoc

tags to markdown links.

Patterns:

- Identifier → [`Identifier`](url) -

→ [description](url)

For Effect library references (String._, Array._, etc.), links to Effect documentation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `demoteHeadings`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L190" /> {#f-demote-headings-190}

```typescript
(markdown: string, levels: number): string
```

**Parameters:**

- `markdown` - The markdown content to transform
- `levels` - Number of heading levels to add (e.g., 2 transforms ## to ####)

**Returns:** Transformed markdown with demoted headings

Demote markdown headings by adding a specified number of levels.

This is used to ensure JSDoc descriptions don't break the document hierarchy. For example, if an export is h3, its description headings should be h4+.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sections`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L204" /> {#f-sections-204}

```typescript
(...parts?: (string | false | null | undefined)[]): string
```

Join markdown sections with double newlines, filtering out empty sections.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `kebab`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L211" /> {#f-kebab-211}

```typescript
(str: string): string
```

Convert string to kebab-case.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `table`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L236" /> {#f-table-236}

```typescript
(rows: Record<string, string | null | undefined>): string
```

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
  'City': undefined  // filtered out
})
// | | |
// | - | - |
// | **Name** | Alice |
// | **Age** | 30 |
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L520" /> {#f-builder-520}

```typescript
(): Builder
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `template`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L759" /> {#c-template-759}

```typescript
Template
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Raw`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L21" /> {#i-raw-21}

```typescript
interface Raw {
  readonly __markdownFormatted: true
  readonly content: string
}
```

Branded type for markdown content that's already formatted and safe.

Use raw to create values of this type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L369" /> {#i-builder-369}

````typescript
interface Builder {
  /**
   * Add a line to the markdown via tagged template.
   * Use empty template for blank lines: `doc\`\``
   */
  (strings: TemplateStringsArray, ...values: Array<string | number | Raw | null | undefined>): Builder

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
  codeFence(code: string | null | undefined, language?: string, modifiers?: string): Builder

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
  codeGroup(tabs: Array<{ label: string; code: string; language?: string; modifiers?: string }>): Builder

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
  container(type: 'warning' | 'tip' | 'info' | 'danger', title: string, content: string): Builder

  /**
   * Build the final markdown string with whitespace normalization.
   */
  build(): string
}
````

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Template`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/md/md.ts#L689" /> {#i-template-689}

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
  (strings: TemplateStringsArray, ...values: Array<string | number | Raw | null | undefined>): string

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
  factory: <$Args extends any[]>(fn: (doc: Builder, ...args: $Args) => void) => (...args: $Args) => string

  /**
   * Markdown element helpers for generating formatted elements.
   */
  md: typeof md
}
````

Markdown template function type with builder property.
