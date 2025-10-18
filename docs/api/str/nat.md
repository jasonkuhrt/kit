# Str.Nat

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Nat.someFunction()
```

```typescript [Barrel]
import { Nat } from '@wollybeard/kit/str'

// Access via direct import
Nat.someFunction()
```

:::

## Natural Language

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `list`

```typescript
(items: string[]): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L23" />

**Parameters:**

- `items` - Array of strings to format

**Returns:** Formatted list string

Format an array as an English list with commas and "or".

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:list:1]
Str.Nat.list([]) // ''
// [!code word:list:1]
Str.Nat.list(['a']) // 'a'
// [!code word:list:1]
Str.Nat.list(['a', 'b']) // 'a or b'
// [!code word:list:1]
Str.Nat.list(['a', 'b', 'c']) // 'a, b, or c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ordinal`

```typescript
(n: number): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L45" />

**Parameters:**

- `n` - Number to convert

**Returns:** Ordinal string (e.g., "1st", "2nd", "3rd", "21st")

Convert a number to its ordinal string representation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:ordinal:1]
Str.Nat.ordinal(1) // '1st'
// [!code word:ordinal:1]
Str.Nat.ordinal(2) // '2nd'
// [!code word:ordinal:1]
Str.Nat.ordinal(3) // '3rd'
// [!code word:ordinal:1]
Str.Nat.ordinal(11) // '11th'
// [!code word:ordinal:1]
Str.Nat.ordinal(21) // '21st'
// [!code word:ordinal:1]
Str.Nat.ordinal(42) // '42nd'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `article`

```typescript
(word: string): "a" | "an"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L209" />

**Parameters:**

- `word` - Word to get article for

**Returns:** "a" or "an"

Determine the correct indefinite article ("a" or "an") for a word.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:article:1]
Str.Nat.article('apple') // 'an'
// [!code word:article:1]
Str.Nat.article('banana') // 'a'
// [!code word:article:1]
Str.Nat.article('hour') // 'an' (irregular)
// [!code word:article:1]
Str.Nat.article('unicorn') // 'a' (irregular)
// [!code word:article:1]
Str.Nat.article('university') // 'a' (irregular)
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `pluralize`

```typescript
{ (word: string, count?: number | undefined, inclusive?: boolean | undefined): string; plural(word: string): string; singular(word: string): string; addPluralRule(rule: Rule, replacement: string): void; addSingularRule(rule: Rule, replacement: string): void; addIrregularRule(single: string, plural: string): void; addUncountableRule(rule: Rule): void; isPlural(word: string): boolean; isSingular(word: string): boolean; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L4" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `plural`

```typescript
(word: string) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L5" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `singular`

```typescript
(word: string) => string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L6" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isPlural`

```typescript
(word: string) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L7" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isSingular`

```typescript
(word: string) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L8" />
