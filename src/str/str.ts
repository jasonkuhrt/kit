export const is = (value: unknown): value is string => typeof value === `string`

export const titleCase = (str: string) => str.replace(/\b\w/g, l => l.toUpperCase())

export const isTemplateStringsArray = (args: unknown): args is TemplateStringsArray => {
  return Array.isArray(args) && args.length > 0 && args[0] instanceof Object && `raw` in args[0] as any
}
