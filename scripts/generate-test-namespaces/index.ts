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
  { name: 'undefined', typeExpr: 'undefined', description: 'undefined' },
  { name: 'null', typeExpr: 'null', description: 'null' },
  { name: 'symbol', typeExpr: 'symbol', description: 'symbol' },
  { name: 'Date', typeExpr: 'Date', description: 'Date' },
  { name: 'RegExp', typeExpr: 'RegExp', description: 'RegExp' },
  { name: 'Error', typeExpr: 'Error', description: 'Error' },
  { name: 'Promise', typeExpr: 'Promise<any>', description: 'Promise<any>' },
  { name: 'Array', typeExpr: 'any[]', description: 'any[]' },
]

const EXTRACTORS: Record<string, Extractor> = {
  awaited: {
    name: 'awaited',
    kindName: 'Awaited$',
    description: 'extracts the resolved type from a Promise',
    inputDesc: 'Promise<T>',
    outputDesc: 'T',
  },
  returned: {
    name: 'returned',
    kindName: 'Returned',
    description: 'extracts the return type from a function',
    inputDesc: '(...args: any[]) => T',
    outputDesc: 'T',
  },
  array: {
    name: 'array',
    kindName: 'ArrayElement',
    description: 'extracts the element type from an array',
    inputDesc: 'T[]',
    outputDesc: 'T',
  },
  parameters: {
    name: 'parameters',
    kindName: 'Parameters$',
    description: 'extracts the parameters tuple from a function',
    inputDesc: '(...args: any[]) => T',
    outputDesc: 'Parameters<Function>',
  },
  parameter1: {
    name: 'parameter1',
    kindName: 'Parameter1',
    description: 'extracts the first parameter type from a function',
    inputDesc: '(p1: T, ...) => any',
    outputDesc: 'T',
  },
  parameter2: {
    name: 'parameter2',
    kindName: 'Parameter2',
    description: 'extracts the second parameter type from a function',
    inputDesc: '(p1: any, p2: T, ...) => any',
    outputDesc: 'T',
  },
  parameter3: {
    name: 'parameter3',
    kindName: 'Parameter3',
    description: 'extracts the third parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: T, ...) => any',
    outputDesc: 'T',
  },
  parameter4: {
    name: 'parameter4',
    kindName: 'Parameter4',
    description: 'extracts the fourth parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: any, p4: T, ...) => any',
    outputDesc: 'T',
  },
  parameter5: {
    name: 'parameter5',
    kindName: 'Parameter5',
    description: 'extracts the fifth parameter type from a function',
    inputDesc: '(p1: any, p2: any, p3: any, p4: any, p5: T) => any',
    outputDesc: 'T',
  },
}

const RELATORS: Record<string, Relator> = {
  exact: {
    name: 'exact',
    kindName: 'ExactKind',
    description: 'exact structural equality',
    passExample: 'string extends string',
    failExample: '"hello" not exact match for string',
  },
  equiv: {
    name: 'equiv',
    kindName: 'EquivKind',
    description: 'mutual assignability (equivalent types)',
    passExample: 'string & {} ≡ string',
    failExample: 'string not equivalent to number',
  },
  sub: {
    name: 'sub',
    kindName: 'SubKind',
    description: 'subtype relation (extends)',
    passExample: '"hello" extends string',
    failExample: 'string does not extend "hello"',
  },
}

const OUTPUT_DIR = path.join(process.cwd(), 'src/utils/ts/assert/builder-generated')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Path Utilities

function getRelativePath(from: string, to: string): string {
  const rel = path.relative(path.dirname(from), to)
  // Ensure .js extension and proper ./ prefix
  return rel.startsWith('.') ? rel : `./${rel}`
}

function calculateImportPaths(combo: Combination) {
  // Calculate proper relative paths from source to target files
  const sourceFile = combo.outputPath
  const rootDir = path.join(process.cwd(), 'src/utils/ts')

  const kindPath = getRelativePath(sourceFile, path.join(rootDir, 'kind.js'))
  const extractorsPath = getRelativePath(sourceFile, path.join(rootDir, 'assert/kinds/extractors.js'))
  const relatorsPath = getRelativePath(sourceFile, path.join(rootDir, 'assert/kinds/relators.js'))
  const runtimePath = getRelativePath(sourceFile, path.join(rootDir, 'assert/builder/runtime.js'))

  return { kindPath, extractorsPath, relatorsPath, runtimePath }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Template Generation

function generateFileHeader(combo: Combination): string {
  const { kindPath, extractorsPath, relatorsPath, runtimePath } = calculateImportPaths(combo)

  const extractorKinds = combo.extractors.map((e) => e.kindName).join(', ')
  const extractorImports = combo.extractors.length > 0
    ? `import type { ${extractorKinds} } from '${extractorsPath}'\n`
    : ''

  return `import type * as Kind from '${kindPath}'
${extractorImports}import type { ${combo.relator.kindName} } from '${relatorsPath}'
import { runtime } from '${runtimePath}'
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

function buildExtractorChain(extractors: Extractor[], actualType: string): string {
  if (extractors.length === 0) return actualType

  return extractors.reduce(
    (inner, extractor) => `Kind.Apply<${extractor.kindName}, [${inner}]>`,
    actualType,
  )
}

function buildRuntimeChain(combo: Combination, matcherName: string): string {
  // Build the runtime access chain: runtime.${extractors}.${not?}.${relator}.${matcher}
  const parts = [
    'runtime',
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
  const typeParams = matcher.name === 'of' ? '<$Expected, $Actual>' : '<$Actual>'

  // Add negation parameter if negated
  const negatedParam = combo.negated ? ', true' : ''

  const typeDef =
    `type ${matcher.name}_${typeParams} = Kind.Apply<${combo.relator.kindName}, [${expectedType}, ${extractorChain}${negatedParam}]>`
  const constDef = `const ${matcher.name}_ = ${buildRuntimeChain(combo, matcher.name)}`

  return `${typeDef}\n${constDef}`
}

function generateExports(matchers: Matcher[]): string {
  const exports = matchers.map((m) => `${m.name}_ as ${m.name}`).join(',\n  ')
  return `export {\n  ${exports},\n}`
}

function generateMatcherFile(combo: Combination): string {
  const header = generateFileHeader(combo)
  const fileLevelDoc = generateFileLevelJSDoc(combo)
  const matchers = MATCHERS.map((m) => {
    const jsdoc = generateMatcherJSDoc(m, combo)
    const typeDef = generateMatcherType(m, combo)
    return `${jsdoc}\n${typeDef}`
  }).join('\n\n')
  const exports = generateExports(MATCHERS)

  return `${header}${fileLevelDoc}
${matchers}

${exports}
`
}

function generateBarrelFile(dirPath: string, exports: string[]): string {
  // Determine if each export is a file or a directory based on our data structures
  // Extractors are directories (have their own barrel files)
  // Relators are files
  // 'not' is a special directory
  const relPaths = exports.map((name) => {
    if (name in EXTRACTORS) return `./${name}/$$.js`
    if (name === 'not') return `./${name}/$$.js`
    return `./${name}.js`
  })

  // Use export * as to re-export dual namespaces from child modules
  const reExports = exports
    .map((name, i) => `export * as ${name} from '${relPaths[i]}'`)
    .join('\n')

  // Add type-level shorthand for relators (main barrel only has base relators, no extractors)
  const rootDir = path.join(process.cwd(), 'src/utils/ts')
  const kindPath = getRelativePath(dirPath, path.join(rootDir, 'kind.js'))
  const relatorsPath = getRelativePath(dirPath, path.join(rootDir, 'assert/kinds/relators.js'))

  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type * as Kind from '${kindPath}'
import type { ${relatorKinds} } from '${relatorsPath}'`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!
    return `export type ${relatorName}<$Expected, $Actual> = Kind.Apply<${relator.kindName}, [$Expected, $Actual]>`
  }).join('\n')

  return `${imports}

${reExports}
${typeShorthands}
`
}

/**
 * Generate a barrel file for an extractor subdirectory.
 * Exports relators (type+value), 'not' namespace, and other extractors (value-only via runtime proxy).
 */
function generateExtractorBarrelFile(extractorName: string, barrelPath: string): string {
  // Calculate relative paths
  const rootDir = path.join(process.cwd(), 'src/utils/ts')
  const runtimePath = getRelativePath(barrelPath, path.join(rootDir, 'assert/builder/runtime.js'))
  const kindPath = getRelativePath(barrelPath, path.join(rootDir, 'kind.js'))
  const extractorsPath = getRelativePath(barrelPath, path.join(rootDir, 'assert/kinds/extractors.js'))
  const relatorsPath = getRelativePath(barrelPath, path.join(rootDir, 'assert/kinds/relators.js'))

  // Part 1: Export relators as dual namespaces (type+value)
  const relatorExports = Object.keys(RELATORS)
    .map((relator) => `export * as ${relator} from './${relator}.js'`)
    .join('\n')

  // Part 2: Export 'not' namespace (type+value)
  const notExport = `export * as not from './not/$$.js'`

  // Part 3: Export other extractors as value-only runtime references
  const otherExtractors = Object.keys(EXTRACTORS).filter((name) => name !== extractorName)
  const extractorExports = otherExtractors.length > 0
    ? `\n// Value-level extractor chaining via runtime proxy\n`
      + otherExtractors.map((name) => `export const ${name} = runtime.${extractorName}.${name}`).join('\n')
    : ''

  // Part 4: Add type-level shorthand for relators (allows omitting .of)
  const extractor = EXTRACTORS[extractorName]!
  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type * as Kind from '${kindPath}'
import type { ${extractor.kindName} } from '${extractorsPath}'
import type { ${relatorKinds} } from '${relatorsPath}'${
    otherExtractors.length > 0 ? `\nimport { runtime } from '${runtimePath}'` : ''
  }`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!
    return `export type ${relatorName}<$Expected, $Actual> = Kind.Apply<${relator.kindName}, [$Expected, Kind.Apply<${extractor.kindName}, [$Actual]>]>`
  }).join('\n')

  return `${imports}

${relatorExports}
${notExport}${extractorExports}
${typeShorthands}
`
}

/**
 * Generate a barrel file for a 'not' subdirectory.
 * Exports only negated relators (type+value) with type-level shorthand.
 */
function generateNotBarrelFile(barrelPath: string, extractors: Extractor[]): string {
  // Calculate relative paths
  const rootDir = path.join(process.cwd(), 'src/utils/ts')
  const kindPath = getRelativePath(barrelPath, path.join(rootDir, 'kind.js'))
  const extractorsPath = getRelativePath(barrelPath, path.join(rootDir, 'assert/kinds/extractors.js'))
  const relatorsPath = getRelativePath(barrelPath, path.join(rootDir, 'assert/kinds/relators.js'))

  // Export relators as dual namespaces (type+value)
  const relatorExports = Object.keys(RELATORS)
    .map((relator) => `export * as ${relator} from './${relator}.js'`)
    .join('\n')

  // Add type-level shorthand for negated relators
  const extractorKinds = extractors.map((e) => e.kindName).join(', ')
  const extractorImports = extractors.length > 0
    ? `import type { ${extractorKinds} } from '${extractorsPath}'\n`
    : ''
  const relatorKinds = Object.keys(RELATORS).map((r) => RELATORS[r]!.kindName).join(', ')

  const imports = `import type * as Kind from '${kindPath}'
${extractorImports}import type { ${relatorKinds} } from '${relatorsPath}'`

  const typeShorthands = Object.keys(RELATORS).map((relatorName) => {
    const relator = RELATORS[relatorName]!
    const extractorChain = buildExtractorChain(extractors, '$Actual')
    return `export type ${relatorName}<$Expected, $Actual> = Kind.Apply<${relator.kindName}, [$Expected, ${extractorChain}, true]>`
  }).join('\n')

  return `${imports}

${relatorExports}
${typeShorthands}
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

  // Generate barrel files
  const barrelFiles: Array<{ path: string; exports: string[] }> = [
    // Main barrel
    {
      path: path.join(OUTPUT_DIR, '$$.ts'),
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
    { path: path.join(OUTPUT_DIR, 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    // Single extractor barrels
    { path: path.join(OUTPUT_DIR, 'awaited', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'returned', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'array', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameters', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter1', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter2', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter3', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter4', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter5', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    // Not barrels (extractor level)
    { path: path.join(OUTPUT_DIR, 'awaited', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'returned', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'array', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameters', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter1', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter2', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter3', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter4', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
    { path: path.join(OUTPUT_DIR, 'parameter5', 'not', '$$.ts'), exports: ['exact', 'equiv', 'sub'] },
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
