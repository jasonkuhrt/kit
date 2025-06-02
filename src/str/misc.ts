import { title } from '#str/case/case.js'
import { Url } from '#url/index.js'

export const titlizeSlug = (str: string) => {
  return title(str.replace(Url.pathSeparator, ' '))
}
