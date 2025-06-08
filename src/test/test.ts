import * as FastCheck from 'fast-check'
import * as Vitest from 'vitest'

export interface CaseInstructions {
  only?: boolean
  skip?: boolean
}

export type Cases<$Instructions extends CaseInstructions = CaseInstructions> = [
  description: string,
  $Instructions,
][]

export const cases = <instructions extends CaseInstructions>(cases: Cases<instructions>) => {
  cases = cases.filter(([_, instructions]) => !instructions.skip || _.startsWith('//'))

  if (cases.some(([_, instructions]) => instructions.only || _.startsWith('>'))) {
    cases = cases.filter(([_, instructions]) => instructions.only || _.startsWith('>'))
  }

  return cases
}

// declare function property<Ts extends [unknown, ...unknown[]]>(...args: ): IPropertyWithHooks<Ts>;

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
