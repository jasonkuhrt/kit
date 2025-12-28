import { Option, Schema } from 'effect'
import { Test } from '@kitz/test'
import { Commit } from './commit.js'
import { CommitMulti } from './commit-multi.js'
import { CommitSingle } from './commit-single.js'
import { Target } from './target.js'
import { Standard } from './type.js'

// ─── Test Fixtures ─────────────────────────────────────────────

const singleTarget = CommitSingle.make({
  type: Standard.make({ value: 'feat' }),
  scopes: ['core'],
  breaking: false,
  message: 'add feature',
  body: Option.none(),
  footers: [],
})

const multiTarget = CommitMulti.make({
  targets: [Target.make({ type: Standard.make({ value: 'feat' }), scope: 'core', breaking: true })],
  message: 'breaking change',
  summary: Option.none(),
  sections: {},
})

// ─── Schema Validation ─────────────────────────────────────────

const isCommit = Schema.is(Commit)

Test.describe('Commit > union accepts')
  .on(isCommit)
  .cases(
    [[singleTarget], true],
    [[multiTarget], true],
  )
  .test()

// ─── Type Guards ───────────────────────────────────────────────

Test.describe('CommitSingle.is')
  .on(CommitSingle.is)
  .cases(
    [[singleTarget], true],
    [[multiTarget], false],
  )
  .test()

Test.describe('CommitMulti.is')
  .on(CommitMulti.is)
  .cases(
    [[singleTarget], false],
    [[multiTarget], true],
  )
  .test()
