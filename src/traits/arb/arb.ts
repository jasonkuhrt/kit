import { Glo } from '#glo'
import { Traitor } from '#traitor'
import type { Ts } from '#ts'
import * as fc from 'fast-check'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Global Registration
//
//

declare global {
  interface TRAITOR_TRAITS {
    Arb: Arb
  }

  interface TRAITOR_DOMAINS_Arb {}
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Interface
//
//

/**
 * Arb trait interface for property-based testing.
 *
 * The Arb trait provides a standard interface for generating arbitrary values
 * for property-based testing with fast-check. Implementations should provide
 * generators that produce valid instances of their domain type.
 *
 * @template $Type - The type of values this Arb instance can generate
 *
 * @example
 * ```ts
 * import { Str, Num } from '@wollybeard/kit'
 *
 * // Domain-specific arbitraries
 * const strSample = Str.Arb.sample() // 'hello'
 * const numSamples = Num.Arb.samples(5) // [1, -42, 3.14, 0, 99]
 *
 * // Use in property tests
 * fc.assert(
 *   fc.property(Str.Arb.arbitrary, (str) => {
 *     return Str.length(str) >= 0
 *   })
 * )
 * ```
 */
export interface Arb<$Type = unknown> extends
  Traitor.Definition<
    [], // No dependencies
    { // External interface
      /**
       * The fast-check arbitrary for this domain.
       */
      readonly arbitrary: fc.Arbitrary<$Type>
      /**
       * Generate a single sample value.
       */
      sample(): $Type
      /**
       * Generate multiple sample values.
       *
       * @param count - Number of samples to generate (default: 10)
       */
      samples(count?: number): $Type[]
    },
    { // Internal interface
      arbitrary: fc.Arbitrary<$Type>
      sample?(): $Type
      samples?(count?: number): $Type[]
    }
  >
{
  // @ts-expect-error - PrivateKind pattern: unknown will be overridden via intersection
  [Ts.Kind.PrivateKindReturn]: Arb<this[Ts.Kind.PrivateKindParameters][0]>
  [Ts.Kind.PrivateKindParameters]: unknown
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Runtime
//
//

export const Arb = Glo.traitor.trait('Arb')
