import { describe, expect, test } from 'vitest'
import { from } from './footer.js'
import { TargetSection } from './target-section.js'

describe('TargetSection', () => {
  test('make creates valid section with footers', () => {
    const section = TargetSection.make({
      body: 'Detailed description of changes.',
      footers: [from('BREAKING CHANGE', 'removed X')],
    })
    expect(section.body).toBe('Detailed description of changes.')
    expect(section.footers).toHaveLength(1)
    expect(section.footers[0].token).toBe('BREAKING CHANGE')
  })

  test('make creates section with empty footers', () => {
    const section = TargetSection.make({
      body: 'Simple change.',
      footers: [],
    })
    expect(section.footers).toHaveLength(0)
  })
})
