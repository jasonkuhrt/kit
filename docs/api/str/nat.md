# Str.Nat

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Nat
```

```typescript [Barrel]
import { Nat } from '@wollybeard/kit/str'
```

:::

## Natural Language

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `list`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L23" /> {#f-list-23}

```typescript
(items: string[]): string
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ordinal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L45" /> {#f-ordinal-45}

```typescript
(n: number): string
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `article`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L209" /> {#f-article-209}

```typescript
(word: string): "a" | "an"
```

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `pluralize`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L4" /> {#c-pluralize-4}

```typescript
{ (word: string, count?: number | undefined, inclusive?: boolean | undefined): string; plural(word: string): string; singular(word: string): string; addPluralRule(rule: Rule, replacement: string): void; addSingularRule(rule: Rule, replacement: string): void; addIrregularRule(single: string, plural: string): void; addUncountableRule(rule: Rule): void; isPlural(word: string): boolean; isSingular(word: string): boolean; }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `plural`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L5" /> {#c-plural-5}

```typescript
;((word: string) => string)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `singular`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L6" /> {#c-singular-6}

```typescript
;((word: string) => string)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isPlural`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L7" /> {#c-is-plural-7}

```typescript
;((word: string) => boolean)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `isSingular`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/nat/nat.ts#L8" /> {#c-is-singular-8}

```typescript
;((word: string) => boolean)
```
