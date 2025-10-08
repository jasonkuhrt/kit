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
  .casesInAsArgs('primitives')(
    ['hello',    () => undefined],
    [42,         () => undefined],
    [true,       () => undefined],
    [null,       () => undefined],
  )
  .casesInAsArgs('empty objects')(
    [{},         uppercaseKeysTransform],
  )
  .casesInAsArgs('key transformations')(
    [{ $foo: 'bar', $baz: { $nested: 'value' } },       stripDollarPrefix],
    [{ $a: { $b: { $c: { $d: 'deep' } } } },            stripDollarPrefix],
    [{ $foo: 'a', bar: 'b', $baz: { nested: 'c' } },    stripDollarPrefix],
  )
  .casesInAsArgs('value transformations')(
    [{ name: 'alice', address: { city: 'nyc' } },       uppercaseStrings],
    [{ str: 'hi', num: 42, bool: true, nil: null },     uppercaseStrings],
  )
  .casesInAsArgs('arrays')(
    [{ users: [{ $id: 1, $name: 'alice' }, { $id: 2, $name: 'bob' }] },  stripDollarPrefix],
    [{ numbers: [1, 2, 3], strings: ['a', 'b'] },                        () => undefined],
  )
  .casesInAsArgs('mixed structures')(
    [{ str: 'hello', arr: [1, 'two', { nested: 'obj' }], obj: { inner: 'value' } }, uppercaseStrings],
  )
  .casesInAsArgs('selective transformations')(
    [{ keep: 'me', transform: 'this' },  selectiveTransform],
  )
  .casesInAsArgs('combined transformations')(
    [{ $name: 'alice', age: 25, $email: 'alice@example.com' }, combinedTransform],
  )
  .test()
