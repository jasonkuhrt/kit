import { Project } from 'ts-morph'
import { describe, expect, test } from 'vitest'
import { generateForFile } from './fn-partial-generator.js'

describe('partialize generator', () => {
  test('generates overloads for 2-parameter function', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'test.js',
      `
export type _ = symbol

// @partialize
export interface Add<N> {
  /**
   * Adds two numbers
   */
  (a: N, b: N): N
}
`,
    )

    await generateForFile(sourceFile)
    const content = sourceFile.getFullText()

    // Check that generated section exists
    expect(content).toContain('@partialize-start')
    expect(content).toContain('@partialize-end')
    expect(content).toContain('Positional arguments')

    // Check specific signatures
    expect(content).toContain('(a: _, b: _): Add<N>')
    expect(content).toContain('(a: a, b: _):')
    expect(content).toContain('(a: _, b: b):')

    // Check JSDoc is preserved
    expect(content.match(/Adds two numbers/g)?.length).toBeGreaterThan(1)
  })

  test('generates overloads for 3-parameter function', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'test.js',
      `
export type _ = symbol

// @partialize
export interface Calculate<N> {
  (a: N, b: N, c: N): N
}
`,
    )

    await generateForFile(sourceFile)
    const content = sourceFile.getFullText()

    // Check all-holes case
    expect(content).toContain('(a: _, b: _, c: _): Calculate<N>')

    // Check single param cases (adjusted expectations)
    expect(content).toContain('(a: a, b: _, c: _): Calculate1<N>')
    expect(content).toContain('(a: _, b: b, c: _): Calculate1<N>')
    expect(content).toContain('(a: _, b: _, c: c): Calculate1<N>')

    // Check two param cases
    expect(content).toContain('(a: a, b: b, c: _):')
    expect(content).toContain('(a: a, b: _, c: c):')
    expect(content).toContain('(a: _, b: b, c: c):')
  })

  test('skips interfaces without directive', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'test.js',
      `
export interface Normal<T> {
  (value: T): T
}
`,
    )

    await generateForFile(sourceFile)
    const content = sourceFile.getFullText()

    expect(content).not.toContain('@partialize-start')
    expect(content).not.toContain('@partialize-end')
  })

  test('removes existing generated section', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'test.js',
      `
// @partialize
export interface Add<N> {
  (a: N, b: N): N

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ @partialize-start
  // ┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Positional arguments
  // OLD CONTENT
  (old: signature): void
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ @partialize-end
}
`,
    )

    await generateForFile(sourceFile)
    const content = sourceFile.getFullText()

    // Old content should be removed
    expect(content).not.toContain('OLD CONTENT')
    expect(content).not.toContain('(old: signature): void')

    // New content should exist
    expect(content).toContain('(a: _, b: _): Add<N>')
  })

  test('handles custom directive', async () => {
    const project = new Project({ useInMemoryFileSystem: true })
    const sourceFile = project.createSourceFile(
      'test.js',
      `
// @custom-partial
export interface Add<N> {
  (a: N, b: N): N
}
`,
    )

    await generateForFile(sourceFile, { directive: '@custom-partial' })
    const content = sourceFile.getFullText()

    expect(content).toContain('@partialize-start')
    expect(content).toContain('(a: _, b: _): Add<N>')
  })
})
