// dprint-ignore
export const is =
  <value1>(value1: value1) =>
    (value2: unknown): value2 is value1 => {
      return value1 === value2
    }

// dprint-ignore
export const isNot =
  <value1>(value1: value1) =>
  <variableValue>(value2: variableValue): value2 is Exclude<variableValue, value1> => {
    // @ts-expect-error
    return value1 !== value2
  }
