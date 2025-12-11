import { Str } from '#str'
import { Test } from '#test'
import { expect } from 'vitest'
import { Leaf } from './leaf.js'

/**
 * Tests for the 70-character readability cap in Leaf.
 *
 * The cap ensures text never renders wider than 70 characters,
 * regardless of the maxWidth passed to render().
 * This improves readability - lines beyond 70 chars are hard to read.
 */
Test.describe(`Leaf > 70-char readability cap`)
  .inputType<[textLength: number, maxWidth: number]>()
  .outputType<number>()
  .cases(
    // Even with maxWidth > 70, text should wrap at 70
    [[100, 120], 70],
    [[100, 100], 70],
    [[100, 70], 70],
    // Short text remains unchanged
    [[50, 120], 50],
    [[50, 70], 50],
    [[50, 50], 50],
    // maxWidth < 70 still constrains output
    [[100, 40], 40],
    [[100, 60], 60],
    // Exactly 70 characters
    [[70, 120], 70],
    [[70, 70], 70],
  )
  .test(({ input: [textLength, maxWidth], output }) => {
    const leaf = new Leaf('_'.repeat(textLength))
    const result = leaf.render({
      maxWidth,
      index: { total: 1, isFirst: true, isLast: true, position: 0 },
    })
    const maxLineWidth = Math.max(...Str.Text.lines(result.value).map(Str.Visual.width))
    expect(maxLineWidth).toBe(output)
  })
