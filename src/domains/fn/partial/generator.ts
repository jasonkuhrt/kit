import { CallSignatureDeclaration, InterfaceDeclaration, Project, SourceFile, ts } from 'ts-morph'

/**
 * Configuration for the partialize generator
 */
export interface PartializeConfig {
  /**
   * The directive comment to look for
   * @default '@partialize'
   */
  directive?: string
  /**
   * Whether to generate helper interfaces
   * @default true
   */
  generateHelpers?: boolean
}

const DEFAULT_CONFIG: Required<PartializeConfig> = {
  directive: '@partialize',
  generateHelpers: true,
}

// Fence constants
const GENERATED_START = '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ @partialize-start'
const GENERATED_END = '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ @partialize-end'
const SECTION_DIVIDER_POSITIONAL = '┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Positional arguments'
const HELPER_GENERATED = '@partialize-helper'

/**
 * Generate partialize interfaces for a TypeScript project
 *
 * @param project - The ts-morph Project instance
 * @param filePaths - Array of file paths to process
 * @param config - Optional configuration
 *
 * @example
 * ```ts
 * import { Project } from 'ts-morph'
 * import { Fn } from '#fn'
 *
 * const project = new Project({
 *   tsConfigFilePath: './tsconfig.json'
 * })
 *
 * await Fn.Partial.generate(project, ['src/my-interface.ts'])
 * ```
 */
export async function generate(
  project: Project,
  filePaths: string[],
  config: PartializeConfig = {},
): Promise<void> {
  const cfg = { ...DEFAULT_CONFIG, ...config }

  for (const filePath of filePaths) {
    const sourceFile = project.addSourceFileAtPath(filePath)
    await processSourceFile(sourceFile, cfg)
    await sourceFile.save()
  }
}

/**
 * Generate partialize interfaces for a single source file
 *
 * @param sourceFile - The source file to process
 * @param config - Optional configuration
 *
 * @example
 * ```ts
 * import { Project } from 'ts-morph'
 * import { Fn } from '#fn'
 *
 * const project = new Project()
 * const sourceFile = project.createSourceFile('example.ts', `
 *   // @partialize
 *   export interface Add<N> {
 *     (a: N, b: N): N
 *   }
 * `)
 *
 * await Fn.Partial.generateForFile(sourceFile)
 * ```
 */
export async function generateForFile(
  sourceFile: SourceFile,
  config: PartializeConfig = {},
): Promise<void> {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  await processSourceFile(sourceFile, cfg)
}

/**
 * Process a single source file
 */
async function processSourceFile(
  sourceFile: SourceFile,
  config: Required<PartializeConfig>,
): Promise<void> {
  const interfaces = sourceFile.getInterfaces()

  for (const interfaceDecl of interfaces) {
    const leadingComment = interfaceDecl.getLeadingCommentRanges()
      .map(range => range.getText())
      .find(text => text.includes(config.directive))

    if (!leadingComment) continue

    // Remove existing generated section first
    const interfaceName = interfaceDecl.getName()!
    removeGeneratedSection(interfaceDecl)

    // Re-find the interface after modification
    const updatedInterface = sourceFile.getInterface(interfaceName)
    if (!updatedInterface) continue

    // Extract the base signature
    const baseSignature = updatedInterface.getCallSignatures()[0]
    if (!baseSignature) {
      console.warn(`No call signature found for ${interfaceName}`)
      continue
    }

    // Generate new overloads
    const newSignatures = generateOverloads(updatedInterface, baseSignature)

    // Add generated section
    addGeneratedSection(updatedInterface, newSignatures)

    // Generate helper interfaces if needed
    if (config.generateHelpers) {
      generateHelperInterfaces(sourceFile, updatedInterface)
    }
  }
}

/**
 * Remove existing generated sections from an interface
 */
function removeGeneratedSection(interfaceDecl: InterfaceDeclaration): void {
  const currentText = interfaceDecl.getText()

  // Find the generated section
  const startMarker = '@partialize-start'
  const endMarker = '@partialize-end'

  const startIndex = currentText.indexOf(startMarker)
  const endIndex = currentText.indexOf(endMarker)

  if (startIndex !== -1 && endIndex !== -1) {
    // Find the start of the line containing the start marker
    let lineStart = startIndex
    while (lineStart > 0 && currentText[lineStart - 1] !== '\n') {
      lineStart--
    }

    // Find the end of the line containing the end marker
    let lineEnd = endIndex + endMarker.length
    while (lineEnd < currentText.length && currentText[lineEnd] !== '\n') {
      lineEnd++
    }
    if (lineEnd < currentText.length) lineEnd++ // Include the newline

    // Extract text before and after the generated section
    const beforeGenerated = currentText.substring(0, lineStart)
    const afterGenerated = currentText.substring(lineEnd)

    // Reconstruct the interface without the generated section
    const cleanedText = beforeGenerated + afterGenerated
    interfaceDecl.replaceWithText(cleanedText)
  }
}

/**
 * Generate overload signatures for partial application
 */
function generateOverloads(
  interfaceDecl: InterfaceDeclaration,
  baseSignature: CallSignatureDeclaration,
): string[] {
  const interfaceName = interfaceDecl.getName()!
  const typeParams = interfaceDecl.getTypeParameters()
  const interfaceTypeParams = typeParams.map(tp => tp.getName())

  // Extract parameters from the signature
  const params = baseSignature.getParameters()
  const signatureTypeParams = baseSignature.getTypeParameters()

  if (params.length === 0) {
    return [] // No partial application for zero-parameter functions
  }

  // Get JSDoc from the base signature
  const jsdoc = baseSignature.getJsDocs()[0]?.getInnerText()?.trim()
  const lines: string[] = []

  // Generate all possible combinations of holes (_) and actual parameters
  const paramCount = params.length
  const totalCombinations = Math.pow(2, paramCount)

  for (let i = 0; i < totalCombinations; i++) {
    if (i === totalCombinations - 1) continue // Skip the all-params-provided case (original signature)

    const holes = new Set<number>()
    for (let j = 0; j < paramCount; j++) {
      if ((i & (1 << j)) === 0) {
        holes.add(j)
      }
    }

    // Build the signature
    const typeParamStrings: string[] = []
    const paramStrings: string[] = []
    const helperTypeArgs: string[] = []

    signatureTypeParams.forEach((tp, idx) => {
      const param = params[idx]
      if (!holes.has(idx) && param) {
        const paramName = param.getName()
        const constraint = tp.getConstraint()?.getText() || tp.getDefault()?.getText() || 'unknown'
        typeParamStrings.push(`${paramName} extends ${constraint}`)
        helperTypeArgs.push(paramName)
      }
    })

    params.forEach((param, idx) => {
      const paramName = param.getName()

      if (holes.has(idx)) {
        paramStrings.push(`${paramName}: _`)
      } else {
        paramStrings.push(`${paramName}: ${paramName}`)
      }
    })

    // Determine the return type
    let returnType: string
    if (i === 0) {
      // All holes - return the original interface
      returnType = `${interfaceName}<${interfaceTypeParams.join(', ')}>`
    } else if (helperTypeArgs.length === params.length - 1) {
      // One hole left - return the final result type
      returnType = baseSignature.getReturnTypeNode()?.getText() || 'unknown'
    } else {
      // Multiple holes - return a helper interface
      const helperIndex = params.length - holes.size
      returnType = `${interfaceName}${helperIndex}<${[...interfaceTypeParams, ...helperTypeArgs].join(', ')}>`
    }

    // Build the complete signature
    if (jsdoc) {
      lines.push('  /**')
      jsdoc.split('\n').forEach(line => {
        lines.push(`   * ${line.trim()}`)
      })
      lines.push('   */')
    }

    const signature = typeParamStrings.length > 0
      ? `  <${typeParamStrings.join(', ')}>(${paramStrings.join(', ')}): ${returnType}`
      : `  (${paramStrings.join(', ')}): ${returnType}`

    lines.push(signature)
  }

  return lines
}

/**
 * Add generated section to interface
 */
function addGeneratedSection(
  interfaceDecl: InterfaceDeclaration,
  signatures: string[],
): void {
  if (signatures.length === 0) return

  const lines: string[] = []
  lines.push('')
  lines.push(`  // ${GENERATED_START}`)
  lines.push(`  // ${SECTION_DIVIDER_POSITIONAL}`)
  signatures.forEach(sig => lines.push(sig))
  lines.push(`  // ${GENERATED_END}`)

  // Insert at the end of the interface
  interfaceDecl.addMember(lines.join('\n'))
}

/**
 * Generate helper interfaces for partial application
 */
function generateHelperInterfaces(
  sourceFile: SourceFile,
  interfaceDecl: InterfaceDeclaration,
): void {
  const interfaceName = interfaceDecl.getName()!
  const typeParams = interfaceDecl.getTypeParameters()
  const interfaceTypeParams = typeParams.map(tp => ensureDollarPrefix(tp.getName()))
  const baseSignature = interfaceDecl.getCallSignatures()[0]
  if (!baseSignature) return

  const params = baseSignature.getParameters()
  if (params.length <= 1) return // No helpers needed for 0 or 1 parameter functions

  // Check if helpers already exist
  const existingHelpers = sourceFile.getInterfaces()
    .filter(i => {
      const name = i.getName()
      return name?.startsWith(interfaceName) && /\d+$/.test(name)
    })

  if (existingHelpers.length > 0) return // Helpers already exist

  const lines: string[] = []

  // Generate helper interfaces for each level of partial application
  for (let applied = 1; applied < params.length; applied++) {
    const knownTypeParams: string[] = []

    for (let i = 0; i < applied; i++) {
      knownTypeParams.push(`$Known${String(i + 1)}`)
    }

    const helperTypeParams = [...interfaceTypeParams, ...knownTypeParams]

    lines.push('')
    lines.push(`// ${HELPER_GENERATED}`)
    lines.push(`// dprint-ignore`)
    lines.push(`interface ${interfaceName}${applied}<${helperTypeParams.join(', ')}> {`)

    // TODO: Generate proper signatures for the helper interface
    // This would involve analyzing which parameters are already applied
    // and generating the appropriate signatures for the remaining parameters

    lines.push(`}`)
  }

  if (lines.length > 0) {
    sourceFile.addStatements(lines.join('\n'))
  }
}

/**
 * Ensure type parameter names have $ prefix (Kit convention for data structures)
 */
function ensureDollarPrefix(name: string): string {
  return name.startsWith('$') ? name : `$${name}`
}

/**
 * Create a ts-morph Project from a TypeScript Program
 *
 * @param program - TypeScript compiler program
 * @returns A ts-morph Project instance
 *
 * @example
 * ```ts
 * import ts from 'typescript'
 * import { Fn } from '#fn'
 *
 * const program = ts.createProgram(['src/index.ts'], {})
 * const project = Fn.Partial.createProjectFromProgram(program)
 * ```
 */
export function createProjectFromProgram(program: ts.Program): Project {
  const project = new Project({
    compilerOptions: program.getCompilerOptions(),
    useInMemoryFileSystem: false,
  })

  // Add source files from the program
  const sourceFiles = program.getSourceFiles()
  for (const tsSourceFile of sourceFiles) {
    if (!tsSourceFile.isDeclarationFile) {
      project.addSourceFileAtPath(tsSourceFile.fileName)
    }
  }

  return project
}
