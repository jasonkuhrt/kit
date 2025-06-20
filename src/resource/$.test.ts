import { Codec } from '#codec'
import { Err } from '#err'
import { Fs } from '#fs'
import { Path } from '#path'
import { Resource } from '#resource'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { z } from 'zod/v4'

describe('Resource with union error handling', () => {
  let testDir: string
  let testPath: string

  beforeEach(() => {
    testDir = Path.join(tmpdir(), `resource-test-${Date.now()}`)
    testPath = Path.join(testDir, 'test.json')
  })

  afterEach(async () => {
    await Fs.remove(testDir).catch(() => {})
  })

  test('read returns ResourceErrorNotFound when file missing', async () => {
    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    const result = await resource.read()

    expect(Resource.Errors.isNotFound(result)).toBe(true)
    if (Resource.Errors.isNotFound(result)) {
      expect(result.resourceName).toBe('test')
      expect(result.filePath).toBe(testPath)
    }
  })

  test('read returns data when file exists', async () => {
    const data = { value: 'test' }
    await Fs.write({ path: testPath, content: JSON.stringify(data) })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    const result = await resource.read()

    expect(result).toEqual(data)
  })

  test('read returns ResourceErrorDecodeFailed on invalid JSON', async () => {
    await Fs.write({ path: testPath, content: '{ invalid json' })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    const result = await resource.read()

    expect(Resource.Errors.isDecodeFailed(result)).toBe(true)
    if (Resource.Errors.isDecodeFailed(result)) {
      expect(result.cause).toBeInstanceOf(SyntaxError)
    }
  })

  test('readOrEmpty returns empty value when file missing', async () => {
    const emptyValue = { value: 'default' }
    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue,
    })

    const result = await resource.readOrEmpty()

    expect(result).toEqual(emptyValue)
  })

  test('readOrEmpty returns error on decode failure', async () => {
    await Fs.write({ path: testPath, content: '{ invalid json' })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    const result = await resource.readOrEmpty()

    expect(Resource.Errors.isDecodeFailed(result)).toBe(true)
  })

  test('assertExists returns void when file exists', async () => {
    await Fs.write({ path: testPath, content: '{}' })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: {},
    })

    const result = await resource.assertExists()

    expect(result).toBeUndefined()
  })

  test('assertExists returns error when file missing', async () => {
    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: {},
    })

    const result = await resource.assertExists()

    expect(Resource.Errors.isNotFound(result)).toBe(true)
  })

  test('errors can be checked with Err.is', async () => {
    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    const result = await resource.read()

    // Check if it's an error at all
    expect(Err.is(result)).toBe(true)

    // Can also use specific error type checks
    expect(Resource.Errors.is(result)).toBe(true)
    expect(Resource.Errors.isNotFound(result)).toBe(true)
  })

  test('update creates file with empty value if missing', async () => {
    const resource = Resource.create<'test', { count: number }>({
      name: 'test',
      path: testPath,
      emptyValue: { count: 0 },
    })

    const result = await resource.update(data => {
      data.count = 5
    })

    expect(result).toBeUndefined()

    const content = await Fs.read(testPath)
    expect(JSON.parse(content!)).toEqual({ count: 5 })
  })

  test('cache works correctly', async () => {
    const data = { value: 'cached' }
    await Fs.write({ path: testPath, content: JSON.stringify(data) })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    // First read loads from disk
    const result1 = await resource.read()
    expect(result1).toEqual(data)

    // Delete file
    await Fs.remove(testPath)

    // Second read should still return cached value
    const result2 = await resource.read()
    expect(result2).toEqual(data)
  })

  describe('Zod integration', () => {
    const UserSchema = z.object({
      name: z.string(),
      age: z.number().positive(),
    })

    type User = z.infer<typeof UserSchema>

    test('validates data with Zod schema', async () => {
      const invalidData = { name: 'John', age: -5 }
      await Fs.write({ path: testPath, content: JSON.stringify(invalidData) })

      const resource = Resource.create({
        name: 'users',
        path: testPath,
        codec: Codec.fromZod(UserSchema),
        emptyValue: { name: 'Default', age: 18 },
      })

      const result = await resource.read()

      expect(Resource.Errors.isValidationFailed(result)).toBe(true)
      if (Resource.Errors.isValidationFailed(result)) {
        expect(result.errors).toHaveProperty('issues')
      }
    })

    test('accepts valid data with Zod schema', async () => {
      const validData: User = { name: 'John', age: 25 }
      await Fs.write({ path: testPath, content: JSON.stringify(validData) })

      const resource = Resource.create({
        name: 'users',
        path: testPath,
        codec: Codec.fromZod(UserSchema),
        emptyValue: { name: 'Default', age: 18 },
      })

      const result = await resource.read()

      expect(result).toEqual(validData)
    })
  })

  test('read and readOrEmpty share the same cache', async () => {
    const data = { value: 'shared' }
    await Fs.write({ path: testPath, content: JSON.stringify(data) })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    // First read loads from disk
    const result1 = await resource.read()
    expect(result1).toEqual(data)

    // Delete file
    await Fs.remove(testPath)

    // readOrEmpty should return cached value, not empty value
    const result2 = await resource.readOrEmpty()
    expect(result2).toEqual(data) // Shared cache returns the cached data

    // Regular read should also return cached value
    const result3 = await resource.read()
    expect(result3).toEqual(data)
  })

  test('write clears shared cache', async () => {
    const data1 = { value: 'first' }
    const data2 = { value: 'second' }
    await Fs.write({ path: testPath, content: JSON.stringify(data1) })

    const resource = Resource.create({
      name: 'test',
      path: testPath,
      emptyValue: { value: 'default' },
    })

    // Read and cache
    const result1 = await resource.read()
    expect(result1).toEqual(data1)

    // Write new data (should clear cache)
    await resource.write(data2)

    // Read should return new data from disk
    const result2 = await resource.read()
    expect(result2).toEqual(data2)
  })
})
