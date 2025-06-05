import { Arr } from '#arr/index.js'
import { Obj } from '#obj/index.js'
import { expect, expectTypeOf, test } from 'vitest'
import { Test } from '../test/index.js'
import { Idx } from './index.js'

const c = Idx.create

interface CaseInstructions extends Test.CaseInstructions {
  set?: Arr.Maybe<any>
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

// dprint-ignore
const cases = Test.cases<CaseInstructions>([
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
])

test.for(cases)('%j', ([_, instructions]) => {
  const idx = instructions.options?.fromArray
    ? Idx.fromArray(instructions.options.fromArray, instructions.options)
    : c(instructions.options)

  if ('set' in instructions) {
    for (const item of Arr.sure(instructions.set)) {
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
  const kop = () => Arr.getRandomly([p, o])
  const modeAny = Obj.getRandomly(Idx.Mode)
  type o = typeof o
  type p = typeof p
  type op = o | p

  expectTypeOf<Idx.InferModeOptions<p>>().toEqualTypeOf<Idx.ModeFor.PrimitiveKey>
  expectTypeOf<Idx.InferModeOptions<op>>().toEqualTypeOf<Idx.ModeFor.PrimitiveKey>
  expectTypeOf<Idx.InferModeOptions<o>>().toEqualTypeOf<Idx.ModeFor.ObjectKey>
  expectTypeOf<Idx.InferModeOptions<unknown>>().toEqualTypeOf<Idx.ModeFor.Unknown>
  expectTypeOf<Idx.InferModeOptions<any>>().toEqualTypeOf<Idx.ModeFor.Unknown>

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
  c({ mode: modeAny })
})
