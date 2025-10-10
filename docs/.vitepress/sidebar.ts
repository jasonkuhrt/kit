import type { DefaultTheme } from 'vitepress'
import interfaceModel from '../.generated/interface-model.json'

/**
 * Generate VitePress sidebar items from the interface model.
 * Automatically includes nested namespaces as collapsible items.
 */
export function generateApiSidebar(): DefaultTheme.SidebarItem[] {
  const categories = new Map<string, DefaultTheme.SidebarItem[]>()

  // Process each entrypoint
  for (const entrypoint of interfaceModel.entrypoints) {
    // Extract the module name from path (e.g., "./arr" -> "arr")
    const moduleName = entrypoint.path.replace('./', '')

    // Create title case for display (e.g., "arr" -> "Arr")
    const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1)

    // Find namespace exports with nested modules
    const namespaceExports = entrypoint.module.exports
      .filter((exp: any) => exp.type === 'namespace' && exp.module)
      .map((exp: any) => ({
        text: exp.name,
        link: `/api/${moduleName}/${exp.name.toLowerCase()}`,
      }))
      .sort((a, b) => a.text.localeCompare(b.text))

    // Create sidebar item
    const item: DefaultTheme.SidebarItem = {
      text: displayName,
      link: `/api/${moduleName}`,
    }

    // Add nested namespace items if any exist
    if (namespaceExports.length > 0) {
      item.items = namespaceExports
    }

    // Use category from module JSDoc, default to 'Other' if not specified
    const category = entrypoint.module.category ?? 'Other'

    // Add to category group
    if (!categories.has(category)) {
      categories.set(category, [])
    }
    categories.get(category)!.push(item)
  }

  // Build final sidebar structure
  const sidebar: DefaultTheme.SidebarItem[] = []

  const categoryOrder = [
    'Core Data Structures',
    'Collections',
    'Error Handling & Values',
    'Serialization & Network',
    'File System',
    'Development',
    'CLI & System',
    'Other',
  ]

  for (const categoryName of categoryOrder) {
    const items = categories.get(categoryName)
    if (items && items.length > 0) {
      sidebar.push({
        text: categoryName,
        items: items.sort((a, b) => a.text.localeCompare(b.text)),
      })
    }
  }

  return sidebar
}
