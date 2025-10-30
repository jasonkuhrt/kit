import { Test } from '#test'
import { describe, expect, test } from 'vitest'
import { hexToRgb, hslToRgb } from './conversions.js'
import { namedColors } from './named-colors.js'
import { parse } from './parser.js'
import { Color } from './schema.js'

describe('Color Conversions', () => {
  describe('hexToRgb', () => {
    // dprint-ignore
    Test.on(hexToRgb)
      .cases(
        [['#FF0000'], { r: 255, g: 0, b: 0 }],
        [['FF0000'],  { r: 255, g: 0, b: 0 }],
        [['#00FF00'], { r: 0, g: 255, b: 0 }],
        [['#0000FF'], { r: 0, g: 0, b: 255 }],
        [['#FF5733'], { r: 255, g: 87, b: 51 }],
        [['#FFFFFF'], { r: 255, g: 255, b: 255 }],
        [['#000000'], { r: 0, g: 0, b: 0 }],
      )
      .test()
  })

  describe('hslToRgb', () => {
    // dprint-ignore
    Test.on(hslToRgb)
      .cases(
        // Primary colors
        [[0, 100, 50],   { r: 255, g: 0, b: 0 }],     // Red
        [[120, 100, 50], { r: 0, g: 255, b: 0 }],     // Green
        [[240, 100, 50], { r: 0, g: 0, b: 255 }],     // Blue
        // Grayscale
        [[0, 0, 0],      { r: 0, g: 0, b: 0 }],       // Black
        [[0, 0, 50],     { r: 128, g: 128, b: 128 }], // Gray
        [[0, 0, 100],    { r: 255, g: 255, b: 255 }], // White
        // Other hues
        [[60, 100, 50],  { r: 255, g: 255, b: 0 }],   // Yellow
        [[180, 100, 50], { r: 0, g: 255, b: 255 }],   // Cyan
        [[300, 100, 50], { r: 255, g: 0, b: 255 }],   // Magenta
      )
      .test()
  })
})

describe('Runtime Parser', () => {
  describe('parse - hex format', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['#FF0000'], { r: 255, g: 0, b: 0 }],
        [['FF0000'],  { r: 255, g: 0, b: 0 }],
        [['#00FF00'], { r: 0, g: 255, b: 0 }],
        [['#0000FF'], { r: 0, g: 0, b: 255 }],
      )
      .test()
  })

  describe('parse - RGB space-separated', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['rgb 255 0 0'],   { r: 255, g: 0, b: 0 }],
        [['rgb 0 255 0'],   { r: 0, g: 255, b: 0 }],
        [['rgb 0 0 255'],   { r: 0, g: 0, b: 255 }],
        [['rgb 255 87 51'], { r: 255, g: 87, b: 51 }],
      )
      .test()
  })

  describe('parse - RGB CSS function', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['rgb(255, 0, 0)'],   { r: 255, g: 0, b: 0 }],
        [['rgb(0, 255, 0)'],   { r: 0, g: 255, b: 0 }],
        [['rgb(0, 0, 255)'],   { r: 0, g: 0, b: 255 }],
        [['rgb(255, 87, 51)'], { r: 255, g: 87, b: 51 }],
      )
      .test()
  })

  describe('parse - HSL space-separated', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['hsl 0 100 50'],   { r: 255, g: 0, b: 0 }],
        [['hsl 120 100 50'], { r: 0, g: 255, b: 0 }],
        [['hsl 240 100 50'], { r: 0, g: 0, b: 255 }],
      )
      .test()
  })

  describe('parse - HSL CSS function', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['hsl(0, 100, 50)'],   { r: 255, g: 0, b: 0 }],
        [['hsl(120, 100, 50)'], { r: 0, g: 255, b: 0 }],
        [['hsl(240, 100, 50)'], { r: 0, g: 0, b: 255 }],
      )
      .test()
  })

  describe('parse - named colors', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['red'],   { r: 255, g: 0, b: 0 }],
        [['green'], { r: 0, g: 128, b: 0 }],
        [['blue'],  { r: 0, g: 0, b: 255 }],
        [['white'], { r: 255, g: 255, b: 255 }],
        [['black'], { r: 0, g: 0, b: 0 }],
        // Case insensitive
        [['RED'],   { r: 255, g: 0, b: 0 }],
        [['Red'],   { r: 255, g: 0, b: 0 }],
      )
      .test()
  })

  describe('parse - object format', () => {
    test('returns object as-is', () => {
      const input = { r: 255, g: 87, b: 51 }
      expect(parse(input)).toEqual(input)
    })
  })

  describe('parse - invalid formats', () => {
    // dprint-ignore
    Test.on(parse)
      .cases(
        [['invalid'], null],
        [['#ZZZ'], null],
        [['rgb 256 0 0'], null], // Values are not validated at parse level, just format
        [['hsl abc'], null],
        [[''], null],
      )
      .test()
  })
})

describe('Effect Schema', () => {
  describe('Color.fromString', () => {
    test('parses hex format', () => {
      const color = Color.fromString('#FF5733')
      expect(color.r).toBe(255)
      expect(color.g).toBe(87)
      expect(color.b).toBe(51)
    })

    test('parses RGB format', () => {
      const color = Color.fromString('rgb 255 87 51')
      expect(color.r).toBe(255)
      expect(color.g).toBe(87)
      expect(color.b).toBe(51)
    })

    test('parses named color', () => {
      const color = Color.fromString('red')
      expect(color.r).toBe(255)
      expect(color.g).toBe(0)
      expect(color.b).toBe(0)
    })

    test('throws on invalid format', () => {
      expect(() => Color.fromString('invalid')).toThrow()
    })
  })

  describe('Color.fromRgb', () => {
    test('creates color from RGB object', () => {
      const color = Color.fromRgb({ r: 255, g: 87, b: 51 })
      expect(color.r).toBe(255)
      expect(color.g).toBe(87)
      expect(color.b).toBe(51)
    })
  })

  describe('Color#toHex', () => {
    test('converts to hex format', () => {
      const color = Color.fromString('red')
      expect(color.toHex()).toBe('#FF0000')
    })

    test('pads single digit values', () => {
      const color = Color.fromRgb({ r: 15, g: 0, b: 255 })
      expect(color.toHex()).toBe('#0F00FF')
    })
  })

  describe('Color#toString', () => {
    test('returns hex format', () => {
      const color = Color.fromString('red')
      expect(color.toString()).toBe('#FF0000')
    })
  })
})

describe('Named Colors', () => {
  test('has 147 CSS colors', () => {
    expect(Object.keys(namedColors).length).toBe(147)
  })

  test('includes primary colors', () => {
    expect(namedColors['red']).toEqual({ r: 255, g: 0, b: 0 })
    expect(namedColors['green']).toEqual({ r: 0, g: 128, b: 0 })
    expect(namedColors['blue']).toEqual({ r: 0, g: 0, b: 255 })
  })

  test('includes grayscale colors', () => {
    expect(namedColors['black']).toEqual({ r: 0, g: 0, b: 0 })
    expect(namedColors['white']).toEqual({ r: 255, g: 255, b: 255 })
    expect(namedColors['gray']).toEqual({ r: 128, g: 128, b: 128 })
  })
})
