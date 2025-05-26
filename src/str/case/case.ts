export { camelCase as camel, kebabCase as kebab, pascalCase as pascal, snakeCase as snake } from 'es-toolkit'

export const title = (str: string) => {
  return str
    .replaceAll(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}
