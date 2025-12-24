import { Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { Footer } from './footer.js'
import { MultiTargetCommit } from './multi-target-commit.js'
import { TargetSection } from './target-section.js'
import { Target } from './target.js'

describe('MultiTargetCommit', () => {
  test('make creates valid multi-target commit', () => {
    const commit = MultiTargetCommit.make({
      targets: [
        Target.make({ type: 'feat', scope: 'core', breaking: true }),
        Target.make({ type: 'fix', scope: 'cli', breaking: false }),
      ],
      message: 'breaking core change with cli fix',
      summary: Option.none(),
      sections: {},
    })
    expect(commit._tag).toBe('MultiTarget')
    expect(commit.targets).toHaveLength(2)
    expect(commit.targets[0].type).toBe('feat')
    expect(commit.targets[0].breaking).toBe(true)
    expect(commit.targets[1].type).toBe('fix')
    expect(commit.targets[1].breaking).toBe(false)
  })

  test('make creates commit with summary and sections', () => {
    const commit = MultiTargetCommit.make({
      targets: [
        Target.make({ type: 'feat', scope: 'core', breaking: true }),
        Target.make({ type: 'fix', scope: 'arr', breaking: false }),
      ],
      message: 'major refactor',
      summary: Option.some('This affects multiple packages.'),
      sections: {
        core: TargetSection.make({
          body: 'Core changes here.',
          footers: [Footer.make({ token: 'BREAKING CHANGE', value: 'removed X' })],
        }),
        arr: TargetSection.make({
          body: 'Arr changes here.',
          footers: [],
        }),
      },
    })
    expect(Option.isSome(commit.summary)).toBe(true)
    expect(commit.sections['core'].body).toBe('Core changes here.')
    expect(commit.sections['arr'].footers).toHaveLength(0)
  })
})
