# Paka.Exports

_Paka_ / **Exports**

## Import

::: code-group

```typescript [Namespace]
import { Paka } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Paka from '@wollybeard/kit/paka'
```

:::

## Namespaces

- [**`Adaptors`**](/api/paka/adaptors)
- [**`Extractor`**](/api/paka/extractor)

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ExportLevel`

```typescript
Enums<{ readonly value: 'value'; readonly type: 'type' }>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L11" />

Export level distinguishes between runtime values and type-only exports.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ValueExportType`

```typescript
Enums<
  {
    readonly function: 'function'
    readonly const: 'const'
    readonly class: 'class'
    readonly namespace: 'namespace'
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L17" />

Value export types

- exports that exist at runtime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TypeExportType`

```typescript
Enums<
  {
    readonly interface: 'interface'
    readonly 'type-alias': 'type-alias'
    readonly enum: 'enum'
    readonly union: 'union'
    readonly intersection: 'intersection'
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L30" />

Type export types

- exports that only exist in TypeScript's type system.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BuilderMethodCategory`

```typescript
Enums<
  {
    readonly chainable: 'chainable'
    readonly terminal: 'terminal'
    readonly transform: 'transform'
  }
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L48" />

Builder method classification based on return type.

- `chainable`
- Returns the same builder type (for method chaining)
- `terminal`
- Returns void (ends the builder chain)
- `transform`
- Returns a different builder type (transforms to another builder)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Provenance`

```typescript
Union<[typeof JSDocProvenance, typeof MdFileProvenance]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L116" />

Union of all possible documentation provenance types.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SignatureModel`

```typescript
Union<
  [
    typeof FunctionSignatureModel,
    typeof BuilderSignatureModel,
    typeof ClassSignatureModel,
    typeof TypeSignatureModel,
    typeof ValueSignatureModel,
  ]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L502" />

Signature model

- tagged union of all signature types.

Discriminated by _tag field:

- `FunctionSignatureModel`
- Functions with structured overloads
- `BuilderSignatureModel`
- Builder pattern APIs with chainable/terminal methods
- `ClassSignatureModel`
- Classes with constructor, properties, methods
- `TypeSignatureModel`
- Types, interfaces, type aliases (text)
- `ValueSignatureModel`
- Const values (type as text)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Module`

```typescript
Schema<Module, ModuleEncoded, never>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L568" />

Module schema

- uses suspend for circular reference with ValueExport.

NOTE: The `as any` assertions are required here due to circular dependency:

- Module contains Export[] (through exports field)
- ValueExport (part of Export union) contains optional Module (through module field)

Effect Schema's S.suspend handles this at runtime, but TypeScript needs help with the circular type reference. The interface definitions above ensure type safety for consumers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Export`

```typescript
Union<[typeof ValueExport, typeof TypeExport]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L615" />

Export is a tagged union of value and type exports.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Entrypoint`

```typescript
Union<[typeof DrillableNamespaceEntrypoint, typeof SimpleEntrypoint]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L701" />

Entrypoint union

- all patterns.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `InterfaceModel`

```typescript
typeof Package
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L734" />

The complete interface model output.

## Classes

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Example`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L64" />

Code example extracted from JSDoc

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `SourceLocation`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L78" />

Source location for "View source" links.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `JSDocProvenance`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L93" />

Provenance for JSDoc-sourced documentation. Tracks whether it came from a shadow namespace or regular JSDoc.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `MdFileProvenance`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L105" />

Provenance for markdown file-sourced documentation. Includes file path for "Edit this page" links.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Docs`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L123" />

Documentation content for modules and exports. Groups descriptive and guide content together.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `DocsProvenance`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L134" />

Provenance tracking for documentation sources. Maps each doc field (description/guide) to its source.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeParameter`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L155" />

Type parameter for generic functions/classes. Captures type parameter name, constraint, and default value.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// <T extends string = 'default'>
{ name: 'T', constraint: 'string', default: "'default'" }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Parameter`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L178" />

Function/method parameter. Captures parameter name, type, modifiers, and JSDoc description.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka' // ---cut---
 // (items: T[], fn?: (item: T) => U, ...rest: unknown[])
;[
  {
    name: 'items',
    type: 'T[]',
    optional: false,
    rest: false,
    description: 'Array of items to process',
  },
  {
    name: 'fn',
    type: '(item: T) => U',
    optional: true,
    rest: false,
    description: 'Transform function',
  },
  { name: 'rest', type: 'unknown[]', optional: false, rest: true },
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `FunctionSignature`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L210" />

Single function signature (one overload). Captures type parameters, parameters, return type, and JSDoc documentation.

Used within FunctionSignatureModel to support multiple overloads.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
{
  typeParameters: [{ name: 'T', constraint: 'string' }],
    parameters: [{ name: 'value', type: 'T', description: 'Input value' }],
      returnType: 'T',
        returnDoc: 'The processed value',
          throws: ['Error if value is invalid']
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `FunctionSignatureModel`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L242" />

Function signature model supporting multiple overloads.

Structured representation of function signatures with full parameter, type parameter, and return type information.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// function parse(input: string): Config
// function parse(input: Buffer): Config
{
  _tag: 'FunctionSignatureModel',
    overloads: [
      { typeParameters: [], parameters: [{ name: 'input', type: 'string', ... }], returnType: 'Config' },
      { typeParameters: [], parameters: [{ name: 'input', type: 'Buffer', ... }], returnType: 'Config' }
    ]
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `BuilderMethod`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L283" />

Builder method on a builder interface.

Captures method name, overloads, and classification based on return type. Methods are classified during extraction by analyzing their return types.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// inputType<I>(): TestBuilder<State & { input: I }>
{
  name: 'inputType',
    overloads: [...],
      category: 'chainable',
        transformsTo: undefined
}

// test(): void
{
  name: 'test',
    overloads: [...],
      category: 'terminal',
        transformsTo: undefined
}

// layer<R>(layer: any): OtherBuilder<State, R>
{
  name: 'layer',
    overloads: [...],
      category: 'transform',
        transformsTo: 'OtherBuilder'
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `BuilderSignatureModel`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L342" />

Builder signature model for fluent/builder pattern APIs.

Builder patterns are detected when a function is marked with `@builder` JSDoc tag. The extractor automatically crawls the returned builder type interface and classifies methods based on their return types:

- **Chainable**: Returns the same builder type (enables method chaining)
- **Terminal**: Returns void (ends the builder chain)
- **Transform**: Returns a different builder type (transforms to another builder)

**Examples:**

Extracted as:

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
{
  _tag: 'BuilderSignatureModel',
    typeName: 'TestBuilder',
      entryPoint: FunctionSignature { ... },
  chainableMethods: [
    { name: 'inputType', category: 'chainable', ... },
    { name: 'cases', category: 'chainable', ... }
  ],
    terminalMethods: [
      { name: 'test', category: 'terminal', overloads: [...2 overloads] }
    ],
      transformMethods: [
        { name: 'layer', category: 'transform', transformsTo: 'OtherBuilder', ... }
      ]
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeSignatureModel`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L366" />

Type signature model (interfaces, type aliases, etc).

For now, these are kept as plain text since parsing TypeScript type definitions into structured form is complex with diminishing returns.

Future: Could be expanded to structured form (properties, methods, etc).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ValueSignatureModel`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L386" />

Value signature model (simple const values, primitives).

Used for exports that are simple constant values (not functions/classes). Stores the inferred type as text.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// export const PI = 3.14159
{ _tag: 'ValueSignatureModel', type: 'number' }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassProperty`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L412" />

Class property. Captures property name, type, modifiers, and JSDoc description.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka' // ---cut---
 // class User {
//   readonly id: string
//   name?: string
//   static count: number
// }
;[
  {
    name: 'id',
    type: 'string',
    optional: false,
    readonly: true,
    static: false,
  },
  {
    name: 'name',
    type: 'string',
    optional: true,
    readonly: false,
    static: false,
  },
  {
    name: 'count',
    type: 'number',
    optional: false,
    readonly: false,
    static: true,
  },
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassMethod`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L443" />

Class method. Captures method name, overloads, and modifiers.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// class User {
//   getName(): string
//   static create(name: string): User
// }
[
  { name: 'getName', overloads: [...], static: false },
  { name: 'create', overloads: [...], static: true }
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassSignatureModel`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L480" />

Class signature model with structured class information.

Structured representation of class with constructor, properties, and methods.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// export class User {
//   readonly id: string
//   name: string
//   constructor(id: string, name: string) { ... }
//   getName(): string { return this.name }
//   static create(name: string): User { return new User(crypto.randomUUID(), name) }
// }
{
  _tag: 'ClassSignatureModel',
    ctor: { typeParameters: [], parameters: [...], returnType: 'User' },
  properties: [
    { name: 'id', type: 'string', readonly: true, ... },
    { name: 'name', type: 'string', readonly: false, ... }
  ],
    methods: [
      { name: 'getName', overloads: [...], static: false },
      { name: 'create', overloads: [...], static: true }
    ]
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ValueExport`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L595" />

Value export

- represents a runtime export. Namespace exports include a nested module.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeExport`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L606" />

Type export

- represents a type-only export.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `DrillableNamespaceEntrypoint`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L669" />

Drillable Namespace Pattern entrypoint.

This pattern is detected ONLY for the main entrypoint ('.') when ALL conditions are met:

1. The main entrypoint source file contains a namespace export: `export * as Name from './path'` 2. The namespace name (PascalCase, e.g., `A`) converts to kebab-case (e.g., `a`) 3. A subpath export exists in package.json with that kebab name (e.g., `./a`) 4. The file that the namespace export points to 5. AND the file that the subpath export points to 6. Must resolve to the SAME source file

When detected, this enables two import forms:

- `import { Name } from 'package'`
- imports the namespace from main entrypoint
- `import * as Name from 'package/kebab-name'`
- imports the barrel directly

**Examples:**

Both the namespace export and the subpath export resolve to `src/a.ts` → Drillable!

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// package.json
{
  "exports": {
    ".": "./build/index.js",
      "./a": "./build/a.js"
  }
}

// src/index.ts (main entrypoint)
export * as A from './a.js'

// src/a.ts (barrel implementation)
export const foo = () => { }
```

Non-drillable case - different files

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// package.json
{
  "exports": {
    ".": "./build/index.js",
      "./a": "./build/a.js"
  }
}

// src/index.ts
export * as A from './z.js'  // ← Points to z.js, not a.js

// Namespace points to src/z.ts, subpath points to src/a.ts → NOT drillable (different files)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `SimpleEntrypoint`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L684" />

Simple entrypoint without special import pattern.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `PackageMetadata`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L710" />

Package metadata.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Package`

```typescript
class {
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L720" />

Package represents the complete extracted documentation model.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExportLevel`

```typescript
type ExportLevel = typeof ExportLevel.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L12" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ValueExportType`

```typescript
type ValueExportType = typeof ValueExportType.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L25" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TypeExportType`

```typescript
type TypeExportType = typeof TypeExportType.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L39" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BuilderMethodCategory`

```typescript
type BuilderMethodCategory = typeof BuilderMethodCategory.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L55" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Provenance`

```typescript
type Provenance = typeof Provenance.Type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L117" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SignatureModel`

```typescript
type SignatureModel = S.Schema.Type<typeof SignatureModel>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L509" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Module`

```typescript
interface Module {
  readonly location: typeof FsLoc.RelFile.Type
  readonly docs?: typeof Docs.Type
  readonly docsProvenance?: typeof DocsProvenance.Type
  readonly description: string
  readonly descriptionSource?: 'jsdoc' | 'md-file'
  readonly category?: string
  readonly exports: ReadonlyArray<Export>
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L542" />

Module type definition.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ModuleEncoded`

```typescript
interface ModuleEncoded extends Module {}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L555" />

Module encoded type (same as Module since no transformations).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Export`

```typescript
type Export = S.Schema.Type<typeof Export>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L616" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Entrypoint`

```typescript
type Entrypoint = S.Schema.Type<typeof Entrypoint>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L705" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InterfaceModel`

```typescript
type InterfaceModel = S.Schema.Type<typeof InterfaceModel>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L735" />
