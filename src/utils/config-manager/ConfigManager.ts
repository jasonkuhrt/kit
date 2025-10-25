import { Obj } from '#obj'
import type { Ts } from '#ts'
import type { Undefined } from '#undefined'
import type { IsUnknown, PartialDeep } from 'type-fest'
import { isDate } from 'util/types'
import { type GuardedType, isAnyFunction, type Objekt } from './_prelude.js'

// dprint-ignore
export type OrDefault2<$Value, $Default> =
    // When no value has been passed in because the property is optional,
    // then the inferred type is unknown.
    IsUnknown<$Value> extends true ? $Default :
    undefined extends $Value       ? $Default :
                                    Undefined.Exclude<$Value>

// todo remove this in favour of OrDefault2
// dprint-ignore
export type OrDefault<$Value, $Default> =
    // When no value has been passed in because the property is optional,
    // then the inferred type is unknown.
    IsUnknown<$Value> extends true ? $Default :
    $Value extends undefined       ? $Default :
                                     $Value

// dprint-ignore
export type MergeDefaultsShallow<
  $Defaults extends object,
  $Input extends undefined | object,
> =
  $Input extends undefined
    ? $Defaults
    : Objekt.IsEmpty<$Input> extends true
      ? $Defaults
      : & Omit<$Input, keyof $Defaults>
        & {
          [$DefaultsKey in keyof $Defaults]:
            $DefaultsKey extends keyof $Input
              ? $Input[$DefaultsKey] extends undefined
                ? $Defaults[$DefaultsKey]
                : $Input[$DefaultsKey]
              : $Defaults[$DefaultsKey]
        }

// dprint-ignore
export type MergeDefaults<$Defaults extends object, $Input extends undefined | object, $CustomScalars = never> =
  Ts.Simplify.Top<
    $Input extends undefined
      ? $Defaults
      : & Omit<$Input, keyof $Defaults>
        & {
            [$Key in keyof $Defaults]:
              $Key extends keyof $Input
                ? $Input[$Key] extends undefined
                  ? $Defaults[$Key]
                  : MergeDefaultsValues<$Defaults[$Key], Undefined.Exclude<$Input[$Key]>, $CustomScalars>
                : $Defaults[$Key]
          }
  >

// dprint-ignore
type MergeDefaultsValues<$DefaultValue, $InputValue, $CustomScalars> =
$InputValue extends $CustomScalars
  ? $DefaultValue extends $CustomScalars
    ? $InputValue // Treat as terminal
    : never // Mismatch between defaults and input
  : $InputValue extends object
    ? $DefaultValue extends object
      ? Ts.Simplify.Top<MergeDefaults<$DefaultValue, $InputValue, $CustomScalars>>
      : never // Defaults disagrees with Input
    : $InputValue

export const createMerger = <$CustomScalars extends CustomScalarGuard[]>(
  customScalars: $CustomScalars,
): MergeDefaultsFn<GuardedType<$CustomScalars[number]>> => {
  return (defaults, input) => mergeDefaults_(defaults, input, customScalars) as any
}

// dprint-ignore
export type SetAtPath<
  $Object extends object,
  $Path extends string[],
  $Value,
> =
  $Path extends []
    ? $Object
    : $Path extends [infer $Key extends string, ...infer $PathRest extends string[]]
      ? $PathRest extends []
        ? Omit<$Object, $Key> & { [_ in $Key]: $Value }
        : $Key extends keyof $Object
          ? $Object[$Key] extends object
            ? Omit<$Object, $Key> & { [_ in $Key]: SetAtPath<$Object[$Key], $PathRest, $Value> }
            : Omit<$Object, $Key> & { [_ in $Key]: SetAtPath<{}, $PathRest, $Value> }
        : $Object & { [_ in $Key]: SetAtPath<{}, $PathRest, $Value> }
      : never

type MergeDefaultsFn<$CustomScalars> = <$Defaults extends object, $Input extends undefined | PartialDeep<$Defaults>>(
  defaults: $Defaults,
  input?: $Input,
) => Ts.Simplify.Top<MergeDefaults<$Defaults, $Input, $CustomScalars>>

type MergeDefaultsInnerFn = (
  defaults: object,
  input: object | undefined,
  customScalars: CustomScalarGuard[],
) => object

type CustomScalarGuard = (value: object) => boolean

const isUrl = (value: object): value is URL => value instanceof URL

export const mergeDefaults = createMerger([isAnyFunction, isDate, isUrl])

const mergeDefaults_: MergeDefaultsInnerFn = (
  defaults,
  input,
  customScalars,
) => {
  if (input === undefined) {
    return defaults
  }

  const i = input as Record<string, any>
  const d = defaults as Record<string, any>

  for (const key in d) {
    const defaultValue = d[key]

    if (key in i && i[key] !== undefined) {
      const inputValue = i[key]
      if (Obj.Type.is(defaultValue)) {
        if (Obj.Type.is(inputValue)) {
          const isCustomScalar = customScalars.some(isCustomScalar => isCustomScalar(inputValue))
          if (!isCustomScalar) {
            mergeDefaults_(inputValue, defaultValue, customScalars)
          }
        } else {
          throw new Error(
            `Mismatch between defaults and input. Defaults expect an object at this node. Input was: ${
              String(inputValue)
            }`,
          )
        }
      }
    } else {
      i[key] = defaultValue
    }
  }

  return i
}

type Path = [...string[]]

export type AppendOptional<$Array extends any[], $Value> = $Value extends undefined ? $Array : [...$Array, $Value]

// dprint-ignore
export type GetAtPathOrDefault<$Obj, $Path extends Path, $Default> =
  OrDefault<GetOptional<$Obj, $Path>, $Default>

// dprint-ignore
export type GetOptional<$Value, $Path extends [...string[]]> =
  $Value extends undefined                                              ? undefined :
  $Path extends [infer P1 extends string, ...infer PN extends string[]] ? $Value extends object
                                                                          ?	P1 extends keyof $Value
                                                                            ? GetOptional<$Value[P1], PN>
                                                                            : undefined
                                                                          : undefined
                                                                        : $Value

// /**
//  * Merge new properties from the second object into the first object.
//  * If those properties already exist in the first object they will be overwritten.
//  */
// // dprint-ignore
// export type SetProperties<$Object1 extends object, $Object2 extends object> =
//     Simplify<Omit<$Object1, keyof $Object2> & $Object2>

// dprint-ignore
export type SetMany<$Obj extends object, $Sets extends [Path, any][]> =
  $Sets extends []                                                                        ? $Obj :
  $Sets extends [infer $Set extends [Path, any], ...infer $SetRest extends [Path, any][]] ? SetMany<
                                                                                              SetKeyAtPath<$Obj, $Set[0], $Set[1]>,
                                                                                              $SetRest
                                                                                            > :
                                                                                            never

// dprint-ignore
export type UpdateKeyWithAppendOne<
  $Obj extends object,
  $Prop extends keyof $Obj,
  $Type,
> =
  SetKey<
    $Obj,
    $Prop,
  // @ts-expect-error
    [...$Obj[$Prop], $Type]
  >

// dprint-ignore
export type UpdateKeyWithAppendMany<
  $Obj extends object,
  $Prop extends keyof $Obj,
  $Type extends readonly any[],
> =
  SetKey<
    $Obj,
    $Prop,
    // @ts-expect-error
    [...$Obj[$Prop], ...$Type]
  >

export type UpdateKeyWithIntersection<
  $Obj extends object,
  $PropertyName extends keyof $Obj,
  $Type extends object,
> =
  & $Obj
  & {
    [_ in $PropertyName]: $Type
  }

// // dprint-ignore
// export type SetKeysExtends<
//   $ObjConstraint extends object,
//   $Obj extends $ObjConstraint,
//   $NewObjValues extends Partial<$ObjConstraint>,
// > =
//   SetKeys<$Obj, $NewObjValues>

/**
 * Set a batch of keys on an object.
 * Each key in the batch REPLACES the key on the target object.
 *
 * If the batch contains a key that does not exist on the target object,
 * then the key is IGNORED.
 */
// dprint-ignore
export type SetKeysOptional<
  $Obj extends object,
  $NewObjValues extends object,
> = {
  [_ in keyof $Obj]:
    _ extends keyof $NewObjValues
      ? Undefined.Exclude<$NewObjValues[_]> extends never
        ? $Obj[_]
        : Undefined.Exclude<$NewObjValues[_]>
      : $Obj[_]
}

export type SetKey<
  $Obj extends object,
  $PropertyName extends keyof $Obj,
  $Type extends $Obj[$PropertyName],
> =
  & {
    [_ in keyof $Obj as _ extends $PropertyName ? never : _]: $Obj[_]
  }
  & {
    [_ in $PropertyName]: $Type
  }

export type SetKeyUnsafe<
  $Obj extends object,
  $PropertyName extends keyof $Obj,
  $Type,
> =
  & {
    [_ in keyof $Obj as _ extends $PropertyName ? never : _]: $Obj[_]
  }
  & {
    [_ in $PropertyName]: $Type
  }

// // dprint-ignore
// export type IntersectAtKeyPath<$Obj extends object, $Path extends Path, $Value> =
//   $Path extends []
//     ? $Value extends object
//       ? $Obj & $Value
//       : never
//     : IntersectAtKeyPath_<$Obj, $Path, $Value>

// // dprint-ignore
// export type IntersectAtKeyPath_<$ObjOrValue, $Path extends Path, $Value> =
//       $Path extends [infer $P1 extends string, ...infer $PN extends string[]] ?
//         $P1 extends keyof $ObjOrValue
//             ? $ObjOrValue & { [_ in $P1]: IntersectAtKeyPath_<$ObjOrValue[$P1], $PN, $Value> }
//             // If we use a nice error display here (like the following comment) it will mess with the result type in variable cases.
//              // `Error: Cannot set value at path in object. Path property "${$P1}" does not exist in object.`
//             : never
//         : $Value

// dprint-ignore
export type SetKeyAtPath<$Obj extends object, $Path extends Path, $Value> =
    Ts.Simplify.Top<
      $Path extends []
        ? $Value extends object
          ? $Obj & $Value
          : never
        : SetKeyAtPath_<$Obj, $Path, $Value>
    >
// dprint-ignore
type SetKeyAtPath_<$ObjOrValue, $Path extends Path, $Value> =
    Ts.Simplify.Top<
      $Path extends [infer $P1 extends string, ...infer $PN extends string[]] ?
        $P1 extends keyof $ObjOrValue
            ? Omit<$ObjOrValue, $P1> & { [_ in $P1]: SetKeyAtPath_<$ObjOrValue[$P1], $PN, $Value> }
            // If we use a nice error display here (like the following comment) it will mess with the result type in variable cases.
             // `Error: Cannot set value at path in object. Path property "${$P1}" does not exist in object.`
            : never
        : $Value
    >
