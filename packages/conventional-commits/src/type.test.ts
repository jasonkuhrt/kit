import { describe, expect, test } from 'vitest'
import { Custom, impact, Impact, ImpactValues, isCustom, isStandard, Standard, StandardImpact, StandardValue, StandardValues, Type, value } from './type.js'
import { Schema } from 'effect'

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

describe('StandardImpact', () => {
  test('feat is minor', () => {
    expect(StandardImpact.feat).toBe('minor')
  })

  test('fix is patch', () => {
    expect(StandardImpact.fix).toBe('patch')
  })

  test('docs is patch', () => {
    expect(StandardImpact.docs).toBe('patch')
  })

  test('perf is patch', () => {
    expect(StandardImpact.perf).toBe('patch')
  })

  test('chore is none', () => {
    expect(StandardImpact.chore).toBe('none')
  })

  test('all standard types have impact mappings', () => {
    for (const key of Object.keys(StandardValues)) {
      expect(StandardImpact[key as StandardValue]).toBeDefined()
    }
  })
})

describe('Standard', () => {
  test('creates with valid value', () => {
    const s = new Standard({ value: 'feat' })
    expect(s._tag).toBe('Standard')
    expect(s.value).toBe('feat')
  })

  test('decodes from object', () => {
    const result = Schema.decodeUnknownSync(Standard)({ _tag: 'Standard', value: 'fix' })
    expect(result.value).toBe('fix')
  })
})

describe('Custom', () => {
  test('creates with any string value', () => {
    const c = new Custom({ value: 'wip' })
    expect(c._tag).toBe('Custom')
    expect(c.value).toBe('wip')
  })

  test('decodes from object', () => {
    const result = Schema.decodeUnknownSync(Custom)({ _tag: 'Custom', value: 'experimental' })
    expect(result.value).toBe('experimental')
  })
})

describe('Type', () => {
  test('is union of Standard and Custom', () => {
    const standard = Schema.decodeUnknownSync(Type)({ _tag: 'Standard', value: 'feat' })
    const custom = Schema.decodeUnknownSync(Type)({ _tag: 'Custom', value: 'wip' })
    expect(standard._tag).toBe('Standard')
    expect(custom._tag).toBe('Custom')
  })
})

describe('isStandard', () => {
  test('returns true for Standard', () => {
    expect(isStandard(new Standard({ value: 'feat' }))).toBe(true)
  })

  test('returns false for Custom', () => {
    expect(isStandard(new Custom({ value: 'wip' }))).toBe(false)
  })
})

describe('isCustom', () => {
  test('returns true for Custom', () => {
    expect(isCustom(new Custom({ value: 'wip' }))).toBe(true)
  })

  test('returns false for Standard', () => {
    expect(isCustom(new Standard({ value: 'feat' }))).toBe(false)
  })
})

describe('value', () => {
  test('extracts value from Standard', () => {
    expect(value(new Standard({ value: 'feat' }))).toBe('feat')
  })

  test('extracts value from Custom', () => {
    expect(value(new Custom({ value: 'wip' }))).toBe('wip')
  })
})

describe('impact', () => {
  test('returns impact for Standard', () => {
    expect(impact(new Standard({ value: 'feat' }))).toBe('minor')
    expect(impact(new Standard({ value: 'fix' }))).toBe('patch')
    expect(impact(new Standard({ value: 'chore' }))).toBe('none')
  })
})
