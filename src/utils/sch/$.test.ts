import { Sch } from '#sch'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { expect } from 'vitest'

// dprint-ignore
Test.describe('.Union.makeMake')
  .inputType<{
    testType: 'basic' | 'invalidTag' | 'complex'
    tag?: string
    data?: any
  }>()
  .outputType<{
    shouldThrow?: boolean
    expectedTag?: string
    expectedFields?: Record<string, any>
  } | undefined>()
  .cases(
    { comment: 'creates Added variant with correct tag',       input: { testType: 'basic', tag: 'LifecycleEventAdded', data: { schema: 'test-schema', revision: 'test-revision' } }, output: { expectedTag: 'LifecycleEventAdded', expectedFields: { schema: 'test-schema', revision: 'test-revision' } } },
    { comment: 'creates Removed variant with correct tag',     input: { testType: 'basic', tag: 'LifecycleEventRemoved', data: { schema: 'test-schema', revision: 'test-revision' } }, output: { expectedTag: 'LifecycleEventRemoved', expectedFields: { schema: 'test-schema', revision: 'test-revision' } } },
    { comment: 'throws error for unknown tag',                 input: { testType: 'invalidTag', tag: 'UnknownTag', data: { schema: 'test', revision: 'test' } }, output: { shouldThrow: true } },
    { comment: 'works with complex field types - Added',       input: { testType: 'complex', tag: 'ComplexAdded', data: { name: 'test', count: 42, nested: { value: 'nested-value' } } }, output: { expectedTag: 'ComplexAdded', expectedFields: { name: 'test', count: 42, nested: { value: 'nested-value' } } } },
    { comment: 'works with complex field types - Removed',     input: { testType: 'complex', tag: 'ComplexRemoved', data: { reason: 'test reason', timestamp: 123456 } }, output: { expectedTag: 'ComplexRemoved', expectedFields: { reason: 'test reason', timestamp: 123456 } } },
  )
  .test(({ input, output }) => {
  // Define test schemas
  const Added = S.TaggedStruct('LifecycleEventAdded', {
    schema: S.Unknown,
    revision: S.Unknown,
  })

  const Removed = S.TaggedStruct('LifecycleEventRemoved', {
    schema: S.Unknown,
    revision: S.Unknown,
  })

  const LifecycleEvent = S.Union(Added, Removed)

  // Create the factory
  const make = Sch.Union.makeMake(LifecycleEvent)

  if (input.testType === 'basic') {
    const result = make(input.tag as any, input.data)
    expect(result._tag).toBe(output?.expectedTag)
    if (output?.expectedFields) {
      Object.entries(output.expectedFields).forEach(([key, value]) => {
        expect((result as any)[key]).toEqual(value)
      })
    }
  } else if (input.testType === 'invalidTag') {
    expect(() => {
      make(input.tag as any, input.data)
    }).toThrow('Unknown tag: UnknownTag')
  } else if (input.testType === 'complex') {
    const ComplexAdded = S.TaggedStruct('ComplexAdded', {
      name: S.String,
      count: S.Number,
      nested: S.Struct({
        value: S.String,
      }),
    })

    const ComplexRemoved = S.TaggedStruct('ComplexRemoved', {
      reason: S.String,
      timestamp: S.Number,
    })

    const ComplexUnion = S.Union(ComplexAdded, ComplexRemoved)
    const complexMake = Sch.Union.makeMake(ComplexUnion)

    const result = complexMake(input.tag as any, input.data)
    expect(result._tag).toBe(output?.expectedTag)
    if (output?.expectedFields) {
      Object.entries(output.expectedFields).forEach(([key, value]) => {
        expect((result as any)[key]).toEqual(value)
      })
    }
  }
  })

// dprint-ignore
Test.describe('.Union.parse')
  .inputType<string[]>()
  .outputType<{ name: string; members: { tag: string; memberName: string }[] } | null>()
  .cases(
    { comment: 'CatalogVersioned, CatalogUnversioned -> Catalog ADT',                                       input: ['CatalogVersioned', 'CatalogUnversioned'], output: { name: 'Catalog', members: [{ tag: 'CatalogVersioned', memberName: 'Versioned' }, { tag: 'CatalogUnversioned', memberName: 'Unversioned' }] } },
    { comment: 'SchemaVersioned, SchemaUnversioned -> Schema ADT',                                          input: ['SchemaVersioned', 'SchemaUnversioned'], output: { name: 'Schema', members: [{ tag: 'SchemaVersioned', memberName: 'Versioned' }, { tag: 'SchemaUnversioned', memberName: 'Unversioned' }] } },
    { comment: 'User, Post -> null (non-ADT)',                                                              input: ['User', 'Post'], output: null },
    { comment: 'CatalogVersioned, User -> null (mixed ADT)',                                                input: ['CatalogVersioned', 'User'], output: null },
    { comment: 'CatalogVersioned -> null (only one member)',                                                input: ['CatalogVersioned'], output: null },
    { comment: 'empty array -> null',                                                                       input: [], output: null },
  )
  .test(({ input, output }) => {
    expect(Sch.Union.parse(input)).toEqual(output)
  })

// dprint-ignore
Test.describe('.Union.isADTMember')
  .inputType<{ tag: string; allTags: string[] }>()
  .outputType<boolean>()
  .cases(
    { comment: 'CatalogVersioned in [CatalogVersioned, CatalogUnversioned] -> true',                        input: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, output: true },
    { comment: 'CatalogUnversioned in [CatalogVersioned, CatalogUnversioned] -> true',                      input: { tag: 'CatalogUnversioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, output: true },
    { comment: 'User in [CatalogVersioned, CatalogUnversioned, User] -> false',                             input: { tag: 'User', allTags: ['CatalogVersioned', 'CatalogUnversioned', 'User'] }, output: false },
    { comment: 'CatalogVersioned in [CatalogVersioned] -> false (only one member)',                         input: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }, output: false },
    { comment: 'userProfile in [userProfile, userSettings] -> false (lowercase)',                           input: { tag: 'userProfile', allTags: ['userProfile', 'userSettings'] }, output: false },
  )
  .test(({ input, output }) => {
    expect(Sch.Union.isADTMember(input.tag, input.allTags)).toBe(output)
  })

// dprint-ignore
Test.describe('.Union.getADTInfo')
  .inputType<{ tag: string; allTags: string[] }>()
  .outputType<{ adtName: string; memberName: string } | null>()
  .cases(
    { comment: 'CatalogVersioned -> { adtName: Catalog, memberName: Versioned }',                           input: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, output: { adtName: 'Catalog', memberName: 'Versioned' } },
    { comment: 'SchemaUnversioned -> { adtName: Schema, memberName: Unversioned }',                         input: { tag: 'SchemaUnversioned', allTags: ['SchemaVersioned', 'SchemaUnversioned'] }, output: { adtName: 'Schema', memberName: 'Unversioned' } },
    { comment: 'User -> null (non-ADT)',                                                                    input: { tag: 'User', allTags: ['User', 'Post'] }, output: null },
    { comment: 'CatalogVersioned -> null (only one member)',                                                input: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }, output: null },
  )
  .test(({ input, output }) => {
    expect(Sch.Union.getADTInfo(input.tag, input.allTags)).toEqual(output)
  })

// dprint-ignore
Test.describe('.Union.formatADTTag')
  .inputType<{ adtName: string; memberName: string }>()
  .outputType<string>()
  .cases(
    { comment: 'Catalog + Versioned -> CatalogVersioned',                                                   input: { adtName: 'Catalog', memberName: 'Versioned' }, output: 'CatalogVersioned' },
    { comment: 'Schema + Unversioned -> SchemaUnversioned',                                                 input: { adtName: 'Schema', memberName: 'Unversioned' }, output: 'SchemaUnversioned' },
    { comment: 'Revision + Initial -> RevisionInitial',                                                     input: { adtName: 'Revision', memberName: 'Initial' }, output: 'RevisionInitial' },
  )
  .test(({ input, output }) => {
    expect(Sch.Union.formatADTTag(input.adtName, input.memberName)).toBe(output)
  })
