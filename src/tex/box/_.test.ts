import { Test } from '#test'
import { Box } from './_.js'

const _ = undefined

const box = (fields: Box.Input) =>
  Box.makeFromInput({
    border: Box.Border.styles.single,
    ...fields,
  })

// dprint-ignore
Test
  .on(Box.render)
  .snapshots({ arguments: false })
  .describeInputs('padding > axishand', [
    box({ content: '12345', padding: 2 }),
    box({ content: '12345', padding: [2, 4] }),
    box({ content: '12345', padding: [[1, 2], [3, 4]] }),
    box({ content: '12345', padding: [[1, 2], 4] }),
    box({ content: '12345', padding: [[2, _], [6, _]] }),
  ])
  .describeInputs('margin > axishand', [
    box({ content: '12345', margin: 2 }),
    box({ content: '12345', margin: [2, 4] }),
    box({ content: '12345', margin: [[1, 2], [3, 4]] }),
    box({ content: '12345', margin: [[1, 2], 4] }),
    box({ content: '12345', margin: [[2, _], [6, _]] }),
  ])
  .describeInputs('span > absolute', [
    box({ content: '12345', span: [5] }),
    box({ content: '12345', span: [_, 10] }),
    box({ content: '12345', span: [4, 8] }),
    box({ content: 'Hi\nWorld', span: [5] }),
    box({ content: 'Hi\nWorld', span: [_, 10] }),
    box({ content: 'Hi\nWorld', span: [4, 8] }),
  ])
  .describeInputs('span > string values', [
    box({ content: 'Hi', span: [_, 'header'] }),
    box({ content: 'Hi', span: [_, 'title'] }),
    box({ content: 'Hello World', span: [_, 'sample-width--'] }),
  ])
  .describeInputs('gap > vertical', [
    box({ content: ['A', 'B', 'C'] }),
    box({ content: ['A', 'B', 'C'], gap: 2 }),
    box({ content: ['A', 'B', 'C'], gap: [1] }),
  ])
  .describeInputs('gap > horizontal', [
    box({ content: ['A', 'B', 'C'], orientation: 'horizontal' }),
    box({ content: ['A', 'B', 'C'], orientation: 'horizontal', gap: 3 }),
    box({ content: ['A', 'B', 'C'], orientation: 'horizontal', gap: [2] }),
  ])
  .describeInputs('gap > string values', [
    box({ content: ['A', 'B', 'C'], gap: ['---'] }),
    box({ content: ['A', 'B', 'C'], gap: ['════'] }),
    box({ content: ['A', 'B', 'C'], orientation: 'horizontal', gap: [' | '] }),
    box({ content: ['A', 'B', 'C'], orientation: 'horizontal', gap: [' → '] }),
  ])
  .describeInputs('nested > vertical', [
    box({ content: ['Header', box({ content: 'inner', padding: [_, 2] }), 'Footer'], border: Box.Border.styles.double }),
  ])
  .describeInputs('nested > horizontal', [
    box({ content: [box({ content: 'A' }), box({ content: 'B', border: Box.Border.styles.double })], orientation: 'horizontal' }),
  ])
  .describeInputs('nested > deep', [
    box({
      content: [
        box({
          content: [
            box({ content: 'core', border: Box.Border.styles.ascii }),
          ],
          padding: [1, 0],
        }),
      ],
      padding: [0, 2],
      border: Box.Border.styles.double,
    }),
  ])
  .describeInputs('nested > gap', [
    box({ content: [box({ content: 'X' }), box({ content: 'X', border: Box.Border.styles.double }), box({ content: 'X', border: Box.Border.styles.rounded })], gap: 1 }),
    box({ content: [box({ content: 'X' }), box({ content: 'X', border: Box.Border.styles.double }), box({ content: 'X', border: Box.Border.styles.rounded })], orientation: 'horizontal', gap: 2 }),
  ])
  .describeInputs('nested > gap > string', [
    box({ content: [box({ content: 'X' }), box({ content: 'X', border: Box.Border.styles.double }), box({ content: 'X', border: Box.Border.styles.rounded })], gap: ['─────'] }),
    box({ content: [box({ content: 'X' }), box({ content: 'X', border: Box.Border.styles.double }), box({ content: 'X', border: Box.Border.styles.rounded })], orientation: 'horizontal', gap: [' │ '] }),
  ])
  .describeInputs('horizontal > padding', [
    box({ content: '12345', orientation: 'horizontal', padding: [[2]] }),
    box({ content: '12345', orientation: 'horizontal', padding: [[_, 2]] }),
    box({ content: '12345', orientation: 'horizontal', padding: [_, [1]] }),
    box({ content: '12345', orientation: 'horizontal', padding: [_, [_, 1]] }),
    box({ content: '12345', orientation: 'horizontal', padding: [[2, 2], [1, 1]] }),
  ])
  .describeInputs('horizontal > margin', [
    box({ content: 'Hi', orientation: 'horizontal', margin: [[3]] }),
    box({ content: 'Hi', orientation: 'horizontal', margin: [[_, 3]] }),
    box({ content: 'Hi', orientation: 'horizontal', margin: [_, [1]] }),
    box({ content: 'Hi', orientation: 'horizontal', margin: [_, [_, 1]] }),
  ])
  .describeInputs('margin > string values', [
    box({ content: '12345', margin: [_, ['>>> ']] }),
    box({ content: '12345', margin: [_, [_, ' <<<']] }),
    box({ content: '12345', margin: [[1], ['┃ ']] }),
  ])
  .describeInputs('combined', [
    box({ content: ['A', 'B'], span: [_, 10], gap: 1, padding: [1, 2] }),
    box({ content: 'content', padding: [1, 2], margin: [2, 4] }),
  ])
  .describeInputs('content > styled', [
    box({ content: { text: 'Hello', color: { foreground: 'red' } } }),
    box({ content: { text: 'Bold Text', color: { foreground: 'green' }, bold: true } }),
    box({ content: { text: 'Fancy', color: { foreground: 'magenta' }, bold: true, underline: true } }),
    box({ content: ['Plain text', { text: 'Red text', color: { foreground: 'red' } }, 'More plain', { text: 'Bold blue', color: { foreground: 'blue' }, bold: true }], gap: 1, border: Box.Border.styles.double }),
  ])
  .test()
