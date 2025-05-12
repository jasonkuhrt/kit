export const is = <value>(value: value) => (variableValue: unknown): variableValue is value => {
  return value === variableValue
}

export const isNot =
  <value>(value: value) =>
  <variableValue>(variableValue: variableValue): variableValue is Exclude<variableValue, value> => {
    // @ts-expect-error
    return value !== variableValue
  }
