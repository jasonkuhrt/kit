//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Types
//
//

/**
 * Uppercase letter.
 */
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
