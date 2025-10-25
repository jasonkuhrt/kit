import { Sch } from '#sch'
import { Ts } from '#ts'
import { Schema as S } from 'effect'

const A = Ts.Assert.exact.ofAs

// Test Tagged Struct utilities
{
  const A = S.TaggedStruct('A', { a: S.String })
  const B = S.TaggedStruct('B', { b: S.Number })
  const AB = S.Union(A, B)

  // ExtractByTag tests
  Ts.Assert.exact.ofAs<typeof A>().onAs<Sch.Tagged.ExtractByTag<'A', typeof A>>()
  Ts.Assert.exact.ofAs<never>().onAs<Sch.Tagged.ExtractByTag<'Wrong', typeof A>>()
  Ts.Assert.exact.ofAs<typeof A>().onAs<Sch.Tagged.ExtractByTag<'A', typeof AB>>()
  Ts.Assert.exact.ofAs<typeof B>().onAs<Sch.Tagged.ExtractByTag<'B', typeof AB>>()
  Ts.Assert.exact.ofAs<never>().onAs<Sch.Tagged.ExtractByTag<'C', typeof AB>>()

  // DoesTaggedUnionContainTag tests
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'A', typeof AB>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'B', typeof AB>>()
  Ts.Assert.exact.ofAs<false>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'Wrong', typeof AB>>()
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
  Ts.Assert.exact.ofAs<Sch.Union.FnMake<typeof LifecycleEvent>>().on(make)

  // Test GetTags utility type
  Ts.Assert.exact.ofAs<'LifecycleEventAdded' | 'LifecycleEventRemoved'>().onAs<
    Sch.Union.GetTags<typeof LifecycleEvent>
  >()

  // Test OmitTag utility type
  Ts.Assert.exact.ofAs<{ field: string }>().onAs<Sch.Tagged.OmitTag<{ _tag: 'test'; field: string }>>()
}

// Test with complex schemas
{
  const UserCreated = S.TaggedStruct('UserCreated', { userId: S.String })
  const UserDeleted = S.TaggedStruct('UserDeleted', { userId: S.String })
  const UserUpdated = S.TaggedStruct('UserUpdated', { userId: S.String, name: S.String })

  const SimpleUnion = S.Union(UserCreated, UserDeleted, UserUpdated)

  // Should extract UserCreated
  Ts.Assert.exact.ofAs<typeof UserCreated>().onAs<Sch.Tagged.ExtractByTag<'UserCreated', typeof SimpleUnion>>()

  // Should extract UserDeleted
  Ts.Assert.exact.ofAs<typeof UserDeleted>().onAs<Sch.Tagged.ExtractByTag<'UserDeleted', typeof SimpleUnion>>()

  // Should return never for non-existent tag
  Ts.Assert.exact.ofAs<never>().onAs<Sch.Tagged.ExtractByTag<'UserArchived', typeof SimpleUnion>>()

  // Test DoesTaggedUnionContainTag predicate
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'UserCreated', typeof SimpleUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'UserDeleted', typeof SimpleUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'UserUpdated', typeof SimpleUnion>>()
  Ts.Assert.exact.ofAs<false>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'UserArchived', typeof SimpleUnion>>()
}

// Test single TaggedStruct (not a union)
{
  const SingleStruct = S.TaggedStruct('SingleStruct', { data: S.String })

  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'SingleStruct', typeof SingleStruct>>()
  Ts.Assert.exact.ofAs<false>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'OtherStruct', typeof SingleStruct>>()
}

// Test complex tag formats
{
  const CamelCase = S.TaggedStruct('CamelCaseTag', { a: S.String })
  const SnakeCase = S.TaggedStruct('snake_case_tag', { b: S.Number })
  const KebabCase = S.TaggedStruct('kebab-case-tag', { c: S.Boolean })
  const MixedCase = S.TaggedStruct('Mixed_Case-Tag', { d: S.Unknown })

  const ComplexUnion = S.Union(CamelCase, SnakeCase, KebabCase, MixedCase)

  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'CamelCaseTag', typeof ComplexUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'snake_case_tag', typeof ComplexUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'kebab-case-tag', typeof ComplexUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'Mixed_Case-Tag', typeof ComplexUnion>>()
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
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'DirectEvent', typeof SuspendUnion>>()

  // Should find SuspendedEvent even though it's wrapped in suspend
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'SuspendedEvent', typeof SuspendUnion>>()

  // Should not find non-existent tag
  Ts.Assert.exact.ofAs<false>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'NonExistentEvent', typeof SuspendUnion>>()
}

// Test mixed suspended and direct schemas
{
  const MixedA = S.TaggedStruct('MixedA', { id: S.String })
  const MixedB = S.TaggedStruct('MixedB', { id: S.Number })
  const MixedC = S.TaggedStruct('MixedC', { id: S.Boolean })
  const SuspendedMixedC = S.suspend(() => MixedC)

  const MixedSuspendUnion = S.Union(MixedA, MixedB, SuspendedMixedC)

  // Should find direct schemas
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'MixedA', typeof MixedSuspendUnion>>()
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'MixedB', typeof MixedSuspendUnion>>()

  // Should find suspended schema
  Ts.Assert.exact.ofAs<true>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'MixedC', typeof MixedSuspendUnion>>()

  // Should not find non-existent
  Ts.Assert.exact.ofAs<false>().onAs<Sch.Tagged.DoesTaggedUnionContainTag<'MixedD', typeof MixedSuspendUnion>>()
}
