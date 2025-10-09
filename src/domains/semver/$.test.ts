import { S } from '#deps/effect'
import { Test } from '#test'
import { Semver } from './$.js'

const decodeSync = S.decodeSync(Semver.Semver)

Test
  .describe('decodeSync')
  .on(decodeSync)
  .casesInput(
    ['1.2.3'],
    ['1.2.3-beta.1+build.123'],
    ['invalid'],
  )
  .describeInputs('discriminated union', [
    ['1.2.3'],
    ['1.2.3+build.123'],
    ['1.2.3-beta'],
    ['1.2.3-beta+build.123'],
  ])
  .test()

Test
  .on(Semver.order)
  .cases(
    [[decodeSync('1.0.0'), decodeSync('2.0.0')], -1],
    [[decodeSync('2.0.0'), decodeSync('1.0.0')], 1],
    [[decodeSync('1.0.0'), decodeSync('1.0.0')], 0],
  )
  .test()

Test
  .on(Semver.equivalence)
  .cases(
    [[decodeSync('1.0.0'), decodeSync('1.0.0')], true],
    [[decodeSync('1.0.0'), decodeSync('2.0.0')], false],
  )
  .test()

Test
  .on(Semver.is)
  .cases(
    [[decodeSync('1.2.3')], true],
    [[{ major: 1, minor: 2, patch: 3 }], false],
    [['1.2.3'], false],
  )
  .test()

Test
  .on(Semver.increment)
  .casesInput(
    [decodeSync('1.2.3'), 'major'],
    [decodeSync('1.2.3'), 'minor'],
    [decodeSync('1.2.3'), 'patch'],
  )
  .test()

Test
  .on(Semver.min)
  .casesInput(
    [decodeSync('1.0.0'), decodeSync('2.0.0')],
    [decodeSync('2.0.0'), decodeSync('1.0.0')],
  )
  .test()

Test
  .on(Semver.max)
  .casesInput(
    [decodeSync('1.0.0'), decodeSync('2.0.0')],
    [decodeSync('2.0.0'), decodeSync('1.0.0')],
  )
  .test()

Test
  .on(Semver.make)
  .casesInput(
    [1, 2, 3],
    [1, 2, 3, 'beta.1'],
    [1, 2, 3, 'beta.1', 'build.123'],
    [1, 2, 3, undefined, 'build.123'],
  )
  .test()

Test
  .on(Semver.satisfies)
  .onSetup(() => ({
    v: decodeSync('1.2.3'),
  }))
  .casesInput(
    // todo: this should work:
    // ({ v }) => [v, '>=1.0.0'],
    [decodeSync('1.2.3'), '>=1.0.0'],
    [decodeSync('1.2.3'), '^1.0.0'],
    [decodeSync('1.2.3'), '~1.2.0'],
    [decodeSync('1.2.3'), '2.x'],
    [decodeSync('1.2.3'), 'invalid'],
  )
  .test()
