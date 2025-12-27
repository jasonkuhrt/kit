import { describe, expect, test } from 'vitest'
import { Impact, ImpactValues, StandardValue, StandardValues } from './type.js'

describe('Impact', () => {
  test('has runtime enum values', () => {
    expect(ImpactValues.none).toBe('none')
    expect(ImpactValues.patch).toBe('patch')
    expect(ImpactValues.minor).toBe('minor')
  })

  test('schema exposes enums', () => {
    expect(Impact.enums.none).toBe('none')
    expect(Impact.enums.patch).toBe('patch')
    expect(Impact.enums.minor).toBe('minor')
  })
})

describe('StandardValue', () => {
  test('has all 11 standard types', () => {
    expect(Object.keys(StandardValues)).toHaveLength(11)
    expect(StandardValues.feat).toBe('feat')
    expect(StandardValues.fix).toBe('fix')
    expect(StandardValues.docs).toBe('docs')
    expect(StandardValues.style).toBe('style')
    expect(StandardValues.refactor).toBe('refactor')
    expect(StandardValues.perf).toBe('perf')
    expect(StandardValues.test).toBe('test')
    expect(StandardValues.build).toBe('build')
    expect(StandardValues.ci).toBe('ci')
    expect(StandardValues.chore).toBe('chore')
    expect(StandardValues.revert).toBe('revert')
  })

  test('schema exposes enums', () => {
    expect(StandardValue.enums.feat).toBe('feat')
  })
})
