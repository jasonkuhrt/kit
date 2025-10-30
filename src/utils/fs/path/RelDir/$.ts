export * as RelDir from './$$.js'

export type RelDir = typeof import('./$$.js').Schema.Type
