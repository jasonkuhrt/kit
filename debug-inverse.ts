import ansis from 'ansis'
import { z } from 'zod/v4'
import * as Command from './src/oak/_entrypoints/__.js'
import { Zod } from './src/oak/extensions/__.js'

// Run a simple help render - same as test helper
const $ = Command.create().use(Zod)
const builder = $
  .description('Test')
  .parameter('foo', z.string().optional())

let output = ''
builder.settings({
  onOutput: (s: string) => {
    output += s
  },
  terminalWidth: 100,
}).parse({ line: ['-h'] })

// Check for \x1b[7m
const inverseCode = '\x1b[7m'
if (output.includes(inverseCode)) {
  console.log('Output contains [7m at positions:')
  let pos = 0
  while ((pos = output.indexOf(inverseCode, pos)) !== -1) {
    console.log('  Position', pos, '- context:', JSON.stringify(output.slice(Math.max(0, pos - 20), pos + 30)))
    pos++
  }
} else {
  console.log('No [7m found in output')
}

console.log('\n--- Stripped output preview ---')
console.log(ansis.strip(output).slice(0, 500))
