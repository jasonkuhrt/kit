import { FsLoc } from '#fs-loc'
import { Match, Schema as S } from 'effect'
import { type ExportedDeclarations, Node } from 'ts-morph'
import { type Export, SourceLocation, TypeExport, ValueExport } from '../../schema.js'
import { absoluteToRelative } from '../path-utils.js'
import { categorize } from './categorize.js'
import { parseJSDoc } from './jsdoc.js'
import { extractModule } from './module.js'
import { extractSignature } from './tsmorph-utils.js'

/**
 * Extract export information from a declaration node.
 *
 * @param name - The export name
 * @param decl - The declaration node
 * @returns Export object with all metadata
 */
export const extractExport = (name: string, decl: ExportedDeclarations): Export => {
  // Get category (level and type)
  const { level, type } = categorize(decl)

  // Extract signature - type signature only, no implementation
  const signature = extractSignature(decl)

  // Parse JSDoc - use the declaration node directly
  // ts-morph resolves re-exports to the original declaration
  const jsdoc = parseJSDoc(decl)

  // Get source location
  const sourceLocation = SourceLocation.make({
    file: S.decodeSync(FsLoc.RelFile.String)(absoluteToRelative(decl.getSourceFile().getFilePath())),
    line: decl.getStartLineNumber(),
  })

  // Base export properties
  const baseExport = {
    name,
    signature,
    description: jsdoc.description,
    examples: jsdoc.examples,
    deprecated: jsdoc.deprecated,
    category: jsdoc.category,
    tags: jsdoc.tags,
    sourceLocation,
  }

  // Check if this should be forced to namespace (via @namespace tag)
  // This allows runtime objects to be treated as namespaces in docs
  if (jsdoc.forceNamespace && level === 'value') {
    const location = S.decodeSync(FsLoc.RelFile.String)(
      absoluteToRelative(decl.getSourceFile().getFilePath()),
    )
    return ValueExport.make({
      ...baseExport,
      _tag: 'value',
      type: 'namespace',
      module: {
        location,
        description: jsdoc.description || '',
        exports: [],
      },
    })
  }

  // Handle namespace exports (extract nested module)
  if (level === 'value' && type === 'namespace' && Node.isModuleDeclaration(decl)) {
    const location = S.decodeSync(FsLoc.RelFile.String)(
      absoluteToRelative(decl.getSourceFile().getFilePath()),
    )
    const nestedModule = extractModule(decl, location)

    return ValueExport.make({
      ...baseExport,
      _tag: 'value',
      type: 'namespace',
      module: nestedModule,
    })
  }

  // Use Match to type-safely create the appropriate export based on level
  return Match.value(level).pipe(
    Match.when('value', () =>
      ValueExport.make({
        ...baseExport,
        _tag: 'value',
        type: type as typeof ValueExport.Type['type'],
      })),
    Match.when('type', () =>
      TypeExport.make({
        ...baseExport,
        _tag: 'type',
        type: type as typeof TypeExport.Type['type'],
      })),
    Match.exhaustive,
  )
}
