import { Test } from '#test'
import { analyzeFunction } from './analyze.js'

Test.on(analyzeFunction)
  .casesInAsArgs('parameters - named')(
    (a: number) => a,
    (a: number, b: string, c: boolean) => [a, b, c],
    () => 42,
    (_a: number, __b: string) => _a,
    (...args: any[]) => args,
  )
  .casesInAsArgs('parameters - destructured')(
    ({ a, b }: { a: number; b: string }) => [a, b],
    (a: number, { b, c }: { b: string; c: boolean }) => [a, b, c],
  )
  .casesInAsArgs('body extraction')(
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
  .casesInAsArgs('async functions')(
    async (a: number) => a + 1,
    async (a: number) => {
      return a + 1
    },
    async function f(a: number) {
      return a + 1
    },
  )
  .casesInAsArgs('error cases')(
    'not a function' as any, // Error will be caught and snapshotted as "THEN THROWS"
  )
  .test()
