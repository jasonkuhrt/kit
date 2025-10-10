import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import {
  DrillableNamespaceEntrypoint,
  type Entrypoint,
  type InterfaceModel,
  Package,
  PackageMetadata,
  SimpleEntrypoint,
} from '../schema.js'
import { parseJSDoc } from './nodes/jsdoc.js'
import { extractModuleFromFile } from './nodes/module.js'
import { buildToSourcePath } from './path-utils.js'

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
    const sourcePath = buildToSourcePath(buildPath)
    const absoluteSourcePath = join(projectRoot, sourcePath)

    // Get source file
    const sourceFile = project.getSourceFile(absoluteSourcePath)
    if (!sourceFile) {
      console.warn(`Warning: Could not find source file for ${packagePath} at ${sourcePath}`)
      continue
    }

    // Check if this is a namespace re-export pattern: export * as Name from './$$'
    // If so, this is a Drillable Namespace Pattern
    let actualSourceFile = sourceFile
    let namespaceDescription: string | undefined
    let namespaceCategory: string | undefined
    let isDrillableNamespace = false
    const exportDeclarations = sourceFile.getExportDeclarations()

    for (const exportDecl of exportDeclarations) {
      const namespaceExport = exportDecl.getNamespaceExport()
      const moduleSpecifier = exportDecl.getModuleSpecifierValue()

      if (namespaceExport && moduleSpecifier?.includes('$$')) {
        // This is a drillable namespace - resolve to the actual file
        isDrillableNamespace = true
        const referencedFile = exportDecl.getModuleSpecifierSourceFile()
        if (referencedFile) {
          // Extract JSDoc from the namespace export declaration using parseJSDoc
          // This properly separates description from examples and other tags
          const jsdoc = parseJSDoc(exportDecl)
          namespaceDescription = jsdoc.description
          namespaceCategory = jsdoc.category
          actualSourceFile = referencedFile
          break
        }
      }
    }

    // Extract module (no longer needs module name)
    let module = extractModuleFromFile(actualSourceFile, S.decodeSync(FsLoc.RelFile.String)(sourcePath))

    // Override module description and category with namespace export JSDoc if available
    if (namespaceDescription || namespaceCategory) {
      module = {
        ...module,
        ...(namespaceDescription ? { description: namespaceDescription } : {}),
        ...(namespaceCategory ? { category: namespaceCategory } : {}),
      }
    }

    // Create appropriate entrypoint type
    if (isDrillableNamespace) {
      extractedEntrypoints.push(DrillableNamespaceEntrypoint.make({
        path: packagePath,
        module,
      }))
    } else {
      extractedEntrypoints.push(SimpleEntrypoint.make({
        path: packagePath,
        module,
      }))
    }
  }

  return Package.make({
    name: packageJson.name,
    version: packageJson.version,
    entrypoints: extractedEntrypoints,
    metadata: PackageMetadata.make({
      extractedAt: new Date(),
      extractorVersion,
    }),
  })
}
