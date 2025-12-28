import { Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { CommitSingle } from './commit-single.js'
import { from as footerFrom } from './footer.js'
import { Standard } from './type.js'

describe('CommitSingle', () => {
  test('make creates valid commit with scope', () => {
    const commit = CommitSingle.make({
      type: Standard.make({ value: 'feat' }),
      scopes: ['core'],
      breaking: false,
      message: 'add new feature',
      body: Option.none(),
      footers: [],
    })
    expect(commit._tag).toBe('CommitSingle')
    expect(commit.type._tag).toBe('Standard')
    expect(commit.type.value).toBe('feat')
    expect(commit.scopes).toEqual(['core'])
    expect(commit.breaking).toBe(false)
    expect(commit.message).toBe('add new feature')
  })

  test('make creates commit with multiple scopes (uniform treatment)', () => {
    const commit = CommitSingle.make({
      type: Standard.make({ value: 'feat' }),
      scopes: ['core', 'cli'],
      breaking: true,
      message: 'breaking change across packages',
      body: Option.some('Detailed body'),
      footers: [footerFrom('BREAKING CHANGE', 'removed API')],
    })
    expect(commit.scopes).toEqual(['core', 'cli'])
    expect(commit.breaking).toBe(true)
    expect(Option.isSome(commit.body)).toBe(true)
  })

  test('make creates commit without scope', () => {
    const commit = CommitSingle.make({
      type: Standard.make({ value: 'chore' }),
      scopes: [],
      breaking: false,
      message: 'update deps',
      body: Option.none(),
      footers: [],
    })
    expect(commit.scopes).toEqual([])
  })
})
