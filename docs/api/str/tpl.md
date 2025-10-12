# Str.Tpl

_Str_ / **Tpl**

Convenience re-export of the built-in TemplateStringsArray type. Contains the string parts of a tagged template literal along with a raw property.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Tpl.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Tpl.someFunction()
```

:::

## Template

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Tpl`

```typescript
type Tpl = TemplateStringsArray
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L16" />

Convenience re-export of the built-in TemplateStringsArray type. Contains the string parts of a tagged template literal along with a raw property.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(strings: Str.Tpl.Tpl.Array, ...values: unknown[]) {
  // strings is TemplateStringsArray
  // strings[0] = "Hello "
  // strings[1] = "!"
  // strings.raw contains raw string values
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is TemplateStringsArray
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L35" />

Type guard to check if a value is a TemplateStringsArray. Used to detect when a function is called as a tagged template literal.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArray(args[0])) {
    // Called as tag`template`
  } else {
    // Called as tag()
  }
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `CallInput`

```typescript
type CallInput = [Tpl, ...unknown[]]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L54" />

Tagged template literal arguments tuple. First element is the template strings array, followed by interpolated values.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const [strings, ...values] = args
    // Process template literal
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isCallInput`

```typescript
(value: unknown) => value is CallInput
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L72" />

Type guard to check if function arguments are from a tagged template literal.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const [strings, ...values] = args
    // Process as template literal
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalizeCall`

```typescript
;((callInput: CallInput) => Call)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L99" />

Parse tagged template literal arguments into structured parts and values.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    const { parts, values } = parse(args)
    // parts[0] = "Hello "
    // parts[1] = "!"
    // values[0] = name
  }
}
tag`Hello ${name}!`
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `renderWith`

```typescript
;((mapper: (value: unknown) => string) => (callInput: CallInput) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L122" />

Render tagged template literal arguments using a custom value renderer.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
// Custom renderer for JSON values
// [!code word:renderWith:1]
// [!code word:stringify:1]
const renderJson = Str.Tpl.renderWith(v => JSON.stringify(v))
function tag(...args: unknown[]) {
  if (isArgs(args)) return renderJson(args)
}
tag`Value: ${{ foo: 'bar' }}` // "Value: {\"foo\":\"bar\"}"

// Custom renderer that prefixes values
// [!code word:renderWith:1]
const renderPrefixed = Str.Tpl.renderWith(v => `[${v}]`)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `render`

```typescript
;((callInput: CallInput) => string)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L147" />

Render tagged template literal arguments to a string. Interpolated values are converted using plain String() coercion.

**Examples:**

```typescript twoslash
// @noErrors
import { Str } from '@wollybeard/kit/str'
// ---cut---
function tag(...args: unknown[]) {
  if (isArgs(args)) {
    // [!code word:render:1]
    return Str.Tpl.render(args)
  }
}
tag`Hello ${name}!` // "Hello World!"
tag`Count: ${42}` // "Count: 42"
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Call`

```typescript
interface Call {
  template: Tpl
  args: unknown[]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/tpl/tpl.ts#L76" />
