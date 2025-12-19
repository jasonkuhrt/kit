#!/usr/bin/env tsx
/**
 * Audit package dependencies by scanning imports in src/ and comparing to package.json
 * Reports missing dependencies that need to be added
 */

import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const packagesDir = join(import.meta.dirname, '..', 'packages')

// Get all package directories
const packages = readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

interface PackageAudit {
  name: string
  missing: {
    prod: string[]
    dev: string[]
  }
}

const results: PackageAudit[] = []

for (const pkg of packages) {
  const pkgDir = join(packagesDir, pkg)
  const srcDir = join(pkgDir, 'src')
  const pkgJsonPath = join(pkgDir, 'package.json')

  if (!existsSync(srcDir) || !existsSync(pkgJsonPath)) {
    continue
  }

  // Read package.json
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))
  const declaredDeps = new Set([
    ...Object.keys(pkgJson.dependencies || {}),
    ...Object.keys(pkgJson.devDependencies || {}),
    ...Object.keys(pkgJson.peerDependencies || {}),
  ])

  // Find all imports in src/
  let imports: string[] = []
  try {
    const grepResult = execSync(
      `grep -rhoE "from ['\"][^'\"]+['\"]" "${srcDir}" 2>/dev/null || true`,
      { encoding: 'utf-8' }
    )
    imports = grepResult
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const match = line.match(/from ['"]([^'"]+)['"]/)
        return match ? match[1] : null
      })
      .filter((s): s is string => s !== null)
  } catch {
    continue
  }

  // Extract external package names
  const externalImports = new Set<string>()
  for (const imp of imports) {
    // Skip relative imports
    if (imp.startsWith('.') || imp.startsWith('#')) continue

    // Skip node: built-ins (but we need @types/node for them)
    if (imp.startsWith('node:')) {
      externalImports.add('@types/node')
      continue
    }

    // Get package name (handle scoped packages)
    let pkgName: string
    if (imp.startsWith('@')) {
      // Scoped package: @scope/name or @scope/name/path
      const parts = imp.split('/')
      pkgName = `${parts[0]}/${parts[1]}`
    } else {
      // Regular package: name or name/path
      pkgName = imp.split('/')[0]
    }

    // Skip workspace packages
    if (pkgName.startsWith('@kouka/')) continue

    externalImports.add(pkgName)
  }

  // Find missing dependencies
  const missingProd: string[] = []
  const missingDev: string[] = []

  for (const ext of externalImports) {
    if (!declaredDeps.has(ext)) {
      // Check if it's only used in test files
      const isTestOnly = (() => {
        try {
          const prodGrep = execSync(
            `grep -rlE "from ['\"]${ext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[/'\"]" "${srcDir}" 2>/dev/null | grep -v '\\.test\\.' | head -1 || true`,
            { encoding: 'utf-8' }
          )
          return !prodGrep.trim()
        } catch {
          return true
        }
      })()

      if (isTestOnly) {
        missingDev.push(ext)
      } else {
        missingProd.push(ext)
      }
    }
  }

  if (missingProd.length > 0 || missingDev.length > 0) {
    results.push({
      name: `@kouka/${pkg}`,
      missing: {
        prod: missingProd.sort(),
        dev: missingDev.sort(),
      },
    })
  }
}

// Output results
if (results.length === 0) {
  console.log('✅ All packages have their dependencies declared!')
} else {
  console.log('📦 Missing dependencies found:\n')

  for (const result of results) {
    console.log(`\n${result.name}:`)
    if (result.missing.prod.length > 0) {
      console.log(`  prod: ${result.missing.prod.join(' ')}`)
      console.log(`  → pnpm add ${result.missing.prod.join(' ')} --filter ${result.name}`)
    }
    if (result.missing.dev.length > 0) {
      console.log(`  dev:  ${result.missing.dev.join(' ')}`)
      console.log(`  → pnpm add -D ${result.missing.dev.join(' ')} --filter ${result.name}`)
    }
  }

  // Generate fix commands
  console.log('\n\n📝 Fix commands:\n')
  for (const result of results) {
    if (result.missing.prod.length > 0) {
      console.log(`pnpm add ${result.missing.prod.join(' ')} --filter ${result.name}`)
    }
    if (result.missing.dev.length > 0) {
      console.log(`pnpm add -D ${result.missing.dev.join(' ')} --filter ${result.name}`)
    }
  }
}
