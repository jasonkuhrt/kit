# Html

HTML utility functions for escaping and working with HTML content.

## Import

::: code-group

```typescript [Namespace]
import { Html } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Html from '@wollybeard/kit/html'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `escape`

```typescript
(string: unknown): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/html/html.ts#L37" />

**Parameters:**

- `string` - The string to escape (will be coerced to string if not already)

**Returns:** The escaped string safe for use in HTML

Escape HTML special characters to prevent XSS vulnerabilities.

Converts the following characters to their HTML entity equivalents:

- `"` → `&quot;`
- `'` → `&#39;`
- `&` → `&amp;`
- `&lt;` → `&lt;`
- `&gt;` → `&gt;`

**Examples:**

```typescript twoslash
// @noErrors
import { Html } from '@wollybeard/kit/html'
// ---cut---
// [!code word:escape:1]
Html.escape('Use Array<T> or Record<K, V>')
// => 'Use Array&lt;T&gt; or Record&lt;K, V&gt;'

// [!code word:escape:1]
Html.escape('<script>alert("xss")</script>')
// => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```
