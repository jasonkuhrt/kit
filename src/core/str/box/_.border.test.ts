import { Test } from '#test'
import { Box } from './_.ts'

const box = (fields: Box.Input) =>
  Box.makeFromInput({
    content: '12345',
    ...fields,
  })

// dprint-ignore
Test
  .on(Box.render)
  .snapshots({ arguments: false })
  .describeInputs('styles', [
    box({ border: { style: 'single' } }),
    box({ border: { style: 'double' } }),
    box({ border: { style: 'rounded' } }),
    box({ border: { style: 'bold' } }),
    box({ border: { style: 'ascii' } }),
  ])
  .describeInputs('multi-line', [
    box({ content: 'Hello\nWorld', border: { style: 'single' } }),
    box({ content: 'Line 1\nLine 2\nLine 3', border: { style: 'rounded' } }),
    box({ content: 'Hi\nHello\nH', border: { style: 'single' } }),
  ])
  .describeInputs('empty', [
    box({ content: '', border: { style: 'ascii' } }),
  ])
  .describeInputs('partial > single edge', [
    box({ border: { edges: { top: '-' } } }),
    box({ border: { edges: { bottom: '-' } } }),
    box({ border: { edges: { left: '|' } } }),
    box({ border: { edges: { right: '|' } } }),
  ])
  .describeInputs('partial > two edges', [
    box({ border: { edges: { top: '-', bottom: '-' } } }),
    box({ border: { edges: { left: '|', right: '|' } } }),
    box({ border: { edges: { top: '-', left: '|' } } }),
  ])
  .describeInputs('partial > multi-line', [
    box({ content: 'Hello\nWorld', border: { edges: { left: '|' } } }),
    box({ content: 'Hello\nWorld', border: { edges: { top: '=', bottom: '=' } } }),
  ])
  .describeInputs('corners > preset', [
    box({ border: { style: 'single', corners: 'double' } }),
    box({ border: { style: 'ascii', corners: 'rounded' } }),
  ])
  .describeInputs('corners > single char', [
    box({ border: { style: 'single', corners: '*' } }),
    box({ border: { style: 'double', corners: 'o' } }),
  ])
  .describeInputs('corners > clockwise tuple', [
    box({ border: { edges: { top: '-', bottom: '-', left: '|', right: '|' }, corners: ['a', 'b', 'c', 'd'] } }),
    box({ border: { style: 'single', corners: ['╔', '╗', '╝', '╚'] } }),
  ])
  .test()
