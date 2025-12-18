import { Test } from '#test'
import { describe, expect } from 'vitest'
import { stripIndent } from './text.js'

describe('stripIndent', () => {
  // dprint-ignore
  Test.describe('basic dedenting')
    .on(stripIndent)
    .cases(
      [['    line1\n    line2\n    line3'],                           'line1\nline2\nline3'],
      [['    line1\n      line2\n    line3'],                         'line1\n  line2\nline3'],
      [['line1\nline2\nline3'],                                       'line1\nline2\nline3'],
      [['    single'],                                                'single'],
      [['single'],                                                    'single'],
    )
    .test()

  // dprint-ignore
  Test.describe('empty lines')
    .on(stripIndent)
    .cases(
      [['    line1\n\n    line2'],                                    'line1\n\nline2'],
      [['\n    line1\n    line2'],                                    '\nline1\nline2'],
      [['    line1\n    line2\n'],                                    'line1\nline2\n'],
      [['\n\n\n'],                                                     '\n\n\n'],
      [[''],                                                          ''],
    )
    .test()

  // dprint-ignore
  Test.describe('edge cases')
    .on(stripIndent)
    .cases(
      [['    line1\n\t\tline2'],                                      '  line1\nline2'],
      [['no-indent\n    line2'],                                      'no-indent\n    line2'],
      [['    line1\n    \n    line2'],                                'line1\n\nline2'],
    )
    .test()

  // dprint-ignore
  Test.describe('code block example')
    .on(stripIndent)
    .cases(
      [[
        '    d.resolve(1);\n' +
        '      nested();\n' +
        '    d.resolve(2);'
      ], 'd.resolve(1);\n  nested();\nd.resolve(2);'],
    )
    .test(({ result, output }) => {
      expect(result).toBe(output)
    })
})
