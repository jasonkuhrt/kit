import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import '../$.test-matchers.js'
import { describe, expect, expectTypeOf, it } from 'vitest'

const l = FsLoc.fromString

Test
  .describe('join paths')
  .on(FsLoc.join)
  .inputType<[FsLoc.FsLoc, FsLoc.FsLoc]>()
  .cases(
    // Joining directories with files
    [[l('/home/'), l('file.txt')]],
    [[l('src/'), l('index.ts')]],
    [[l('/'), l('file.txt')]],
    // Joining directories with directories
    [[l('/home/'), l('documents/')]],
    [[l('src/'), l('components/')]],
    [[FsLoc.Constants.absDirRoot, l('home/')]],
    // Parent references (resolved during join)
    [[l('../'), l('lib/utils.js')]],
    [[l('src/'), l('../test/file.ts')]],
  )
  .test()

describe('String literal support', () => {
  it('accepts string literals', () => {
    // Absolute directory + relative file
    const file1 = FsLoc.join('/home/user/', 'config.json')
    expectTypeOf(file1).toEqualTypeOf<FsLoc.AbsFile>()
    expect(file1).toBeFile()
    expect(file1).toEncodeTo('/home/user/config.json')

    // With ./ prefix should also work
    const file1b = FsLoc.join('/home/user/', './config.json')
    expectTypeOf(file1b).toEqualTypeOf<FsLoc.AbsFile>()
    expect(file1b).toBeFile()
    expect(file1b).toEncodeTo('/home/user/config.json')

    // Absolute directory + relative directory
    const dir1 = FsLoc.join('/home/user/', 'src/')
    expectTypeOf(dir1).toEqualTypeOf<FsLoc.AbsDir>()
    expect(dir1).toBeDir()
    expect(dir1).toEncodeTo('/home/user/src/')

    // Relative directory + relative file
    const file2 = FsLoc.join('./src/', 'index.ts')
    expectTypeOf(file2).toEqualTypeOf<FsLoc.RelFile>()
    expect(file2).toBeFile()
    expect(file2).toEncodeTo('./src/index.ts')

    // Relative directory + relative directory
    const dir2 = FsLoc.join('./base/', 'nested/')
    expectTypeOf(dir2).toEqualTypeOf<FsLoc.RelDir>()
    expect(dir2).toBeDir()
    expect(dir2).toEncodeTo('./base/nested/')
  })
})
