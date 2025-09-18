import { Sch } from '#sch'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { describe, expect } from 'vitest'

describe('Union.makeMake', () => {
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

  // dprint-ignore
  const makeMakeCases: Test.Table.Case<{
    testType: 'basic' | 'invalidTag' | 'complex'
    tag?: string
    data?: any
    shouldThrow?: boolean
    expectedTag?: string
    expectedFields?: Record<string, any>
  }>[] = [
    { name: 'creates Added variant with correct tag',       testType: 'basic',      tag: 'LifecycleEventAdded',    data: { schema: 'test-schema', revision: 'test-revision' }, expectedTag: 'LifecycleEventAdded', expectedFields: { schema: 'test-schema', revision: 'test-revision' } },
    { name: 'creates Removed variant with correct tag',     testType: 'basic',      tag: 'LifecycleEventRemoved',  data: { schema: 'test-schema', revision: 'test-revision' }, expectedTag: 'LifecycleEventRemoved', expectedFields: { schema: 'test-schema', revision: 'test-revision' } },
    { name: 'throws error for unknown tag',                 testType: 'invalidTag', tag: 'UnknownTag',             data: { schema: 'test', revision: 'test' },                 shouldThrow: true },
    { name: 'works with complex field types - Added',       testType: 'complex',    tag: 'ComplexAdded',           data: { name: 'test', count: 42, nested: { value: 'nested-value' } }, expectedTag: 'ComplexAdded', expectedFields: { name: 'test', count: 42, nested: { value: 'nested-value' } } },
    { name: 'works with complex field types - Removed',     testType: 'complex',    tag: 'ComplexRemoved',         data: { reason: 'test reason', timestamp: 123456 },         expectedTag: 'ComplexRemoved', expectedFields: { reason: 'test reason', timestamp: 123456 } },
  ]

  Test.Table.each(makeMakeCases, (case_) => {
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
})

describe('Union ADT detection', () => {
  describe('parse', () => {
    // dprint-ignore
    const parseCases: Test.Table.Case<{
      tags: string[]
      expected: ReturnType<typeof Sch.Union.parse>
    }>[] = [
      { name: 'CatalogVersioned, CatalogUnversioned -> Catalog ADT',                                       tags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { name: 'Catalog', members: [{ tag: 'CatalogVersioned', memberName: 'Versioned' }, { tag: 'CatalogUnversioned', memberName: 'Unversioned' }] } },
      { name: 'SchemaVersioned, SchemaUnversioned -> Schema ADT',                                          tags: ['SchemaVersioned', 'SchemaUnversioned'], expected: { name: 'Schema', members: [{ tag: 'SchemaVersioned', memberName: 'Versioned' }, { tag: 'SchemaUnversioned', memberName: 'Unversioned' }] } },
      { name: 'User, Post -> null (non-ADT)',                                                              tags: ['User', 'Post'], expected: null },
      { name: 'CatalogVersioned, User -> null (mixed ADT)',                                                tags: ['CatalogVersioned', 'User'], expected: null },
      { name: 'CatalogVersioned -> null (only one member)',                                                tags: ['CatalogVersioned'], expected: null },
      { name: 'empty array -> null',                                                                       tags: [], expected: null },
    ]

    Test.Table.each(parseCases, (case_) => {
      expect(Sch.Union.parse(case_.tags)).toEqual(case_.expected)
    })
  })

  describe('isADTMember', () => {
    // dprint-ignore
    const isADTMemberCases: Test.Table.Case<{
      tag: string
      allTags: string[]
      expected: boolean
    }>[] = [
      { name: 'CatalogVersioned in [CatalogVersioned, CatalogUnversioned] -> true',                        tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: true },
      { name: 'CatalogUnversioned in [CatalogVersioned, CatalogUnversioned] -> true',                      tag: 'CatalogUnversioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: true },
      { name: 'User in [CatalogVersioned, CatalogUnversioned, User] -> false',                             tag: 'User', allTags: ['CatalogVersioned', 'CatalogUnversioned', 'User'], expected: false },
      { name: 'CatalogVersioned in [CatalogVersioned] -> false (only one member)',                         tag: 'CatalogVersioned', allTags: ['CatalogVersioned'], expected: false },
      { name: 'userProfile in [userProfile, userSettings] -> false (lowercase)',                           tag: 'userProfile', allTags: ['userProfile', 'userSettings'], expected: false },
    ]

    Test.Table.each(isADTMemberCases, (case_) => {
      expect(Sch.Union.isADTMember(case_.tag, case_.allTags)).toBe(case_.expected)
    })
  })

  describe('getADTInfo', () => {
    // dprint-ignore
    const getADTInfoCases: Test.Table.Case<{
      tag: string
      allTags: string[]
      expected: ReturnType<typeof Sch.Union.getADTInfo>
    }>[] = [
      { name: 'CatalogVersioned -> { adtName: Catalog, memberName: Versioned }',                           tag: 'CatalogVersioned', allTags: ['CatalogVersioned', 'CatalogUnversioned'], expected: { adtName: 'Catalog', memberName: 'Versioned' } },
      { name: 'SchemaUnversioned -> { adtName: Schema, memberName: Unversioned }',                         tag: 'SchemaUnversioned', allTags: ['SchemaVersioned', 'SchemaUnversioned'], expected: { adtName: 'Schema', memberName: 'Unversioned' } },
      { name: 'User -> null (non-ADT)',                                                                    tag: 'User', allTags: ['User', 'Post'], expected: null },
      { name: 'CatalogVersioned -> null (only one member)',                                                tag: 'CatalogVersioned', allTags: ['CatalogVersioned'], expected: null },
    ]

    Test.Table.each(getADTInfoCases, (case_) => {
      expect(Sch.Union.getADTInfo(case_.tag, case_.allTags)).toEqual(case_.expected)
    })
  })

  describe('formatADTTag', () => {
    // dprint-ignore
    const formatADTTagCases: Test.Table.Case<{
      adtName: string
      memberName: string
      expected: string
    }>[] = [
      { name: 'Catalog + Versioned -> CatalogVersioned',                                                   adtName: 'Catalog', memberName: 'Versioned', expected: 'CatalogVersioned' },
      { name: 'Schema + Unversioned -> SchemaUnversioned',                                                 adtName: 'Schema', memberName: 'Unversioned', expected: 'SchemaUnversioned' },
      { name: 'Revision + Initial -> RevisionInitial',                                                     adtName: 'Revision', memberName: 'Initial', expected: 'RevisionInitial' },
    ]

    Test.Table.each(formatADTTagCases, (case_) => {
      expect(Sch.Union.formatADTTag(case_.adtName, case_.memberName)).toBe(case_.expected)
    })
  })
})
