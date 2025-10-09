# Str

String utilities for text manipulation and analysis.

Provides comprehensive string operations including case conversion, splitting,
matching, replacement, templating, and character utilities. Features type-safe
APIs with strong inference for string literals and patterns.

## Import

```typescript
import { Str } from '@wollybeard/kit/str'
```

## Functions

### isEmpty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type.ts#L13)</sub>

```typescript
(value: string) => value is ""
```

### pattern <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L52)</sub>

```typescript
;(<matches extends Matches>(pattern: RegExp) => Pattern<matches>)
```

### match <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L78)</sub>

```typescript
;(<matches extends Matches>(
  string: string,
  pattern: RegExp | Pattern<matches>,
) => Option<RegExpMatchResult<matches>>)
```

### isMatch <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L102)</sub>

```typescript
;((value: string, pattern: PatternInput) => boolean)
```

### isntMatch <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L146)</sub>

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

### isMatchAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L180)</sub>

```typescript
;((value: string, patterns: PatternsInput) => boolean)
```

### isNotMatchAny <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L217)</sub>

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

### titlizeSlug <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/misc.ts#L16)</sub>

```typescript
;((str: string) => string)
```

### ensureEnd <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/misc.ts#L20)</sub>

```typescript
;((string: string, ending: string) => string)
```

### trim <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L26)</sub>

```typescript
;((value: string) => string)
```

### replaceLeading <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L50)</sub>

```typescript
;((replacement: string, matcher: string, value: string) => string)
```

### replaceLeadingWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L60)</sub>

```typescript
;((replacement: string) => (matcher: string) => (value: string) => string)
```

### replaceLeadingOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L69)</sub>

```typescript
;((value: string) => (replacement: string) => (matcher: string) => string)
```

### replace <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L108)</sub>

```typescript
;((replacement: string, matcher: PatternsInput, value: string) => string)
```

### replaceWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L120)</sub>

```typescript
;((replacement: string) => (matcher: PatternsInput) => (value: string) =>
  string)
```

### replaceOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L129)</sub>

```typescript
;((value: string) => (replacement: string) => (matcher: PatternsInput) =>
  string)
```

### append <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L153)</sub>

```typescript
;((value1: string, value2: string) => string)
```

### prepend <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L190)</sub>

```typescript
;((value1: string, value2: string) => string)
```

### repeat <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L234)</sub>

```typescript
;((value: string, count: number) => string)
```

### removeSurrounding <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L277)</sub>

```typescript
;((str: string, target: string) => string)
```

### truncate <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L331)</sub>

```typescript
;((str: string, maxLength?: number) => string)
```

### split <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L17)</sub>

```typescript
(value: string, separator: string) => string[]
```

### join <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L54)</sub>

```typescript
;((value: string[], separator: string) => string)
```

### merge <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L89)</sub>

```typescript
;((string1: string, string2: string) => string)
```

### table <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/table.ts#L31)</sub>

```typescript
;((
  input: {
    data: Record<string, string>
    separator?: string | false | undefined
    separatorAlignment?: boolean
  },
) => string)
```

### interpolate <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/template.ts#L17)</sub>

```typescript
;((template: string) => (args: TemplateArgs) => string)
```

### isTemplateStringsArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/template.ts#L52)</sub>

```typescript
(args: unknown) => args is TemplateStringsArray
```

### indent <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L63)</sub>

```typescript
;((text: string, size?: number | undefined) => string)
```

### stripIndent <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L106)</sub>

```typescript
;((text: string) => string)
```

## Constants

### Arb <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/traits/arb.ts#L31)</sub>

```typescript
Arb<string>
```

### Eq <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/traits/eq.ts#L20)</sub>

```typescript
Eq<string>
```

### Type <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/traits/type.ts#L5)</sub>

```typescript
Type<string>
```

### defaultRender <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L11)</sub>

```typescript
;((value: string[]) => string)
```

### Case <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/case/case.ts#L9)</sub>

````typescript
export { camelCase as camel } from 'es-toolkit'

/**
 * Convert string to kebab-case.
 * @example
 * ```typescript
 * kebab('helloWorld') // 'hello-world'
 * kebab('FooBar') // 'foo-bar'
 * ```
 */
export { kebabCase as kebab } from 'es-toolkit'

/**
 * Convert string to PascalCase.
 * @example
 * ```typescript
 * pascal('hello-world') // 'HelloWorld'
 * pascal('foo_bar') // 'FooBar'
 * ```
 */
export { pascalCase as pascal } from 'es-toolkit'

/**
 * Convert string to snake_case.
 * @example
 * ```typescript
 * snake('helloWorld') // 'hello_world'
 * snake('FooBar') // 'foo_bar'
 * ```
 */
export { snakeCase as snake } from 'es-toolkit'

/**
 * Convert string to Title Case.
 * Replaces hyphens and underscores with spaces and capitalizes the first letter of each word.
 * @param str - The string to convert
 * @returns The title cased string
 * @example
 * ```typescript
 * title('hello-world') // 'Hello World'
 * title('foo_bar') // 'Foo Bar'
 * title('the quick brown fox') // 'The Quick Brown Fox'
 * ```
 */
export const title = (str: string) => {
  return str
    .replaceAll(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Convert string to UPPERCASE with type-level transformation.
 * Preserves the uppercase type at the type level.
 *
 * @param str - The string to convert
 * @returns The uppercase string with Uppercase<S> type
 * @example
 * ```typescript
 * uppercase('hello')  // Type: "HELLO" (not string)
 * uppercase('world')  // Type: "WORLD"
 *
 * // Works with plain strings too
 * uppercase('hello world') // 'HELLO WORLD'
 * uppercase('FooBar') // 'FOOBAR'
 * ```
 */
export const capAll = <$S extends string>(str: $S): Uppercase<$S> => {
  return str.toUpperCase() as Uppercase<$S>
}

/**
 * Convert the first letter of a string to lowercase with type-level transformation.
 *
 * @param s - The string to convert
 * @returns The string with lowercase first letter and Uncapitalize<S> type
 * @example
 * ```typescript
 * lowerCaseFirst('Hello')  // Type: "hello"
 * lowerCaseFirst('World')  // Type: "world"
 * lowerCaseFirst('HELLO')  // Type: "hELLO"
 * ```
 */
export const uncapFirst = <$S extends string>(s: $S): Uncapitalize<$S> => {
  return (s.charAt(0).toLowerCase() + s.slice(1)) as Uncapitalize<$S>
}

/**
 * Capitalize the first letter of a string with type-level transformation.
 *
 * @param string - The string to capitalize
 * @returns The string with capitalized first letter and Capitalize<S> type
 * @example
 * ```typescript
 * capitalizeFirst('hello')  // Type: "Hello"
 * capitalizeFirst('world')  // Type: "World"
 * capitalizeFirst('foo bar')  // Type: "Foo bar"
 * ```
 */
export const capFirst = <$S extends string>(string: $S): Capitalize<$S> => {
  return (string.charAt(0).toUpperCase() + string.slice(1)) as Capitalize<$S>
}
````

### Char <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/char/char.ts#L12)</sub>

```typescript
export type LetterUpper =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'

/**
 * Lowercase letter.
 */
export type LetterLower =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

/**
 * Any letter (uppercase or lowercase).
 */
export type Letter = LetterLower | LetterUpper

/**
 * Digit character.
 */
export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Values
//
//

/**
 * Non-breaking space character (U+00A0).
 * A space character that prevents line breaks at its position.
 * @see https://unicode-explorer.com/c/00A0
 */
export const spaceNoBreak = `\u00A0`

/**
 * Regular space character (U+0020).
 * The standard space character.
 * @see https://unicode-explorer.com/c/0020
 */
export const spaceRegular = `\u0020`

/**
 * Line feed (newline) character.
 * Used to create line breaks in text.
 */
export const newline = `\n`

/**
 * Bullet character (U+2022).
 * Standard bullet point symbol: •
 * @see https://unicode-explorer.com/c/2022
 */
export const bullet = `\u2022`

/**
 * Middle dot character (U+00B7).
 * Centered dot symbol: ·
 * @see https://unicode-explorer.com/c/00B7
 */
export const middleDot = `\u00B7`

/** @see https://unicode-explorer.com/c/2219 */
// export const bulletOperator = `\u2219`

/**
 * Black circle character (U+25CF).
 * Filled circle symbol: ●
 * @see https://unicode-explorer.com/c/25CF
 */
export const blackCircle = `\u25CF`

/**
 * White bullet character (U+25E6).
 * Hollow circle symbol: ◦
 * @see https://unicode-explorer.com/c/25E6
 */
export const whiteBullet = `\u25E6`

/**
 * Inverse bullet character (U+25D8).
 * Inverse white circle symbol: ◘
 * @see https://unicode-explorer.com/c/25D8
 */
export const inverseBullet = `\u25D8`

/**
 * Square with left half black character (U+25E7).
 * Half-filled square symbol: ◧
 * @see https://unicode-explorer.com/c/25E7
 */
export const squareWithLeftHalfBlack = `\u25E7`

/**
 * Rightwards arrow character (U+2192).
 * Right-pointing arrow symbol: →
 * @see https://unicode-explorer.com/c/2192
 */
export const rightwardsArrow = `\u2192`
```

### isMatchOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L120)</sub>

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

### isMatchWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L133)</sub>

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

### isntMatchOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L155)</sub>

```typescript
;((pattern: PatternInput) => (value: string) => boolean)
```

### isntMatchWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L162)</sub>

```typescript
;((value: string) => (pattern: PatternInput) => boolean)
```

### isMatchAnyOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L190)</sub>

```typescript
;((value: string) => (patterns: PatternsInput) => boolean)
```

### isMatchAnyWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L204)</sub>

```typescript
;((patterns: PatternsInput) => (value: string) => boolean)
```

### isNotMatchAnyOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L226)</sub>

```typescript
;((patternOrPatterns: PatternsInput) => (value: string) => boolean)
```

### isNotMatchAnyWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L233)</sub>

```typescript
;((value: string) => (patternOrPatterns: PatternsInput) => boolean)
```

### stripLeading <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L84)</sub>

```typescript
;((matcher: string) => (value: string) => string)
```

### appendOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L162)</sub>

```typescript
;((value1: string) => (value2: string) => string)
```

### appendWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L174)</sub>

```typescript
;((value2: string) => (value1: string) => string)
```

### prependOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L199)</sub>

```typescript
;((value1: string) => (value2: string) => string)
```

### prependWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L211)</sub>

```typescript
;((value2: string) => (value1: string) => string)
```

### repeatOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L243)</sub>

```typescript
;((value: string) => (count: number) => string)
```

### repeatWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L255)</sub>

```typescript
;((count: number) => (value: string) => string)
```

### removeSurroundingOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L302)</sub>

```typescript
;((str: string) => (target: string) => string)
```

### removeSurroundingWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L309)</sub>

```typescript
;((target: string) => (str: string) => string)
```

### truncateOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L344)</sub>

```typescript
;((str: string) => (maxLength?: number | undefined) => string)
```

### truncateWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L356)</sub>

```typescript
;((maxLength?: number | undefined) => (str: string) => string)
```

### strip <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L377)</sub>

```typescript
;((matcher: PatternsInput) => (value: string) => string)
```

### removeSurroundingSpaceRegular <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L385)</sub>

```typescript
;((str: string) => string)
```

### removeSurroundingSpaceNoBreak <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/replace.ts#L393)</sub>

```typescript
;((str: string) => string)
```

### splitOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L27)</sub>

```typescript
(value: string) => (separator: string) => string[]
```

### splitWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L39)</sub>

```typescript
(separator: string) => (value: string) => string[]
```

### joinOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L63)</sub>

```typescript
;((value: string[]) => (separator: string) => string)
```

### joinWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L75)</sub>

```typescript
;((separator: string) => (value: string[]) => string)
```

### mergeOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/split.ts#L103)</sub>

```typescript
;((string1: string) => (string2: string) => string)
```

### templateVariablePattern <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/template.ts#L28)</sub>

```typescript
RegExp
```

### defaultIndentSize <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L10)</sub>

```typescript
2
```

### defaultIndentCharacter <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L15)</sub>

```typescript
' '
```

### defaultLineSeparator <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L20)</sub>

```typescript
'\n'
```

### lines <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L35)</sub>

```typescript
(value: string) => string[]
```

### unlines <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L48)</sub>

```typescript
;((value: string[]) => string)
```

### indentOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L73)</sub>

```typescript
;((text: string) => (size?: number | undefined) => string)
```

### indentWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/text.ts#L85)</sub>

```typescript
;((size?: number | undefined) => (text: string) => string)
```

## Types

### Empty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type.ts#L18)</sub>

Type for an empty string.

```typescript
export type Empty = ''
```

### Builder <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L17)</sub>

String builder interface for constructing multi-line strings.
Supports both function call syntax and template literal syntax.

```typescript
export interface Builder {
  /**
   * Add lines to the builder.
   * @param linesInput - Lines to add (null values are filtered out)
   * @returns The builder instance for chaining
   */
  (...linesInput: LinesInput): Builder
  /**
   * Add content using template literal syntax.
   * @param strings - Template string array
   * @param values - Interpolated values
   * @returns The builder instance for chaining
   */
  (strings: TemplateStringsArray, ...values: string[]): Builder
  /**
   * The internal state containing accumulated lines.
   */
  state: State
  /**
   * Render the accumulated lines into a single string.
   * @returns The rendered string
   */
  render: () => string
  /**
   * Alias for render() to support string coercion.
   * @returns The rendered string
   */
  toString(): string
}
```

### LinesInput <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L50)</sub>

Input type for lines - allows null values which are filtered out.

```typescript
export type LinesInput = (Line | null)[]
```

### Lines <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L55)</sub>

Array of line strings.

```typescript
export type Lines = Line[]
```

### Line <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L60)</sub>

A single line of text.

```typescript
export type Line = string
```

### State <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/builder.ts#L65)</sub>

Internal state of the string builder.

```typescript
export interface State {
  /**
   * Accumulated lines.
   */
  lines: Lines
}
```

### RegExpMatchResult <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L17)</sub>

```typescript
export type RegExpMatchResult<$Matches extends Matches> =
  & Omit<RegExpMatchArray, 'groups'>
  & {
    groups: $Matches['groups'] extends
      readonly [MatchItem, ...readonly MatchItem[]]
      ? ArrMut.ReduceWithIntersection<ToGroupsProperties<$Matches['groups']>>
      : undefined
  }
  & (
    $Matches extends { indicies: readonly [MatchItem, ...readonly MatchItem[]] }
      ? [originalValue: string, ...$Matches['indicies']]
      : [originalValue: string]
  )
```

### Matches <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L57)</sub>

```typescript
export type Matches = {
  groups?: (string | undefined)[]
  indicies?: (string | undefined)[]
}
```

### PatternInput <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L88)</sub>

```typescript
export type PatternInput = string | RegExp
```

### PatternsInput <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/match.ts#L166)</sub>

```typescript
export type PatternsInput = ArrMut.Maybe<string | RegExp>
```

### TemplateArgs <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/template.ts#L34)</sub>

Arguments object for template interpolation.
Maps variable names to their JSON-serializable values.

```typescript
export type TemplateArgs = Record<string, Json.Value>
```

### EndsWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L12)</sub>

Check if a string ends with a specific suffix.

```typescript
export type EndsWith<S extends string, T extends string> = S extends
  `${string}${T}` ? true : false
```

### StartsWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L17)</sub>

Check if a string starts with a specific prefix.

```typescript
export type StartsWith<S extends string, T extends string> = S extends
  `${T}${string}` ? true : false
```

### LastSegment <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L22)</sub>

Extract the last segment from a path-like string (after the last '/').

```typescript
export type LastSegment<S extends string> = S extends `${string}/${infer Rest}`
  ? LastSegment<Rest>
  : S
```

### RemoveTrailingSlash <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L28)</sub>

Remove trailing slash from a string.

```typescript
export type RemoveTrailingSlash<S extends string> = S extends `${infer Rest}/`
  ? Rest extends '' ? '/' : Rest
  : S
```

### Split <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L35)</sub>

Split a string by a delimiter, filtering out empty segments and '.' segments.
This is useful for path-like strings.

```typescript
export type Split<
  S extends string,
  D extends string,
  Acc extends string[] = [],
> = S extends '' ? Acc
  : S extends `${infer Segment}${D}${infer Rest}`
    ? Segment extends '' ? Split<Rest, D, Acc>
    : Segment extends '.' ? Split<Rest, D, Acc>
    : Split<Rest, D, [...Acc, Segment]>
  : S extends '.' ? Acc
  : [...Acc, S]
```

### Contains <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L45)</sub>

Check if string contains a character.

```typescript
export type Contains<S extends string, C extends string> = S extends
  `${string}${C}${string}` ? true : false
```

### LiteralOnly <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/str/type-level.ts#L54)</sub>

Constraint that only accepts literal strings.
Returns StaticError for non-literal string type with customizable error message.

```typescript
export type LiteralOnly<
  T extends string,
  $ErrorMessage extends string = 'Expected a literal string',
> = string extends T ? Ts.StaticError<
    $ErrorMessage,
    { ReceivedType: T },
    'Use a string literal instead of string type'
  >
  : T
```
