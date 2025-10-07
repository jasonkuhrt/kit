import { Obj } from '#obj'
import { Test } from '#test'

const stripDollarPrefix = (key: string, value: Obj.DeepObjectValue) =>
  key.startsWith('$') ? { key: key.slice(1), value } : undefined

const uppercaseStrings = (key: string, value: Obj.DeepObjectValue) =>
  typeof value === 'string' ? { key, value: value.toUpperCase() } : undefined

const uppercaseKeysTransform = (key: string, value: Obj.DeepObjectValue) => ({ key: key.toUpperCase(), value })

const selectiveTransform = (key: string, value: Obj.DeepObjectValue) =>
  key === 'transform' ? { key, value: 'TRANSFORMED' } : undefined

const combinedTransform = (key: string, value: Obj.DeepObjectValue) => {
  if (key.startsWith('$')) {
    return { key: key.slice(1), value: typeof value === 'string' ? value.toUpperCase() : value }
  }
  return undefined
}

// dprint-ignore
Test.on(Obj.mapEntriesDeep)
  .describe('primitives')
  .casesAsArgs(
    ['hello',    () => undefined],
    [42,         () => undefined],
    [true,       () => undefined],
    [null,       () => undefined],
  )
  .describe('empty objects')
  .casesAsArgs(
    [{},         uppercaseKeysTransform],
  )
  .describe('key transformations')
  .casesAsArgs(
    [{ $foo: 'bar', $baz: { $nested: 'value' } },       stripDollarPrefix],
    [{ $a: { $b: { $c: { $d: 'deep' } } } },            stripDollarPrefix],
    [{ $foo: 'a', bar: 'b', $baz: { nested: 'c' } },    stripDollarPrefix],
  )
  .describe('value transformations')
  .casesAsArgs(
    [{ name: 'alice', address: { city: 'nyc' } },       uppercaseStrings],
    [{ str: 'hi', num: 42, bool: true, nil: null },     uppercaseStrings],
  )
  .describe('arrays')
  .casesAsArgs(
    [{ users: [{ $id: 1, $name: 'alice' }, { $id: 2, $name: 'bob' }] },  stripDollarPrefix],
    [{ numbers: [1, 2, 3], strings: ['a', 'b'] },                        () => undefined],
  )
  .describe('mixed structures')
  .casesAsArgs(
    [{ str: 'hello', arr: [1, 'two', { nested: 'obj' }], obj: { inner: 'value' } }, uppercaseStrings],
  )
  .describe('selective transformations')
  .casesAsArgs(
    [{ keep: 'me', transform: 'this' },  selectiveTransform],
  )
  .describe('combined transformations')
  .casesAsArgs(
    [{ $name: 'alice', age: 25, $email: 'alice@example.com' }, combinedTransform],
  )
  .test()
