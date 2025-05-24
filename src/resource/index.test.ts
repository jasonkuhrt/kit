import { Fs } from '#fs/index.js'
import { Json } from '#json/index.js'
import { Path } from '#path/index.js'
import { afterEach, describe } from 'node:test'
import { expect, test } from 'vitest'
import { create } from './resource.js'

describe('emptyValue input', () => {
  afterEach(async () => {
    await Fs.remove(path)
  })
  const invalid = new Date()
  const name = 'test'
  const emptyValue = Object.freeze({ empty: true })
  const path = Path.join(Path.tmpDirectory, Math.random().toString() + '-test.json')
  const codec = Json.codec
  const args = { name, codec, path }

  test('can be lazy', async () => {
    const r1 = create({ emptyValue: () => emptyValue, ...args })
    expect(await r1.readOrEmpty()).toEqual(emptyValue)
  })

  test('can be non-lazy', async () => {
    const resource = create({ emptyValue, ...args })
    expect(await resource.readOrEmpty()).toEqual(emptyValue)
  })

  test('is type checked', async () => {
    // @ts-expect-error
    create({ emptyValue: invalid, ...args })
    // @ts-expect-error
    create({ emptyValue: () => invalid, ...args })
  })
})
