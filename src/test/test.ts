import * as FastCheck from 'fast-check'
import * as Vitest from 'vitest'

/**
 * Instructions for controlling test case execution.
 */
export interface CaseInstructions {
  /**
   * Whether to run only this test case.
   */
  only?: boolean
  /**
   * Whether to skip this test case.
   */
  skip?: boolean
}

/**
 * Array of test cases with descriptions and instructions.
 *
 * @template $Instructions - The type of instructions for each case.
 */
export type Cases<$Instructions extends CaseInstructions = CaseInstructions> = [
  description: string,
  $Instructions,
][]

/**
 * Filter test cases based on skip/only instructions.
 *
 * Supports special syntax in descriptions:
 * - Descriptions starting with `//` are treated as skip
 * - Descriptions starting with `>` are treated as only
 *
 * @template instructions - The type of instructions for each case.
 *
 * @param cases - Array of test cases to filter.
 *
 * @returns The filtered array of test cases.
 *
 * @example
 * ```ts
 * // define test cases
 * const testCases = cases([
 *   ['normal test', {}],
 *   ['skip this test', { skip: true }],
 *   ['//also skip this', {}],
 *   ['>only run this', {}],
 *   ['focus test', { only: true }]
 * ])
 *
 * // when only/focus tests exist, only those will be returned
 * // otherwise, all non-skipped tests are returned
 * ```
 */
export const cases = <instructions extends CaseInstructions>(cases: Cases<instructions>) => {
  cases = cases.filter(([description, instructions]) => !instructions.skip && !description.startsWith('//'))

  if (cases.some(([description, instructions]) => instructions.only || description.startsWith('>'))) {
    cases = cases.filter(([description, instructions]) => instructions.only || description.startsWith('>'))
  }

  return cases
}

// declare function property<Ts extends [unknown, ...unknown[]]>(...args: ): IPropertyWithHooks<Ts>;

/**
 * Create a property-based test using fast-check within vitest.
 *
 * @template Ts - Tuple type of the arbitrary values.
 *
 * @param args - Test arguments in order:
 *   - description: The test description
 *   - arbitraries: Fast-check arbitraries for generating test values
 *   - predicate: Function that should hold true for all generated values
 *
 * @example
 * ```ts
 * // test that array reverse twice returns original
 * property(
 *   'reversing array twice returns original',
 *   fc.array(fc.integer()),
 *   (arr) => {
 *     const reversed = arr.slice().reverse()
 *     const reversedTwice = reversed.slice().reverse()
 *     expect(reversedTwice).toEqual(arr)
 *   }
 * )
 *
 * // test with multiple arbitraries
 * property(
 *   'addition is commutative',
 *   fc.integer(),
 *   fc.integer(),
 *   (a, b) => {
 *     expect(a + b).toBe(b + a)
 *   }
 * )
 * ```
 */
export const property = <Ts extends [unknown, ...unknown[]]>(
  ...args: [
    description: string,
    ...arbitraries: {
      [K in keyof Ts]: FastCheck.Arbitrary<Ts[K]>
    },
    predicate: (...args: Ts) => boolean | void,
  ]
) => {
  const description = args[0]
  const rest = args.slice(1) as Parameters<typeof FastCheck.property>
  Vitest.test('property: ' + description, () => {
    FastCheck.assert(
      FastCheck.property(...rest),
    )
  })
}
