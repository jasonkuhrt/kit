// dprint-ignore
export const isTypeWith =
  <reference>(reference: reference) => {
    return <value>(
        // Note: This type logic is intentionally not factored out.
        // We cannot factor this out without losing pretty rendering in IDE.
        // If we factor this out the user will just see a reference to its name in their IDE.
        value: reference extends value
          ? value
          : {
              ERROR: 'Value type must be a superset of the guarded type.',
              HINT: 'Since value type has no overlap with guarded type, guard can only ever return false.'
              GUARD_TYPE: reference,
              VALUE_TYPE: value
            }
        // @ts-expect-error
        ): value is reference => {
      return value === reference as any
    }
  }

// dprint-ignore
export const isNotTypeWith =
  <reference>(reference: reference) => {
    return <value>(
        // Note: This type logic is intentionally not factored out.
        // We cannot factor this out without losing pretty rendering in IDE.
        // If we factor this out the user will just see a reference to its name in their IDE.
        value: reference extends value
          ? value
          : {
              ERROR: 'Value type must be a superset of the guarded type.',
              HINT: 'Since value type has no overlap with guarded type, guard can only ever return false.'
              GUARD_TYPE: reference,
              VALUE_TYPE: value
            }
        ): value is Exclude<typeof value, reference> => {
      return value !== reference as any
    }
  }

// null

export const isNull = isTypeWith(null)

export const isNotNull = isNotTypeWith(null)

// undefined

export const isUndefined = isTypeWith(undefined)

export const isNotUndefined = isNotTypeWith(undefined)
