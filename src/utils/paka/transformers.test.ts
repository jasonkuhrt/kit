import { describe, expect, test } from 'vitest'
import { addTwoslashAnnotations } from './transformers.js'

describe('addTwoslashAnnotations', () => {
  test('highlights method name in namespace calls', () => {
    const code = `import { Fn } from '@wollybeard/kit'

Fn.pipe(5, add1, double)`

    const result = addTwoslashAnnotations(code)

    // Should highlight just "pipe", not "Fn.pipe"
    expect(result).toContain('// [!code word:pipe:1]')
    expect(result).toContain('Fn.pipe(5, add1, double)')
  })

  test('highlights method name in multi-level namespace calls', () => {
    const code = `import { Arr } from '@wollybeard/kit'

Arr.Eq.is(
  [1, 2],
  [1, 2]
)`

    const result = addTwoslashAnnotations(code)

    // Should highlight just "is", not "Arr.Eq.is"
    expect(result).toContain('// [!code word:is:1]')
    expect(result).toContain('Arr.Eq.is(')
  })

  test('highlights method name at column 0', () => {
    const code = `import { Test } from '@wollybeard/kit'

Test.on(add).cases([[1, 2], 3]).test()`

    const result = addTwoslashAnnotations(code)

    // Should highlight just "on", not "Test.on"
    expect(result).toContain('// [!code word:on:1]')
    expect(result).toContain('Test.on(add).cases([[1, 2], 3]).test()')
  })

  test('does not add duplicate highlights', () => {
    const code = `import { Arr } from '@wollybeard/kit'

// [!code word:empty]
Arr.empty()`

    const result = addTwoslashAnnotations(code)

    const highlightCount = (result.match(/\[!code word:empty\]/g) || []).length
    expect(highlightCount).toBe(1)
  })

  test('highlights multiple method names on same line', () => {
    const code = `import { Fn } from '@wollybeard/kit'

Fn.pipe(5, Fn.identity)`

    const result = addTwoslashAnnotations(code)

    expect(result).toContain('// [!code word:pipe:1]')
    expect(result).toContain('// [!code word:identity:1]')
  })

  test('does not highlight non-namespace calls', () => {
    const code = `import { Arr } from '@wollybeard/kit'

const x = someFunction()
const y = [1, 2, 3].map(n => n * 2)`

    const result = addTwoslashAnnotations(code)

    expect(result).not.toContain('[!code word:someFunction]')
    // Should NOT highlight "map" on array literals - only namespace calls
    expect(result).not.toContain('[!code word:map]')
  })

  test('normalizes code formatting', () => {
    const code = `import { Arr } from '@wollybeard/kit'

const  items  =  Arr.ensure(value)`

    const result = addTwoslashAnnotations(code)

    // ts-morph formatText normalizes spacing
    expect(result).toContain('const items = Arr.ensure(value)')
    expect(result).toContain('// [!code word:ensure:1]')
  })

  test('handles nested namespace calls', () => {
    const code = `import { Obj } from '@wollybeard/kit'

const result = Obj.map(
  obj,
  Obj.filter(pred)
)`

    const result = addTwoslashAnnotations(code)

    expect(result).toContain('// [!code word:map:1]')
    expect(result).toContain('// [!code word:filter:1]')
  })

  test('handles code with no imports', () => {
    const code = `const x = someNamespace.method()`

    const result = addTwoslashAnnotations(code)

    expect(result).toContain('// [!code word:method:1]')
  })

  test('highlights method names in Arr.ensure calls', () => {
    const code = `import { Arr } from '@wollybeard/kit/arr'

Arr.ensure('hello')  // ['hello']
Arr.ensure(['a', 'b'])  // ['a', 'b']
Arr.ensure(42)  // [42]`

    const result = addTwoslashAnnotations(code)

    // Should highlight "ensure" on the first line only (due to :1 limit)
    expect(result).toContain('// [!code word:ensure:1]')
    expect(result).toContain("Arr.ensure('hello')  // ['hello']")
    expect(result).toContain("Arr.ensure(['a', 'b'])  // ['a', 'b']")
    expect(result).toContain('Arr.ensure(42)  // [42]')
  })
})
