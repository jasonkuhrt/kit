import { Test } from '#test'
import * as Tpl from './tpl.js'

// dprint-ignore
Test.on(Tpl.is)
  .cases(
    [[`empty array`,            []],                     false],
    [[`array of strings`,       [`a`, `b`]],             false],
    [[`mixed array`,            [`test`, 42]],           false],
    [[`null`,                   null],                   false],
    [[`undefined`,              undefined],              false],
    [[`number`,                 42],                     false],
    [[`string`,                 `string`],               false],
    [[`object with raw`,        { raw: [`test`] }],      false],
    [[`array with raw inside`,  [{ raw: [`test`] }]],    false],
  )
  .test()

// dprint-ignore
Test.on(Tpl.isCallInput)
  .cases(
    [[`null`,      null],      false],
    [[`undefined`, undefined], false],
    [[`number`,    42],        false],
  )
  .test()

// dprint-ignore
Test.describe(`passthrough`)
  .inputType<string>()
  .outputType<string>()
  .cases(
    [[`basic`,             Tpl.passthrough`Hello ${`World`}!`],                                `Hello World!`],
    [[`multiple values`,   Tpl.passthrough`Sum: ${1} + ${2} = ${3}`],                          `Sum: 1 + 2 = 3`],
    [[`preserves space`,   Tpl.passthrough`\n      export const foo = ${42}\n    `],           `\n      export const foo = 42\n    `],
  )
  .test()

// dprint-ignore
Test.describe(`dedent`)
  .inputType<string>()
  .outputType<string>()
  .cases(
    [[`removes common indentation`,          Tpl.dedent`\n      line 1\n      line 2\n        line 3\n    `],                 `line 1\nline 2\n  line 3`],
    [[`trims blank lines`,                   Tpl.dedent`\n\n      content\n\n    `],                                         `content`],
    [[`handles interpolation`,               Tpl.dedent`\n      Hello ${`world`}\n      How are you?\n    `],                 `Hello world\nHow are you?`],
    [[`auto-indents multi-line values`,      Tpl.dedent`\n      outer:\n        ${`line1\nline2\nline3`}\n    `],           `outer:\n  line1\n  line2\n  line3`],
    [[`preserves escape sequences`,          Tpl.dedent`\n      C:\\\\Users\\\\name\\\\Documents\n    `],                    `C:\\\\Users\\\\name\\\\Documents`],
    [[`nested indentation`,                  Tpl.dedent`\n      function greet() {\n        if (true) {\n          console.log('hello')\n        }\n      }\n    `], `function greet() {\n  if (true) {\n    console.log('hello')\n  }\n}`],
    [[`empty`,                               Tpl.dedent``],                                                                   ``],
    [[`only whitespace`,                     Tpl.dedent`\n\n    `],                                                           ``],
    [[`preserves blank lines`,               Tpl.dedent`\n      line 1\n\n      line 3\n    `],                             `line 1\n\nline 3`],
    [[`multi-line value indentation`,        Tpl.dedent`\n      start\n        indented: ${`a\nb\nc`}\n      end\n    `],    `start\n  indented: a\n  b\n  c\nend`],
  )
  .test()

// dprint-ignore
Test.describe(`highlight`)
  .inputType<string>()
  .outputType<string>()
  .cases(
    [[`ts`,    Tpl.highlight.ts`const x = ${100}`],    `const x = 100`],
    [[`html`,  Tpl.highlight.html`test`],              `test`],
    [[`sql`,   Tpl.highlight.sql`test`],               `test`],
  )
  .test()
