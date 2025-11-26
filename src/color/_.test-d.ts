/**
 * Type-level tests for color module.
 * Tests compile-time type behavior and inference.
 */

import type { Type as A } from '#assert/assert'
import type { DetectFormat, ParseColor } from './parser.types.js'

//
// ─── DetectFormat Type Tests ─────────────────────────────────────────────────
//

// Hex format detection
type _hex = A.Cases<
  A.sub.of<'hex', DetectFormat<'#FF5733'>>,
  A.sub.of<'hex', DetectFormat<'FF5733'>>
>

// RGB format detection
type _rgb = A.Cases<
  A.sub.of<'rgb-space', DetectFormat<'rgb 255 87 51'>>,
  A.sub.of<'rgb-func', DetectFormat<'rgb(255, 87, 51)'>>
>

// HSL format detection
type _hsl = A.Cases<
  A.sub.of<'hsl-space', DetectFormat<'hsl 120 100 50'>>,
  A.sub.of<'hsl-func', DetectFormat<'hsl(120, 100, 50)'>>
>

// Named color detection
type _named = A.Cases<
  A.sub.of<'named', DetectFormat<'red'>>,
  A.sub.of<'named', DetectFormat<'blue'>>
>

// Object format detection
type _object = A.sub.of<'object', DetectFormat<{ r: 255; g: 87; b: 51 }>>

// Unknown format detection
type _unknown = A.sub.of<'unknown', DetectFormat<'invalid'>>

//
// ─── ParseColor Type Tests ───────────────────────────────────────────────────
//

// Valid color parsing
type _parseValid = A.sub.of<
  { format: 'hex'; valid: true },
  ParseColor<'#FF5733'>
>

// Invalid color parsing
type _parseInvalid = A.sub.of<
  { format: 'unknown'; valid: false },
  ParseColor<'invalid'>
>
