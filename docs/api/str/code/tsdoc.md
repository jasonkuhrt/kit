# Str.Code.TSDoc

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Code.TSDoc
```

```typescript [Barrel]
import { TSDoc } from '@wollybeard/kit/str'
```

:::

## Namespaces

| Namespace                            | Description                   |
| ------------------------------------ | ----------------------------- |
| [**`tag`**](/api/str/code/tsdoc/tag) | Structured JSDoc tag helpers. |

These helpers generate properly formatted JSDoc tags with automatic escaping. All helpers return `Raw` (safe for injection) or `null` for graceful handling. |

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `escape`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L36" /> {#f-escape-36}

```typescript
(content: string | null | undefined): string | null
```

**Parameters:**

- `content` - User-provided text (e.g., GraphQL descriptions)

**Returns:** Escaped content safe for JSDoc, or null if input was null/undefined

Escape user-provided content for safe inclusion in JSDoc comments.

Escapes characters that could break JSDoc syntax:

- `*\/`
- Ends the JSDoc comment prematurely
- `@tag` at line start
- Could be interpreted as JSDoc tags

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:escape:1]
Str.Code.TSDoc.escape('Hello * / World')
// 'Hello * / World'

// [!code word:escape:1]
Str.Code.TSDoc.escape('@deprecated use new API')
// '\\@deprecated use new API'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `format`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L74" /> {#f-format-74}

```typescript
(content: string | null): string
```

**Parameters:**

- `content` - Content to format as JSDoc

**Returns:** Formatted JSDoc comment block

Format content as JSDoc comment block.

Takes text content and wraps it in JSDoc syntax with proper indentation. Lines are trimmed and prefixed with JSDoc comment markers. Returns empty string if content is null.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:format:1]
Str.Code.TSDoc.format('Hello\nWorld')
// /**
//  * Hello
//  * World
//  *\/

// [!code word:format:1]
Str.Code.TSDoc.format('Single line')
// /**
//  * Single line
//  *\/
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `raw`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L116" /> {#f-raw-116}

```typescript
(content: string): Raw
```

Mark content as safe for JSDoc (already escaped or intentionally raw).

Use this for JSDoc tags, links, and other special syntax that should NOT be escaped.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Link will not be escaped
// [!code word:raw:1]
const link = Str.Code.TSDoc.raw(`{@link MyType}`)
const doc = tag\`Type: ${link}\`

// Pre-escaped content
const escaped = escape(userInput)
const safe = Str.Code.TSDoc.raw(escaped)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L425" /> {#f-builder-425}

```typescript
(): Builder
```

Create a new JSDoc builder for imperative construction.

Perfect for JSDoc generation with conditionals, loops, and complex logic.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:builder:1]
const doc = Str.Code.TSDoc.builder()

doc\`Access to ${typeLink} root methods.\`
doc\`\`  // empty line

if (showExample) {
  doc.$example('Basic usage', 'ts')\`
    const result = await api.query()
  \`
}

doc.$deprecated\`Use newMethod() instead\`

return doc.build()
```

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `template`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L700" /> {#c-template-700}

```typescript
Template
```

Tagged template for building JSDoc content with automatic escaping. Also provides `.builder()` for imperative JSDoc construction and `.tag` for tag helpers.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Template mode with auto-escaping
const doc = tag\`
  Main description here

// [!code word:deprecated:1]
  ${tag.deprecated('Use newMethod()')}
// [!code word:see:1]
  ${tag.see('https://example.com', 'Documentation')}
\`

// Builder mode for complex logic
const doc = tag.builder()
doc\`Main description\`
if (hasExample) {
  doc.$example('Usage', 'ts')\`const x = 1\`
}
return doc.build()
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Raw`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L95" /> {#i-raw-95}

```typescript
interface Raw {
  readonly __jsDocSafe: true
  readonly content: string
}
```

Branded type for content marked as safe for JSDoc injection.

Use raw to create values of this type. This prevents accidental injection of unescaped user content.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Builder`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L271" /> {#i-builder-271}

````typescript
interface Builder {
  /**
   * Add a line to the JSDoc. Automatically escapes user content.
   * Use empty template for blank lines: `doc\`\``
   */
  (strings: TemplateStringsArray, ...values: Array<string | number | Raw | null | undefined>): Builder

/**
 * Add content with auto-escaping. Skips if null/undefined.
 * Perfect for chaining with optional content.
 * @example
 * 
```ts
   * doc
   *   .add(field.description)  // skips if null/undefined
   *   .add('# Info')
   * ```
   */
  add(content: string | null | undefined): Builder

  /**
   * Add raw content without escaping. Skips if null/undefined.
   * Use for pre-escaped content or JSDoc syntax.
   * @example
   * ```ts
   * doc.addRaw(sdlSignature)  // skips if null/undefined
   * ```
   */
  addRaw(content: string | null | undefined): Builder

  /**
   * Add a blank line.
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
   * Add a markdown table from key-value pairs.
   * Automatically filters out undefined/null/empty-array values.
   *
   * **Value handling:**
   * - Raw values (from Md.code(), tag.link(), etc.): Used directly, already safe
   * - Plain strings: Automatically escaped for JSDoc safety
   * - Arrays: Items joined with `, ` (each item handled by type)
   * - Empty arrays: Treated as undefined (filtered out)
   *
   * Returns builder for chaining.
   *
   * @example
   * ```ts
   * doc.table({
   *   'Type': Md.code('string'),
   *   'Parent': tag.link('ParentType'),
   *   'Implements': interfaces.map(i => tag.link(i.name)),  // auto-joined
   *   'Description': userDescription  // auto-escaped
   * })
   * ```
   */
  table(rows: Record<string, string | Raw | Array<string | Raw> | undefined | null>): Builder

  /**
   * Add a markdown code block with language syntax highlighting.
   * Skips if content is null/undefined.
   * @example
   * ```ts
   * doc.codeblock('graphql', \`
   *   type User {
   *     id: ID!
   *   }
   * \`)
   * ```
   */
  codeblock(lang: string, content: string | null | undefined): Builder

  /**
   * Add `@deprecated` tag with escaped reason.
   * Returns builder for chaining. Skips if reason is null/undefined.
   */
  $deprecated(reason: string | null | undefined): Builder

  /**
   * Add `@example` tag with code block.
   *
   * **Two modes:**
   * - Template mode (2 params): Returns template function for code content
   * - Direct mode (3 params): Accepts code string directly and returns builder
   *
   * @example
   * ```ts
   * // Template mode
   * doc.$example('Basic usage', 'ts')\`
   *   const result = await api.query()
   * \`
   *
   * // Direct mode
   * const code = 'const x = 1'
   * doc.$example('Basic usage', 'ts', code)
   * ```
   */
  $example(label?: string, lang?: string): (strings: TemplateStringsArray, ...values: any[]) => Builder
  $example(label: string | undefined, lang: string, code: string): Builder

  /**
   * Add `@see` tag with link.
   * Returns builder for chaining.
   */
  $see(url: string, text?: string): Builder

  /**
   * Generate inline `{@link}` reference for embedding in templates.
   * Returns Raw (not the builder).
   */
  $link(url: string, text?: string): Raw

  /**
   * Add `@remarks` tag with content from template literal.
   * Returns builder for chaining. Skips if content is empty.
   */
  $remarks(strings: TemplateStringsArray, ...values: any[]): Builder

  /**
   * Build the final JSDoc string with whitespace normalization.
   */
  build(): string
}
````

JSDoc builder interface for imperative JSDoc construction.

Provides a fluent API for building JSDoc with conditionals, loops, and tag helpers.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const doc = builder()

doc\`Main description\`
doc\`\`  // blank line

if (isDeprecated) {
  doc.$deprecated('Use newMethod()')
}

doc.table({ 'Type': 'string', 'Required': 'Yes' })

return doc.build()
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Template`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/tsdoc/tsdoc.ts#L618" /> {#i-template-618}

````typescript
interface Template {
/**
 * Tagged template for building JSDoc content with automatic escaping.
 *
 * By default, interpolated values are escaped to prevent JSDoc injection.
 * Use {@link raw} to inject pre-escaped or intentionally raw content.
 *
 * @example
 * 
```ts
   * // User content is automatically escaped
   * const doc = tag\`
   *   ${field.description}
   *
   *   @deprecated ${field.deprecationReason}
   * \`
   *
   * // Use raw for links and tags
   * const link = raw(\`{@link User}\`)
   * const doc = tag\`
   *   Field type: ${link}
   *   Description: ${field.description}
   * \`
   * ```
   */
  (strings: TemplateStringsArray, ...values: Array<string | number | Raw | null | undefined>): string

  /**
   * Create a new JSDoc builder for imperative construction.
   * Perfect for JSDoc generation with conditionals, loops, and complex logic.
   */
  builder: typeof builder

  /**
   * Create a JSDoc generator function from a builder callback.
   * Automatically calls `.build()` and returns the result.
   *
   * @example
   * ```ts
   * export const getFieldDoc = factory<[field: Field, parentType: Type]>((doc, field, parentType) => {
   *   const typeLink = tag.link(field.type.name)
   *
   *   doc\`Selection set for ${typeLink}.\`
   *   doc\`\`
   *   doc.add(field.description)
   *   doc\`\`
   *   doc.table({ 'Type': \`${field.type.name}\` })
   * })
   *
   * // Usage: getFieldDoc(field, parentType) -> string
   * ```
   */
  factory: <$Args extends any[]>(fn: (doc: Builder, ...args: $Args) => void) => (...args: $Args) => string

  /**
   * JSDoc tag helpers for generating properly formatted tags.
   */
  tag: typeof tag
}
````

JSDoc template function type with builder property.
