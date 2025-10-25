import { Str } from '#str'
import { Ts } from '#ts'
import { Option } from 'effect'
import { describe, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

// We are only interested in type-level testing here so
// the string and regex runtime value does not matter.
const re = /whatever/
const s = 'whatever'

describe('groups', () => {
  test('can infer from inline or pattern', () => {
    type matches = { groups: ['first'] }
    const match = Str.match<matches>(s, re)
    Ts.Assert.sub.ofAs<Option.Option<any>>().on(match)
    // Type-level test for the groups property
    type MatchType = typeof match extends Option.Option<infer R> ? R : never
    A<{ first: string }>().onAs<MatchType['groups']>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    Ts.Assert.exact.ofAs<typeof match>().on(match2)
  })
  test('optionals: can infer from inline or pattern', () => {
    type matches = { groups: ['first' | undefined] }
    const match = Str.match<matches>(s, re)
    Ts.Assert.sub.ofAs<Option.Option<any>>().on(match)
    // Type-level test for the groups property
    type MatchType = typeof match extends Option.Option<infer R> ? R : never
    A<{ first?: string }>().onAs<MatchType['groups']>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    Ts.Assert.exact.ofAs<typeof match>().on(match2)
  })
})

describe('indicies', () => {
  test('can infer from inline or pattern', () => {
    type matches = { indicies: [string] }
    const match = Str.match<matches>(s, re)
    Ts.Assert.sub.ofAs<Option.Option<any>>().on(match)
    // Type-level test for the indicies
    type MatchType = typeof match extends Option.Option<infer R> ? R : never
    Ts.Assert.sub.ofAs<[string, string] & { groups: undefined }>().onAs<MatchType>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    Ts.Assert.exact.ofAs<typeof match>().on(match2)
  })

  test('optionals: can infer from inline or pattern', () => {
    type matches = { indicies: [string | undefined] }
    const match = Str.match<matches>(s, re)
    Ts.Assert.sub.ofAs<Option.Option<any>>().on(match)
    // Type-level test for the indicies
    type MatchType = typeof match extends Option.Option<infer R> ? R : never
    Ts.Assert.sub.ofAs<[string, string | undefined] & { groups: undefined }>().onAs<MatchType>()
    const pattern = Str.pattern<matches>(re)
    const match2 = Str.match(s, pattern)
    Ts.Assert.exact.ofAs<typeof match>().on(match2)
  })
})

test('pattern is interoperable with RegExp type', () => {
  s.match(Str.pattern(re))
  s.match(Str.pattern<{ groups: ['foobar'] }>(re))
})
