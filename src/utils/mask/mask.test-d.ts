import { Ts } from '#ts'
import { Mask } from './$.js'

const A = Ts.Assert.exact.ofAs

// Test InferOptions type
type User = { name: string; email: string; age: number; password: string }

// Boolean is always valid
Ts.Assert.sub.ofAs<Mask.InferOptions<User>>().onAs<boolean>()

// Array of keys
Ts.Assert.sub.ofAs<Mask.InferOptions<User>>().onAs<('name' | 'email')[]>()
Ts.Assert.sub.ofAs<Mask.InferOptions<User>>().onAs<('name' | 'email' | 'age' | 'password')[]>()

// Partial record with boolean values
Ts.Assert.sub.ofAs<Mask.InferOptions<User>>().onAs<{ name?: boolean; email?: boolean }>()
Ts.Assert.sub.ofAs<Mask.InferOptions<User>>().onAs<
  { name?: boolean; email?: boolean; age?: boolean; password?: boolean }
>()

// Unknown type accepts all options
Ts.Assert.sub.ofAs<Mask.InferOptions<unknown>>().onAs<boolean>()
Ts.Assert.sub.ofAs<Mask.InferOptions<unknown>>().onAs<string[]>()
Ts.Assert.sub.ofAs<Mask.InferOptions<unknown>>().onAs<Record<string, boolean>>()

// Non-object types only accept boolean
Ts.Assert.sub.ofAs<Mask.InferOptions<string>>().onAs<boolean>()
Ts.Assert.not.sub.ofAs<Mask.InferOptions<string>>().onAs<string[]>()

// Test Apply type
type TestData = { a: string; b: number; c: boolean }

// Binary mask - show
type ShowResult = Mask.Apply<TestData, { type: 'binary'; show: true }>
A<TestData>().onAs<ShowResult>()

// Binary mask - hide
type HideResult = Mask.Apply<TestData, { type: 'binary'; show: false }>
A<undefined>().onAs<HideResult>()

// Properties mask - allow mode
type AllowResult = Mask.Apply<TestData, { type: 'properties'; mode: 'allow'; properties: ['a', 'c'] }>
A<Pick<TestData, 'a' | 'c'>>().onAs<AllowResult>()

// Properties mask - deny mode
type DenyResult = Mask.Apply<TestData, { type: 'properties'; mode: 'deny'; properties: ['b'] }>
Ts.Assert.exact.ofAs<Omit<TestData, 'b'>>().onAs<DenyResult>()

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
A<Mask.BinaryMask>().on(showMask)

const hideMask = Mask.hide()
A<Mask.BinaryMask>().on(hideMask)

const pickMask = Mask.pick<User>(['name', 'email'])
Ts.Assert.exact.ofAs<Mask.PropertiesMask<User>>().on(pickMask)

const omitMask = Mask.omit<User>(['password'])
Ts.Assert.exact.ofAs<Mask.PropertiesMask<User>>().on(omitMask)

// Test GetDataType
type ExtractedType1 = Mask.GetDataType<Mask.BinaryMask<User>>
A<User>().onAs<ExtractedType1>()

type ExtractedType2 = Mask.GetDataType<Mask.PropertiesMask<User>>
A<User>().onAs<ExtractedType2>()
