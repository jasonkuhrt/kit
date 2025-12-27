import { describe, expect, test } from 'vitest'
import { Target } from './target.js'
import { Standard } from './type.js'

describe('Target', () => {
  test('make creates valid target', () => {
    const target = Target.make({
      type: Standard.make({ value: 'feat' }),
      scope: 'core',
      breaking: true,
    })
    expect(target.type._tag).toBe('Standard')
    expect(target.type.value).toBe('feat')
    expect(target.scope).toBe('core')
    expect(target.breaking).toBe(true)
  })

  test('_tag is Target', () => {
    const target = Target.make({
      type: Standard.make({ value: 'fix' }),
      scope: 'cli',
      breaking: false,
    })
    expect(target._tag).toBe('Target')
  })
})
