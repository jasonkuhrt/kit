import { Sch } from '#sch'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { expect } from 'vitest'

// dprint-ignore
Test.Table.suite<{
  testType: 'basic' | 'invalidTag' | 'complex'
  tag?: string
  data?: any
  shouldThrow?: boolean
  expectedTag?: string
  expectedFields?: Record<string, any>
}>('.Union.makeMake', [
  { name: 'creates Added variant with correct tag',       testType: 'basic',      tag: 'LifecycleEventAdded',    data: { schema: 'test-schema', revision: 'test-revision' }, expectedTag: 'LifecycleEventAdded', expectedFields: { schema: 'test-schema', revision: 'test-revision' } },
  { name: 'creates Removed variant with correct tag',     testType: 'basic',      tag: 'LifecycleEventRemoved',  data: { schema: 'test-schema', revision: 'test-revision' }, expectedTag: 'LifecycleEventRemoved', expectedFields: { schema: 'test-schema', revision: 'test-revision' } },
  { name: 'throws error for unknown tag',                 testType: 'invalidTag', tag: 'UnknownTag',             data: { schema: 'test', revision: 'test' },                 shouldThrow: true },
  { name: 'works with complex field types - Added',       testType: 'complex',    tag: 'ComplexAdded',           data: { name: 'test', count: 42, nested: { value: 'nested-value' } }, expectedTag: 'ComplexAdded', expectedFields: { name: 'test', count: 42, nested: { value: 'nested-value' } } },
  { name: 'works with complex field types - Removed',     testType: 'complex',    tag: 'ComplexRemoved',         data: { reason: 'test reason', timestamp: 123456 },         expectedTag: 'ComplexRemoved', expectedFields: { reason: 'test reason', timestamp: 123456 } },
], (case_) => {
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

  if (case_.testType === 'basic') {
    const result = make(case_.tag as any, case_.data)
    expect(result._tag).toBe(case_.expectedTag)
    if (case_.expectedFields) {
      Object.entries(case_.expectedFields).forEach(([key, value]) => {
        expect((result as any)[key]).toEqual(value)
      })
    }
  } else if (case_.testType === 'invalidTag') {
    expect(() => {
      make(case_.tag as any, case_.data)
    }).toThrow('Unknown tag: UnknownTag')
  } else if (case_.testType === 'complex') {
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

    const result = complexMake(case_.tag as any, case_.data)
    expect(result._tag).toBe(case_.expectedTag)
    if (case_.expectedFields) {
      Object.entries(case_.expectedFields).forEach(([key, value]) => {
        expect((result as any)[key]).toEqual(value)
      })
    }
  }
})

// dprint-ignore
Test.Table.suite<{
  tags: string[]
  expected: { value: { name: string; members: { tag: string; memberName: string }[] } | null }
}>('.Union.parse', [
  { name: 'CatalogVersioned, CatalogUnversioned -> Catalog ADT',                                       tags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { value: { name: 'Catalog', members: [{ tag: 'CatalogVersioned', memberName: 'Versioned' }, { tag: 'CatalogUnversioned', memberName: 'Unversioned' }] } } },
  { name: 'SchemaVersioned, SchemaUnversioned -> Schema ADT',                                          tags: ['SchemaVersioned', 'SchemaUnversioned'], expected: { value: { name: 'Schema', members: [{ tag: 'SchemaVersioned', memberName: 'Versioned' }, { tag: 'SchemaUnversioned', memberName: 'Unversioned' }] } } },
  { name: 'User, Post -> null (non-ADT)',                                                              tags: ['User', 'Post'], expected: { value: null } },
  { name: 'CatalogVersioned, User -> null (mixed ADT)',                                                tags: ['CatalogVersioned', 'User'], expected: { value: null } },
  { name: 'CatalogVersioned -> null (only one member)',                                                tags: ['CatalogVersioned'], expected: { value: null } },
  { name: 'empty array -> null',                                                                       tags: [], expected: { value: null } },
], ({ tags, expected }) => {
  expect(Sch.Union.parse(tags)).toEqual(expected.value)
})

// dprint-ignore
Test.Table.suite<{
  tag: string
  allTags: string[]
  expected: { result: boolean }
}>('.Union.isADTMember', [
  { name: 'CatalogVersioned in [CatalogVersioned, CatalogUnversioned] -> true',                        tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { result: true } },
  { name: 'CatalogUnversioned in [CatalogVersioned, CatalogUnversioned] -> true',                      tag: 'CatalogUnversioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { result: true } },
  { name: 'User in [CatalogVersioned, CatalogUnversioned, User] -> false',                             tag: 'User', allTags: ['CatalogVersioned', 'CatalogUnversioned', 'User'], expected: { result: false } },
  { name: 'CatalogVersioned in [CatalogVersioned] -> false (only one member)',                         tag: 'CatalogVersioned', allTags: ['CatalogVersioned'], expected: { result: false } },
  { name: 'userProfile in [userProfile, userSettings] -> false (lowercase)',                           tag: 'userProfile', allTags: ['userProfile', 'userSettings'], expected: { result: false } },
], ({ tag, allTags, expected }) => {
  expect(Sch.Union.isADTMember(tag, allTags)).toBe(expected.result)
})

// dprint-ignore
Test.Table.suite<{
  tag: string
  allTags: string[]
  expected: { value: { adtName: string; memberName: string } | null }
}>('.Union.getADTInfo', [
  { name: 'CatalogVersioned -> { adtName: Catalog, memberName: Versioned }',                           tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { value: { adtName: 'Catalog', memberName: 'Versioned' } } },
  { name: 'SchemaUnversioned -> { adtName: Schema, memberName: Unversioned }',                         tag: 'SchemaUnversioned', allTags: ['SchemaVersioned', 'SchemaUnversioned'], expected: { value: { adtName: 'Schema', memberName: 'Unversioned' } } },
  { name: 'User -> null (non-ADT)',                                                                    tag: 'User', allTags: ['User', 'Post'], expected: { value: null } },
  { name: 'CatalogVersioned -> null (only one member)',                                                tag: 'CatalogVersioned', allTags: ['CatalogVersioned'], expected: { value: null } },
], ({ tag, allTags, expected }) => {
  expect(Sch.Union.getADTInfo(tag, allTags)).toEqual(expected.value)
})

// dprint-ignore
Test.Table.suite<{
  adtName: string
  memberName: string
  expected: { tag: string }
}>('.Union.formatADTTag', [
  { name: 'Catalog + Versioned -> CatalogVersioned',                                                   adtName: 'Catalog', memberName: 'Versioned', expected: { tag: 'CatalogVersioned' } },
  { name: 'Schema + Unversioned -> SchemaUnversioned',                                                 adtName: 'Schema', memberName: 'Unversioned', expected: { tag: 'SchemaUnversioned' } },
  { name: 'Revision + Initial -> RevisionInitial',                                                     adtName: 'Revision', memberName: 'Initial', expected: { tag: 'RevisionInitial' } },
], ({ adtName, memberName, expected }) => {
  expect(Sch.Union.formatADTTag(adtName, memberName)).toBe(expected.tag)
})
