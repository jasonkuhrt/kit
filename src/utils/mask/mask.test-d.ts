import { expectTypeOf } from 'vitest'
import { Mask } from './$.js'

// Test InferOptions type
type User = { name: string; email: string; age: number; password: string }

// Boolean is always valid
expectTypeOf<boolean>().toMatchTypeOf<Mask.InferOptions<User>>()

// Array of keys
expectTypeOf<('name' | 'email')[]>().toMatchTypeOf<Mask.InferOptions<User>>()
expectTypeOf<('name' | 'email' | 'age' | 'password')[]>().toMatchTypeOf<Mask.InferOptions<User>>()

// Partial record with boolean values
expectTypeOf<{ name?: boolean; email?: boolean }>().toMatchTypeOf<Mask.InferOptions<User>>()
expectTypeOf<{ name?: boolean; email?: boolean; age?: boolean; password?: boolean }>().toMatchTypeOf<
  Mask.InferOptions<User>
>()

// Unknown type accepts all options
expectTypeOf<boolean>().toMatchTypeOf<Mask.InferOptions<unknown>>()
expectTypeOf<string[]>().toMatchTypeOf<Mask.InferOptions<unknown>>()
expectTypeOf<Record<string, boolean>>().toMatchTypeOf<Mask.InferOptions<unknown>>()

// Non-object types only accept boolean
expectTypeOf<boolean>().toMatchTypeOf<Mask.InferOptions<string>>()
expectTypeOf<string[]>().not.toMatchTypeOf<Mask.InferOptions<string>>()

// Test Apply type
type TestData = { a: string; b: number; c: boolean }

// Binary mask - show
type ShowResult = Mask.Apply<TestData, { type: 'binary'; show: true }>
expectTypeOf<ShowResult>().toEqualTypeOf<TestData>()

// Binary mask - hide
type HideResult = Mask.Apply<TestData, { type: 'binary'; show: false }>
expectTypeOf<HideResult>().toEqualTypeOf<undefined>()

// Properties mask - allow mode
type AllowResult = Mask.Apply<TestData, { type: 'properties'; mode: 'allow'; properties: ['a', 'c'] }>
expectTypeOf<AllowResult>().toEqualTypeOf<Pick<TestData, 'a' | 'c'>>()

// Properties mask - deny mode
type DenyResult = Mask.Apply<TestData, { type: 'properties'; mode: 'deny'; properties: ['b'] }>
expectTypeOf<DenyResult>().toEqualTypeOf<Omit<TestData, 'b'>>()

// Test mask creation and application
const userMask = Mask.pick<User>(['name', 'email'])
const user: User = { name: 'Alice', email: 'alice@example.com', age: 30, password: 'secret' }
const maskedUser = Mask.apply(user, userMask)
// Type should be Pick<User, 'name' | 'email'>
type MaskedUserType = typeof maskedUser
const _maskedUserTypeTest: MaskedUserType = { name: 'test', email: 'test@example.com' }

// Test applyPartial
const partialUser: Partial<User> = { name: 'Bob' }
const partialMasked = Mask.applyPartial(partialUser, userMask)
// Type should be Pick<Partial<User>, 'name' | 'email'>
type PartialMaskedType = typeof partialMasked
const _partialMaskedTypeTest: PartialMaskedType = { name: 'test' }

// Test applyExact with exact match
const exactUser: User = { name: 'Charlie', email: 'charlie@example.com', age: 25, password: 'secret' }
const exactMasked = Mask.applyExact(exactUser, userMask)
// Type should be Pick<User, 'name' | 'email'>
type ExactMaskedType = typeof exactMasked
const _exactMaskedTypeTest: ExactMaskedType = { name: 'test', email: 'test@example.com' }

// Test semantic constructors
const showMask = Mask.show()
expectTypeOf(showMask).toEqualTypeOf<Mask.BinaryMask>()

const hideMask = Mask.hide()
expectTypeOf(hideMask).toEqualTypeOf<Mask.BinaryMask>()

const pickMask = Mask.pick<User>(['name', 'email'])
expectTypeOf(pickMask).toEqualTypeOf<Mask.PropertiesMask<User>>()

const omitMask = Mask.omit<User>(['password'])
expectTypeOf(omitMask).toEqualTypeOf<Mask.PropertiesMask<User>>()

// Test GetDataType
type ExtractedType1 = Mask.GetDataType<Mask.BinaryMask<User>>
expectTypeOf<ExtractedType1>().toEqualTypeOf<User>()

type ExtractedType2 = Mask.GetDataType<Mask.PropertiesMask<User>>
expectTypeOf<ExtractedType2>().toEqualTypeOf<User>()
