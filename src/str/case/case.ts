/**
 * Convert string to camelCase.
 * @example
 * ```typescript
 * camel('hello-world') // 'helloWorld'
 * camel('foo_bar') // 'fooBar'
 * ```
 */
export { camelCase as camel } from 'es-toolkit'

/**
 * Convert string to kebab-case.
 * @example
 * ```typescript
 * kebab('helloWorld') // 'hello-world'
 * kebab('FooBar') // 'foo-bar'
 * ```
 */
export { kebabCase as kebab } from 'es-toolkit'

/**
 * Convert string to PascalCase.
 * @example
 * ```typescript
 * pascal('hello-world') // 'HelloWorld'
 * pascal('foo_bar') // 'FooBar'
 * ```
 */
export { pascalCase as pascal } from 'es-toolkit'

/**
 * Convert string to snake_case.
 * @example
 * ```typescript
 * snake('helloWorld') // 'hello_world'
 * snake('FooBar') // 'foo_bar'
 * ```
 */
export { snakeCase as snake } from 'es-toolkit'

/**
 * Convert string to Title Case.
 * Replaces hyphens and underscores with spaces and capitalizes the first letter of each word.
 * @param str - The string to convert
 * @returns The title cased string
 * @example
 * ```typescript
 * title('hello-world') // 'Hello World'
 * title('foo_bar') // 'Foo Bar'
 * title('the quick brown fox') // 'The Quick Brown Fox'
 * ```
 */
export const title = (str: string) => {
  return str
    .replaceAll(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Convert string to UPPERCASE.
 * @param str - The string to convert
 * @returns The uppercase string
 * @example
 * ```typescript
 * upper('hello world') // 'HELLO WORLD'
 * upper('FooBar') // 'FOOBAR'
 * ```
 */
export const upper = (str: string): string => {
  return str.toUpperCase()
}
