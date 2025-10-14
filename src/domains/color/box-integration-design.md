# Color Integration with Box - Design Proposal

## Overview

Integrate the Color module with Box to support styled terminal output. Colors should be:

- **Declarative** (data, not functions) for serializability
- **Co-located** with the characters they style
- **Hook-compatible** for dynamic styling

## Color Targets

Three ANSI color targets (SGR codes):

- `foreground` - Text color
- `background` - Background color
- `underlineColor` - Underline color (when underline modifier is active)

## Style Modifiers

Boolean flags for ANSI text styles:

- `bold` - Bold/bright text
- `dim` - Dimmed text
- `italic` - Italic text
- `underline` - Underlined text
- `strikethrough` - Strikethrough text
- `blink` - Blinking text (rarely supported)
- `inverse` - Swap foreground/background
- `hidden` - Hidden text

## Proposed API

### Border Styling

Borders can be styled with colors and modifiers:

```typescript
import { Str } from '@wollybeard/kit'

// Simple border with color
Str.Box.make({ content: 'Hello' })
  .border$({
    style: 'single',
    edges: {
      top: { char: '─', color: { foreground: 'red' } },
      left: { char: '│', color: { foreground: 'blue' } },
    },
    corners: {
      topLeft: { char: '┌', color: { foreground: 'yellow' }, bold: true },
    },
  })

// Backwards compatible - string shorthand still works
Str.Box.make({ content: 'Hello' })
  .border$({
    edges: '─', // Still valid
    corners: '+', // Still valid
  })

// With hooks for dynamic colors
Str.Box.make({ content: 'Hello' })
  .border$({
    edges: {
      left: {
        char: '│',
        color: (ctx) =>
          ctx.lineIndex === 0 ? { foreground: 'red' } : { foreground: 'blue' },
      },
    },
  })
```

### Content Styling

Content can have colors and modifiers applied:

```typescript
// Simple content with color
Str.Box.make({
  content: {
    text: 'Hello World',
    color: { foreground: 'green', background: 'black' },
    bold: true,
  },
})

// Backwards compatible - string content still works
Str.Box.make({ content: 'Hello' }) // Still valid

// Array of styled content
Str.Box.make({
  content: [
    { text: 'Error:', color: { foreground: 'red' }, bold: true },
    { text: ' Something went wrong', color: { foreground: 'white' } },
  ],
})
```

## Type Definitions

### CharStyle

Represents a character with optional styling:

```typescript
export interface CharStyle {
  /**
   * The character to render
   */
  char: string

  /**
   * Color configuration
   */
  color?: {
    foreground?: ColorInput
    background?: ColorInput
    underlineColor?: ColorInput
  }

  /**
   * Style modifiers
   */
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  blink?: boolean
  inverse?: boolean
  hidden?: boolean
}

/**
 * Border edge value - string (char only) or object with styling
 */
export type BorderEdgeValue = string | CharStyle

/**
 * Border corner value - string (char only) or object with styling
 */
export type BorderCornerValue = string | CharStyle
```

### StyledText

Represents text content with styling:

```typescript
export interface StyledText {
  /**
   * The text content
   */
  text: string

  /**
   * Color configuration
   */
  color?: {
    foreground?: ColorInput
    background?: ColorInput
    underlineColor?: ColorInput
  }

  /**
   * Style modifiers
   */
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  blink?: boolean
  inverse?: boolean
  hidden?: boolean
}

/**
 * Box content - string or styled text
 */
export type BoxContent =
  | string
  | StyledText
  | readonly (string | StyledText | Box)[]
```

## Implementation Notes

1. **ANSI Code Generation**: Use the `ansis` library (already a dependency) to generate ANSI escape codes
2. **Rendering**: Apply ANSI codes during the rendering phase, after layout is calculated
3. **Hooks**: Color values can be dynamic via hooks, evaluated during rendering
4. **Backwards Compatibility**: String values for borders/content continue to work (no colors/styles applied)
5. **Color Parsing**: Use `Color.fromString()` or accept `ColorRgb` objects directly

## Example Usage

```typescript
import { Str } from '@wollybeard/kit'

// Styled error box
const errorBox = Str.Box.make({
  content: {
    text: 'Error: File not found',
    color: { foreground: 'red' },
    bold: true,
  },
})
  .pad$([1, 2])
  .border$({
    style: 'single',
    edges: {
      top: { char: '─', color: { foreground: 'red' } },
      right: { char: '│', color: { foreground: 'red' } },
      bottom: { char: '─', color: { foreground: 'red' } },
      left: { char: '│', color: { foreground: 'red' } },
    },
    corners: { char: '╳', color: { foreground: 'red' }, bold: true },
  })

console.log(errorBox.toString())

// Success box with gradient border (using hooks)
const successBox = Str.Box.make({
  content: {
    text: '✓ Build successful',
    color: { foreground: 'green' },
    bold: true,
  },
})
  .border$({
    edges: {
      left: {
        char: '│',
        color: (ctx) => {
          const ratio = ctx.lineIndex / ctx.totalLines
          return ratio < 0.5 ? { foreground: 'green' } : { foreground: 'blue' }
        },
      },
    },
  })
```

## Questions for Review

1. Should we support all ANSI modifiers, or just a subset?
2. Should content styling be at the Box level, or should it support spans within text?
3. Do we need a `style` helper that combines char + color + modifiers?
4. Should there be preset color themes (error, warning, success, info)?
