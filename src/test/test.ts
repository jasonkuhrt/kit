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
