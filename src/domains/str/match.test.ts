import { Test } from '#test'
import { Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { match, pattern } from './match.js'
import type { Matches } from './match.js'

// Test the match function using table-driven tests for consistency
describe('match', () => {
  // dprint-ignore
  Test.Table.suite<{
    input: string
    pattern: RegExp
    expected: { match: string | null; groups?: string[] }
  }>('basic matching', [
    { name: 'no match returns None',                      input: 'hello world',    pattern: /foo/,            expected: { match: null } },
    { name: 'simple match returns Some',                  input: 'hello world',    pattern: /hello/,          expected: { match: 'hello' } },
    { name: 'captures groups',                            input: 'hello world',    pattern: /hello (\w+)/,    expected: { match: 'hello world', groups: ['world'] } },
  ], ({ input, pattern, expected }) => {
    const result = match(input, pattern)

    if (expected.match === null) {
      expect(Option.isNone(result)).toBe(true)
    } else {
      expect(Option.isSome(result)).toBe(true)
      if (Option.isSome(result)) {
        expect(result.value[0]).toBe(expected.match)
        if (expected.groups) {
          expected.groups.forEach((group, i) => {
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

  // dprint-ignore
  Test.Table.suite<{
    input: string
    pattern: RegExp
    expected: { isNone?: boolean; match?: string }
  }>('edge cases', [
    { name: 'empty string with empty pattern',            input: '',          pattern: /^$/,        expected: { match: '' } },
    { name: 'empty string with non-empty pattern',        input: '',          pattern: /foo/,       expected: { isNone: true } },
    { name: 'case sensitive match fails',                 input: 'HELLO',     pattern: /hello/,     expected: { isNone: true } },
    { name: 'case insensitive match succeeds',            input: 'HELLO',     pattern: /hello/i,    expected: { match: 'HELLO' } },
  ], ({ input, pattern, expected }) => {
    const result = match(input, pattern)

    if (expected.isNone) {
      expect(Option.isNone(result)).toBe(true)
    } else if (expected.match !== undefined) {
      expect(Option.isSome(result)).toBe(true)
      if (Option.isSome(result)) {
        expect(result.value[0]).toBe(expected.match)
      }
    }
  })
})
