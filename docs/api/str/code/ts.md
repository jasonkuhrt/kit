# Str.Code.TS

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Code.TS
```

```typescript [Barrel]
import { TS } from '@wollybeard/kit/str'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `string`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L25" /> {#f-string-25}

```typescript
(str: string): string
```

Quote a string value for TypeScript code.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:string:1]
Str.Code.TS.string('hello')
// '"hello"'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `list`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L36" /> {#f-list-36}

```typescript
(items: string[]): string
```

Generate an array literal.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:list:1]
Str.Code.TS.list(['a', 'b', 'c'])
// '[a, b, c]'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `block`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L47" /> {#f-block-47}

```typescript
(content: string): string
```

Wrap content in curly braces.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:block:1]
Str.Code.TS.block('a: string')
// '{\na: string\n}'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `object`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L58" /> {#f-object-58}

```typescript
(entries: readonly (readonly [string, string])[]): string
```

Generate an object literal from entries.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:object:1]
Str.Code.TS.object([['name', '"Alice"'], ['age', '30']])
// '{\nname: "Alice",\nage: 30\n}'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `typeAlias`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L84" /> {#f-type-alias-84}

```typescript
(name: string, type: string): string
```

**Parameters:**

- `name` - Type name
- `type` - Type expression

**Returns:** Type alias declaration

Generate a type alias.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:typeAlias:1]
Str.Code.TS.typeAlias('UserId', 'string')
// 'type UserId = string'

// [!code word:typeAlias:1]
Str.Code.TS.typeAlias('Point', '{ x: number; y: number }')
// 'type Point = { x: number; y: number }'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `typeAliasWithOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L136" /> {#f-type-alias-with-options-136}

```typescript
(options: TypeAliasOptions): string
```

Generate a type alias with optional JSDoc and type parameters.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:typeAliasWithOptions:1]
Str.Code.TS.typeAliasWithOptions({
  name: 'Result',
  type: 'T | Error',
  parameters: ['T'],
  tsDoc: 'A result that may be successful or an error',
  export: true,
})
// /**
//  * A result that may be successful or an error
//  *\/
// export type Result<T> = T | Error
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `interfaceDecl`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L207" /> {#f-interface-decl-207}

```typescript
(options: InterfaceOptions): string
```

Generate an interface declaration.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:interfaceDecl:1]
Str.Code.TS.interfaceDecl({
  name: 'User',
  block: 'id: string\nname: string',
  tsDoc: 'Represents a user',
  export: true,
})
// /**
//  * Represents a user
//  *\/
// export interface User {
//   id: string
//   name: string
// }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `exportDecl`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L239" /> {#f-export-decl-239}

```typescript
(declaration: string): string
```

Generate an export declaration.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:exportDecl:1]
Str.Code.TS.exportDecl('const foo = 1')
// 'export const foo = 1'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reexportAll`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L255" /> {#f-reexport-all-255}

```typescript
(input: { from: string; type?: boolean; }): string
```

Re-export all exports from a module.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:reexportAll:1]
Str.Code.TS.reexportAll({ from: './path' })
// 'export * from './path''

// [!code word:reexportAll:1]
Str.Code.TS.reexportAll({ from: './path', type: true })
// 'export type * from './path''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reexportNamespace`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L275" /> {#f-reexport-namespace-275}

```typescript
(input: { as: string; from: string; type?: boolean; }): string
```

Re-export all exports as a namespace.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:reexportNamespace:1]
Str.Code.TS.reexportNamespace({ as: 'Name', from: './path' })
// 'export * as Name from './path''

// [!code word:reexportNamespace:1]
Str.Code.TS.reexportNamespace({ as: 'Name', from: './path', type: true })
// 'export type * as Name from './path''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reexportNamed`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L303" /> {#f-reexport-named-303}

```typescript
(input: { names: string | string[] | Record<string, string>; from: string; type?: boolean; }): string
```

Re-export named exports from a module. Supports simple names, arrays, and aliased names.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// export { Name } from './path'
// [!code word:reexportNamed:1]
Str.Code.TS.reexportNamed({ names: 'Name', from: './path' })

// export { a, b, c } from './path'
// [!code word:reexportNamed:1]
Str.Code.TS.reexportNamed({ names: ['a', 'b', 'c'], from: './path' })

// export { oldName as newName } from './path'
// [!code word:reexportNamed:1]
Str.Code.TS.reexportNamed({ names: { oldName: 'newName' }, from: './path' })

// export type { Name } from './path'
// [!code word:reexportNamed:1]
Str.Code.TS.reexportNamed({ names: 'Name', from: './path', type: true })
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `importAll`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L341" /> {#f-import-all-341}

```typescript
(input: { as: string; from: string; type?: boolean; }): string
```

Import all exports as a namespace.

**Examples:**

```typescript twoslash
// @noErrors
// [!code word:importAll:1]
Str.Code.TS.importAll({ as: 'Name', from: './path' })
// 'import * as Name from './path''

// [!code word:importAll:1]
Str.Code.TS.importAll({ as: 'Name', from: './path', type: true })
// 'import type * as Name from './path''
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `importNamed`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L369" /> {#f-import-named-369}

```typescript
(input: { names: string | string[] | Record<string, string>; from: string; type?: boolean; }): string
```

Import named exports from a module. Supports simple names, arrays, and aliased names.

**Examples:**

```typescript twoslash
// @noErrors
// import { Name } from './path'
// [!code word:importNamed:1]
Str.Code.TS.importNamed({ names: 'Name', from: './path' })

// import { a, b, c } from './path'
// [!code word:importNamed:1]
Str.Code.TS.importNamed({ names: ['a', 'b', 'c'], from: './path' })

// import { oldName as newName } from './path'
// [!code word:importNamed:1]
Str.Code.TS.importNamed({ names: { oldName: 'newName' }, from: './path' })

// import type { Name } from './path'
// [!code word:importNamed:1]
Str.Code.TS.importNamed({ names: 'Name', from: './path', type: true })
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `TypeAliasOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L91" /> {#i-type-alias-options-91}

```typescript
interface TypeAliasOptions {
  /**
   * Type name
   */
  name: string

  /**
   * Type expression
   */
  type: string

  /**
   * Optional JSDoc comment content (will be formatted automatically)
   */
  tsDoc?: string | null

  /**
   * Optional type parameters (e.g., `['T', 'U extends string']`)
   */
  parameters?: string[] | null

  /**
   * Whether to export the type (default: true)
   */
  export?: boolean
}
```

Options for generating a type alias with metadata.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `InterfaceOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/code/ts/ts.ts#L155" /> {#i-interface-options-155}

```typescript
interface InterfaceOptions {
  /**
   * Interface name
   */
  name: string

  /**
   * Interface body (fields)
   */
  block?: string

  /**
   * Optional JSDoc comment content (will be formatted automatically)
   */
  tsDoc?: string | null

  /**
   * Optional type parameters (e.g., `['T', 'U extends string']`)
   */
  parameters?: string[] | null

  /**
   * Optional extends clause (e.g., `['Base', 'Mixin']`)
   */
  extends?: string[] | null

  /**
   * Whether to export the interface (default: true)
   */
  export?: boolean
}
```

Options for generating an interface.
