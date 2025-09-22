import { Sch } from '#sch'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { expect } from 'vitest'

// dprint-ignore
Test.Table.suite<
  {
    testType: 'basic' | 'invalidTag' | 'complex'
    tag?: string
    data?: any
  },
  {
    shouldThrow?: boolean
    expectedTag?: string
    expectedFields?: Record<string, any>
  } | undefined
>('.Union.makeMake', [
  { n: 'creates Added variant with correct tag',       i: { testType: 'basic', tag: 'LifecycleEventAdded', data: { schema: 'test-schema', revision: 'test-revision' } }, o: { expectedTag: 'LifecycleEventAdded', expectedFields: { schema: 'test-schema', revision: 'test-revision' } } },
  { n: 'creates Removed variant with correct tag',     i: { testType: 'basic', tag: 'LifecycleEventRemoved', data: { schema: 'test-schema', revision: 'test-revision' } }, o: { expectedTag: 'LifecycleEventRemoved', expectedFields: { schema: 'test-schema', revision: 'test-revision' } } },
  { n: 'throws error for unknown tag',                 i: { testType: 'invalidTag', tag: 'UnknownTag', data: { schema: 'test', revision: 'test' } }, o: { shouldThrow: true } },
  { n: 'works with complex field types - Added',       i: { testType: 'complex', tag: 'ComplexAdded', data: { name: 'test', count: 42, nested: { value: 'nested-value' } } }, o: { expectedTag: 'ComplexAdded', expectedFields: { name: 'test', count: 42, nested: { value: 'nested-value' } } } },
  { n: 'works with complex field types - Removed',     i: { testType: 'complex', tag: 'ComplexRemoved', data: { reason: 'test reason', timestamp: 123456 } }, o: { expectedTag: 'ComplexRemoved', expectedFields: { reason: 'test reason', timestamp: 123456 } } },
], ({ i, o }) => {
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
Test.Table.suite<
  string[],
  { name: string; members: { tag: string; memberName: string }[] } | null
>('.Union.parse', [
  { n: 'CatalogVersioned, CatalogUnversioned -> Catalog ADT',                                       i: ['CatalogVersioned', 'CatalogUnversioned'], o: { name: 'Catalog', members: [{ tag: 'CatalogVersioned', memberName: 'Versioned' }, { tag: 'CatalogUnversioned', memberName: 'Unversioned' }] } },
  { n: 'SchemaVersioned, SchemaUnversioned -> Schema ADT',                                          i: ['SchemaVersioned', 'SchemaUnversioned'], o: { name: 'Schema', members: [{ tag: 'SchemaVersioned', memberName: 'Versioned' }, { tag: 'SchemaUnversioned', memberName: 'Unversioned' }] } },
  { n: 'User, Post -> null (non-ADT)',                                                              i: ['User', 'Post'], o: null },
  { n: 'CatalogVersioned, User -> null (mixed ADT)',                                                i: ['CatalogVersioned', 'User'], o: null },
  { n: 'CatalogVersioned -> null (only one member)',                                                i: ['CatalogVersioned'], o: null },
  { n: 'empty array -> null',                                                                       i: [], o: null },
], ({ i, o }) => {
  expect(Sch.Union.parse(i)).toEqual(o)
})

// dprint-ignore
Test.Table.suite<
  { tag: string; allTags: string[] },
  boolean
>('.Union.isADTMember', [
  { n: 'CatalogVersioned in [CatalogVersioned, CatalogUnversioned] -> true',                        i: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, o: true },
  { n: 'CatalogUnversioned in [CatalogVersioned, CatalogUnversioned] -> true',                      i: { tag: 'CatalogUnversioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, o: true },
  { n: 'User in [CatalogVersioned, CatalogUnversioned, User] -> false',                             i: { tag: 'User', allTags: ['CatalogVersioned', 'CatalogUnversioned', 'User'] }, o: false },
  { n: 'CatalogVersioned in [CatalogVersioned] -> false (only one member)',                         i: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }, o: false },
  { n: 'userProfile in [userProfile, userSettings] -> false (lowercase)',                           i: { tag: 'userProfile', allTags: ['userProfile', 'userSettings'] }, o: false },
], ({ i, o }) => {
  expect(Sch.Union.isADTMember(i.tag, i.allTags)).toBe(o)
})

// dprint-ignore
Test.Table.suite<
  { tag: string; allTags: string[] },
  { adtName: string; memberName: string } | null
>('.Union.getADTInfo', [
  { n: 'CatalogVersioned -> { adtName: Catalog, memberName: Versioned }',                           i: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'] }, o: { adtName: 'Catalog', memberName: 'Versioned' } },
  { n: 'SchemaUnversioned -> { adtName: Schema, memberName: Unversioned }',                         i: { tag: 'SchemaUnversioned', allTags: ['SchemaVersioned', 'SchemaUnversioned'] }, o: { adtName: 'Schema', memberName: 'Unversioned' } },
  { n: 'User -> null (non-ADT)',                                                                    i: { tag: 'User', allTags: ['User', 'Post'] }, o: null },
  { n: 'CatalogVersioned -> null (only one member)',                                                i: { tag: 'CatalogVersioned', allTags: ['CatalogVersioned'] }, o: null },
], ({ i, o }) => {
  expect(Sch.Union.getADTInfo(i.tag, i.allTags)).toEqual(o)
})

// dprint-ignore
Test.Table.suite<
  { adtName: string; memberName: string },
  string
>('.Union.formatADTTag', [
  { n: 'Catalog + Versioned -> CatalogVersioned',                                                   i: { adtName: 'Catalog', memberName: 'Versioned' }, o: 'CatalogVersioned' },
  { n: 'Schema + Unversioned -> SchemaUnversioned',                                                 i: { adtName: 'Schema', memberName: 'Unversioned' }, o: 'SchemaUnversioned' },
  { n: 'Revision + Initial -> RevisionInitial',                                                     i: { adtName: 'Revision', memberName: 'Initial' }, o: 'RevisionInitial' },
], ({ i, o }) => {
  expect(Sch.Union.formatADTTag(i.adtName, i.memberName)).toBe(o)
})
