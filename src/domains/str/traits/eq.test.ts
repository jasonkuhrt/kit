/**
 * Tests for Str {@link Eq} trait implementation.
 */

import { describe, expect, test } from 'vitest'
import { Str } from '../$.ts'

describe('Str.Eq implementation', () => {
  test('equal strings', () => {
    expect(Str.Eq.is('hello', 'hello')).toBe(true)
    expect(Str.Eq.is('', '')).toBe(true)
    expect(Str.Eq.is('café', 'café')).toBe(true)
  })

  test('different strings', () => {
    expect(Str.Eq.is('hello', 'world')).toBe(false)
    expect(Str.Eq.is('hello', 'Hello')).toBe(false)
    expect(Str.Eq.is('hello', '')).toBe(false)
  })

  test('isOn currying', () => {
    const isHello = Str.Eq.isOn('hello' as any)
    expect(isHello('hello' as any)).toBe(true)
    expect(isHello('world' as any)).toBe(false)
  })
})
