import { Fs } from '#fs'
import { Test } from '#test'
import type { Path } from '../_.js'
import '../$.test-matchers.js'
import { describe, expect } from 'vitest'

const l = Fs.Path.fromString

describe('up', () => {
  // dprint-ignore
  Test.describe('move up one level')
    .inputType<Path>()
    .outputType<string>()
    .cases(
      [l('/home/user/file.txt'),      '/home/file.txt'],
      [l('/home/user/'),              '/home/'],
      [l('src/index.ts'),             './index.ts'],
      [l('src/components/'),          './src/'],
      [Fs.Path.absDirRoot(),          '/'],
      [l('/file.txt'),                '/file.txt'],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.up(input)
      expect(result).toEncodeTo(output)
    })

  // dprint-ignore
  Test.describe('up - string literal support')
    .inputType<string>()
    .outputType<string>()
    .cases(
      ['/home/user/file.txt',     '/home/file.txt'],
      ['/home/user/',             '/home/'],
      ['src/index.ts',            './index.ts'],
      ['/',                       '/'],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.up(input)
      expect(result).toEncodeTo(output)
    })
})
