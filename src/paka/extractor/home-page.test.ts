import { describe, expect, test } from 'vitest'
import { parseHomePage } from './home-page.js'

describe('parseHomePage', () => {
  describe('valid home pages', () => {
    test('parses complete home page with all sections', () => {
      const markdown = `# Hero

## Name
Math Utilities

## Text
Mathematical operations and functions.

## Tagline
Comprehensive math toolkit

# Highlights

## Addition
Add numbers together.

## Subtraction
Subtract one number from another.

# Body

## Getting Started

Import the Math namespace:

\`\`\`typescript
import { Math } from '@example/lib'
\`\`\`

## Exports
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toEqual({
        name: 'Math Utilities',
        text: 'Mathematical operations and functions.',
        tagline: 'Comprehensive math toolkit',
      })

      expect(home.highlights).toHaveLength(2)
      expect(home.highlights?.[0]?.title).toBe('Addition')
      expect(home.highlights?.[0]?.body).toBe('Add numbers together.')
      expect(home.highlights?.[1]?.title).toBe('Subtraction')
      expect(home.highlights?.[1]?.body).toBe('Subtract one number from another.')

      expect(home.body).toHaveLength(2)
      expect(home.body![0]).toEqual({
        _tag: 'content',
        title: 'Getting Started',
        body: expect.stringContaining('Import the Math namespace'),
      })
      expect(home.body![1]).toEqual({ _tag: 'exports' })
    })

    test('parses minimal home page with Highlights only', () => {
      const markdown = `# Highlights

## Feature 1
Description of feature 1.

## Feature 2
Description of feature 2.
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toBeUndefined()
      expect(home.highlights).toHaveLength(2)
      expect(home.body).toBeUndefined()
    })

    test('parses home page with Hero only', () => {
      const markdown = `# Hero

## Name
My Library

## Tagline
Great library
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toEqual({
        name: 'My Library',
        tagline: 'Great library',
      })
      expect(home.hero!.text).toBeUndefined()
      expect(home.highlights).toBeUndefined()
      expect(home.body).toBeUndefined()
    })

    test('parses home page with Body only', () => {
      const markdown = `# Body

## Overview
This is an overview section.

## Advanced
Advanced content here.
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toBeUndefined()
      expect(home.highlights).toBeUndefined()
      expect(home.body).toHaveLength(2)
      expect(home.body![0]).toEqual({
        _tag: 'content',
        title: 'Overview',
        body: 'This is an overview section.',
      })
    })

    test('handles empty Hero subsections gracefully', () => {
      const markdown = `# Hero

## Name
My Library
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toEqual({
        name: 'My Library',
      })
    })

    test('preserves markdown formatting in body', () => {
      const markdown = `# Highlights

## Code Example

\`\`\`typescript
const x = 42
\`\`\`

- List item 1
- List item 2
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.highlights?.[0]?.body).toContain('```typescript')
      expect(home.highlights?.[0]?.body).toContain('const x = 42')
      expect(home.highlights?.[0]?.body).toContain('List item 1')
    })
  })

  describe('validation errors', () => {
    test('throws on unknown h1 heading', () => {
      const markdown = `# InvalidSection

Some content here.
`

      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Invalid heading/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/InvalidSection/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Allowed top-level headings/)
    })

    test('throws on multiple unknown h1 headings', () => {
      const markdown = `# Summary

Content 1.

# Description

Content 2.
`

      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Invalid headings/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Summary/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Description/)
    })

    test('throws on invalid h2 under Hero', () => {
      const markdown = `# Hero

## InvalidSubheading
Some text.
`

      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Invalid subheading/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/InvalidSubheading/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/under '# Hero'/)
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(/Allowed subheadings/)
    })

    test('throws on no valid sections', () => {
      const markdown = `Some content before any heading.

More content.
`

      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(
        /No valid sections found/,
      )
      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(
        /At least one of the following sections is required/,
      )
    })

    test('throws on duplicate h1 sections', () => {
      const markdown = `# Hero

## Name
First

# Hero

## Name
Duplicate
`

      expect(() => parseHomePage(markdown, 'test.home.md')).toThrow(
        /Duplicate section '# Hero'/,
      )
    })
  })

  describe('edge cases', () => {
    test('handles empty Highlights section', () => {
      const markdown = `# Highlights
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.highlights).toEqual([])
    })

    test('handles empty Body section', () => {
      const markdown = `# Body
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.body).toEqual([])
    })

    test('handles content before first h1 (ignored)', () => {
      const markdown = `This content is before any heading and should be ignored.

# Hero

## Name
My Library
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.hero).toEqual({
        name: 'My Library',
      })
    })

    test('handles multiple Exports sections in Body', () => {
      const markdown = `# Body

## Exports

## Advanced

Some content.

## Exports
`

      const home = parseHomePage(markdown, 'test.home.md')

      expect(home.body).toHaveLength(3)
      expect(home.body![0]).toEqual({ _tag: 'exports' })
      expect(home.body![1]).toEqual({
        _tag: 'content',
        title: 'Advanced',
        body: 'Some content.',
      })
      expect(home.body![2]).toEqual({ _tag: 'exports' })
    })
  })
})
