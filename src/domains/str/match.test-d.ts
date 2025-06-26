import { Str } from '#str'
import { describe, expectTypeOf, test } from 'vitest'

// We are only interested in type-level testing here so
// the string and regex runtime value does not matter.
const re = /whatever/
const s = 'whatever'

describe('groups', () => {
  test('can infer from inline or pattern', () => {
    type matches = { groups: ['first'] }
    const match = Str.match<matches>(s, re)
    expectTypeOf(match).toExtend<null | [string]>()
    expectTypeOf(match!.groups).toEqualTypeOf<{ first: string }>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    expectTypeOf(match2).toEqualTypeOf(match)
  })
  test('optionals: can infer from inline or pattern', () => {
    type matches = { groups: ['first' | undefined] }
    const match = Str.match<matches>(s, re)
    expectTypeOf(match).toExtend<null | [string]>()
    expectTypeOf(match!.groups).toEqualTypeOf<{ first?: string }>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    expectTypeOf(match2).toEqualTypeOf(match)
  })
})

describe('indicies', () => {
  test('can infer from inline or pattern', () => {
    type matches = { indicies: [string] }
    const match = Str.match<matches>(s, re)
    expectTypeOf(match).toExtend<null | [string, ...matches['indicies']] & { groups: undefined }>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    expectTypeOf(match2).toEqualTypeOf(match)
  })

  test('optionals: can infer from inline or pattern', () => {
    type matches = { indicies: [string | undefined] }
    const match = Str.match<matches>(s, re)
    expectTypeOf(match).toExtend<null | [string, ...matches['indicies']] & { groups: undefined }>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    expectTypeOf(match2).toEqualTypeOf(match)
  })
})

test('pattern is interoperable with RegExp type', () => {
  s.match(Str.pattern(re))
  s.match(Str.pattern<{ groups: ['foobar'] }>(re))
})
