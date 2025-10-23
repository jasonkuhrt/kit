import { Ts } from '#ts'
import type { Brand } from 'effect'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Test Setup - Branded Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type NonNegative = number & Brand.Brand<'NonNegative'>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StripReadonlyDeep Tests - Tuple Preservation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ⭐ CRITICAL TEST: Tuple structure must be preserved, not widened to union array
// This test reproduces the bug found in num/$.test-d.ts where:
// parameters.sub.ofAs<[b, a]>() was widening [b, a] to (a | b)[]

type _strip_readonly_deep_tuple_preservation = Ts.Assert.Cases<
  // Basic tuple preservation: [1, 2] NOT (1 | 2)[]
  Ts.Assert.exact<Ts.StripReadonlyDeep<readonly [1, 2]>, [1, 2]>,
  // Tuple with different types: [number, string] NOT (number | string)[]
  Ts.Assert.exact<Ts.StripReadonlyDeep<readonly [number, string]>, [number, string]>,
  // Tuple with branded types
  Ts.Assert.exact<Ts.StripReadonlyDeep<readonly [NonNegative, number]>, [NonNegative, number]>,
  // Nested tuple preservation
  Ts.Assert.exact<Ts.StripReadonlyDeep<{ readonly data: readonly [1, 2] }>, { data: [1, 2] }>
>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StripReadonlyDeep Tests - Object Readonly Stripping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type _strip_readonly_deep_object = Ts.Assert.Cases<
  // Basic object
  Ts.Assert.exact<Ts.StripReadonlyDeep<{ readonly x: number; readonly y: string }>, { x: number; y: string }>,
  // Nested object
  Ts.Assert.exact<
    Ts.StripReadonlyDeep<{
      readonly outer: {
        readonly inner: number
      }
    }>,
    {
      outer: {
        inner: number
      }
    }
  >
>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StripReadonlyDeep Tests - Array Handling
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type _strip_readonly_deep_array = Ts.Assert.Cases<
  // ReadonlyArray conversion
  Ts.Assert.exact<Ts.StripReadonlyDeep<ReadonlyArray<number>>, Array<number>>,
  // Regular array (passthrough)
  Ts.Assert.exact<Ts.StripReadonlyDeep<Array<number>>, Array<number>>,
  // Nested arrays
  Ts.Assert.exact<Ts.StripReadonlyDeep<ReadonlyArray<ReadonlyArray<string>>>, Array<Array<string>>>
>

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// StripReadonlyDeep Tests - Function Passthrough
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type _strip_readonly_deep_function = Ts.Assert.Cases<
  // Functions should pass through unchanged
  Ts.Assert.exact<Ts.StripReadonlyDeep<(x: readonly string[]) => void>, (x: readonly string[]) => void>
>
