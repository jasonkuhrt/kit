---
name: using-lookup-tables
description: Type-safe lookup tables for discriminated unions. Prefer over Match when mapping _tag values directly to results. Uses `as const satisfies Record<Union['_tag'], Result>`.
---

# Using Lookup Tables

Type-safe lookup tables for mapping discriminated union tags to values.

## When to Use

**Use lookup tables when:**

- Mapping `_tag` values directly to results (no complex logic per case)
- The mapping is a pure data transformation
- You want slightly better performance than Match

**Use Match.tagsExhaustive when:**

- Cases need different logic/side effects
- You need access to the full event object, not just its tag
- Complex transformations that vary by case

## Pattern

```typescript
type Event =
  | { readonly _tag: 'Started' }
  | { readonly _tag: 'Completed' }
  | { readonly _tag: 'Failed' }

type State = 'pending' | 'running' | 'completed' | 'failed'

// Lookup table with type safety
const stateFromEventLookup = {
  Started: 'running',
  Completed: 'completed',
  Failed: 'failed',
} as const satisfies Record<Event['_tag'], State>

// Usage function
const stateFromEvent = (event: Event): State => stateFromEventLookup[event._tag]
```

## Key Elements

| Element                         | Purpose                                  |
| ------------------------------- | ---------------------------------------- |
| `as const`                      | Makes values literal types, not `string` |
| `satisfies Record<Key, Value>`  | Ensures exhaustiveness and value types   |
| `Record<Union['_tag'], Result>` | Key type from union, value type explicit |

## Type Safety

The pattern enforces:

1. **Exhaustiveness** - Missing tags cause TypeScript errors
2. **Value type** - Values must match the declared result type
3. **Literal types** - `as const` preserves literal values

```typescript
// TypeScript error: Property 'Failed' is missing
const incomplete = {
  Started: 'running',
  Completed: 'completed',
} as const satisfies Record<Event['_tag'], State>

// TypeScript error: Type '"invalid"' is not assignable
const wrongValue = {
  Started: 'invalid', // ❌ Not a valid State
  Completed: 'completed',
  Failed: 'failed',
} as const satisfies Record<Event['_tag'], State>
```

## Comparison

```typescript
// ✅ Lookup table - simple data mapping
const stateFromEventLookup = {
  Started: 'running',
  Completed: 'completed',
  Failed: 'failed',
} as const satisfies Record<Event['_tag'], State>

const stateFromEvent = (event: Event): State => stateFromEventLookup[event._tag]

// ✅ Match - when you need the event data
const describeEvent = (event: Event): string =>
  Match.value(event).pipe(
    Match.tagsExhaustive({
      Started: (e) => `Started: ${e.activity}`,
      Completed: (e) => `Done: ${e.activity} in ${e.durationMs}ms`,
      Failed: (e) => `Failed: ${e.activity} - ${e.error}`,
    }),
  )
```

## Multiple Lookup Tables

When mapping to different result types, create separate tables:

```typescript
const stateFromTag = {
  Started: 'running',
  Completed: 'completed',
  Failed: 'failed',
} as const satisfies Record<Event['_tag'], State>

const iconFromTag = {
  Started: '●',
  Completed: '✓',
  Failed: '✗',
} as const satisfies Record<Event['_tag'], string>
```
