# Str Module Enhancements

## Overview

The existing `str` module has a solid foundation with multiple sub-modules, but lacks many common string utilities found in major libraries. This document proposes enhancements while maintaining the modular structure and established patterns.

## Current State Analysis

**Existing Sub-modules:**

- `builder` - Multi-line string building with fluent API
- `case` - Case conversions (camel, kebab, pascal, snake, title)
- `char` - Character operations
- `match` - Type-safe regex matching with capture groups
- `misc` - Miscellaneous utilities (titlizeSlug)
- `replace` - String replacement operations
- `split` - String splitting operations
- `table` - Table formatting
- `template` - Template string operations
- `text` - Text processing (unlines, etc.)
- `type` - String type utilities

**Strengths:**

- Excellent modular organization
- Type-safe regex with capture groups
- Good case conversion utilities
- Template processing capabilities

**Gaps Identified:**

- Limited string validation and checking
- No string formatting/padding utilities
- Missing escape/unescape functions
- No string distance/similarity algorithms
- Limited text processing functions
- No string encoding/decoding utilities
- Missing word/sentence manipulation
- No string truncation/ellipsis utilities

## Proposed Enhancements

### Core String Operations (`core.ts`)

```typescript
/**
 * Type predicate for strings.
 */
export const is = (value: unknown): value is string

/**
 * Safe string conversion.
 */
export const from = (value: unknown): string
export const ensure = (value: unknown): string // Alias

/**
 * Empty string constant.
 */
export const Empty = ''

/**
 * Check if string is empty.
 */
export const isEmpty = (str: string): boolean

/**
 * Check if string is not empty (with type narrowing).
 */
export const isntEmpty = (str: string): str is NonEmptyString

/**
 * Check if string is blank (empty or only whitespace).
 */
export const isBlank = (str: string): boolean

/**
 * Check if string is not blank.
 */
export const isntBlank = (str: string): str is NonEmptyString

/**
 * Get string length.
 */
export const length = (str: string): number

/**
 * Check if string has specific length.
 */
export const hasLength = (str: string, length: number): boolean
export const hasLengthOf = (length: number) => (str: string): boolean

/**
 * Non-empty string type.
 */
export type NonEmptyString = string & { readonly __brand: 'NonEmptyString' }
```

### String Validation and Checking (`validation.ts`)

```typescript
/**
 * String content validation.
 */
export const isAlpha = (str: string): boolean
export const isAlphanumeric = (str: string): boolean
export const isNumeric = (str: string): boolean
export const isDigits = (str: string): boolean

/**
 * Character class checks.
 */
export const isAscii = (str: string): boolean
export const isLatin1 = (str: string): boolean
export const isUtf8 = (str: string): boolean

/**
 * Case checking.
 */
export const isUpperCase = (str: string): boolean
export const isLowerCase = (str: string): boolean
export const isMixedCase = (str: string): boolean
export const isTitleCase = (str: string): boolean

/**
 * Format validation.
 */
export const isEmail = (str: string): boolean
export const isUrl = (str: string): boolean
export const isPhoneNumber = (str: string, locale?: string): boolean
export const isCreditCard = (str: string): boolean
export const isIPAddress = (str: string): boolean
export const isIPv4 = (str: string): boolean
export const isIPv6 = (str: string): boolean
export const isMacAddress = (str: string): boolean
export const isUuid = (str: string): boolean
export const isHex = (str: string): boolean
export const isBase64 = (str: string): boolean

/**
 * Pattern matching.
 */
export const matches = (str: string, pattern: RegExp): boolean
export const matchesWith = (pattern: RegExp) => (str: string): boolean

/**
 * Contains checks.
 */
export const contains = (str: string, substring: string): boolean
export const containsIgnoreCase = (str: string, substring: string): boolean
export const containsWith = (substring: string) => (str: string): boolean
export const containsAny = (str: string, substrings: string[]): boolean
export const containsAll = (str: string, substrings: string[]): boolean

/**
 * Position checks.
 */
export const startsWith = (str: string, prefix: string): boolean
export const startsWithIgnoreCase = (str: string, prefix: string): boolean
export const startsWithAny = (str: string, prefixes: string[]): boolean
export const startsWithWith = (prefix: string) => (str: string): boolean

export const endsWith = (str: string, suffix: string): boolean
export const endsWithIgnoreCase = (str: string, suffix: string): boolean
export const endsWithAny = (str: string, suffixes: string[]): boolean
export const endsWithWith = (suffix: string) => (str: string): boolean
```

### String Formatting and Padding (`formatting.ts`)

```typescript
/**
 * Padding operations.
 */
export const padStart = (str: string, length: number, chars?: string): string
export const padEnd = (str: string, length: number, chars?: string): string
export const padBoth = (str: string, length: number, chars?: string): string

export const padStartWith = (length: number, chars?: string) => (str: string): string
export const padEndWith = (length: number, chars?: string) => (str: string): string
export const padBothWith = (length: number, chars?: string) => (str: string): string

/**
 * Alignment in fixed width.
 */
export const alignLeft = (str: string, width: number, filler?: string): string
export const alignRight = (str: string, width: number, filler?: string): string
export const alignCenter = (str: string, width: number, filler?: string): string

/**
 * Truncation with ellipsis.
 */
export interface TruncateOptions {
  length: number
  ellipsis?: string
  separator?: string // Word boundary
  position?: 'end' | 'middle' | 'start'
}

export const truncate = (str: string, options: TruncateOptions): string
export const truncateWith = (options: TruncateOptions) => (str: string): string

/**
 * Word wrapping.
 */
export interface WrapOptions {
  width: number
  indent?: string
  newline?: string
  breakWords?: boolean
}

export const wrap = (str: string, options: WrapOptions): string
export const wrapWith = (options: WrapOptions) => (str: string): string

/**
 * Indentation.
 */
export const indent = (str: string, spaces: number): string
export const indentWith = (spaces: number) => (str: string): string
export const indentLines = (str: string, spaces: number): string
export const dedent = (str: string): string

/**
 * Number formatting in strings.
 */
export const formatNumber = (template: string, ...numbers: number[]): string
export const formatNumberWith = (...numbers: number[]) => (template: string): string
```

### Escape and Security (`escape.ts`)

```typescript
/**
 * HTML escaping.
 */
export const escapeHtml = (str: string): string
export const unescapeHtml = (str: string): string

/**
 * URL encoding.
 */
export const encodeUrl = (str: string): string
export const decodeUrl = (str: string): string
export const encodeUrlComponent = (str: string): string
export const decodeUrlComponent = (str: string): string

/**
 * String literal escaping.
 */
export const escapeRegex = (str: string): string
export const escapeQuotes = (str: string, quote?: '"' | "'"): string
export const escapeBackslashes = (str: string): string

/**
 * JSON escaping.
 */
export const escapeJson = (str: string): string
export const unescapeJson = (str: string): string

/**
 * SQL escaping.
 */
export const escapeSql = (str: string): string

/**
 * Shell escaping.
 */
export const escapeShell = (str: string): string

/**
 * Base64 encoding/decoding.
 */
export const toBase64 = (str: string): string
export const fromBase64 = (str: string): string

/**
 * Hex encoding/decoding.
 */
export const toHex = (str: string): string
export const fromHex = (str: string): string

/**
 * Unicode normalization.
 */
export const normalize = (str: string, form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'): string
export const normalizeWith = (form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD') => (str: string): string
```

### String Distance and Similarity (`similarity.ts`)

```typescript
/**
 * Levenshtein distance.
 */
export const levenshtein = (str1: string, str2: string): number
export const levenshteinWith = (str1: string) => (str2: string): number

/**
 * Hamming distance (for equal length strings).
 */
export const hamming = (str1: string, str2: string): number | null

/**
 * Jaro similarity.
 */
export const jaro = (str1: string, str2: string): number

/**
 * Jaro-Winkler similarity.
 */
export const jaroWinkler = (str1: string, str2: string): number

/**
 * Cosine similarity.
 */
export const cosine = (str1: string, str2: string): number

/**
 * Soundex algorithm.
 */
export const soundex = (str: string): string

/**
 * Metaphone algorithm.
 */
export const metaphone = (str: string): string

/**
 * Fuzzy matching.
 */
export const fuzzyMatch = (pattern: string, str: string): boolean
export const fuzzyScore = (pattern: string, str: string): number
export const fuzzyMatchWith = (pattern: string) => (str: string): boolean

/**
 * String similarity ratio (0-1).
 */
export const similarity = (str1: string, str2: string): number
export const similarityWith = (str1: string) => (str2: string): number
```

### Advanced Text Processing (`text-advanced.ts`)

```typescript
/**
 * Word operations.
 */
export const words = (str: string, pattern?: RegExp): string[]
export const wordCount = (str: string): number
export const wordsBy = (pattern: RegExp) => (str: string): string[]

/**
 * Sentence operations.
 */
export const sentences = (str: string): string[]
export const sentenceCount = (str: string): number

/**
 * Paragraph operations.
 */
export const paragraphs = (str: string): string[]
export const paragraphCount = (str: string): number

/**
 * Line operations.
 */
export const lines = (str: string): string[]
export const lineCount = (str: string): number
export const nonEmptyLines = (str: string): string[]

/**
 * Character frequency analysis.
 */
export const charFrequency = (str: string): Map<string, number>
export const wordFrequency = (str: string): Map<string, number>

/**
 * Text statistics.
 */
export interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  averageWordsPerSentence: number
  averageCharsPerWord: number
}

export const textStats = (str: string): TextStats

/**
 * Language detection helpers.
 */
export const isLatin = (str: string): boolean
export const isCyrillic = (str: string): boolean
export const isArabic = (str: string): boolean
export const isCJK = (str: string): boolean // Chinese, Japanese, Korean

/**
 * Text cleaning.
 */
export const removeEmptyLines = (str: string): string
export const removeDuplicateSpaces = (str: string): string
export const removeLeadingSpaces = (str: string): string
export const removeTrailingSpaces = (str: string): string
export const normalizeSpaces = (str: string): string
export const stripAccents = (str: string): string
export const removeNonPrintable = (str: string): string
```

### String Transformation (`transform.ts`)

```typescript
/**
 * Reversal.
 */
export const reverse = (str: string): string
export const reverseWords = (str: string): string

/**
 * Capitalization variants.
 */
export const capitalize = (str: string): string
export const uncapitalize = (str: string): string
export const capitalizeWords = (str: string): string
export const capitalizeFirst = (str: string): string
export const capitalizeLast = (str: string): string

/**
 * Character manipulation.
 */
export const swapCase = (str: string): string
export const alternatingCase = (str: string): string

/**
 * Insertion and removal.
 */
export const insertAt = (str: string, index: number, insertion: string): string
export const insertAtWith = (index: number, insertion: string) => (str: string): string

export const removeAt = (str: string, index: number, count?: number): string
export const removeAtWith = (index: number, count?: number) => (str: string): string

export const removeRange = (str: string, start: number, end: number): string
export const removeRangeWith = (start: number, end: number) => (str: string): string

/**
 * Shuffling and randomization.
 */
export const shuffle = (str: string): string
export const scramble = (str: string, preserveSpaces?: boolean): string

/**
 * Rotation.
 */
export const rotateLeft = (str: string, positions: number): string
export const rotateRight = (str: string, positions: number): string
export const rotateLeftBy = (positions: number) => (str: string): string
export const rotateRightBy = (positions: number) => (str: string): string

/**
 * Interleaving.
 */
export const interleave = (str1: string, str2: string): string
export const interleaveWith = (str2: string) => (str1: string): string
```

### String Comparison (`comparison.ts`)

```typescript
/**
 * Case-insensitive operations.
 */
export const equalsIgnoreCase = (str1: string, str2: string): boolean
export const equalsIgnoreCaseWith = (str1: string) => (str2: string): boolean

export const compareIgnoreCase = (str1: string, str2: string): -1 | 0 | 1
export const compareIgnoreCaseWith = (str1: string) => (str2: string): -1 | 0 | 1

/**
 * Natural comparison (numbers in strings).
 */
export const compareNatural = (str1: string, str2: string): -1 | 0 | 1
export const compareNaturalWith = (str1: string) => (str2: string): -1 | 0 | 1

/**
 * Locale-aware comparison.
 */
export const compareLocale = (str1: string, str2: string, locale?: string): -1 | 0 | 1
export const compareLocaleWith = (locale?: string) => (str1: string, str2: string): -1 | 0 | 1

/**
 * Prefix/suffix comparison.
 */
export const commonPrefix = (str1: string, str2: string): string
export const commonSuffix = (str1: string, str2: string): string
export const longestCommonSubstring = (str1: string, str2: string): string

/**
 * Edit distance comparison.
 */
export const editDistance = (str1: string, str2: string): number
export const editDistanceWith = (str1: string) => (str2: string): number
```

### String Generation (`generation.ts`)

```typescript
/**
 * Random string generation.
 */
export const randomAlpha = (length: number): string
export const randomAlphanumeric = (length: number): string
export const randomNumeric = (length: number): string
export const randomHex = (length: number): string

export const randomAlphaWith = (length: number) => (): string
export const randomAlphanumericWith = (length: number) => (): string

/**
 * Custom character set.
 */
export const randomFromCharset = (charset: string, length: number): string
export const randomFromCharsetWith = (charset: string, length: number) => (): string

/**
 * Common random patterns.
 */
export const randomPassword = (length: number, includeSymbols?: boolean): string
export const randomSlug = (length: number): string
export const randomUuid = (): string

/**
 * Seeded random generation.
 */
export class SeededStringGenerator {
  constructor(seed: number)
  alpha(length: number): string
  alphanumeric(length: number): string
  fromCharset(charset: string, length: number): string
}

export const seededGenerator = (seed: number): SeededStringGenerator

/**
 * Pattern-based generation.
 */
export const fromPattern = (pattern: string): string // e.g., "###-AAA-000"
export const fromPatternWith = (pattern: string) => (): string
```

### String Utilities (`utilities.ts`)

```typescript
/**
 * String abbreviation.
 */
export const abbreviate = (str: string, maxLength: number, marker?: string): string
export const abbreviateWith = (maxLength: number, marker?: string) => (str: string): string

/**
 * String difference visualization.
 */
export interface DiffResult {
  added: string[]
  removed: string[]
  unchanged: string[]
}

export const diff = (str1: string, str2: string): DiffResult
export const diffWith = (str1: string) => (str2: string): DiffResult

/**
 * String masking.
 */
export const mask = (str: string, start?: number, end?: number, char?: string): string
export const maskWith = (start?: number, end?: number, char?: string) => (str: string): string

export const maskEmail = (email: string): string
export const maskCreditCard = (cardNumber: string): string
export const maskPhone = (phoneNumber: string): string

/**
 * String compression.
 */
export const compress = (str: string): string
export const decompress = (compressed: string): string

/**
 * String hashing.
 */
export const hash = (str: string, algorithm?: 'md5' | 'sha1' | 'sha256'): string
export const hashWith = (algorithm: 'md5' | 'sha1' | 'sha256') => (str: string): string

/**
 * String interpolation.
 */
export const interpolate = (template: string, values: Record<string, any>): string
export const interpolateWith = (values: Record<string, any>) => (template: string): string

/**
 * Pluralization.
 */
export const pluralize = (word: string, count: number): string
export const pluralizeWith = (count: number) => (word: string): string

export const singularize = (word: string): string
```

## Enhanced Type Definitions

```typescript
/**
 * String brand types.
 */
export type NonEmptyString = string & { readonly __brand: 'NonEmptyString' }
export type EmailString = string & { readonly __brand: 'EmailString' }
export type UrlString = string & { readonly __brand: 'UrlString' }
export type UuidString = string & { readonly __brand: 'UuidString' }
export type HexString = string & { readonly __brand: 'HexString' }
export type Base64String = string & { readonly __brand: 'Base64String' }

/**
 * Case-specific types.
 */
export type CamelCase<T extends string> = string & {
  readonly __brand: 'CamelCase'
}
export type KebabCase<T extends string> = string & {
  readonly __brand: 'KebabCase'
}
export type PascalCase<T extends string> = string & {
  readonly __brand: 'PascalCase'
}
export type SnakeCase<T extends string> = string & {
  readonly __brand: 'SnakeCase'
}

/**
 * Template literal utilities.
 */
export type Split<S extends string, D extends string> = S extends
  `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S]

export type Join<T extends readonly string[], D extends string> = T extends
  readonly [infer F] ? F
  : T extends readonly [infer F, ...infer R]
    ? F extends string
      ? R extends readonly string[] ? `${F}${D}${Join<R, D>}` : never
    : never
  : ''

/**
 * String length types (for short strings).
 */
export type Length<S extends string> = Split<S, ''>['length']
```

## Integration with Existing Modules

### Enhanced Case Module

```typescript
// Add more case conversion types
export const screamingSnakeCase = (str: string): string
export const dotCase = (str: string): string
export const pathCase = (str: string): string
export const constantCase = (str: string): string
export const headerCase = (str: string): string

// Case detection
export const detectCase = (str: string): 'camel' | 'pascal' | 'snake' | 'kebab' | 'mixed' | 'unknown'

// Case conversion with type preservation
export const toCamelCase = <T extends string>(str: T): CamelCase<T>
export const toPascalCase = <T extends string>(str: T): PascalCase<T>
export const toKebabCase = <T extends string>(str: T): KebabCase<T>
export const toSnakeCase = <T extends string>(str: T): SnakeCase<T>
```

### Enhanced Template Module

```typescript
// More template engines
export const mustache = (template: string, data: Record<string, any>): string
export const handlebars = (template: string, data: Record<string, any>): string

// Template validation
export const validateTemplate = (template: string): boolean
export const extractVariables = (template: string): string[]
```

## Performance Optimizations

1. **Native string methods** where possible
2. **Compiled regex patterns** for repeated operations
3. **String interning** for frequently used strings
4. **Streaming processing** for large texts
5. **WebAssembly** for complex algorithms like text similarity

## Usage Examples

```typescript
import { Str } from '@wollybeard/kit'

// Validation
Str.isEmail('user@example.com') // true
Str.isUrl('https://example.com') // true
Str.isUuid('550e8400-e29b-41d4-a716-446655440000') // true

// Formatting
Str.padStart('42', 5, '0') // '00042'
Str.truncate('Long text here', { length: 10, ellipsis: '...' }) // 'Long te...'
Str.mask('1234567890', 2, 8, '*') // '12******90'

// Similarity
Str.levenshtein('kitten', 'sitting') // 3
Str.similarity('hello', 'hallo') // 0.8

// Generation
Str.randomAlphanumeric(8) // 'A7B9C2D1'
Str.fromPattern('###-AAA-000') // '123-ABC-456'

// Text analysis
Str.wordCount('Hello world, how are you?') // 5
Str.textStats('Sample text...') // { characters: ..., words: ..., ... }

// Curried usage
const maskCreditCard = Str.maskWith(4, 12, '*')
const truncateTo50 = Str.truncateWith({ length: 50 })
const normalizeEmail = pipe(
  Str.toLowerCase,
  Str.trim,
  Str.validateWith(Str.isEmail),
)
```

This comprehensive enhancement maintains the module's excellent structure while adding extensive functionality to compete with any string utility library.
