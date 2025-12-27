import { Option, Schema } from 'effect'
import { describe, expect, test } from 'vitest'
import { ConventionalCommit } from './commit.js'
import { MultiTargetCommit } from './multi-target-commit.js'
import { SingleTargetCommit } from './single-target-commit.js'
import { Target } from './target.js'

describe('ConventionalCommit', () => {
  test('union accepts SingleTargetCommit', () => {
    const single = SingleTargetCommit.make({
      type: 'feat',
      scopes: ['core'],
      breaking: false,
      message: 'add feature',
      body: Option.none(),
      footers: [],
    })
    expect(Schema.is(ConventionalCommit)(single)).toBe(true)
  })

  test('union accepts MultiTargetCommit', () => {
    const multi = MultiTargetCommit.make({
      targets: [Target.make({ type: 'feat', scope: 'core', breaking: true })],
      message: 'breaking change',
      summary: Option.none(),
      sections: {},
    })
    expect(Schema.is(ConventionalCommit)(multi)).toBe(true)
  })

  test('SingleTargetCommit.is type guard works', () => {
    const single = SingleTargetCommit.make({
      type: 'feat',
      scopes: [],
      breaking: false,
      message: 'msg',
      body: Option.none(),
      footers: [],
    })
    expect(SingleTargetCommit.is(single)).toBe(true)
    expect(MultiTargetCommit.is(single)).toBe(false)
  })

  test('MultiTargetCommit.is type guard works', () => {
    const multi = MultiTargetCommit.make({
      targets: [Target.make({ type: 'fix', scope: 'cli', breaking: false })],
      message: 'msg',
      summary: Option.none(),
      sections: {},
    })
    expect(MultiTargetCommit.is(multi)).toBe(true)
    expect(SingleTargetCommit.is(multi)).toBe(false)
  })
})
