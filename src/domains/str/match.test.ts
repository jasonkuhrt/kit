import { Test } from '#test'
import { Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { match, pattern } from './match.js'
import type { Matches } from './match.js'

// Test the match function using table-driven tests for consistency
describe('match', () => {
  // dprint-ignore
  Test.Table.suite<
    { text: string; pattern: RegExp },
    { match: string | null; groups?: string[] }
  >('basic matching', [
    { n: 'no match returns None',                      i: { text: 'hello world', pattern: /foo/ },            o: { match: null } },
    { n: 'simple match returns Some',                  i: { text: 'hello world', pattern: /hello/ },          o: { match: 'hello' } },
    { n: 'captures groups',                            i: { text: 'hello world', pattern: /hello (\w+)/ },    o: { match: 'hello world', groups: ['world'] } },
  ], ({ i, o }) => {
    const result = match(i.text, i.pattern)

    if (o.match === null) {
      expect(Option.isNone(result)).toBe(true)
    } else {
      expect(Option.isSome(result)).toBe(true)
      if (Option.isSome(result)) {
        expect(result.value[0]).toBe(o.match)
        if (o.groups) {
          o.groups.forEach((group, i) => {
            expect(result.value[i + 1]).toBe(group)
          })
        }
      }
    }
  })

  test('captures named groups with types', () => {
    type matches = { groups: ['name', 'age'] }
    const p = pattern<matches>(/(?<name>\w+) is (?<age>\d+)/)
    const result = match('John is 25', p)

    expect(Option.isSome(result)).toBe(true)
    if (Option.isSome(result)) {
      expect(result.value.groups.name).toBe('John')
      expect(result.value.groups.age).toBe('25')
    }
  })

  test('handles optional groups', () => {
    type matches = { groups: ['required', 'optional' | undefined] }
    const p = pattern<matches>(/(?<required>\w+)(?:\s+(?<optional>\d+))?/)

    const result1 = match('hello 123', p)
    expect(Option.isSome(result1)).toBe(true)
    if (Option.isSome(result1)) {
      expect(result1.value.groups.required).toBe('hello')
      expect(result1.value.groups.optional).toBe('123')
    }

    const result2 = match('hello', p)
    expect(Option.isSome(result2)).toBe(true)
    if (Option.isSome(result2)) {
      expect(result2.value.groups.required).toBe('hello')
      expect(result2.value.groups.optional).toBeUndefined()
    }
  })

  test('returns first match with global flag', () => {
    const result = match('foo bar foo', /foo/g)
    expect(Option.isSome(result)).toBe(true)
    if (Option.isSome(result)) {
      expect(result.value[0]).toBe('foo')
      // With global flag, match() returns all matches as array items
      // but our typed version expects the standard match array format
    }
  })

  Test.Table.suite<
    string,
    { isNone?: boolean; match?: string },
    { pattern: RegExp }
  >(
    'edge cases', // dprint-ignore
    [
      { n: 'empty string with empty pattern',            i: '',          pattern: /^$/,        o: { match: '' } },
      { n: 'empty string with non-empty pattern',        i: '',          pattern: /foo/,       o: { isNone: true } },
      { n: 'case sensitive match fails',                 i: 'HELLO',     pattern: /hello/,     o: { isNone: true } },
      { n: 'case insensitive match succeeds',            i: 'HELLO',     pattern: /hello/i,    o: { match: 'HELLO' } },
  ],
    ({ i, pattern, o }) => {
      const result = match(i, pattern)

      if (o.isNone) {
        expect(Option.isNone(result)).toBe(true)
      } else if (o.match !== undefined) {
        expect(Option.isSome(result)).toBe(true)
        if (Option.isSome(result)) {
          expect(result.value[0]).toBe(o.match)
        }
      }
    },
  )
})
