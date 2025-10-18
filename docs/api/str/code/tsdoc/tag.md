# Str.Code.TSDoc.tag

Structured JSDoc tag helpers.

These helpers generate properly formatted JSDoc tags with automatic escaping. All helpers return `Raw` (safe for injection) or `null` for graceful handling.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Code.TSDoc.tag.someFunction()
```

```typescript [Barrel]
import { tag } from '@wollybeard/kit/str'

// Access via direct import
tag.someFunction()
```

:::
