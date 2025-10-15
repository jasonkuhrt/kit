# Paka.Adaptors.VitePress

_Paka.Adaptors_ / **VitePress**

## Import

::: code-group

```typescript [Namespace]
import { Paka } from '@wollybeard/kit'

// Access via namespace
Paka.Adaptors.VitePress.someFunction()
```

```typescript [Barrel]
import * as Paka from '@wollybeard/kit/paka'

// Access via namespace
Paka.Adaptors.VitePress.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `generate`

```typescript
(model: Package, config: VitePressConfig): void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/adaptors/vitepress.ts#L78" />

**Parameters:**

- `model` - The extracted interface model
- `config` - VitePress generation configuration

Generate VitePress documentation from interface model.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `VitePressConfig`

```typescript
type VitePressConfig = {
  /** Output directory for generated markdown files */
  outputDir: string
  /** Base URL for the docs site */
  baseUrl?: string
  /** GitHub repository URL for source links (e.g., 'https://github.com/owner/repo') */
  githubUrl?: string
  /** Group exports by @category tag (auto-detects if undefined) */
  groupByCategory?: boolean
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/adaptors/vitepress.ts#L15" />

Configuration for VitePress generation.
