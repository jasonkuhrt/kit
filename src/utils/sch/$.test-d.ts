import { Sch } from '#sch'
import { Schema as S } from 'effect'
import { expectTypeOf } from 'vitest'

// Test Tagged Struct utilities
{
  const A = S.TaggedStruct('A', { a: S.String })
  const B = S.TaggedStruct('B', { b: S.Number })
  const AB = S.Union(A, B)

  // ExtractByTag tests
  expectTypeOf<Sch.Tagged.ExtractByTag<'A', typeof A>>().toEqualTypeOf<typeof A>()
  expectTypeOf<Sch.Tagged.ExtractByTag<'Wrong', typeof A>>().toEqualTypeOf<never>()
  expectTypeOf<Sch.Tagged.ExtractByTag<'A', typeof AB>>().toEqualTypeOf<typeof A>()
  expectTypeOf<Sch.Tagged.ExtractByTag<'B', typeof AB>>().toEqualTypeOf<typeof B>()
  expectTypeOf<Sch.Tagged.ExtractByTag<'C', typeof AB>>().toEqualTypeOf<never>()

  // DoesTaggedUnionContainTag tests
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'A', typeof AB>>().toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'B', typeof AB>>().toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'Wrong', typeof AB>>().toEqualTypeOf<false>()
}

// Test Union ADT type utilities
{
  const Added = S.TaggedStruct('LifecycleEventAdded', {
    schema: S.Unknown,
    revision: S.Unknown,
  })

  const Removed = S.TaggedStruct('LifecycleEventRemoved', {
    schema: S.Unknown,
    revision: S.Unknown,
  })

  const LifecycleEvent = S.Union(Added, Removed)
  const make = Sch.Union.makeMake(LifecycleEvent)

  // Test that factory function has correct signature
  expectTypeOf(make).toEqualTypeOf<Sch.Union.FnMake<typeof LifecycleEvent>>()

  // Test GetTags utility type
  expectTypeOf<Sch.Union.GetTags<typeof LifecycleEvent>>()
    .toEqualTypeOf<'LifecycleEventAdded' | 'LifecycleEventRemoved'>()

  // Test OmitTag utility type
  expectTypeOf<Sch.Tagged.OmitTag<{ _tag: 'test'; field: string }>>()
    .toEqualTypeOf<{ field: string }>()
}

// Test with complex schemas
{
  const UserCreated = S.TaggedStruct('UserCreated', { userId: S.String })
  const UserDeleted = S.TaggedStruct('UserDeleted', { userId: S.String })
  const UserUpdated = S.TaggedStruct('UserUpdated', { userId: S.String, name: S.String })

  const SimpleUnion = S.Union(UserCreated, UserDeleted, UserUpdated)

  // Should extract UserCreated
  expectTypeOf<Sch.Tagged.ExtractByTag<'UserCreated', typeof SimpleUnion>>()
    .toEqualTypeOf<typeof UserCreated>()

  // Should extract UserDeleted
  expectTypeOf<Sch.Tagged.ExtractByTag<'UserDeleted', typeof SimpleUnion>>()
    .toEqualTypeOf<typeof UserDeleted>()

  // Should return never for non-existent tag
  expectTypeOf<Sch.Tagged.ExtractByTag<'UserArchived', typeof SimpleUnion>>()
    .toEqualTypeOf<never>()

  // Test DoesTaggedUnionContainTag predicate
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'UserCreated', typeof SimpleUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'UserDeleted', typeof SimpleUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'UserUpdated', typeof SimpleUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'UserArchived', typeof SimpleUnion>>()
    .toEqualTypeOf<false>()
}

// Test single TaggedStruct (not a union)
{
  const SingleStruct = S.TaggedStruct('SingleStruct', { data: S.String })

  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'SingleStruct', typeof SingleStruct>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'OtherStruct', typeof SingleStruct>>()
    .toEqualTypeOf<false>()
}

// Test complex tag formats
{
  const CamelCase = S.TaggedStruct('CamelCaseTag', { a: S.String })
  const SnakeCase = S.TaggedStruct('snake_case_tag', { b: S.Number })
  const KebabCase = S.TaggedStruct('kebab-case-tag', { c: S.Boolean })
  const MixedCase = S.TaggedStruct('Mixed_Case-Tag', { d: S.Unknown })

  const ComplexUnion = S.Union(CamelCase, SnakeCase, KebabCase, MixedCase)

  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'CamelCaseTag', typeof ComplexUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'snake_case_tag', typeof ComplexUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'kebab-case-tag', typeof ComplexUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'Mixed_Case-Tag', typeof ComplexUnion>>()
    .toEqualTypeOf<true>()
}

// Test Suspend unwrapping in unions
{
  const DirectEvent = S.TaggedStruct('DirectEvent', { value: S.Number })
  const SuspendedEvent = S.TaggedStruct('SuspendedEvent', { data: S.String })

  // Create suspended versions
  const SuspendedDirectEvent = S.suspend((): typeof DirectEvent => DirectEvent)
  const SuspendedSuspendedEvent = S.suspend((): typeof SuspendedEvent => SuspendedEvent)

  // Test with union containing suspended schemas
  const SuspendUnion = S.Union(SuspendedDirectEvent, SuspendedSuspendedEvent)

  // Should find DirectEvent even though it's wrapped in suspend
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'DirectEvent', typeof SuspendUnion>>()
    .toEqualTypeOf<true>()

  // Should find SuspendedEvent even though it's wrapped in suspend
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'SuspendedEvent', typeof SuspendUnion>>()
    .toEqualTypeOf<true>()

  // Should not find non-existent tag
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'NonExistentEvent', typeof SuspendUnion>>()
    .toEqualTypeOf<false>()
}

// Test mixed suspended and direct schemas
{
  const MixedA = S.TaggedStruct('MixedA', { id: S.String })
  const MixedB = S.TaggedStruct('MixedB', { id: S.Number })
  const MixedC = S.TaggedStruct('MixedC', { id: S.Boolean })
  const SuspendedMixedC = S.suspend(() => MixedC)

  const MixedSuspendUnion = S.Union(MixedA, MixedB, SuspendedMixedC)

  // Should find direct schemas
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'MixedA', typeof MixedSuspendUnion>>()
    .toEqualTypeOf<true>()
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'MixedB', typeof MixedSuspendUnion>>()
    .toEqualTypeOf<true>()

  // Should find suspended schema
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'MixedC', typeof MixedSuspendUnion>>()
    .toEqualTypeOf<true>()

  // Should not find non-existent
  expectTypeOf<Sch.Tagged.DoesTaggedUnionContainTag<'MixedD', typeof MixedSuspendUnion>>()
    .toEqualTypeOf<false>()
}
