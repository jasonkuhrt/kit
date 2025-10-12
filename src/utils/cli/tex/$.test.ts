import { Test } from '#test'
import ansis from 'ansis'
import { expect, it } from 'vitest'
import { Tex } from './$.js'

const renderTex = (builder: Tex.Builder | null) => builder && Tex.render(builder)

Test.describe(`text`)
  .inputType<Tex.Builder>()
  .describeInputs(`can render text`, [Tex.Tex().text(`foo`)])
  .test(({ input }) => {
    expect(renderTex(input)).toMatchSnapshot()
  })

Test.describe(`block`)
  .inputType<Tex.Builder>()
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
    Tex.Tex().block({ padding: { top: 2 } }, `foo`),
    Tex.Tex().block({ padding: { bottom: 2 } }, `foo`),
    Tex.Tex().block(($) => $.set({ padding: { left: 2 } }).text(`foo`)),
    Tex.Tex().block(($) =>
      $.set({ padding: { left: 2 } })
        .block(`foo`)
        .block(`bar`)
        .block(`qux`)
    ),
  ])
  .describeInputs(`border`, [
    Tex.Tex().block({ border: { top: `-` } }, `foo`),
    Tex.Tex()
      .block({ border: { right: `|` } }, `foo`)
      .block(($) =>
        $.set({ border: { right: `|` } })
          .block(`alpha`)
          .block(`bravo bravo`)
          .block(`charlie charlie charlie`)
      ),
    Tex.Tex().block({ border: { bottom: `-` } }, `foo`),
    Tex.Tex().block({ border: { left: `|` } }, `foo`),
    Tex.Tex().block({ border: { left: `|`, top: `-` } }, `abc`),
    Tex.Tex().block({ border: { right: `|`, top: `-` } }, `abc`),
    Tex.Tex().block({ border: { left: `|`, bottom: `-` } }, `abc`),
    Tex.Tex().block({ border: { right: `|`, bottom: `-` } }, `abc`),
    Tex.Tex().block({ border: { right: `|`, left: `|`, top: `-`, bottom: `-` } }, `abc`),
    Tex.Tex().block(($) =>
      $.set({ border: { right: `|`, left: `|`, top: `-`, bottom: `-` } }).block(
        { border: { right: `|`, left: `|`, top: `-`, bottom: `-` } },
        `abc`,
      )
    ),
  ])
  .describeInputs(`border > corners`, [
    Tex.Tex().block({ border: { corners: `o`, bottom: `-` } }, `foo`),
    Tex.Tex().block({ border: { corners: `o`, right: `|` } }, `foo`),
    Tex.Tex().block({ border: { corners: `o`, bottom: `-` } }, `foo`),
    Tex.Tex().block({ border: { corners: `o`, left: `|` } }, `foo`),
    Tex.Tex().block({ border: { corners: `o`, top: `-`, right: `|`, bottom: `-`, left: `|` } }, `foo`),
    Tex.Tex().block(($) =>
      $.set({ border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } }).block(
        { border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } },
        `abc`,
      )
    ),
  ])
  .describeInputs(`flow > can flow horizontally`, [
    Tex.Tex({ flow: `horizontal` })
      .block(($) => $.block(`1aaaaa`).block(`1b`).block(`1ccccc`))
      .block(($) => $.block(`2aaaa`).block(`2b`).block(`2ccccc`)),
  ])
  .describeInputs(`width > % > 100%`, [
    Tex.Tex({ maxWidth: 100 })
      .block(`foo bar`)
      .block({ border: { top: `-` }, width: `100%` }, `foo`),
  ])
  .test(({ input }) => {
    expect(renderTex(input)).toMatchSnapshot()
  })

it(`block > flow > ansi does not contribute to column width calculation`, () => {
  const builder = Tex.Tex({ flow: `horizontal` })
    .block(($) => $.block(`1a`).block(ansis.red(`1b`)).block(`1c`))
    .block(($) => $.block(`2aaaa`).block(`2b`).block(`2ccccc`))
  // Skip ANSI snapshots in CI due to environment differences
  if (!process.env[`CI`]) {
    expect(Tex.render(builder)).toMatchSnapshot()
  }
})

it(`block > set > can be at method or builder level`, () => {
  const a = Tex.Tex()
    .block(($) =>
      $.set({ border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } }).block(
        { border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } },
        `abc`,
      )
    )
    .render()
  const b = Tex.Tex()
    .block(
      { border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } },
      ($) => $.block({ border: { corners: `o`, right: `|`, left: `|`, top: `-`, bottom: `-` } }, `abc`),
    )
    .render()
  expect(a).toEqual(b)
})

Test.describe(`list`)
  .inputType<Tex.Builder>()
  .cases(
    [Tex.Tex().list([`foo`, `bar`])],
    [Tex.Tex().list([`foo`, `bar\nbaz\nqux`, `zod`])],
    [Tex.Tex().list({ bullet: { graphic: `-` } }, [`foo`, `zod`])],
    [Tex.Tex().list({ bullet: { graphic: (i) => `(${i})` } }, [`foo`, `zod`])],
    [Tex.Tex().list({ bullet: { graphic: (i) => String(i) } }, `abcdefghijklmnopqrstuvwxyz`.split(``))],
    [
      Tex.Tex().list(
        { bullet: { graphic: (i) => String(i), align: { horizontal: `right` } } },
        `abcdefghijklmnopqrstuvwxyz`.split(``),
      ),
    ],
  )
  .test(({ input }) => {
    expect(renderTex(input)).toMatchSnapshot()
  })

it(`list > null items are ignored`, () => {
  expect(Tex.Tex().list([`foo`, null, `bar`]).render()).toEqual(Tex.Tex().list([`foo`, `bar`]).render())
  expect(Tex.Tex().list(null).render()).toEqual(Tex.Tex().render())
})

it(`list > can be just null items`, () => {
  expect(Tex.Tex().list([null]).render()).toEqual(Tex.Tex().list([]).render())
})

it(`list > builder > item > can render text`, () => {
  expect(Tex.Tex().list(($) => $.item(`x`)).render()).toEqual(Tex.Tex().list([`x`]).render())
})

it(`list > builder > item > can render to nothing`, () => {
  expect(Tex.Tex().list(($) => $.item(null)).render()).toEqual(Tex.Tex().render())
})

it(`list > builder > items > can render text`, () => {
  expect(Tex.Tex().list(($) => $.items(`a`, `b`)).render()).toEqual(Tex.Tex().list([`a`, `b`]).render())
  expect(Tex.Tex().list(($) => $.items([`a`, `b`])).render()).toEqual(Tex.Tex().list([`a`, `b`]).render())
})

it(`list > builder > items > null items are removed`, () => {
  expect(Tex.Tex().list(($) => $.items([`a`, null])).render()).toEqual(Tex.Tex().list([`a`]).render())
})

it(`list > builder > items > can render to nothing`, () => {
  expect(Tex.Tex().list(($) => $.items(null)).render()).toEqual(Tex.Tex().render())
  expect(Tex.Tex().list(($) => $.items([null])).render()).toEqual(Tex.Tex().render())
})

Test.describe(`table`)
  .inputType<Tex.Builder>()
  .describeInputs(`headers`, [
    Tex.Tex().table(($) => $.headers([`alpha`, `bravo`])),
    Tex.Tex().table(($) => $.headers([`alpha`, `bravo`, `charlie`]).row(`a`, `b`)),
    Tex.Tex().block(($) =>
      $.table(($) =>
        $.header(new Tex.Block({ padding: { right: 10 } }, `alpha`))
          .header(new Tex.Block({ border: { bottom: `~` } }, `bravo`))
          .row(`a`, `b`)
      )
    ),
  ])
  .describeInputs(`builder > row`, [
    Tex.Tex().table(($) => $.headers([`alpha`, `bravo`]).row(`a`, `b`)),
    Tex.Tex().table(($) => $.headers([`alpha`, `bravo`]).row(`a`, `b`, `c`)),
    Tex.Tex().table(($) => $.row(`a1`, `b1`).row(null).row(`a3`, `b3`)),
    Tex.Tex().table(($) => $.row(`a1`, `b1`).row(`a2`, null, `c2`)),
  ])
  .describeInputs(`builder > rows`, [
    Tex.Tex().table(($) => $.rows([`a1`, `b1`]).rows(null).rows([`a3`, `b3`])),
    Tex.Tex().table(($) => $.rows([`a1`, `b1`], null, [`a3`, `b3`])),
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
  .describeInputs(`set`, [
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
  ])
  .test(({ input }) => {
    expect(renderTex(input)).toMatchSnapshot()
  })

it(`table > builder > rows > single arg or vargs`, () => {
  expect(Tex.Tex().table(($) => $.rows([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]])).render()).toEqual(
    Tex.Tex().table([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]]).render(),
  )
  expect(Tex.Tex().table(($) => $.rows([`r1c1`, `r1c2`], [`r2c1`, `r2c2`])).render()).toEqual(
    Tex.Tex().table([[`r1c1`, `r1c2`], [`r2c1`, `r2c2`]]).render(),
  )
})
