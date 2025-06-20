import { beforeEach, describe, expect, test } from 'vitest'
import { Builder } from './builder.ts'

let builder: Builder

beforeEach(() => {
  builder = Builder()
})

describe(`template literal usage`, () => {
  test(`empty adds newline to code`, () => {
    builder`a````b`
    expect(builder.toString()).toBe(`a\n\nb`)
  })
})

describe(`function usage`, () => {
  test(`empty adds newline to code`, () => {
    builder(`a`)(``)(`b`)
    expect(builder.toString()).toBe(`a\n\nb`)
    const builder2 = Builder()(`a`)()(`b`)
    expect(builder2.toString()).toEqual(builder.toString())
  })
})
