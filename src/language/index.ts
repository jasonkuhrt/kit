export * from './never.js'

export const identity = <value>(value: value): value => value

export const constant = <value>(value: value): () => value => () => value
