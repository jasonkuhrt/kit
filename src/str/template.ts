import type { Json } from '#json/index.js'
import { Obj } from '#obj/index.js'

export const interpolate = (template: string) => (args: TemplateArgs) => {
  const get = Obj.getOn(args)
  return template.replace(templateVariablePattern, (_, parameterName: string) => {
    return String(get(parameterName))
  })
}

export const templateVariablePattern = /\${([^}]+)}/g

export type TemplateArgs = Record<string, Json.Value>

export const isTemplateStringsArray = (args: unknown): args is TemplateStringsArray => {
  return Array.isArray(args) && args.length > 0 && args[0] instanceof Object && `raw` in args[0] as any
}
