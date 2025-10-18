import { Ts } from '#ts'

// dprint-ignore
type _IsAnyMemberExtends = Ts.Assert.Cases<
Ts.Assert.exact.of<Ts.Union.IsAnyMemberExtends<string | number, string>,           true>,
Ts.Assert.exact.of<Ts.Union.IsAnyMemberExtends<number | boolean, string>,          false>,
Ts.Assert.exact.of<Ts.Union.IsAnyMemberExtends<'a' | 'b' | 1, string>,             true>,
Ts.Assert.exact.of<Ts.Union.IsAnyMemberExtends<string | Promise<number>, Promise<any>>, true>,
Ts.Assert.exact.of<Ts.Union.IsAnyMemberExtends<never, string>,                     false>
>

// Test __FORCE_DISTRIBUTION__ marker
type WrapInArray<$T> = $T extends Ts.Union.__FORCE_DISTRIBUTION__ ? [$T] : never

type _ForceDistribution = Ts.Assert.Cases<
  Ts.Assert.exact.of<WrapInArray<'a' | 'b' | 'c'>, ['a'] | ['b'] | ['c']>,
  Ts.Assert.exact.of<WrapInArray<1 | 2 | 3>, [1] | [2] | [3]>,
  Ts.Assert.exact.of<WrapInArray<string>, [string]>
>
