/**
 * Represents a parsed npm package moniker (name).
 * Separates the scope (if present) from the package name.
 */
export interface Moniker {
  /**
   * The package name without scope.
   */
  name: string
  /**
   * The scope without @ prefix, or null if unscoped.
   */
  scope: string | null
}

/**
 * Parses an npm package moniker into its components.
 * Handles both scoped (@scope/name) and unscoped (name) packages.
 *
 * @param name - The package moniker to parse.
 * @returns The parsed moniker with separated scope and name.
 * @throws {Error} If the moniker is invalid (empty or too many slashes).
 *
 * @example
 * // parsing a scoped package
 * const moniker = parseMoniker('@myorg/mypackage')
 * // moniker is { name: 'mypackage', scope: '@myorg' }
 *
 * @example
 * // parsing an unscoped package
 * const moniker = parseMoniker('mypackage')
 * // moniker is { name: 'mypackage', scope: null }
 *
 * @example
 * // invalid moniker throws
 * parseMoniker('@myorg/sub/package') // throws Error
 */
export const parseMoniker = (name: string): Moniker => {
  const parts = name.split(`/`)

  if (parts.length === 0) {
    throw new Error(`Invalid moniker: ${name}`)
  }

  if (parts.length === 1) {
    return { name: parts[0]!, scope: null }
  }

  if (parts.length === 2) {
    return { name: parts[1]!, scope: parts[0]! }
  }

  throw new Error(`Invalid moniker: ${name}`)
}
