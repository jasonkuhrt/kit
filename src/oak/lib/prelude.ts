export const isPromiseLikeValue = (value: unknown): value is Promise<unknown> => {
  return (
    typeof value === `object`
    && value !== null
    && `then` in value
    && typeof value.then === `function`
    && `catch` in value
    && typeof value.catch === `function`
    && `finally` in value
    && typeof value.finally === `function`
  )
}

export type Index<T> = Record<string, T>

export type RequireField<O extends object, F extends keyof O> =
  & O
  & {
    [key in F]: Exclude<O[F], undefined | null>
  }
