---
name: writing-tests
description: Writes tests following project conventions. Covers @kitz/test table-driven tests, snapshot mode, type assertions, and file organization.
---

# Writing Tests

## Preferences

| Scenario              | Use                             | Why                                 |
| --------------------- | ------------------------------- | ----------------------------------- |
| Testing a function    | `Test.on(fn)`                   | Types inferred, minimal boilerplate |
| Need grouping/nesting | `Test.describe('name')`         | Creates describe blocks             |
| Snapshot-only tests   | `.casesInput(a, b, c)`          | Cleaner than `[[a]], [[b]], [[c]]`  |
| With expected output  | `.cases([[input], output])`     | Tuple format, concise               |
| Need skip/todo/tags   | `.cases({ input, skip: true })` | Object format for metadata          |

## Quick Reference

### Function Mode (preferred)

```typescript
import { Test } from '@kitz/test'

// With expected outputs
Test.on(add).cases([[2, 3], 5], [[0, 0], 0]).test()

// Snapshot mode - use .casesInput() for cleaner syntax
Test.on(Positive.from).casesInput(1, 10, 0, -1).test()
```

### Describe Mode

```typescript
// For grouping or custom types
Test.describe('Parser > decode')
  .on(decode)
  .casesInput('1.2.3', 'invalid', '1.0.0-beta')
  .test()

// Chain describes for multiple groups
Test
  .describe('basic', [[['1.2.3']], [['invalid']]])
  .describe('prerelease', [[['1.0.0-beta']]])
  .test()
```

### Case Formats

<!-- dprint-ignore -->
```typescript
// Tuple (preferred)
[[arg1, arg2], expected]                  // With output
[[arg1, arg2], expected, { comment: 'name' }]  // Named
[[arg1, arg2]]                            // Snapshot

// Object (when need metadata)
{ input: [a, b], output: x, skip: true }
{ todo: 'Not implemented' }
```

### Snapshot Mode

Omit expected output → automatic snapshots. Errors captured automatically:

```
╔═══════════════════════════╗ GIVEN ARGUMENTS
-1
╠═══════════════════════════╣ THEN THROWS ERROR
Error: Must be positive
╚═══════════════════════════╝
```

Hide arguments when redundant: `.snapshots({ arguments: false })`

### Advanced

```typescript
// Matrix - run cases across combinations
Test.describe('transform')
  .matrix({ upper: [true, false], prefix: ['', 'x_'] })
  .casesInput('hello', 'world')
  .test(({ input, matrix }) => {/* 8 tests total */})

// Output transformation - partial expectations
Test.on(createUser)
  .onOutput((partial) => ({ ...defaults, ...partial }))
  .cases([['Alice'], { role: 'admin' }])
  .test()

// Custom assertion
Test.on(divide)
  .cases([[10, 3], 3.33])
  .test(({ result, output }) => expect(result).toBeCloseTo(output))
```

### Config Methods

`.only()` · `.skip()` · `.skip('reason')` · `.skipIf(() => bool)` · `.concurrent()`

## Type Assertions

```typescript
import { Assert } from '@kitz/assert'

Assert.exact.ofAs<string>().on(value) // Value-level (preferred)

// In .test-d.ts files
type _pass = Assert.exact.of<string, string>
// @ts-expect-error
type _fail = Assert.exact.of<string, number>
```

## File Organization

| File          | Purpose              |
| ------------- | -------------------- |
| `_.test.ts`   | Module runtime tests |
| `foo.test.ts` | Complex part tests   |
| `_.test-d.ts` | Type-level tests     |

## Don'ts

- Don't wrap `Test.on()` in vitest `describe` - it creates its own
- Don't use `Assert.Cases<>` - short-circuits on first error
- Don't use `[[x]], [[y]], [[z]]` when `.casesInput(x, y, z)` works
- Don't use `dprint-ignore` with `.casesInput()` - single column doesn't need alignment
