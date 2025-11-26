import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'
import './_.js'

describe('generalized equivalence matchers', () => {
  test('toBeEquivalent with Schema', () => {
    const Person = S.Struct({
      name: S.String,
      age: S.Number,
    })

    const person1 = { name: 'Alice', age: 30 }
    const person2 = { name: 'Alice', age: 30 }
    const person3 = { name: 'Bob', age: 30 }

    // These should pass
    expect(person1).toBeEquivalent(person2, Person)
    expect(person1).not.toBeEquivalent(person3, Person)
  })

  test('toBeEquivalentWith custom equivalence', () => {
    // Custom equivalence that ignores case
    const caseInsensitiveEquivalence = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

    expect('HELLO').toBeEquivalentWith('hello', caseInsensitiveEquivalence)
    expect('HELLO').not.toBeEquivalentWith('world', caseInsensitiveEquivalence)
  })

  test('works with nested structs', () => {
    const Address = S.Struct({
      street: S.String,
      city: S.String,
    })

    const User = S.Struct({
      name: S.String,
      address: Address,
    })

    const user1 = {
      name: 'Alice',
      address: { street: '123 Main St', city: 'Boston' },
    }
    const user2 = {
      name: 'Alice',
      address: { street: '123 Main St', city: 'Boston' },
    }

    expect(user1).toBeEquivalent(user2, User)
  })
})
