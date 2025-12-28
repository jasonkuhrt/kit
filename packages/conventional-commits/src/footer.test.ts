import { describe, expect, test } from 'vitest'
import { Custom, from, isBreakingChange, Standard } from './footer.js'

describe('Footer', () => {
  describe('Standard', () => {
    test('from creates Standard for BREAKING CHANGE', () => {
      const footer = from('BREAKING CHANGE', 'removed deprecated API')
      expect(footer._tag).toBe('Standard')
      expect(footer.token).toBe('BREAKING CHANGE')
      expect(footer.value).toBe('removed deprecated API')
    })

    test('from creates Standard for BREAKING-CHANGE', () => {
      const footer = from('BREAKING-CHANGE', 'removed API')
      expect(footer._tag).toBe('Standard')
      expect(footer.token).toBe('BREAKING-CHANGE')
    })

    test('Standard.make creates valid footer', () => {
      const footer = Standard.make({
        token: 'BREAKING CHANGE',
        value: 'removed X',
      })
      expect(footer.token).toBe('BREAKING CHANGE')
    })
  })

  describe('Custom', () => {
    test('from creates Custom for unknown tokens', () => {
      const footer = from('Fixes', '#123')
      expect(footer._tag).toBe('Custom')
      expect(footer.token).toBe('Fixes')
      expect(footer.value).toBe('#123')
    })

    test('Custom.make creates valid footer', () => {
      const footer = Custom.make({ token: 'Reviewed-by', value: 'alice' })
      expect(footer.token).toBe('Reviewed-by')
    })
  })

  describe('isBreakingChange', () => {
    test('returns true for Standard footers', () => {
      expect(isBreakingChange(from('BREAKING CHANGE', 'x'))).toBe(true)
      expect(isBreakingChange(from('BREAKING-CHANGE', 'x'))).toBe(true)
    })

    test('returns false for Custom footers', () => {
      expect(isBreakingChange(from('Fixes', '#123'))).toBe(false)
    })
  })
})
