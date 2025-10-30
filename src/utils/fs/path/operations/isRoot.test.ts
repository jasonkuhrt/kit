import { Fs } from '#fs'
import { Test } from '#test'
import type { Path } from '../$.js'
import '../$.test-matchers.js'
import { describe, expect } from 'vitest'

const l = Fs.Path.fromString

describe('isRoot', () => {
  // dprint-ignore
  Test.describe('check if location is root')
    .inputType<Path>()
    .outputType<boolean>()
    .cases(
      [Fs.Path.absDirRoot(),         true],
      [l('/home/'),                  false],
      // Files with no path segments also return true for isRoot currently
      [l('/file.txt'),               true],
      [l('src/'),                    false],
      // Files with no path segments also return true for isRoot currently
      [l('file.txt'),                true],
      // Empty relative dir also has empty segments
      [Fs.Path.relDirCurrent(),      true],
    )
    .test(({ input, output }) => {
      if (output) {
        expect(input).toBeRoot()
      } else {
        expect(input).not.toBeRoot()
      }
    })

  // dprint-ignore
  Test.describe('isRoot - string literal support')
    .inputType<string>()
    .outputType<boolean>()
    .cases(
      ['/',                     true],
      ['/home/',                false],
      ['/file.txt',             true],
      ['./',                    true],
    )
    .test(({ input, output }) => {
      const result = Fs.Path.isRoot(input)
      expect(result).toBe(output)
    })
})
