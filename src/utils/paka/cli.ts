#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { generate } from './adaptors/vitepress.js'
import { extract } from './extractor/extract.js'

/**
 * CLI for generating documentation.
 */
const main = () => {
  const command = process.argv[2]

  if (command === 'generate' || !command) {
    generateDocs()
  } else {
    console.error(`Unknown command: ${command}`)
    console.log('Usage: paka generate')
    process.exit(1)
  }
}

/**
 * Generate documentation from source code.
 */
const generateDocs = () => {
  console.log('Extracting documentation from source files...')

  const projectRoot = process.cwd()

  // Extract interface model
  const model = extract({
    projectRoot,
    entrypoints: [
      // Testing & TypeScript
      './test',
      './ts',
      // Core data structures
      './arr',
      './obj',
      './str',
      './fn',
      './num',
      // Practical utilities
      './err',
      './prom',
      './rec',
      './json',
      './value',
    ],
  })

  console.log(`Extracted ${model.entrypoints.length} entrypoints`)

  // Save intermediate JSON model
  const modelPath = join(projectRoot, 'docs/.generated/interface-model.json')
  writeFileSync(modelPath, JSON.stringify(model, null, 2), 'utf-8')
  console.log(`Saved interface model to ${modelPath}`)

  // Generate VitePress markdown
  generate(model, {
    outputDir: join(projectRoot, 'docs'),
    githubUrl: 'https://github.com/jasonkuhrt/kit',
  })

  console.log('✅ Documentation generated successfully')
}

main()
