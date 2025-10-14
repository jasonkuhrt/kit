/**
 * Layered Import Architecture Checker
 *
 * This script enforces a layered architecture to prevent circular dependencies
 * while allowing controlled cross-module imports.
 *
 * **For full documentation, see:** {@link ./check-layered-imports.md}
 */

import { consola } from 'consola'
import * as path from 'node:path'
import { glob } from 'tinyglobby'
import { Project, type SourceFile, SyntaxKind } from 'ts-morph'

interface Violation {
  file: string
  line: number
  rule: string
  message: string
  import: string
}

interface ModuleInfo {
  filePath: string
  namespace: string | null
  isCore: boolean
  isBarrel: boolean
  imports: Array<{ source: string; line: number; isTypeOnly?: boolean }>
}

/**
 * Main entry point for the layered imports checker.
 */
async function main() {
  consola.info('Layered Import Architecture Checker')
  consola.start('Analyzing codebase...')

  const srcDir = path.join(process.cwd(), 'src')
  const violations: Violation[] = []

  // Step 1: Find all TypeScript files
  const files = await glob(['**/*.ts'], {
    cwd: srcDir,
    absolute: true,
    ignore: ['**/*.test.ts', '**/*.test-d.ts', '**/*-demo.ts', '**/node_modules/**'],
  })

  consola.info(`Found ${files.length} TypeScript files`)

  // Step 2: Detect core modules
  const coreModules = new Map<string, Set<string>>() // namespace -> Set of core file paths
  const fileModules = new Map<string, ModuleInfo>()

  for (const file of files) {
    const relativePath = path.relative(srcDir, file)
    const parts = relativePath.split(path.sep)

    // Detect namespace and if it's a core module
    // Expected pattern: domains/<namespace>/core/*.ts or utils/<namespace>/core/*.ts
    let namespace: string | null = null
    let isCore = false

    if (parts.length >= 3 && parts[2] === 'core') {
      // e.g., domains/fn/core/curry.ts
      namespace = parts[1] ?? null
      isCore = true

      if (namespace) {
        if (!coreModules.has(namespace)) {
          coreModules.set(namespace, new Set())
        }
        coreModules.get(namespace)!.add(file)
      }
    } else if (parts.length >= 2) {
      // e.g., domains/fn/replace.ts
      namespace = parts[1] ?? null
    }

    // Detect barrel files
    const fileName = path.basename(file, '.ts')
    const isBarrel = fileName === '$' || fileName === '$$'

    fileModules.set(file, {
      filePath: file,
      namespace,
      isCore,
      isBarrel,
      imports: [],
    })
  }

  consola.info(
    `Found ${coreModules.size} namespace(s) with core modules: ${
      Array.from(coreModules.keys()).join(', ') || '(none)'
    }`,
  )

  // Step 3: Parse imports using ts-morph
  consola.start('Parsing imports...')
  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })

  for (const file of files) {
    const sourceFile = project.addSourceFileAtPath(file)
    const moduleInfo = fileModules.get(file)!

    // Extract import declarations
    const imports = sourceFile.getImportDeclarations()
    for (const importDecl of imports) {
      const source = importDecl.getModuleSpecifierValue()
      const line = importDecl.getStartLineNumber()

      // Skip type-only imports - they don't create runtime circular dependencies
      const isTypeOnly = importDecl.isTypeOnly()

      moduleInfo.imports.push({ source, line, isTypeOnly })
    }
  }

  // Step 4: Validate rules
  consola.start('Validating import rules...')

  for (const [file, moduleInfo] of fileModules.entries()) {
    const { namespace, isCore, isBarrel, imports } = moduleInfo

    // Skip barrel files - they can import anything within their namespace
    if (isBarrel) continue
    if (!namespace) continue

    for (const { source, line, isTypeOnly } of imports) {
      // Skip external packages and node built-ins
      if (!source.startsWith('#') && !source.startsWith('.')) continue

      // Skip type-only imports - they don't create runtime circular dependencies
      if (isTypeOnly) continue

      if (isCore) {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // CORE MODULE RULES
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        // Rule: Core cannot import full namespace
        const fullNamespacePattern = /^#[a-z-]+$/
        if (fullNamespacePattern.test(source)) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line,
            rule: 'core-no-full-namespace',
            message: `Core module cannot import full namespace. Use subpath import instead (e.g., '${source}/core')`,
            import: source,
          })
        }

        // Rule: Core cannot import other cores via relative path
        if (source.includes('../') && source.includes('/core/')) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line,
            rule: 'core-no-relative-cross-namespace',
            message: 'Core module must use subpath imports for external cores, not relative paths',
            import: source,
          })
        }

        // Rule: fn/core can only import lang/core
        if (namespace === 'fn') {
          const externalCorePattern = /^#[a-z-]+\/core$/
          if (externalCorePattern.test(source) && source !== '#lang/core') {
            violations.push({
              file: path.relative(process.cwd(), file),
              line,
              rule: 'fn-core-only-lang-core',
              message: 'fn/core can only import lang/core (custom DAG constraint)',
              import: source,
            })
          }
        }
      } else {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STANDARD MODULE RULES
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        // Rule: Standard module cannot import own namespace barrel
        if (source === `#${namespace}`) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line,
            rule: 'standard-no-own-barrel',
            message: `Standard module cannot import own namespace barrel (creates circular dependency)`,
            import: source,
          })
        }

        // Rule: Standard module must use subpath for core imports
        if (source.includes('/core/') && source.startsWith('.')) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line,
            rule: 'standard-core-via-subpath',
            message: 'Must use subpath imports for cores, not relative paths',
            import: source,
          })
        }
      }
    }

    // Check for module-level side effects (warning only)
    // Skip this check for now - too many false positives from curried functions
    // TODO: Refine to only catch actual problematic patterns (e.g., not curry/partial applications)
    // if (!isCore && !isBarrel) {
    //   const sourceFile = project.getSourceFile(file)!
    //   const topLevelStatements = sourceFile.getStatements()
    //
    //   for (const statement of topLevelStatements) {
    //     if (statement.getKind() === SyntaxKind.VariableStatement) {
    //       const varDecl = statement.asKindOrThrow(SyntaxKind.VariableStatement)
    //       const declarations = varDecl.getDeclarations()
    //
    //       for (const decl of declarations) {
    //         const initializer = decl.getInitializer()
    //         if (initializer && initializer.getKind() === SyntaxKind.CallExpression) {
    //           const line = decl.getStartLineNumber()
    //           violations.push({
    //             file: path.relative(process.cwd(), file),
    //             line,
    //             rule: 'module-level-side-effect',
    //             message: 'Module-level side effect detected (function call at top level). Consider lazy initialization.',
    //             import: decl.getName(),
    //           })
    //         }
    //       }
    //     }
    //   }
    // }
  }

  // Step 5: Report violations
  consola.box(`Analysis complete`)

  if (violations.length === 0) {
    consola.success('No violations found! ✨')
    return
  }

  consola.error(`Found ${violations.length} violation(s):`)
  console.log() // blank line

  // Group by rule
  const byRule = new Map<string, Violation[]>()
  for (const violation of violations) {
    if (!byRule.has(violation.rule)) {
      byRule.set(violation.rule, [])
    }
    byRule.get(violation.rule)!.push(violation)
  }

  for (const [rule, ruleViolations] of byRule.entries()) {
    consola.log(`\n━━━ ${rule} (${ruleViolations.length}) ━━━\n`)
    for (const v of ruleViolations) {
      consola.log(`  ${v.file}:${v.line}`)
      consola.log(`    Import: ${v.import}`)
      consola.log(`    ${v.message}`)
      console.log() // blank line
    }
  }

  process.exit(1)
}

main().catch((error) => {
  consola.error('Failed to run layered imports checker:', error)
  process.exit(1)
})
