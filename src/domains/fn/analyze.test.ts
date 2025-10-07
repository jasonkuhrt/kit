import { Test } from '#test'
import { analyzeFunction } from './analyze.js'

Test.on(analyzeFunction)
  .describe('parameters - named')
  .casesAsArgs(
    (a: number) => a,
    (a: number, b: string, c: boolean) => [a, b, c],
    () => 42,
    (_a: number, __b: string) => _a,
    (...args: any[]) => args,
  )
  .describe('parameters - destructured')
  .casesAsArgs(
    ({ a, b }: { a: number; b: string }) => [a, b],
    (a: number, { b, c }: { b: string; c: boolean }) => [a, b, c],
  )
  .describe('body extraction')
  .casesAsArgs(
    (a: number) => a + 1,
    (a: number) => {
      return a + 1
    },
    function f(a: number) {
      return a + 1
    },
    (a: number) => {
      const b = a + 1
      const c = b * 2
      return c
    },
  )
  .describe('async functions')
  .casesAsArgs(
    async (a: number) => a + 1,
    async (a: number) => {
      return a + 1
    },
    async function f(a: number) {
      return a + 1
    },
  )
  .describe('error cases')
  .casesAsArgs(
    'not a function' as any, // Error will be caught and snapshotted as "THEN THROWS"
  )
  .test()
