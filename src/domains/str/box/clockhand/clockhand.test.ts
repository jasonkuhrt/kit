import { Test } from '#test'
import { Clockhand } from './$.js'

// dprint-ignore
Test.on(Clockhand.parse<number>)
  .cases(
    // Single value
    [2,                                      { top: 2, right: 2, bottom: 2, left: 2 }],

    // Two values (vertical, horizontal)
    [[[2, 4] as const],                      { top: 2, right: 4, bottom: 2, left: 4 }],

    // Three values (top, horizontal, bottom)
    [[[1, 2, 3] as const],                   { top: 1, right: 2, bottom: 3, left: 2 }],

    // Four values (all sides)
    [[[1, 2, 3, 4] as const],                { top: 1, right: 2, bottom: 3, left: 4 }],

    // Sparse (explicit undefined)
    [[[2, undefined, undefined, 6] as const],         { top: 2, left: 6 }],
    [[[undefined, 3, 1, undefined] as const],         { right: 3, bottom: 1 }],
    [[[undefined, undefined, 5, undefined] as const], { bottom: 5 }],

    // Object passthrough
    [{ top: 2, left: 6 },                    { top: 2, left: 6 }],
    [{ right: 3 },                           { right: 3 }],
    [{},                                     {}],
  )
  .test()
