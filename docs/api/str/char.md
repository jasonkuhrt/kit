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
" "
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L144" />

Non-breaking space character (U+00A0). A space character that prevents line breaks at its position.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spaceRegular`

```typescript
" "
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L152" />

Regular space character (U+0020). The standard space character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `newline`

```typescript
"\n"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L159" />

Line feed (newline) character. Used to create line breaks in text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bullet`

```typescript
"•"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L167" />

Bullet character (U+2022). Standard bullet point symbol: •

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `middleDot`

```typescript
"·"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L175" />

Middle dot character (U+00B7). Centered dot symbol: ·

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `whiteBullet`

```typescript
"◦"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L194" />

White bullet character (U+25E6). Hollow circle symbol: ◦

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inverseBullet`

```typescript
"◘"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L202" />

Inverse bullet character (U+25D8). Inverse white circle symbol: ◘

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `squareWithLeftHalfBlack`

```typescript
"◧"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L210" />

Square with left half black character (U+25E7). Half-filled square symbol: ◧

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `rightwardsArrow`

```typescript
"→"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L218" />

Rightwards arrow character (U+2192). Right-pointing arrow symbol: →

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `pipe`

```typescript
"|"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L226" />

Vertical bar (pipe) character (U+007C). Vertical line symbol: |

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingHorizontal`

```typescript
"─"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L234" />

Box drawing horizontal line character (U+2500). Horizontal line symbol: ─

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingHorizontalHeavy`

```typescript
"━"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L242" />

Box drawing heavy horizontal line character (U+2501). Bold horizontal line symbol: ━

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingVertical`

```typescript
"│"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L250" />

Box drawing vertical line character (U+2502). Vertical line symbol: │

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingDownRight`

```typescript
"┌"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L258" />

Box drawing down and right character (U+250C). Top-left corner symbol: ┌

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingDownLeft`

```typescript
"┐"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L266" />

Box drawing down and left character (U+2510). Top-right corner symbol: ┐

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingUpRight`

```typescript
"└"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L274" />

Box drawing up and right character (U+2514). Bottom-left corner symbol: └

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingUpLeft`

```typescript
"┘"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L282" />

Box drawing up and left character (U+2518). Bottom-right corner symbol: ┘

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ballotX`

```typescript
"✗"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L290" />

Ballot X character (U+2717). X mark symbol: ✗

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplicationX`

```typescript
"✕"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L298" />

Multiplication X character (U+2715). Multiplication X symbol: ✕

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `checkMark`

```typescript
"✓"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L306" />

Check mark character (U+2713). Check symbol: ✓

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackSquare`

```typescript
"■"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L314" />

Black square character (U+25A0). Filled square symbol: ■

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `whiteCircle`

```typescript
"○"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L322" />

White circle character (U+25CB). Hollow circle symbol: ○

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackUpPointingTriangle`

```typescript
"▲"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L330" />

Black up-pointing triangle character (U+25B2). Filled upward triangle symbol: ▲

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `emDash`

```typescript
"—"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L338" />

Em dash character (U+2014). Long dash symbol: —

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `exclamation`

```typescript
"!"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L345" />

Exclamation mark character. Often used for negation or emphasis: !

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `colon`

```typescript
":"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L352" />

Colon character. Often used as a separator or delimiter: :

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `comma`

```typescript
","
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L359" />

Comma character. Often used as a list separator: ,

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `asterisk`

```typescript
"*"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L366" />

Asterisk character. Often used as a wildcard or multiplication symbol: *

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `at`

```typescript
"@"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L373" />

At sign character. Often used in email addresses and mentions:

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `plus`

```typescript
"+"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L380" />

Plus sign character. Used for addition or positive values: +

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `hyphen`

```typescript
"-"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L387" />

Hyphen/minus character. Used for subtraction, ranges, or negative values: -

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetterUpper`

```typescript
type HexLetterUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L94" />

Hexadecimal letter (uppercase).

Represents hex digits A-F in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetterLower`

```typescript
type HexLetterLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L105" />

Hexadecimal letter (lowercase).

Represents hex digits a-f in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetter`

```typescript
type HexLetter = HexLetterUpper | HexLetterLower
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L115" />

Hexadecimal letter (uppercase or lowercase).

Represents hex digits A-F or a-f in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexDigit`

```typescript
type HexDigit = Digit | HexLetter
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L128" />

Hexadecimal digit (0-9, A-F, a-f).

Represents a single character in base-16 (hexadecimal) number system. Used for colors (#FF5733), memory addresses, data encoding, etc.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackCircle`

```typescript
"●"
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L186" />
