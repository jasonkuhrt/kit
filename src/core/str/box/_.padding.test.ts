import { Test } from '#test'
import { Box } from './_.ts'

const _ = undefined

const box = (fields: Box.Input) =>
  Box.makeFromInput({
    content: '12345',
    border: Box.Border.styles.single,
    ...fields,
  })

// dprint-ignore
Test
  .on(Box.render)
  .snapshots({ arguments: false })
  .describeInputs('single side', [
    box({ padding: [[1]] }),
    box({ padding: [[0, 1]] }),
    box({ padding: [_, [2]] }),
    box({ padding: [_, [_, 2]] }),
  ])
  .describeInputs('multiple sides', [
    box({ padding: [1, 0] }),
    box({ padding: [0, 2] }),
    box({ padding: [1, 2] }),
  ])
  .describeInputs('multi-line text', [
    box({ content: 'Hello\nWorld', padding: [0, [2]] }),
    box({ content: 'Hello\nWorld', padding: [1, 0] }),
    box({ content: 'Hello\nWorld', padding: [0, 2] }),
  ])
  .describeInputs('zero padding', [
    box({ padding: 0 }),
  ])
  .describeInputs('empty text', [
    box({ content: '', padding: [[1], [2]] }),
  ])
  .describeInputs('string values', [
    box({ padding: [['>> ']] }),
    box({ content: 'Hello\nWorld', padding: [['→ ']] }),
    box({ padding: [0, ['| ']] }),
    box({ content: 'Hello\nWorld', padding: [0, ['│ ']] }),
    box({ padding: [0, ['[ ', ' ]']] }),
    box({ padding: [[1], ['» ']] }),
  ])
  .test()
