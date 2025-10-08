import { type ExportedDeclarations, Node } from 'ts-morph'
import type { Export, Module, SourceLocation } from '../../schema.js'
import { categorize } from './categorize.js'
import { parseJSDoc } from './jsdoc.js'
import { extractModule } from './module.js'

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

  // Extract signature - just get the full text
  const signature = decl.getText()

  // Parse JSDoc
  const jsdoc = parseJSDoc(decl)

  // Get source location
  const sourceLocation: SourceLocation = {
    file: decl.getSourceFile().getFilePath().replace(process.cwd() + '/', ''),
    line: decl.getStartLineNumber(),
  }

  // Base export properties
  const baseExport = {
    name,
    signature,
    description: jsdoc.description,
    examples: jsdoc.examples,
    deprecated: jsdoc.deprecated,
    tags: jsdoc.tags,
    sourceLocation,
  }

  // Handle namespace exports (extract nested module)
  if (level === 'value' && type === 'namespace' && Node.isModuleDeclaration(decl)) {
    const nestedModule = extractModule(name, decl)

    return {
      ...baseExport,
      _tag: 'value',
      type: 'namespace',
      module: nestedModule,
    } as any
  }

  // Value export (non-namespace)
  if (level === 'value') {
    return {
      ...baseExport,
      _tag: 'value',
      type,
    } as any
  }

  // Type export
  return {
    ...baseExport,
    _tag: 'type',
    type,
  } as any
}
