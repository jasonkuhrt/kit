import { describe, expect, test } from 'vitest'
import { Target } from './target.js'

describe('Target', () => {
  test('make creates valid target', () => {
    const target = Target.make({
      type: 'feat',
      scope: 'core',
      breaking: true,
    })
    expect(target.type).toBe('feat')
    expect(target.scope).toBe('core')
    expect(target.breaking).toBe(true)
  })

  test('_tag is Target', () => {
    const target = Target.make({ type: 'fix', scope: 'cli', breaking: false })
    expect(target._tag).toBe('Target')
  })
})
