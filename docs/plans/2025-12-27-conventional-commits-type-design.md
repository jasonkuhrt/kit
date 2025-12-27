# Conventional Commits Type System Design

## Overview

Replace the plain `string` type field in conventional commits with a type-safe discriminated union that distinguishes between standard types (with known semantic version impacts) and custom/extensible types (requiring explicit configuration).

## Goals

1. **Developer experience** — Autocomplete and typo protection when creating commits programmatically
2. **Validation** — Schema rejects unknown types unless explicitly marked as custom
3. **Downstream logic** — Exhaustive switch/match on standard types with catch-all for custom

## Core Types

### Impact

Semantic version impact levels:

```typescript
export const ImpactValues = {
  none: 'none',
  patch: 'patch',
  minor: 'minor',
} as const

export const Impact = Schema.Enums(ImpactValues)
export type Impact = typeof Impact.Type
// => 'none' | 'patch' | 'minor'
```

Note: `major` is not included — major version bumps come from breaking change flags, not from the type itself.

### Standard Types

The 11 standard conventional commit types (Angular convention):

```typescript
export const StandardValues = {
  feat: 'feat',
  fix: 'fix',
  docs: 'docs',
  style: 'style',
  refactor: 'refactor',
  perf: 'perf',
  test: 'test',
  build: 'build',
  ci: 'ci',
  chore: 'chore',
  revert: 'revert',
} as const

export const StandardValue = Schema.Enums(StandardValues)
export type StandardValue = typeof StandardValue.Type
```

Static impact mapping:

```typescript
export const StandardImpact: Record<StandardValue, Impact> = {
  feat: 'minor',
  fix: 'patch',
  docs: 'patch',
  perf: 'patch',
  style: 'none',
  refactor: 'none',
  test: 'none',
  build: 'none',
  ci: 'none',
  chore: 'none',
  revert: 'none',
}
```

### Type Union

Discriminated union of standard and custom types:

```typescript
export class Standard extends Schema.TaggedClass<Standard>()('Standard', {
  value: StandardValue,
}) {
  static is = (type: Type): type is Standard => type._tag === 'Standard'
}

export class Custom extends Schema.TaggedClass<Custom>()('Custom', {
  value: Schema.String,
}) {
  static is = (type: Type): type is Custom => type._tag === 'Custom'
}

export const Type = Schema.Union(Standard, Custom)
export type Type = typeof Type.Type
```

## Constructors & Helpers

### Type-Level Smart Constructor

Returns narrowed type based on input literal:

```typescript
type From<$value extends string> = $value extends StandardValue ? Standard
  : Custom

export const from = <$value extends string>(value: $value): From<$value> => {
  if (value in StandardValues) {
    return new Standard({ value: value as StandardValue }) as From<$value>
  }
  return new Custom({ value }) as From<$value>
}
```

Usage:

```typescript
const t1 = from('feat') // Standard (not Type)
const t2 = from('wip') // Custom (not Type)
const t3 = from(dynamic) // Type (union, when input is plain string)
```

### Accessors

```typescript
export const value = (type: Type): string => type.value

export const impact = (type: Standard): Impact => StandardImpact[type.value]
```

Type guards are available as static methods on the classes: `Standard.is(type)` and `Custom.is(type)`.

## Schema Codec

String transformation for parsing/serializing commits:

```typescript
export const ConventionalCommitFromString = Schema.transformOrFail(
  Schema.String,
  ConventionalCommit,
  {
    decode: (raw, _, ast) => parseCommitString(raw),
    encode: (commit, _, ast) => Effect.succeed(formatCommit(commit)),
  },
)
```

Consumer API:

```typescript
// Decode from string
const commit = Schema.decodeUnknownSync(ConventionalCommitFromString)(
  'feat(core): add new feature\n\nBody here',
)

// Encode back to string
const str = Schema.encodeSync(ConventionalCommitFromString)(commit)
```

### Parsing Behavior

When parsing a commit title like `chore: update deps`:

1. Extract raw type string (`"chore"`)
2. Check if it's in `StandardValues`
3. If yes → `Standard({ value: 'chore' })`
4. If no → `Custom({ value: 'whatever' })`

This is automatic, no special syntax needed for custom types.

## Release Config Integration

### Custom Type Definition

Users define custom types with explicit impacts in release config:

```typescript
export class CustomTypeDefinition extends Schema.Class<CustomTypeDefinition>(
  'CustomTypeDefinition',
)({
  name: Schema.String,
  impact: Type.Impact,
}) {}

export class ReleaseConfig
  extends Schema.Class<ReleaseConfig>('ReleaseConfig')({
    customTypes: Schema.optionalWith(Schema.Array(CustomTypeDefinition), {
      default: () => [],
    }),
  })
{}
```

Example config:

```json
{
  "customTypes": [
    { "name": "wip", "impact": "none" },
    { "name": "experiment", "impact": "none" },
    { "name": "security", "impact": "patch" }
  ]
}
```

### Impact Resolution

At release time, resolve impact for any type:

```typescript
const resolveImpact = (
  type: Type.Type,
  config: ReleaseConfig,
): Effect.Effect<Type.Impact, UnknownCustomTypeError> => {
  if (Type.Standard.is(type)) {
    return Effect.succeed(Type.impact(type))
  }

  const def = config.customTypes.find(d => d.name === type.value)
  if (!def) {
    return Effect.fail(new UnknownCustomTypeError({ type: type.value }))
  }
  return Effect.succeed(def.impact)
}
```

If a commit uses a custom type not defined in config, the release CLI rejects it — forcing users to explicitly define impact, avoiding silent errors.

## Migration

### Schema Changes

`SingleTargetCommit` and `Target` schemas change:

```diff
- type: Schema.String
+ type: Type.Type
```

### Breaking Changes

- `type` field changes from `string` to `Standard | Custom`
- Code accessing `commit.type` directly needs to use `Type.value(commit.type)` or pattern match

## File Structure

```
packages/conventional-commits/src/
├── type.ts              # Impact, StandardValue, Standard, Custom, Type
├── single-target-commit.ts
├── multi-target-commit.ts
├── target.ts
├── commit.ts            # ConventionalCommitFromString codec
└── parse/
    └── internal.ts      # Internal parsing utilities
```
