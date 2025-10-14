import { FsLoc } from '#fs-loc'
import { Md } from '#md'
import { Match } from 'effect'
import { writeFileSync } from 'node:fs'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Entrypoint, Example, Export, InterfaceModel, Module, SignatureModel, ValueExport } from '../schema.js'

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
  /** Group exports by @category tag (auto-detects if undefined) */
  groupByCategory?: boolean
}

/**
 * Derive PascalCase module name from entrypoint path.
 * Examples: './err' → 'Err', './package-manager' → 'PackageManager'
 */
const deriveModuleName = (path: string): string => {
  // Extract stem (remove leading ./)
  const withoutLeadingDot = path.replace(/^\.\//, '')

  // Convert kebab-case to PascalCase
  return withoutLeadingDot
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Page metadata for a generated page.
 */
type Page = {
  url: string
  filepath: string
  title: string
  entrypoint: Entrypoint
  module: Module
  breadcrumbs: string[]
}

/**
 * Generation context passed through rendering functions.
 */
type Context = {
  packageName: string
  githubUrl?: string
  breadcrumbs?: string[]
  groupByCategory?: boolean
}

/**
 * Generate VitePress documentation from interface model.
 *
 * @param model - The extracted interface model
 * @param config - VitePress generation configuration
 */
export const generate = (model: InterfaceModel, config: VitePressConfig): void => {
  const { outputDir, githubUrl, groupByCategory } = config
  const context: Context = {
    packageName: model.name,
    ...(githubUrl ? { githubUrl } : {}),
    ...(groupByCategory !== undefined ? { groupByCategory } : {}),
  }

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
  const modules = model.entrypoints.map((entrypoint) => {
    const moduleName = deriveModuleName(entrypoint.path)
    const url = `/api/${Md.kebab(moduleName)}`
    const description = entrypoint.module.description || ''

    return `## ${Md.link(moduleName, url)}

${description}`
  })

  return Md.sections(
    Md.heading(1, 'API Reference'),
    'Browse the complete API documentation for @wollybeard/kit.',
    modules.join('\n\n'),
  )
}

/**
 * Generate all pages from the model.
 */
const generatePages = (model: InterfaceModel): Page[] => {
  const pages: Page[] = []

  for (const entrypoint of model.entrypoints) {
    const moduleName = deriveModuleName(entrypoint.path)
    const module = entrypoint.module

    // Top-level module page
    pages.push({
      url: `/api/${Md.kebab(moduleName)}`,
      filepath: `api/${Md.kebab(moduleName)}.md`,
      title: moduleName,
      entrypoint,
      module,
      breadcrumbs: [moduleName],
    })

    // Namespace pages (recursive)
    pages.push(...generateNamespacePages(entrypoint, module, [moduleName]))
  }

  return pages
}

/**
 * Recursively generate pages for namespace exports.
 */
const generateNamespacePages = (entrypoint: Entrypoint, module: Module, breadcrumbs: string[]): Page[] => {
  const pages: Page[] = []

  const namespaceExports = module.exports.filter(
    (exp: any): exp is any => exp._tag === 'value' && exp.type === 'namespace' && exp.module !== undefined,
  )

  for (const nsExport of namespaceExports) {
    const newBreadcrumbs = [...breadcrumbs, nsExport.name]
    const urlPath = newBreadcrumbs.map(Md.kebab).join('/')

    if (!nsExport.module) continue

    pages.push({
      url: `/api/${urlPath}`,
      filepath: `api/${urlPath}.md`,
      title: newBreadcrumbs.join('.'),
      entrypoint,
      module: nsExport.module,
      breadcrumbs: newBreadcrumbs,
    })

    // Recursively process nested namespaces
    pages.push(...generateNamespacePages(entrypoint, nsExport.module, newBreadcrumbs))
  }

  return pages
}

/**
 * Generate markdown content for a page.
 */
const generatePageContent = (page: Page, context: Context): string => {
  const { entrypoint, module, breadcrumbs } = page

  // Breadcrumb navigation
  const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
  const breadcrumbNav = breadcrumbs.length > 1 && lastBreadcrumb
    ? `*${breadcrumbs.slice(0, -1).join('.')}* / **${lastBreadcrumb}**`
    : ''

  // Separate namespace exports from regular exports
  const namespaceExports = module.exports.filter(
    (exp: any) => exp._tag === 'value' && exp.type === 'namespace',
  )
  const regularExports = module.exports.filter(
    (exp: any) => !(exp._tag === 'value' && exp.type === 'namespace'),
  )

  // Add breadcrumbs to context for namespace usage in examples
  const contextWithBreadcrumbs = { ...context, breadcrumbs }

  return Md.sections(
    Md.heading(1, breadcrumbs.join('.')),
    breadcrumbNav,
    module.description || '',
    renderImportSection(entrypoint, context.packageName, breadcrumbs),
    namespaceExports.length > 0 ? renderNamespacesSection(namespaceExports, breadcrumbs) : '',
    renderExportsSection(regularExports, contextWithBreadcrumbs),
  )
}

/**
 * Render import examples based on entrypoint pattern.
 */
const renderImportSection = (
  entrypoint: Entrypoint,
  packageName: string,
  breadcrumbs: string[],
): string => {
  const moduleName = breadcrumbs[0]
  if (!moduleName) return ''

  const subpath = `${packageName}/${Md.kebab(moduleName)}`

  // For nested namespaces, show access pattern
  if (breadcrumbs.length > 1) {
    const accessExample = `// Access via namespace\n${breadcrumbs.join('.')}.someFunction()`

    if (entrypoint._tag === 'DrillableNamespaceEntrypoint') {
      return Md.sections(
        Md.heading(2, 'Import'),
        Md.codeGroup([
          {
            label: 'Namespace',
            code: `import { ${moduleName} } from '${packageName}'\n\n${accessExample}`,
          },
          {
            label: 'Barrel',
            code: `import * as ${moduleName} from '${subpath}'\n\n${accessExample}`,
          },
        ]),
      )
    } else {
      return Md.sections(
        Md.heading(2, 'Import'),
        Md.codeFence(`import { ${moduleName} } from '${subpath}'\n\n${accessExample}`),
      )
    }
  }

  // Top-level module
  if (entrypoint._tag === 'DrillableNamespaceEntrypoint') {
    return Md.sections(
      Md.heading(2, 'Import'),
      Md.codeGroup([
        { label: 'Namespace', code: `import { ${moduleName} } from '${packageName}'` },
        { label: 'Barrel', code: `import * as ${moduleName} from '${subpath}'` },
      ]),
    )
  } else {
    return Md.sections(Md.heading(2, 'Import'), Md.codeFence(`import { ${moduleName} } from '${subpath}'`))
  }
}

/**
 * Render namespaces section with links.
 */
const renderNamespacesSection = (namespaces: Export[], breadcrumbs: string[]): string => {
  const items = namespaces.map((ns) => {
    const nsPath = `/api/${[...breadcrumbs, ns.name].map(Md.kebab).join('/')}`
    const link = Md.boldCodeLink(ns.name, nsPath)
    return Md.listItem(`${link}${ns.description ? ` - ${ns.description}` : ''}`)
  })

  return Md.sections(Md.heading(2, 'Namespaces'), items.join('\n'))
}

/**
 * Render all exports grouped by type or category.
 */
const renderExportsSection = (exports: Export[], context: Context): string => {
  // Auto-detect category mode if not explicitly configured
  const shouldGroupByCategory = context.groupByCategory ?? exports.some((e) => e.category != null)

  if (shouldGroupByCategory) {
    // Group by category with seamless interleaving
    const categorized = new Map<string, Export[]>()

    for (const exp of exports) {
      const category = exp.category ?? 'Other'
      const existing = categorized.get(category) ?? []
      categorized.set(category, [...existing, exp])
    }

    // Sort categories alphabetically, with "Other" last
    const sortedCategories = Array.from(categorized.keys()).sort((a, b) => {
      if (a === 'Other') return 1
      if (b === 'Other') return -1
      return a.localeCompare(b)
    })

    // Render each category with seamlessly interleaved exports
    const categorySection = sortedCategories.map((category) => {
      const categoryExports = categorized.get(category) ?? []
      return Md.sections(
        Md.heading(2, category),
        categoryExports.map((e) => renderExport(e, context)).join('\n\n'),
      )
    })

    return Md.sections(...categorySection)
  }

  // Traditional type-based grouping
  const functions = exports.filter((e: any) => e._tag === 'value' && e.type === 'function')
  const constants = exports.filter((e: any) => e._tag === 'value' && e.type === 'const')
  const classes = exports.filter((e: any) => e._tag === 'value' && e.type === 'class')
  const types = exports.filter((e: any) => e._tag === 'type')

  return Md.sections(
    functions.length > 0
      ? Md.sections(Md.heading(2, 'Functions'), functions.map((e) => renderExport(e, context)).join('\n\n'))
      : '',
    constants.length > 0
      ? Md.sections(Md.heading(2, 'Constants'), constants.map((e) => renderExport(e, context)).join('\n\n'))
      : '',
    classes.length > 0
      ? Md.sections(Md.heading(2, 'Classes'), classes.map((e) => renderExport(e, context)).join('\n\n'))
      : '',
    types.length > 0
      ? Md.sections(Md.heading(2, 'Types'), types.map((e) => renderExport(e, context)).join('\n\n'))
      : '',
  )
}

/**
 * Get type icon/badge for an export.
 */
const getTypeIcon = (exp: Export): string => {
  return Match.value(exp).pipe(
    Match.tags({
      value: (valueExp) =>
        Match.value(valueExp.type).pipe(
          Match.when('function', () => 'F'),
          Match.when('const', () => 'C'),
          Match.when('class', () => 'Class'),
          Match.when('namespace', () => 'NS'),
          Match.exhaustive,
        ),
      type: (typeExp) =>
        Match.value(typeExp.type).pipe(
          Match.when('interface', () => 'I'),
          Match.when('type-alias', () => 'T'),
          Match.when('enum', () => 'E'),
          Match.when('union', () => 'U'),
          Match.when('intersection', () => '∩'),
          Match.exhaustive,
        ),
    }),
    Match.exhaustive,
  )
}

/**
 * Render a single export.
 */
const renderExport = (exp: Export, context: Context): string => {
  // Deprecation warning with proper link conversion
  const deprecated = exp.deprecated ? Md.deprecation(exp.deprecated) : ''

  // Transform description: normalize whitespace, demote headings, convert links, escape HTML
  // CRITICAL: Must convert double-space separators to newlines BEFORE demoting headings,
  // since demoteHeadings requires actual line breaks to match ^## patterns
  const description = exp.description
    ? Md.demoteHeadings(
      Md.convertJSDocLinks(
        exp.description
          .replace(/  /g, '\n\n') // Convert double-space paragraph separators to newlines FIRST
          .replace(/ - /g, '\n- '), // Convert list item separators to proper markdown list items
      ),
      2, // Demote headings AFTER newlines are added (exports are h3, so description content becomes h4+)
    )
      // Wrap list items that start with code-like patterns in backticks
      .replace(/^- (\[\[.*?\]\]|\{[^}]+\})/gm, '- `$1`')
      // HTML-escape angle brackets to prevent Vue parser errors
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : ''

  const examples = exp.examples.length > 0
    ? `**Examples:**\n\n${exp.examples.map((ex) => renderExample(ex, exp.name, context)).join('\n\n')}`
    : ''

  // Build heading with type icon (using backticks for monospace)
  const typeIcon = getTypeIcon(exp)
  const heading = Md.heading(
    3,
    `<span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">\`[${typeIcon}]\`</span> ${
      Md.inlineCode(exp.name)
    }`,
  )

  // Source link as info line (after signature) using custom Vue component
  const sourceLink = context.githubUrl && exp.sourceLocation
    ? `<SourceLink href="${context.githubUrl}/blob/main/${exp.sourceLocation.file}#L${exp.sourceLocation.line}" />`
    : ''

  const signatureText = renderSignature(exp.signature)
  const signatureDetails = renderSignatureDetails(exp.signature)

  return Md.sections(
    heading,
    Md.codeFence(signatureText),
    sourceLink,
    signatureDetails,
    deprecated,
    description,
    examples,
  )
}

/**
 * Render signature details (parameter descriptions, return documentation, throws).
 */
const renderSignatureDetails = (sig: SignatureModel): string => {
  return Match.value(sig).pipe(
    Match.tags({
      FunctionSignatureModel: (fnSig) => {
        // Collect documentation from all overloads
        const allParams = new Map<string, string>()
        let returnDoc: string | undefined
        const allThrows: string[] = []

        for (const overload of fnSig.overloads) {
          // Collect parameter descriptions
          for (const param of overload.parameters) {
            if (param.description && !allParams.has(param.name)) {
              allParams.set(param.name, param.description)
            }
          }

          // Use first non-empty return doc
          if (overload.returnDoc && !returnDoc) {
            returnDoc = overload.returnDoc
          }

          // Collect all throws
          for (const throwsDesc of overload.throws) {
            if (!allThrows.includes(throwsDesc)) {
              allThrows.push(throwsDesc)
            }
          }
        }

        // Build sections
        const sections: string[] = []

        if (allParams.size > 0) {
          const paramsList = Array.from(allParams.entries())
            .map(([name, desc]) => `- \`${name}\` - ${desc}`)
            .join('\n')
          sections.push(`**Parameters:**\n\n${paramsList}`)
        }

        if (returnDoc) {
          sections.push(`**Returns:** ${returnDoc}`)
        }

        if (allThrows.length > 0) {
          const throwsList = allThrows.map((desc) => `- ${desc}`).join('\n')
          sections.push(`**Throws:**\n\n${throwsList}`)
        }

        return sections.length > 0 ? sections.join('\n\n') : ''
      },
      BuilderSignatureModel: (builderSig) => {
        // Render docs for entry point
        const entryPoint = builderSig.entryPoint
        const sections: string[] = []

        // Entry point parameters
        if (entryPoint.parameters.some((p) => p.description)) {
          const paramsList = entryPoint.parameters
            .filter((p) => p.description)
            .map((p) => `- \`${p.name}\` - ${p.description}`)
            .join('\n')
          sections.push(`**Parameters:**\n\n${paramsList}`)
        }

        // Entry point return doc
        if (entryPoint.returnDoc) {
          sections.push(`**Returns:** ${entryPoint.returnDoc}`)
        }

        // Entry point throws
        if (entryPoint.throws.length > 0) {
          const throwsList = entryPoint.throws.map((desc) => `- ${desc}`).join('\n')
          sections.push(`**Throws:**\n\n${throwsList}`)
        }

        return sections.length > 0 ? sections.join('\n\n') : ''
      },
      ClassSignatureModel: (classSig) => {
        const sections: string[] = []

        // Constructor documentation
        if (classSig.ctor) {
          // Constructor parameters
          if (classSig.ctor.parameters.some((p) => p.description)) {
            const paramsList = classSig.ctor.parameters
              .filter((p) => p.description)
              .map((p) => `- \`${p.name}\` - ${p.description}`)
              .join('\n')
            sections.push(`**Constructor Parameters:**\n\n${paramsList}`)
          }

          // Constructor throws
          if (classSig.ctor.throws.length > 0) {
            const throwsList = classSig.ctor.throws.map((desc) => `- ${desc}`).join('\n')
            sections.push(`**Constructor Throws:**\n\n${throwsList}`)
          }
        }

        // Property descriptions
        const propsWithDesc = classSig.properties.filter((p) => p.description)
        if (propsWithDesc.length > 0) {
          const propsList = propsWithDesc
            .map((p) => `- \`${p.name}\` - ${p.description}`)
            .join('\n')
          sections.push(`**Properties:**\n\n${propsList}`)
        }

        return sections.length > 0 ? sections.join('\n\n') : ''
      },
      TypeSignatureModel: () => '',
      ValueSignatureModel: () => '',
    }),
    Match.exhaustive,
  )
}

/**
 * Render type parameters to string (e.g., "<T, U extends string>").
 */
const renderTypeParameters = (typeParams: readonly typeof import('../schema.js').TypeParameter.Type[]): string => {
  if (typeParams.length === 0) return ''

  const rendered = typeParams.map((tp) => {
    let text = tp.name
    if (tp.constraint) text += ` extends ${tp.constraint}`
    if (tp.default) text += ` = ${tp.default}`
    return text
  }).join(', ')

  return `<${rendered}>`
}

/**
 * Render function parameters to string (e.g., "a: number, b?: string").
 */
const renderParameters = (params: readonly typeof import('../schema.js').Parameter.Type[]): string => {
  return params.map((param) => {
    let text = ''
    if (param.rest) text += '...'
    text += param.name
    if (param.optional) text += '?'
    text += `: ${param.type}`
    if (param.defaultValue) text += ` = ${param.defaultValue}`
    return text
  }).join(', ')
}

/**
 * Render SignatureModel to string for display in code fence.
 */
const renderSignature = (sig: SignatureModel): string => {
  return Match.value(sig).pipe(
    Match.tags({
      FunctionSignatureModel: (fnSig) => {
        // Render all overloads
        return fnSig.overloads.map((overload) => {
          const typeParams = renderTypeParameters(overload.typeParameters)
          const params = renderParameters(overload.parameters)
          return `${typeParams}(${params}): ${overload.returnType}`
        }).join('\n')
      },
      BuilderSignatureModel: (builderSig) => {
        // Render builder entry point
        const entryPoint = builderSig.entryPoint
        const typeParams = renderTypeParameters(entryPoint.typeParameters)
        const params = renderParameters(entryPoint.parameters)
        let result = `${typeParams}(${params}): ${builderSig.typeName}\n`

        // Render chainable methods
        if (builderSig.chainableMethods.length > 0) {
          result += '\n// Chainable methods:\n'
          for (const method of builderSig.chainableMethods) {
            // Render all overloads for this method
            for (const overload of method.overloads) {
              const methodTypeParams = renderTypeParameters(overload.typeParameters)
              const methodParams = renderParameters(overload.parameters)
              result += `  .${method.name}${methodTypeParams}(${methodParams}): ${builderSig.typeName}\n`
            }
          }
        }

        // Render terminal methods
        if (builderSig.terminalMethods.length > 0) {
          result += '\n// Terminal methods:\n'
          for (const method of builderSig.terminalMethods) {
            // Render all overloads for this method
            for (const overload of method.overloads) {
              const methodTypeParams = renderTypeParameters(overload.typeParameters)
              const methodParams = renderParameters(overload.parameters)
              result += `  .${method.name}${methodTypeParams}(${methodParams}): ${overload.returnType}\n`
            }
          }
        }

        // Render transform methods
        if (builderSig.transformMethods.length > 0) {
          result += '\n// Transform methods:\n'
          for (const method of builderSig.transformMethods) {
            // Render all overloads for this method
            for (const overload of method.overloads) {
              const methodTypeParams = renderTypeParameters(overload.typeParameters)
              const methodParams = renderParameters(overload.parameters)
              const returnType = method.transformsTo || overload.returnType
              result += `  .${method.name}${methodTypeParams}(${methodParams}): ${returnType}\n`
            }
          }
        }

        return result
      },
      ClassSignatureModel: (classSig) => {
        let result = 'class {\n'

        // Render constructor
        if (classSig.ctor) {
          const typeParams = renderTypeParameters(classSig.ctor.typeParameters)
          const params = renderParameters(classSig.ctor.parameters)
          result += `  constructor${typeParams}(${params})\n`
        }

        // Render properties
        if (classSig.properties.length > 0) {
          result += '\n  // Properties\n'
          for (const prop of classSig.properties) {
            let propLine = '  '
            if (prop.static) propLine += 'static '
            if (prop.readonly) propLine += 'readonly '
            propLine += prop.name
            if (prop.optional) propLine += '?'
            propLine += `: ${prop.type}\n`
            result += propLine
          }
        }

        // Render methods
        if (classSig.methods.length > 0) {
          result += '\n  // Methods\n'
          for (const method of classSig.methods) {
            for (const overload of method.overloads) {
              let methodLine = '  '
              if (method.static) methodLine += 'static '
              const typeParams = renderTypeParameters(overload.typeParameters)
              const params = renderParameters(overload.parameters)
              methodLine += `${method.name}${typeParams}(${params}): ${overload.returnType}\n`
              result += methodLine
            }
          }
        }

        result += '}'
        return result
      },
      TypeSignatureModel: (typeSig) => typeSig.text,
      ValueSignatureModel: (valSig) => valSig.type,
    }),
    Match.exhaustive,
  )
}

/**
 * Render a code example with Twoslash.
 */
const renderExample = (example: any, exportName: string, context: Context): string => {
  // Don't wrap title in bold - it may already contain markdown formatting (e.g., headings)
  const title = example.title || ''

  let code = example.code

  // Transform code to use namespace notation
  if (context.breadcrumbs && context.breadcrumbs.length > 0) {
    const namespace = context.breadcrumbs.join('.')
    const namespaceCall = `${namespace}.${exportName}`
    const topLevelModule = context.breadcrumbs[0]

    // Replace standalone function calls with namespace calls
    const regex = new RegExp(`(?<!\\.)\\b${exportName}(?=\\(|\\.)`, 'g')
    code = code.replace(regex, namespaceCall)

    // Add Twoslash setup (import + @noErrors directive)
    const hasImports = code.includes('import ')
    if (topLevelModule) {
      if (!hasImports) {
        const importStatement = `import { ${topLevelModule} } from '${context.packageName}/${Md.kebab(topLevelModule)}'`
        code = `// @noErrors\n${importStatement}\n// ---cut---\n${code}`
      } else {
        code = `// @noErrors\n${code}`
      }
    }
  }

  return Md.sections(title, Md.codeFence(code, example.language, 'twoslash'))
}
