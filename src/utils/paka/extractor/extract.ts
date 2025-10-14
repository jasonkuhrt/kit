import type { Dir } from '#dir'
import { FsLoc } from '#fs-loc'
import { Str } from '#str'
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
 * Pure extraction function that processes files without I/O.
 * Takes all files as input and returns the extracted model.
 *
 * @param params - Extraction parameters including files layout
 * @returns Complete interface model
 *
 * @example
 * ```ts
 * const layout = Dir.spec('/')
 *   .add('package.json', { name: 'x', exports: { './foo': './build/foo/$.js' } })
 *   .add('src/foo/$.ts', 'export const bar = () => {}')
 *   .toLayout()
 *
 * const model = extractFromFiles({ files: layout })
 * ```
 */
export const extractFromFiles = (params: {
  projectRoot?: string
  files: Dir.Layout
  entrypoints?: string[]
  extractorVersion?: string
}): InterfaceModel => {
  const {
    projectRoot = '/',
    files,
    entrypoints: targetEntrypoints,
    extractorVersion = '0.1.0',
  } = params

  // Load package.json
  const packageJsonPath = join(projectRoot, 'package.json')
  const packageJsonContent = files[packageJsonPath]
  if (!packageJsonContent) {
    throw new Error(`package.json not found at ${packageJsonPath}`)
  }
  const packageJson = JSON.parse(
    typeof packageJsonContent === 'string' ? packageJsonContent : new TextDecoder().decode(packageJsonContent),
  )

  // Create in-memory TypeScript project
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      target: 99, // ESNext
      module: 99, // ESNext
      moduleResolution: 3, // Bundler
    },
  })

  // Load all files into ts-morph
  for (const [filePath, content] of Object.entries(files)) {
    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      const contentStr = typeof content === 'string' ? content : new TextDecoder().decode(content)
      project.createSourceFile(filePath, contentStr)
    }
  }

  // Determine which entrypoints to extract
  const exportsField = packageJson.exports as Record<string, string> | undefined
  if (!exportsField) {
    throw new Error('package.json missing "exports" field')
  }

  const entrypointsToExtract = targetEntrypoints
    ? Object.entries(exportsField).filter(([key]) => targetEntrypoints.includes(key))
    : Object.entries(exportsField) // Extract ALL by default

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

    // Check for Drillable Namespace Pattern
    // Detection criteria vary by entrypoint type:
    //
    // For main entrypoint '.':
    // 1. Main entrypoint has namespace export: export * as Name from './path'
    // 2. Namespace name (PascalCase) converts to kebab-case
    // 3. Subpath export ./kebab-name exists in package.json
    // 4. Both namespace export and subpath export resolve to same source file
    //
    // For subpath entrypoints (e.g., './arr'):
    // 1. Check if sibling $.ts file exists (e.g., arr/$.ts when entrypoint points to arr/$$.ts)
    // 2. Check if $.ts has namespace export matching the entrypoint name
    // 3. Check if namespace export points to the entrypoint's target file
    // 4. If so, use $.ts as source and mark as drillable
    let actualSourceFile = sourceFile
    let namespaceDescription: string | undefined
    let namespaceCategory: string | undefined
    let isDrillableNamespace = false

    if (packagePath === '.') {
      const exportDeclarations = sourceFile.getExportDeclarations()

      for (const exportDecl of exportDeclarations) {
        const namespaceExport = exportDecl.getNamespaceExport()
        if (!namespaceExport) continue

        // Get namespace name (PascalCase, e.g., 'A')
        const nsName = namespaceExport.getName()

        // Convert to kebab-case (e.g., 'A' -> 'a', 'FooBar' -> 'foo-bar')
        const kebabName = Str.Case.kebab(nsName)
        const subpathKey = `./${kebabName}`

        // Check if matching subpath exists in exports
        if (!(subpathKey in exportsField)) continue

        // Resolve the file that the namespace export points to
        const nsReferencedFile = exportDecl.getModuleSpecifierSourceFile()
        if (!nsReferencedFile) continue

        const nsFilePath = nsReferencedFile.getFilePath()

        // Resolve the file that the subpath export points to
        const subpathBuildPath = exportsField[subpathKey]
        if (!subpathBuildPath) continue
        const subpathSourcePath = buildToSourcePath(subpathBuildPath)
        const subpathAbsolutePath = join(projectRoot, subpathSourcePath)
        const subpathFile = project.getSourceFile(subpathAbsolutePath)
        if (!subpathFile) continue

        const subpathFilePath = subpathFile.getFilePath()

        // If both resolve to the same file, it's drillable!
        if (nsFilePath === subpathFilePath) {
          isDrillableNamespace = true
          actualSourceFile = nsReferencedFile
          // Extract JSDoc from the namespace export declaration
          const jsdoc = parseJSDoc(exportDecl)
          namespaceDescription = jsdoc.description
          namespaceCategory = jsdoc.category
          break
        }
      }
    } else {
      // For subpath entrypoints, check if there's a sibling $.ts file with matching namespace export
      // Example: './arr' points to 'arr/$$.ts', check if 'arr/$.ts' exists with 'export * as Arr from "./$$.js"'
      const sourceFileDir = sourceFile.getDirectory()
      const sourceStem = sourceFile.getBaseNameWithoutExtension()

      // Check if this is a barrel file ($$.ts)
      if (sourceStem === '$$') {
        const siblingNamespaceFile = sourceFileDir.getSourceFile('$.ts')

        if (siblingNamespaceFile) {
          // Check if the namespace file has a namespace export matching the entrypoint name
          const exportDeclarations = siblingNamespaceFile.getExportDeclarations()

          // Extract expected namespace name from packagePath (e.g., './arr' -> 'Arr')
          const expectedNsName = Str.Case.pascal(packagePath.replace(/^\.\//, ''))

          for (const exportDecl of exportDeclarations) {
            const namespaceExport = exportDecl.getNamespaceExport()
            if (!namespaceExport) continue

            const nsName = namespaceExport.getName()

            // Check if namespace name matches entrypoint name (case-insensitive)
            if (nsName.toLowerCase() === expectedNsName.toLowerCase()) {
              // Check if namespace export points to the barrel file
              const nsReferencedFile = exportDecl.getModuleSpecifierSourceFile()
              if (nsReferencedFile && nsReferencedFile.getFilePath() === sourceFile.getFilePath()) {
                // This is a drillable namespace!
                isDrillableNamespace = true
                // Keep actualSourceFile as the barrel file ($$.ts), not the namespace wrapper
                // We want to extract the barrel's contents, just use the wrapper's JSDoc
                // Extract JSDoc from the namespace export declaration
                const jsdoc = parseJSDoc(exportDecl)
                namespaceDescription = jsdoc.description
                namespaceCategory = jsdoc.category
                break
              }
            }
          }
        }
      }
    }

    // Extract module
    // For drillable namespaces, use the barrel file path; otherwise use the main entrypoint path
    const locationPath = isDrillableNamespace
      ? actualSourceFile.getFilePath().replace(projectRoot, '').replace(/^\//, '')
      : sourcePath
    const relativeSourcePath = locationPath.replace(/^\.\//, '')
    let module = extractModuleFromFile(actualSourceFile, S.decodeSync(FsLoc.RelFile.String)(relativeSourcePath))

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
    : Object.entries(exportsField) // Extract ALL by default

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

    // Check for Drillable Namespace Pattern
    // Detection criteria vary by entrypoint type:
    //
    // For main entrypoint '.':
    // 1. Main entrypoint has namespace export: export * as Name from './path'
    // 2. Namespace name (PascalCase) converts to kebab-case
    // 3. Subpath export ./kebab-name exists in package.json
    // 4. Both namespace export and subpath export resolve to same source file
    //
    // For subpath entrypoints (e.g., './arr'):
    // 1. Check if sibling $.ts file exists (e.g., arr/$.ts when entrypoint points to arr/$$.ts)
    // 2. Check if $.ts has namespace export matching the entrypoint name
    // 3. Check if namespace export points to the entrypoint's target file
    // 4. If so, use $.ts as source and mark as drillable
    let actualSourceFile = sourceFile
    let namespaceDescription: string | undefined
    let namespaceCategory: string | undefined
    let isDrillableNamespace = false

    if (packagePath === '.') {
      const exportDeclarations = sourceFile.getExportDeclarations()

      for (const exportDecl of exportDeclarations) {
        const namespaceExport = exportDecl.getNamespaceExport()
        if (!namespaceExport) continue

        // Get namespace name (PascalCase, e.g., 'A')
        const nsName = namespaceExport.getName()

        // Convert to kebab-case (e.g., 'A' -> 'a', 'FooBar' -> 'foo-bar')
        const kebabName = Str.Case.kebab(nsName)
        const subpathKey = `./${kebabName}`

        // Check if matching subpath exists in exports
        if (!(subpathKey in exportsField)) continue

        // Resolve the file that the namespace export points to
        const nsReferencedFile = exportDecl.getModuleSpecifierSourceFile()
        if (!nsReferencedFile) continue

        const nsFilePath = nsReferencedFile.getFilePath()

        // Resolve the file that the subpath export points to
        const subpathBuildPath = exportsField[subpathKey]
        if (!subpathBuildPath) continue
        const subpathSourcePath = buildToSourcePath(subpathBuildPath)
        const subpathAbsolutePath = join(projectRoot, subpathSourcePath)
        const subpathFile = project.getSourceFile(subpathAbsolutePath)
        if (!subpathFile) continue

        const subpathFilePath = subpathFile.getFilePath()

        // If both resolve to the same file, it's drillable!
        if (nsFilePath === subpathFilePath) {
          isDrillableNamespace = true
          actualSourceFile = nsReferencedFile
          // Extract JSDoc from the namespace export declaration
          const jsdoc = parseJSDoc(exportDecl)
          namespaceDescription = jsdoc.description
          namespaceCategory = jsdoc.category
          break
        }
      }
    } else {
      // For subpath entrypoints, check if there's a sibling $.ts file with matching namespace export
      // Example: './arr' points to 'arr/$$.ts', check if 'arr/$.ts' exists with 'export * as Arr from "./$$.js"'
      const sourceFileDir = sourceFile.getDirectory()
      const sourceStem = sourceFile.getBaseNameWithoutExtension()

      // Check if this is a barrel file ($$.ts)
      if (sourceStem === '$$') {
        const siblingNamespaceFile = sourceFileDir.getSourceFile('$.ts')

        if (siblingNamespaceFile) {
          // Check if the namespace file has a namespace export matching the entrypoint name
          const exportDeclarations = siblingNamespaceFile.getExportDeclarations()

          // Extract expected namespace name from packagePath (e.g., './arr' -> 'Arr')
          const expectedNsName = Str.Case.pascal(packagePath.replace(/^\.\//, ''))

          for (const exportDecl of exportDeclarations) {
            const namespaceExport = exportDecl.getNamespaceExport()
            if (!namespaceExport) continue

            const nsName = namespaceExport.getName()

            // Check if namespace name matches entrypoint name (case-insensitive)
            if (nsName.toLowerCase() === expectedNsName.toLowerCase()) {
              // Check if namespace export points to the barrel file
              const nsReferencedFile = exportDecl.getModuleSpecifierSourceFile()
              if (nsReferencedFile && nsReferencedFile.getFilePath() === sourceFile.getFilePath()) {
                // This is a drillable namespace!
                isDrillableNamespace = true
                // Keep actualSourceFile as the barrel file ($$.ts), not the namespace wrapper
                // We want to extract the barrel's contents, just use the wrapper's JSDoc
                // Extract JSDoc from the namespace export declaration
                const jsdoc = parseJSDoc(exportDecl)
                namespaceDescription = jsdoc.description
                namespaceCategory = jsdoc.category
                break
              }
            }
          }
        }
      }
    }

    // Extract module (no longer needs module name)
    // For drillable namespaces, use the barrel file path; otherwise use the main entrypoint path
    const locationPath = isDrillableNamespace
      ? actualSourceFile.getFilePath().replace(projectRoot, '').replace(/^\//, '')
      : sourcePath
    const relativeSourcePath = locationPath.replace(/^\.\//, '')
    let module = extractModuleFromFile(actualSourceFile, S.decodeSync(FsLoc.RelFile.String)(relativeSourcePath))

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
