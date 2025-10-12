import { describe, expect, test } from 'vitest'
import * as Tpl from './tpl.js'

describe(`is`, () => {
  test(`returns true for TemplateStringsArray`, () => {
    const result = ((strings: TemplateStringsArray, ..._values: unknown[]) => {
      return Tpl.is(strings)
    })`test ${42}`

    expect(result).toBe(true)
  })

  test(`returns false for regular arrays`, () => {
    expect(Tpl.is([])).toBe(false)
    expect(Tpl.is([`a`, `b`])).toBe(false)
    expect(Tpl.is([`test`, 42])).toBe(false)
  })

  test(`returns false for non-arrays`, () => {
    expect(Tpl.is(null)).toBe(false)
    expect(Tpl.is(undefined)).toBe(false)
    expect(Tpl.is(42)).toBe(false)
    expect(Tpl.is(`string`)).toBe(false)
    expect(Tpl.is({ raw: [`test`] })).toBe(false)
  })

  test(`checks for raw property on array itself, not first element`, () => {
    // Regression test for bug fix: was checking value[0] instead of value
    const arrayWithRawInFirstElement = [{ raw: [`test`] }]
    expect(Tpl.is(arrayWithRawInFirstElement)).toBe(false)

    // Only actual TemplateStringsArray should pass
    const actualTemplateStringsArray = ((strings: TemplateStringsArray) => strings)`test`
    expect(Tpl.is(actualTemplateStringsArray)).toBe(true)
  })
})

describe(`isCallInput`, () => {
  test(`returns true for tagged template literal arguments`, () => {
    const result = ((...args: unknown[]) => {
      return Tpl.isCallInput(args)
    })`test ${42} ${`foo`}`

    expect(result).toBe(true)
  })

  test(`returns false for regular function arguments`, () => {
    const result = ((...args: unknown[]) => {
      return Tpl.isCallInput(args)
    })(`test`, 42, `foo`)

    expect(result).toBe(false)
  })

  test(`returns false for non-arrays`, () => {
    expect(Tpl.isCallInput(null)).toBe(false)
    expect(Tpl.isCallInput(undefined)).toBe(false)
    expect(Tpl.isCallInput(42)).toBe(false)
  })
})

describe(`normalizeCall`, () => {
  test(`separates template from interpolated values`, () => {
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Hello ${`World`}!`

    const result = Tpl.normalizeCall(input)

    expect(result.template).toEqual(input[0])
    expect(result.args).toEqual([`World`])
  })

  test(`handles multiple interpolated values`, () => {
    const name = `Alice`
    const age = 30
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Name: ${name}, Age: ${age}`

    const result = Tpl.normalizeCall(input)

    expect(result.args).toEqual([name, age])
  })

  test(`handles no interpolated values`, () => {
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Just plain text`

    const result = Tpl.normalizeCall(input)

    expect(result.args).toEqual([])
  })
})

describe(`render`, () => {
  test(`renders template with string interpolation`, () => {
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Hello ${`World`}!`

    expect(Tpl.render(input)).toBe(`Hello World!`)
  })

  test(`renders template with number interpolation`, () => {
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Count: ${42}`

    expect(Tpl.render(input)).toBe(`Count: 42`)
  })

  test(`renders template with multiple interpolations`, () => {
    const typeName = `Query`
    const kind = `OBJECT`
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`'${typeName}': { kind: '${kind}'; name: '${typeName}'; }`

    expect(Tpl.render(input)).toBe(`'Query': { kind: 'OBJECT'; name: 'Query'; }`)
  })

  test(`coerces non-string values to strings`, () => {
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Values: ${null}, ${undefined}, ${true}, ${[1, 2]}`

    expect(Tpl.render(input)).toBe(`Values: null, undefined, true, 1,2`)
  })
})

describe(`renderWith`, () => {
  test(`renders with custom value mapper`, () => {
    const renderJson = Tpl.renderWith((v) => JSON.stringify(v))
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Value: ${{ foo: `bar` }}`

    expect(renderJson(input)).toBe(`Value: {"foo":"bar"}`)
  })

  test(`renders with custom prefix mapper`, () => {
    const renderPrefixed = Tpl.renderWith((v) => `[${v}]`)
    const input = ((...args: unknown[]) => {
      return args as Tpl.CallInput
    })`Items: ${1}, ${2}, ${3}`

    expect(renderPrefixed(input)).toBe(`Items: [1], [2], [3]`)
  })
})

describe(`passthrough`, () => {
  test(`returns string as-is with interpolated values`, () => {
    const name = `World`
    const result = Tpl.passthrough`Hello ${name}!`
    expect(result).toBe(`Hello World!`)
  })

  test(`works with multiple interpolations`, () => {
    const a = 1
    const b = 2
    const result = Tpl.passthrough`Sum: ${a} + ${b} = ${a + b}`
    expect(result).toBe(`Sum: 1 + 2 = 3`)
  })

  test(`preserves whitespace and newlines`, () => {
    const value = 42
    const result = Tpl.passthrough`
      export const foo = ${value}
    `
    expect(result).toBe(`
      export const foo = 42
    `)
  })

  test(`works as aliased function`, () => {
    const ts = Tpl.passthrough
    const code = ts`const x = ${100}`
    expect(code).toBe(`const x = 100`)
  })
})

describe(`highlight`, () => {
  test(`returns interpolated string with destructured tag`, () => {
    const { ts } = Tpl.highlight
    expect(ts`const x = ${100}`).toBe(`const x = 100`)
  })

  test(`all language tags work identically`, () => {
    const { ts, html, sql } = Tpl.highlight
    expect(ts`test`).toBe(`test`)
    expect(html`test`).toBe(`test`)
    expect(sql`test`).toBe(`test`)
  })
})
