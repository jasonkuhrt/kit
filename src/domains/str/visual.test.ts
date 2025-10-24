import { Test } from '#test'
import { expect, test } from 'vitest'
import { Str } from './$.js'

// dprint-ignore
Test.on(Str.Visual.width)
  .casesInput(
    // Plain text
    'hello',
    'abc',
    // ANSI escape codes
    '\x1b[31mred\x1b[0m',
    '\x1b[32mgreen\x1b[0m text',
    '\x1b[1m\x1b[4mbold underline\x1b[0m',
    // Grapheme clusters
    '👋',
    '👨‍👩‍👧‍👦', // Family emoji (multi-codepoint)
    '🇺🇸', // Flag emoji
    'é', // e + combining accent
    // Empty string
    '',
    '\x1b[31m\x1b[0m', // Only ANSI codes
    // Mixed content
    '👋 \x1b[32mhello\x1b[0m', // emoji + space + "hello"
  )
  .test()

// Regression test for issue #41: Ensure width calculation is consistent across environments
// Different Node.js versions have different ICU data, which affects Intl.Segmenter behavior.
// Using explicit locale ('en-US') ensures deterministic grapheme segmentation.
test('width: cross-environment consistency (issue #41)', () => {
  // Basic ASCII - should always be consistent
  expect(Str.Visual.width('Environment (1)')).toBe(15)
  expect(Str.Visual.width('Name')).toBe(4)
  expect(Str.Visual.width('Type')).toBe(4)
  expect(Str.Visual.width('Default')).toBe(7)

  // With ANSI codes - visual width ignores escape codes
  expect(Str.Visual.width('\x1b[32mEnvironment (1)\x1b[0m')).toBe(15)

  // Grapheme clusters - these are sensitive to ICU version
  expect(Str.Visual.width('é')).toBe(1) // e + combining accent
  expect(Str.Visual.width('👨‍👩‍👧‍👦')).toBe(1) // Family emoji
  expect(Str.Visual.width('🇺🇸')).toBe(1) // Flag emoji

  // Mixed content that might appear in table headers
  expect(Str.Visual.width('Status ✓')).toBe(8)
  expect(Str.Visual.width('Count: 42')).toBe(9)
})

// dprint-ignore
Test.on(Str.Visual.pad)
  .casesInput(
    ['hi', 5, 'right'],
    ['hi', 5, 'left'],
    ['hello', 3, 'left'], // Already wider
    ['x', 5, 'right', '-'], // Custom char
    ['hi', 5], // Defaults
  )
  .test()

test('pad: handles ANSI codes', () => {
  const colored = '\x1b[31mOK\x1b[0m'
  const padded = Str.Visual.pad(colored, 5, 'right')
  expect(Str.Visual.width(padded)).toBe(5)
  expect(padded).toMatch(/OK/)
})

// dprint-ignore
Test.on(Str.Visual.span)
  .casesInput(
    ['hi', 5, 'left'],
    ['hi', 5, 'right'],
    ['x', 5, 'left', '.'],
  )
  .test()

test('span: handles ANSI codes', () => {
  const colored = '\x1b[34mID\x1b[0m'
  const spanned = Str.Visual.span(colored, 6, 'left')
  expect(Str.Visual.width(spanned)).toBe(6)
})

// dprint-ignore
Test.on(Str.Visual.take)
  .casesInput(
    ['hello world', 5],
    ['hi', 10], // Size exceeds length
  )
  .test()

test('take: handles ANSI codes', () => {
  const colored = '\x1b[31mhello\x1b[0m world'
  const taken = Str.Visual.take(colored, 5)
  expect(Str.Visual.width(taken)).toBe(5)
  expect(taken).toMatch(/hello/)
})

test('take: handles emoji', () => {
  const taken = Str.Visual.take('👋 hello', 2)
  expect(Str.Visual.width(taken)).toBe(2)
})

// dprint-ignore
Test.on(Str.Visual.takeWords)
  .casesInput(
    ['hello world here', 12],
    ['verylongword more', 8],
    ['', 10],
    ['short', 10],
  )
  .test()

test('takeWords: handles ANSI codes', () => {
  const colored = '\x1b[32mone\x1b[0m two three'
  const result = Str.Visual.takeWords(colored, 7)
  expect(Str.Visual.width(result.taken)).toBe(7)
  expect(result.remaining).toBe('three')
})

// dprint-ignore
Test.on(Str.Visual.size)
  .casesInput(
    'hello',
    'hello\nworld',
    'hi\nlonger line\nbye',
    '',
  )
  .test()

test('size: handles ANSI codes', () => {
  const colored = '\x1b[31mred\x1b[0m\n\x1b[32mgreen!\x1b[0m'
  const result = Str.Visual.size(colored)
  expect(result).toEqual({ maxWidth: 6, height: 2 })
})

// dprint-ignore
Test.on(Str.Visual.maxWidth)
  .casesInput(
    'hello',
    'short\nlonger line\nhi',
  )
  .test()

test('maxWidth: handles ANSI codes', () => {
  const colored = '\x1b[31mred\x1b[0m\n\x1b[32mgreen\x1b[0m'
  expect(Str.Visual.maxWidth(colored)).toBe(5)
})

test('takeOn', () => {
  const takeHello = Str.Visual.takeOn('hello world')
  expect(takeHello(5)).toBe('hello')
})

test('takeWith', () => {
  const take5 = Str.Visual.takeWith(5)
  expect(take5('hello world')).toBe('hello')
})

test('takeWordsOn', () => {
  const takeWordsHello = Str.Visual.takeWordsOn('hello world here')
  expect(takeWordsHello(12).taken).toBe('hello world')
})

test('takeWordsWith', () => {
  const takeWords12 = Str.Visual.takeWordsWith(12)
  expect(takeWords12('hello world here').taken).toBe('hello world')
})

// dprint-ignore
Test.on(Str.Visual.wrap)
  .casesInput(
    ['hello world', 10],
    ['hello world here', 10], // Multiple lines
    ['verylongword more', 8],  // Word longer than width
    ['', 10],                  // Empty string
    ['short', 20],             // Width exceeds text
    ['one\ntwo\nthree', 10],   // Pre-existing newlines
    ['hello world', 5],        // Very narrow width
  )
  .test()

test('wrap: handles ANSI codes', () => {
  const colored = '\x1b[32mhello world here\x1b[0m'
  const lines = Str.Visual.wrap(colored, 12)
  expect(lines).toHaveLength(2)
  expect(Str.Visual.width(lines[0] as string)).toBeLessThanOrEqual(12)
  expect(lines[0]).toMatch(/hello world/)
})

test('wrap: preserves ANSI codes across lines', () => {
  const text = '\x1b[31mred text that spans\x1b[0m multiple lines'
  const lines = Str.Visual.wrap(text, 15)
  expect(lines.length).toBeGreaterThan(1)
})

test('wrapOn', () => {
  const wrapHello = Str.Visual.wrapOn('hello world here')
  expect(wrapHello(12)).toEqual(['hello world', 'here'])
})

test('wrapWith', () => {
  const wrap12 = Str.Visual.wrapWith(12)
  expect(wrap12('hello world here')).toEqual(['hello world', 'here'])
})
