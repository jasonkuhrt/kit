// TypeScript

export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown
