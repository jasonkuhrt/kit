#!/usr/bin/env tsx
/**
 * Generates package documentation table for README.md
 *
 * Reads all package.json files from packages directory and generates
 * a markdown table with links to each package directory and descriptions.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

const rootDir = path.resolve(import.meta.dirname, '..')
const packagesDir = path.join(rootDir, 'packages')
const readmePath = path.join(rootDir, 'README.md')

interface PackageInfo {
  name: string
  dirName: string
  description: string
}

const getPackages = (): PackageInfo[] => {
  const dirs = fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  const packages: PackageInfo[] = []

  for (const dirName of dirs) {
    const pkgJsonPath = path.join(packagesDir, dirName, 'package.json')
    if (!fs.existsSync(pkgJsonPath)) continue

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    packages.push({
      name: pkgJson.name ?? dirName,
      dirName,
      description: pkgJson.description ?? '',
    })
  }

  return packages
}

const generateTable = (packages: PackageInfo[]): string => {
  const lines: string[] = [
    '| Package | Description |',
    '| ------- | ----------- |',
  ]

  for (const pkg of packages) {
    const link = `[\`${pkg.name}\`](./packages/${pkg.dirName})`
    const desc = pkg.description || '_No description_'
    lines.push(`| ${link} | ${desc} |`)
  }

  return lines.join('\n')
}

const START_MARKER = '<!-- PACKAGES_TABLE_START -->'
const END_MARKER = '<!-- PACKAGES_TABLE_END -->'

const updateReadme = (table: string): void => {
  let readme = fs.readFileSync(readmePath, 'utf-8')

  const startIdx = readme.indexOf(START_MARKER)
  const endIdx = readme.indexOf(END_MARKER)

  if (startIdx === -1 || endIdx === -1) {
    console.error('Error: README.md missing package table markers')
    console.error(`Add these markers where you want the table:`)
    console.error(`  ${START_MARKER}`)
    console.error(`  ${END_MARKER}`)
    process.exit(1)
  }

  const before = readme.slice(0, startIdx + START_MARKER.length)
  const after = readme.slice(endIdx)

  readme = `${before}\n\n${table}\n\n${after}`

  fs.writeFileSync(readmePath, readme)
  console.log(`✓ Updated README.md with ${packages.length} packages`)
}

const packages = getPackages()
const table = generateTable(packages)
updateReadme(table)
