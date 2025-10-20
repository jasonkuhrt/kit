# Str.Char

Uppercase letter.

## Import

::: code-group

```typescript [Namespace]
import { Str } from '@wollybeard/kit'

// Access via namespace
Str.Char
```

```typescript [Barrel]
import { Char } from '@wollybeard/kit/str'
```

:::

## Character Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spaceNoBreak`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L147" /> {#c-space-no-break-147}

```typescript
' '
```

Non-breaking space character (U+00A0). A space character that prevents line breaks at its position.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `spaceRegular`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L155" /> {#c-space-regular-155}

```typescript
' '
```

Regular space character (U+0020). The standard space character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `newline`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L162" /> {#c-newline-162}

```typescript
'\n'
```

Line feed (newline) character. Used to create line breaks in text.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `bullet`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L170" /> {#c-bullet-170}

```typescript
'•'
```

Bullet character (U+2022). Standard bullet point symbol: •

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `middleDot`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L178" /> {#c-middle-dot-178}

```typescript
'·'
```

Middle dot character (U+00B7). Centered dot symbol: ·

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `whiteBullet`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L197" /> {#c-white-bullet-197}

```typescript
'◦'
```

White bullet character (U+25E6). Hollow circle symbol: ◦

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inverseBullet`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L205" /> {#c-inverse-bullet-205}

```typescript
'◘'
```

Inverse bullet character (U+25D8). Inverse white circle symbol: ◘

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `squareWithLeftHalfBlack`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L213" /> {#c-square-with-left-half-black-213}

```typescript
'◧'
```

Square with left half black character (U+25E7). Half-filled square symbol: ◧

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `rightwardsArrow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L221" /> {#c-rightwards-arrow-221}

```typescript
'→'
```

Rightwards arrow character (U+2192). Right-pointing arrow symbol: →

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L229" /> {#c-pipe-229}

```typescript
'|'
```

Vertical bar (pipe) character (U+007C). Vertical line symbol: |

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingHorizontal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L237" /> {#c-box-drawing-horizontal-237}

```typescript
'─'
```

Box drawing horizontal line character (U+2500). Horizontal line symbol: ─

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingHorizontalHeavy`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L245" /> {#c-box-drawing-horizontal-heavy-245}

```typescript
'━'
```

Box drawing heavy horizontal line character (U+2501). Bold horizontal line symbol: ━

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingVertical`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L253" /> {#c-box-drawing-vertical-253}

```typescript
'│'
```

Box drawing vertical line character (U+2502). Vertical line symbol: │

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingDownRight`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L261" /> {#c-box-drawing-down-right-261}

```typescript
'┌'
```

Box drawing down and right character (U+250C). Top-left corner symbol: ┌

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingDownLeft`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L269" /> {#c-box-drawing-down-left-269}

```typescript
'┐'
```

Box drawing down and left character (U+2510). Top-right corner symbol: ┐

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingUpRight`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L277" /> {#c-box-drawing-up-right-277}

```typescript
'└'
```

Box drawing up and right character (U+2514). Bottom-left corner symbol: └

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `boxDrawingUpLeft`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L285" /> {#c-box-drawing-up-left-285}

```typescript
'┘'
```

Box drawing up and left character (U+2518). Bottom-right corner symbol: ┘

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ballotX`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L293" /> {#c-ballot-x-293}

```typescript
'✗'
```

Ballot X character (U+2717). X mark symbol: ✗

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplicationX`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L301" /> {#c-multiplication-x-301}

```typescript
'✕'
```

Multiplication X character (U+2715). Multiplication X symbol: ✕

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `checkMark`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L309" /> {#c-check-mark-309}

```typescript
'✓'
```

Check mark character (U+2713). Check symbol: ✓

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackSquare`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L317" /> {#c-black-square-317}

```typescript
'■'
```

Black square character (U+25A0). Filled square symbol: ■

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `whiteCircle`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L325" /> {#c-white-circle-325}

```typescript
'○'
```

White circle character (U+25CB). Hollow circle symbol: ○

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackUpPointingTriangle`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L333" /> {#c-black-up-pointing-triangle-333}

```typescript
'▲'
```

Black up-pointing triangle character (U+25B2). Filled upward triangle symbol: ▲

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `emDash`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L341" /> {#c-em-dash-341}

```typescript
'—'
```

Em dash character (U+2014). Long dash symbol: —

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `exclamation`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L348" /> {#c-exclamation-348}

```typescript
'!'
```

Exclamation mark character. Often used for negation or emphasis: !

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `colon`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L355" /> {#c-colon-355}

```typescript
':'
```

Colon character. Often used as a separator or delimiter: :

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `comma`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L362" /> {#c-comma-362}

```typescript
','
```

Comma character. Often used as a list separator: ,

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `asterisk`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L369" /> {#c-asterisk-369}

```typescript
'*'
```

Asterisk character. Often used as a wildcard or multiplication symbol: *

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `at`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L376" /> {#c-at-376}

```typescript
'@'
```

At sign character. Often used in email addresses and mentions:

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `plus`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L383" /> {#c-plus-383}

```typescript
'+'
```

Plus sign character. Used for addition or positive values: +

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `hyphen`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L390" /> {#c-hyphen-390}

```typescript
'-'
```

Hyphen/minus character. Used for subtraction, ranges, or negative values: -

## Character Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `LetterUpper`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L13" /> {#u-letter-upper-13}

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

Uppercase letter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LetterLower`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L74" /> {#t-letter-lower-74}

```typescript
type LetterLower = LettersLower[number]
```

Lowercase letter.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Letter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L80" /> {#u-letter-80}

```typescript
type Letter = LetterLower | LetterUpper
```

Any letter (uppercase or lowercase).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Digit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L86" /> {#u-digit-86}

```typescript
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
```

Digit character.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetterUpper`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L97" /> {#u-hex-letter-upper-97}

```typescript
type HexLetterUpper = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
```

Hexadecimal letter (uppercase).

Represents hex digits A-F in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetterLower`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L108" /> {#u-hex-letter-lower-108}

```typescript
type HexLetterLower = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
```

Hexadecimal letter (lowercase).

Represents hex digits a-f in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexLetter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L118" /> {#u-hex-letter-118}

```typescript
type HexLetter = HexLetterUpper | HexLetterLower
```

Hexadecimal letter (uppercase or lowercase).

Represents hex digits A-F or a-f in base-16 (values 10-15 in decimal).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `HexDigit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L131" /> {#u-hex-digit-131}

```typescript
type HexDigit = Digit | HexLetter
```

Hexadecimal digit (0-9, A-F, a-f).

Represents a single character in base-16 (hexadecimal) number system. Used for colors (#FF5733), memory addresses, data encoding, etc.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LettersLower`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L41" /> {#t-letters-lower-41}

```typescript
type LettersLower = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `blackCircle`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/str/char/char.ts#L189" /> {#c-black-circle-189}

```typescript
'●'
```
