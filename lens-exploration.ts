// @ts-nocheck
import { Optic } from '#optic'

{
  declare const d:
    | Record<number, number>
    | number[]

  // Return Option<number>
  Optic.get(d, 0)
  Optic.get(d, 99)
  Optic.get(d, '.0')

  // Return: never
  // static error param 2: invalid index type
  // Throw: InvalidPatternType
  Optic.get(d, '.foobar')
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Index Lens
//
//
//  `${Int}` | Int

{
  declare const d:
    | Record<number, number>
    | number[]

  // Return Option<number>
  Optic.get(d, 0)
  Optic.get(d, 99)
  Optic.get(d, '.0')

  // Return: never
  // static error param 2: invalid index type
  // Throw: InvalidPatternType
  Optic.get(d, '.foobar')
}
{
  declare const d: [number, number]

  // Return Option.Some<number>
  Optic.get(d, 0)
  Optic.get(d, '.0')
  Optic.get(d, 1)
  Optic.get(d, '.1')

  // Return: never
  // Static error param 2: invalid pattern type
  // Throw: InvalidPatternType
  Optic.get(d, '.foobar')

  // Return: Option.None
  // static error param 2: invalid index range
  Optic.get(d, 3)
}
