import { Codec } from '#codec'
import { describe, expect, test } from 'vitest'

describe('create', () => {
  test('creates default string codec', () => {
    const stringCodec = Codec.create()

    expect(stringCodec.encode('hello')).toBe('hello')
    expect(stringCodec.decode('world')).toBe('world')
    expect(stringCodec.encode(String(123))).toBe('123')
    expect(stringCodec.encode(String(true))).toBe('true')
  })

  test('creates custom JSON codec', () => {
    const jsonCodec = Codec.create<any>({
      encode: JSON.stringify,
      decode: JSON.parse,
    })

    const testObject = { a: 1, b: 'hello', c: [1, 2, 3] }
    const encoded = jsonCodec.encode(testObject)
    const decoded = jsonCodec.decode(encoded)

    expect(encoded).toBe('{"a":1,"b":"hello","c":[1,2,3]}')
    expect(decoded).toEqual(testObject)
  })

  test('creates codec with custom encode only', () => {
    const upperCodec = Codec.create<string>({
      encode: (data: string) => data.toUpperCase(),
    })

    expect(upperCodec.encode('hello')).toBe('HELLO')
    expect(upperCodec.decode('world')).toBe('world') // Uses identity by default
  })

  test('creates codec with custom decode only', () => {
    const lowerCodec = Codec.create<string>({
      decode: (data: string) => data.toLowerCase(),
    })

    expect(lowerCodec.encode('Hello')).toBe('Hello') // Uses String() by default
    expect(lowerCodec.decode('WORLD')).toBe('world')
  })

  test('creates number codec', () => {
    const numberCodec = Codec.create<number>({
      encode: String,
      decode: Number,
    })

    expect(numberCodec.encode(42)).toBe('42')
    expect(numberCodec.decode('123')).toBe(123)
    expect(numberCodec.decode('3.14')).toBe(3.14)
  })

  test('creates boolean codec', () => {
    const boolCodec = Codec.create<boolean>({
      encode: (b: boolean) => b ? 'true' : 'false',
      decode: (s: string) => s === 'true',
    })

    expect(boolCodec.encode(true)).toBe('true')
    expect(boolCodec.encode(false)).toBe('false')
    expect(boolCodec.decode('true')).toBe(true)
    expect(boolCodec.decode('false')).toBe(false)
    expect(boolCodec.decode('anything')).toBe(false)
  })

  test('handles complex data structures', () => {
    interface User {
      id: number
      name: string
      active: boolean
    }

    const userCodec = Codec.create<User>({
      encode: (user: User) => JSON.stringify(user),
      decode: (data: string) => JSON.parse(data) as User,
    })

    const user: User = { id: 1, name: 'Alice', active: true }
    const encoded = userCodec.encode(user)
    const decoded = userCodec.decode(encoded)

    expect(decoded).toEqual(user)
    expect(decoded.id).toBe(1)
    expect(decoded.name).toBe('Alice')
    expect(decoded.active).toBe(true)
  })

  test('works with empty configuration', () => {
    const defaultCodec = Codec.create({})

    expect(defaultCodec.encode('test')).toBe('test')
    expect(defaultCodec.decode('test')).toBe('test')
  })
})

describe('type definitions', () => {
  test('Codec interface has correct shape', () => {
    const codec = Codec.create<string>()

    expect(typeof codec.encode).toBe('function')
    expect(typeof codec.decode).toBe('function')
  })

  test('Encode type preserves input type', () => {
    // Type-level test - this should compile
    const encode: Codec.Encode<number> = (n: number) => String(n)
    expect(encode(42)).toBe('42')
  })

  test('Decode type returns expected type', () => {
    // Type-level test - this should compile
    const decode: Codec.Decode<number> = (s: string) => Number(s) as any
    expect(decode('42')).toBe(42)
  })
})
