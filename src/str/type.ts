export const is = (value: unknown): value is string => typeof value === `string`

export const isEmpty = (value: string): value is '' => value.length === 0

export type Empty = ''

export const Empty: Empty = ''
