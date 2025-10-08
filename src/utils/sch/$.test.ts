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
    ['creates Added variant with correct tag',       [{ testType: 'basic', tag: 'LifecycleEventAdded', data: { schema: 'test-schema', revision: 'test-revision' } }], { expectedTag: 'LifecycleEventAdded', expectedFields: { schema: 'test-schema', revision: 'test-revision' } }],
    ['creates Removed variant with correct tag',     [{ testType: 'basic', tag: 'LifecycleEventRemoved', data: { schema: 'test-schema', revision: 'test-revision' } }], { expectedTag: 'LifecycleEventRemoved', expectedFields: { schema: 'test-schema', revision: 'test-revision' } }],
    ['throws error for unknown tag',                 [{ testType: 'invalidTag', tag: 'UnknownTag', data: { schema: 'test', revision: 'test' } }], { shouldThrow: true }],
    ['works with complex field types - Added',       [{ testType: 'complex', tag: 'ComplexAdded', data: { name: 'test', count: 42, nested: { value: 'nested-value' } } }], { expectedTag: 'ComplexAdded', expectedFields: { name: 'test', count: 42, nested: { value: 'nested-value' } } }],
    ['works with complex field types - Removed',     [{ testType: 'complex', tag: 'ComplexRemoved', data: { reason: 'test reason', timestamp: 123456 } }], { expectedTag: 'ComplexRemoved', expectedFields: { reason: 'test reason', timestamp: 123456 } }],
  )
  .test((i, o) => {
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

  if (i.testType === 'basic') {
    const result = make(i.tag as any, i.data)
    expect(result._tag).toBe(o?.expectedTag)
    if (o?.expectedFields) {
      Object.entries(o.expectedFields).forEach(([key, value]) => {
        expect((result as any)[key]).toEqual(value)
      })
    }
  } else if (i.testType === 'invalidTag') {
    expect(() => {
      make(i.tag as any, i.data)
    }).toThrow('Unknown tag: UnknownTag')
  } else if (i.testType === 'complex') {
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

    const result = complexMake(i.tag as any, i.data)
    expect(result._tag).toBe(o?.expectedTag)
    if (o?.expectedFields) {
      Object.entries(o.expectedFields).forEach(([key, value]) => {
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
    ['CatalogVersioned, CatalogUnversioned -> Catalog ADT',                                       [['CatalogVersioned', 'CatalogUnversioned']], { name: 'Catalog', members: [{ tag: 'CatalogVersioned', memberName: 'Versioned' }, { tag: 'CatalogUnversioned', memberName: 'Unversioned' }] }],
    ['SchemaVersioned, SchemaUnversioned -> Schema ADT',                                          [['SchemaVersioned', 'SchemaUnversioned']], { name: 'Schema', members: [{ tag: 'SchemaVersioned', memberName: 'Versioned' }, { tag: 'SchemaUnversioned', memberName: 'Unversioned' }] }],
    ['User, Post -> null (non-ADT)',                                                              [['User', 'Post']], null],
    ['CatalogVersioned, User -> null (mixed ADT)',                                                [['CatalogVersioned', 'User']], null],
    ['CatalogVersioned -> null (only one member)',                                                [['CatalogVersioned']], null],
    ['empty array -> null',                                                                       [[]], null],
  )
  .test((i, o) => {
    expect(Sch.Union.parse(i)).toEqual(o)
  })

// dprint-ignore
Test.describe('.Union.isADTMember')
  .inputType<{ tag: string; allTags: string[] }>()
  .outputType<boolean>()
  .cases(
    ['CatalogVersioned in [CatalogVersioned, CatalogUnversioned] -> true',                        [{ tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }], true],
    ['CatalogUnversioned in [CatalogVersioned, CatalogUnversioned] -> true',                      [{ tag: 'CatalogUnversioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }], true],
    ['User in [CatalogVersioned, CatalogUnversioned, User] -> false',                             [{ tag: 'User', allTags: ['CatalogVersioned', 'CatalogUnversioned', 'User'] }], false],
    ['CatalogVersioned in [CatalogVersioned] -> false (only one member)',                         [{ tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }], false],
    ['userProfile in [userProfile, userSettings] -> false (lowercase)',                           [{ tag: 'userProfile', allTags: ['userProfile', 'userSettings'] }], false],
  )
  .test((i, o) => {
    expect(Sch.Union.isADTMember(i.tag, i.allTags)).toBe(o)
  })

// dprint-ignore
Test.describe('.Union.getADTInfo')
  .inputType<{ tag: string; allTags: string[] }>()
  .outputType<{ adtName: string; memberName: string } | null>()
  .cases(
    ['CatalogVersioned -> { adtName: Catalog, memberName: Versioned }',                           [{ tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }], { adtName: 'Catalog', memberName: 'Versioned' }],
    ['SchemaUnversioned -> { adtName: Schema, memberName: Unversioned }',                         [{ tag: 'SchemaUnversioned', allTags: ['SchemaVersioned', 'SchemaUnversioned'] }], { adtName: 'Schema', memberName: 'Unversioned' }],
    ['User -> null (non-ADT)',                                                                    [{ tag: 'User', allTags: ['User', 'Post'] }], null],
    ['CatalogVersioned -> null (only one member)',                                                [{ tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }], null],
  )
  .test((i, o) => {
    expect(Sch.Union.getADTInfo(i.tag, i.allTags)).toEqual(o)
  })

// dprint-ignore
Test.describe('.Union.formatADTTag')
  .inputType<{ adtName: string; memberName: string }>()
  .outputType<string>()
  .cases(
    ['Catalog + Versioned -> CatalogVersioned',                                                   [{ adtName: 'Catalog', memberName: 'Versioned' }], 'CatalogVersioned'],
    ['Schema + Unversioned -> SchemaUnversioned',                                                 [{ adtName: 'Schema', memberName: 'Unversioned' }], 'SchemaUnversioned'],
    ['Revision + Initial -> RevisionInitial',                                                     [{ adtName: 'Revision', memberName: 'Initial' }], 'RevisionInitial'],
  )
  .test((i, o) => {
    expect(Sch.Union.formatADTTag(i.adtName, i.memberName)).toBe(o)
  })
