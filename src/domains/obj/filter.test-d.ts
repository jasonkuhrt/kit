import { Obj } from '#obj'
import { expectTypeOf } from 'vitest'

// Test object for all tests
type TestObj = { a: string; b: number; c: boolean; d: string[] }
declare const testObj: TestObj

// Test 1: policyFilter with allow mode
{
  const result = Obj.policyFilter('allow', testObj, ['a', 'c'] as const)
  expectTypeOf(result).toEqualTypeOf<{ a: string; c: boolean }>()
}

// Test 2: policyFilter with deny mode
{
  const result = Obj.policyFilter('deny', testObj, ['a', 'c'] as const)
  expectTypeOf(result).toEqualTypeOf<{ b: number; d: string[] }>()
}

// Test 3: pick with predicate returns Partial<T>
{
  const result = Obj.pick(testObj, (key, value) => value !== 'hello')
  expectTypeOf(result).toEqualTypeOf<Partial<TestObj>>()

  // All properties are optional
  expectTypeOf(result.a).toEqualTypeOf<string | undefined>()
  expectTypeOf(result.b).toEqualTypeOf<number | undefined>()
  expectTypeOf(result.c).toEqualTypeOf<boolean | undefined>()
  expectTypeOf(result.d).toEqualTypeOf<string[] | undefined>()
}

// Test 4: partition type inference
{
  const result = Obj.partition(testObj, ['a', 'c'] as const)
  expectTypeOf(result.picked).toEqualTypeOf<{ a: string; c: boolean }>()
  expectTypeOf(result.omitted).toEqualTypeOf<{ b: number; d: string[] }>()
}

// Test 5: PolicyFilter type-level function
{
  type Allow = Obj.PolicyFilter<TestObj, 'a' | 'c', 'allow'>
  expectTypeOf<Allow>().toEqualTypeOf<{ a: string; c: boolean }>()

  type Deny = Obj.PolicyFilter<TestObj, 'a' | 'c', 'deny'>
  expectTypeOf<Deny>().toEqualTypeOf<{ b: number; d: string[] }>()

  type AllowEmpty = Obj.PolicyFilter<TestObj, never, 'allow'>
  expectTypeOf<AllowEmpty>().toEqualTypeOf<{}>()

  type DenyEmpty = Obj.PolicyFilter<TestObj, never, 'deny'>
  expectTypeOf<DenyEmpty>().toEqualTypeOf<TestObj>()
}

// Test 6: Edge cases
{
  // Empty object
  const empty = {}
  const allowEmpty = Obj.policyFilter('allow', empty, [])
  const denyEmpty = Obj.policyFilter('deny', empty, [])
  const pickEmpty = Obj.pick(empty, () => true)

  expectTypeOf(allowEmpty).toEqualTypeOf<{}>()
  expectTypeOf(denyEmpty).toEqualTypeOf<{}>()
  expectTypeOf(pickEmpty).toEqualTypeOf<{}>()

  // Single property object
  const single = { a: 1 }
  const allowSingle = Obj.policyFilter('allow', single, ['a'] as const)
  const denySingle = Obj.policyFilter('deny', single, ['a'] as const)
  const pickSingle = Obj.pick(single, () => true)

  expectTypeOf(allowSingle).toEqualTypeOf<{ a: number }>()
  expectTypeOf(denySingle).toEqualTypeOf<{}>()
  expectTypeOf(pickSingle).toEqualTypeOf<{ a?: number | undefined }>()
}

// Test 7: Complex nested object
{
  type ComplexObj = {
    nested: { a: string; b: number }
    array: string[]
    optional?: boolean | undefined
    readonly ro: string
  }
  const complexObj = {} as ComplexObj

  const picked = Obj.policyFilter('allow', complexObj, ['nested', 'optional'] as const)
  expectTypeOf(picked).toEqualTypeOf<{ nested: { a: string; b: number }; optional?: boolean | undefined }>()

  const omitted = Obj.policyFilter('deny', complexObj, ['nested', 'optional'] as const)
  expectTypeOf(omitted).toEqualTypeOf<{ array: string[]; readonly ro: string }>()

  const pickedFiltered = Obj.pick(complexObj, (key) => key !== 'array')
  expectTypeOf(pickedFiltered).toEqualTypeOf<Partial<ComplexObj>>()
}

// Test 8: Keys parameter type inference
{
  // With const assertion
  const keys1 = ['a', 'c'] as const
  const result1 = Obj.policyFilter('allow', testObj, keys1)
  expectTypeOf(result1).toEqualTypeOf<{ a: string; c: boolean }>()

  // Without const assertion (wider type)
  const keys2: (keyof TestObj)[] = ['a', 'c']
  const result2 = Obj.policyFilter('allow', testObj, keys2)
  // Result is a union of all possible picks
  expectTypeOf(result2).toEqualTypeOf<Pick<TestObj, keyof TestObj>>()
}
