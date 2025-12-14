import { Assert } from '#assert'
import { Sch } from '#sch'
import { Test } from '#test'
import { Equal, Hash, HashMap, HashSet, Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

// ============================================================================
// Test Fixtures
// ============================================================================

const decodeAny = (schema: S.Schema.Any) => S.decodeSync(schema as S.Schema<any, any, never>)

class Person extends S.Class<Person>('Person')({ name: S.String }) {}
class Tagged extends S.TaggedClass<Tagged>()('Tagged', { value: S.String }) {}

// ============================================================================
// Hashable.ensureHashable - Runtime Value Hashing
// ============================================================================

// dprint-ignore
Test.describe('Hashable.ensureHashable > stable hashing')
  .inputType<Sch.Hashable.Coercible>()
  .casesInput(
    null,
    'hello',
    42,
    true,
    new Date('2024-01-01'),
    new Map([['a', 1], ['b', 2]]),
    new Set([1, 2, 3]),
    [1, 'two', 3],
    { a: 1, b: 'two' },
    { a: { b: { c: 1 } } },
  )
  .test(({ input }) => {
    const hash1 = Hash.hash(Sch.Hashable.ensureHashable(input))
    const hash2 = Hash.hash(Sch.Hashable.ensureHashable(input))
    const cloned = structuredClone(input)
    const hashCloned = Hash.hash(Sch.Hashable.ensureHashable(cloned))
    expect(hash1).toBe(hash2)
    expect(hash1).toBe(hashCloned)
  })

test('Hashable.ensureHashable type constraints', () => {
  // Valid - no type errors
  Sch.Hashable.ensureHashable(null)
  Sch.Hashable.ensureHashable('hello')
  Sch.Hashable.ensureHashable(new Date())
  Sch.Hashable.ensureHashable(new Map([['a', 1]]))
  Sch.Hashable.ensureHashable(new Set([1, 2]))
  Sch.Hashable.ensureHashable({ a: 1 })

  // Invalid - type errors
  // @ts-expect-error
  Sch.Hashable.ensureHashable(/test/)
  // @ts-expect-error
  Sch.Hashable.ensureHashable(new Error('test'))
  // @ts-expect-error
  Sch.Hashable.ensureHashable(new Uint8Array([1, 2, 3]))
  // @ts-expect-error
  Sch.Hashable.ensureHashable(() => {})
})

// ============================================================================
// Hashable.ensureHashableSchema - Recursive Schema Wrapping
// ============================================================================

describe('Hashable.ensureHashableSchema', () => {
  // dprint-ignore
  Test.describe('Hashable.ensureHashableSchema > deep equality')
    .inputType<{ schema: S.Schema.Any; input: unknown; nested?: (v: any) => unknown }>()
    .casesInput(
      { schema: S.Struct({ id: S.String, nested: S.Struct({ value: S.String }) }), input: { id: '1', nested: { value: 'x' } }, nested: (v: any) => v.nested },
      { schema: S.Struct({ level1: S.Struct({ level2: S.Struct({ value: S.String }) }) }), input: { level1: { level2: { value: 'x' } } }, nested: (v: any) => v.level1.level2 },
      { schema: S.Struct({ items: S.Array(S.Struct({ id: S.String })) }), input: { items: [{ id: '1' }] }, nested: (v: any) => v.items },
      { schema: S.Struct({ id: S.String, address: S.optional(S.Struct({ city: S.String })) }), input: { id: '1', address: { city: 'NYC' } }, nested: (v: any) => v.address },
      { schema: S.Struct({ id: S.String, config: S.optionalWith(S.Struct({ enabled: S.Boolean }), { default: () => ({ enabled: false }) }) }), input: { id: '1' }, nested: (v: any) => v.config },
      { schema: S.Struct({ id: S.String, tags: S.optionalWith(S.Array(S.String), { default: () => ['default'] }) }), input: { id: '1' }, nested: (v: any) => v.tags },
      { schema: S.Union(S.Struct({ type: S.Literal('a'), value: S.String }), S.Struct({ type: S.Literal('b'), count: S.Number })), input: { type: 'a', value: 'hello' } },
    )
    .test(({ input: { schema, input, nested } }) => {
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
      const a = decode(input)
      const b = decode(input)
      expect(Equal.equals(a, b)).toBe(true)
      if (nested) expect(Equal.equals(nested(a), nested(b))).toBe(true)
    })

  test('passes through Schema.Class unchanged', () => {
    expect(Sch.Hashable.ensureHashableSchema(Person)).toBe(Person)
  })

  test('is idempotent', () => {
    const schema = S.Struct({ a: S.String })
    const once = Sch.Hashable.ensureHashableSchema(schema)
    expect(Sch.Hashable.ensureHashableSchema(once)).toBe(once)
  })

  test('processes S.Tuple', () => {
    const schema = S.Tuple(S.String, S.Number)
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
    const a = decode(['hello', 42])
    const b = decode(['hello', 42])
    expect(Equal.equals(a, b)).toBe(true)
  })

  test('processes optionalWith nullable', () => {
    const schema = S.Struct({
      id: S.String,
      name: S.optionalWith(S.Struct({ first: S.String }), { nullable: true }),
    })
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))

    const a = decode({ id: '1', name: { first: 'Alice' } })
    const b = decode({ id: '1', name: { first: 'Alice' } })
    expect(Equal.equals(a.name, b.name)).toBe(true)

    const c = decode({ id: '1', name: null })
    expect(c.name).toBeUndefined()
  })

  test('processes S.Record', () => {
    const schema = S.Record({ key: S.String, value: S.Number })
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
    const a = decode({ x: 1, y: 2 })
    const b = decode({ x: 1, y: 2 })
    expect(Equal.equals(a, b)).toBe(true)
  })

  test('processes S.Record with nested structs', () => {
    const schema = S.Record({
      key: S.String,
      value: S.Struct({ id: S.String, name: S.String }),
    })
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
    const a = decode({ user1: { id: '1', name: 'Alice' }, user2: { id: '2', name: 'Bob' } })
    const b = decode({ user1: { id: '1', name: 'Alice' }, user2: { id: '2', name: 'Bob' } })
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a['user1'], b['user1'])).toBe(true)
  })

  test('processes S.transform with struct output', () => {
    const schema = S.transform(
      S.String,
      S.Struct({ value: S.String }),
      { decode: (s) => ({ value: s }), encode: (o) => o.value },
    )
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
    const a = decode('test')
    const b = decode('test')
    expect(Equal.equals(a, b)).toBe(true)
    expect(Hash.isHash(a)).toBe(true)
  })

  test('processes S.transform with nested struct output', () => {
    const schema = S.transform(
      S.String,
      S.Struct({ nested: S.Struct({ value: S.String }) }),
      { decode: (s) => ({ nested: { value: s } }), encode: (o) => o.nested.value },
    )
    const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
    const a = decode('test')
    const b = decode('test')
    expect(Equal.equals(a, b)).toBe(true)
    expect(Hash.isHash(a)).toBe(true)
    expect(Hash.isHash(a.nested)).toBe(true)
    expect(Equal.equals(a.nested, b.nested)).toBe(true)
  })

  describe('return types', () => {
    test('simple struct - readonly properties', () => {
      const schema = S.Struct({ id: S.String, name: S.String })
      const hashable = Sch.Hashable.ensureHashableSchema(schema)

      type Result = S.Schema.Type<typeof hashable>
      Assert.Type.exact.ofAs<{ readonly id: string; readonly name: string }>().onAs<Result>()

      const decode = decodeAny(hashable)
      const a = decode({ id: '1', name: 'test' })
      const b = decode({ id: '1', name: 'test' })
      expect(Equal.equals(a, b)).toBe(true)
    })

    test('Map field becomes HashMap', () => {
      const schema = S.Struct({
        id: S.String,
        data: S.Map({ key: S.String, value: S.Number }),
      })
      const hashable = Sch.Hashable.ensureHashableSchema(schema)

      type Result = S.Schema.Type<typeof hashable>
      Assert.Type.exact
        .ofAs<{ readonly id: string; readonly data: HashMap.HashMap<string, number> }>()
        .onAs<Result>()

      const decode = decodeAny(hashable)
      const a = decode({ id: '1', data: [['foo', 1], ['bar', 2]] })
      const b = decode({ id: '1', data: [['foo', 1], ['bar', 2]] })
      expect(Equal.equals(a, b)).toBe(true)
    })

    test('Set field becomes HashSet', () => {
      const schema = S.Struct({
        id: S.String,
        tags: S.Set(S.String),
      })
      const hashable = Sch.Hashable.ensureHashableSchema(schema)

      type Result = S.Schema.Type<typeof hashable>
      Assert.Type.exact
        .ofAs<{ readonly id: string; readonly tags: HashSet.HashSet<string> }>()
        .onAs<Result>()

      const decode = decodeAny(hashable)
      const a = decode({ id: '1', tags: ['foo', 'bar'] })
      const b = decode({ id: '1', tags: ['foo', 'bar'] })
      expect(Equal.equals(a, b)).toBe(true)
    })
  })

  describe('recursive schemas', () => {
    test('handles recursive schemas via S.suspend', () => {
      interface Category {
        readonly name: string
        readonly subcategories: readonly Category[]
      }

      const Category: S.Schema<Category> = S.Struct({
        name: S.String,
        subcategories: S.Array(S.suspend((): S.Schema<Category> => Category)),
      })

      const Hashable = Sch.Hashable.ensureHashableSchema(Category)
      const decode = S.decodeSync(Hashable)

      const a = decode({ name: 'A', subcategories: [{ name: 'B', subcategories: [] }] })
      const b = decode({ name: 'A', subcategories: [{ name: 'B', subcategories: [] }] })

      // Top level equality
      expect(Equal.equals(a, b)).toBe(true)

      // Nested equality - this is the key test for S.suspend fix
      expect(Equal.equals(a.subcategories[0], b.subcategories[0])).toBe(true)
      expect(Hash.isHash(a.subcategories[0])).toBe(true)
    })

    test('handles mutually recursive schemas', () => {
      interface Expression {
        readonly type: 'expression'
        readonly value: number | Operation
      }
      interface Operation {
        readonly type: 'operation'
        readonly left: Expression
        readonly right: Expression
      }

      const Expression: S.Schema<Expression> = S.Struct({
        type: S.Literal('expression'),
        value: S.Union(S.Number, S.suspend((): S.Schema<Operation> => Operation)),
      })

      const Operation: S.Schema<Operation> = S.Struct({
        type: S.Literal('operation'),
        left: S.suspend((): S.Schema<Expression> => Expression),
        right: S.suspend((): S.Schema<Expression> => Expression),
      })

      const Hashable = Sch.Hashable.ensureHashableSchema(Expression)
      const decode = S.decodeSync(Hashable)

      const nested = {
        type: 'expression' as const,
        value: {
          type: 'operation' as const,
          left: { type: 'expression' as const, value: 1 },
          right: { type: 'expression' as const, value: 2 },
        },
      }

      const a = decode(nested)
      const b = decode(nested)

      expect(Equal.equals(a, b)).toBe(true)
      // Deep nested equality
      expect(Equal.equals((a.value as Operation).left, (b.value as Operation).left)).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('deeply nested structure (5 levels)', () => {
      const schema = S.Struct({
        level1: S.Struct({
          level2: S.Struct({
            level3: S.Struct({
              level4: S.Struct({
                level5: S.String,
              }),
            }),
          }),
        }),
      })
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))
      const input = { level1: { level2: { level3: { level4: { level5: 'deep' } } } } }

      const a = decode(input)
      const b = decode(input)

      // All levels should be hashable
      expect(Equal.equals(a, b)).toBe(true)
      expect(Equal.equals(a.level1, b.level1)).toBe(true)
      expect(Equal.equals(a.level1.level2, b.level1.level2)).toBe(true)
      expect(Equal.equals(a.level1.level2.level3, b.level1.level2.level3)).toBe(true)
      expect(Equal.equals(a.level1.level2.level3.level4, b.level1.level2.level3.level4)).toBe(true)
      expect(Hash.isHash(a.level1.level2.level3.level4)).toBe(true)
    })

    test('optionalWith combining nullable and default on struct', () => {
      const schema = S.Struct({
        id: S.String,
        config: S.optionalWith(S.Struct({ enabled: S.Boolean, value: S.Number }), {
          nullable: true,
          default: () => ({ enabled: false, value: 0 }),
        }),
      })
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))

      // Default case (field omitted)
      const defaultCase = decode({ id: '1' })
      expect(defaultCase.config).toEqual({ enabled: false, value: 0 })
      expect(Hash.isHash(defaultCase.config)).toBe(true)

      // Null case (with default, null triggers the default value)
      const nullCase = decode({ id: '2', config: null })
      expect(nullCase.config).toEqual({ enabled: false, value: 0 })
      expect(Hash.isHash(nullCase.config)).toBe(true)

      // Value case (explicit struct value)
      const a = decode({ id: '3', config: { enabled: true, value: 42 } })
      const b = decode({ id: '3', config: { enabled: true, value: 42 } })
      expect(Equal.equals(a.config, b.config)).toBe(true)
      expect(Hash.isHash(a.config)).toBe(true)
    })

    test('nested optionalWith defaults are preserved', () => {
      // This tests the fix for S.make() path losing PropertySignature metadata.
      // When we extract a struct from PropertySignatureTransformation and it has its own
      // optionalWith fields, those inner defaults must be preserved.
      const schema = S.Struct({
        outer: S.optionalWith(
          S.Struct({
            inner: S.optionalWith(S.Number, { default: () => 42 }),
          }),
          { default: () => ({ inner: 0 }) },
        ),
      })

      const hashable = Sch.Hashable.ensureHashableSchema(schema)
      const decode = decodeAny(hashable)

      // Test 1: When outer is omitted entirely, outer default applies → inner=0
      const defaultOuter = decode({})
      expect(defaultOuter.outer.inner).toBe(0)
      expect(Hash.isHash(defaultOuter.outer)).toBe(true)

      // Test 2: When outer is provided but inner omitted, inner default applies → inner=42
      // This is the key test - without the fix, inner would be undefined
      const innerDefault = decode({ outer: {} })
      expect(innerDefault.outer.inner).toBe(42)
      expect(Hash.isHash(innerDefault.outer)).toBe(true)

      // Test 3: Equality works at both levels
      const a = decode({ outer: {} })
      const b = decode({ outer: {} })
      expect(Equal.equals(a, b)).toBe(true)
      expect(Equal.equals(a.outer, b.outer)).toBe(true)
    })

    test('Record with deeply nested struct values (2 levels)', () => {
      const schema = S.Record({
        key: S.String,
        value: S.Struct({
          meta: S.Struct({
            tags: S.Array(S.String),
            nested: S.Struct({ id: S.Number }),
          }),
        }),
      })
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))

      const input = {
        item1: { meta: { tags: ['a', 'b'], nested: { id: 1 } } },
        item2: { meta: { tags: ['c'], nested: { id: 2 } } },
      }

      const a = decode(input)
      const b = decode(input)

      expect(Equal.equals(a, b)).toBe(true)
      expect(Equal.equals(a['item1'], b['item1'])).toBe(true)
      expect(Equal.equals(a['item1'].meta, b['item1'].meta)).toBe(true)
      expect(Equal.equals(a['item1'].meta.nested, b['item1'].meta.nested)).toBe(true)
      expect(Hash.isHash(a['item1'].meta.nested)).toBe(true)
    })
  })

  describe('tuple optionality', () => {
    test('preserves tuple optional elements', () => {
      const schema = S.Tuple(S.String, S.optionalElement(S.Struct({ id: S.Number })))
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))

      // With optional element present
      const a = decode(['hello', { id: 1 }])
      const b = decode(['hello', { id: 1 }])
      expect(Equal.equals(a, b)).toBe(true)
      expect(Equal.equals(a[1], b[1])).toBe(true)
      expect(Hash.isHash(a[1])).toBe(true)

      // With optional element missing - should still decode successfully
      const c = decode(['hello'])
      expect(c.length).toBe(1)
    })

    test('preserves multiple optional elements', () => {
      const schema = S.Tuple(
        S.String,
        S.optionalElement(S.Number),
        S.optionalElement(S.Boolean),
      )
      const decode = decodeAny(Sch.Hashable.ensureHashableSchema(schema))

      const full = decode(['hello', 42, true])
      expect(full.length).toBe(3)

      const partial = decode(['hello', 42])
      expect(partial.length).toBe(2)

      const minimal = decode(['hello'])
      expect(minimal.length).toBe(1)
    })
  })
})

// dprint-ignore
Test.describe('Hashable.isSchemaProducingHashableData')
    .inputType<S.Schema.Any>()
    .outputType<boolean>()
    .cases(
      { comment: 'plain Struct is not hashable',              input: S.Struct({ a: S.String }),                  output: false },
      { comment: 'TaggedStruct is not hashable',              input: S.TaggedStruct('Tag', { a: S.String }),     output: false },
      { comment: 'S.Data(Struct) is hashable',                input: S.Data(S.Struct({ a: S.String })),          output: true },
      { comment: 'S.Data(Array) is hashable',                 input: S.Data(S.Array(S.String)),                  output: true },
      { comment: 'S.Class is hashable',                       input: Person,                                     output: true },
      { comment: 'S.TaggedClass is hashable',                 input: Tagged,                                     output: true },
      { comment: 'Union of hashable schemas is hashable',     input: S.Union(S.Data(S.Struct({ a: S.String })), S.Data(S.Struct({ b: S.Number }))), output: true },
      { comment: 'Union with non-hashable member is not',     input: S.Union(S.Data(S.Struct({ a: S.String })), S.Struct({ b: S.Number })),        output: false },
      { comment: 'primitives are not hashable',               input: S.String,                                   output: false },
    )
    .test(({ input, output }) => expect(Sch.Hashable.isSchemaProducingHashableData(input)).toBe(output))

// ============================================================================
// EnsureHashableType - Type-Level Transformation
// ============================================================================

describe('Hashable.EnsureHashableType', () => {
  test('primitives unchanged', () => {
    Assert.Type.exact.ofAs<string>().onAs<Sch.Hashable.EnsureHashableType<string>>()
    Assert.Type.exact.ofAs<number>().onAs<Sch.Hashable.EnsureHashableType<number>>()
    Assert.Type.exact.ofAs<boolean>().onAs<Sch.Hashable.EnsureHashableType<boolean>>()
  })

  test('Map → HashMap', () => {
    Assert.Type.exact
      .ofAs<HashMap.HashMap<string, number>>()
      .onAs<Sch.Hashable.EnsureHashableType<Map<string, number>>>()
  })

  test('Set → HashSet', () => {
    Assert.Type.exact
      .ofAs<HashSet.HashSet<string>>()
      .onAs<Sch.Hashable.EnsureHashableType<Set<string>>>()
  })

  test('nested Map in object', () => {
    Assert.Type.exact
      .ofAs<{ readonly data: HashMap.HashMap<string, number> }>()
      .onAs<Sch.Hashable.EnsureHashableType<{ data: Map<string, number> }>>()
  })

  test('array of objects - elements recurse', () => {
    Assert.Type.exact
      .ofAs<readonly { readonly id: string }[]>()
      .onAs<Sch.Hashable.EnsureHashableType<{ id: string }[]>>()
  })

  test('complex nested structure', () => {
    type ComplexInput = {
      id: string
      cache: Map<string, { value: number }>
      tags: Set<string>
    }
    type ComplexOutput = Sch.Hashable.EnsureHashableType<ComplexInput>

    Assert.Type.exact
      .ofAs<{
        readonly id: string
        readonly cache: HashMap.HashMap<string, { readonly value: number }>
        readonly tags: HashSet.HashSet<string>
      }>()
      .onAs<ComplexOutput>()
  })
})
