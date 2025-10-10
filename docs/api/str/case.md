# Str.Case

_Str_ / **Case**

Convert string to camelCase.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Case.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Case.someFunction()
```

:::

## Case Conversion

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `title`

```typescript
;((str: string) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L58" />

Convert string to Title Case. Replaces hyphens and underscores with spaces and capitalizes the first letter of each word.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:title:1]
Str.Case.title('hello-world') // 'Hello World'
// [!code word:title:1]
Str.Case.title('foo_bar') // 'Foo Bar'
// [!code word:title:1]
Str.Case.title('the quick brown fox') // 'The Quick Brown Fox'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `capAll`

```typescript
;(<$S extends string>(str: $S) => Uppercase<$S>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L80" />

Convert string to UPPERCASE with type-level transformation. Preserves the uppercase type at the type level.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
uppercase('hello') // Type: "HELLO" (not string)
uppercase('world') // Type: "WORLD"

// Works with plain strings too
uppercase('hello world') // 'HELLO WORLD'
uppercase('FooBar') // 'FOOBAR'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `uncapFirst`

```typescript
;(<$S extends string>(s: $S) => Uncapitalize<$S>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L96" />

Convert the first letter of a string to lowercase with type-level transformation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
lowerCaseFirst('Hello') // Type: "hello"
lowerCaseFirst('World') // Type: "world"
lowerCaseFirst('HELLO') // Type: "hELLO"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `capFirst`

```typescript
;(<$S extends string>(string: $S) => Capitalize<$S>)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L112" />

Capitalize the first letter of a string with type-level transformation.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
capitalizeFirst('hello') // Type: "Hello"
capitalizeFirst('world') // Type: "World"
capitalizeFirst('foo bar') // Type: "Foo bar"
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `camel`

```typescript
function camelCase(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/camelCase.d.ts#L17" />

Converts a string to camel case.

Camel case is the naming convention in which the first word is written in lowercase and each subsequent word begins with a capital letter, concatenated without any separator characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `kebab`

```typescript
function kebabCase(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/kebabCase.d.ts#L15" />

Converts a string to kebab case.

Kebab case is the naming convention in which each word is written in lowercase and separated by a dash (-) character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pascal`

```typescript
function pascalCase(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/pascalCase.d.ts#L15" />

Converts a string to Pascal case.

Pascal case is the naming convention in which each word is capitalized and concatenated without any separator characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `snake`

```typescript
function snakeCase(str: string): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/snakeCase.d.ts#L15" />

Converts a string to snake case.

Snake case is the naming convention in which each word is written in lowercase and separated by an underscore (_) character.
