import { Language } from '#language/index.js'

export const dump = (value: any) => {
  console.log(Language.inspect(value, { depth: 20, colors: true }))
}
