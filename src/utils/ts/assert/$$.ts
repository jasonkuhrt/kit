export type { StaticErrorAssertion } from './assertion-error.ts'
export * from './builder-generated/$$.js'
export { on, onAs } from './builder/builder.js'
export * from './cases.js'

// Inference config entry points
import { runtime } from './builder/runtime.js'
export const inferNarrow = runtime.inferNarrow
export const inferWide = runtime.inferWide
export const inferAuto = runtime.inferAuto
export const setInfer = runtime.setInfer
