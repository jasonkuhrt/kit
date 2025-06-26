import { ArrMut } from '#arr-mut'
import { Lang } from '#lang'

export const enVarName = `DEBUG`

export const deliminator = `,`
export const wildcard = `*`
export const enVarEnabledValuesStatic = [`true`, wildcard, `1`]
export const sep = ':'

export const calcIsEnabledFromEnv = (
  enVars: Record<string, unknown>,
  namespace?: string[],
): boolean => {
  const namespace_ = namespace?.map(_ => _.toLowerCase())

  const includeFilters = typeof enVars[enVarName] === `string`
    ? enVars[enVarName]
      .trim()
      .toLowerCase()
      .split(deliminator)
      .map(patternExpression => {
        return patternExpression
          .trim()
          .split(sep)
          .map(_ => _.trim())
      })
    : undefined

  if (!includeFilters) return false

  if (includeFilters.length === 0) return false

  // If any is like * then it means "enable everything"
  if (
    includeFilters.some(includeFilter => {
      return includeFilter.length === 1 && enVarEnabledValuesStatic.includes(includeFilter[0]!)
    })
  ) return true

  // At this point, if there is no namespace (e.g. root), then we cannot match anything
  if (!namespace_) return false

  for (const includeFilter of includeFilters) {
    if (ArrMut.getLast(includeFilter) !== wildcard) {
      return includeFilter.join(sep) === namespace_.join(sep)
    }

    let i = 0
    for (const segment of includeFilter) {
      if (segment === wildcard) return true
      if (segment !== namespace_[i]) return false
      i++
    }
  }

  Lang.never()
}
