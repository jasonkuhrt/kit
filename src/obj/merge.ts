import { Arr } from '#arr/index.js'
import { Language } from '#language/index.js'
import type { Rec } from '#rec/index.js'
import { type Any, is } from './obj.js'

interface MergeOptions {
  undefined?: boolean
  defaults?: boolean
  array?: (arr1: unknown[], arr2: unknown[]) => Language.SideEffect
}

// dprint-ignore
/*@__NO_SIDE_EFFECTS__*/
export const mergeWith =
	(mergers?: MergeOptions) =>
		<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2): obj1 & obj2 =>
			_mergeWith<obj1, obj2>(mergers ?? {}, obj1, obj2)

export const merge: <obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2 = mergeWith() as any

export const mergeWithArrayPush = mergeWith({
  array: (a, b) => {
    a.push(...b)
  },
})

export const mergeWithArrayPushDedupe = mergeWith({
  array: (a, b) => {
    a.push(...b)
    Arr.dedupe(a)
  },
})

export const mergeDefaults: <
  obj1 extends Any,
  obj1Defaults extends Partial<obj1>,
>(
  obj1: obj1,
  obj1Defaults: obj1Defaults,
) => obj1 & obj1Defaults = mergeWith({ defaults: true })

// dprint-ignore
export type MergeShallow<
  $Object1 extends Any,
  $Object2 extends Any,
  __ =
    {} extends $Object1
      ? $Object2
      : & $Object2
        // Keys from $Object1 that are NOT in $Object2
        & {
            [__k__ in keyof $Object1 as __k__ extends keyof $Object2 ? never : __k__]: $Object1[__k__]
          }
> = __

// ---- INTERNALS ----

const _mergeWith = <obj1 extends Any, obj2 extends Any>(
  options: MergeOptions,
  obj1: obj1,
  obj2: obj2,
): obj1 & obj2 => {
  const obj1_AS = obj1 as Rec.Value
  const obj2_AS = obj2 as Rec.Value

  for (const k2 in obj2_AS) {
    const obj1Value = obj1_AS[k2]
    const obj2Value = obj2_AS[k2]

    if (is(obj2Value) && is(obj1Value)) {
      obj1_AS[k2] = _mergeWith(options, obj1Value, obj2Value)
      continue
    }

    if (Arr.is(obj2Value) && Arr.is(obj1Value) && options.array) {
      options.array(obj1Value, obj2Value)
      obj1_AS[k2] = obj1Value
      continue
    }

    if (obj2Value === undefined && options.undefined !== true) {
      continue
    }

    if (obj1Value !== undefined && options.defaults === true) {
      continue
    }

    obj1_AS[k2] = obj2Value
  }

  return obj1 as any
}
