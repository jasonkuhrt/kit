import { Str } from '#str'
import { Test } from '#test'
import ansis from 'ansis'
import { expect, test } from 'vitest'
import { Tex } from './_.js'

Test
  .on(Tex.render)
  .snapshots({ arguments: false })
  .describeInputs(`text`, [
    Tex.Tex().text(`foo`),
  ])
  .describe('block', _ =>
    _
      .describeInputs(`basic`, [
        Tex.Tex().block(`foo`),
        Tex.Tex().block(null),
        Tex.Tex().block(`foo`).block(`bar`),
      ])
      .describeInputs(`builder`, [
        Tex.Tex().block(($) => $.text(`foo`)),
        Tex.Tex().block(() => null),
      ])
      .describeInputs(`padding`, [
        Tex.Tex().block({ padding: { mainStart: 2 } }, `foo`),
        Tex.Tex().block({ padding: { mainEnd: 2 } }, `foo`),
        Tex.Tex().block(($) => $.set({ padding: { crossStart: 2 } }).text(`foo`)),
      ])
      .describeInputs(`padding > string`, [
        Tex.Tex().block({ padding: { crossStart: `> ` } }, `content`),
        Tex.Tex().block({ padding: { crossStart: `| `, crossEnd: ` |` } }, `content`),
      ])
      .describeInputs(`margin`, [
        Tex.Tex().block({ margin: { mainStart: 2 } }, `foo`),
        Tex.Tex().block({ margin: { crossStart: 3 } }, `foo`),
        Tex.Tex().block({ margin: { crossStart: 2 } }, `foo\nbar\nbaz`),
      ])
      .describeInputs(`margin > with border`, [
        Tex.Tex().block({
          margin: { mainStart: 1, crossStart: 3 },
          border: { edges: { top: `-`, right: `|`, bottom: `-`, left: `|` } },
        }, `foo`),
      ])
      .describeInputs(`margin > with padding`, [
        Tex.Tex().block({ margin: { crossStart: 2 }, padding: { crossStart: 1 } }, `foo`),
      ])
      .describeInputs(`margin > with padding and border`, [
        Tex.Tex().block({
          margin: { crossStart: 2, mainStart: 1 },
          border: { edges: { left: `|`, right: `|`, top: `-`, bottom: `-` } },
          padding: { crossStart: 1, crossEnd: 1 },
        }, `content`),
      ])
      .describeInputs(`border`, [
        Tex.Tex().block({ border: { edges: { top: `-` } } }, `foo`),
        Tex.Tex().block({ border: { edges: { left: `|`, right: `|` } } }, `foo`),
        Tex.Tex().block({ border: { edges: { right: `|`, left: `|`, top: `-`, bottom: `-` } } }, `abc`),
      ])
      .describeInputs(`border > corners`, [
        Tex.Tex().block({ border: { edges: { top: `-`, right: `|`, bottom: `-`, left: `|` }, corners: `o` } }, `foo`),
      ])
      .describeInputs(`orientation > horizontal`, [
        Tex.Tex({ orientation: `horizontal` })
          .block(($) => $.block(`1aaaaa`).block(`1b`).block(`1ccccc`))
          .block(($) => $.block(`2aaaa`).block(`2b`).block(`2ccccc`)),
      ])
      .describeInputs(`span`, [
        Tex.Tex({ spanRange: { cross: { max: 100 } } })
          .block(`foo bar`)
          .block({ border: { edges: { top: `-` } }, span: { cross: 100n } }, `foo`),
      ])
      .describeInputs(`style`, [
        // Basic style application
        Tex.Tex().block({ style: ansis.red }, `colored text`),
        Tex.Tex().block({ style: ansis.bold.blue }, `bold blue text`),
        // Style with border (original bug scenario)
        Tex.Tex().block({ style: ansis.dim, border: { edges: { left: `|`, right: `|` } } }, `box`),
        // Nested blocks with different styles (color restoration)
        Tex.Tex().block({ style: ansis.blue }, ($) =>
          $.block({ style: ansis.red }, `inner`).text(` outer`)
        ),
      ]))
  .describeInputs(`text wrapping`, [
    Tex.Tex({ terminalWidth: 20 }).text(`x`.repeat(20)),
    Tex.Tex({ terminalWidth: 20 }).text(ansis.red(`x`.repeat(20))),
    Tex.Tex({ terminalWidth: 20 }).text(`x`.repeat(50)),
    Tex.Tex({ spanRange: { cross: { max: 20 } } }).text(`x`.repeat(50)),
    Tex.Tex().table(($) =>
      $.header(`col1`)
        .header(`col2`)
        .row(`short`, Tex.block({ spanRange: { cross: { max: 20 } } }, `x`.repeat(50)))
    ),
  ])
  .describe(`list`, [
    [Tex.Tex().list([`foo`, `bar`])],
    [Tex.Tex().list([`foo`, `bar\nbaz\nqux`, `zod`])],
    [Tex.Tex().list({ bullet: { graphic: (i) => `(${i})` } }, [`foo`, `zod`])],
    [Tex.Tex().list({ bullet: { graphic: (i) => String(i), align: { horizontal: `right` } } }, [`a`, `b`, `c`])],
  ])
  .describe('table', _ =>
    _
      .describeInputs(`headers`, [
        Tex.Tex().table(($) => $.headers([`alpha`, `bravo`])),
        Tex.Tex().block(($) =>
          $.table(($) =>
            $.header(new Tex.Block({ padding: { crossEnd: 10 } }, `alpha`))
              .header(new Tex.Block({ border: { edges: { bottom: `~` } } }, `bravo`))
              .row(`a`, `b`)
          )
        ),
      ])
      .describeInputs(`rows`, [
        Tex.Tex().table(($) => $.headers([`alpha`, `bravo`]).row(`a`, `b`)),
        Tex.Tex().table(($) => $.headers([`alpha`, `bravo`]).row(`a`, `b`, `c`)),
        Tex.Tex().table(($) => $.row(`a1`, `b1`).row(null).row(`a3`, `b3`)),
      ])
      .describeInputs(`column width`, [
        Tex.Tex().table(($) =>
          $.headers([`alpha`, `bravo`, `charlieeeeeeeeeeeeeeeeeee`, `delta`])
            .row(`a1`, `b1`, `c1`, `d1`)
            .row(`a222222222222222`, `b2`, `c2`, `d2`)
            .row(`a3`, `b333333333333333333`, `c3`, `d3`)
        ),
        Tex.Tex().table(($) =>
          $.headers([`alpha`, `bravo`, `charlieeeeeeeeeeeeeeeeeee`, `delta`])
            .row(`a1`, `b1`, `c1`, `d1`)
            .row(`a222222222222222\na2`, `b2`, `c2`, `d2`)
            .row(`a3`, `b333333333333333333`, `c3`, `d3`)
        ),
        Tex.Tex().table(($) => $.row(`alpha\napple\nankle`, `beta\nbanana`)),
      ])
      .describeInputs(`gap`, [
        Tex.Tex().table(($) =>
          $.set({ gap: { main: ` `, cross: ` | ` } })
            .headers([`alpha`, `bravo`, `charlie`])
            .row(`a`, `b`)
        ),
        Tex.Tex().table(($) =>
          $.set({ gap: { main: `-`, cross: ` ` } })
            .headers([`alpha`, `bravo`, `charlie`])
            .row(`a`, `b`)
        ),
      ])
      .describeInputs(`gap > intersection`, [
        Tex.Tex().table(($) =>
          $.set({ gap: { main: `-`, cross: ` | `, intersection: `+` } })
            .headers([`alpha`, `bravo`, `charlie`])
            .row(`a`, `b`)
        ),
        Tex.Tex().table(($) =>
          $.set({ gap: { main: `─`, cross: ` │ `, intersection: `┼` } })
            .headers([`col1`, `col2`])
            .row(`row1`, `row2`)
        ),
      ])
      .describeInputs(`style`, [
        // Table with styled cells
        Tex.Tex().table(($) =>
          $.headers([`Name`, `Value`])
            .row(Tex.block({ style: ansis.bold }, `key`), `value`)
        ),
        // Table inside styled block
        Tex.Tex().block({ style: ansis.dim }, ($) =>
          $.table(($) => $.row(`a`, `b`).row(`c`, `d`))
        ),
      ]))
  .describeInputs(`horizontal padding`, [
    Tex.Tex({ orientation: `horizontal` })
      .block({ padding: { crossEnd: 2 } }, `x`)
      .block(`x`),
  ])
  .test()

// ========================================
// Behavior Tests - Non-Visual
// ========================================

// dprint-ignore
Test
  .describe(`output symmetry between sub-chain / config APIs`)
  .inputType<[Tex.Builder, Tex.Builder]>()
  .describeInputs('settings', [
    [Tex.Tex().block(($) => $.set({ padding: { mainStart: 2 } }).block(`foo`)),  Tex.Tex().block({ padding: { mainStart: 2 } }, `foo`)],
  ])
  .describeInputs('list', [
    [Tex.Tex().list(($) => $.item(`x`)),                          Tex.Tex().list([`x`])],
    [Tex.Tex().list(($) => $.items(`a`, `b`)),                    Tex.Tex().list([`a`, `b`])],
    [Tex.Tex().list(($) => $.item(`a`).item(`b`)),                Tex.Tex().list([`a`, `b`])],
    [Tex.Tex().list(($) => $.items(`a`, `b`, `c`, `d`)),          Tex.Tex().list([`a`, `b`, `c`, `d`])],
    [Tex.Tex().list(($) => $.item(`x\ny`)),                       Tex.Tex().list([`x\ny`])],
  ])
  .describeInputs('null handling', [
    [Tex.Tex().list([`foo`, null, `bar`]),                        Tex.Tex().list([`foo`, `bar`])],
    [Tex.Tex().list(null),                                        Tex.Tex()],
    [Tex.Tex().list([null]),                                      Tex.Tex().list([])],
  ])
  .describeInputs('table', [
    [Tex.Tex().table(($) => $.rows([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]])),  Tex.Tex().table([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]])],
    [Tex.Tex().table(($) => $.rows([`r1c1`, `r1c2`], [`r2c1`, `r2c2`])),    Tex.Tex().table([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]])],
  ])
  .test(({ input }) => {
    expect(Tex.render(input[0])).toEqual(Tex.render(input[1]))
  })

test(`block > orientation > horizontal > ansi`, () => {
  const builder = Tex.Tex({ orientation: `horizontal` })
    .block(`a`)
    .block(ansis.red(`b`))
    .block(`c`)
  // Skip ANSI snapshots in CI due to environment differences
  if (!process.env[`CI`]) {
    expect(Tex.render(builder)).toMatchSnapshot()
  }
})

Test.describe(`spanRange parameter`)
  .inputType<{ builder: Tex.Builder; check: (b: Tex.Builder) => void }>()
  .cases(
    [
      {
        builder: Tex.Tex({ spanRange: { cross: { min: 8 } } }),
        check: (b) => {
          const maxWidth = (b as any)._.node.parameters.spanRange?.cross?.max
          expect(maxWidth).toBeDefined()
          expect(typeof maxWidth).toBe(`number`)
          expect(maxWidth).toBeGreaterThan(0)
        },
      },
    ],
    [
      {
        builder: Tex.Tex({ terminalWidth: 50, spanRange: { cross: { max: 100 } } }),
        check: (b) => {
          expect((b as any)._.node.parameters.spanRange?.cross?.max).toBe(100)
        },
      },
    ],
  )
  .test(({ input }) => {
    input.check(input.builder)
  })

test(`table inside padded block respects terminalWidth constraint`, () => {
  const terminalWidth = 60
  const padding = 10

  // Use wide content that forces table to use available width
  const builder = Tex.Tex({ terminalWidth })
    .block(
      { padding: { crossStart: padding } },
      ($) =>
        $.table(($) =>
          $.headers([`ParameterName`, `TypeAndDescription`, `DefaultValue`])
            .row(`verboseLogging`, `Enable detailed logging during command execution process`, `false`)
            .row(`configFilePath`, `Path to the configuration file to load settings from`, `REQUIRED`)
        ),
    )

  const output = Tex.render(builder)
  const maxLineWidth = Math.max(...Str.Text.lines(output).map(Str.Visual.width))

  // Output should never exceed terminalWidth
  expect(maxLineWidth).toBeLessThanOrEqual(terminalWidth)
})

test(`root builder uses COLUMNS env var for default terminalWidth`, () => {
  const original = process.env[`COLUMNS`]
  process.env[`COLUMNS`] = `50`

  // Create builder without explicit terminalWidth - should use COLUMNS
  const builder = Tex.Tex().text(`x`.repeat(100))
  const output = Tex.render(builder)
  const maxWidth = Math.max(...Str.Text.lines(output).map(Str.Visual.width))

  process.env[`COLUMNS`] = original
  expect(maxWidth).toBeLessThanOrEqual(50)
})

test(`table inside margin block respects terminalWidth constraint`, () => {
  const terminalWidth = 60
  const margin = 10

  const builder = Tex.Tex({ terminalWidth })
    .block(
      { margin: { crossStart: margin } },
      ($) =>
        $.table(($) =>
          $.headers([`ParameterName`, `TypeAndDescription`, `DefaultValue`])
            .row(`verboseLogging`, `Enable detailed logging during command execution process`, `false`)
            .row(`configFilePath`, `Path to the configuration file to load settings from`, `REQUIRED`)
        ),
    )

  const output = Tex.render(builder)
  const maxWidth = Math.max(...Str.Text.lines(output).map(Str.Visual.width))
  expect(maxWidth).toBeLessThanOrEqual(terminalWidth)
})

test(`block with empty string creates valid block, not null`, () => {
  const result = Tex.block({}, ``)
  expect(result).not.toBeNull()
  expect(result).toBeInstanceOf(Tex.Block)
})

test(`block with empty string renders correctly`, () => {
  const result = Tex.block({}, ``)!.render({
    maxWidth: 80,
    index: { total: 1, isLast: true, isFirst: true, position: 0 },
  })
  expect(result.value).toBe(``)
})

test(`table with empty string cell maintains column alignment`, () => {
  const builder = Tex.Tex().table(($) =>
    $.row(`a`, `b`, `c`)
      .row(`x`, ``, `z`) // Empty string should NOT be filtered out
      .row(`1`, `2`, `3`)
  )
  const output = Tex.render(builder)
  const lines = output.split(`\n`)
  // All rows should have 3 columns - verify middle row isn't collapsed
  expect(lines.length).toBeGreaterThanOrEqual(3)
  // The 'x' and 'z' should be on the same line with proper spacing
  expect(lines.some(line => line.includes(`x`) && line.includes(`z`))).toBe(true)
})

test(`table inside bordered block respects terminalWidth constraint`, () => {
  const terminalWidth = 60

  const builder = Tex.Tex({ terminalWidth })
    .block(
      { border: { edges: { left: `|`, right: `|` } } },
      ($) =>
        $.table(($) =>
          $.headers([`ParameterName`, `TypeAndDescription`, `DefaultValue`])
            .row(`verboseLogging`, `Enable detailed logging during command execution process`, `false`)
            .row(`configFilePath`, `Path to the configuration file to load settings from`, `REQUIRED`)
        ),
    )

  const output = Tex.render(builder)
  const maxWidth = Math.max(...Str.Text.lines(output).map(Str.Visual.width))
  expect(maxWidth).toBeLessThanOrEqual(terminalWidth)
})
