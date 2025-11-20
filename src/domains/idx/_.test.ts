import { ArrMut } from '#arr-mut'
import { Idx } from '#idx'
import { Obj } from '#obj'
import { property } from '#test/test'
import { Ts } from '#ts'
import fc from 'fast-check'
import { expect, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

test('empty index has no items', () => {
  const idx = Idx.create()
  expect(idx.toArray()).toEqual([])
  expect(idx.toMap().size).toBe(0)
})

property(
  'stores and retrieves values',
  fc.oneof(
    fc.array(fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null))),
    fc.array(fc.object()),
  ),
  (values) => {
    const idx = Idx.create()
    values.forEach(v => idx.set(v))
    values.forEach(v => expect(idx.get(v)).toBe(v))
  },
)

property(
  'key function maps items correctly',
  fc.array(fc.record({ id: fc.integer(), data: fc.anything() })),
  (items) => {
    const idx = Idx.create({ key: (item: any) => item.id })
    items.forEach(item => idx.set(item))
    items.forEach(item => {
      const found = idx.get({ id: item.id, data: 'different' })
      expect(found?.id).toBe(item.id)
    })
  },
)

property('updates preserve key mapping', fc.array(fc.record({ id: fc.integer(), version: fc.integer() })), (items) => {
  const idx = Idx.create({ key: (item: any) => item.id })
  items.forEach(item => idx.set(item))
  const uniqueIds = [...new Set(items.map(i => i.id))]
  expect(idx.toArray()).toHaveLength(uniqueIds.length)
})

property(
  'setAt/getAt work with explicit keys',
  fc.oneof(
    fc.array(fc.tuple(fc.oneof(fc.integer(), fc.string()), fc.anything())),
    fc.array(fc.tuple(fc.object(), fc.anything())),
  ),
  (pairs) => {
    const idx = Idx.create()
    pairs.forEach(([k, v]) => idx.setAt(k, v))

    // Build expected map to handle duplicate keys (last value wins)
    // Filter to only primitive keys for Map
    const isMapCompatible = (k: unknown): k is string | number => typeof k === 'string' || typeof k === 'number'

    const mapCompatiblePairs = pairs.filter(([k]) => isMapCompatible(k)) as Array<[string | number, unknown]>
    const expectedMap = new Map(mapCompatiblePairs)

    expectedMap.forEach((expectedValue, key) => {
      const actualValue = idx.getAt(key)
      if (typeof expectedValue === 'object' && expectedValue !== null) {
        expect(actualValue).toEqual(expectedValue)
      } else {
        expect(actualValue).toBe(expectedValue)
      }
    })

    // Also verify object keys still work
    pairs.filter(([k]) => !isMapCompatible(k)).forEach(([k, v]) => {
      expect(idx.getAt(k)).toEqual(v)
    })
  },
)

property(
  'delete removes items',
  fc.oneof(
    fc.array(fc.oneof(fc.integer(), fc.string())),
    fc.array(fc.object()),
  ),
  (values) => {
    const idx = Idx.create()
    values.forEach(v => idx.set(v))
    const toDelete = values.slice(0, Math.floor(values.length / 2))
    toDelete.forEach(v => idx.delete(v))
    toDelete.forEach(v => expect(idx.get(v)).toBeUndefined())
  },
)

property(
  'maintains insertion order',
  fc.oneof(
    fc.array(fc.oneof(fc.integer(), fc.string()).filter(v => v !== undefined)),
    fc.array(fc.object().filter(v => v !== undefined)),
  ),
  (values) => {
    const idx = Idx.create()
    // Set doesn't work with objects as values, handle separately
    let unique: unknown[]
    if (values.length > 0 && Obj.is(values[0])) {
      // For objects, use manual deduplication
      unique = values.filter((v, i) => values.findIndex(v2 => JSON.stringify(v2) === JSON.stringify(v)) === i)
    } else {
      unique = [...new Set(values as (string | number)[])] as unknown[]
    }
    unique.forEach(v => idx.set(v))
    expect(idx.toArray()).toEqual(unique)
  },
)

property(
  'toMap contains all entries',
  fc.array(fc.tuple(fc.oneof(fc.integer(), fc.string()), fc.anything())),
  (pairs) => {
    const idx = Idx.create()
    pairs.forEach(([k, v]) => idx.setAt(k, v))
    const map = idx.toMap()
    // For duplicate keys, only the last value should be in the map
    const expectedMap = new Map(pairs)
    expectedMap.forEach((v, k) => {
      expect(map.get(k)).toBe(v)
    })
  },
)

property(
  'fromArray creates correct index',
  fc.oneof(
    fc.array(fc.oneof(fc.integer(), fc.string())),
    fc.array(fc.object()),
  ),
  (values) => {
    const idx = Idx.fromArray(values as any[])
    // Idx stores unique values like a Set when no key function is provided
    let uniqueValues: unknown[]
    const isObjectArray = values.length > 0 && typeof values[0] === 'object' && values[0] !== null
    if (isObjectArray) {
      // For objects, Idx keeps all objects as they have different identities
      // even if they have the same shape/values
      uniqueValues = values
    } else {
      uniqueValues = [...new Set(values as (string | number)[])] as unknown[]
    }
    expect(idx.toArray()).toEqual(uniqueValues)

    if (isObjectArray) {
      ;(values as Record<string, unknown>[]).forEach(v => expect(idx.get(v)).toBe(v))
    } else {
      ;(values as (string | number)[]).forEach(v => expect(idx.get(v)).toBe(v))
    }
  },
)

const c = Idx.create

// TODO: Rewrite this test to use the new Test.Case API
// The old CaseInstructions API has been removed
interface CaseInstructions {
  set?: ArrMut.Maybe<any>
  setAt?: [key: any, item: any]
  get?: [item: any, expectedValue: any]
  getAt?: [key: any, expectedValue: any]
  delete?: any
  deleteAt?: any
  options?: Idx.Options & { fromArray?: any[] }
  data?: { array?: any[]; map?: Map<any, any> }
}

const o1 = { id: 1, a: true }
const o1b = { id: 1, b: true }
const o2 = { id: 2 }

const key = (item: any) => item.id

// TODO: Rewrite using new Test.Case API
// dprint-ignore
const cases: Array<[string, CaseInstructions]> = [
  ['empty',                          {                                                                    data: { array: [], map: new Map() } }],

  ['get: undefined',                 { get: [1, undefined] }],
  ['get: obj not found',             { set: o1,                              get: [o2, undefined] }],

  ['set: scalar',                    { set: 1,                                                            data: { array: [1], map: new Map([[1, 1]])} }],
  ['set: string',                    { set: 'a',                                                          data: { array: ['a'], map: new Map([['a', 'a']])} }],
  ['set: obj',                       { set: o1,                                                           data: { array: [o1], map: new Map([[o1, o1]])} }],
  ['set: null',                      { set: null,                                                         data: { array: [null], map: new Map([[null, null]])} }],

  ['set with keyer: obj',            { options: { key },       set: o1,                                   data: { array: [o1], map: new Map([[o1.id, o1]])}  }],
  ['set with keyer: string key',     { options: { key: ($) => `key-${$}` }, set: 1,                       data: { array: [1], map: new Map([['key-1', 1]])}  }],

  ['get: scalar',                    { set: 1,                               get: [1, 1] }],
  ['get: obj',                       { set: o1,                              get: [o1, o1] }],
  ['get: with keyer',                { options: { key },      set: o1,   get: [o1, o1] }],

  ['mode: explicit map',             { options: { mode: 'strong' },             set: o1,                     data: { array: [o1] } }],
  ['mode: explicit weakMap',         { options: { mode: 'weak' },         set: o1,                     data: { array: [o1] } }],
  ['mode: auto with object',         { set: o1,                                                           data: { array: [o1] } }],
  ['mode: auto with primitive',      { set: 1,                                                            data: { array: [1], map: new Map([[1, 1]])} }],

  ['update: same key',               { options: { key },      set: [o1, o1b],                        data: { array: [o1b], map: new Map([[o1b.id, o1b]])} }],
  ['update: with keyer',             { options: { key },      set: [o1, { id: 1, name: 'updated' }], data: { array: [{ id: 1, name: 'updated' }] } }],

  ['getAt: direct key',              { set: o1,                              getAt: [o1, o1] }],
  ['getAt: with keyer',              { options: { key },      set: o1,     getAt: [1, o1] }],
  ['getAt: not found',               { set: o1,                              getAt: [o2, undefined] }],

  ['setAt: new item',                { options: { key },      setAt: [1, o1],                  data: { array: [o1], map: new Map([[o1.id, o1]])} }],
  // Weird case because the item and the id no longer match: index @ 1 has item with ID 2
  ['setAt: update existing badly',   { options: { key },      set: o1,   setAt: [o1.id, o2],   data: { array: [o2], map: new Map([[o1.id, o2]])} }],

  ['delete: existing',               { set: [o1, o2],                          delete: o1,                data: { array: [o2] } }],
  ['delete: not found',              { set: o1,                                delete: o2,                data: { array: [o1] } }],
  ['delete: with keyer',             { options: { key },      set: [o1, o2], delete: o1,                  data: { array: [o2] } }],

  ['deleteAt: by key',               { set: o1,                              deleteAt: o1,                data: { array: [] } }],
  ['deleteAt: with keyer',           { options: { key },      set: o1,     deleteAt: 1,                   data: { array: [] } }],
  ['deleteAt: not found',            { set: o1,                              deleteAt: o2,                data: { array: [o1] } }],

  ['fromArray: empty',               { options: { fromArray: [] },                                        data: { array: [], map: new Map() } }],
  ['fromArray: items',               { options: { fromArray: [1, 2, 3] },                                 data: { array: [1, 2, 3] } }],
  ['fromArray: with keyer',          { options: { fromArray: [o1, o2], key: key },                        data: { array: [o1, o2], map: new Map([[1, o1], [2, o2]]) } }],
]

// TODO: Update to use Test.each or test.for with proper Test.Case format
test.for(cases)('%j', ([_, instructions]: [string, CaseInstructions]) => {
  const idx = instructions.options?.fromArray
    ? Idx.fromArray(instructions.options.fromArray, instructions.options)
    : c(instructions.options)

  if ('set' in instructions) {
    for (const item of ArrMut.sure(instructions.set)) {
      idx.set(item)
    }
  }

  if ('setAt' in instructions) {
    const [key, item] = instructions.setAt
    idx.setAt(key, item)
  }

  if ('delete' in instructions) {
    idx.delete(instructions.delete)
  }

  if ('deleteAt' in instructions) {
    idx.deleteAt(instructions.deleteAt)
  }

  if ('get' in instructions) {
    const [item, expectedValue] = instructions.get
    expect(idx.get(item)).toBe(expectedValue)
  }

  if ('getAt' in instructions) {
    const [key, expectedValue] = instructions.getAt
    expect(idx.getAt(key)).toBe(expectedValue)
  }

  if (instructions.data?.array) {
    expect(idx.toArray()).toMatchObject(instructions.data.array)
  }
  if (instructions.data?.map) {
    expect(idx.toMap()).toMatchObject(instructions.data.map)
  }
})

test('type: mode is conditional to key', () => {
  const p = 1
  const o = { x: 0 }
  const kp = () => p
  const ko = () => o
  const kop = () => ArrMut.getRandomly([p, o])
  const modeAny = Obj.getRandomly(Idx.Mode)
  type o = typeof o
  type p = typeof p
  type op = o | p

  A<Idx.ModeFor.PrimitiveKey>().onAs<Idx.InferModeOptions<op>>()
  A<Idx.ModeFor.PrimitiveKey>().onAs<Idx.InferModeOptions<p>>()
  // @ts-expect-error Type relationship mismatch
  A<Idx.ModeFor.ObjectKey>().on({} as Idx.InferModeOptions<unknown>)
  // @ts-expect-error Type relationship mismatch
  A<Idx.ModeFor.Unknown>().on({} as Idx.InferModeOptions<o>)
  A<Idx.ModeFor.Unknown>().onAs<Idx.InferModeOptions<any>>()

  // ━ Via primitive Key
  // @ts-expect-error
  c({ key: kp, mode: 'weak' })
  c({ key: kp, mode: 'auto' })
  c({ key: kp, mode: 'strong' })
  // ━ Via mixed Key
  // @ts-expect-error
  c({ key: kop, mode: 'weak' })
  c({ key: kop, mode: 'auto' })
  c({ key: kop, mode: 'strong' })
  // ━ Via object key
  // @ts-expect-error
  c({ key: ko, mode: 'strong' })
  c({ key: ko, mode: 'auto' })
  c({ key: ko, mode: 'weak' })
  // ━ Via unknown key
  c({ mode: modeAny as any })
})
