import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'

// ============================================================================
// Enums
// ============================================================================

/**
 * Export level distinguishes between runtime values and type-only exports.
 */
export const ExportLevel = S.Enums({ value: 'value', type: 'type' } as const)
export type ExportLevel = typeof ExportLevel.Type

/**
 * Value export types - exports that exist at runtime.
 */
export const ValueExportType = S.Enums(
  {
    function: 'function',
    const: 'const',
    class: 'class',
    namespace: 'namespace',
  } as const,
)
export type ValueExportType = typeof ValueExportType.Type

/**
 * Type export types - exports that only exist in TypeScript's type system.
 */
export const TypeExportType = S.Enums(
  {
    interface: 'interface',
    'type-alias': 'type-alias',
    enum: 'enum',
    union: 'union',
    intersection: 'intersection',
  } as const,
)
export type TypeExportType = typeof TypeExportType.Type

/**
 * Builder method classification based on return type.
 *
 * - `chainable` - Returns the same builder type (for method chaining)
 * - `terminal` - Returns void (ends the builder chain)
 * - `transform` - Returns a different builder type (transforms to another builder)
 */
export const BuilderMethodCategory = S.Enums(
  {
    chainable: 'chainable',
    terminal: 'terminal',
    transform: 'transform',
  } as const,
)
export type BuilderMethodCategory = typeof BuilderMethodCategory.Type

// ============================================================================
// Core Models
// ============================================================================

/**
 * Code example extracted from JSDoc @example tags.
 */
export class Example extends S.Class<Example>('Example')({
  /** The source code of the example */
  code: S.String,
  /** Optional title from @example annotation */
  title: S.optional(S.String),
  /** Whether to enable Twoslash type hover (default: true, opt-out via @twoslash-disable) */
  twoslashEnabled: S.Boolean,
  /** Programming language for syntax highlighting */
  language: S.String,
}) {}

/**
 * Source location for "View source" links.
 */
export class SourceLocation extends S.Class<SourceLocation>('SourceLocation')({
  /** Relative file path from project root - portable across systems */
  file: FsLoc.RelFile,
  /** Line number where the export is defined */
  line: S.Number,
}) {}

// ============================================================================
// Signature Models
// ============================================================================

/**
 * Type parameter for generic functions/classes.
 * Captures type parameter name, constraint, and default value.
 *
 * @example
 * ```typescript
 * // <T extends string = 'default'>
 * { name: 'T', constraint: 'string', default: "'default'" }
 * ```
 */
export class TypeParameter extends S.Class<TypeParameter>('TypeParameter')({
  /** Type parameter name (e.g., 'T', 'U', 'Result') */
  name: S.String,
  /** Optional constraint (e.g., 'extends string') */
  constraint: S.optional(S.String),
  /** Optional default value (e.g., '= unknown') */
  default: S.optional(S.String),
}) {}

/**
 * Function/method parameter.
 * Captures parameter name, type, modifiers, and JSDoc description.
 *
 * @example
 * ```typescript
 * // (items: T[], fn?: (item: T) => U, ...rest: unknown[])
 * [
 *   { name: 'items', type: 'T[]', optional: false, rest: false, description: 'Array of items to process' },
 *   { name: 'fn', type: '(item: T) => U', optional: true, rest: false, description: 'Transform function' },
 *   { name: 'rest', type: 'unknown[]', optional: false, rest: true }
 * ]
 * ```
 */
export class Parameter extends S.Class<Parameter>('Parameter')({
  /** Parameter name */
  name: S.String,
  /** Parameter type (as string) */
  type: S.String,
  /** Whether parameter is optional (foo?: T) */
  optional: S.Boolean,
  /** Whether parameter is rest (...args: T[]) */
  rest: S.Boolean,
  /** Optional default value expression */
  defaultValue: S.optional(S.String),
  /** Parameter description from @param JSDoc tag */
  description: S.optional(S.String),
}) {}

/**
 * Single function signature (one overload).
 * Captures type parameters, parameters, return type, and JSDoc documentation.
 *
 * Used within FunctionSignatureModel to support multiple overloads.
 *
 * @example
 * ```typescript
 * {
 *   typeParameters: [{ name: 'T', constraint: 'string' }],
 *   parameters: [{ name: 'value', type: 'T', description: 'Input value' }],
 *   returnType: 'T',
 *   returnDoc: 'The processed value',
 *   throws: ['Error if value is invalid']
 * }
 * ```
 */
export class FunctionSignature extends S.Class<FunctionSignature>('FunctionSignature')({
  /** Generic type parameters */
  typeParameters: S.Array(TypeParameter),
  /** Function parameters */
  parameters: S.Array(Parameter),
  /** Return type (as string) */
  returnType: S.String,
  /** Return value description from @returns JSDoc tag */
  returnDoc: S.optional(S.String),
  /** Error descriptions from @throws JSDoc tags */
  throws: S.Array(S.String),
}) {}

/**
 * Function signature model supporting multiple overloads.
 *
 * Structured representation of function signatures with full parameter,
 * type parameter, and return type information.
 *
 * @example
 * ```typescript
 * // function parse(input: string): Config
 * // function parse(input: Buffer): Config
 * {
 *   _tag: 'FunctionSignatureModel',
 *   overloads: [
 *     { typeParameters: [], parameters: [{ name: 'input', type: 'string', ... }], returnType: 'Config' },
 *     { typeParameters: [], parameters: [{ name: 'input', type: 'Buffer', ... }], returnType: 'Config' }
 *   ]
 * }
 * ```
 */
export class FunctionSignatureModel extends S.TaggedClass<FunctionSignatureModel>()(
  'FunctionSignatureModel',
  {
    /** Function overloads (multiple signatures for same function) */
    overloads: S.Array(FunctionSignature),
  },
) {}

/**
 * Builder method on a builder interface.
 *
 * Captures method name, overloads, and classification based on return type.
 * Methods are classified during extraction by analyzing their return types.
 *
 * @example
 * ```typescript
 * // inputType<I>(): TestBuilder<State & { input: I }>
 * {
 *   name: 'inputType',
 *   overloads: [...],
 *   category: 'chainable',
 *   transformsTo: undefined
 * }
 *
 * // test(): void
 * {
 *   name: 'test',
 *   overloads: [...],
 *   category: 'terminal',
 *   transformsTo: undefined
 * }
 *
 * // layer<R>(layer: any): OtherBuilder<State, R>
 * {
 *   name: 'layer',
 *   overloads: [...],
 *   category: 'transform',
 *   transformsTo: 'OtherBuilder'
 * }
 * ```
 */
export class BuilderMethod extends S.Class<BuilderMethod>('BuilderMethod')({
  /** Method name */
  name: S.String,
  /** Method overloads (same structure as function overloads) */
  overloads: S.Array(FunctionSignature),
  /** Method classification based on return type */
  category: BuilderMethodCategory,
  /** For transform methods, the name of the returned builder type */
  transformsTo: S.optional(S.String),
}) {}

/**
 * Builder signature model for fluent/builder pattern APIs.
 *
 * Builder patterns are detected when a function is marked with `@builder` JSDoc tag.
 * The extractor automatically crawls the returned builder type interface and
 * classifies methods based on their return types:
 *
 * - **Chainable**: Returns the same builder type (enables method chaining)
 * - **Terminal**: Returns void (ends the builder chain)
 * - **Transform**: Returns a different builder type (transforms to another builder)
 *
 * @example
 * ```typescript
 * // Entry point marked with @builder
 * // @builder
 * export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
 *   return null as any
 * }
 *
 * // Builder interface (automatically crawled)
 * interface TestBuilder<State> {
 *   inputType<I>(): TestBuilder<State & { input: I }>  // chainable
 *   cases(...cases: any[]): TestBuilder<State>         // chainable
 *   test(): void                                        // terminal
 *   test(fn: (params: any) => void): void             // terminal (overload)
 *   layer<R>(layer: any): OtherBuilder<State, R>      // transform
 * }
 * ```
 *
 * Extracted as:
 * ```typescript
 * {
 *   _tag: 'BuilderSignatureModel',
 *   typeName: 'TestBuilder',
 *   entryPoint: FunctionSignature { ... },
 *   chainableMethods: [
 *     { name: 'inputType', category: 'chainable', ... },
 *     { name: 'cases', category: 'chainable', ... }
 *   ],
 *   terminalMethods: [
 *     { name: 'test', category: 'terminal', overloads: [...2 overloads] }
 *   ],
 *   transformMethods: [
 *     { name: 'layer', category: 'transform', transformsTo: 'OtherBuilder', ... }
 *   ]
 * }
 * ```
 */
export class BuilderSignatureModel extends S.TaggedClass<BuilderSignatureModel>()(
  'BuilderSignatureModel',
  {
    /** The builder type name (e.g., "TestBuilder") */
    typeName: S.String,
    /** Entry point signature (the function marked with @builder) */
    entryPoint: FunctionSignature,
    /** Methods that return the same builder (for chaining) */
    chainableMethods: S.Array(BuilderMethod),
    /** Methods that end the chain (return void) */
    terminalMethods: S.Array(BuilderMethod),
    /** Methods that transform to a different builder type */
    transformMethods: S.Array(BuilderMethod),
  },
) {}

/**
 * Type signature model (interfaces, type aliases, etc).
 *
 * For now, these are kept as plain text since parsing TypeScript type
 * definitions into structured form is complex with diminishing returns.
 *
 * Future: Could be expanded to structured form (properties, methods, etc).
 */
export class TypeSignatureModel extends S.TaggedClass<TypeSignatureModel>()(
  'TypeSignatureModel',
  {
    /** Full type text */
    text: S.String,
  },
) {}

/**
 * Value signature model (simple const values, primitives).
 *
 * Used for exports that are simple constant values (not functions/classes).
 * Stores the inferred type as text.
 *
 * @example
 * ```typescript
 * // export const PI = 3.14159
 * { _tag: 'ValueSignatureModel', type: 'number' }
 * ```
 */
export class ValueSignatureModel extends S.TaggedClass<ValueSignatureModel>()(
  'ValueSignatureModel',
  {
    /** Inferred type of the value */
    type: S.String,
  },
) {}

/**
 * Class property.
 * Captures property name, type, modifiers, and JSDoc description.
 *
 * @example
 * ```typescript
 * // class User {
 * //   readonly id: string
 * //   name?: string
 * //   static count: number
 * // }
 * [
 *   { name: 'id', type: 'string', optional: false, readonly: true, static: false },
 *   { name: 'name', type: 'string', optional: true, readonly: false, static: false },
 *   { name: 'count', type: 'number', optional: false, readonly: false, static: true }
 * ]
 * ```
 */
export class ClassProperty extends S.Class<ClassProperty>('ClassProperty')({
  /** Property name */
  name: S.String,
  /** Property type (as string) */
  type: S.String,
  /** Whether property is optional (foo?: T) */
  optional: S.Boolean,
  /** Whether property is readonly */
  readonly: S.Boolean,
  /** Whether property is static */
  static: S.Boolean,
  /** Property description from JSDoc */
  description: S.optional(S.String),
}) {}

/**
 * Class method.
 * Captures method name, overloads, and modifiers.
 *
 * @example
 * ```typescript
 * // class User {
 * //   getName(): string
 * //   static create(name: string): User
 * // }
 * [
 *   { name: 'getName', overloads: [...], static: false },
 *   { name: 'create', overloads: [...], static: true }
 * ]
 * ```
 */
export class ClassMethod extends S.Class<ClassMethod>('ClassMethod')({
  /** Method name */
  name: S.String,
  /** Method overloads (same structure as function overloads) */
  overloads: S.Array(FunctionSignature),
  /** Whether method is static */
  static: S.Boolean,
}) {}

/**
 * Class signature model with structured class information.
 *
 * Structured representation of class with constructor, properties, and methods.
 *
 * @example
 * ```typescript
 * // export class User {
 * //   readonly id: string
 * //   name: string
 * //   constructor(id: string, name: string) { ... }
 * //   getName(): string { return this.name }
 * //   static create(name: string): User { return new User(crypto.randomUUID(), name) }
 * // }
 * {
 *   _tag: 'ClassSignatureModel',
 *   ctor: { typeParameters: [], parameters: [...], returnType: 'User' },
 *   properties: [
 *     { name: 'id', type: 'string', readonly: true, ... },
 *     { name: 'name', type: 'string', readonly: false, ... }
 *   ],
 *   methods: [
 *     { name: 'getName', overloads: [...], static: false },
 *     { name: 'create', overloads: [...], static: true }
 *   ]
 * }
 * ```
 */
export class ClassSignatureModel extends S.TaggedClass<ClassSignatureModel>()(
  'ClassSignatureModel',
  {
    /** Constructor signature (optional - may be implicit) */
    ctor: S.optional(FunctionSignature),
    /** Class properties */
    properties: S.Array(ClassProperty),
    /** Class methods */
    methods: S.Array(ClassMethod),
  },
) {}

/**
 * Signature model - tagged union of all signature types.
 *
 * Discriminated by _tag field:
 * - `FunctionSignatureModel` - Functions with structured overloads
 * - `BuilderSignatureModel` - Builder pattern APIs with chainable/terminal methods
 * - `ClassSignatureModel` - Classes with constructor, properties, methods
 * - `TypeSignatureModel` - Types, interfaces, type aliases (text)
 * - `ValueSignatureModel` - Const values (type as text)
 */
export const SignatureModel = S.Union(
  FunctionSignatureModel,
  BuilderSignatureModel,
  ClassSignatureModel,
  TypeSignatureModel,
  ValueSignatureModel,
)
export type SignatureModel = S.Schema.Type<typeof SignatureModel>

/**
 * Base properties shared by all exports.
 */
const BaseExportFields = {
  /** Export name as it appears in code */
  name: S.String,
  /** Structured signature model */
  signature: SignatureModel,
  /** Simple signature when __simpleSignature phantom type is present */
  signatureSimple: S.optional(SignatureModel),
  /** Description from JSDoc */
  description: S.optional(S.String),
  /** Code examples from @example tags */
  examples: S.Array(Example),
  /** Deprecation notice from @deprecated tag */
  deprecated: S.optional(S.String),
  /** Category from @category tag for grouping in documentation */
  category: S.optional(S.String),
  /** All other JSDoc tags */
  tags: S.Record({ key: S.String, value: S.String }),
  /** Source code location */
  sourceLocation: SourceLocation,
}

/**
 * Module type definition.
 */
export interface Module {
  readonly location: typeof FsLoc.RelFile.Type
  readonly description: string
  readonly descriptionSource?: 'jsdoc' | 'md-file'
  readonly category?: string
  readonly exports: ReadonlyArray<Export>
}

/**
 * Module encoded type (same as Module since no transformations).
 */
export interface ModuleEncoded extends Module {}

/**
 * Module schema - uses suspend for circular reference with ValueExport.
 *
 * NOTE: The `as any` assertions are required here due to circular dependency:
 * - Module contains Export[] (through exports field)
 * - ValueExport (part of Export union) contains optional Module (through module field)
 *
 * Effect Schema's S.suspend handles this at runtime, but TypeScript needs help
 * with the circular type reference. The interface definitions above ensure
 * type safety for consumers.
 */
export const Module: S.Schema<Module, ModuleEncoded> = S.suspend(
  (): S.Schema<Module, ModuleEncoded> =>
    S.Struct({
      /**
       * Source file location relative to project root.
       * Portable across package registry, GitHub repo, local dev, etc.
       */
      location: FsLoc.RelFile,
      /** Module-level description from JSDoc */
      description: S.String,
      /** Source of module description - tracks whether description came from JSDoc or external .md file */
      descriptionSource: S.optional(S.Literal('jsdoc', 'md-file')),
      /** Category from @category tag for grouping in sidebar */
      category: S.optional(S.String),
      /** All exports in this module */
      exports: S.Array(Export as any),
    }) as any,
)

/**
 * Value export - represents a runtime export.
 * Namespace exports include a nested module.
 */
export class ValueExport extends S.Class<ValueExport>('ValueExport')({
  ...BaseExportFields,
  _tag: S.Literal('value'),
  type: ValueExportType,
  /** Nested module for namespace exports */
  module: S.optional(Module),
}) {}

/**
 * Type export - represents a type-only export.
 */
export class TypeExport extends S.Class<TypeExport>('TypeExport')({
  ...BaseExportFields,
  _tag: S.Literal('type'),
  type: TypeExportType,
}) {}

/**
 * Export is a tagged union of value and type exports.
 */
export const Export = S.Union(ValueExport, TypeExport)
export type Export = S.Schema.Type<typeof Export>

/**
 * Drillable Namespace Pattern entrypoint.
 *
 * This pattern is detected ONLY for the main entrypoint ('.') when ALL conditions are met:
 *
 * 1. The main entrypoint source file contains a namespace export: `export * as Name from './path'`
 * 2. The namespace name (PascalCase, e.g., `A`) converts to kebab-case (e.g., `a`)
 * 3. A subpath export exists in package.json with that kebab name (e.g., `./a`)
 * 4. The file that the namespace export points to
 * 5. AND the file that the subpath export points to
 * 6. Must resolve to the SAME source file
 *
 * When detected, this enables two import forms:
 * - `import { Name } from 'package'` - imports the namespace from main entrypoint
 * - `import * as Name from 'package/kebab-name'` - imports the barrel directly
 *
 * @example
 * ```typescript
 * // package.json
 * {
 *   "exports": {
 *     ".": "./build/index.js",
 *     "./a": "./build/a.js"
 *   }
 * }
 *
 * // src/index.ts (main entrypoint)
 * export * as A from './a.js'
 *
 * // src/a.ts (barrel implementation)
 * export const foo = () => {}
 * ```
 *
 * Both the namespace export and the subpath export resolve to `src/a.ts` → Drillable!
 *
 * @example Non-drillable case - different files
 * ```typescript
 * // package.json
 * {
 *   "exports": {
 *     ".": "./build/index.js",
 *     "./a": "./build/a.js"
 *   }
 * }
 *
 * // src/index.ts
 * export * as A from './z.js'  // ← Points to z.js, not a.js
 *
 * // Namespace points to src/z.ts, subpath points to src/a.ts → NOT drillable (different files)
 * ```
 */
export class DrillableNamespaceEntrypoint extends S.TaggedClass<DrillableNamespaceEntrypoint>()(
  'DrillableNamespaceEntrypoint',
  {
    /**
     * Package export path - always '.' for drillable namespace (main entrypoint only).
     */
    path: S.String,
    /** The extracted module interface from the barrel file */
    module: Module,
  },
) {}

/**
 * Simple entrypoint without special import pattern.
 */
export class SimpleEntrypoint extends S.TaggedClass<SimpleEntrypoint>()(
  'SimpleEntrypoint',
  {
    /**
     * Package export path (key from package.json "exports").
     * Module specifier without extension.
     * Example: './arr' or './str'
     */
    path: S.String,
    /** The extracted module interface */
    module: Module,
  },
) {}

/**
 * Entrypoint union - all patterns.
 */
export const Entrypoint = S.Union(
  DrillableNamespaceEntrypoint,
  SimpleEntrypoint,
)
export type Entrypoint = S.Schema.Type<typeof Entrypoint>

/**
 * Package metadata.
 */
export class PackageMetadata extends S.Class<PackageMetadata>('PackageMetadata')({
  /** When the extraction was performed */
  extractedAt: S.Date,
  /** Version of the extractor tool */
  extractorVersion: S.String,
}) {}

/**
 * Package represents the complete extracted documentation model.
 */
export class Package extends S.Class<Package>('Package')({
  /** Package name from package.json */
  name: S.String,
  /** Package version from package.json */
  version: S.String,
  /** All package entrypoints */
  entrypoints: S.Array(Entrypoint),
  /** Extraction metadata */
  metadata: PackageMetadata,
}) {}

/**
 * The complete interface model output.
 */
export const InterfaceModel = Package
export type InterfaceModel = S.Schema.Type<typeof InterfaceModel>
