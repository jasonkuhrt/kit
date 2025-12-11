import { Test } from '#test'
import { Box } from './_.ts'

const _ = undefined

const box = (fields: Box.Input) =>
  Box.makeFromInput({
    border: Box.Border.styles.single,
    span: [_, 20],
    ...fields,
  })

/** Small box for nested content - uses 50% width by default */
const sbox = (fields: Box.Input) =>
  Box.makeFromInput({
    border: Box.Border.styles.single,
    span: [_, 50n],
    ...fields,
  })

// dprint-ignore
Test
  .on(Box.render)
  .snapshots({ arguments: false })
  .describeInputs('span', [
    box({ content: [box({ span: [_, 100n] })] }),
    box({ content: [box({ span: [_, 100n] })], padding: [_, [10]] }),
    box({ content: [box({ span: [_, 100n] })], border: { ...Box.Border.styles.single, corners: { ...Box.Border.styles.single.corners, topLeft: '--', bottomLeft: '--' }, edges: { ...Box.Border.styles.single.edges, left: '--' } } }),
    box({ content: [box({ span: 50n })], span: [10, 20] }),
    box({ content: [box({ span: [50n, 8] })], span: [10, 20] }),
    box({ content: [box({ span: [4, 50n] })], span: [10, 20] }),
    box({ content: [box({ span: [50n, 100n] })], span: [10, 20] }),
  ])
  .describeInputs('padding', [
    box({ content: [sbox({ padding: [_, [10n]] })] }),
    box({ content: [sbox({ padding: [[20n, 20n]] })] }),
    box({ content: [sbox({ padding: 10n })] }),
    box({ content: [sbox({ padding: [10n, 25n] })] }),
  ])
  .describeInputs('margin', [
    box({ content: [sbox({ margin: [_, [20n]] })] }),
    box({ content: [sbox({ margin: 20n })], span: [10, 20] }),
    box({ content: [sbox({ margin: [20n, 25n] })], span: [10, 20] }),
  ])
  .describeInputs('gap', [
    box({ content: [box({ content: ['A', 'B', 'C'], gap: [10n] })], span: [20] }),
    box({ content: [box({ content: ['A', 'B', 'C'], gap: [5n] })], span: [20] }),
    box({ content: [box({ content: ['A', 'B', 'C'], orientation: 'horizontal', gap: [10n] })], span: [_, 40] }),
  ])
  .test()
