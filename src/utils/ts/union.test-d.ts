import { Ts } from '#ts'

// dprint-ignore
type _IsAnyMemberExtends = Ts.Test.Cases<
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<string | number, string>,           true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<number | boolean, string>,          false>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<'a' | 'b' | 1, string>,             true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<string | Promise<number>, Promise<any>>, true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<never, string>,                     false>
>

// Test __FORCE_DISTRIBUTION__ marker
type WrapInArray<$T> = $T extends Ts.Union.__FORCE_DISTRIBUTION__ ? [$T] : never

type _ForceDistribution = Ts.Test.Cases<
  Ts.Test.exact<WrapInArray<'a' | 'b' | 'c'>, ['a'] | ['b'] | ['c']>,
  Ts.Test.exact<WrapInArray<1 | 2 | 3>, [1] | [2] | [3]>,
  Ts.Test.exact<WrapInArray<string>, [string]>
>
