import { writeFileSync } from 'node:fs'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Example, Export, InterfaceModel, Module, ValueExport } from '../schema.js'

/**
 * Configuration for VitePress generation.
 */
export type VitePressConfig = {
  /** Output directory for generated markdown files */
  outputDir: string
  /** Base URL for the docs site */
  baseUrl?: string
  /** GitHub repository URL for source links (e.g., 'https://github.com/owner/repo') */
  githubUrl?: string
}

/**
 * Page metadata for a generated page.
 */
type Page = {
  url: string
  filepath: string
  title: string
  module: Module
  breadcrumbs: string[]
}

/**
 * Generation context passed through rendering functions.
 */
type Context = {
  githubUrl?: string
}

/**
 * Generate VitePress documentation from interface model.
 *
 * @param model - The extracted interface model
 * @param config - VitePress generation configuration
 */
export const generate = (model: InterfaceModel, config: VitePressConfig): void => {
  const { outputDir, githubUrl } = config
  const context: Context = githubUrl ? { githubUrl } : {}

  // Ensure output directory exists
  mkdirSync(join(outputDir, 'api'), { recursive: true })

  // Generate API index page
  const indexContent = generateApiIndex(model)
  writeFileSync(join(outputDir, 'api/index.md'), indexContent, 'utf-8')

  // Generate pages for all modules and namespaces
  const pages = generatePages(model)

  for (const page of pages) {
    const content = generatePageContent(page, context)
    const filepath = join(outputDir, page.filepath)

    // Ensure directory exists
    const dir = filepath.substring(0, filepath.lastIndexOf('/'))
    mkdirSync(dir, { recursive: true })

    writeFileSync(filepath, content, 'utf-8')
  }

  console.log(`Generated ${pages.length} documentation pages`)
}

/**
 * Generate API index page listing all modules.
 */
const generateApiIndex = (model: InterfaceModel): string => {
  const modules = model.entrypoints.map((ep) => {
    const module = ep.module as Module
    const moduleName = module.name
    const url = `/api/${kebab(moduleName)}`
    const description = module.description || ''

    return `- [**${moduleName}**](${url})${description ? ` - ${description}` : ''}`
  })

  return `# API Reference

Browse the complete API documentation for @wollybeard/kit.

## Modules

${modules.join('\n')}
`
}

/**
 * Generate all pages from the model.
 */
const generatePages = (model: InterfaceModel): Page[] => {
  const pages: Page[] = []

  for (const entrypoint of model.entrypoints) {
    const module = entrypoint.module as Module
    const moduleName = module.name

    // Top-level module page
    pages.push({
      url: `/api/${kebab(moduleName)}`,
      filepath: `api/${kebab(moduleName)}.md`,
      title: moduleName,
      module,
      breadcrumbs: [moduleName],
    })

    // Namespace pages (recursive)
    pages.push(...generateNamespacePages(module, [moduleName]))
  }

  return pages
}

/**
 * Recursively generate pages for namespace exports.
 */
const generateNamespacePages = (module: Module, breadcrumbs: string[]): Page[] => {
  const pages: Page[] = []

  const namespaceExports = module.exports.filter(
    (exp: any): exp is any => exp._tag === 'value' && exp.type === 'namespace' && exp.module !== undefined,
  )

  for (const nsExport of namespaceExports) {
    const newBreadcrumbs = [...breadcrumbs, nsExport.name]
    const urlPath = newBreadcrumbs.map(kebab).join('/')

    if (!nsExport.module) continue

    pages.push({
      url: `/api/${urlPath}`,
      filepath: `api/${urlPath}.md`,
      title: newBreadcrumbs.join('.'),
      module: nsExport.module,
      breadcrumbs: newBreadcrumbs,
    })

    // Recursively process nested namespaces
    pages.push(...generateNamespacePages(nsExport.module, newBreadcrumbs))
  }

  return pages
}

/**
 * Generate markdown content for a page.
 */
const generatePageContent = (page: Page, context: Context): string => {
  const { module, breadcrumbs } = page

  // Breadcrumb navigation
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
  const breadcrumbNav = breadcrumbs.length > 1 && lastBreadcrumb
    ? `*${breadcrumbs.slice(0, -1).join('.')}* / **${lastBreadcrumb}**\n\n`
    : ''

  // Separate namespace exports from regular exports
  const namespaceExports = module.exports.filter(
    (exp: any) => exp._tag === 'value' && exp.type === 'namespace',
  )
  const regularExports = module.exports.filter(
    (exp: any) => !(exp._tag === 'value' && exp.type === 'namespace'),
  )

  const sections = [
    `# ${breadcrumbs.join('.')}`,
    breadcrumbNav + (module.description || ''),
    renderImportSection(breadcrumbs),
    namespaceExports.length > 0 ? renderNamespacesSection(namespaceExports, breadcrumbs) : '',
    renderExportsSection(regularExports, context),
  ].filter(Boolean)

  return sections.join('\n\n')
}

/**
 * Render import examples.
 */
const renderImportSection = (breadcrumbs: string[]): string => {
  const first = breadcrumbs[0]
  if (!first) return ''

  if (breadcrumbs.length === 1) {
    return `## Import

\`\`\`typescript
import { ${first} } from '@wollybeard/kit/${kebab(first)}'
\`\`\``
  }

  return `## Import

\`\`\`typescript
import { ${first} } from '@wollybeard/kit/${kebab(first)}'

// Access via namespace
${breadcrumbs.join('.')}.someFunction()
\`\`\``
}

/**
 * Render namespaces section with links.
 */
const renderNamespacesSection = (namespaces: Export[], breadcrumbs: string[]): string => {
  const items = namespaces.map((ns) => {
    const nsPath = `/api/${[...breadcrumbs, ns.name].map(kebab).join('/')}`
    return `- [**${ns.name}**](${nsPath})${ns.description ? ` - ${ns.description}` : ''}`
  })

  return `## Namespaces\n\n${items.join('\n')}`
}

/**
 * Render all exports grouped by type.
 */
const renderExportsSection = (exports: Export[], context: Context): string => {
  // Group by type
  const functions = exports.filter((e: any) => e._tag === 'value' && e.type === 'function')
  const constants = exports.filter((e: any) => e._tag === 'value' && e.type === 'const')
  const classes = exports.filter((e: any) => e._tag === 'value' && e.type === 'class')
  const types = exports.filter((e: any) => e._tag === 'type')

  const sections = [
    functions.length > 0 ? `## Functions\n\n${functions.map((e) => renderExport(e, context)).join('\n\n')}` : '',
    constants.length > 0 ? `## Constants\n\n${constants.map((e) => renderExport(e, context)).join('\n\n')}` : '',
    classes.length > 0 ? `## Classes\n\n${classes.map((e) => renderExport(e, context)).join('\n\n')}` : '',
    types.length > 0 ? `## Types\n\n${types.map((e) => renderExport(e, context)).join('\n\n')}` : '',
  ].filter(Boolean)

  return sections.join('\n\n')
}

/**
 * Demote markdown headings by adding a specified number of levels.
 *
 * This is used to ensure JSDoc descriptions don't break the document hierarchy.
 * For example, if an export is h3, its description headings should be h4+.
 *
 * @param markdown - The markdown content to transform
 * @param levels - Number of heading levels to add (e.g., 2 transforms ## to ####)
 * @returns Transformed markdown with demoted headings
 */
const demoteHeadings = (markdown: string, levels: number): string => {
  if (!markdown || levels === 0) return markdown

  // Add 'levels' number of # to each heading
  const prefix = '#'.repeat(levels)

  // Replace headings while preserving content and whitespace
  // Matches: start of line, one or more #, space, content
  return markdown.replace(/^(#+)(\s)/gm, `$1${prefix}$2`)
}

/**
 * Render a single export.
 */
const renderExport = (exp: Export, context: Context): string => {
  const deprecated = exp.deprecated ? `:::warning DEPRECATED\n${exp.deprecated}\n:::\n\n` : ''

  // Demote headings in description by 2 levels (exports are h3, so description content becomes h4+)
  const description = exp.description ? demoteHeadings(exp.description, 2) : ''

  const examples = exp.examples.length > 0 ? `\n\n**Examples:**\n\n${exp.examples.map(renderExample).join('\n\n')}` : ''

  // GitHub source link - inline icon on the right side
  const sourceLink = context.githubUrl && exp.sourceLocation
    ? ` <sub style="float: right;">[📄](${context.githubUrl}/blob/main/${exp.sourceLocation.file}#L${exp.sourceLocation.line})</sub>`
    : ''

  return `### ${exp.name}${sourceLink}

${deprecated}${description}

\`\`\`typescript
${exp.signature}
\`\`\`${examples}`
}

/**
 * Render a code example.
 */
const renderExample = (example: any): string => {
  const title = example.title ? `**${example.title}**\n\n` : ''
  const fence = example.twoslashEnabled ? `${example.language} twoslash` : example.language

  return `${title}\`\`\`${fence}\n${example.code}\n\`\`\``
}

/**
 * Convert string to kebab-case.
 */
const kebab = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}
