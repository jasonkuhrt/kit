import { Test } from '#test'
import { AxisHand } from './_.js'

// dprint-ignore
Test.on(AxisHand.parse)
  .cases(
    // Global number - all sides
    [[2], { mainStart: 2, mainEnd: 2, crossStart: 2, crossEnd: 2 }],

    // Axis shorthands - [main, cross]
    [[[2, 4] as const], { mainStart: 2, mainEnd: 2, crossStart: 4, crossEnd: 4 }],
    [[[0, 0] as const], { mainStart: 0, mainEnd: 0, crossStart: 0, crossEnd: 0 }],
    [[[1, 1] as const], { mainStart: 1, mainEnd: 1, crossStart: 1, crossEnd: 1 }],

    // Binary axis - [[main...], [cross...]]
    // Both axes with arrays
    [[[[1, 2] as const, [3, 4] as const] as const], { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }],
    [[[[0, 1] as const, [2, 3] as const] as const], { mainStart: 0, mainEnd: 1, crossStart: 2, crossEnd: 3 }],

    // Mixed: array + number
    [[[[1, 2] as const, 4] as const], { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }],
    [[[2, [3, 4] as const] as const], { mainStart: 2, mainEnd: 2, crossStart: 3, crossEnd: 4 }],

    // Single axis - [[main...]]
    [[[[2, 2] as const] as const], { mainStart: 2, mainEnd: 2 }],
    [[[[1, 2] as const] as const], { mainStart: 1, mainEnd: 2 }],

    // Sparse arrays - [start] only
    [[[[ 2, undefined] as const, [3, undefined] as const] as const], { mainStart: 2, crossStart: 3 }],
    [[[[undefined, 2] as const, [undefined, 3] as const] as const], { mainEnd: 2, crossEnd: 3 }],

    // Sparse mixed
    [[[[ 2, undefined] as const, 4] as const], { mainStart: 2, crossStart: 4, crossEnd: 4 }],
    [[[[undefined, 2] as const] as const], { mainEnd: 2 }],
    [[[[ 2] as const] as const], { mainStart: 2 }],

    // Object syntax with main/cross
    [[{ main: 2, cross: 4 }], { mainStart: 2, mainEnd: 2, crossStart: 4, crossEnd: 4 }],
    [[{ main: [1, 2] as const, cross: 4 }], { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }],
    [[{ main: 2, cross: [3, 4] as const }], { mainStart: 2, mainEnd: 2, crossStart: 3, crossEnd: 4 }],
    [[{ main: [1, 2] as const, cross: [3, 4] as const }], { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }],

    // Object with single axis
    [[{ main: 2 }], { mainStart: 2, mainEnd: 2 }],
    [[{ cross: 4 }], { crossStart: 4, crossEnd: 4 }],
    [[{ main: [1, 2] as const }], { mainStart: 1, mainEnd: 2 }],
    [[{ cross: [3, 4] as const }], { crossStart: 3, crossEnd: 4 }],

    // Object with axis objects
    [[{ main: { start: 1, end: 2 }, cross: { start: 3, end: 4 } }], { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }],
    [[{ main: { start: 1 }, cross: { end: 4 } }], { mainStart: 1, crossEnd: 4 }],
    [[{ main: { end: 2 } }], { mainEnd: 2 }],
    [[{ cross: { start: 3 } }], { crossStart: 3 }],

    // Explicit logical properties (passthrough)
    [[{ mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }], { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }],
    [[{ mainStart: 1 }], { mainStart: 1 }],
    [[{ crossEnd: 4 }], { crossEnd: 4 }],
    [[{ mainStart: 1, crossEnd: 4 }], { mainStart: 1, crossEnd: 4 }],

    // Empty/sparse cases
    [[{}], {}],
  )
  .test()
