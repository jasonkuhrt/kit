import { Obj } from '#obj'
import { expectTypeOf } from 'vitest'

// HasRequiredKeys tests
{
  type AllRequired = { a: string; b: number }
  type AllOptional = { a?: string; b?: number }
  type Mixed = { a: string; b?: number }
  type Empty = {}

  expectTypeOf<Obj.HasRequiredKeys<AllRequired>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasRequiredKeys<AllOptional>>().toEqualTypeOf<false>()
  expectTypeOf<Obj.HasRequiredKeys<Mixed>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasRequiredKeys<Empty>>().toEqualTypeOf<false>()
}

// HasOptionalKeys tests
{
  type AllRequired = { a: string; b: number }
  type AllOptional = { a?: string; b?: number }
  type Mixed = { a: string; b?: number }
  type Empty = {}

  expectTypeOf<Obj.HasOptionalKeys<AllRequired>>().toEqualTypeOf<false>()
  expectTypeOf<Obj.HasOptionalKeys<AllOptional>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasOptionalKeys<Mixed>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasOptionalKeys<Empty>>().toEqualTypeOf<false>()
}

// RequiredKeys tests
{
  type Mixed = { a: string; b?: number; c?: boolean }

  expectTypeOf<Obj.RequiredKeys<Mixed>>().toEqualTypeOf<'a'>()
}

// OptionalKeys tests
{
  type Mixed = { a: string; b?: number; c?: boolean }

  expectTypeOf<Obj.OptionalKeys<Mixed>>().toEqualTypeOf<'b' | 'c'>()
}

// HasOptionalKey tests
{
  type TestObj = { a?: string; b: number }

  expectTypeOf<Obj.HasOptionalKey<TestObj, 'a'>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasOptionalKey<TestObj, 'b'>>().toEqualTypeOf<false>()
}

// IsKeyOptional tests
{
  type TestObj = { a?: string; b: number }

  expectTypeOf<Obj.IsKeyOptional<TestObj, 'a'>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.IsKeyOptional<TestObj, 'b'>>().toEqualTypeOf<false>()
  expectTypeOf<Obj.IsKeyOptional<TestObj, 'c'>>().toEqualTypeOf<false>()
}

// HasKey tests
{
  type TestObj = { a: string; b: number }

  expectTypeOf<Obj.HasKey<TestObj, 'a'>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasKey<TestObj, 'b'>>().toEqualTypeOf<true>()
  expectTypeOf<Obj.HasKey<TestObj, 'c'>>().toEqualTypeOf<false>()
}
