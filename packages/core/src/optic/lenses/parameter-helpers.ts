/**
 * Replace element at index in tuple.
 * @internal
 */
export type ReplaceAt<$Tuple extends readonly any[], $Index extends number, $New> = {
  [i in keyof $Tuple]: i extends `${$Index}` ? $New : $Tuple[i]
}
