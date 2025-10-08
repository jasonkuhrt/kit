import { Test } from '#test'
import { describe, expect } from 'vitest'
import { stripIndent } from './text.js'

describe('stripIndent', () => {
  // dprint-ignore
  Test.describe('basic dedenting')
    .on(stripIndent)
    .cases(
      ['uniform indent',             ['    line1\n    line2\n    line3'],                           'line1\nline2\nline3'],
      ['mixed indent preserves rel', ['    line1\n      line2\n    line3'],                         'line1\n  line2\nline3'],
      ['already dedented',           ['line1\nline2\nline3'],                                       'line1\nline2\nline3'],
      ['single line with indent',    ['    single'],                                                'single'],
      ['single line no indent',      ['single'],                                                    'single'],
    )
    .test()

  // dprint-ignore
  Test.describe('empty lines')
    .on(stripIndent)
    .cases(
      ['empty lines ignored',        ['    line1\n\n    line2'],                                    'line1\n\nline2'],
      ['leading empty lines',        ['\n    line1\n    line2'],                                    '\nline1\nline2'],
      ['trailing empty lines',       ['    line1\n    line2\n'],                                    'line1\nline2\n'],
      ['only empty lines',           ['\n\n\n'],                                                     '\n\n\n'],
      ['empty string',               [''],                                                          ''],
    )
    .test()

  // dprint-ignore
  Test.describe('edge cases')
    .on(stripIndent)
    .cases(
      ['tabs and spaces mixed',      ['    line1\n\t\tline2'],                                      '  line1\nline2'],
      ['zero indent line exists',    ['no-indent\n    line2'],                                      'no-indent\n    line2'],
      ['whitespace only lines',      ['    line1\n    \n    line2'],                                'line1\n\nline2'],
    )
    .test()

  // dprint-ignore
  Test.describe('code block example')
    .on(stripIndent)
    .cases(
      ['function body', [
        '    d.resolve(1);\n' +
        '      nested();\n' +
        '    d.resolve(2);'
      ], 'd.resolve(1);\n  nested();\nd.resolve(2);'],
    )
    .test((actual, expected) => {
      expect(actual).toBe(expected)
    })
})
