import { describe, expect, test } from 'vitest'
import { Footer } from './footer.js'

describe('Footer', () => {
  test('make creates valid footer', () => {
    const footer = Footer.make({
      token: 'BREAKING CHANGE',
      value: 'removed deprecated API',
    })
    expect(footer.token).toBe('BREAKING CHANGE')
    expect(footer.value).toBe('removed deprecated API')
  })

  test('_tag is Footer', () => {
    const footer = Footer.make({ token: 'Fixes', value: '#123' })
    expect(footer._tag).toBe('Footer')
  })
})
