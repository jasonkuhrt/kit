import { Assert } from '@kitz/assert'
import { Schema } from 'effect'
import { describe, expect, test } from 'vitest'
import { Custom, from, Impact, impact, Standard, StandardImpact, StandardValue, Type, value } from './type.js'

describe('Impact', () => {
  test('exposes runtime enum values via .enums', () => {
    expect(Impact.enums.none).toBe('none')
    expect(Impact.enums.patch).toBe('patch')
    expect(Impact.enums.minor).toBe('minor')
  })
})

describe('StandardValue', () => {
  test('has all 11 standard types via .enums', () => {
    expect(Object.keys(StandardValue.enums)).toHaveLength(11)
    expect(StandardValue.enums.feat).toBe('feat')
    expect(StandardValue.enums.fix).toBe('fix')
    expect(StandardValue.enums.docs).toBe('docs')
    expect(StandardValue.enums.style).toBe('style')
    expect(StandardValue.enums.refactor).toBe('refactor')
    expect(StandardValue.enums.perf).toBe('perf')
    expect(StandardValue.enums.test).toBe('test')
    expect(StandardValue.enums.build).toBe('build')
    expect(StandardValue.enums.ci).toBe('ci')
    expect(StandardValue.enums.chore).toBe('chore')
    expect(StandardValue.enums.revert).toBe('revert')
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
    for (const key of Object.keys(StandardValue.enums)) {
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

describe('Standard.is', () => {
  test('returns true for Standard', () => {
    expect(Standard.is(new Standard({ value: 'feat' }))).toBe(true)
  })

  test('returns false for Custom', () => {
    expect(Standard.is(new Custom({ value: 'wip' }))).toBe(false)
  })
})

describe('Custom.is', () => {
  test('returns true for Custom', () => {
    expect(Custom.is(new Custom({ value: 'wip' }))).toBe(true)
  })

  test('returns false for Standard', () => {
    expect(Custom.is(new Standard({ value: 'feat' }))).toBe(false)
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

describe('from', () => {
  test('creates Standard for known types', () => {
    const t = from('feat')
    expect(t._tag).toBe('Standard')
    expect(t.value).toBe('feat')
  })

  test('creates Custom for unknown types', () => {
    const t = from('wip')
    expect(t._tag).toBe('Custom')
    expect(t.value).toBe('wip')
  })

  test('works with all standard types', () => {
    for (const key of Object.keys(StandardValue.enums)) {
      const t = from(key)
      expect(t._tag).toBe('Standard')
    }
  })
})

// ─── Type-Level Tests ───────────────────────────────────────────

// Type-level tests for from()
Assert.exact.ofAs<Standard>().on(from('feat'))
Assert.exact.ofAs<Standard>().on(from('fix'))
Assert.exact.ofAs<Custom>().on(from('wip'))
Assert.exact.ofAs<Custom>().on(from('experimental'))

// Dynamic string returns union
const dynamic: string = 'unknown'
Assert.exact.ofAs<Type>().on(from(dynamic))
