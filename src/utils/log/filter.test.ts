import { Test } from '#test'
import { describe, expect, it } from 'vitest'
import * as Filter from './filter.js'
import type { LogRecord } from './logger.js'

const rec = (data?: Partial<Pick<LogRecord, 'level' | 'path'>>): LogRecord => {
  return {
    level: 1,
    ...data,
    event: `foo`,
  }
}

const defaults: Filter.Defaults = { level: { comp: `gte`, value: `trace` } }

const parse = (pattern: string) => {
  return Filter.parse(defaults, pattern)
}

describe(`parse`, () => {
  // Root
  it(`.`, () => {
    expect(parse(`.`)).toMatchSnapshot()
  })

  // Wildcards
  it(`*`, () => {
    expect(parse(`*`)).toMatchSnapshot()
  })
  it(`*@*`, () => {
    expect(parse(`*@*`)).toMatchSnapshot()
  })
  it(`*@1`, () => {
    expect(parse(`*@1`)).toMatchSnapshot()
  })
  it(`app:*`, () => {
    expect(parse(`app:*`)).toMatchSnapshot()
  })
  it(`app@*`, () => {
    expect(parse(`app@*`)).toMatchSnapshot()
  })
  it(`app:*@*`, () => {
    expect(parse(`app:*@*`)).toMatchSnapshot()
  })
  it(`app:*@1`, () => {
    expect(parse(`app:*@*`)).toMatchSnapshot()
  })

  // Wildcards exclusive
  it(`app::*`, () => {
    expect(parse(`app::*`)).toMatchSnapshot()
  })

  // Negate
  it(`!a`, () => {
    expect(parse(`!a`)).toMatchSnapshot()
  })

  // Paths
  it(`a`, () => {
    expect(parse(`a`)).toMatchSnapshot()
  })
  it(`a:b`, () => {
    expect(parse(`a:b`)).toMatchSnapshot()
  })
  it(`app1`, () => {
    expect(parse(`app1`)).toMatchSnapshot()
  })

  // Lists
  it(`a,b`, () => {
    expect(parse(`a,b`)).toMatchSnapshot()
  })
  it(`,,a,b`, () => {
    expect(parse(`,,a,b`)).toMatchSnapshot()
  })
  it(`, ,  a,`, () => {
    expect(parse(`, ,  a`)).toMatchSnapshot()
  })

  // Wildcard/levels + paths
  it(`a:b:*`, () => {
    expect(parse(`a:b:*`)).toMatchSnapshot()
  })
  it(`a:b:*@info`, () => {
    expect(parse(`a:b:*@1`)).toMatchSnapshot()
  })

  // Root integration
  it(`.:*`, () => {
    expect(parse(`.:*`)).toMatchSnapshot()
  })
  it(`.::*`, () => {
    expect(parse(`.::*`)).toMatchSnapshot()
  })
  it(`.@*`, () => {
    expect(parse(`.@*`)).toMatchSnapshot()
  })
  it(`.:*@1`, () => {
    expect(parse(`.:*@1`)).toMatchSnapshot()
  })
  it(`.:a`, () => {
    expect(parse(`.:a`)).toMatchSnapshot()
  })
  it(`.:a:*`, () => {
    expect(parse(`.:a:*`)).toMatchSnapshot()
  })
})

// dprint-ignore
Test.describe('parse > levels')
  .inputType<string>()
  .outputType<Filter.Parsed['level']>()
  .cases(
    ['a@trace', { comp: `eq`, value: `trace` }],
    ['a@debug', { comp: `eq`, value: `debug` }],
    ['a@info',  { comp: `eq`, value: `info` }],
    ['a@warn',  { comp: `eq`, value: `warn` }],
    ['a@error', { comp: `eq`, value: `error` }],
    ['a@fatal', { comp: `eq`, value: `fatal` }],
    ['a@1',     { comp: `eq`, value: `trace` }],
    ['a@2',     { comp: `eq`, value: `debug` }],
    ['a@3',     { comp: `eq`, value: `info` }],
    ['a@4',     { comp: `eq`, value: `warn` }],
    ['a@5',     { comp: `eq`, value: `error` }],
    ['a@6',     { comp: `eq`, value: `fatal` }],
    ['a@6-',    { comp: `lte`, value: `fatal` }],
    ['a@6+',    { comp: `gte`, value: `fatal` }],
    ['a@*',     { comp: `eq`, value: `*` }],
  )
  .test(({ input, output }) => {
    const result = parse(input)[0]!
    if (result instanceof Error) throw result
    expect(result.level).toEqual(output)
  })

describe(`parse syntax errors`, () => {
  // Empty patterns
  it(`<whitespace>`, () => {
    expect(parse(` `)).toMatchSnapshot()
  })
  it(`<empty>`, () => {
    expect(parse(``)).toMatchSnapshot()
  })
  it(`,`, () => {
    expect(parse(`,`)).toMatchSnapshot()
  })

  // Other
  it(`**`, () => {
    expect(parse(`**`)).toMatchSnapshot()
  })
  it(`*a`, () => {
    expect(parse(`*a`)).toMatchSnapshot()
  })
  it(`*+`, () => {
    expect(parse(`*+`)).toMatchSnapshot()
  })
  it(`a@`, () => {
    expect(parse(`a@`)).toMatchSnapshot()
  })
  it(`@`, () => {
    expect(parse(`@`)).toMatchSnapshot()
  })
  it(`a@*-`, () => {
    expect(parse(`a@*-`)).toMatchSnapshot()
  })
  it(`a@*+`, () => {
    expect(parse(`a@*+`)).toMatchSnapshot()
  })
  it(`a@+*`, () => {
    expect(parse(`a@+*`)).toMatchSnapshot()
  })
  it(`a+`, () => {
    expect(parse(`a+`)).toMatchSnapshot()
  })
  it(`!`, () => {
    expect(parse(`!`)).toMatchSnapshot()
  })
  it(`a!`, () => {
    expect(parse(`a!`)).toMatchSnapshot()
  })
  it(`a@*!`, () => {
    expect(parse(`a@*!`)).toMatchSnapshot()
  })
  it(`@1`, () => {
    expect(parse(`@1`)).toMatchSnapshot()
  })
  it(`a:@1`, () => {
    expect(parse(`a:@1`)).toMatchSnapshot()
  })
  it(`..`, () => {
    expect(parse(`..`)).toMatchSnapshot()
  })
  it(`.a.`, () => {
    expect(parse(`.a.`)).toMatchSnapshot()
  })
  it(`a.`, () => {
    expect(parse(`a.`)).toMatchSnapshot()
  })
})

type TestCase = [Filter.Defaults, string, LogRecord, boolean]

// dprint-ignore
Test.describe('test')
  .inputType<TestCase>()
  .outputType<boolean>()
  .cases(
    // Wildcard
    [[defaults, `*`,    rec(),                         true]],
    [[defaults, `:*`,   rec(),                         false]],
    [[defaults, `*@*`,  rec(),                         true]],
    // Negate
    [[defaults, `!foo`, rec({ path: [`foo`] }),        false]],
    [[defaults, `!foo`, rec({ path: [`foo`, `bar`] }), true]],
    [[defaults, `!foo`, rec({ path: [`a`] }),          true]],
    // Removal
    [[defaults, `a,!a`,      rec({ path: [`a`] }),                false]],
    [[defaults, `a,!a,a`,    rec({ path: [`a`] }),                true]],
    [[defaults, `*@2+,!app`, rec({ path: [`foo`], level: 1 }),   false]],
    // Negate + wildcard
    [[defaults, `!foo:*`,    rec({ path: [`foo`] }),              false]],
    [[defaults, `!foo::*`,   rec({ path: [`foo`] }),              true]],
    [[defaults, `!foo::*`,   rec({ path: [`foo`, `bar`] }),       false]],
    [[defaults, `app,!app@4`, rec({ path: [`app`], level: 3 }),  true]],
    [[defaults, `app,!app@4`, rec({ path: [`app`], level: 4 }),  false]],
    // Level
    [[defaults, `*@2`,               rec({ level: 1 }),                    false]],
    [[defaults, `*@fatal`,           rec({ level: 6 }),                    true]],
    [[defaults, `*@fatal-`,          rec({ level: 1 }),                    true]],
    [[defaults, `*@warn+,app@debug+`, rec({ level: 4 }),                  true]],
    [[defaults, `*@warn+,app@debug+`, rec({ level: 3 }),                  false]],
    [[defaults, `*@warn+,app@debug+`, rec({ level: 3, path: [`app`] }),   true]],
    // Path
    [[defaults, `foo`, rec({ path: [`bar`] }), false]],
    // Path + wildcard
    [[defaults, `foo::*`, rec({ path: [`foo`, `bar`] }), true]],
    [[defaults, `foo::*`, rec({ path: [`foo`] }),        false]],
    [[defaults, `foo:*`,  rec({ path: [`foo`] }),        true]],
    // List
    [[defaults, `foo,bar`, rec({ path: [`bar`] }), true]],
    // Filtered out by later pattern
    [[defaults, `foo:*,!foo:bar`, rec({ path: [`foo`, `bar`] }), false]],
    // Defaults
    [[{ level: { comp: `eq`, value: `debug` } }, `*`,   rec({ level: 1 }),                  false]],
    [[{ level: { comp: `eq`, value: `debug` } }, `foo`, rec({ path: [`foo`], level: 3 }),   false]],
    [[{ level: { comp: `eq`, value: `debug` } }, `foo`, rec({ path: [`foo`], level: 2 }),   true]],
  )
  .test(({ input }) => {
    const [defaults_, pattern, rec_, expected] = input
    const result = Filter.test(
      Filter.parse(defaults_, pattern).map((value) => {
        if (value instanceof Error) throw value
        return value
      }),
      rec_,
    )
    expect(result).toBe(expected)
  })
