---
name: using-effect-match
description: Pattern matching with Effect Match module. Handles discriminated unions with _tag fields using Match.tagsExhaustive for type-safe exhaustive matching.
---

# Using Effect Match

Pattern matching on discriminated unions using the Effect `Match` module.

## Preferred Pattern: `Match.tagsExhaustive`

For discriminated unions with `_tag` fields, use `Match.tagsExhaustive`:

```typescript
import { Match } from 'effect'

type Event =
  | { readonly _tag: 'Started'; readonly activity: string }
  | { readonly _tag: 'Completed'; readonly activity: string }
  | {
    readonly _tag: 'Failed'
    readonly activity: string
    readonly error: Error
  }

const handleEvent = (event: Event): void =>
  Match.value(event).pipe(
    Match.tagsExhaustive({
      Started(e) {
        console.log(`Starting: ${e.activity}`)
      },
      Completed(e) {
        console.log(`Done: ${e.activity}`)
      },
      Failed(e) {
        console.log(`Failed: ${e.activity}`, e.error)
      },
    }),
  )
```

## Key Rules

1. **Always use `Match.tagsExhaustive`** over `Match.tags` + `Match.exhaustive`
2. **Types must have `_tag` field** - use `Schema.TaggedClass` for Effect Schema types
3. **All cases must be handled** - TypeScript enforces exhaustiveness

## Match.tagsExhaustive vs Match.tags

| Pattern                               | Usage                                       |
| ------------------------------------- | ------------------------------------------- |
| `Match.tagsExhaustive({...})`         | Single function, exhaustive - **preferred** |
| `Match.tags({...}), Match.exhaustive` | Two-step, equivalent result - **avoid**     |

## Creating Types with `_tag`

### Effect Schema (preferred for domain types)

```typescript
import { Schema } from 'effect'

class Started extends Schema.TaggedClass<Started>()('Started', {
  activity: Schema.String,
}) {}

class Completed extends Schema.TaggedClass<Completed>()('Completed', {
  activity: Schema.String,
}) {}

type Event = Started | Completed
```

### Plain TypeScript

```typescript
interface Started {
  readonly _tag: 'Started'
  readonly activity: string
}

interface Completed {
  readonly _tag: 'Completed'
  readonly activity: string
}

type Event = Started | Completed
```

## Handler Syntax

**Rules:**

1. Use **arrow functions** only when implicit return is possible (single expression)
2. Use **method syntax** when block is needed (void handlers, multi-statement, explicit return)
3. **Never mix styles** - if any handler needs method syntax, all should use method syntax

```typescript
// ✅ All implicit returns - arrow syntax
const result = Match.value(event).pipe(
  Match.tagsExhaustive({
    Started: (e) => `Started: ${e.name}`,
    Completed: (e) => `Done: ${e.name}`,
  }),
)

// ✅ Void handlers - method syntax
Match.value(event).pipe(
  Match.tagsExhaustive({
    Started(e) {
      doSomething(e)
    },
    Completed(e) {
      doOther(e)
    },
  }),
)

// ✅ Mixed needs - all method syntax (no mixing!)
const result = Match.value(event).pipe(
  Match.tagsExhaustive({
    Started(e) {
      // Multi-line logic
      const formatted = format(e.name)
      return `Started: ${formatted}`
    },
    Completed(e) {
      return `Done: ${e.name}`
    },
  }),
)

// ❌ Wrong - mixed styles
Match.value(event).pipe(
  Match.tagsExhaustive({
    Started: (e) => `Started: ${e.name}`, // arrow
    Completed(e) { // method - inconsistent!
      log(e)
      return `Done: ${e.name}`
    },
  }),
)
```

## Other Match Patterns

For non-tagged unions, use `Match.when` with predicates:

```typescript
import { Match } from 'effect'

const match = Match.type<string | number>().pipe(
  Match.when(Match.number, (n) => `number: ${n}`),
  Match.when(Match.string, (s) => `string: ${s}`),
  Match.exhaustive,
)
```

Built-in predicates: `Match.string`, `Match.number`, `Match.boolean`, `Match.bigint`, `Match.symbol`, `Match.date`, `Match.null`, `Match.undefined`, `Match.defined`, `Match.any`.
