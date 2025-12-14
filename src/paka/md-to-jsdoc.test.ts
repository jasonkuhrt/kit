import { Fs } from '#fs'
import { Str } from '#str'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { markdownToJsDoc, type MarkdownToJsDocMetadata } from './md-to-jsdoc.js'

const { md } = Str.Tpl.highlight
const fence = '```'

const metadata = (generatorPath: string): MarkdownToJsDocMetadata => ({
  moduleName: 'TestModule',
  generatorPath: S.decodeSync(Fs.Path.RelFile.Schema)(generatorPath),
})

// dprint-ignore
Test.on(markdownToJsDoc)
  .casesInput(
    // Summary only (content before first heading)
    ['This is a simple summary.', metadata('./generator.ts')],

    // Description section
    [md`
      # Description
      This is the description content.
      It spans multiple lines.
    `, metadata('./src/gen.ts')],

    // Remarks section
    [md`
      Summary here.

      # Remarks
      Important implementation notes.
      - Point one
      - Point two
    `, metadata('./gen.ts')],

    // Example section with subsections
    [md`
      Summary.

      # Example
      ## Basic Usage
      ${fence}typescript
      const x = 1
      ${fence}

      ## Advanced Usage
      ${fence}typescript
      const y = complex()
      ${fence}
    `, metadata('./gen.ts')],

    // See Also section with links
    [md`
      Summary.

      # See Also
      - [MDN Docs](https://developer.mozilla.org)
      - [TypeScript Handbook](https://www.typescriptlang.org/docs)
    `, metadata('./gen.ts')],

    // All sections combined
    [md`
      This is the summary.

      # Description
      Detailed description here.

      # Remarks
      Some remarks about usage.

      # Example
      ## Usage
      ${fence}typescript
      doSomething()
      ${fence}

      # See Also
      - [Docs](https://example.com)
    `, metadata('./src/generators/main.ts')],

    // Empty markdown
    ['', metadata('./gen.ts')],
  )
  .test()
