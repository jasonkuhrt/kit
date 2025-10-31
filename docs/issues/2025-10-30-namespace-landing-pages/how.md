# Namespace Landing Pages - Implementation Plan

## Overview

Add opt-in landing page support for namespaces using `*.home.md` files. This feature allows library authors to create hero-style landing pages for namespaces with custom highlights and structured content.

---

## Commit 1: Add markdown parsing dependencies

### What

Install `unified` and `remark` packages for markdown AST parsing.

### Why

The landing page feature requires parsing markdown into structured sections (Hero, Highlights, Body). Paka currently treats markdown as raw strings. We need AST-based parsing to:
- Extract and validate heading structure
- Split content by sections
- Convert AST nodes to strings/markdown

### How

**Add dependencies**:
```bash
pnpm add unified remark-parse remark-stringify remark-gfm mdast-util-to-string
pnpm add -D @types/mdast
```

**Packages**:
- `unified`: Markdown processing ecosystem core
- `remark-parse`: Markdown → AST parser
- `remark-stringify`: AST → Markdown serializer
- `remark-gfm`: GitHub Flavored Markdown support (tables, strikethrough, etc.)
- `mdast-util-to-string`: Extract plain text from AST nodes
- `@types/mdast`: TypeScript types for markdown AST

---

## Commit 2: Create markdown parsing utilities

### What

Add generic markdown AST utilities in `src/utils/paka/extractor/markdown.ts`.

### Why

The home page parser needs reusable functions for:
- Parsing markdown to AST
- Extracting sections by heading level
- Converting AST nodes to strings/markdown

These utilities follow best practices:
- Type-safe with mdast types
- Reusable for future markdown features
- Well-tested edge cases

Makes the home page parser cleaner by delegating low-level AST manipulation.

### How

**File**: `src/utils/paka/extractor/markdown.ts`

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { toString } from 'mdast-util-to-string'
import type { Root, Heading, Content } from 'mdast'

/**
 * Parse markdown string to AST.
 */
export const parseMarkdown = (markdown: string): Root => {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown)
}

/**
 * Convert AST nodes back to markdown string.
 */
export const toMarkdown = (nodes: Content[]): string => {
  const tree: Root = { type: 'root', children: nodes }
  return unified()
    .use(remarkStringify)
    .use(remarkGfm)
    .stringify(tree)
    .trim()
}

/**
 * Extract plain text content from AST nodes (strips formatting).
 */
export const toPlainText = (nodes: Content[]): string => {
  const tree: Root = { type: 'root', children: nodes }
  return toString(tree).trim()
}

/**
 * Extract top-level sections grouped by h1 headings.
 *
 * @returns Map of heading text → content nodes under that heading
 * @throws Error if duplicate h1 headings found
 */
export const extractH1Sections = (ast: Root): Map<string, Content[]> => {
  const sections = new Map<string, Content[]>()
  let currentHeading: string | null = null
  let currentContent: Content[] = []

  for (const node of ast.children) {
    if (node.type === 'heading' && node.depth === 1) {
      // Save previous section
      if (currentHeading !== null) {
        if (sections.has(currentHeading)) {
          throw new Error(`Duplicate section '# ${currentHeading}' found`)
        }
        sections.set(currentHeading, currentContent)
      }

      // Start new section
      currentHeading = toString(node)
      currentContent = []
    } else if (currentHeading !== null) {
      // Add content to current section
      currentContent.push(node)
    }
    // Ignore content before first h1
  }

  // Save final section
  if (currentHeading !== null) {
    if (sections.has(currentHeading)) {
      throw new Error(`Duplicate section '# ${currentHeading}' found`)
    }
    sections.set(currentHeading, currentContent)
  }

  return sections
}

/**
 * Extract h2 subsections with their content.
 *
 * @param sectionContent - Content nodes from an h1 section
 * @returns Array of { heading, content } for each h2
 */
export const extractH2Subsections = (
  sectionContent: Content[]
): Array<{ heading: string; content: Content[] }> => {
  const subsections: Array<{ heading: string; content: Content[] }> = []
  let currentHeading: string | null = null
  let currentContent: Content[] = []

  for (const node of sectionContent) {
    if (node.type === 'heading' && node.depth === 2) {
      // Save previous subsection
      if (currentHeading !== null) {
        subsections.push({ heading: currentHeading, content: currentContent })
      }

      // Start new subsection
      currentHeading = toString(node)
      currentContent = []
    } else if (currentHeading !== null) {
      // Add content to current subsection
      currentContent.push(node)
    }
    // Ignore content before first h2
  }

  // Save final subsection
  if (currentHeading !== null) {
    subsections.push({ heading: currentHeading, content: currentContent })
  }

  return subsections
}
```

**Tests**: `src/utils/paka/extractor/markdown.test.ts`

Test cases:
- Parse simple markdown
- Extract h1 sections with content
- Extract h2 subsections
- Handle duplicate h1s (error)
- Handle empty sections
- Handle content before first heading
- Handle nested lists, code blocks, tables
- Preserve markdown formatting in toMarkdown

---

## Commit 3: Add Home schema classes

### What

Add Effect Schema classes for landing page data model in `src/utils/paka/schema.ts`.

### Why

The landing page feature needs structured storage for:
- Hero section (name, text, tagline)
- Highlights (feature cards)
- Body sections (content with exports insertion)

Effect Schema provides:
- Runtime validation
- Type safety
- Serialization/deserialization
- Consistent with existing Paka schema patterns

### How

**File**: `src/utils/paka/schema.ts`

**Add after Docs class (after line 143)**:

```typescript
/**
 * Landing page feature card.
 */
export class Feature extends S.Class<Feature>('Feature')({
  /** Feature title (from ## heading) */
  title: S.String,
  /** Feature description (markdown content) */
  body: S.String,
}) {}

/**
 * Landing page body section (content or exports marker).
 */
export const BodySection = S.Union(
  S.Struct({
    _tag: S.Literal('exports'),
  }),
  S.Struct({
    _tag: S.Literal('content'),
    title: S.String,
    body: S.String,
  }),
)
export type BodySection = S.Schema.Type<typeof BodySection>

/**
 * Landing page structured content.
 * At least one of hero, highlights, or body must be present (validated during parsing).
 */
export class Home extends S.Class<Home>('Home')({
  /** Hero section (optional - fallback to module.name if missing) */
  hero: S.optional(S.Struct({
    name: S.optional(S.String),
    text: S.optional(S.String),
    tagline: S.optional(S.String),
  })),
  /** Feature cards (optional) */
  highlights: S.optional(S.Array(Feature)),
  /** Body sections with exports insertion points (optional) */
  body: S.optional(S.Array(BodySection)),
}) {}

/**
 * Module-specific documentation with landing page support.
 */
export class ModuleDocs extends S.Class<ModuleDocs>('ModuleDocs')({
  /** Brief technical description */
  description: S.optional(S.String),
  /** Long-form guide content */
  guide: S.optional(S.String),
  /** Landing page content (triggers hero layout) */
  home: S.optional(Home),
}) {}
```

**Update Module class** (line 586):

Change:
```typescript
docs: S.optional(Docs),
```

To:
```typescript
docs: S.optional(ModuleDocs),
```

**Update ValueExport** - Keep using `Docs` (not `ModuleDocs`):

ValueExport continues to use `Docs` because exports should not have landing pages. The type system enforces this:
- `Module.docs` → `ModuleDocs` (can have `home`)
- `ValueExport.docs` → `Docs` (no `home` field)

**DocsProvenance** - No changes needed:

The `home` field doesn't need provenance tracking because it can ONLY come from `*.home.md` files. There's no ambiguity about the source (unlike `description` which can come from JSDoc or shadow namespace, and `guide` which can come from `@guide` tag or `.md` file).

---

## Commit 4: Add home page discovery

### What

Add `findNamespaceHomePage` function in `src/utils/paka/extractor/nodes/module.ts`.

### Why

Needs to discover `*.home.md` files in namespace directories using the convention:
- Any file matching `*.home.md` in the parent directory (where export declaration is)
- First alphabetically if multiple matches
- Example: `obj/union.home.md`, `obj/_.home.md`, `obj/index.home.md` all valid

This function plugs into existing file discovery pattern alongside `findModuleReadmePath`.

### How

**File**: `src/utils/paka/extractor/nodes/module.ts`

**Add after `findModuleReadme` (after line 62)**:

```typescript
/**
 * Find home page markdown for a namespace export.
 *
 * Convention: Any *.home.md file in the parent directory (alphabetically first if multiple).
 *
 * Example: For `export * as Union from './union.js'` in `obj/__.ts`,
 *          looks for *.home.md files in `obj/` directory.
 *
 * Valid examples:
 * - obj/union.home.md
 * - obj/_.home.md
 * - obj/index.home.md
 *
 * @param exportDeclFile - Source file containing the namespace export declaration
 * @returns Absolute path to home page markdown if found, undefined otherwise
 */
const findNamespaceHomePagePath = (exportDeclFile: string): string | undefined => {
  const dir = dirname(exportDeclFile)

  try {
    const files = readdirSync(dir)
    const homeFiles = files.filter(f => f.endsWith('.home.md')).sort()

    if (homeFiles.length === 0) return undefined

    // Warn if multiple home page files found
    if (homeFiles.length > 1) {
      console.warn(
        `Warning: Multiple .home.md files found in ${dir}:\n` +
        homeFiles.map(f => `  - ${f}`).join('\n') + '\n' +
        `Using first alphabetically: ${homeFiles[0]}`
      )
    }

    return join(dir, homeFiles[0])
  } catch (error) {
    // Directory read error - return undefined
    return undefined
  }
}

/**
 * Read home page markdown content.
 */
const findNamespaceHomePage = (exportDeclFile: string): string | undefined => {
  const path = findNamespaceHomePagePath(exportDeclFile)
  return path ? readFileSync(path, 'utf-8') : undefined
}
```

**Add helper to get relative path for provenance** (after above functions):

```typescript
/**
 * Convert absolute path to relative path for provenance tracking.
 */
const absoluteToRelative = (absolutePath: string): string => {
  return relative(process.cwd(), absolutePath)
}
```

---

## Commit 5: Add home page parser

### What

Add home page markdown parser in `src/utils/paka/extractor/home-page.ts`.

### Why

Parses `*.home.md` files into structured `Home` objects:
- Validates allowed h1 sections (Hero, Highlights, Body)
- Validates allowed h2 subsections (e.g., Name/Text/Tagline under Hero)
- Provides clear error messages for invalid structure
- Returns structured data ready for storage in schema

Separated into its own module for:
- Testability (can unit test parser without full module extraction)
- Clarity (home page logic isolated from module extraction)
- Reusability (could be used by other extractors in future)

### How

**File**: `src/utils/paka/extractor/home-page.ts`

```typescript
import { Home, Feature, BodySection } from '../schema.js'
import {
  parseMarkdown,
  extractH1Sections,
  extractH2Subsections,
  toMarkdown,
  toPlainText,
} from './markdown.js'
import type { Content } from 'mdast'

/**
 * Parse home page markdown into structured Home object.
 *
 * @param markdown - Raw markdown content
 * @param filePath - Path to file (for error messages)
 * @returns Parsed Home object
 * @throws Error if markdown structure is invalid
 */
export const parseHomePage = (markdown: string, filePath: string): Home => {
  const ast = parseMarkdown(markdown)
  const sections = extractH1Sections(ast)

  // Validate sections
  validateSections(sections, filePath)

  // Parse each section
  const hero = sections.has('Hero') ? parseHeroSection(sections.get('Hero')!, filePath) : undefined
  const highlights = sections.has('Highlights') ? parseHighlightsSection(sections.get('Highlights')!) : undefined
  const body = sections.has('Body') ? parseBodySection(sections.get('Body')!) : undefined

  return Home.make({ hero, highlights, body })
}

/**
 * Validate h1 section structure.
 */
const validateSections = (sections: Map<string, Content[]>, filePath: string): void => {
  const allowedH1s = ['Hero', 'Highlights', 'Body']
  const foundH1s = Array.from(sections.keys())

  // Check for unknown h1s
  const unknownH1s = foundH1s.filter(h1 => !allowedH1s.includes(h1))
  if (unknownH1s.length > 0) {
    throw new Error(
      `Invalid heading${unknownH1s.length > 1 ? 's' : ''} in file '${filePath}':\n` +
      unknownH1s.map(h => `  # ${h}`).join('\n') + '\n' +
      `Allowed top-level headings: ${allowedH1s.map(h => `# ${h}`).join(', ')}`
    )
  }

  // Check for at least one section
  if (foundH1s.length === 0) {
    throw new Error(
      `No valid sections found in file '${filePath}'\n` +
      `At least one of the following sections is required: ${allowedH1s.map(h => `# ${h}`).join(', ')}`
    )
  }
}

/**
 * Parse Hero section into hero object.
 */
const parseHeroSection = (
  sectionContent: Content[],
  filePath: string
): Home['hero'] => {
  const allowedH2s = ['Name', 'Text', 'Tagline']
  const subsections = extractH2Subsections(sectionContent)

  // Validate h2s
  const foundH2s = subsections.map(s => s.heading)
  const invalidH2s = foundH2s.filter(h2 => !allowedH2s.includes(h2))

  if (invalidH2s.length > 0) {
    throw new Error(
      `Invalid subheading${invalidH2s.length > 1 ? 's' : ''} under '# Hero' in file '${filePath}':\n` +
      invalidH2s.map(h => `  ## ${h}`).join('\n') + '\n' +
      `Allowed subheadings: ${allowedH2s.map(h => `## ${h}`).join(', ')}`
    )
  }

  // Extract content
  const hero: Home['hero'] = {}
  for (const { heading, content } of subsections) {
    const text = toPlainText(content)
    if (heading === 'Name') hero.name = text
    if (heading === 'Text') hero.text = text
    if (heading === 'Tagline') hero.tagline = text
  }

  return Object.keys(hero).length > 0 ? hero : undefined
}

/**
 * Parse Highlights section into features array.
 */
const parseHighlightsSection = (sectionContent: Content[]): Feature[] => {
  const subsections = extractH2Subsections(sectionContent)

  return subsections.map(({ heading, content }) =>
    Feature.make({
      title: heading,
      body: toMarkdown(content),
    })
  )
}

/**
 * Parse Body section into body sections array.
 */
const parseBodySection = (sectionContent: Content[]): BodySection[] => {
  const subsections = extractH2Subsections(sectionContent)

  return subsections.map(({ heading, content }) => {
    if (heading === 'Exports') {
      return { _tag: 'exports' as const }
    } else {
      return {
        _tag: 'content' as const,
        title: heading,
        body: toMarkdown(content),
      }
    }
  })
}
```

**Tests**: `src/utils/paka/extractor/home-page.test.ts`

Test cases:
- Parse valid home page with all sections
- Parse minimal home page (Highlights only)
- Error on unknown h1 heading
- Error on invalid h2 under Hero
- Error on duplicate sections
- Error on empty file / no sections
- Handle empty Hero/Highlights/Body sections
- Handle ## Exports in Body
- Multiple features in Highlights
- Markdown preservation (lists, code blocks, etc.)

---

## Commit 6: Integrate home page extraction into module extraction

### What

Integrate home page discovery and parsing into the module extraction flow in `src/utils/paka/extractor/nodes/module.ts`.

### Why

Completes the extractor side of the feature:
- Discovers `*.home.md` files when extracting namespace exports
- Parses them into `Home` objects
- Stores in `Module.docs.home` field
- Tracks provenance in `Module.docsProvenance.home`

This commit wires together all the previous infrastructure (discovery, parsing, schema) into the extraction pipeline.

### How

**File**: `src/utils/paka/extractor/nodes/module.ts`

**Import home page parser** (add to top imports):

```typescript
import { parseHomePage } from './home-page.js'
```

**Update `createNamespaceExport` function** (around line 79):

Find the section where `nestedModule` is extracted (around line 91-101):

```typescript
const nestedModule = createModuleNode(
  module.name,
  referencedFile,
  nestedLocation,
  { parsingContext, options },
)
```

**Add after `nestedModule` creation**:

```typescript
// Check for namespace home page
const homePageMarkdown = findNamespaceHomePage(sourceFile.getFilePath())
if (homePageMarkdown) {
  try {
    const homePagePath = findNamespaceHomePagePath(sourceFile.getFilePath())!
    const home = parseHomePage(homePageMarkdown, homePagePath)

    // Create/update ModuleDocs with home
    const existingDocs = nestedModule.docs || ModuleDocs.make({})
    nestedModule.docs = ModuleDocs.make({
      description: existingDocs.description,
      guide: existingDocs.guide,
      home: home,
    })

    // Note: No provenance needed for home - it can only come from *.home.md files
  } catch (error) {
    // Re-throw with context about which namespace failed
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse home page for namespace '${module.name}':\n${error.message}`
      )
    }
    throw error
  }
}
```

**Why this approach**:
- Preserves existing `description` and `guide` (separate concerns)
- Only adds `home` field if `*.home.md` found
- Tracks provenance for debugging
- Clear error messages with namespace context

---

## Commit 7: Update VitePress adaptor to generate landing pages

### What

Update VitePress adaptor in `src/utils/paka/adaptors/vitepress.ts` to generate landing page layout when `Module.docs.home` exists.

### Why

Completes the feature end-to-end:
- Detects modules with landing pages (`home` field present)
- Generates VitePress frontmatter with `layout: home`
- Builds hero section from `home.hero` (fallback to module.name)
- Generates feature cards from `home.highlights`
- Renders body sections with exports insertion

This is the final piece that makes landing pages visible to users.

### How

**File**: `src/utils/paka/adaptors/vitepress.ts`

**Add landing page detection** (after `generatePageContent` function around line 440):

```typescript
/**
 * Check if module should use landing page layout.
 */
const shouldUseLandingPage = (module: Module): boolean => {
  return module.docs?.home !== undefined
}
```

**Update `generatePageContent` function** (around line 440):

Replace:
```typescript
export const generatePageContent = (module: Module, breadcrumbs: string[]): string => {
  const description = module.docs?.description || ''
  const guide = module.docs?.guide ? `\n\n${module.docs.guide}` : ''

  return Md.sections(
    Md.heading(1, breadcrumbs.join('.')),
    description + guide,
    renderImportSection(...),
    renderExportsSection(...),
  )
}
```

With:
```typescript
export const generatePageContent = (module: Module, breadcrumbs: string[]): string => {
  if (shouldUseLandingPage(module)) {
    return generateLandingPage(module, breadcrumbs)
  } else {
    return generateStandardPage(module, breadcrumbs)
  }
}

/**
 * Generate standard doc page (existing logic).
 */
const generateStandardPage = (module: Module, breadcrumbs: string[]): string => {
  const description = module.docs?.description || ''
  const guide = module.docs?.guide ? `\n\n${module.docs.guide}` : ''

  return Md.sections(
    Md.heading(1, breadcrumbs.join('.')),
    description + guide,
    renderImportSection(module, breadcrumbs),
    namespaceExports.length > 0 ? renderNamespacesSection(namespaceExports) : '',
    renderExportsSection(module, breadcrumbs),
  )
}

/**
 * Generate landing page with hero layout.
 */
const generateLandingPage = (module: Module, breadcrumbs: string[]): string => {
  const home = module.docs!.home!

  // Build VitePress frontmatter
  const frontmatter = {
    layout: 'home',
    sidebar: false,
    hero: {
      name: home.hero?.name ?? breadcrumbs.join('.'),
      text: home.hero?.text ?? '',
      tagline: home.hero?.tagline ?? '',
    },
    features: home.highlights?.map(h => ({
      title: h.title,
      details: h.body,
    })) ?? [],
  }

  // Build body content
  const bodyContent = home.body?.map(section => {
    if (section._tag === 'exports') {
      return renderExportsSection(module, breadcrumbs)
    } else {
      return `## ${section.title}\n\n${section.body}`
    }
  }).join('\n\n') ?? ''

  // Combine frontmatter + body
  const frontmatterYaml = [
    '---',
    `layout: ${frontmatter.layout}`,
    `sidebar: ${frontmatter.sidebar}`,
    '',
    'hero:',
    `  name: "${frontmatter.hero.name}"`,
    `  text: "${frontmatter.hero.text}"`,
    `  tagline: "${frontmatter.hero.tagline}"`,
    '',
    'features:',
    ...frontmatter.features.map(f => [
      '  - title: ' + JSON.stringify(f.title),
      '    details: ' + JSON.stringify(f.details),
    ]).flat(),
    '---',
  ].join('\n')

  return [
    frontmatterYaml,
    '',
    bodyContent,
  ].join('\n')
}
```

**Note on exports rendering**:

The `renderExportsSection` function already exists and generates sections for:
- Functions (if any)
- Types (if any)
- Constants (if any)
- Classes (if any)

No changes needed to that function - it works as-is for landing pages.

---

## Commit 8: Add integration tests

### What

Add end-to-end tests for the landing page feature in `src/utils/paka/extractor/integration.test.ts`.

### Why

Verify the complete flow:
- Namespace with `*.home.md` file gets `home` field populated
- Extracted `Home` object has correct structure
- Provenance tracks the source file
- VitePress adaptor generates correct frontmatter and content
- Error cases are handled gracefully

These tests complement unit tests by verifying the full pipeline.

### How

**File**: `src/utils/paka/extractor/integration.test.ts` (create if doesn't exist)

```typescript
import { describe, test, expect } from 'vitest'
import { extractModule } from './nodes/module.js'
import { generatePageContent } from '../adaptors/vitepress.js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

describe('Landing pages integration', () => {
  const fixturesDir = join(__dirname, '__fixtures__', 'landing-pages')

  test('namespace with .home.md gets landing page', () => {
    // Setup fixture
    mkdirSync(join(fixturesDir, 'simple'), { recursive: true })

    // Create namespace export file
    writeFileSync(
      join(fixturesDir, 'simple', '__.ts'),
      `export * as Math from './math.js'`
    )

    // Create home page markdown
    writeFileSync(
      join(fixturesDir, 'simple', 'math.home.md'),
      `# Hero

## Name
Math Utilities

## Text
Mathematical operations and functions.

## Tagline
Comprehensive math toolkit

# Highlights

## Addition
Add numbers together.

## Subtraction
Subtract one number from another.

# Body

## Getting Started

Import the Math namespace:

\`\`\`typescript
import { Math } from '@example/lib'
\`\`\`

## Exports
`
    )

    // Create referenced module file
    writeFileSync(
      join(fixturesDir, 'simple', 'math.ts'),
      `export const add = (a: number, b: number) => a + b`
    )

    // Extract module
    const module = extractModule(join(fixturesDir, 'simple', '__.ts'))

    // Verify home field populated
    expect(module.exports).toHaveLength(1)
    const mathExport = module.exports[0]
    expect(mathExport.type).toBe('namespace')
    expect(mathExport.name).toBe('Math')
    expect(mathExport.module?.docs?.home).toBeDefined()

    // Verify structure
    const home = mathExport.module!.docs!.home!
    expect(home.hero?.name).toBe('Math Utilities')
    expect(home.hero?.text).toBe('Mathematical operations and functions.')
    expect(home.hero?.tagline).toBe('Comprehensive math toolkit')
    expect(home.highlights).toHaveLength(2)
    expect(home.highlights[0].title).toBe('Addition')
    expect(home.highlights[1].title).toBe('Subtraction')
    expect(home.body).toHaveLength(2)
    expect(home.body[0]).toEqual({ _tag: 'content', title: 'Getting Started', body: expect.stringContaining('Import the Math namespace') })
    expect(home.body[1]).toEqual({ _tag: 'exports' })

    // Verify VitePress output
    const vitepress = generatePageContent(mathExport.module!, ['Math'])
    expect(vitepress).toContain('layout: home')
    expect(vitepress).toContain('sidebar: false')
    expect(vitepress).toContain('name: "Math Utilities"')
    expect(vitepress).toContain('title: "Addition"')
    expect(vitepress).toContain('title: "Subtraction"')
    expect(vitepress).toContain('## Getting Started')
  })

  test('namespace without .home.md gets standard page', () => {
    // Setup fixture without home page
    mkdirSync(join(fixturesDir, 'standard'), { recursive: true })

    writeFileSync(
      join(fixturesDir, 'standard', '__.ts'),
      `export * as Utils from './utils.js'`
    )

    writeFileSync(
      join(fixturesDir, 'standard', 'utils.ts'),
      `export const noop = () => {}`
    )

    // Extract module
    const module = extractModule(join(fixturesDir, 'standard', '__.ts'))

    // Verify no home field
    const utilsExport = module.exports[0]
    expect(utilsExport.module?.docs?.home).toBeUndefined()

    // Verify standard VitePress output
    const vitepress = generatePageContent(utilsExport.module!, ['Utils'])
    expect(vitepress).not.toContain('layout: home')
    expect(vitepress).toContain('# Utils')
  })

  test('invalid home page structure throws error', () => {
    // Setup fixture with invalid markdown
    mkdirSync(join(fixturesDir, 'invalid'), { recursive: true })

    writeFileSync(
      join(fixturesDir, 'invalid', '__.ts'),
      `export * as Bad from './bad.js'`
    )

    writeFileSync(
      join(fixturesDir, 'invalid', 'bad.home.md'),
      `# InvalidSection\n\nContent here`
    )

    writeFileSync(
      join(fixturesDir, 'invalid', 'bad.ts'),
      `export const x = 1`
    )

    // Extract should throw error
    expect(() => {
      extractModule(join(fixturesDir, 'invalid', '__.ts'))
    }).toThrow(/Invalid heading.*InvalidSection/)
  })
})
```

---

## Commit 9: Update documentation

### What

Add documentation for the landing pages feature in Kit's docs and Paka's usage guide.

### Why

Users need to know:
- How to create landing pages for their namespaces
- What markdown structure is required
- What validation errors mean
- See examples of working landing pages

This completes the feature by making it discoverable and usable.

### How

**File 1**: `src/utils/paka/README.md` (or create if doesn't exist)

Add section:

```markdown
## Landing Pages

Namespace exports can have custom landing pages with hero sections and feature cards.

### Creating a Landing Page

1. Create a `*.home.md` file in the namespace directory
2. Structure the markdown with these sections:

\`\`\`markdown
# Hero

## Name
Your Namespace Title

## Text
Brief description of the namespace.

## Tagline
Catchy one-liner about the namespace

# Highlights

## Feature 1
Description of first highlight.

## Feature 2
Description of second highlight.

# Body

## Getting Started

Guide content here.

## Exports

## Advanced Topics

More content here.
\`\`\`

### Validation Rules

**Allowed top-level headings**: `# Hero`, `# Highlights`, `# Body`

**Hero subheadings**: `## Name`, `## Text`, `## Tagline`

**Highlights subheadings**: Any `##` heading becomes a feature card

**Body subheadings**: Any `##` heading. `## Exports` is special - auto-generates exports list.

### Examples

See `src/domains/str/code/code.home.md` for a complete example.

### Error Messages

Common errors:

- `Invalid heading '# Summary'` - Use only Hero, Highlights, or Body
- `Invalid subheading '## Description' under '# Hero'` - Use Name, Text, or Tagline
- `Duplicate section '# Body'` - Each section can appear only once
- `No valid sections found` - At least one section required
```

**File 2**: Add example landing page `src/domains/str/code/code.home.md`:

```markdown
# Hero

## Name
Code Manipulation

## Text
Utilities for working with source code strings.

## Tagline
Generate, parse, and transform code in multiple formats

# Highlights

## Markdown Utilities

Generate markdown elements like inline code, code blocks, links, and tables.

Perfect for documentation generation tools.

## TypeScript Tools

Parse and manipulate TypeScript syntax:

- Extract type information
- Transform AST nodes
- Generate type-safe code

## TSDoc Parsing

Extract and format TSDoc comments from source code.

# Body

## Getting Started

Import the Code namespace:

\`\`\`typescript
import { Str } from '@wollybeard/kit'

// Use Markdown utilities
const code = Str.Code.Md.inlineCode('foo')

// Use TypeScript utilities
const ast = Str.Code.TS.parse('type Foo = string')

// Use TSDoc utilities
const doc = Str.Code.TSDoc.parse('/** @param x - The value */')
\`\`\`

## Exports

## Sub-Namespaces

The Code namespace is organized into specialized sub-namespaces for different code formats.
```

---

## Summary

This implementation plan delivers the namespace landing pages feature through 9 logical commits:

1. **Dependencies** - Add markdown parsing packages
2. **Utilities** - Generic markdown AST manipulation
3. **Schema** - Data models for landing pages
4. **Discovery** - Find `*.home.md` files
5. **Parser** - Parse markdown into structured data
6. **Integration** - Wire parser into extraction pipeline
7. **Adaptor** - Generate VitePress landing pages
8. **Tests** - End-to-end integration tests
9. **Docs** - User-facing documentation and examples

Each commit is:
- **Standalone** - Can be understood and reviewed independently
- **Tested** - Has clear test requirements
- **Incremental** - Builds on previous commits
- **Non-breaking** - Existing functionality unchanged until final commits
