# Paka

todo

# Paka Documentation Extractor

Paka is a TypeScript documentation extraction tool that generates structured API documentation from your TypeScript source code. It analyzes your codebase using `ts-morph`, extracts type information and JSDoc comments, and outputs a comprehensive interface model that can be rendered into documentation websites.

## Features

### JSDoc Tag Support

Paka extracts and processes standard JSDoc tags:

- **`@param`** - Parameter descriptions for functions and methods
- **`@returns`** - Return value descriptions
- **`@throws`** - Error conditions and exceptions
- **`@example`** - Code examples (supports multiple examples per export)
- **`@deprecated`** - Deprecation notices
- **`@category`** - Group exports by category in documentation
- **`@guide`** - Long-form usage guide (complements brief description)
- **`@internal`** - Mark exports as internal (filtered from public docs)

### Description vs Guide

Paka supports two complementary documentation fields:

- **`description`** - Brief API reference (1-3 sentences)
  - Main JSDoc summary
  - Concise, factual description of what the export does
  - Appears in listings and previews

- **`guide`** - Long-form usage guide (paragraphs)
  - Use `@guide` JSDoc tag for inline guides
  - Or use external `.md` files for longer documentation
  - Provides usage patterns, best practices, examples
  - Rendered after description in full documentation

**Example:**

```typescript
/**
 * Parse configuration from various sources.
 *
 * @guide
 * ## Usage
 *
 * The parser supports multiple input formats:
 * - JSON files
 * - YAML files
 * - Environment variables
 *
 * ## Best Practices
 *
 * Always validate the parsed config...
 */
export const parseConfig = (input: string) => {/* ... */}
```

**Markdown File Guide:**

When guide content is too large for JSDoc, use an external `.md` file. The `.md` file content becomes the `guide` field:

- **Sibling `.md` file**: `parseConfig.ts` → `parseConfig.md` (future enhancement #18)
- **Module `.md` file**: `config.ts` → `config.md` (current support)

**Precedence:**

- When both `@guide` tag and `.md` file exist, the `.md` file wins (with warning)
- Module `.md` files provide the guide for the entire module

### Documentation Patterns

#### Module-level Documentation

**External Markdown Files** (#17 - Just Implemented!)

Paka supports external markdown files for module documentation:

1. **Sibling `.md` file**: `kind.ts` → `kind.md`
2. **Directory `README.md`**: Applies to any module in that directory

Precedence: Sibling `.md` > `README.md` > JSDoc module comment

**JSDoc Module Comments**

Place a JSDoc comment at the top of your module file:

```typescript
/**
 * Higher-kinded type utilities for TypeScript.
 *
 * Provides type-level functions for simulating higher-kinded types.
 *
 * @module
 */
export type Apply<$Kind, $Args> = ...
```

#### Namespace Documentation Patterns

**TypeScript Namespace Shadow (Recommended)**

Add JSDoc to ESM namespace re-exports using a TypeScript namespace shadow:

```typescript
// @ts-expect-error Duplicate identifier
export * as Utils from './utils.js'
/**
 * Utility functions for common operations.
 *
 * @category Utilities
 */
export namespace Utils {}
```

**Why use namespace shadows?**

- ✅ **Better IDE experience**: JSDoc appears on hover for library users
- ✅ **IntelliSense support**: Documentation visible in autocomplete
- ✅ **Standard TypeScript**: Works with all TypeScript-aware tools
- ❌ Without shadow: JSDoc on `export * as` only visible to Paka, not to IDEs

The shadow's JSDoc overrides the nested module's documentation.

**Fallback Pattern (Not Recommended)**

While Paka supports JSDoc directly on `export * as` declarations, this approach provides no IDE benefits:

```typescript
/**
 * Utility functions for common operations.
 * @category Utilities
 */
export * as Utils from './utils.js' // JSDoc invisible to IDEs
```

Use this only when TypeScript namespace shadows are not feasible.

**Wrapper File Markdown** (Pure Wrapper Pattern)

For files containing ONLY a namespace export and NO other exports:

```typescript
// parent.ts - contains ONLY this export
export * as Utils from './utils.js'
```

Create `parent.md` to override the nested module's description. This is useful for namespace wrapper files like `$.ts`.

**Precedence**: TypeScript shadow > Wrapper markdown > Nested module markdown > Nested module JSDoc

### Export Filtering

**`@internal` Tag**

Mark exports as internal to exclude them from public documentation:

```typescript
/**
 * Internal helper function
 * @internal
 */
export const _internalHelper = () => {}
```

Always filtered when `filterInternal: true` (default in production).

**Underscore Prefix Convention**

Optionally filter exports starting with `_`:

```typescript
export const _privateHelper = () => {} // Filtered when filterUnderscoreExports: true
```

Enable with `filterUnderscoreExports` option (default: `false` for backward compatibility).

### Builder Pattern Detection

Mark functions with `@builder` to enable builder pattern documentation:

```typescript
/**
 * Create a test builder
 * @builder
 */
export const on = <Fn>(fn: Fn): TestBuilder<{ fn: Fn }> => ...

  interface TestBuilder<State>{
    cases(...cases: any[]): TestBuilder<State>  // chainable
  test(): void                                 // terminal
  }
```

Paka automatically crawls the returned builder type and classifies methods:

- **Chainable**: Returns same builder type
- **Terminal**: Returns void
- **Transform**: Returns different builder type

### Drillable Namespace Pattern

Support multiple import styles for the same module:

**Package.json setup:**

```json
{
  "exports": {
    ".": "./build/index.js",
    "./arr": "./build/arr/$$.js"
  }
}
```

**Source structure:**

```typescript
// src/index.ts
export * as Arr from './arr/$$.js'

// src/arr/$$.ts
export const map = ...
export const filter = ...
```

Both import styles work:

```typescript
import { Arr } from '@pkg' // Namespace import
import * as Arr from '@pkg/arr' // Direct barrel import
```

### Code Examples

**Twoslash Integration**

Examples support TypeScript's Twoslash for inline type display:

````typescript
/**
 * @example
 *
```ts
 * const result = add(1, 2)  // hover shows: const result: number
 * ```
 */
````

Disable per-example with `@twoslash-disable`:

````typescript
/**
 * @example
 *
```ts
 * // @twoslash-disable
 * const pseudocode = "not real TypeScript"
 * ```
 */
````

### Type Signature Extraction

Paka extracts structured type information:

**Functions**: Overloads, type parameters, parameters, return types
**Classes**: Constructor, properties, methods
**Types**: Interfaces, type aliases, enums
**Builders**: Entry point + chainable/terminal/transform methods

## Usage

### Extract from Files (Pure Function)

```typescript
import { Dir } from '@wollybeard/kit/dir'
import { extractFromFiles } from '@wollybeard/kit/paka'

// [!code word:spec:1]
const files = Dir.spec('/')
  .add('package.json', { name: 'my-pkg', exports: { '.': './build/index.js' } })
  .add('src/index.ts', 'export const foo = () => {}')
  .toLayout()

const model = extractFromFiles({
  files,
  filterUnderscoreExports: false, // Optional
})
```

### Extract from Filesystem

```typescript
import { extract } from '@wollybeard/kit/paka'

const model = extract({
  projectRoot: '/path/to/project',
  tsconfigPath: '/path/to/tsconfig.json', // Optional
  entrypoints: ['.', './arr'], // Optional (defaults to all)
  filterUnderscoreExports: false, // Optional
})
```

### Output

The extracted model follows the `InterfaceModel` schema:

```typescript
{
  name: 'package-name',
    version: '1.0.0',
      entrypoints: [
        {
          _tag: 'SimpleEntrypoint',
          path: '.',
          module: {
            location: 'src/index.ts',
            description: '...',
            exports: [...]
          }
        }
      ],
        metadata: {
    extractedAt: Date,
      extractorVersion: '0.1.0'
  }
}
```

## Future Enhancements

- **Export-level README** (#18): `kind.Apply.md` for individual exports
- **Structured Markdown** (#19): Heading sections map to exports
- **Package-level Extractor** (#16): `extractPackage()` with package README support
- **Frontmatter Parsing**: Extract metadata from markdown frontmatter

## Learn More

- **GitHub Issues**: [jasonkuhrt/kit#17](https://github.com/jasonkuhrt/kit/issues/17)
- **Schema Documentation**: See `src/utils/paka/schema.ts` for the complete interface model

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

| Namespace                              | Description |
| -------------------------------------- | ----------- |
| [**`Adaptors`**](/api/paka/adaptors)   | —           |
| [**`Extractor`**](/api/paka/extractor) | —           |

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ExportLevel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L13" /> {#c-export-level-13}

```typescript
Enums<{ readonly value: 'value'; readonly type: 'type' }>
```

Export level distinguishes between runtime values and type-only exports.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ValueExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L19" /> {#c-value-export-type-19}

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

Value export types

- exports that exist at runtime.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TypeExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L32" /> {#c-type-export-type-32}

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

Type export types

- exports that only exist in TypeScript's type system.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `BuilderMethodCategory`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L50" /> {#c-builder-method-category-50}

```typescript
Enums<
  {
    readonly chainable: 'chainable'
    readonly terminal: 'terminal'
    readonly transform: 'transform'
  }
>
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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExportLevel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L14" /> {#t-export-level-14}

```typescript
type ExportLevel = typeof ExportLevel.Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ValueExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L27" /> {#t-value-export-type-27}

```typescript
type ValueExportType = typeof ValueExportType.Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TypeExportType`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L41" /> {#t-type-export-type-41}

```typescript
type TypeExportType = typeof TypeExportType.Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BuilderMethodCategory`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L57" /> {#t-builder-method-category-57}

```typescript
type BuilderMethodCategory = typeof BuilderMethodCategory.Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Provenance`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L132" /> {#t-provenance-132}

```typescript
type Provenance = typeof Provenance.Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SignatureModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L524" /> {#t-signature-model-524}

```typescript
type SignatureModel = S.Schema.Type<typeof SignatureModel>
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ModuleEncoded`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L564" /> {#i-module-encoded-564}

```typescript
interface ModuleEncoded {
  readonly location: S.Schema.Encoded<typeof FsLoc.RelFile>
  readonly docs?: Docs | undefined
  readonly docsProvenance?: DocsProvenance | undefined
  readonly category?: string | undefined
  readonly exports: ExportEncoded[]
}
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `ValueExportEncoded`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L675" /> {#i-value-export-encoded-675}

```typescript
interface ValueExportEncoded {
  readonly _tag: 'value'
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
  readonly type: S.Schema.Encoded<typeof ValueExportType>
  readonly module?: ModuleEncoded | undefined
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Export`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L755" /> {#t-export-755}

```typescript
type Export = S.Schema.Type<typeof Export>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `ExportEncoded`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L756" /> {#u-export-encoded-756}

```typescript
type ExportEncoded = ValueExportEncoded | S.Schema.Encoded<typeof TypeExport>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Entrypoint`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L942" /> {#t-entrypoint-942}

```typescript
type Entrypoint = S.Schema.Type<typeof Entrypoint>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InterfaceModel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/schema.ts#L972" /> {#t-interface-model-972}

```typescript
type InterfaceModel = S.Schema.Type<typeof InterfaceModel>
```
