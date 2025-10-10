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

/**
 * Base properties shared by all exports.
 */
const BaseExportFields = {
  /** Export name as it appears in code */
  name: S.String,
  /** Full type signature extracted from source */
  signature: S.String,
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
 * Requirements:
 * - path stem (kebab-case) → namespace name (PascalCase)
 * - Example: path='./err' → stem='err' → namespace='Err'
 *
 * Pattern enables two import forms:
 * - import { Err } from '@wollybeard/kit'
 * - import * as Err from '@wollybeard/kit/err'
 */
export class DrillableNamespaceEntrypoint extends S.TaggedClass<DrillableNamespaceEntrypoint>()(
  'DrillableNamespaceEntrypoint',
  {
    /**
     * Package export path (key from package.json "exports").
     * Module specifier without extension.
     * The stem of this path is the kebab-case module name.
     * Example: './err' or './test' (stem='err' → namespace='Err')
     */
    path: S.String,
    /** The extracted module interface */
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
