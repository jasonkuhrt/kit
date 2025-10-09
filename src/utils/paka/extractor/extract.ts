import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import type { Entrypoint, InterfaceModel } from '../schema.js'
import { parseJSDoc } from './nodes/jsdoc.js'
import { extractModuleFromFile } from './nodes/module.js'

/**
 * Configuration for extraction.
 */
export type ExtractConfig = {
  /** Project root directory */
  projectRoot: string
  /** Path to tsconfig.json */
  tsconfigPath?: string
  /** Specific entrypoints to extract (if not specified, extracts all from package.json) */
  entrypoints?: string[]
  /** Extractor version */
  extractorVersion?: string
}

/**
 * Extract documentation model from TypeScript source files.
 *
 * @param config - Extraction configuration
 * @returns Complete interface model
 */
export const extract = (config: ExtractConfig): InterfaceModel => {
  const {
    projectRoot,
    tsconfigPath = join(projectRoot, 'tsconfig.json'),
    entrypoints: targetEntrypoints,
    extractorVersion = '0.1.0',
  } = config

  // Load package.json
  const packageJsonPath = join(projectRoot, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

  // Create TypeScript project
  const project = new Project({
    tsConfigFilePath: tsconfigPath,
  })

  // Determine which entrypoints to extract
  const exportsField = packageJson.exports as Record<string, string> | undefined
  if (!exportsField) {
    throw new Error('package.json missing "exports" field')
  }

  const entrypointsToExtract = targetEntrypoints
    ? Object.entries(exportsField).filter(([key]) => targetEntrypoints.includes(key))
    : Object.entries(exportsField).filter(([key]) => key.startsWith('./') && key !== '.')

  // Extract each entrypoint
  const extractedEntrypoints: Entrypoint[] = []

  for (const [packagePath, buildPath] of entrypointsToExtract) {
    // Resolve build path to source path
    // './build/utils/test/$.js' -> './src/utils/test/$.ts'
    const sourcePath = buildPath
      .replace(/^\.\/build\//, './src/')
      .replace(/\$\$\.js$/, '$$.ts')
      .replace(/\.js$/, '.ts')

    const absoluteSourcePath = join(projectRoot, sourcePath)

    // Get source file
    const sourceFile = project.getSourceFile(absoluteSourcePath)
    if (!sourceFile) {
      console.warn(`Warning: Could not find source file for ${packagePath} at ${sourcePath}`)
      continue
    }

    // Determine module name from package path
    // './test' -> 'Test'
    // './ts' -> 'Ts'
    const moduleName = packagePath
      .replace(/^\.\//, '')
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    // Check if this is a namespace re-export pattern: export * as Name from './$$'
    // If so, resolve to the actual module file
    let actualSourceFile = sourceFile
    let namespaceDescription: string | undefined
    const exportDeclarations = sourceFile.getExportDeclarations()

    for (const exportDecl of exportDeclarations) {
      const namespaceExport = exportDecl.getNamespaceExport()
      const moduleSpecifier = exportDecl.getModuleSpecifierValue()

      if (namespaceExport && moduleSpecifier?.includes('$$')) {
        // This is a namespace re-export - resolve to the actual file
        const referencedFile = exportDecl.getModuleSpecifierSourceFile()
        if (referencedFile) {
          // Extract JSDoc from the namespace export declaration before switching files
          // ExportDeclaration nodes don't have getJsDocs(), so we need to extract from leading comments
          const leadingComments = exportDecl.getLeadingCommentRanges()

          for (const comment of leadingComments) {
            const commentText = comment.getText()
            // Check if it's a JSDoc comment (/** ... */)
            if (commentText.startsWith('/**') && commentText.endsWith('*/')) {
              // Remove /** and */ and trim
              namespaceDescription = commentText
                .slice(3, -2)
                .split('\n')
                .map(line => line.replace(/^\s*\*\s?/, ''))
                .join('\n')
                .trim()
              break
            }
          }
          actualSourceFile = referencedFile
          break
        }
      }
    }

    // Extract module
    const module = extractModuleFromFile(moduleName, actualSourceFile)

    // Override module description with namespace export JSDoc if available
    if (namespaceDescription) {
      module.description = namespaceDescription
    }

    extractedEntrypoints.push({
      packagePath,
      resolvedPath: sourcePath,
      module,
    })
  }

  return {
    name: packageJson.name,
    version: packageJson.version,
    entrypoints: extractedEntrypoints,
    metadata: {
      extractedAt: new Date(),
      extractorVersion,
    },
  }
}
