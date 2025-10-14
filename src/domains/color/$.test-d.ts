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
type _hex = Ts.Test.Cases<
  Ts.Test.sub<'hex', DetectFormat<'#FF5733'>>,
  Ts.Test.sub<'hex', DetectFormat<'FF5733'>>
>

// RGB format detection
type _rgb = Ts.Test.Cases<
  Ts.Test.sub<'rgb-space', DetectFormat<'rgb 255 87 51'>>,
  Ts.Test.sub<'rgb-func', DetectFormat<'rgb(255, 87, 51)'>>
>

// HSL format detection
type _hsl = Ts.Test.Cases<
  Ts.Test.sub<'hsl-space', DetectFormat<'hsl 120 100 50'>>,
  Ts.Test.sub<'hsl-func', DetectFormat<'hsl(120, 100, 50)'>>
>

// Named color detection
type _named = Ts.Test.Cases<
  Ts.Test.sub<'named', DetectFormat<'red'>>,
  Ts.Test.sub<'named', DetectFormat<'blue'>>
>

// Object format detection
type _object = Ts.Test.sub<'object', DetectFormat<{ r: 255; g: 87; b: 51 }>>

// Unknown format detection
type _unknown = Ts.Test.sub<'unknown', DetectFormat<'invalid'>>

//
// ─── ParseColor Type Tests ───────────────────────────────────────────────────
//

// Valid color parsing
type _parseValid = Ts.Test.sub<
  { format: 'hex'; valid: true },
  ParseColor<'#FF5733'>
>

// Invalid color parsing
type _parseInvalid = Ts.Test.sub<
  { format: 'unknown'; valid: false },
  ParseColor<'invalid'>
>
