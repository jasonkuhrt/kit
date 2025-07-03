#!/usr/bin/env node
import { Fn } from '#fn'
import process from 'node:process'
import { Project } from 'ts-morph'

/**
 * CLI for generating partialize interfaces
 *
 * Usage:
 *   kit-partialize <file1> [file2] ...
 *
 * Example:
 *   kit-partialize src/my-interfaces.ts
 */

const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Kit Partialize Generator

Usage:
  kit-partialize <file1> [file2] ...

Options:
  -h, --help          Show this help message
  --directive <name>  Custom directive to look for (default: @partialize)
  --no-helpers        Skip generating helper interfaces

Examples:
  # Process a single file
  kit-partialize src/interfaces.ts
  
  # Process multiple files
  kit-partialize src/**/*.interface.ts
  
  # Use custom directive
  kit-partialize src/api.ts --directive @partial

Description:
  Generates TypeScript overloads for partial application with holes (_).
  
  Mark interfaces with a comment directive to enable generation:
  
    // @partialize
    export interface Add<N> {
      (a: N, b: N): N
    }
  
  This will generate signatures for all combinations of holes:
  - (a: _, b: _): Add<N>
  - (a: N, b: _): N
  - (a: _, b: N): N
`)
  process.exit(0)
}

// Parse CLI options
const files: string[] = []
let directive = '@partialize'
let generateHelpers = true

for (let i = 0; i < args.length; i++) {
  const arg = args[i]

  if (arg === '--directive' && i + 1 < args.length) {
    directive = args[++i]!
  } else if (arg && arg === '--no-helpers') {
    generateHelpers = false
  } else if (arg && !arg.startsWith('-')) {
    files.push(arg!)
  } else {
    console.error(`Unknown option: ${arg}`)
    process.exit(1)
  }
}

if (files.length === 0) {
  console.error('Error: No files specified')
  process.exit(1)
}

// Create project and run generator
async function main() {
  try {
    const project = new Project({
      tsConfigFilePath: './tsconfig.json',
    })

    console.log(`Processing ${files.length} file(s) with directive "${directive}"...`)

    await Fn.Generator.generate(project, files, {
      directive,
      generateHelpers,
    })

    console.log('✅ Partialize generation complete')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
