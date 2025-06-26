import { Url } from '#url'
import { title } from './case/case.ts'

/**
 * Convert a URL slug to title case.
 * Replaces URL path separators with spaces and converts to title case.
 * @param str - The slug string to convert
 * @returns The title-cased string
 * @example
 * ```typescript
 * titlizeSlug('foo/bar/baz') // 'Foo Bar Baz'
 * titlizeSlug('the/quick/brown/fox') // 'The Quick Brown Fox'
 * titlizeSlug('hello-world') // 'Hello-World' (hyphens are preserved)
 * ```
 */
export const titlizeSlug = (str: string) => {
  return title(str.replace(Url.pathSeparator, ' '))
}
