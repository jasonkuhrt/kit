import { Test } from '#test'
import { Str } from '../$.js'
import type { BorderInput, Padding, PaddingInput } from './box.js'

// Helper to create and encode a box with padding
const padAndEncode = (content: string, padding: PaddingInput) => {
  const box = Str.Box.make({ content })
  box.pad$(padding)
  return box.toString()
}

// Helper to create and encode a box with border
const borderAndEncode = (content: string, border: BorderInput) => {
  const box = Str.Box.make({ content })
  box.border$(border)
  return box.toString()
}

// dprint-ignore
Test.describe('Str.Box > pad')
  .inputType<[string, PaddingInput]>()
  .outputType<string>()
  .casesInput(
    // Single side padding (logical properties, vertical orientation)
    ['Hello', { mainStart: 1 }],      // top
    ['Hello', { mainEnd: 1 }],        // bottom
    ['Hello', { crossStart: 2 }],     // left
    ['Hello', { crossEnd: 2 }],       // right

    // Multiple sides
    ['Hello', { mainStart: 1, mainEnd: 1 }],                              // top + bottom
    ['Hello', { crossStart: 2, crossEnd: 2 }],                            // left + right
    ['Hello', { mainStart: 1, crossStart: 2, mainEnd: 1, crossEnd: 2 }], // all sides

    // Multi-line text
    ['Hello\nWorld', { crossStart: 2 }],                  // left
    ['Hello\nWorld', { mainStart: 1, mainEnd: 1 }],      // top + bottom
    ['Hello\nWorld', { crossStart: 2, crossEnd: 2 }],    // left + right

    // Zero padding (no-op)
    ['Hello', { mainStart: 0, mainEnd: 0, crossStart: 0, crossEnd: 0 }],

    // Empty text
    ['', { mainStart: 1, crossStart: 2 }],
  )
  .test(({ input }) => padAndEncode(...input))

// dprint-ignore
Test.describe('Str.Box > border')
  .inputType<[string, BorderInput]>()
  .outputType<string>()
  .casesInput(
    // Single line
    ['Hello', { style: 'single' }],
    ['Hello', { style: 'double' }],
    ['Hello', { style: 'rounded' }],
    ['Hello', { style: 'bold' }],
    ['Hello', { style: 'ascii' }],

    // Multi-line
    ['Hello\nWorld', { style: 'single' }],
    ['Line 1\nLine 2\nLine 3', { style: 'rounded' }],

    // Different line lengths (jagged)
    ['Hi\nHello\nH', { style: 'single' }],

    // Empty text
    ['', { style: 'ascii' }],
  )
  .test(({ input }) => borderAndEncode(...input))

// Test content$ mutation
Test.describe('Str.Box > content$')
  .inputType<string[]>()
  .outputType<string[]>()
  .cases(
    [['Hello', 'Goodbye'], ['Hello result', 'Goodbye result']],
  )
  .test(({ input }) => {
    const box = Str.Box.make({ content: '' })
    box.pad$({ crossStart: 2 }) // left
    box.border$({ style: 'single' })

    return input.map((content) => {
      box.content$(content)
      return box.toString()
    })
  })

// Test combined padding + border
Test.describe('Str.Box > combined')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'], ['Hello\nWorld'])
  .test(({ input }) => {
    const box = Str.Box.make({ content: input })
    box.pad$({ mainStart: 1, crossStart: 2, mainEnd: 1, crossEnd: 2 }) // all sides
    box.border$({ style: 'single' })
    return box.toString()
  })

// Test immutable static methods
Test.describe('Str.Box > immutable')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    const box1 = Str.Box.make({ content: input })
    const box2 = Str.Box.pad(box1, { crossStart: 2 }) // left
    const box3 = Str.Box.border(box2, { style: 'single' })
    return box3.toString()
  })

// Test partial borders
// dprint-ignore
Test.describe('Str.Box > border > partial')
  .inputType<[string, BorderInput]>()
  .outputType<string>()
  .casesInput(
    // Single side borders
    ['Hello', { edges: { top: '-' } }],
    ['Hello', { edges: { bottom: '-' } }],
    ['Hello', { edges: { left: '|' } }],
    ['Hello', { edges: { right: '|' } }],

    // Two sides
    ['Hello', { edges: { top: '-', bottom: '-' } }],
    ['Hello', { edges: { left: '|', right: '|' } }],
    ['Hello', { edges: { top: '-', left: '|' } }],

    // Multi-line with partial borders
    ['Hello\nWorld', { edges: { left: '|' } }],
    ['Hello\nWorld', { edges: { top: '=', bottom: '=' } }],
  )
  .test(({ input }) => borderAndEncode(...input))

// Test corner control
// dprint-ignore
Test.describe('Str.Box > border > corners')
  .inputType<[string, BorderInput]>()
  .outputType<string>()
  .casesInput(
    // Corners with style (using Clockhand - single value for all corners)
    ['Hello', { style: 'single', corners: 'o' }],
    ['Hello', { style: 'double', corners: '+' }],

    // Corners with custom edges
    ['Hello', { corners: '*', edges: { top: '-', bottom: '-', left: '|', right: '|' } }],

    // Corners override style corners
    ['Hello\nWorld', { style: 'single', corners: 'X' }],
  )
  .test(({ input }) => borderAndEncode(...input))

// Test AxisHand syntax for padding
// dprint-ignore
Test.describe('Str.Box > pad > axishand')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['Hello'],
    ['Hello\nWorld'],
  )
  .test(({ input }) => {
    return [
      // Single value (all sides)
      Str.Box.make({ content: input }).pad$(2).toString(),
      // Two values [main, cross]
      Str.Box.make({ content: input }).pad$([2, 4]).toString(),
      // Binary axis [[mainStart, mainEnd], [crossStart, crossEnd]]
      Str.Box.make({ content: input }).pad$([[1, 2], [3, 4]] as const).toString(),
      // Per-axis asymmetric: [[mainStart, mainEnd], cross]
      Str.Box.make({ content: input }).pad$([[1, 2], 4] as const).toString(),
      // Sparse binary axis: [[mainStart], [crossStart]]
      Str.Box.make({ content: input }).pad$([[2, undefined], [6, undefined]] as const).toString(),
    ].join('\n---\n')
  })

// Test AxisHand syntax for margin
// dprint-ignore
Test.describe('Str.Box > margin > axishand')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['Hello'],
    ['Hello\nWorld'],
  )
  .test(({ input }) => {
    return [
      // Single value (all sides)
      Str.Box.make({ content: input }).border$({ style: 'single' }).margin$(2).toString(),
      // Two values [main, cross]
      Str.Box.make({ content: input }).border$({ style: 'single' }).margin$([2, 4]).toString(),
      // Binary axis [[mainStart, mainEnd], [crossStart, crossEnd]]
      Str.Box.make({ content: input }).border$({ style: 'single' }).margin$([[1, 2], [3, 4]] as const).toString(),
      // Per-axis asymmetric: [[mainStart, mainEnd], cross]
      Str.Box.make({ content: input }).border$({ style: 'single' }).margin$([[1, 2], 4] as const).toString(),
      // Sparse binary axis: [[mainStart], [crossStart]]
      Str.Box.make({ content: input }).border$({ style: 'single' }).margin$([[2, undefined], [6, undefined]] as const).toString(),
    ].join('\n---\n')
  })

// Test full box model with AxisHand syntax
Test.describe('Str.Box > full box model')
  .inputType<string>()
  .outputType<string>()
  .cases(['content'])
  .test(({ input }) => {
    return Str.Box.make({ content: input })
      .pad$([1, 2]) // AxisHand: [main, cross]
      .border$({ style: 'single' })
      .margin$([2, 4]) // AxisHand: [main, cross]
      .toString()
  })

// Test immutable static methods with AxisHand
Test.describe('Str.Box > immutable > axishand')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    const box1 = Str.Box.make({ content: input })
    const box2 = Str.Box.pad(box1, [2, 4]) // AxisHand notation
    const box3 = Str.Box.margin(box2, [1, 2]) // AxisHand notation
    const box4 = Str.Box.border(box3, { style: 'single' })
    return box4.toString()
  })

// Test nested composition (array content with boxes)
Test.describe('Str.Box > nested > vertical')
  .inputType<string>()
  .outputType<string>()
  .cases(['content'])
  .test(({ input }) => {
    const innerBox = Str.Box.make({ content: input })
      .pad$({ crossStart: 2, crossEnd: 2 }) // left/right padding in vertical orientation
      .border$({ style: 'single' })

    const outerBox = Str.Box.make({
      content: [
        'Header',
        innerBox,
        'Footer',
      ],
    })
      .border$({ style: 'double' })

    return outerBox.toString()
  })

// Test horizontal orientation with array content
Test.describe('Str.Box > nested > horizontal')
  .inputType<string>()
  .outputType<string>()
  .cases(['A', 'B'])
  .test(({ input }) => {
    const box1 = Str.Box.make({ content: input }).border$({ style: 'single' })
    const box2 = Str.Box.make({ content: input }).border$({ style: 'double' })

    const horizontalBox = Str.Box.make({
      content: [box1, box2],
      orientation: 'horizontal',
    })

    return horizontalBox.toString()
  })

// Test deeply nested composition
Test.describe('Str.Box > nested > deep')
  .inputType<string>()
  .outputType<string>()
  .cases(['core'])
  .test(({ input }) => {
    const level1 = Str.Box.make({ content: input })
      .border$({ style: 'ascii' })

    const level2 = Str.Box.make({ content: [level1] })
      .pad$({ mainStart: 1, mainEnd: 1 }) // top/bottom in vertical
      .border$({ style: 'single' })

    const level3 = Str.Box.make({ content: [level2] })
      .pad$({ crossStart: 2, crossEnd: 2 }) // left/right in vertical
      .border$({ style: 'double' })

    return level3.toString()
  })

// Test horizontal orientation with padding
Test.describe('Str.Box > horizontal > padding')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    return [
      // mainStart/mainEnd = left/right (spaces)
      Str.Box.make({ content: input, orientation: 'horizontal' }).pad$({ mainStart: 2 }).toString(),
      Str.Box.make({ content: input, orientation: 'horizontal' }).pad$({ mainEnd: 2 }).toString(),
      // crossStart/crossEnd = top/bottom (newlines)
      Str.Box.make({ content: input, orientation: 'horizontal' }).pad$({ crossStart: 1 }).toString(),
      Str.Box.make({ content: input, orientation: 'horizontal' }).pad$({ crossEnd: 1 }).toString(),
      // All sides
      Str.Box.make({ content: input, orientation: 'horizontal' })
        .pad$({ mainStart: 2, mainEnd: 2, crossStart: 1, crossEnd: 1 })
        .toString(),
    ].join('\n---\n')
  })

// Test horizontal orientation with margin
Test.describe('Str.Box > horizontal > margin')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hi'])
  .test(({ input }) => {
    return [
      // mainStart/mainEnd = left/right (spaces)
      Str.Box.make({ content: input, orientation: 'horizontal' })
        .border$({ style: 'single' })
        .margin$({ mainStart: 3 })
        .toString(),
      Str.Box.make({ content: input, orientation: 'horizontal' })
        .border$({ style: 'single' })
        .margin$({ mainEnd: 3 })
        .toString(),
      // crossStart/crossEnd = top/bottom (newlines)
      Str.Box.make({ content: input, orientation: 'horizontal' })
        .border$({ style: 'single' })
        .margin$({ crossStart: 1 })
        .toString(),
      Str.Box.make({ content: input, orientation: 'horizontal' })
        .border$({ style: 'single' })
        .margin$({ crossEnd: 1 })
        .toString(),
    ].join('\n---\n')
  })

// Test horizontal orientation with border (borders use physical coords, should work regardless)
Test.describe('Str.Box > horizontal > border')
  .inputType<string>()
  .outputType<string>()
  .cases(['OK'])
  .test(({ input }) => {
    return Str.Box.make({ content: input, orientation: 'horizontal' })
      .border$({ style: 'double' })
      .toString()
  })

// Test span with absolute values (number)
Test.describe('Str.Box > span > absolute')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['Hello'],
    ['Hi\nWorld'],
  )
  .test(({ input }) => {
    return [
      // Exact main span (vertical = height/lines)
      Str.Box.make({ content: input }).span$({ main: 5 }).toString(),
      // Exact cross span (vertical = width/chars)
      Str.Box.make({ content: input }).span$({ cross: 10 }).toString(),
      // Both axes
      Str.Box.make({ content: input }).span$({ main: 4, cross: 8 }).toString(),
    ].join('\n---\n')
  })

// Test span with AxisHand notation
Test.describe('Str.Box > span > axishand')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    return [
      // Single value (both axes)
      Str.Box.make({ content: input }).span$(10).toString(),
      // Two values [main, cross]
      Str.Box.make({ content: input }).span$([3, 8]).toString(),
    ].join('\n---\n')
  })

// Test spanRange constraints (min/max)
Test.describe('Str.Box > spanRange > constraints')
  .inputType<string>()
  .outputType<string>()
  .cases(
    ['Hi'],
    ['VeryLongContent'],
  )
  .test(({ input }) => {
    return [
      // Max constraint (truncate)
      Str.Box.make({ content: input }).spanRange$({ cross: { max: 5 } }).toString(),
      // Min constraint (pad)
      Str.Box.make({ content: input }).spanRange$({ cross: { min: 10 } }).toString(),
      // Both min and max
      Str.Box.make({ content: input }).spanRange$({ cross: { min: 8, max: 12 } }).toString(),
    ].join('\n---\n')
  })

// Test spanRange with multi-line content
Test.describe('Str.Box > spanRange > multiline')
  .inputType<string>()
  .outputType<string>()
  .cases(['Line1\nLine2'])
  .test(({ input }) => {
    return [
      // Max main span (truncate lines)
      Str.Box.make({ content: input }).spanRange$({ main: { max: 1 } }).toString(),
      // Min main span (add lines)
      Str.Box.make({ content: input }).spanRange$({ main: { min: 5 } }).toString(),
    ].join('\n---\n')
  })

// Test span + spanRange interaction (exact size takes precedence)
Test.describe('Str.Box > span + spanRange > priority')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    // Span should take precedence over intrinsic size, then spanRange constrains it
    return [
      // Exact span of 10, with max of 8 → constrained to 8
      Str.Box.make({ content: input }).span$({ cross: 10 }).spanRange$({ cross: { max: 8 } }).toString(),
      // Exact span of 3, with min of 5 → constrained to 5
      Str.Box.make({ content: input }).span$({ cross: 3 }).spanRange$({ cross: { min: 5 } }).toString(),
    ].join('\n---\n')
  })

// Test gap in vertical orientation
Test.describe('Str.Box > gap > vertical')
  .inputType<string[]>()
  .outputType<string>()
  .cases(
    [['A', 'B', 'C']],
    [['Item 1', 'Item 2']],
  )
  .test(({ input }) => {
    return [
      // No gap (default)
      Str.Box.make({ content: input }).toString(),
      // Main gap (newlines between items)
      Str.Box.make({ content: input }).gap$(2).toString(),
      // Gap with number shorthand
      Str.Box.make({ content: input }).gap$({ main: 1 }).toString(),
    ].join('\n---\n')
  })

// Test gap in horizontal orientation
Test.describe('Str.Box > gap > horizontal')
  .inputType<string[]>()
  .outputType<string>()
  .cases([['A', 'B', 'C']])
  .test(({ input }) => {
    return [
      // No gap (default)
      Str.Box.make({ content: input, orientation: 'horizontal' }).toString(),
      // Main gap (spaces between items)
      Str.Box.make({ content: input, orientation: 'horizontal' }).gap$(3).toString(),
      // Gap with object notation
      Str.Box.make({ content: input, orientation: 'horizontal' }).gap$({ main: 2 }).toString(),
    ].join('\n---\n')
  })

// Test gap with nested boxes
Test.describe('Str.Box > gap > nested')
  .inputType<string>()
  .outputType<string>()
  .cases(['X'])
  .test(({ input }) => {
    const box1 = Str.Box.make({ content: input }).border$({ style: 'single' })
    const box2 = Str.Box.make({ content: input }).border$({ style: 'double' })
    const box3 = Str.Box.make({ content: input }).border$({ style: 'rounded' })

    return [
      // Vertical with gap
      Str.Box.make({ content: [box1, box2, box3] }).gap$(1).toString(),
      // Horizontal with gap
      Str.Box.make({ content: [box1, box2, box3], orientation: 'horizontal' }).gap$(2).toString(),
    ].join('\n---\n')
  })

// Test static immutable methods for new features
Test.describe('Str.Box > immutable > new features')
  .inputType<string>()
  .outputType<string>()
  .cases(['Hello'])
  .test(({ input }) => {
    const box1 = Str.Box.make({ content: input })
    const box2 = Str.Box.span(box1, { cross: 10 })
    const box3 = Str.Box.spanRange(box2, { cross: { min: 8, max: 12 } })
    return box3.toString()
  })

// Test combined: span, gap, padding, border
Test.describe('Str.Box > combined > full features')
  .inputType<string[]>()
  .outputType<string>()
  .cases([['A', 'B']])
  .test(({ input }) => {
    return Str.Box.make({ content: input })
      .span$({ cross: 10 })
      .gap$(1)
      .pad$([1, 2])
      .border$({ style: 'double' })
      .toString()
  })

// Test colored borders
// dprint-ignore
Test.describe('Str.Box > border > colored')
  .inputType<[string, BorderInput]>()
  .outputType<string>()
  .casesInput(
    // Colored edges (named colors)
    ['Hello', {
      edges: {
        top: { char: '─', color: { foreground: 'red' } },
        right: { char: '│', color: { foreground: 'blue' } },
        bottom: { char: '─', color: { foreground: 'green' } },
        left: { char: '│', color: { foreground: 'yellow' } },
      },
    }],

    // Colored corners with bold style
    ['Hello', {
      edges: '─',
      corners: {
        topLeft: { char: '┌', color: { foreground: 'red' }, bold: true },
        topRight: { char: '┐', color: { foreground: 'blue' }, bold: true },
        bottomRight: { char: '┘', color: { foreground: 'green' }, bold: true },
        bottomLeft: { char: '└', color: { foreground: 'yellow' }, bold: true },
      },
    }],

    // Fully styled border (edges + corners with style modifiers)
    ['Hello\nWorld', {
      edges: {
        top: { char: '─', color: { foreground: 'cyan' }, bold: true },
        right: { char: '│', color: { foreground: 'magenta' }, dim: true },
        bottom: { char: '─', color: { foreground: 'cyan' }, bold: true },
        left: { char: '│', color: { foreground: 'magenta' }, dim: true },
      },
      corners: {
        topLeft: { char: '┌', color: { foreground: 'red' }, bold: true },
        topRight: { char: '┐', color: { foreground: 'blue' }, bold: true },
        bottomRight: { char: '┘', color: { foreground: 'green' }, bold: true },
        bottomLeft: { char: '└', color: { foreground: 'yellow' }, bold: true },
      },
    }],

    // RGB color values (object and string formats)
    ['Hello', {
      edges: {
        top: { char: '─', color: { foreground: { r: 255, g: 87, b: 51 } } },
        bottom: { char: '─', color: { foreground: 'rgb 100 200 150' } },
        left: '│',
        right: '│',
      },
    }],

    // Background colors
    ['Text', {
      edges: {
        top: { char: '─', color: { foreground: 'white', background: 'blue' } },
        bottom: { char: '─', color: { foreground: 'white', background: 'blue' } },
        left: { char: '│', color: { foreground: 'black', background: 'yellow' } },
        right: { char: '│', color: { foreground: 'black', background: 'yellow' } },
      },
    }],

    // Hex color notation
    ['Hex', {
      edges: {
        top: { char: '═', color: { foreground: '#FF5733' } },
        bottom: { char: '═', color: { foreground: '#33FF57' } },
        left: { char: '║', color: { foreground: '#3357FF' } },
        right: { char: '║', color: { foreground: '#FF33F5' } },
      },
    }],
  )
  .test(({ input }) => borderAndEncode(...input))

// Test styled content
// dprint-ignore
Test.describe('Str.Box > content > styled')
  .inputType<any>()
  .outputType<string>()
  .cases(
    // Plain styled text
    [{ text: 'Hello', color: { foreground: 'red' } }],
    // Styled text with bold
    [{ text: 'Bold Text', color: { foreground: 'green' }, bold: true }],
    // Multiple style modifiers
    [{ text: 'Fancy', color: { foreground: 'magenta' }, bold: true, underline: true }],
    // Mixed styled and unstyled content in array
    [[
      'Plain text',
      { text: 'Red text', color: { foreground: 'red' } },
      'More plain',
      { text: 'Bold blue', color: { foreground: 'blue' }, bold: true },
    ]],
  )
  .test(({ input }) => {
    const box = Str.Box.make({ content: input })
    box.gap$(Array.isArray(input) ? 1 : 0)
    box.border$({ style: Array.isArray(input) ? 'double' : 'single' })
    return box.toString()
  })
