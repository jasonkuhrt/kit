#!/usr/bin/env tsx
/**
 * Analyzes inter-module dependencies as if each module were a separate package.
 * Outputs a DAG showing how modules depend on each other.
 *
 * Usage:
 *   pnpm tsx scripts/module-deps.ts [--json] [--dot] [--mermaid]
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

const SRC_DIR = path.join(import.meta.dirname, '..', 'src')
const DOMAINS_DIR = path.join(SRC_DIR, 'domains')
const UTILS_DIR = path.join(SRC_DIR, 'utils')

type ModuleDeps = Map<string, Set<string>>

const getModules = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

const findImportsInFile = (filePath: string): string[] => {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf-8')
  const importRegex = /from\s+['"]#([a-z-]+)['"]/g
  const imports: string[] = []
  let match
  while ((match = importRegex.exec(content)) !== null) {
    if (match[1]) imports.push(match[1])
  }
  return imports
}

const findImportsInDir = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  const imports: string[] = []

  const walk = (currentDir: string) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test-d.ts')) {
        imports.push(...findImportsInFile(fullPath))
      }
    }
  }

  walk(dir)
  return imports
}

const buildDependencyGraph = (): ModuleDeps => {
  const deps: ModuleDeps = new Map()

  const allModules = [
    ...getModules(DOMAINS_DIR),
    ...getModules(UTILS_DIR),
  ]

  for (const moduleName of allModules) {
    const domainPath = path.join(DOMAINS_DIR, moduleName)
    const utilsPath = path.join(UTILS_DIR, moduleName)
    const modulePath = fs.existsSync(domainPath) ? domainPath : utilsPath

    const imports = findImportsInDir(modulePath)
    const externalDeps = new Set(imports.filter(imp => imp !== moduleName && allModules.includes(imp)))

    deps.set(moduleName, externalDeps)
  }

  return deps
}

const toposort = (deps: ModuleDeps): string[] => {
  const result: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  const visit = (node: string) => {
    if (visited.has(node)) return
    if (visiting.has(node)) return // cycle
    visiting.add(node)
    const nodeDeps = deps.get(node) ?? new Set()
    for (const dep of nodeDeps) {
      visit(dep)
    }
    visiting.delete(node)
    visited.add(node)
    result.push(node)
  }

  for (const node of deps.keys()) {
    visit(node)
  }

  return result
}

const outputText = (deps: ModuleDeps) => {
  const sorted = toposort(deps)

  console.log('# Module Dependency Graph\n')
  console.log('## Build Order (topological sort)\n')
  sorted.forEach((mod, i) => console.log(`${i + 1}. ${mod}`))

  console.log('\n## Dependencies\n')
  for (const mod of sorted) {
    const modDeps = deps.get(mod) ?? new Set()
    if (modDeps.size > 0) {
      console.log(`${mod} → ${[...modDeps].sort().join(', ')}`)
    } else {
      console.log(`${mod} → (none)`)
    }
  }

  // Show reverse deps (who depends on this module)
  console.log('\n## Reverse Dependencies (dependents)\n')
  const reverseDeps = new Map<string, Set<string>>()
  for (const [mod, modDeps] of deps) {
    for (const dep of modDeps) {
      if (!reverseDeps.has(dep)) reverseDeps.set(dep, new Set())
      reverseDeps.get(dep)!.add(mod)
    }
  }
  for (const mod of sorted) {
    const dependents = reverseDeps.get(mod) ?? new Set()
    if (dependents.size > 0) {
      console.log(`${mod} ← ${[...dependents].sort().join(', ')}`)
    }
  }
}

const outputJson = (deps: ModuleDeps) => {
  const obj: Record<string, string[]> = {}
  for (const [mod, modDeps] of deps) {
    obj[mod] = [...modDeps].sort()
  }
  console.log(JSON.stringify(obj, null, 2))
}

const outputDot = (deps: ModuleDeps) => {
  console.log('digraph ModuleDeps {')
  console.log('  rankdir=BT;')
  console.log('  node [shape=box];')
  for (const [mod, modDeps] of deps) {
    for (const dep of modDeps) {
      console.log(`  "${mod}" -> "${dep}";`)
    }
  }
  console.log('}')
}

const outputMermaid = (deps: ModuleDeps) => {
  console.log('```mermaid')
  console.log('graph BT')
  for (const [mod, modDeps] of deps) {
    for (const dep of modDeps) {
      console.log(`  ${mod} --> ${dep}`)
    }
  }
  console.log('```')
}

// Main
const args = process.argv.slice(2)
const deps = buildDependencyGraph()

if (args.includes('--json')) {
  outputJson(deps)
} else if (args.includes('--dot')) {
  outputDot(deps)
} else if (args.includes('--mermaid')) {
  outputMermaid(deps)
} else {
  outputText(deps)
}
