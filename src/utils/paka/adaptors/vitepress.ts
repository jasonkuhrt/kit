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
 * Generate VitePress documentation from interface model.
 *
 * @param model - The extracted interface model
 * @param config - VitePress generation configuration
 */
export const generate = (model: InterfaceModel, config: VitePressConfig): void => {
  const { outputDir } = config

  // Ensure output directory exists
  mkdirSync(join(outputDir, 'api'), { recursive: true })

  // Generate pages for all modules and namespaces
  const pages = generatePages(model)

  for (const page of pages) {
    const content = generatePageContent(page)
    const filepath = join(outputDir, page.filepath)

    // Ensure directory exists
    const dir = filepath.substring(0, filepath.lastIndexOf('/'))
    mkdirSync(dir, { recursive: true })

    writeFileSync(filepath, content, 'utf-8')
  }

  console.log(`Generated ${pages.length} documentation pages`)
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
const generatePageContent = (page: Page): string => {
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
    renderExportsSection(regularExports),
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
const renderExportsSection = (exports: Export[]): string => {
  // Group by type
  const functions = exports.filter((e: any) => e._tag === 'value' && e.type === 'function')
  const constants = exports.filter((e: any) => e._tag === 'value' && e.type === 'const')
  const classes = exports.filter((e: any) => e._tag === 'value' && e.type === 'class')
  const types = exports.filter((e: any) => e._tag === 'type')

  const sections = [
    functions.length > 0 ? `## Functions\n\n${functions.map(renderExport).join('\n\n')}` : '',
    constants.length > 0 ? `## Constants\n\n${constants.map(renderExport).join('\n\n')}` : '',
    classes.length > 0 ? `## Classes\n\n${classes.map(renderExport).join('\n\n')}` : '',
    types.length > 0 ? `## Types\n\n${types.map(renderExport).join('\n\n')}` : '',
  ].filter(Boolean)

  return sections.join('\n\n')
}

/**
 * Render a single export.
 */
const renderExport = (exp: Export): string => {
  const deprecated = exp.deprecated ? `:::warning DEPRECATED\n${exp.deprecated}\n:::\n\n` : ''

  const examples = exp.examples.length > 0 ? `\n\n**Examples:**\n\n${exp.examples.map(renderExample).join('\n\n')}` : ''

  return `### ${exp.name}

${deprecated}${exp.description || ''}

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
