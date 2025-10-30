/**
 * Type-level tests for color module.
 * Tests compile-time type behavior and inference.
 */

import { Ts } from '#ts'
import type { DetectFormat, ParseColor } from './parser.types.js'

//
// ─── DetectFormat Type Tests ─────────────────────────────────────────────────
//

// Hex format detection
type _hex = Ts.Assert.Cases<
  Ts.Assert.sub.of<'hex', DetectFormat<'#FF5733'>>,
  Ts.Assert.sub.of<'hex', DetectFormat<'FF5733'>>
>

// RGB format detection
type _rgb = Ts.Assert.Cases<
  Ts.Assert.sub.of<'rgb-space', DetectFormat<'rgb 255 87 51'>>,
  Ts.Assert.sub.of<'rgb-func', DetectFormat<'rgb(255, 87, 51)'>>
>

// HSL format detection
type _hsl = Ts.Assert.Cases<
  Ts.Assert.sub.of<'hsl-space', DetectFormat<'hsl 120 100 50'>>,
  Ts.Assert.sub.of<'hsl-func', DetectFormat<'hsl(120, 100, 50)'>>
>

// Named color detection
type _named = Ts.Assert.Cases<
  Ts.Assert.sub.of<'named', DetectFormat<'red'>>,
  Ts.Assert.sub.of<'named', DetectFormat<'blue'>>
>

// Object format detection
type _object = Ts.Assert.sub.of<'object', DetectFormat<{ r: 255; g: 87; b: 51 }>>

// Unknown format detection
type _unknown = Ts.Assert.sub.of<'unknown', DetectFormat<'invalid'>>

//
// ─── ParseColor Type Tests ───────────────────────────────────────────────────
//

// Valid color parsing
type _parseValid = Ts.Assert.sub.of<
  { format: 'hex'; valid: true },
  ParseColor<'#FF5733'>
>

// Invalid color parsing
type _parseInvalid = Ts.Assert.sub.of<
  { format: 'unknown'; valid: false },
  ParseColor<'invalid'>
>
