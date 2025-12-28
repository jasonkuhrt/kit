import { Assert } from '@kitz/assert'
import { Test } from '@kitz/test'
import { Effect, Exit, Option, Schema } from 'effect'
import { expect, test } from 'vitest'
import { ConventionalCommits } from './_.js'

// ─── Fixtures ─────────────────────────────────────────────────────

const fixtures = {
  type: {
    standard: {
      feat: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
      fix: ConventionalCommits.Type.Standard.make({ value: 'fix' }),
      chore: ConventionalCommits.Type.Standard.make({ value: 'chore' }),
    },
    custom: {
      wip: ConventionalCommits.Type.Custom.make({ value: 'wip' }),
    },
  },
  footer: {
    standard: {
      breaking: ConventionalCommits.from('BREAKING CHANGE', 'removed X'),
      breakingHyphen: ConventionalCommits.from('BREAKING-CHANGE', 'removed Y'),
    },
    custom: {
      fixes: ConventionalCommits.from('Fixes', '#123'),
      reviewedBy: ConventionalCommits.from('Reviewed-by', 'alice'),
    },
  },
  target: {
    featCore: ConventionalCommits.Target.make({
      type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
      scope: 'core',
      breaking: false,
    }),
    fixCliBreaking: ConventionalCommits.Target.make({
      type: ConventionalCommits.Type.Standard.make({ value: 'fix' }),
      scope: 'cli',
      breaking: true,
    }),
  },
  commitSingle: {
    simple: ConventionalCommits.CommitSingle.make({
      type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
      scopes: [],
      breaking: false,
      message: 'add feature',
      body: Option.none(),
      footers: [],
    }),
    withScope: ConventionalCommits.CommitSingle.make({
      type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
      scopes: ['core'],
      breaking: false,
      message: 'add feature',
      body: Option.none(),
      footers: [],
    }),
    multiScope: ConventionalCommits.CommitSingle.make({
      type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
      scopes: ['core', 'cli'],
      breaking: true,
      message: 'breaking change',
      body: Option.some('Detailed body'),
      footers: [ConventionalCommits.from('BREAKING CHANGE', 'removed API')],
    }),
  },
  commitMulti: {
    simple: ConventionalCommits.CommitMulti.make({
      targets: [
        ConventionalCommits.Target.make({
          type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
          scope: 'core',
          breaking: true,
        }),
        ConventionalCommits.Target.make({
          type: ConventionalCommits.Type.Standard.make({ value: 'fix' }),
          scope: 'cli',
          breaking: false,
        }),
      ],
      message: 'multi change',
      summary: Option.none(),
      sections: {},
    }),
  },
}

// ─── Type Serialization Snapshots ────────────────────────────────

test('Type > Standard > serialization', () => {
  expect(Schema.encodeSync(ConventionalCommits.Type.Standard)(fixtures.type.standard.feat))
    .toMatchInlineSnapshot(`
      {
        "_tag": "Standard",
        "value": "feat",
      }
    `)
  expect(Schema.encodeSync(ConventionalCommits.Type.Standard)(fixtures.type.standard.chore))
    .toMatchInlineSnapshot(`
      {
        "_tag": "Standard",
        "value": "chore",
      }
    `)
})

test('Type > Custom > serialization', () => {
  expect(Schema.encodeSync(ConventionalCommits.Type.Custom)(fixtures.type.custom.wip))
    .toMatchInlineSnapshot(`
      {
        "_tag": "Custom",
        "value": "wip",
      }
    `)
})

// ─── Type.from() ─────────────────────────────────────────────────

Test.describe('Type.from')
  .on(ConventionalCommits.Type.from)
  .cases(
    [['feat'], fixtures.type.standard.feat],
    [['fix'], fixtures.type.standard.fix],
    [['chore'], fixtures.type.standard.chore],
    [['wip'], fixtures.type.custom.wip],
  )
  .test()

// ─── Type.value() ────────────────────────────────────────────────

Test.describe('Type.value')
  .on(ConventionalCommits.Type.value)
  .cases(
    [[fixtures.type.standard.feat], 'feat'],
    [[fixtures.type.custom.wip], 'wip'],
  )
  .test()

// ─── Type.impact() ───────────────────────────────────────────────

Test.describe('Type.impact')
  .on(ConventionalCommits.Type.impact)
  .cases(
    [[fixtures.type.standard.feat], Option.some('minor')],
    [[fixtures.type.standard.fix], Option.some('patch')],
    [[fixtures.type.standard.chore], Option.none()],
  )
  .test(({ output, result }) => {
    expect(Option.getOrNull(result)).toEqual(Option.getOrNull(output))
  })

// ─── Type-level tests for Type.from() ────────────────────────────

Assert.exact.ofAs<ConventionalCommits.Type.Standard>().on(ConventionalCommits.Type.from('feat'))
Assert.exact.ofAs<ConventionalCommits.Type.Custom>().on(ConventionalCommits.Type.from('wip'))
const dynamicType: string = 'unknown'
Assert.exact.ofAs<ConventionalCommits.Type.Type>().on(ConventionalCommits.Type.from(dynamicType))

// ─── Footer Serialization Snapshots ──────────────────────────────

test('Footer > serialization', () => {
  expect(Schema.encodeSync(ConventionalCommits.Footer)(fixtures.footer.standard.breaking))
    .toMatchInlineSnapshot(`
      {
        "_tag": "Standard",
        "token": "BREAKING CHANGE",
        "value": "removed X",
      }
    `)
  expect(Schema.encodeSync(ConventionalCommits.Footer)(fixtures.footer.custom.fixes))
    .toMatchInlineSnapshot(`
      {
        "_tag": "Custom",
        "token": "Fixes",
        "value": "#123",
      }
    `)
})

// ─── Footer.isBreakingChange() ───────────────────────────────────

Test.describe('Footer.isBreakingChange')
  .on(ConventionalCommits.isBreakingChange)
  .cases(
    [[fixtures.footer.standard.breaking], true],
    [[fixtures.footer.standard.breakingHyphen], true],
    [[fixtures.footer.custom.fixes], false],
  )
  .test()

// ─── CommitSingle Serialization Snapshots ────────────────────────

test('CommitSingle > serialization', () => {
  expect(Schema.encodeSync(ConventionalCommits.CommitSingle)(fixtures.commitSingle.simple))
    .toMatchInlineSnapshot(`
      {
        "_tag": "CommitSingle",
        "body": null,
        "breaking": false,
        "footers": [],
        "message": "add feature",
        "scopes": [],
        "type": {
          "_tag": "Standard",
          "value": "feat",
        },
      }
    `)
  expect(Schema.encodeSync(ConventionalCommits.CommitSingle)(fixtures.commitSingle.withScope))
    .toMatchInlineSnapshot(`
      {
        "_tag": "CommitSingle",
        "body": null,
        "breaking": false,
        "footers": [],
        "message": "add feature",
        "scopes": [
          "core",
        ],
        "type": {
          "_tag": "Standard",
          "value": "feat",
        },
      }
    `)
  expect(Schema.encodeSync(ConventionalCommits.CommitSingle)(fixtures.commitSingle.multiScope))
    .toMatchInlineSnapshot(`
      {
        "_tag": "CommitSingle",
        "body": "Detailed body",
        "breaking": true,
        "footers": [
          {
            "_tag": "Standard",
            "token": "BREAKING CHANGE",
            "value": "removed API",
          },
        ],
        "message": "breaking change",
        "scopes": [
          "core",
          "cli",
        ],
        "type": {
          "_tag": "Standard",
          "value": "feat",
        },
      }
    `)
})

// ─── CommitMulti Serialization Snapshots ─────────────────────────

test('CommitMulti > serialization', () => {
  expect(Schema.encodeSync(ConventionalCommits.CommitMulti)(fixtures.commitMulti.simple))
    .toMatchInlineSnapshot(`
      {
        "_tag": "CommitMulti",
        "message": "multi change",
        "sections": {},
        "summary": null,
        "targets": [
          {
            "_tag": "Target",
            "breaking": true,
            "scope": "core",
            "type": {
              "_tag": "Standard",
              "value": "feat",
            },
          },
          {
            "_tag": "Target",
            "breaking": false,
            "scope": "cli",
            "type": {
              "_tag": "Standard",
              "value": "fix",
            },
          },
        ],
      }
    `)
})

// ─── Commit Union ────────────────────────────────────────────────

const isCommit = Schema.is(ConventionalCommits.Commit)

Test.describe('Commit > union accepts')
  .on(isCommit)
  .cases(
    [[fixtures.commitSingle.simple], true],
    [[fixtures.commitMulti.simple], true],
  )
  .test()

Test.describe('CommitSingle.is')
  .on(ConventionalCommits.CommitSingle.is)
  .cases(
    [[fixtures.commitSingle.simple], true],
    [[fixtures.commitMulti.simple], false],
  )
  .test()

Test.describe('CommitMulti.is')
  .on(ConventionalCommits.CommitMulti.is)
  .cases(
    [[fixtures.commitSingle.simple], false],
    [[fixtures.commitMulti.simple], true],
  )
  .test()

// ─── parseTitle ──────────────────────────────────────────────────

const parseTitleSync = (title: string): ConventionalCommits.CommitSingle | null => {
  const exit = Effect.runSyncExit(ConventionalCommits.parseTitle(title))
  if (Exit.isFailure(exit)) return null
  const value = exit.value
  if (ConventionalCommits.CommitSingle.is(value)) return value
  return null
}

Test.describe('parseTitle > CommitSingle')
  .on(parseTitleSync)
  .cases(
    [['feat: add feature'], fixtures.commitSingle.simple],
    [['feat(core): add feature'], fixtures.commitSingle.withScope],
    [
      ['feat(core, cli): breaking change'],
      ConventionalCommits.CommitSingle.make({
        type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
        scopes: ['core', 'cli'],
        breaking: false,
        message: 'breaking change',
        body: Option.none(),
        footers: [],
      }),
    ],
    [
      ['feat(core)!: breaking change'],
      ConventionalCommits.CommitSingle.make({
        type: ConventionalCommits.Type.Standard.make({ value: 'feat' }),
        scopes: ['core'],
        breaking: true,
        message: 'breaking change',
        body: Option.none(),
        footers: [],
      }),
    ],
  )
  .test()

Test.describe('parseTitle > errors')
  .on(parseTitleSync)
  .cases(
    [['not a valid commit'], null],
    [['feat:'], null],
  )
  .test()

// ─── parseTitle > CommitMulti ────────────────────────────────────

test('parseTitle > CommitMulti', async () => {
  const result = await Effect.runPromiseExit(
    ConventionalCommits.parseTitle('feat(core), fix(cli): multi change'),
  )
  expect(Exit.isSuccess(result)).toBe(true)
  if (Exit.isSuccess(result) && ConventionalCommits.CommitMulti.is(result.value)) {
    expect(Schema.encodeSync(ConventionalCommits.CommitMulti)(result.value)).toMatchInlineSnapshot(`
      {
        "_tag": "CommitMulti",
        "message": "multi change",
        "sections": {},
        "summary": null,
        "targets": [
          {
            "_tag": "Target",
            "breaking": false,
            "scope": "core",
            "type": {
              "_tag": "Standard",
              "value": "feat",
            },
          },
          {
            "_tag": "Target",
            "breaking": false,
            "scope": "cli",
            "type": {
              "_tag": "Standard",
              "value": "fix",
            },
          },
        ],
      }
    `)
  }
})

test('parseTitle > CommitMulti > per-scope breaking', async () => {
  const result = await Effect.runPromiseExit(
    ConventionalCommits.parseTitle('feat(core!), fix(cli): change'),
  )
  expect(Exit.isSuccess(result)).toBe(true)
  if (Exit.isSuccess(result) && ConventionalCommits.CommitMulti.is(result.value)) {
    expect(result.value.targets[0]?.breaking).toBe(true)
    expect(result.value.targets[1]?.breaking).toBe(false)
  }
})

test('parseTitle > CommitMulti > global breaking', async () => {
  const result = await Effect.runPromiseExit(
    ConventionalCommits.parseTitle('feat(core), fix(cli)!: change'),
  )
  expect(Exit.isSuccess(result)).toBe(true)
  if (Exit.isSuccess(result) && ConventionalCommits.CommitMulti.is(result.value)) {
    expect(result.value.targets[0]?.breaking).toBe(true)
    expect(result.value.targets[1]?.breaking).toBe(true)
  }
})

// ─── StandardImpact mapping ──────────────────────────────────────

test('StandardImpact > all standard types have impact mappings', () => {
  for (const key of Object.keys(ConventionalCommits.Type.StandardValue.enums)) {
    expect(ConventionalCommits.Type.StandardImpact[key as ConventionalCommits.Type.StandardValue]).toBeDefined()
  }
})
