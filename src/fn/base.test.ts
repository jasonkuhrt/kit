import { expectTypeOf } from "vitest";
import { bind } from "./base.js";
import { _, fn1p, fn2p } from "./_test.js";


// bind

bind(
  // @ts-expect-error
  fnNoParameters,
  _
)

bind(
  fn1p,
  // @ts-expect-error
  'invalid'
)

expectTypeOf(bind(fn1p, 1)).toEqualTypeOf<() => void>()
expectTypeOf(bind(fn2p, 1)).toEqualTypeOf<(arg2: string) => void>()
