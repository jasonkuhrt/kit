# Paka

todo

## Import

::: code-group

```typescript [Namespace]
import { Paka } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Paka from '@wollybeard/kit/paka'
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ExportLevel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L13" /> {#c-export-level-13}

```typescript
Enums<{ readonly value: "value"; readonly type: "type"; }>
```

Export level distinguishes between runtime values and type-only exports.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ValueExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L19" /> {#c-value-export-type-19}

```typescript
Enums<{ readonly function: "function"; readonly const: "const"; readonly class: "class"; readonly namespace: "namespace"; }>
```

Value export types

- exports that exist at runtime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TypeExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L32" /> {#c-type-export-type-32}

```typescript
Enums<{ readonly interface: "interface"; readonly 'type-alias': "type-alias"; readonly enum: "enum"; readonly union: "union"; readonly intersection: "intersection"; }>
```

Type export types

- exports that only exist in TypeScript's type system.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BuilderMethodCategory`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L50" /> {#c-builder-method-category-50}

```typescript
Enums<{ readonly chainable: "chainable"; readonly terminal: "terminal"; readonly transform: "transform"; }>
```

Builder method classification based on return type.

- `chainable`
- Returns the same builder type (for method chaining)
- `terminal`
- Returns void (ends the builder chain)
- `transform`
- Returns a different builder type (transforms to another builder)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Provenance`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L131" /> {#c-provenance-131}

```typescript
Union<[typeof JSDocProvenance, typeof MdFileProvenance]>
```

Union of all possible documentation provenance types.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `SignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L517" /> {#c-signature-model-517}

```typescript
Union<[typeof FunctionSignatureModel, typeof BuilderSignatureModel, typeof ClassSignatureModel, typeof TypeSignatureModel, typeof ValueSignatureModel]>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Export`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L754" /> {#c-export-754}

```typescript
Union<[typeof ValueExport, typeof TypeExport]>
```

Export is a tagged union of value and type exports.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Entrypoint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L938" /> {#c-entrypoint-938}

```typescript
Union<[typeof DrillableNamespaceEntrypoint, typeof SimpleEntrypoint]>
```

Entrypoint union

- all patterns.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `InterfaceModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L971" /> {#c-interface-model-971}

```typescript
typeof Package
```

The complete interface model output.

## Classes

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Example`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L66" /> {#class-example-66}

```typescript
class {
}
```

Code example extracted from JSDoc

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ImportExample`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L83" /> {#class-import-example-83}

```typescript
class {
}
```

Import example for documentation UI.

Non-serialized class used for rendering import tabs in documentation. Returned by Entrypoint instance methods to provide structured import examples.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `SourceLocation`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L93" /> {#class-source-location-93}

```typescript
class {
}
```

Source location for "View source" links.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `JSDocProvenance`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L108" /> {#class-jsdoc-provenance-108}

```typescript
class {
}
```

Provenance for JSDoc-sourced documentation. Tracks whether it came from a shadow namespace or regular JSDoc.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `MdFileProvenance`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L120" /> {#class-md-file-provenance-120}

```typescript
class {
}
```

Provenance for markdown file-sourced documentation. Includes file path for "Edit this page" links.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Docs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L138" /> {#class-docs-138}

```typescript
class {
}
```

Documentation content for modules and exports. Groups descriptive and guide content together.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `DocsProvenance`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L149" /> {#class-docs-provenance-149}

```typescript
class {
}
```

Provenance tracking for documentation sources. Maps each doc field (description/guide) to its source.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeParameter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L170" /> {#class-type-parameter-170}

```typescript
class {
}
```

Type parameter for generic functions/classes. Captures type parameter name, constraint, and default value.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// <T extends string = 'default'>
{ name: 'T', constraint: 'string', default: "'default'" }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Parameter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L193" /> {#class-parameter-193}

```typescript
class {
}
```

Function/method parameter. Captures parameter name, type, modifiers, and JSDoc description.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// (items: T[], fn?: (item: T) => U, ...rest: unknown[])
[
  { name: 'items', type: 'T[]', optional: false, rest: false, description: 'Array of items to process' },
  { name: 'fn', type: '(item: T) => U', optional: true, rest: false, description: 'Transform function' },
  { name: 'rest', type: 'unknown[]', optional: false, rest: true }
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `FunctionSignature`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L225" /> {#class-function-signature-225}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `FunctionSignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L257" /> {#class-function-signature-model-257}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `BuilderMethod`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L298" /> {#class-builder-method-298}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `BuilderSignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L357" /> {#class-builder-signature-model-357}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeSignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L381" /> {#class-type-signature-model-381}

```typescript
class {
}
```

Type signature model (interfaces, type aliases, etc).

For now, these are kept as plain text since parsing TypeScript type definitions into structured form is complex with diminishing returns.

Future: Could be expanded to structured form (properties, methods, etc).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ValueSignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L401" /> {#class-value-signature-model-401}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassProperty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L427" /> {#class-class-property-427}

```typescript
class {
}
```

Class property. Captures property name, type, modifiers, and JSDoc description.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// class User {
//   readonly id: string
//   name?: string
//   static count: number
// }
[
  { name: 'id', type: 'string', optional: false, readonly: true, static: false },
  { name: 'name', type: 'string', optional: true, readonly: false, static: false },
  { name: 'count', type: 'number', optional: false, readonly: false, static: true }
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassMethod`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L458" /> {#class-class-method-458}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ClassSignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L495" /> {#class-class-signature-model-495}

```typescript
class {
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Module`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L582" /> {#class-module-582}

```typescript
class {
}
```

Module schema implementation.

NOTE: Circular dependency handled via declaration merging:

- Module interface declared above provides type structure
- Module class extends S.Class
- same name enables declaration merging
- Module contains Export[] (through exports field)
- ValueExport (part of Export union) contains optional Module (through module field)
- This is intentional and handled correctly at runtime by Effect Schema via S.suspend()

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `ValueExport`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L694" /> {#class-value-export-694}

```typescript
class {

  // Properties
  static is: (u: unknown, overrideOptions?: number | ParseOptions | undefined) => u is ValueExport
}
```

Value export schema implementation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `TypeExport`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L724" /> {#class-type-export-724}

```typescript
class {

  // Properties
  static is: (u: unknown, overrideOptions?: number | ParseOptions | undefined) => u is TypeExport
}
```

Type export schema implementation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `DrillableNamespaceEntrypoint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L809" /> {#class-drillable-namespace-entrypoint-809}

```typescript
class {

  // Methods
  getImportExamples(packageName: string, breadcrumbs: string[]): ImportExample[]
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `SimpleEntrypoint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L873" /> {#class-simple-entrypoint-873}

```typescript
class {

  // Methods
  getImportExamples(packageName: string, path: string): ImportExample[]
}
```

Simple entrypoint without special import pattern.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `PackageMetadata`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L947" /> {#class-package-metadata-947}

```typescript
class {
}
```

Package metadata.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[Class]`</span> `Package`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L957" /> {#class-package-957}

```typescript
class {
}
```

Package represents the complete extracted documentation model.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Module`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L556" /> {#i-module-556}

```typescript
interface Module {
  readonly location: S.Schema.Type<typeof FsLoc.RelFile>
  readonly docs?: Docs | undefined
  readonly docsProvenance?: DocsProvenance | undefined
  readonly category?: string | undefined
  readonly exports: Export[]
}
```

Module type interface for declaration merging. Following the graphql-kit pattern for circular schemas with instance methods.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ValueExport`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L659" /> {#i-value-export-659}

```typescript
interface ValueExport {
  readonly name: string
  readonly signature: SignatureModel
  readonly signatureSimple?: SignatureModel | undefined
  readonly docs?: Docs | undefined
  readonly docsProvenance?: DocsProvenance | undefined
  readonly examples: readonly Example[]
  readonly deprecated?: string | undefined
  readonly category?: string | undefined
  readonly tags: Readonly<Record<string, string>>
  readonly sourceLocation: SourceLocation
  readonly _tag: 'value'
  readonly type: S.Schema.Type<typeof ValueExportType>
  readonly module?: Module | undefined
}
```

ValueExport type interface for declaration merging.
