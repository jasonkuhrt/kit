import { Test } from '#test'
import { Option } from 'effect'
import { expect, test } from 'vitest'
import { match, pattern, type RegExpMatchResult } from './match.js'

const regExpMatchResult = (matchString: string, ...groups: string[]): RegExpMatchResult<any> => {
  return [matchString, ...groups] as RegExpMatchResult<any>
}

// dprint-ignore
Test.on(match)
  .describe('basic', [
    [['hello world', /foo/ ],         Option.none()],
    [['hello world', /hello/ ],       Option.some(regExpMatchResult('hello')) as any],
    [['hello world', /hello (\w+)/ ], Option.some(regExpMatchResult('hello world', 'world')) as any]
  ])
  .describe('edges', [
    [['',      /^$/ ],      Option.some(regExpMatchResult('')) as any],
    [['',      /foo/ ],     Option.none()],
    [['HELLO', /hello/ ],   Option.none()],
    [['HELLO', /hello/i ],  Option.some(regExpMatchResult('HELLO')) as any],
  ])
  .test(({ result, output }) => {
    if (Option.isNone(output!)) {
      expect(Option.isNone(result)).toBe(true)
    } else {
      expect(Option.isSome(result)).toBe(true)
      output!.value.forEach((group: string, idx: number) => {
        expect(Option.getOrThrow(result)[idx]).toBe(group)
      })
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
