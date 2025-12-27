import { Test } from '@kitz/test'
import { Effect, Exit, Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { isMultiTarget } from '../commit.js'
import { SingleTargetCommit } from '../single-target-commit.js'
import { parseTitle } from './title.js'

// Helper that runs Effect and returns the parsed commit (or null on failure)
const parseTitleSync = (title: string): SingleTargetCommit | null => {
  const exit = Effect.runSyncExit(parseTitle(title))
  if (Exit.isFailure(exit)) return null
  const value = exit.value
  if (value._tag === 'SingleTarget') return value
  return null
}

Test.describe('parseTitle > SingleTarget')
  .on(parseTitleSync)
  .cases(
    // Type only
    [
      ['feat: add feature'],
      SingleTargetCommit.make({
        type: 'feat',
        message: 'add feature',
        scopes: [],
        breaking: false,
        body: Option.none(),
        footers: [],
      }),
    ],
    // Type with scope
    [
      ['feat(core): add feature'],
      SingleTargetCommit.make({
        type: 'feat',
        message: 'add feature',
        scopes: ['core'],
        breaking: false,
        body: Option.none(),
        footers: [],
      }),
    ],
    // Multiple scopes
    [
      ['feat(core, cli): add feature'],
      SingleTargetCommit.make({
        type: 'feat',
        message: 'add feature',
        scopes: ['core', 'cli'],
        breaking: false,
        body: Option.none(),
        footers: [],
      }),
    ],
    // Breaking with !
    [
      ['feat(core)!: breaking change'],
      SingleTargetCommit.make({
        type: 'feat',
        message: 'breaking change',
        scopes: ['core'],
        breaking: true,
        body: Option.none(),
        footers: [],
      }),
    ],
    // Breaking inside scope
    [
      ['feat(core!): breaking change'],
      SingleTargetCommit.make({
        type: 'feat',
        message: 'breaking change',
        scopes: ['core'],
        breaking: true,
        body: Option.none(),
        footers: [],
      }),
    ],
  )
  .test()

describe('parseTitle > MultiTarget', () => {
  test('parses different types: "feat(core), fix(cli): message"', async () => {
    const result = await Effect.runPromiseExit(parseTitle('feat(core), fix(cli): multi change'))
    expect(Exit.isSuccess(result)).toBe(true)
    if (Exit.isSuccess(result)) {
      expect(result.value._tag).toBe('MultiTarget')
      if (isMultiTarget(result.value)) {
        expect(result.value.targets).toHaveLength(2)
        expect(result.value.targets[0].type).toBe('feat')
        expect(result.value.targets[0].scope).toBe('core')
        expect(result.value.targets[1].type).toBe('fix')
        expect(result.value.targets[1].scope).toBe('cli')
      }
    }
  })

  test('parses per-scope breaking: "feat(core!), fix(cli): message"', async () => {
    const result = await Effect.runPromiseExit(parseTitle('feat(core!), fix(cli): change'))
    expect(Exit.isSuccess(result)).toBe(true)
    if (Exit.isSuccess(result) && isMultiTarget(result.value)) {
      expect(result.value.targets[0].breaking).toBe(true)
      expect(result.value.targets[1].breaking).toBe(false)
    }
  })

  test('parses global breaking: "feat(core), fix(cli)!: message"', async () => {
    const result = await Effect.runPromiseExit(parseTitle('feat(core), fix(cli)!: change'))
    expect(Exit.isSuccess(result)).toBe(true)
    if (Exit.isSuccess(result) && isMultiTarget(result.value)) {
      expect(result.value.targets[0].breaking).toBe(true)
      expect(result.value.targets[1].breaking).toBe(true)
    }
  })
})

Test.describe('parseTitle > errors')
  .on(parseTitleSync)
  .cases(
    // Invalid format
    [['not a valid commit'], null],
    // Empty message
    [['feat:'], null],
  )
  .test()
