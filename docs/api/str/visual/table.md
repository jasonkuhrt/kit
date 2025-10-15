# Str.Visual.Table

_Str.Visual_ / **Table**

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Visual.Table.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Visual.Table.someFunction()
```

:::

## Text Formatting

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Cell`

```typescript
type Cell = string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L41" />

Visual-aware table operations for multi-column text layout.

Tables are row-major 2D arrays where

table[row][col]

accesses individual cells.

All operations use visual width (ANSI-aware) for alignment and measurement.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit'

// Create table from row data
const table = [
  ['Name', 'Age'],
  ['Alice', '30']
]

// Render with visual alignment
// [!code word:render:1]
Str.Visual.Table.render(table)
// "Name   Age"
// "Alice  30"

// With ANSI codes
const colored = [['\x1b[31mRed\x1b[0m', 'Normal']]
// [!code word:render:1]
Str.Visual.Table.render(colored, { separator: ' | ' })
// "Red | Normal"  (correctly aligned despite ANSI)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Row`

```typescript
type Row = Cell[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L48" />

Row of cells in a table.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Table`

```typescript
type Table = Row[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L58" />

Row-major 2D table of text cells.

Access pattern:

table[rowIndex][columnIndex]

Can be jagged (rows with different lengths).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `RenderOptions`

```typescript
interface RenderOptions {
  /**
   * String to place between columns.
   * @default '   ' (three spaces)
   */
  separator?: string

  /**
   * How to align content within columns.
   * @default 'left'
   */
  align?: 'left' | 'right'

  /**
   * Explicit column widths. If omitted, auto-calculated from content.
   * Useful for forcing specific column sizes.
   */
  columnWidths?: number[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L65" />

Options for rendering tables into formatted text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `render`

```typescript
(table: Table, options?: RenderOptions | undefined): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L115" />

**Parameters:**

- `table` - The table to render
- `options` - Formatting options

**Returns:** Multi-line string with aligned columns

Render table rows into a formatted multi-line string.

Each column is aligned to its maximum visual width (or explicit width if provided).

Missing cells in jagged arrays are treated as empty strings.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const table = [
  ['Name', 'Age', 'City'],
  ['Alice', '30', 'NYC'],
  ['Bob', '25', 'LA']
]

// [!code word:render:1]
Str.Visual.Table.render(table)
// "Name   Age  City"
// "Alice  30   NYC"
// "Bob    25   LA"

// [!code word:render:1]
Str.Visual.Table.render(table, { separator: ' | ', align: 'right' })
// " Name | Age | City"
// "Alice |  30 |  NYC"
// "  Bob |  25 |   LA"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `renderOn`

```typescript
(table: Table) => (options?: RenderOptions | undefined) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L136" />

Curried version of

render

with table first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `renderWith`

```typescript
(options?: RenderOptions | undefined) => (table: Table) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L142" />

Curried version of

render

with options first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `renderColumns`

```typescript
(columns: string[][], options?: RenderOptions | undefined): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L180" />

**Parameters:**

- `columns` - Array of columns, each column is an array of cell values
- `options` - Formatting options

**Returns:** Multi-line string with aligned columns

Render columns of text as aligned output.

Takes column-oriented data where each column can have multiple lines.

Columns with different heights are padded with empty strings.

Transposes the column data to row-oriented format before rendering.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Column-oriented data
const columns = [
  ['Name', 'Alice', 'Bob'],    // Column 1
  ['Age', '30', '25']           // Column 2
]

// [!code word:renderColumns:1]
Str.Visual.Table.renderColumns(columns)
// "Name   Age"
// "Alice  30"
// "Bob    25"

// Handles jagged arrays
const jagged = [
  ['A', 'B'],
  ['X', 'Y', 'Z']
]
// [!code word:renderColumns:1]
Str.Visual.Table.renderColumns(jagged)
// "A  X"
// "B  Y"
// "   Z"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `renderColumnsOn`

```typescript
(columns: string[][]) => (options?: RenderOptions | undefined) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L190" />

Curried version of

renderColumns

with columns first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `renderColumnsWith`

```typescript
(options?: RenderOptions | undefined) => (columns: string[][]) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L196" />

Curried version of

renderColumns

with options first.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `columnWidths`

```typescript
(table: Table): number[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L219" />

**Parameters:**

- `table` - The table to measure

**Returns:** Array of column widths

Calculate the visual width of each column.

Returns an array where each element is the maximum visual width

of cells in that column.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const table = [
  ['hi', 'world'],
  ['hello', 'x']
]

// [!code word:columnWidths:1]
Str.Visual.Table.columnWidths(table)
// [5, 5]  (max of 'hi'/'hello', max of 'world'/'x')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `dimensions`

```typescript
(table: Table): { rows: number; columns: number; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L251" />

**Parameters:**

- `table` - The table to measure

**Returns:** Object with row and column counts

Get the dimensions of a table.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const table = [['a', 'b'], ['c']]
// [!code word:dimensions:1]
Str.Visual.Table.dimensions(table)
// { rows: 2, columns: 2 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalize`

```typescript
(table: Table): Table
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/visual-table.ts#L274" />

**Parameters:**

- `table` - The table to normalize

**Returns:** Rectangular table

Normalize a jagged table to be rectangular.

Fills missing cells with empty strings so all rows have the same length.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
const jagged = [['a', 'b'], ['c']]
// [!code word:normalize:1]
Str.Visual.Table.normalize(jagged)
// [['a', 'b'], ['c', '']]
```
