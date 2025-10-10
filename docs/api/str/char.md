# Str.Char

_Str_ / **Char**

Uppercase letter.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Char.someFunction()
```

```typescript [Barrel]
import * as Str from '@wollybeard/kit/str'

// Access via namespace
Str.Char.someFunction()
```

:::

## Character Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spaceNoBreak`

```typescript
' '
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L99" />

Non-breaking space character (U+00A0). A space character that prevents line breaks at its position.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spaceRegular`

```typescript
' '
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L107" />

Regular space character (U+0020). The standard space character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `newline`

```typescript
'\n'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L114" />

Line feed (newline) character. Used to create line breaks in text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bullet`

```typescript
'•'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L122" />

Bullet character (U+2022). Standard bullet point symbol: •

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `middleDot`

```typescript
'·'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L130" />

Middle dot character (U+00B7). Centered dot symbol: ·

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `whiteBullet`

```typescript
'◦'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L149" />

White bullet character (U+25E6). Hollow circle symbol: ◦

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inverseBullet`

```typescript
'◘'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L157" />

Inverse bullet character (U+25D8). Inverse white circle symbol: ◘

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `squareWithLeftHalfBlack`

```typescript
'◧'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L165" />

Square with left half black character (U+25E7). Half-filled square symbol: ◧

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `rightwardsArrow`

```typescript
'→'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L173" />

Rightwards arrow character (U+2192). Right-pointing arrow symbol: →

## Character Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `LetterUpper`

```typescript
type LetterUpper =
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
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L13" />

Uppercase letter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `LetterLower`

```typescript
type LetterLower =
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
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L45" />

Lowercase letter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Letter`

```typescript
type Letter = LetterLower | LetterUpper
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L77" />

Any letter (uppercase or lowercase).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Digit`

```typescript
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L83" />

Digit character.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackCircle`

```typescript
'●'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L141" />
