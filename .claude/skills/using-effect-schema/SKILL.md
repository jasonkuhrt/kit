---
name: using-effect-schema
description: Conventions for Effect Schema classes including construction, type guards, enums, and custom constructors. Use when creating or working with Schema-based domain types.
---

# Using Effect Schema

## Reference

### Construction

**Always use `.make()` instead of `new`:**

```typescript
// ✅ Correct
Standard.make({ value: 'feat' })

// ❌ Wrong
new Standard({ value: 'feat' })
```

### Type Guards

**Use `Schema.is()` for type predicates:**

```typescript
export class Standard extends Schema.TaggedClass<Standard>()('Standard', {
  value: StandardValue,
}) {
  static is = Schema.is(Standard)
}

// Usage
if (Standard.is(value)) { ... }

// ❌ Wrong - manual _tag check
if (value._tag === 'Standard') { ... }
```

### Schema.Enums

**Use `as const` for literal type preservation:**

```typescript
// ✅ Correct - inline values with as const, use .enums for runtime access
export const StandardValue = Schema.Enums(
  {
    feat: 'feat',
    fix: 'fix',
    docs: 'docs',
  } as const,
)
export type StandardValue = typeof StandardValue.Type

// Runtime access
StandardValue.enums.feat // 'feat'

// ❌ Wrong - missing as const (values inferred as string, not literals)
export const StandardValue = Schema.Enums({
  feat: 'feat',
  fix: 'fix',
})

// ❌ Wrong - separate const object
const values = { feat: 'feat', fix: 'fix' } as const
export const StandardValue = Schema.Enums(values)
```

**CRITICAL**: Without `as const`, TypeScript infers enum values as `string` instead of literal types like `'feat' | 'fix'`. This breaks lookup table indexing and type narrowing.

### Custom Constructors

**Add `fromString` (or similar) for ergonomic construction:**

```typescript
export class Standard extends Schema.TaggedClass<Standard>()('Standard', {
  value: StandardValue,
}) {
  static is = Schema.is(Standard)
  static fromString = (value: StandardValue) => Standard.make({ value })
}

// Usage
Standard.fromString('feat') // instead of Standard.make({ value: 'feat' })
```

### Smart Constructors for Unions

**Export smart constructors as module-level functions alongside the schema:**

```typescript
type FromString<$value extends string> = $value extends StandardValue ? Standard
  : Custom

export const fromString = <$value extends string>(
  value: $value,
): FromString<$value> => {
  if (value in StandardValue.enums) {
    return Standard.make({ value: value as StandardValue }) as FromString<
      $value
    >
  }
  return Custom.make({ value }) as FromString<$value>
}

export const Type = Schema.Union(Standard, Custom)
export type Type = typeof Type.Type

// Usage - type narrows based on input literal
// When re-exported as namespace: ConventionalCommits.Type.fromString('feat')
fromString('feat') // Standard
fromString('custom') // Custom
```

### TaggedClass Pattern

**Standard structure for domain types:**

```typescript
export class MyType extends Schema.TaggedClass<MyType>()('MyType', {
  field1: Schema.String,
  field2: Schema.Number,
}) {
  static is = Schema.is(MyType)
  static fromX = (...) => MyType.make({ ... })
}
```

## Notes

- `.make()` is the canonical constructor - it validates and returns the instance
- `new` bypasses validation - avoid in application code
- Type guards enable exhaustive pattern matching with TypeScript
- Custom constructors simplify common construction patterns
