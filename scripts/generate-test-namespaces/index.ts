#!/usr/bin/env tsx
/**
 * Generate type-level test namespace files with ESM exports.
 *
 * Creates ~40 files with full JSDoc for each matcher combination.
 * Limited to 1 extractor depth to avoid combinatorial explosion.
 *
 * Optimizes for:
 * 1. Quality JSDoc for inline user help
 * 2. TypeScript compiler performance (direct definitions)
 * 3. Maintainability (single source of truth)
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { Project } from 'ts-morph'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Data Structures

interface Matcher {
  name: string // e.g., 'string'
  typeExpr: string // e.g., 'string'
  description: string
}

interface Extractor {
  name: string // e.g., 'awaited'
  kindName: string // e.g., 'Awaited$'
  description: string
  inputDesc: string // e.g., 'Promise<T>'
  outputDesc: string // e.g., 'T'
}

interface Relator {
  name: string // e.g., 'exact'
  kindName: string // e.g., 'ExactKind'
  description: string
  passExample: string
  failExample: string
}

interface Combination {
  extractors: Extractor[]
  relator: Relator
  negated: boolean
  outputPath: string
  isBarrel: boolean
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Constants

const MATCHERS: Matcher[] = [
  { name: 'of', typeExpr: '$Expected', description: 'any expected type' },
  { name: 'string', typeExpr: 'string', description: 'string' },
  { name: 'number', typeExpr: 'number', description: 'number' },
  { name: 'bigint', typeExpr: 'bigint', description: 'bigint' },
  { name: 'boolean', typeExpr: 'boolean', description: 'boolean' },
  { name: 'true', typeExpr: 'true', description: 'true' },
  { name: 'false', typeExpr: 'false', description: 'false' },
  { name: 'undefined', typeExpr: 'undefined', description: 'undefined' },
  { name: 'null', typeExpr: 'null', description: 'null' },
  { name: 'symbol', typeExpr: 'symbol', description: 'symbol' },
  { name: 'Date', typeExpr: 'Date', description: 'Date' },
  { name: 'RegExp', typeExpr: 'RegExp', description: 'RegExp' },
  { name: 'Error', typeExpr: 'Error', description: 'Error' },
  { name: 'unknown', typeExpr: 'unknown', description: 'unknown' },
  { name: 'any', typeExpr: 'any', description: 'any' },
  { name: 'never', typeExpr: 'never', description: 'never' },
]

/**
 * Extractor metadata (descriptions for JSDoc generation).
 * The list of extractors comes from the registry - this only provides documentation.
 */
const EXTRACTOR_METADATA: Record<string, { description: string; inputDesc: string; outputDesc: string }> = {
  awaited: {
    description: 'extracts the resolved type from a Promise',
    inputDesc: 'Promise<T>',
    outputDesc: 'T',
  },
  returned: {
    description: 'extracts the return type from a function',
    inputDesc: '(...args: any[]) => T',
    outputDesc: 'T',
  },
  array: {
    description: 'extracts the element type from an array',
    inputDesc: 'T[]',
    outputDesc: 'T',
  },
  parameters: {
    description: 'extracts the parameters tuple from a function',
    inputDesc: '(...args: any[]) => T',
    outputDesc: 'Parameters<Function>',
  },
  parameter1: {
    description: 'extracts the first parameter type from a function',
    inputDesc: '(p1: T, ...) => any',
    outputDesc: 'T',
  },
  parameter2: {
    description: 'extracts the second parameter type from a function',
    inputDesc: '(p1: any, p2: T, ...) => any',
    outputDesc: 'T',
  },
  parameter3: {
    description: 'extracts the third parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: T, ...) => any',
    outputDesc: 'T',
  },
  parameter4: {
    description: 'extracts the fourth parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: any, p4: T, ...) => any',
    outputDesc: 'T',
  },
  parameter5: {
    description: 'extracts the fifth parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: any, p4: any, p5: T) => any',
    outputDesc: 'T',
  },
}

const RELATORS: Record<string, Relator> = {
  exact: {
    name: 'exact',
    kindName: 'AssertExactKind',
    description: 'exact structural equality',
    passExample: 'string extends string',
    failExample: '"hello" not exact match for string',
  },
  equiv: {
    name: 'equiv',
    kindName: 'AssertEquivKind',
    description: 'mutual assignability (equivalent types)',
    passExample: 'string & {} ≡ string',
    failExample: 'string not equivalent to number',
  },
  sub: {
    name: 'sub',
    kindName: 'AssertSubKind',
    description: 'subtype relation (extends)',
    passExample: '"hello" extends string',
    failExample: 'string does not extend "hello"',
  },
}

interface UnaryRelator {
  name: string
  kindName: string
  description: string
  passExample: string
  failExample: string
}

const UNARY_RELATORS: Record<string, UnaryRelator> = {
  any: {
    name: 'any',
    kindName: 'AssertAnyKind',
    description: 'asserts type is `any`',
    passExample: 'type _ = Assert.any<any>',
    failExample: 'type _ = Assert.any<string>',
  },
  unknown: {
    name: 'unknown',
    kindName: 'AssertUnknownKind',
    description: 'asserts type is `unknown`',
    passExample: 'type _ = Assert.unknown<unknown>',
    failExample: 'type _ = Assert.unknown<string>',
  },
  never: {
    name: 'never',
    kindName: 'AssertNeverKind',
    description: 'asserts type is `never`',
    passExample: 'type _ = Assert.never<never>',
    failExample: 'type _ = Assert.never<string>',
  },
  empty: {
    name: 'empty',
    kindName: 'AssertEmptyKind',
    description: "asserts type is empty (`[]`, `''`, or `Record<PropertyKey, never>`)",
    passExample: 'type _ = Assert.empty<[]>',
    failExample: 'type _ = Assert.empty<[1]>',
  },
}

const OUTPUT_DIR = path.join(process.cwd(), 'src/utils/assert/builder-generated')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Registry Loading

/**
 * Load extractor registry from TypeScript source using ts-morph.
 * Returns a map of extractor names to their Kind interface names.
 */
function loadExtractorRegistry(): Record<string, string> {
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
  })

  const registryFilePath = path.join(process.cwd(), 'src/utils/lens/registry.ts')
  const sourceFile = project.addSourceFileAtPath(registryFilePath)

  // Find the LensRegistry interface
  const registryInterface = sourceFile.getInterface('LensRegistry')
  if (!registryInterface) {
    throw new Error('LensRegistry interface not found in registry.ts')
  }

  const registry: Record<string, string> = {}

  // Extract each property: name → Kind interface name
  for (const property of registryInterface.getProperties()) {
    const extractorName = property.getName()
    const typeNode = property.getTypeNode()

    if (!typeNode) {
      throw new Error(`Property ${extractorName} has no type annotation`)
    }

    const kindName = typeNode.getText()
    registry[extractorName] = kindName
  }

  return registry
}

/**
 * Validate that extractor metadata covers all registry entries.
 * Throws error if metadata is missing for any registry entry.
 */
function validateExtractorMetadata(registry: Record<string, string>): void {
  const registryNames = Object.keys(registry).sort()
  const metadataNames = Object.keys(EXTRACTOR_METADATA).sort()

  // Check for missing metadata
  const missingMetadata = registryNames.filter((name) => !(name in EXTRACTOR_METADATA))
  if (missingMetadata.length > 0) {
    throw new Error(
      `Extractors in registry missing metadata: ${missingMetadata.join(', ')}\n`
        + `Add metadata for these extractors in EXTRACTOR_METADATA constant.`,
    )
  }

  // Warn about unused metadata (not in registry)
  const unusedMetadata = metadataNames.filter((name) => !(name in registry))
  if (unusedMetadata.length > 0) {
    console.warn('⚠️  Metadata exists but not in registry:', unusedMetadata)
    console.warn('   These entries can be removed from EXTRACTOR_METADATA')
  }
}

// Load and validate registry
const REGISTRY = loadExtractorRegistry()
validateExtractorMetadata(REGISTRY)

/**
 * Build EXTRACTORS from registry + metadata.
 * This ensures the registry is the source of truth for which extractors exist.
 */
const EXTRACTORS: Record<string, Extractor> = Object.fromEntries(
  Object.entries(REGISTRY).map(([name, kindName]) => {
    const metadata = EXTRACTOR_METADATA[name]
    if (!metadata) {
      throw new Error(`Extractor '${name}' is in registry but has no metadata`)
    }
    return [
      name,
      {
        name,
        kindName,
        description: metadata.description,
        inputDesc: metadata.inputDesc,
        outputDesc: metadata.outputDesc,
      },
    ]
  }),
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Path Utilities

function getRelativePath(from: string, to: string): string {
  const rel = path.relative(path.dirname(from), to)
  // Ensure .js extension and proper ./ prefix
  return rel.startsWith('.') ? rel : `./${rel}`
}

function calculateImportPaths(combo: Combination) {
  // Calculate proper relative paths from source to target files
  const sourceFile = combo.outputPath
  const srcDir = path.join(process.cwd(), 'src/utils')

  const lensPath = getRelativePath(sourceFile, path.join(srcDir, 'lens/__.js'))
  const relatorsPath = getRelativePath(sourceFile, path.join(srcDir, 'assert/asserts.js'))
  const builderPath = getRelativePath(sourceFile, path.join(srcDir, 'assert/builder-singleton.js'))

  return { lensPath, relatorsPath, builderPath }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Template Generation

function generateFileHeader(combo: Combination): string {
  const { lensPath, relatorsPath, builderPath } = calculateImportPaths(combo)

  const extractorImports = combo.extractors.length > 0
    ? `import { Lens } from '#lens'\n`
    : ''

  const eitherImport = combo.extractors.length > 0
    ? `import type { Either } from 'effect'\n`
    : ''

  // Add noExcess kinds for sub/equiv
  const relatorKinds = [combo.relator.kindName]
  if (!combo.negated && combo.relator.name === 'sub') {
    relatorKinds.push('AssertSubNoExcessKind')
  } else if (!combo.negated && combo.relator.name === 'equiv') {
    relatorKinds.push('AssertEquivNoExcessKind')
  }

  return `import type { Fn } from '#fn'
${extractorImports}${eitherImport}import type { ${relatorKinds.join(', ')} } from '${relatorsPath}'
import { builder } from '${builderPath}'
`
}

function generateFileLevelJSDoc(combo: Combination): string {
  const extractorChain = combo.extractors.length > 0
    ? combo.extractors.map((e) => e.description).join(', then ')
    : 'no extraction'

  const extractorNames = combo.extractors.length > 0
    ? combo.extractors.map((e) => e.name).join(' + ')
    : 'base'

  return `
/**
 * ${extractorNames} + ${combo.relator.name} relation matchers.
 *
 * ${combo.extractors.length > 0 ? `Extraction: ${extractorChain}` : 'Direct type assertion'}
 * Relation: ${combo.relator.description}
 */
`
}

/**
 * Convert HKT kind name to direct type name.
 * e.g., "Awaited.$Get" → "Awaited.Get"
 */
function kindToDirectType(kindName: string): string {
  return kindName.replace('.$Get', '.Get')
}

function buildExtractorChain(extractors: Extractor[], actualType: string): string {
  if (extractors.length === 0) return actualType

  // Use direct type application instead of HKT
  // e.g., Lens.Awaited.Get<$Actual> instead of Fn.Kind.Apply<Lens.Awaited.$Get, [$Actual]>
  return extractors.reduce(
    (inner, extractor) => `Lens.${kindToDirectType(extractor.kindName)}<${inner}>`,
    actualType,
  )
}

function buildRuntimeChain(combo: Combination, matcherName: string): string {
  // Build the builder access chain: builder.${extractors}.${not?}.${relator}.${matcher}
  const parts = [
    'builder',
    ...combo.extractors.map((e) => e.name),
  ]

  // Insert 'not' before relator if negated
  if (combo.negated) {
    parts.push('not')
  }

  parts.push(combo.relator.name, matcherName)

  return parts.join('.')
}

function generateMatcherJSDoc(matcher: Matcher, combo: Combination): string {
  const extractorChain = combo.extractors.length > 0
    ? `\n * Extraction chain: ${combo.extractors.map((e) => `${e.inputDesc} → ${e.outputDesc}`).join(' → ')}`
    : ''

  const matcherDesc = matcher.name === 'of'
    ? 'Base matcher accepting any expected type'
    : `Pre-curried matcher for ${matcher.description}`

  // For 'of', add note about type-level shorthand
  const typeShorthandNote = matcher.name === 'of'
    ? `\n *\n * Note: This exists for symmetry with the value-level API.\n * At the type-level, you can omit \`.of\` for simpler syntax (e.g., \`${combo.relator.name}<E, A>\` instead of \`${combo.relator.name}.of<E, A>\`).`
    : ''

  // Generate example type for this specific combination
  const exampleType = generateExampleType(matcher, combo)

  return `
/**
 * ${matcherDesc}.${extractorChain}${typeShorthandNote}
 *
 * @example
 * \`\`\`typescript
 * // ✓ Pass
 * type _ = ${exampleType.pass}
 *
 * // ✗ Fail
 * type _ = ${exampleType.fail}
 * \`\`\`
 */`
}

function generateExampleType(matcher: Matcher, combo: Combination): { pass: string; fail: string } {
  const prefix = ['Assert', ...combo.extractors.map((e) => e.name), combo.relator.name].join('.')

  if (matcher.name === 'of') {
    // For 'of', show generic example
    const passActual = buildExampleActual(combo.extractors, 'string')
    const failActual = buildExampleActual(combo.extractors, 'number')
    return {
      pass: `${prefix}.of<string, ${passActual}>`,
      fail: `${prefix}.of<string, ${failActual}>`,
    }
  }

  // For pre-curried matchers
  const passActual = buildExampleActual(combo.extractors, matcher.typeExpr)
  const failActual = buildExampleActual(
    combo.extractors,
    matcher.typeExpr === 'string' ? 'number' : 'string',
  )

  return {
    pass: `${prefix}.${matcher.name}<${passActual}>`,
    fail: `${prefix}.${matcher.name}<${failActual}>`,
  }
}

function buildExampleActual(extractors: Extractor[], innerType: string): string {
  return extractors.reduceRight((inner, extractor) => {
    if (extractor.name === 'awaited') return `Promise<${inner}>`
    if (extractor.name === 'returned') return `() => ${inner}`
    if (extractor.name === 'array') return `${inner}[]`
    if (extractor.name === 'parameters') return `(...args: any[]) => ${inner}`
    if (extractor.name.startsWith('parameter')) return `(arg: ${inner}) => any`
    return inner
  }, innerType)
}

function generateMatcherType(matcher: Matcher, combo: Combination): string {
  const extractorChain = buildExtractorChain(combo.extractors, '$Actual')

  const expectedType = matcher.name === 'of' ? '$Expected' : matcher.typeExpr
  const negatedParam = combo.negated ? ', true' : ''

  let typeDef: string
  if (combo.extractors.length > 0) {
    // Inline Either unwrapping with intermediate type parameter
    const typeParams = matcher.name === 'of'
      ? '<$Expected, $Actual, __$ActualExtracted = ' + extractorChain + '>'
      : '<$Actual, __$ActualExtracted = ' + extractorChain + '>'

    typeDef = `// dprint-ignore\ntype ${matcher.name}_${typeParams} =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<${combo.relator.kindName}, [${expectedType}, __actual__${negatedParam}]>
                                                                         : never`
  } else {
    // No extractors - direct application
    const typeParams = matcher.name === 'of' ? '<$Expected, $Actual>' : '<$Actual>'
    typeDef =
      `type ${matcher.name}_${typeParams} = Fn.Kind.Apply<${combo.relator.kindName}, [${expectedType}, $Actual${negatedParam}]>`
  }

  // Pre-configured matchers are already functions in BuilderMatchers interface
  // No need to chain .on - they're accessed directly from builder
  const runtimeChain = buildRuntimeChain(combo, matcher.name)
  const constDef = `const ${matcher.name}_ = ${runtimeChain}`

  return `${typeDef}\n${constDef}`
}

function generateExports(matchers: Matcher[], combo: Combination): string {
  const matcherExports = matchers.map((m) => `${m.name}_ as ${m.name}`).join(',\n  ')

  // Add noExcess exports for sub/equiv (not for exact when negated)
  let noExcessExports = ''
  if (!combo.negated && (combo.relator.name === 'sub' || combo.relator.name === 'equiv')) {
    noExcessExports = ',\n  noExcess_ as noExcess,\n  noExcessAs_ as noExcessAs'
  } else if (combo.relator.name === 'exact') {
    noExcessExports = ',\n  noExcess_ as noExcess'
  }

  return `export {
  ${matcherExports},
  ofAs_ as ofAs${noExcessExports},
}`
}

function generateMatcherFile(combo: Combination): string {
  const header = generateFileHeader(combo)
  const fileLevelDoc = generateFileLevelJSDoc(combo)
  const matchers = MATCHERS.map((m) => {
    const jsdoc = generateMatcherJSDoc(m, combo)
    const typeDef = generateMatcherType(m, combo)
    return `${jsdoc}\n${typeDef}`
  }).join('\n\n')

  // Add ofAs const declaration - returns builder (not function, so no .on chain)
  const ofAsConst = `const ofAs_ = <$Type>() => ${buildRuntimeChain(combo, 'ofAs')}<$Type>()`

  // Add noExcess/noExcessAs for sub and equiv relators (not for exact, not for negated)
  let noExcessDecls = ''
  if (!combo.negated && (combo.relator.name === 'sub' || combo.relator.name === 'equiv')) {
    const extractorChain = buildExtractorChain(combo.extractors, '$Actual')
    const noExcessKind = combo.relator.name === 'sub' ? 'AssertSubNoExcessKind' : 'AssertEquivNoExcessKind'

    if (combo.extractors.length > 0) {
      noExcessDecls = `
/**
 * No-excess variant of ${combo.relator.name} relation.
 * Checks that actual has no excess properties beyond expected.
 */
// dprint-ignore
type noExcess_<
  $Expected,
  $Actual,
  __$ActualExtracted = ${extractorChain},
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<${noExcessKind}, [$Expected, __actual__]>
                                                                         : never
const noExcess_ = ${buildRuntimeChain(combo, 'noExcess')}
const noExcessAs_ = <$Type>() => ${buildRuntimeChain(combo, 'noExcessAs')}<$Type>()`
    } else {
      noExcessDecls = `
/**
 * No-excess variant of ${combo.relator.name} relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<${noExcessKind}, [$Expected, $Actual]>
const noExcess_ = ${buildRuntimeChain(combo, 'noExcess')}
const noExcessAs_ = <$Type>() => ${buildRuntimeChain(combo, 'noExcessAs')}<$Type>()`
    }
  } else if (combo.relator.name === 'exact') {
    // For exact, noExcess is never (just reference it from builder for completeness)
    noExcessDecls = `\ntype noExcess_ = never\nconst noExcess_ = ${buildRuntimeChain(combo, 'noExcess')}`
  }

  const exports = generateExports(MATCHERS, combo)

  return `${header}${fileLevelDoc}
${matchers}

${ofAsConst}${noExcessDecls}

${exports}
`
}

function generateBarrelFile(dirPath: string, exports: string[]): string {
  // Determine if each export is a file or a directory based on our data structures
  // Extractors are directories (have their own barrel files)
  // Relators are files
  // 'not' is a special directory
  const relPaths = exports.map((name) => {
    if (name in EXTRACTORS) return `./${name}/__.js`
    if (name === 'not') return `./${name}/__.js`
    return `./${name}.js`
  })

  // Use export * as to re-export dual namespaces from child modules
  const reExports = exports
    .map((name, i) => `export * as ${name} from '${relPaths[i]}'`)
    .join('\n')

  // Add type-level shorthand for relators (main barrel only has base relators, no extractors)
  const srcDir = path.join(process.cwd(), 'src/utils')
  const relatorsPath = getRelativePath(dirPath, path.join(srcDir, 'assert/asserts.js'))
  const builderPath = getRelativePath(dirPath, path.join(srcDir, 'assert/builder-singleton.js'))

  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type { Fn } from '#fn'
import { builder } from '${builderPath}'
import type { ${relatorKinds} } from '${relatorsPath}'`

  // Root-level unary relator exports
  const unaryRelatorExports = `
// Unary relators
export const any = builder.any
export const unknown = builder.unknown
export const never = builder.never
export const empty = builder.empty`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!
    return `export type ${relatorName}<$Expected, $Actual> = Fn.Kind.Apply<${relator.kindName}, [$Expected, $Actual]>`
  }).join('\n')

  return `${imports}

${reExports}${unaryRelatorExports}
${typeShorthands}
`
}

/**
 * Generate a barrel file for an extractor subdirectory.
 * Exports relators (type+value), 'not' namespace, and other extractors (value-only via builder proxy).
 */
function generateExtractorBarrelFile(extractorName: string, barrelPath: string): string {
  // Calculate relative paths
  const srcDir = path.join(process.cwd(), 'src/utils')
  const builderPath = getRelativePath(barrelPath, path.join(srcDir, 'assert/builder-singleton.js'))
  const relatorsPath = getRelativePath(barrelPath, path.join(srcDir, 'assert/asserts.js'))

  // Part 1: Export relators as dual namespaces (type+value)
  const relatorExports = Object.keys(RELATORS)
    .map((relator) => `export * as ${relator} from './${relator}.js'`)
    .join('\n')

  // Part 2: Export 'not' namespace (type+value)
  const notExport = `export * as not from './not/__.js'`

  // Part 3: Export other extractors as value-only builder proxy references
  const otherExtractors = Object.keys(EXTRACTORS).filter((name) => name !== extractorName)
  const extractorExports = otherExtractors.length > 0
    ? `\n// Value-level extractor chaining via builder proxy\n`
      + otherExtractors.map((name) => `export const ${name} = builder.${extractorName}.${name}`).join('\n')
    : ''

  // Part 3.5: Export unary relators from builder singleton
  const unaryRelatorExports = `
// Unary relators
export const any = builder.${extractorName}.any
export const unknown = builder.${extractorName}.unknown
export const never = builder.${extractorName}.never
export const empty = builder.${extractorName}.empty`

  // Part 4: Add type-level shorthand for relators (allows omitting .of)
  const extractor = EXTRACTORS[extractorName]!
  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type { Fn } from '#fn'
import { builder } from '${builderPath}'
import { Lens } from '#lens'
import type { Either } from 'effect'
import type { ${relatorKinds} } from '${relatorsPath}'`

  const extractorChain = `Lens.${kindToDirectType(extractor.kindName)}<$Actual>`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!
    return `// dprint-ignore\nexport type ${relatorName}<
  $Expected,
  $Actual,
  __$ActualExtracted = ${extractorChain},
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<${relator.kindName}, [$Expected, __actual__]>
                                                                         : never`
  }).join('\n\n')

  return `${imports}

${relatorExports}
${notExport}${extractorExports}${unaryRelatorExports}
${typeShorthands}
`
}

/**
 * Generate a barrel file for a 'not' subdirectory.
 * Exports only negated relators (type+value) with type-level shorthand.
 */
function generateNotBarrelFile(barrelPath: string, extractors: Extractor[]): string {
  // Calculate relative paths
  const srcDir = path.join(process.cwd(), 'src/utils')
  const relatorsPath = getRelativePath(barrelPath, path.join(srcDir, 'assert/asserts.js'))
  const builderPath = getRelativePath(barrelPath, path.join(srcDir, 'assert/builder-singleton.js'))

  // Export relators as dual namespaces (type+value)
  const relatorExports = Object.keys(RELATORS)
    .map((relator) => `export * as ${relator} from './${relator}.js'`)
    .join('\n')

  // Build the runtime chain for unary relators (builder.not.${extractor1}.${extractor2}.${unaryRelator})
  const extractorChainForRuntime = extractors.map((e) => e.name).join('.')
  const builderPrefix = extractorChainForRuntime ? `builder.not.${extractorChainForRuntime}` : 'builder.not'

  // Export unary relators from builder singleton
  const unaryRelatorExports = `
// Unary relators (negated)
export const any = ${builderPrefix}.any
export const unknown = ${builderPrefix}.unknown
export const never = ${builderPrefix}.never
export const empty = ${builderPrefix}.empty`

  // Add type-level shorthand for negated relators
  const extractorImports = extractors.length > 0
    ? `import { Lens } from '#lens'\nimport type { Either } from 'effect'\n`
    : ''
  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type { Fn } from '#fn'
import { builder } from '${builderPath}'
${extractorImports}import type { ${relatorKinds} } from '${relatorsPath}'`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!

    if (extractors.length > 0) {
      const extractorChain = buildExtractorChain(extractors, '$Actual')
      return `// dprint-ignore\nexport type ${relatorName}<
  $Expected,
  $Actual,
  __$ActualExtracted = ${extractorChain},
> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<${relator.kindName}, [$Expected, __actual__, true]>
                                                                         : never`
    } else {
      // No extractors
      return `export type ${relatorName}<$Expected, $Actual> = Fn.Kind.Apply<${relator.kindName}, [$Expected, $Actual, true]>`
    }
  }).join('\n\n')

  return `${imports}

${relatorExports}
${unaryRelatorExports}
${typeShorthands}
`
}

/**
 * Generate a unary relator file (any, unknown, never, empty).
 * These files provide both type-level and value-level assertions for edge types.
 */
function generateUnaryRelatorFile(unaryRelator: UnaryRelator, negated: boolean): string {
  const srcDir = path.join(process.cwd(), 'src/utils')
  const outputPath = negated
    ? path.join(OUTPUT_DIR, 'not', `${unaryRelator.name}.ts`)
    : path.join(OUTPUT_DIR, `${unaryRelator.name}.ts`)

  const relatorsPath = getRelativePath(outputPath, path.join(srcDir, 'assert/asserts.js'))
  const builderPath = getRelativePath(outputPath, path.join(srcDir, 'assert/builder-singleton.js'))

  const imports = `import type { Fn } from '#fn'
import { builder } from '${builderPath}'
import type { ${unaryRelator.kindName} } from '${relatorsPath}'`

  const description = negated
    ? unaryRelator.description.replace('asserts type is', 'asserts type is NOT')
    : unaryRelator.description

  const passExample = negated
    ? unaryRelator.failExample.replace('_ = Assert.', '_ = Assert.not.')
    : unaryRelator.passExample

  const failExample = negated
    ? unaryRelator.passExample.replace('_ = Assert.', '_ = Assert.not.')
    : unaryRelator.failExample

  const jsdoc = `
/**
 * Unary relator${negated ? ' (negated)' : ''} - ${description}.
 *
 * @example
 * \`\`\`typescript
 * // ✓ Pass
 * ${passExample}
 * Assert${negated ? '.not' : ''}.${unaryRelator.name}(value as ${negated ? 'string' : unaryRelator.name})
 *
 * // ✗ Fail
 * ${failExample}
 * Assert${negated ? '.not' : ''}.${unaryRelator.name}(value as ${negated ? unaryRelator.name : 'string'})
 * \`\`\`
 */`

  const negatedParam = negated ? ', true' : ''
  const typeDef =
    `type ${unaryRelator.name}_<$Actual> = Fn.Kind.Apply<${unaryRelator.kindName}, [$Actual${negatedParam}]>`
  const constDef = `const ${unaryRelator.name}_ = builder${negated ? '.not' : ''}.${unaryRelator.name}`
  const exportDef = `export { ${unaryRelator.name}_ as ${unaryRelator.name} }`

  return `${imports}

${jsdoc}
${typeDef}
${constDef}

${exportDef}
`
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Combination Generation

function generateAllCombinations(): Combination[] {
  const combinations: Combination[] = []

  // Helper to add both normal and negated versions
  const addBothVariants = (extractors: Extractor[], relator: Relator) => {
    const extractorPath = extractors.map((e) => e.name).join('/')
    const basePath = extractorPath ? `${extractorPath}/` : ''

    // Normal version
    combinations.push({
      extractors,
      relator,
      negated: false,
      outputPath: path.join(OUTPUT_DIR, basePath, `${relator.name}.ts`),
      isBarrel: false,
    })

    // Negated version (in 'not' subdirectory)
    combinations.push({
      extractors,
      relator,
      negated: true,
      outputPath: path.join(OUTPUT_DIR, basePath, 'not', `${relator.name}.ts`),
      isBarrel: false,
    })
  }

  // Base relators (no extractors)
  for (const relatorName of Object.keys(RELATORS)) {
    addBothVariants([], RELATORS[relatorName]!)
  }

  // Single extractors
  for (const extractorName of Object.keys(EXTRACTORS)) {
    for (const relatorName of Object.keys(RELATORS)) {
      addBothVariants([EXTRACTORS[extractorName]!], RELATORS[relatorName]!)
    }
  }

  // Chained extractors (2+ levels) - DISABLED to avoid combinatorial explosion
  // Type-level API limited to 1 extractor depth
  // Value-level API (via proxy) remains fully recursive
  // const extractorNames = Object.keys(EXTRACTORS)
  // for (const first of extractorNames) {
  //   for (const second of extractorNames) {
  //     if (first === second) continue
  //     for (const relatorName of Object.keys(RELATORS)) {
  //       addBothVariants([EXTRACTORS[first]!, EXTRACTORS[second]!], RELATORS[relatorName]!)
  //     }
  //   }
  // }

  return combinations
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ File Writing

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function writeGeneratedFiles() {
  console.log('Generating type-level test namespace files...\n')

  const combinations = generateAllCombinations()
  let filesWritten = 0

  // Generate matcher files
  for (const combo of combinations) {
    const content = generateMatcherFile(combo)
    ensureDir(path.dirname(combo.outputPath))
    fs.writeFileSync(combo.outputPath, content, 'utf-8')
    filesWritten++
    console.log(`  ✓ ${path.relative(process.cwd(), combo.outputPath)}`)
  }

  // Generate unary relator files (any, unknown, never, empty)
  for (const unaryRelatorName of Object.keys(UNARY_RELATORS)) {
    const unaryRelator = UNARY_RELATORS[unaryRelatorName]!

    // Normal version
    const normalPath = path.join(OUTPUT_DIR, `${unaryRelator.name}.ts`)
    const normalContent = generateUnaryRelatorFile(unaryRelator, false)
    ensureDir(path.dirname(normalPath))
    fs.writeFileSync(normalPath, normalContent, 'utf-8')
    filesWritten++
    console.log(`  ✓ ${path.relative(process.cwd(), normalPath)}`)

    // Negated version (in 'not' subdirectory)
    const negatedPath = path.join(OUTPUT_DIR, 'not', `${unaryRelator.name}.ts`)
    const negatedContent = generateUnaryRelatorFile(unaryRelator, true)
    ensureDir(path.dirname(negatedPath))
    fs.writeFileSync(negatedPath, negatedContent, 'utf-8')
    filesWritten++
    console.log(`  ✓ ${path.relative(process.cwd(), negatedPath)}`)
  }

  // Generate barrel files
  const barrelFiles: Array<{ path: string; exports: string[] }> = [
    // Main barrel
    {
      path: path.join(OUTPUT_DIR, '__.ts'),
      exports: [
        'exact',
        'equiv',
        'sub',
        'not',
        'awaited',
        'returned',
        'array',
        'parameters',
        'parameter1',
        'parameter2',
        'parameter3',
        'parameter4',
        'parameter5',
      ],
    },
    // Not barrel (root level)
    { path: path.join(OUTPUT_DIR, 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    // Single extractor barrels
    { path: path.join(OUTPUT_DIR, 'awaited', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'returned', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'array', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameters', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter1', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter2', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter3', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter4', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter5', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    // Not barrels (extractor level)
    { path: path.join(OUTPUT_DIR, 'awaited', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'returned', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'array', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameters', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter1', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter2', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter3', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter4', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter5', 'not', '__.ts'), exports: ['exact', 'equiv', 'sub'] },
    // Chained extractor barrels - DISABLED (no 2+ level extractors)
  ]

  for (const barrel of barrelFiles) {
    const barrelDir = path.dirname(barrel.path)
    const parentDir = path.dirname(barrelDir)
    const dirName = path.basename(barrelDir)

    let content: string

    // Detect barrel type based on path structure
    if (dirName === 'not') {
      // This is a 'not' barrel - determine which extractors precede it
      const isRootNot = parentDir === OUTPUT_DIR
      const extractors: Extractor[] = []

      if (!isRootNot) {
        // Extract extractor name from parent directory
        const extractorName = path.basename(parentDir)
        if (extractorName in EXTRACTORS) {
          extractors.push(EXTRACTORS[extractorName]!)
        }
      }

      content = generateNotBarrelFile(barrel.path, extractors)
    } else if (barrelDir !== OUTPUT_DIR) {
      // This is an extractor barrel
      const extractorName = dirName
      content = generateExtractorBarrelFile(extractorName, barrel.path)
    } else {
      // Main barrel - use standard generation
      content = generateBarrelFile(barrel.path, barrel.exports)
    }

    ensureDir(path.dirname(barrel.path))
    fs.writeFileSync(barrel.path, content, 'utf-8')
    filesWritten++
    console.log(`  ✓ ${path.relative(process.cwd(), barrel.path)}`)
  }

  console.log(`\n✅ Generated ${filesWritten} files successfully!`)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Main

writeGeneratedFiles()
