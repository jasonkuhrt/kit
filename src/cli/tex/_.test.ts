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
      .describeInputs(`separators`, [
        Tex.Tex().table(($) =>
          $.set({ separators: { row: ` ` } })
            .headers([`alpha`, `bravo`, `charlie`])
            .row(`a`, `b`)
        ),
        Tex.Tex().table(($) =>
          $.set({ separators: { column: ` ` } })
            .headers([`alpha`, `bravo`, `charlie`])
            .row(`a`, `b`)
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
