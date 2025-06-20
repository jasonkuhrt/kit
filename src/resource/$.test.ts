import { Fs } from '#fs'
import { Json } from '#json'
import { Path } from '#path'
import { Resource } from '#resource'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, test } from 'vitest'

describe('emptyValue input', () => {
  afterEach(async () => {
    await Fs.remove(path)
  })
  const invalid = new Date()
  const name = 'test'
  const emptyValue = Object.freeze({ empty: true })
  const path = Path.join(tmpdir(), Math.random().toString() + '-test.json')
  const codec = Json.codec
  const args = { name, codec, path }

  test('can be lazy', async () => {
    const r1 = Resource.create({ emptyValue: () => emptyValue, ...args })
    expect(await r1.readOrEmpty()).toEqual(emptyValue)
  })

  test('can be non-lazy', async () => {
    const resource = Resource.create({ emptyValue, ...args })
    expect(await resource.readOrEmpty()).toEqual(emptyValue)
  })

  test('is type checked', async () => {
    // @ts-expect-error
    Resource.create({ emptyValue: invalid, ...args })
    // @ts-expect-error
    Resource.create({ emptyValue: () => invalid, ...args })
  })
})
