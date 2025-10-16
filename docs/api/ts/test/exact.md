# Ts.Test.exact

_Ts.Test_ / **exact**

Exact relation at value level - namespace-only (not callable).

All extractors are defined as const values using the runtime infrastructure. For plain checks, use `.is`. For extraction, use specific extractors.

**No callable interface** - namespace-only for clean autocomplete!

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Test.exact.someFunction()
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'

// Access via namespace
Ts.Test.exact.someFunction()
```

:::
