# Paka.Extractor

## Import

::: code-group

```typescript [Namespace]
import { Paka } from '@wollybeard/kit'

// Access via namespace
Paka.Extractor
```

```typescript [Barrel]
import { Extractor } from '@wollybeard/kit/paka'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `extractFromFiles`

```typescript
(params: { projectRoot?: string; files: Layout; entrypoints?: string[]; extractorVersion?: string; filterUnderscoreExports?: boolean; }): Package
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/extract.ts#L41" />

**Parameters:**

- `params` - Extraction parameters including files layout

**Returns:** Complete interface model

Pure extraction function that processes files without I/O. Takes all files as input and returns the extracted model.

**Examples:**

```typescript twoslash
// @noErrors
import { Paka } from '@wollybeard/kit/paka'
// ---cut---
// [!code word:spec:1]
const layout = Dir.spec('/')
  .add('package.json', { name: 'x', exports: { './foo': './build/foo/$.js' } })
  .add('src/foo/$.ts', 'export const bar = () => {}')
  .toLayout()

// [!code word:extractFromFiles:1]
const model = Paka.Extractor.extractFromFiles({ files: layout })
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `extract`

```typescript
(config: ExtractConfig): Package
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/extract.ts#L312" />

**Parameters:**

- `config` - Extraction configuration

**Returns:** Complete interface model

Extract documentation model from TypeScript source files.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `categorize`

```typescript
(decl: Node<ts.Node>): Category
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/categorize.ts#L18" />

**Parameters:**

- `decl` - The declaration node to categorize

**Returns:** Category with level (value/type) and specific type

Categorize a TypeScript declaration node into export level and type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `extractExport`

```typescript
(name: string, decl: ExportedDeclarations): unknown
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/export.ts#L26" />

**Parameters:**

- `name` - The export name
- `decl` - The declaration node

**Returns:** Export object with all metadata

Extract export information from a declaration node.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseJSDoc`

```typescript
(decl: Node<ts.Node>): JSDocInfo
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/jsdoc.ts#L258" />

**Parameters:**

- `decl` - The declaration node to extract JSDoc from

**Returns:** Parsed JSDoc information

Parse JSDoc from a declaration node.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `extractModuleFromFile`

```typescript
(sourceFile: SourceFile, location: RelFile, options?: ModuleExtractionOptions = {}): any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/module.ts#L240" />

**Parameters:**

- `sourceFile` - The source file to extract from
- `location` - Relative file path from project root
- `options` - Extraction options for filtering

**Returns:** Module with all exports

Extract a module from a source file.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `extractModule`

```typescript
(moduleDecl: ModuleDeclaration, location: RelFile, options?: ModuleExtractionOptions = {}): any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/module.ts#L438" />

**Parameters:**

- `moduleDecl` - The module/namespace declaration
- `location` - Relative file path from project root
- `options` - Extraction options for filtering

**Returns:** Module with all namespace exports

Extract a module from a namespace declaration.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExtractConfig`

```typescript
type ExtractConfig = {
  /** Project root directory */
  projectRoot: string
  /** Path to tsconfig.json */
  tsconfigPath?: string
  /** Specific entrypoints to extract (if not specified, extracts all from package.json) */
  entrypoints?: string[]
  /** Extractor version */
  extractorVersion?: string
  /** Filter exports that start with underscore `_` prefix (default: false) */
  filterUnderscoreExports?: boolean
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/extract.ts#L293" />

Configuration for extraction.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Category`

```typescript
type Category = {
  level: ExportLevel
  type: ValueExportType | TypeExportType
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/categorize.ts#L7" />

Categorization result for a declaration node.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `JSDocInfo`

```typescript
type JSDocInfo = {
  description: string | undefined
  guide: string | undefined
  examples: Example[]
  deprecated: string | undefined
  category: string | undefined
  tags: Record<string, string>
  /** Force this export to be treated as a namespace */
  forceNamespace?: boolean
  /** Mark this export as a builder pattern entry point */
  isBuilder?: boolean
  /** Mark this export as internal (should not appear in public documentation) */
  internal?: boolean
  /** Parameter descriptions from @param tags (name -> description) */
  params: Record<string, string>
  /** Return value description from @returns tag */
  returns: string | undefined
  /** Error descriptions from @throws tags */
  throws: string[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/jsdoc.ts#L8" />

Parsed JSDoc information.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ModuleExtractionOptions`

```typescript
type ModuleExtractionOptions = {
  /** Filter exports marked with @internal */
  filterInternal?: boolean
  /** Filter exports starting with underscore _ prefix */
  filterUnderscoreExports?: boolean
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/paka/extractor/nodes/module.ts#L208" />

Options for module extraction.
