import { Test } from '#test'
import { code, link, table } from './md.js'

// Test markdown code wrapping
// dprint-ignore
Test.describe('Md.code > basic wrapping')
  .on(code)
  .cases(
    [['hello'],                    '`hello`'],
    [['world'],                    '`world`'],
    [['Array<T>'],                 '`Array<T>`'],
    [['foo.bar()'],                '`foo.bar()`'],
    [[''],                         '``'],
  )
  .test()

// Test markdown link generation
// dprint-ignore
Test.describe('Md.link > with text')
  .on(link)
  .cases(
    [['https://example.com', 'Example'],             '[Example](https://example.com)'],
    [['https://docs.rs', 'Documentation'],           '[Documentation](https://docs.rs)'],
    [['#anchor', 'Jump to section'],                 '[Jump to section](#anchor)'],
  )
  .test()

// dprint-ignore
Test.describe('Md.link > without text (url as text)')
  .on(link)
  .cases(
    [['https://example.com'],                        '[https://example.com](https://example.com)'],
    [['https://github.com'],                         '[https://github.com](https://github.com)'],
    [['#section'],                                   '[#section](#section)'],
  )
  .test()

// Test markdown table generation
// dprint-ignore
Test.describe('Md.table > basic table')
  .on(table)
  .cases(
    [[{ 'Name': 'Alice', 'Age': '30' }],
     '| | |\n| - | - |\n| **Name** | Alice |\n| **Age** | 30 |'],

    [[{ 'Type': 'String', 'Required': 'Yes' }],
     '| | |\n| - | - |\n| **Type** | String |\n| **Required** | Yes |'],
  )
  .test()

// dprint-ignore
Test.describe('Md.table > with undefined/null values (filtered out)')
  .on(table)
  .cases(
    [[{ 'Name': 'Bob', 'Age': undefined, 'City': 'NYC' }],
     '| | |\n| - | - |\n| **Name** | Bob |\n| **City** | NYC |'],

    [[{ 'A': 'value', 'B': null, 'C': 'another' }],
     '| | |\n| - | - |\n| **A** | value |\n| **C** | another |'],
  )
  .test()

// dprint-ignore
Test.describe('Md.table > empty table (all filtered)')
  .on(table)
  .cases(
    [[{ 'A': undefined, 'B': null }],                ''],
    [[{}],                                           ''],
  )
  .test()

// dprint-ignore
Test.describe('Md.table > single entry')
  .on(table)
  .cases(
    [[{ 'Status': 'Active' }],                       '| | |\n| - | - |\n| **Status** | Active |'],
  )
  .test()
