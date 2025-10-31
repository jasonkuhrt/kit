# Namespace Landing Pages Feature Specification

## Overview

Add opt-in landing page support for namespaces in Paka's VitePress adaptor using a `*.home.md` file naming convention.

---

## Naming Convention

### File Pattern

**Pattern**: `*.home.md`

**Location**: Namespace directory

**Examples**:
```
src/domains/str/code/
├── _.home.md              # Valid
├── index.home.md          # Valid
├── code.home.md           # Valid
├── anything.home.md       # Valid - any prefix allowed
└── _.ts
```

**Discovery Logic**:
1. Search namespace directory for files matching `*.home.md` pattern
2. If multiple matches found, use first alphabetically
3. Presence of any `*.home.md` file triggers landing page generation

---

## Content Structure

### Allowed Top-Level Headings (h1)

Only these h1 headings are permitted:

- `# Hero` - Hero section configuration
- `# Highlights` - Feature cards section
- `# Body` - Free-form content area

**Validation**:
- Unknown h1 headings → **Error and fail extraction**
- Must have **at least one** of the three allowed sections
- Duplicate sections → **Error and fail extraction**
- Sections can appear in **any order** (no order validation)

### # Hero Section

**Purpose**: Define hero banner content

**Allowed h2 Subheadings**:
- `## Name` - Hero title/name
- `## Text` - Hero description
- `## Tagline` - Hero tagline

**Validation**:
- Any other h2 under # Hero → **Error**
- All h2s are optional
- If entire # Hero section missing → fallback to `hero.name = module.name`, `hero.text` and `hero.tagline` empty

**Example**:
```markdown
# Hero

## Name
Code Manipulation Utilities

## Text
Transform, parse, and generate source code strings.

## Tagline
Comprehensive tools for working with code in multiple formats.
```

**Extracted Data**:
```typescript
{
  hero: {
    name: "Code Manipulation Utilities",
    text: "Transform, parse, and generate source code strings.",
    tagline: "Comprehensive tools for working with code in multiple formats."
  }
}
```

### # Highlights Section

**Purpose**: Define feature cards

**Structure**:
- Any number of h2 subheadings allowed
- Each `## <Feature Name>` becomes a feature card
- Content under each h2 (all markdown until next h2 or section end) becomes feature card content

**Validation**:
- No validation of h2 names against actual exports/namespaces
- Any h2 heading accepted
- Content can be multi-paragraph, lists, code blocks, etc.

**Example**:
```markdown
# Highlights

## Markdown Generation

Generate markdown elements like inline code, links, and tables.

Perfect for documentation tooling.

## TypeScript Parsing

Parse and manipulate TypeScript syntax.

- Extract type information
- Transform AST nodes
- Generate type-safe code

## TSDoc Extraction

Extract and format TSDoc comments from source code.
```

**Extracted Data**:
```typescript
{
  highlights: [
    {
      title: "Markdown Generation",
      content: "Generate markdown elements like inline code, links, and tables.\n\nPerfect for documentation tooling."
    },
    {
      title: "TypeScript Parsing",
      content: "Parse and manipulate TypeScript syntax.\n\n- Extract type information\n- Transform AST nodes\n- Generate type-safe code"
    },
    {
      title: "TSDoc Extraction",
      content: "Extract and format TSDoc comments from source code."
    }
  ]
}
```

### # Body Section

**Purpose**: Free-form content area with optional exports insertion

**Structure**:
- Any number of h2 subheadings allowed
- `## Exports` is a special heading that marks where auto-generated exports should be inserted
- Other h2 headings are regular content sections
- Content under each h2 is captured as markdown

**Validation**:
- Any h2 allowed
- `## Exports` is recognized but not required

**Example**:
```markdown
# Body

## Getting Started

Import the namespace:

\`\`\`typescript
import { Str } from '@wollybeard/kit'

Str.Code.Md.inlineCode('foo')  // `foo`
\`\`\`

## Exports

## Advanced Usage

For complex transformations, combine multiple utilities...
```

**Extracted Data**:
```typescript
{
  body: [
    {
      _tag: 'content',
      title: 'Getting Started',
      body: 'Import the namespace:\n\n```typescript\nimport { Str } from \'@wollybeard/kit\'\n\nStr.Code.Md.inlineCode(\'foo\')  // `foo`\n```'
    },
    {
      _tag: 'exports'
    },
    {
      _tag: 'content',
      title: 'Advanced Usage',
      body: 'For complex transformations, combine multiple utilities...'
    }
  ]
}
```

---

## Content Parsing

### Markdown Parsing Approach

Use **AST-based parsing** (via markdown parser like `unified` + `remark`):

1. Parse markdown file to AST
2. Identify top-level h1 nodes
3. Validate h1 headings against allowed list
4. For each section, extract h2 nodes and their content
5. Validate h2 headings based on parent h1 section
6. Build structured Home object

### Parsing Algorithm

```
1. Parse markdown to AST
2. Extract all h1 headings
3. Validate: each h1 must be one of [Hero, Highlights, Body]
4. Validate: no duplicate h1 sections
5. Validate: at least one h1 present

For each h1 section:
  If section = "Hero":
    - Extract h2 nodes
    - Validate: each h2 must be one of [Name, Text, Tagline]
    - For each h2, extract text content (all nodes until next h2)
    - Build hero object

  If section = "Highlights":
    - Extract h2 nodes
    - For each h2:
      * title = h2 heading text
      * content = all content until next h2 (as markdown string)
    - Build highlights array

  If section = "Body":
    - Extract h2 nodes
    - For each h2:
      * If heading = "Exports":
        + Add { _tag: 'exports' } to body array
      * Else:
        + title = h2 heading text
        + body = all content until next h2 (as markdown string)
        + Add { _tag: 'content', title, body } to body array
    - Build body array

6. Return Home object
```

### Error Messages

**Unknown h1 heading**:
```
Error: Invalid heading '# Summary' in file 'code.home.md'
Allowed top-level headings: # Hero, # Highlights, # Body
```

**Invalid h2 under # Hero**:
```
Error: Invalid subheading '## Description' under '# Hero' in file 'code.home.md'
Allowed subheadings: ## Name, ## Text, ## Tagline
```

**Duplicate section**:
```
Error: Duplicate section '# Body' found in file 'code.home.md'
Each section can appear at most once.
```

**No sections found**:
```
Error: No valid sections found in file 'code.home.md'
At least one of the following sections is required: # Hero, # Highlights, # Body
```

---

## Schema Design

### Module Docs Extension

```typescript
/**
 * Module-specific documentation extending base Docs with landing page support.
 */
class ModuleDocs extends Docs {
  /**
   * Landing page content (optional).
   * When present, triggers landing page layout in VitePress adaptor.
   */
  home?: Home
}
```

### Home Class

```typescript
class Home {
  /**
   * Hero section content.
   * If undefined, hero.name defaults to module.name, hero.text/tagline are empty.
   */
  hero?: {
    name?: string      // From ## Name under # Hero
    text?: string      // From ## Text under # Hero
    tagline?: string   // From ## Tagline under # Hero
  }

  /**
   * Feature cards for highlights section.
   * Only contains manually-defined features from # Highlights section.
   * No auto-generation from namespaces.
   */
  highlights: Feature[]

  /**
   * Body sections with optional exports insertion point.
   * Sections appear in order found in markdown file.
   */
  body: BodySection[]
}
```

### Feature Type

```typescript
type Feature = {
  /**
   * Feature title (from ## heading under # Highlights)
   */
  title: string

  /**
   * Feature description (markdown content under ## heading)
   */
  content: string
}
```

### BodySection Type

```typescript
type BodySection =
  | {
      /**
       * Marks position where auto-generated exports should be inserted
       */
      _tag: 'exports'
    }
  | {
      /**
       * Custom content section
       */
      _tag: 'content'
      /**
       * Section title (from ## heading under # Body)
       */
      title: string
      /**
       * Section content (markdown content under ## heading)
       */
      body: string
    }
```

### Integration with Module

```typescript
class Module {
  // ... existing fields

  /**
   * Module documentation.
   * Uses ModuleDocs instead of Docs to support landing pages.
   */
  docs?: ModuleDocs

  // ... rest of fields
}
```

### Relationship to Existing Docs

**Key Principle**: `description` and `guide` are for standard doc pages, `home` is for landing pages.

| Field | Used For | Purpose |
|-------|----------|---------|
| `description` | Standard doc layout | Short description shown on non-landing pages |
| `guide` | Standard doc layout | Longer guide content shown on non-landing pages |
| `home` | Landing page layout | Hero + highlights + body content for landing pages |

**Behavior**:
- If `home` is present → VitePress adaptor generates landing page (`layout: home`)
- If `home` is absent → VitePress adaptor generates standard doc page (`layout: doc`)
- `description` and `guide` are **separate concerns** from `home`
- Landing page may or may not use `description`/`guide` (depends on adaptor implementation)

---

## Extractor Implementation

### File Discovery

**Location**: `src/utils/paka/extractor/nodes/module.ts`

```typescript
function findNamespaceHomePage(namespacePath: string): string | null {
  const files = fs.readdirSync(namespacePath)
  const homeFiles = files.filter(f => f.endsWith('.home.md'))

  if (homeFiles.length === 0) return null
  if (homeFiles.length === 1) return path.join(namespacePath, homeFiles[0])

  // Multiple matches - use first alphabetically
  const sortedFiles = homeFiles.sort()
  return path.join(namespacePath, sortedFiles[0])
}
```

### Content Parsing

**Dependencies**: Use existing markdown parsing (likely `unified` + `remark`)

```typescript
function parseHomePage(filePath: string): Home {
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = parseMarkdown(content)  // Returns markdown AST

  const sections = extractH1Sections(ast)

  // Validate sections
  validateSections(sections, filePath)

  // Parse each section
  const hero = sections['Hero'] ? parseHeroSection(sections['Hero'], filePath) : undefined
  const highlights = sections['Highlights'] ? parseHighlightsSection(sections['Highlights']) : []
  const body = sections['Body'] ? parseBodySection(sections['Body']) : []

  return new Home({ hero, highlights, body })
}
```

### Validation Functions

```typescript
function validateSections(sections: Record<string, ASTNode>, filePath: string): void {
  const allowedH1s = ['Hero', 'Highlights', 'Body']
  const foundH1s = Object.keys(sections)

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

  // Duplicates already handled by extractH1Sections (should error if duplicate keys)
}

function parseHeroSection(sectionNode: ASTNode, filePath: string): Home['hero'] {
  const allowedH2s = ['Name', 'Text', 'Tagline']
  const h2Nodes = extractH2Nodes(sectionNode)

  // Validate h2s
  const foundH2s = h2Nodes.map(n => n.heading)
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
  for (const { heading, content } of h2Nodes) {
    if (heading === 'Name') hero.name = contentToString(content)
    if (heading === 'Text') hero.text = contentToString(content)
    if (heading === 'Tagline') hero.tagline = contentToString(content)
  }

  return hero
}

function parseHighlightsSection(sectionNode: ASTNode): Feature[] {
  const h2Nodes = extractH2Nodes(sectionNode)

  return h2Nodes.map(({ heading, content }) => ({
    title: heading,
    content: contentToMarkdown(content)  // Preserve markdown formatting
  }))
}

function parseBodySection(sectionNode: ASTNode): BodySection[] {
  const h2Nodes = extractH2Nodes(sectionNode)

  return h2Nodes.map(({ heading, content }) => {
    if (heading === 'Exports') {
      return { _tag: 'exports' as const }
    } else {
      return {
        _tag: 'content' as const,
        title: heading,
        body: contentToMarkdown(content)
      }
    }
  })
}
```

### Integration into Module Extraction

```typescript
// In extractModule or createNamespaceExport function

function extractModule(filePath: string): Module {
  // ... existing extraction logic

  // Check for home page
  const homePath = findNamespaceHomePage(path.dirname(filePath))
  const home = homePath ? parseHomePage(homePath) : undefined

  // Create ModuleDocs instead of Docs
  const moduleDocs = new ModuleDocs({
    description: /* extracted description */,
    guide: /* extracted guide */,
    home: home  // Add home if found
  })

  return new Module({
    // ... existing fields
    docs: moduleDocs
  })
}
```

---

## VitePress Adaptor Implementation

### Landing Page Detection

```typescript
function shouldUseLandingPage(module: Module): boolean {
  return module.docs?.home !== undefined
}
```

### Page Generation

```typescript
function generatePage(module: Module, breadcrumbs: string[]): string {
  if (shouldUseLandingPage(module)) {
    return generateLandingPage(module, breadcrumbs)
  } else {
    return generateStandardPage(module, breadcrumbs)
  }
}
```

### Landing Page Generation

```typescript
function generateLandingPage(module: Module, breadcrumbs: string[]): string {
  const home = module.docs!.home!

  // Build frontmatter
  const frontmatter = {
    layout: 'home',
    sidebar: false,
    hero: {
      name: home.hero?.name ?? module.name,
      text: home.hero?.text ?? '',
      tagline: home.hero?.tagline ?? ''
    },
    features: home.highlights.map(h => ({
      title: h.title,
      details: h.content
    }))
  }

  // Build body content
  const bodyContent = home.body.map(section => {
    if (section._tag === 'exports') {
      return generateExportsSection(module)
    } else {
      return `## ${section.title}\n\n${section.body}`
    }
  }).join('\n\n')

  return [
    generateFrontmatter(frontmatter),
    '',
    bodyContent
  ].join('\n')
}
```

### Exports Section Generation

```typescript
function generateExportsSection(module: Module): string {
  // Generate standard exports sections (functions, types, constants, classes)
  const sections = []

  const functions = module.exports.filter(e => e.type === 'function')
  if (functions.length > 0) {
    sections.push(generateFunctionsSection(functions))
  }

  const types = module.exports.filter(e => e.type === 'type')
  if (types.length > 0) {
    sections.push(generateTypesSection(types))
  }

  const constants = module.exports.filter(e => e.type === 'const')
  if (constants.length > 0) {
    sections.push(generateConstantsSection(constants))
  }

  const classes = module.exports.filter(e => e.type === 'class')
  if (classes.length > 0) {
    sections.push(generateClassesSection(classes))
  }

  return sections.join('\n\n')
}
```

---

## User Journeys

### Journey 1: Create Simple Landing Page

**User**: Library author wants to add a landing page for `Str.Code` namespace

**Steps**:
1. Create file `src/domains/str/code/_.home.md`
2. Add # Hero section with name, text, tagline
3. Add # Highlights section with 3 feature cards for sub-namespaces (Md, TS, TSDoc)
4. Run `paka extract`
5. VitePress adaptor generates `docs/api/str/code.md` with `layout: home`
6. User previews docs site, sees hero banner + 3 feature cards
7. User clicks on a feature card, navigates to sub-namespace page

**Result**: Landing page successfully created with hero and feature cards

### Journey 2: Add Custom Content with Exports

**User**: Library author wants landing page with custom guide content AND auto-generated exports list

**Steps**:
1. Create file `src/domains/str/code/code.home.md`
2. Add # Hero section
3. Add # Highlights section with custom highlights (not just sub-namespaces)
4. Add # Body section with:
   - ## Getting Started section
   - ## Exports section (empty)
   - ## Advanced Usage section
5. Run `paka extract`
6. VitePress adaptor generates page with:
   - Hero banner
   - Custom feature cards from highlights
   - Getting Started content
   - Auto-generated exports (functions, types, etc.)
   - Advanced Usage content
7. User previews docs site, sees fully customized landing page with exports in the middle

**Result**: Complex landing page with custom content and auto-generated exports

### Journey 3: Error Recovery - Invalid Heading

**User**: Library author makes typo in heading name

**Steps**:
1. Create file `src/domains/str/code/_.home.md`
2. Accidentally type `# Heero` instead of `# Hero`
3. Run `paka extract`
4. Extractor fails with clear error:
   ```
   Error: Invalid heading '# Heero' in file '_.home.md'
   Allowed top-level headings: # Hero, # Highlights, # Body
   ```
5. User fixes typo to `# Hero`
6. Run `paka extract` again
7. Extraction succeeds

**Result**: Clear error message helps user quickly identify and fix mistake

### Journey 4: Error Recovery - Invalid Subheading

**User**: Library author adds incorrect subheading under # Hero

**Steps**:
1. Create file with # Hero section
2. Add subheading `## Description` (should be `## Text`)
3. Run `paka extract`
4. Extractor fails with error:
   ```
   Error: Invalid subheading '## Description' under '# Hero' in file 'code.home.md'
   Allowed subheadings: ## Name, ## Text, ## Tagline
   ```
5. User changes `## Description` to `## Text`
6. Run `paka extract`
7. Extraction succeeds

**Result**: Validation catches mistake and guides user to correct heading name

### Journey 5: Minimal Landing Page

**User**: Library author wants simple landing page with just highlights, no hero or body

**Steps**:
1. Create file with only `# Highlights` section
2. Add 3 feature cards
3. Run `paka extract`
4. VitePress adaptor generates page with:
   - Hero banner using default values (hero.name = module.name, no text/tagline)
   - 3 feature cards
   - No body content
5. User previews docs, sees minimal landing page

**Result**: Minimal landing page works with just one section

### Journey 6: Namespace Without Landing Page

**User**: Library author has some namespaces with landing pages, some without

**Steps**:
1. `Str.Code` has `code.home.md` file → gets landing page
2. `Str.Text` has no `*.home.md` file → gets standard doc page
3. Run `paka extract`
4. VitePress adaptor generates:
   - `/api/str/code.md` with `layout: home`
   - `/api/str/text.md` with `layout: doc` (standard)
5. User previews docs:
   - `/api/str/code` shows landing page (no sidebar)
   - `/api/str/text` shows standard page (with sidebar)

**Result**: Mixed landing pages and standard pages coexist correctly

---

## Failure States

| Failure | Detection Point | Error Message | User Action |
|---------|----------------|---------------|-------------|
| Unknown h1 heading | Extractor parsing | `Error: Invalid heading '# Summary' in file 'code.home.md'\nAllowed top-level headings: # Hero, # Highlights, # Body` | Fix heading name to match allowed list |
| Invalid h2 under # Hero | Extractor parsing | `Error: Invalid subheading '## Description' under '# Hero' in file 'code.home.md'\nAllowed subheadings: ## Name, ## Text, ## Tagline` | Change h2 to one of allowed names |
| Duplicate section | Extractor parsing | `Error: Duplicate section '# Body' found in file 'code.home.md'\nEach section can appear at most once.` | Remove duplicate section |
| No sections found | Extractor parsing | `Error: No valid sections found in file 'code.home.md'\nAt least one of the following sections is required: # Hero, # Highlights, # Body` | Add at least one valid section |
| Multiple *.home.md files | Extractor discovery | Warning: `Multiple .home.md files found in directory, using first alphabetically: _.home.md` | Remove extra files or rename to ensure only one matches |
| Empty # Highlights | Extractor parsing | No error - valid case | highlights array will be empty, no features shown |
| Empty # Body | Extractor parsing | No error - valid case | body array will be empty, only hero/highlights shown |
| ## Exports in # Highlights | Extractor parsing | No error - treated as regular feature | Feature titled "Exports" created (unexpected but not invalid) |
| Malformed markdown | Extractor parsing | `Error: Failed to parse markdown in file 'code.home.md': [parser error]` | Fix markdown syntax |
| File not found after discovery | Extractor reading | `Error: File 'code.home.md' not found at path [path]` | Check file still exists, permissions correct |
| File read permission error | Extractor reading | `Error: Permission denied reading file 'code.home.md'` | Fix file permissions |

---

## Example File

**File**: `src/domains/str/code/code.home.md`

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
const code = Str.Code.Md.inlineCode('foo')  // Returns: `foo`

// Use TypeScript utilities
const ast = Str.Code.TS.parse('type Foo = string')

// Use TSDoc utilities
const doc = Str.Code.TSDoc.parse('/** @param x - The value */')
\`\`\`

## Exports

## Advanced Usage

For complex transformations, you can combine utilities from different sub-namespaces.

The Code namespace integrates seamlessly with other Str utilities.
```

**Generated VitePress Frontmatter**:

```yaml
---
layout: home
sidebar: false

hero:
  name: Code Manipulation
  text: Utilities for working with source code strings.
  tagline: Generate, parse, and transform code in multiple formats

features:
  - title: Markdown Utilities
    details: |
      Generate markdown elements like inline code, code blocks, links, and tables.

      Perfect for documentation generation tools.
  - title: TypeScript Tools
    details: |
      Parse and manipulate TypeScript syntax:

      - Extract type information
      - Transform AST nodes
      - Generate type-safe code
  - title: TSDoc Parsing
    details: Extract and format TSDoc comments from source code.
---

## Getting Started

Import the Code namespace:

\`\`\`typescript
import { Str } from '@wollybeard/kit'

// Use Markdown utilities
const code = Str.Code.Md.inlineCode('foo')  // Returns: `foo`

// Use TypeScript utilities
const ast = Str.Code.TS.parse('type Foo = string')

// Use TSDoc utilities
const doc = Str.Code.TSDoc.parse('/** @param x - The value */')
\`\`\`

### Functions

[Auto-generated functions section here]

### Types

[Auto-generated types section here]

## Advanced Usage

For complex transformations, you can combine utilities from different sub-namespaces.

The Code namespace integrates seamlessly with other Str utilities.
```
