import { Assert } from '#assert'
import { Lens } from '#lens'
import { describe, expect, test } from 'vitest'

const A = Assert.Type

// Test data
const user = { name: 'Alice', address: { city: 'NYC' } }
const users = [{ name: 'Alice' }, { name: 'Bob' }]
const indexed = { data: { a: 1, b: 2 } as Record<string, number> }
const tuple = ['first', 'second'] as const

type User = typeof user
type Users = typeof users
type Indexed = typeof indexed
type Tuple = typeof tuple

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Lens.get (uncurried)
//

describe('Lens.get - uncurried', () => {
  test('.name', () => {
    const result = Lens.get('.name', user)
    expect(result).toBe('Alice')
    A.exact.ofAs<Lens.Get<'.name', User>>().on(result)
    A.exact.ofAs<string>().on(result)
  })

  test('.address.city', () => {
    const result = Lens.get('.address.city', user)
    expect(result).toBe('NYC')
    A.exact.ofAs<Lens.Get<'.address.city', User>>().on(result)
    A.exact.ofAs<string>().on(result)
  })

  test("['weird.name']", () => {
    const data = { 'weird.name': 'value' }
    const result = Lens.get("['weird.name']", data)
    expect(result).toBe('value')
    A.exact.ofAs<Lens.Get<"['weird.name']", typeof data>>().on(result)
    A.exact.ofAs<string>().on(result)
  })

  test('[0]', () => {
    const result = Lens.get('[0]', tuple)
    expect(result).toBe('first')
    A.exact.ofAs<Lens.Get<'[0]', Tuple>>().on(result)
    A.exact.ofAs<'first'>().on(result)
  })
})

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Lens.getWith (curried, expression first)
//

describe('Lens.getWith - curried', () => {
  test('creates reusable getter', () => {
    const getName = Lens.getWith('.name')
    const result = getName(user)
    expect(result).toBe('Alice')
    A.exact.ofAs<string>().on(result)
  })

  test('pipeline usage', () => {
    const results = users.map(Lens.getWith('.name'))
    expect(results).toEqual(['Alice', 'Bob'])
    A.exact.ofAs<string[]>().on(results)
  })

  test('nested path', () => {
    const getCity = Lens.getWith('.address.city')
    const result = getCity(user)
    expect(result).toBe('NYC')
    A.exact.ofAs<string>().on(result)
  })
})

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Lens.getOn (curried, data first)
//

describe('Lens.getOn - inverse curried', () => {
  test('binds to object for multiple extractions', () => {
    const fromUser = Lens.getOn(user)
    const name = fromUser('.name')
    const city = fromUser('.address.city')
    expect(name).toBe('Alice')
    expect(city).toBe('NYC')
    A.exact.ofAs<string>().on(name)
    A.exact.ofAs<string>().on(city)
  })

  test('tuple access', () => {
    const fromTuple = Lens.getOn(tuple)
    const first = fromTuple('[0]')
    const second = fromTuple('[1]')
    expect(first).toBe('first')
    expect(second).toBe('second')
    A.exact.ofAs<'first'>().on(first)
    A.exact.ofAs<'second'>().on(second)
  })
})

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type-Level Only
//

describe('Lens.Get - type-level only', () => {
  test('.items[]', () => {
    type Result = Lens.Get<'.items[]', { items: number[] }>
    A.exact.ofAs<number>().onAs<Result>()
  })

  test('.data:', () => {
    type Result = Lens.Get<'.data:', Indexed>
    A.exact.ofAs<number>().onAs<Result>()
  })

  test('.users[].name', () => {
    type Result = Lens.Get<'.users[].name', { users: Users }>
    A.exact.ofAs<string>().onAs<Result>()
  })
})

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Static Error Detection
//

// test('value-level get rejects invalid property', () => {
//   // @ts-expect-error - .bad does not exist on User, should be caught by parameter guard
//   Lens.get('.bad', user)
// })
