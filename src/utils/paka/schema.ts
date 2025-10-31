import { Arr } from '#arr'
import { Fs } from '#fs'
import { Str } from '#str'
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
 * Import example for documentation UI.
 *
 * Non-serialized class used for rendering import tabs in documentation.
 * Returned by Entrypoint instance methods to provide structured import examples.
 */
export class ImportExample extends S.Class<ImportExample>('ImportExample')({
  /** Tab label (e.g., "Namespace", "Barrel") */
  label: S.String,
  /** Import code snippet */
  content: S.String,
}) {}

/**
 * Source location for "View source" links.
 */
export class SourceLocation extends S.Class<SourceLocation>('SourceLocation')({
  /** Relative file path from project root - portable across systems */
  file: Fs.Path.RelFile.Schema,
  /** Line number where the export is defined */
  line: S.Number,
}) {}

// ============================================================================
// Documentation Provenance
// ============================================================================

/**
 * Provenance for JSDoc-sourced documentation.
 * Tracks whether it came from a shadow namespace or regular JSDoc.
 */
export class JSDocProvenance extends S.TaggedClass<JSDocProvenance>()(
  'jsdoc',
  {
    /** Whether description came from shadow namespace pattern */
    shadowNamespace: S.Boolean,
  },
) {}

/**
 * Provenance for markdown file-sourced documentation.
 * Includes file path for "Edit this page" links.
 */
export class MdFileProvenance extends S.TaggedClass<MdFileProvenance>()(
  'md-file',
  {
    /** Relative path to the source markdown file */
    filePath: Fs.Path.RelFile.Schema,
  },
) {}

/**
 * Union of all possible documentation provenance types.
 */
export const Provenance = S.Union(JSDocProvenance, MdFileProvenance)
export type Provenance = typeof Provenance.Type

/**
 * Documentation content for modules and exports.
 * Groups descriptive and guide content together.
 */
export class Docs extends S.Class<Docs>('Docs')({
  /** Brief technical description (API reference style) - from JSDoc/shadow */
  description: S.optional(S.String),
  /** Long-form guide/tutorial content (narrative style) - from .md files or @guide tag */
  guide: S.optional(S.String),
}) {}

/**
 * Landing page feature card.
 */
export class Feature extends S.Class<Feature>('Feature')({
  /** Feature title (from ## heading) */
  title: S.String,
  /** Feature description (markdown content) */
  body: S.String,
}) {}

/**
 * Landing page body section (content or exports marker).
 */
export const BodySection = S.Union(
  S.Struct({
    _tag: S.Literal('exports'),
  }),
  S.Struct({
    _tag: S.Literal('content'),
    title: S.String,
    body: S.String,
  }),
)
export type BodySection = S.Schema.Type<typeof BodySection>

/**
 * Landing page structured content.
 * At least one of hero, highlights, or body must be present (validated during parsing).
 */
export class Home extends S.Class<Home>('Home')({
  /** Hero section (optional - fallback to module.name if missing) */
  hero: S.optional(
    S.Struct({
      name: S.optional(S.String),
      text: S.optional(S.String),
      tagline: S.optional(S.String),
    }),
  ),
  /** Feature cards (optional) */
  highlights: S.optional(S.Array(Feature)),
  /** Body sections with exports insertion points (optional) */
  body: S.optional(S.Array(BodySection)),
}) {}

/**
 * Module-specific documentation with landing page support.
 */
export class ModuleDocs extends S.Class<ModuleDocs>('ModuleDocs')({
  /** Brief technical description */
  description: S.optional(S.String),
  /** Long-form guide content */
  guide: S.optional(S.String),
  /** Landing page content (triggers hero layout) */
  home: S.optional(Home),
}) {}

/**
 * Provenance tracking for documentation sources.
 * Maps each doc field (description/guide) to its source.
 * Note: home field doesn't need provenance - it can only come from *.home.md files.
 */
export class DocsProvenance extends S.Class<DocsProvenance>('DocsProvenance')({
  /** Provenance for the description field */
  description: S.optional(Provenance),
  /** Provenance for the guide field */
  guide: S.optional(Provenance),
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
  /** Documentation content (description and guide) */
  docs: S.optional(Docs),
  /** Provenance tracking for documentation sources */
  docsProvenance: S.optional(DocsProvenance),
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
 * Module type interface for declaration merging.
 * Following the graphql-kit pattern for circular schemas with instance methods.
 */
export interface Module {
  readonly location: S.Schema.Type<typeof Fs.Path.RelFile>
  readonly docs?: ModuleDocs | undefined
  readonly docsProvenance?: DocsProvenance | undefined
  readonly category?: string | undefined
  readonly exports: Export[]
}

export interface ModuleEncoded {
  readonly location: S.Schema.Encoded<typeof Fs.Path.RelFile>
  readonly docs?: ModuleDocs | undefined
  readonly docsProvenance?: DocsProvenance | undefined
  readonly category?: string | undefined
  readonly exports: ExportEncoded[]
}

/**
 * Module schema implementation.
 *
 * NOTE: Circular dependency handled via declaration merging:
 * - Module interface declared above provides type structure
 * - Module class extends S.Class<Module> - same name enables declaration merging
 * - Module contains Export[] (through exports field)
 * - ValueExport (part of Export union) contains optional Module (through module field)
 * - This is intentional and handled correctly at runtime by Effect Schema via S.suspend()
 */
export class Module extends S.Class<Module>('Module')({
  /**
   * Source file location relative to project root.
   * Portable across package registry, GitHub repo, local dev, etc.
   */
  location: Fs.Path.RelFile.Schema,
  /** Documentation content (description, guide, and optional home page) */
  docs: S.optional(ModuleDocs),
  /** Provenance tracking for documentation sources */
  docsProvenance: S.optional(DocsProvenance),
  /** Category from @category tag for grouping in sidebar */
  category: S.optional(S.String),
  /** All exports in this module */
  exports: S.Array(S.suspend((): S.Schema<Export, ExportEncoded> => Export as any)),
}) {
  /**
   * Get namespace exports (value exports with type='namespace' and nested module).
   */
  get namespaceExports(): ValueExport[] {
    return this.exports.filter(
      (exp): exp is ValueExport => exp._tag === 'value' && exp.type === 'namespace' && exp.module !== undefined,
    )
  }

  /**
   * Get regular exports (non-namespace exports).
   */
  get regularExports(): Export[] {
    return this.exports.filter((exp) => !(exp._tag === 'value' && exp.type === 'namespace'))
  }

  /**
   * Get function exports.
   */
  get functionExports(): ValueExport[] {
    return this.exports.filter((exp): exp is ValueExport => exp._tag === 'value' && exp.type === 'function')
  }

  /**
   * Get constant exports.
   */
  get constantExports(): ValueExport[] {
    return this.exports.filter((exp): exp is ValueExport => exp._tag === 'value' && exp.type === 'const')
  }

  /**
   * Get class exports.
   */
  get classExports(): ValueExport[] {
    return this.exports.filter((exp): exp is ValueExport => exp._tag === 'value' && exp.type === 'class')
  }

  /**
   * Get type exports.
   */
  get typeExports(): TypeExport[] {
    return this.exports.filter((exp): exp is TypeExport => exp._tag === 'type')
  }

  /**
   * Check if any export has a category tag.
   */
  get hasCategories(): boolean {
    return this.exports.some((exp) => exp.category !== undefined)
  }

  /**
   * Check if module description came from an external .md file.
   */
  get hasExternalReadme(): boolean {
    return this.docsProvenance?.description?._tag === 'md-file'
  }
}

/**
 * ValueExport type interface for declaration merging.
 */
export interface ValueExport {
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

export interface ValueExportEncoded {
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

/**
 * Value export schema implementation.
 */
export class ValueExport extends S.TaggedClass<ValueExport>('ValueExport')('value', {
  ...BaseExportFields,
  type: ValueExportType,
  /** Nested module for namespace exports */
  module: S.optional(S.suspend((): S.Schema<Module, ModuleEncoded> => Module as any)),
}) {
  static is = S.is(ValueExport)

  /**
   * Get type icon/badge for documentation rendering.
   *
   * @returns Short string representing the export type
   */
  get typeIcon(): string {
    switch (this.type) {
      case 'function':
        return 'F'
      case 'const':
        return 'C'
      case 'class':
        return 'Class'
      case 'namespace':
        return 'NS'
    }
  }
}

/**
 * Type export schema implementation.
 */
export class TypeExport extends S.TaggedClass<TypeExport>('TypeExport')('type', {
  ...BaseExportFields,
  type: TypeExportType,
}) {
  static is = S.is(TypeExport)

  /**
   * Get type icon/badge for documentation rendering.
   *
   * @returns Short string representing the export type
   */
  get typeIcon(): string {
    switch (this.type) {
      case 'interface':
        return 'I'
      case 'type-alias':
        return 'T'
      case 'enum':
        return 'E'
      case 'union':
        return 'U'
      case 'intersection':
        return '∩'
    }
  }
}

/**
 * Export is a tagged union of value and type exports.
 */
export const Export = S.Union(ValueExport, TypeExport)
export type Export = S.Schema.Type<typeof Export>
export type ExportEncoded = ValueExportEncoded | S.Schema.Encoded<typeof TypeExport>

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
) {
  /**
   * Generate import examples for this entrypoint.
   *
   * For drillable namespaces, this generates both:
   * - Namespace tab: `import { Name } from 'package'` with access pattern for nested
   * - Barrel tab: `import * as Name from 'package/kebab-name'` (top-level)
   *              or `import { ChildName } from 'package/kebab-name'` with access (nested)
   *
   * @param packageName - The package name (e.g., '@wollybeard/kit')
   * @param breadcrumbs - The namespace path (e.g., ['Ts', 'Union'])
   * @returns Array of import examples with labels and code
   */
  getImportExamples(packageName: string, breadcrumbs: string[]): ImportExample[] {
    const moduleName = breadcrumbs[0]
    if (!moduleName) return []

    const kebabName = Str.Case.kebab(moduleName)
    const subpath = `${packageName}/${kebabName}`

    // Top-level: both Namespace and Barrel tabs
    if (breadcrumbs.length === 1) {
      return [
        ImportExample.make({
          label: 'Namespace',
          content: `import { ${moduleName} } from '${packageName}'`,
        }),
        ImportExample.make({
          label: 'Barrel',
          content: `import * as ${moduleName} from '${subpath}'`,
        }),
      ]
    }

    // Nested: show access pattern for namespace (barrel is self-evident)
    const childNamespace = Arr.last(breadcrumbs)!
    const namespacePath = breadcrumbs.join('.')

    return [
      ImportExample.make({
        label: 'Namespace',
        content: `import { ${moduleName} } from '${packageName}'\n\n// Access via namespace\n${namespacePath}`,
      }),
      ImportExample.make({
        label: 'Barrel',
        content: `import { ${childNamespace} } from '${subpath}'`,
      }),
    ]
  }
}

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
) {
  /**
   * Derive PascalCase module name from path.
   * Handles kebab-case conversion properly.
   *
   * @example
   * './arr' -> 'Arr'
   * './package-manager' -> 'PackageManager'
   */
  get moduleName(): string {
    const withoutLeadingDot = this.path.replace(/^\.\//, '')
    return withoutLeadingDot
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  /**
   * Derive kebab-case name from path.
   *
   * @example
   * './arr' -> 'arr'
   * './package-manager' -> 'package-manager'
   */
  get kebabName(): string {
    return this.path.replace(/^\.\//, '')
  }

  /**
   * Generate import examples for this entrypoint.
   *
   * Simple entrypoints only have one import pattern (no drillable namespace).
   *
   * @param packageName - The package name (e.g., '@wollybeard/kit')
   * @param path - The entrypoint path from package.json exports
   * @returns Array with single import example
   */
  getImportExamples(packageName: string, path: string): ImportExample[] {
    const moduleName = path.replace('./', '')
    const subpath = packageName + path.replace('.', '')

    return [
      ImportExample.make({
        label: 'Import',
        content: `import * as ${moduleName} from '${subpath}'`,
      }),
    ]
  }
}

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
