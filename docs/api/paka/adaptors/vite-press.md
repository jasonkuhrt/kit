# Paka.Adaptors.VitePress

## Import

::: code-group

```typescript [Namespace]
import { Paka } from '@wollybeard/kit'

// Access via namespace
Paka.Adaptors.VitePress
```

```typescript [Barrel]
import { VitePress } from '@wollybeard/kit/paka'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `generate`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/adaptors/vitepress.ts#L82" /> {#f-generate-82}

```typescript
(model: Package, config: VitePressConfig): void
```

**Parameters:**

- `model` - The extracted interface model
- `config` - VitePress generation configuration

Generate VitePress documentation from interface model.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `generateSidebar`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/adaptors/vitepress.ts#L131" /> {#f-generate-sidebar-131}

```typescript
(model: Package, categoryOrder?: string[] | undefined): { text: string; items: { text: string; link: string; items?: any[]; collapsed?: boolean; }[]; }[]
```

**Parameters:**

- `model` - The extracted interface model
- `categoryOrder` - Optional category ordering (defaults to alphabetical)

**Returns:** Sidebar items grouped by category

Generate VitePress sidebar configuration from interface model.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `VitePressConfig`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/adaptors/vitepress.ts#L25" /> {#t-vite-press-config-25}

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
  /** Optional category ordering for sidebar (defaults to alphabetical with "Other" last) */
  categoryOrder?: string[]
}
```

Configuration for VitePress generation.
