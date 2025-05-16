import { Char } from './char/index.js'
import { repeatOn } from './replace.js'

export const table = (input: {
  data: Record<string, string>
  separator?: string | undefined | false
  separatorAlignment?: boolean
}) => {
  const separator = input.separator ?? ` ${Char.rightwardsArrow} `
  const separatorAlignment = input.separatorAlignment ?? true

  const entries = Object.entries(input.data)
  const keyMaxLength = Math.max(...entries.map(([key]) => key.length))
  return entries.map(([key, value]) => {
    const paddingSize = keyMaxLength - key.length

    const gap = separatorAlignment
      ? `${padding(paddingSize)}${separator}`
      : `${separator}${padding(paddingSize)}`

    return `${key}${gap}${value}`
  }).join(`\n`)
}

const padding = repeatOn(Char.spaceNoBreak)

// const isOdd = (value: number) => value % 2 !== 0

// const makeEvenUpward = (value: number) => value + (isOdd(value) ? 1 : 0)
