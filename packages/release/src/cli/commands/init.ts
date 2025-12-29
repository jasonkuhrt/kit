import { FileSystem, Path } from '@effect/platform'
import { NodeFileSystem, NodePath } from '@effect/platform-node'
import { Env } from '@kitz/env'
import { Oak } from '@kitz/oak'
import { Effect, Layer, Schema } from 'effect'
import * as Api from '../../api/__.js'

const CONFIG_FILE = 'release.config.ts'
const GITIGNORE_ENTRY = '.release/'

/**
 * Default config template.
 */
const configTemplate = `import { defineConfig } from '@kitz/release'

export default defineConfig({
  // Trunk branch name (default: 'main')
  // trunk: 'main',

  // Default npm dist-tag for stable releases (default: 'latest')
  // npmTag: 'latest',

  // Dist-tag for preview releases (default: 'next')
  // previewTag: 'next',

  // Skip npm publish (for testing)
  // skipNpm: false,

  // Scope to package mapping (auto-discovered by default)
  // packages: {
  //   core: '@kitz/core',
  //   kitz: 'kitz',
  // },
})
`

/**
 * release init
 *
 * Initialize release in a project.
 */
await Oak.Command.create()
  .description('Initialize release configuration')
  .parameter(
    'force f',
    Schema.transform(
      Schema.UndefinedOr(Schema.Boolean),
      Schema.Boolean,
      {
        strict: true,
        decode: (v) => v ?? false,
        encode: (v) => v,
      },
    ).pipe(
      Schema.annotations({ description: 'Overwrite existing config', default: false }),
    ),
  )
  .parse()

const program = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const cwd = process.cwd()

  console.log('Initializing release...')
  console.log()

  // Check for existing config
  const configPath = path.join(cwd, CONFIG_FILE)
  const configExists = yield* fs.exists(configPath)

  if (configExists) {
    console.log(`✓ Config already exists: ${CONFIG_FILE}`)
  } else {
    yield* fs.writeFileString(configPath, configTemplate)
    console.log(`✓ Created ${CONFIG_FILE}`)
  }

  // Discover packages
  const packages = yield* Api.Workspace.discover
  console.log(`✓ Detected ${packages.length} package${packages.length === 1 ? '' : 's'}`)

  // Add .release/ to .gitignore
  const gitignorePath = path.join(cwd, '.gitignore')
  const gitignoreExists = yield* fs.exists(gitignorePath)

  if (gitignoreExists) {
    const content = yield* fs.readFileString(gitignorePath)
    if (!content.includes(GITIGNORE_ENTRY)) {
      const newContent = content.endsWith('\n')
        ? content + GITIGNORE_ENTRY + '\n'
        : content + '\n' + GITIGNORE_ENTRY + '\n'
      yield* fs.writeFileString(gitignorePath, newContent)
      console.log(`✓ Added ${GITIGNORE_ENTRY} to .gitignore`)
    } else {
      console.log(`✓ ${GITIGNORE_ENTRY} already in .gitignore`)
    }
  } else {
    yield* fs.writeFileString(gitignorePath, GITIGNORE_ENTRY + '\n')
    console.log(`✓ Created .gitignore with ${GITIGNORE_ENTRY}`)
  }

  console.log()
  console.log('Done! Release is ready.')
  console.log()
  console.log('Next steps:')
  console.log('  1. Review release.config.ts')
  console.log('  2. Run `release status` to see pending changes')
  console.log('  3. Run `release plan stable` to generate a release plan')
})

const layer = Layer.mergeAll(
  Env.Live,
  NodeFileSystem.layer,
  NodePath.layer,
)

Effect.runPromise(Effect.provide(program, layer)).catch((error) => {
  console.error('Error:', error.message ?? error)
  process.exit(1)
})
