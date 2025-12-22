---
name: writing-tests
description: Writes tests following project conventions. Handles test file organization, runtime vs type tests, table-driven tests with Test module, and type assertions with Assert API.
---

# Writing Tests

## Steps

1. **Create test file** colocated with module: `_.test.ts` for module tests, `<file>.test.ts` for complex parts
2. **Import the namespace**: `import { ModuleName } from './_.js'`
3. **Write tests** using appropriate patterns below

## Reference

### Test Categories

| Category | File | Purpose |
|----------|------|---------|
| Runtime | `.test.ts` | Test runtime behavior |
| Type | `.test-d.ts` | Validate TypeScript types via `tsc` |

### Table-Driven Tests (Preferred)

Use Kit's `Test` module for table-driven tests:

```typescript
import { Test } from '@kouka/test'

// Function mode - types inferred from function
Test.on(add)
  .cases(
    [[2, 3], 5],
    [[-1, 1], 0]
  )
  .test()

// Describe mode - with custom types
Test.describe('Transform')
  .inputType<string>()
  .outputType<string>()
  .cases(['hello', 'HELLO'])
  .test(({ input, output }) => {
    expect(input.toUpperCase()).toBe(output)
  })
```

### Type Assertions

Use value-level `Assert` API (reports ALL errors, not just first):

```typescript
import { Assert } from '@kouka/assert'

// Preferred - value-level
Assert.exact.ofAs<string>().on(value)

// In .test-d.ts - flat type aliases (no test blocks)
type _pass1 = Assert.exact.of<string, string>

// @ts-expect-error - testing that types fail
type _fail1 = Assert.exact.of<string, number>
```

### File Organization

```
src/foo/
├── _.test.ts              # Module tests (simple interface)
└── complex-part.test.ts   # Dedicated tests for complex parts
```

## Notes

- **Don't use top-level describe** blocks repeating module name - file path provides context
- **Don't wrap Test.on()** inside Vitest `describe` - Test module creates its own
- **Don't use Assert.Cases<>** - it short-circuits on first error
- **Prefer fast-check** for property-based testing when applicable
- **Be concise** - don't write sprawling test code
