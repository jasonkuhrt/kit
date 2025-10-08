import { Schema as S } from 'effect'

// ============================================================================
// Enums
// ============================================================================

/**
 * Export level distinguishes between runtime values and type-only exports.
 */
export const ExportLevel = S.Literal('value', 'type')
export type ExportLevel = S.Schema.Type<typeof ExportLevel>

/**
 * Value export types - exports that exist at runtime.
 */
export const ValueExportType = S.Literal('function', 'const', 'class', 'namespace')
export type ValueExportType = S.Schema.Type<typeof ValueExportType>

/**
 * Type export types - exports that only exist in TypeScript's type system.
 */
export const TypeExportType = S.Literal('interface', 'type-alias', 'enum', 'union', 'intersection')
export type TypeExportType = S.Schema.Type<typeof TypeExportType>

// ============================================================================
// Core Models
// ============================================================================

/**
 * Code example extracted from JSDoc @example tags.
 */
export const Example = S.Struct({
  /** The source code of the example */
  code: S.String,
  /** Optional title from @example annotation */
  title: S.optional(S.String),
  /** Whether to enable Twoslash type hover (default: true, opt-out via @twoslash-disable) */
  twoslashEnabled: S.Boolean,
  /** Programming language for syntax highlighting */
  language: S.String,
})
export type Example = S.Schema.Type<typeof Example>

/**
 * Source location for "View source" links.
 */
export const SourceLocation = S.Struct({
  /** Relative file path from project root */
  file: S.String,
  /** Line number where the export is defined */
  line: S.Number,
})
export type SourceLocation = S.Schema.Type<typeof SourceLocation>

/**
 * Base properties shared by all exports.
 */
const BaseExport = {
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
  /** All other JSDoc tags */
  tags: S.Record({ key: S.String, value: S.String }),
  /** Source code location */
  sourceLocation: SourceLocation,
}

/**
 * Module type definition.
 */
export type Module = {
  name: string
  description: string
  exports: any[] // Use any to avoid circular type issues
}

/**
 * Module schema - uses suspend for circular reference.
 */
export const Module: any = S.suspend(() =>
  S.Struct({
    /** Module name (e.g., 'Test', 'Ts', 'Kind') */
    name: S.String,
    /** Module-level description from JSDoc */
    description: S.String,
    /** All exports in this module */
    exports: S.Array(S.Any),
  })
)

/**
 * Value export - represents a runtime export.
 * Namespace exports include a nested module.
 */
export const ValueExport = S.Struct({
  ...BaseExport,
  _tag: S.Literal('value'),
  type: ValueExportType,
  /** Nested module for namespace exports */
  module: S.optional(Module),
})
export type ValueExport = S.Schema.Type<typeof ValueExport>

/**
 * Type export - represents a type-only export.
 */
export const TypeExport = S.Struct({
  ...BaseExport,
  _tag: S.Literal('type'),
  type: TypeExportType,
})
export type TypeExport = S.Schema.Type<typeof TypeExport>

/**
 * Export is a tagged union of value and type exports.
 */
export const Export = S.Union(ValueExport, TypeExport)
export type Export = S.Schema.Type<typeof Export>

/**
 * Package entrypoint maps a package.json export path to its module.
 */
export const Entrypoint = S.Struct({
  /** Package export path (e.g., './test', './ts') */
  packagePath: S.String,
  /** Resolved source file path */
  resolvedPath: S.String,
  /** Module extracted from this entrypoint */
  module: Module,
})
export type Entrypoint = S.Schema.Type<typeof Entrypoint>

/**
 * Package represents the complete extracted documentation model.
 */
export const Package = S.Struct({
  /** Package name from package.json */
  name: S.String,
  /** Package version from package.json */
  version: S.String,
  /** All package entrypoints */
  entrypoints: S.Array(Entrypoint),
  /** Extraction metadata */
  metadata: S.Struct({
    /** When the extraction was performed */
    extractedAt: S.Date,
    /** Version of the extractor tool */
    extractorVersion: S.String,
  }),
})
export type Package = S.Schema.Type<typeof Package>

/**
 * The complete interface model output.
 */
export const InterfaceModel = Package
export type InterfaceModel = S.Schema.Type<typeof InterfaceModel>
