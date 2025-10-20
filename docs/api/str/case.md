# Str.Case

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Case
```

```typescript [Barrel]
import { Case } from '@wollybeard/kit/str'
```

:::

## Case Conversion

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `constant`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L60" /> {#f-constant-60}

```typescript
(name: string): string
```

**Parameters:**

- `name` - The string to convert

**Returns:** The constant cased string

Convert string to CONSTANT_CASE (SCREAMING_SNAKE_CASE). Commonly used for environment variables and constants.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// [!code word:constant:1]
Str.Case.constant('helloWorld') // 'HELLO_WORLD'
// [!code word:constant:1]
Str.Case.constant('foo-bar') // 'FOO_BAR'
// [!code word:constant:1]
Str.Case.constant('myEnvVar') // 'MY_ENV_VAR'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `title`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L75" /> {#f-title-75}

```typescript
(str: string): string
```

**Parameters:**

- `str` - The string to convert

**Returns:** The title cased string

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `capAll`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L97" /> {#f-cap-all-97}

```typescript
<$S extends string>(str: $S): Uppercase<$S>
```

**Parameters:**

- `str` - The string to convert

**Returns:** The uppercase string with Uppercase type

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `uncapFirst`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L113" /> {#f-uncap-first-113}

```typescript
<$S extends string>(s: $S): Uncapitalize<$S>
```

**Parameters:**

- `s` - The string to convert

**Returns:** The string with lowercase first letter and Uncapitalize type

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `capFirst`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/case/case.ts#L129" /> {#f-cap-first-129}

```typescript
<$S extends string>(string: $S): Capitalize<$S>
```

**Parameters:**

- `string` - The string to capitalize

**Returns:** The string with capitalized first letter and Capitalize type

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `camel`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/camelCase.d.ts#L17" /> {#f-camel-17}

```typescript
(str: string): string
(str: string): string
```

**Parameters:**

- `str` - The string that is to be changed to camel case.

**Returns:** string - The converted string to camel case.

Converts a string to camel case.

Camel case is the naming convention in which the first word is written in lowercase and each subsequent word begins with a capital letter, concatenated without any separator characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `kebab`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/kebabCase.d.ts#L15" /> {#f-kebab-15}

```typescript
(str: string): string
(str: string): string
```

**Parameters:**

- `str` - The string that is to be changed to kebab case.

**Returns:** string - The converted string to kebab case.

Converts a string to kebab case.

Kebab case is the naming convention in which each word is written in lowercase and separated by a dash (-) character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pascal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/pascalCase.d.ts#L15" /> {#f-pascal-15}

```typescript
(str: string): string
(str: string): string
```

**Parameters:**

- `str` - The string that is to be changed to pascal case.

**Returns:** string - The converted string to Pascal case.

Converts a string to Pascal case.

Pascal case is the naming convention in which each word is capitalized and concatenated without any separator characters.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `snake`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./node_modules/.pnpm/es-toolkit@1.39.10/node_modules/es-toolkit/dist/string/snakeCase.d.ts#L15" /> {#f-snake-15}

```typescript
(str: string): string
(str: string): string
```

**Parameters:**

- `str` - The string that is to be changed to snake case.

**Returns:** string - The converted string to snake case.

Converts a string to snake case.

Snake case is the naming convention in which each word is written in lowercase and separated by an underscore (_) character.
