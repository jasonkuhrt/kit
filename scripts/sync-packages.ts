#!/usr/bin/env tsx
/**
 * Syncs package.json scripts across all packages in the monorepo.
 *
 * Convention: Scripts prefixed with "sync:" in root package.json are
 * propagated to all packages with the prefix stripped.
 *
 * Example:
 *   Root: "sync:build": "tsc -p tsconfig.build.json"
 *   Package: "build": "tsc -p tsconfig.build.json"
 *
 * Run with: pnpm sync:packages
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

const ROOT_DIR = path.join(import.meta.dirname, '..')
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages')
const SYNC_PREFIX = 'sync:'

const getPackageScriptsFromRoot = (): Record<string, string> => {
  const rootPackageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'),
  )
  const rootScripts = rootPackageJson.scripts ?? {}

  const syncedScripts: Record<string, string> = {}
  for (const [key, value] of Object.entries(rootScripts)) {
    if (key.startsWith(SYNC_PREFIX)) {
      const scriptName = key.slice(SYNC_PREFIX.length)
      syncedScripts[scriptName] = value as string
    }
  }

  return syncedScripts
}

const getPackageDirs = (): string[] => {
  return fs
    .readdirSync(PACKAGES_DIR)
    .map((name) => path.join(PACKAGES_DIR, name))
    .filter((dir) => fs.statSync(dir).isDirectory())
    .filter((dir) => fs.existsSync(path.join(dir, 'package.json')))
}

const syncPackage = (
  packageDir: string,
  syncedScripts: Record<string, string>,
): { name: string; updated: boolean } => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const name = packageJson.name as string

  const currentScripts = packageJson.scripts ?? {}
  let updated = false

  // Check if scripts need updating
  for (const [key, value] of Object.entries(syncedScripts)) {
    if (currentScripts[key] !== value) {
      updated = true
      break
    }
  }

  // Check for extra scripts that shouldn't be there (only warn, don't remove)
  const allowedScripts = new Set(Object.keys(syncedScripts))
  for (const key of Object.keys(currentScripts)) {
    if (!allowedScripts.has(key)) {
      console.warn(`  Warning: ${name} has extra script "${key}"`)
    }
  }

  if (updated) {
    packageJson.scripts = { ...syncedScripts }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  }

  return { name, updated }
}

const main = () => {
  const syncedScripts = getPackageScriptsFromRoot()

  if (Object.keys(syncedScripts).length === 0) {
    console.log('No sync:* scripts found in root package.json')
    return
  }

  console.log('Syncing package scripts...')
  console.log(`  Scripts to sync: ${Object.keys(syncedScripts).join(', ')}\n`)

  const packageDirs = getPackageDirs()
  let updatedCount = 0

  for (const dir of packageDirs) {
    const result = syncPackage(dir, syncedScripts)
    if (result.updated) {
      console.log(`  ✓ Updated ${result.name}`)
      updatedCount++
    }
  }

  if (updatedCount === 0) {
    console.log('  All packages are in sync!')
  } else {
    console.log(`\n  Updated ${updatedCount} package(s)`)
  }
}

main()
