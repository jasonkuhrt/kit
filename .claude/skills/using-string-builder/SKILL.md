---
name: using-string-builder
description: Multi-line string construction with Str.Builder. Prefer tagged template syntax for readability. Use for rendering output, building messages, or any multi-line string construction.
---

# Using String Builder

Build multi-line strings with `Str.Builder` from `@kitz/core`.

## Pattern

```typescript
import { Str } from '@kitz/core'

const b = Str.Builder()

// Tagged template syntax (preferred for readability)
b`Line one`
b`Value: ${someValue}`
b`` // Empty line

// Function syntax (when you need conditional/dynamic content)
b(useColors ? styled('text') : 'text')

// Render final string
return b.render()
```

## Syntax Preference

**Prefer tagged template syntax** for static/interpolated strings:

```typescript
// Preferred
b`${style(symbol)} ${name}`
b`  Layer ${i}: ${label}`
b``

// Avoid when possible (use for dynamic/conditional content only)
b(`${style(symbol)} ${name}`)
b('')
```

## When to Use Each Syntax

| Syntax     | Use When                              |
| ---------- | ------------------------------------- |
| `b\`...\`` | Static strings, simple interpolation  |
| `b(...)`   | Conditional content, computed strings |
| `b\`\``    | Empty lines (cleaner than `b('')`)    |

## Configuration

```typescript
// Default: join with newlines
const b = Str.Builder()

// Custom join character (e.g., for inline concatenation)
const hLine = Str.Builder({ join: '' })
hLine`part1`
hLine`part2`
hLine.render() // "part1part2"
```

## Multiple Lines Per Call

```typescript
// Multiple arguments become multiple lines
b(top.render(), mid.render(), bot.render())
```

## Filtering Nulls

```typescript
// Null values are filtered out
b(condition ? 'line' : null) // Only adds line if condition is true
```
