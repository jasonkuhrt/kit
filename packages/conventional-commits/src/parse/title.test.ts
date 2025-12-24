import { Effect, Exit } from 'effect'
import { describe, expect, test } from 'vitest'
import { parseTitle } from './title.js'

describe('parseTitle', () => {
  describe('SingleTarget parsing', () => {
    test('parses type only: "feat: message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat: add feature'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result)) {
        expect(result.value._tag).toBe('SingleTarget')
        expect(result.value.type).toBe('feat')
        expect(result.value.message).toBe('add feature')
        if (result.value._tag === 'SingleTarget') {
          expect(result.value.scopes).toEqual([])
          expect(result.value.breaking).toBe(false)
        }
      }
    })

    test('parses type with scope: "feat(core): message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core): add feature'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result) && result.value._tag === 'SingleTarget') {
        expect(result.value.scopes).toEqual(['core'])
      }
    })

    test('parses multiple scopes: "feat(core, cli): message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core, cli): add feature'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result) && result.value._tag === 'SingleTarget') {
        expect(result.value.scopes).toEqual(['core', 'cli'])
      }
    })

    test('parses breaking with !: "feat(core)!: message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core)!: breaking change'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result) && result.value._tag === 'SingleTarget') {
        expect(result.value.breaking).toBe(true)
      }
    })

    test('parses breaking inside scope: "feat(core!): message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core!): breaking change'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result) && result.value._tag === 'SingleTarget') {
        expect(result.value.breaking).toBe(true)
      }
    })
  })

  describe('MultiTarget parsing', () => {
    test('parses different types: "feat(core), fix(cli): message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core), fix(cli): multi change'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result)) {
        expect(result.value._tag).toBe('MultiTarget')
        if (result.value._tag === 'MultiTarget') {
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
      if (Exit.isSuccess(result) && result.value._tag === 'MultiTarget') {
        expect(result.value.targets[0].breaking).toBe(true)
        expect(result.value.targets[1].breaking).toBe(false)
      }
    })

    test('parses global breaking: "feat(core), fix(cli)!: message"', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat(core), fix(cli)!: change'))
      expect(Exit.isSuccess(result)).toBe(true)
      if (Exit.isSuccess(result) && result.value._tag === 'MultiTarget') {
        expect(result.value.targets[0].breaking).toBe(true)
        expect(result.value.targets[1].breaking).toBe(true)
      }
    })
  })

  describe('error cases', () => {
    test('rejects invalid format', async () => {
      const result = await Effect.runPromiseExit(parseTitle('not a valid commit'))
      expect(Exit.isFailure(result)).toBe(true)
    })

    test('rejects empty message', async () => {
      const result = await Effect.runPromiseExit(parseTitle('feat:'))
      expect(Exit.isFailure(result)).toBe(true)
    })
  })
})
