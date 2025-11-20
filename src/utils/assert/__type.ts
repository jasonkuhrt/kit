export type { StaticErrorAssertion } from './assertion-error.ts'
export * from './builder-generated/__.ts'
export * from './cases.ts'

import { builder } from './builder-singleton.ts'

// Unary Relators (top-level)
export const any = builder.any
export const unknown = builder.unknown
export const never = builder.never
export const empty = builder.empty

// Input Methods
export const on = builder.on
export const onAs = builder.onAs

// Settings/Modifiers
export const inferNarrow = builder.inferNarrow
export const inferWide = builder.inferWide
export const inferAuto = builder.inferAuto
export const setInfer = builder.setInfer
export const extract = builder.extract

// Note: Binary relators (exact, sub, equiv, not), extractors (awaited, returned, etc.)
// and their matchers are all exported via builder-generated/$$.js
