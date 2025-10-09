import { Ts } from '#ts'

// dprint-ignore
type _ = Ts.Test.Cases<
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<string | number, string>,           true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<number | boolean, string>,          false>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<'a' | 'b' | 1, string>,             true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<string | Promise<number>, Promise<any>>, true>,
  Ts.Test.exact<Ts.Union.IsAnyMemberExtends<never, string>,                     false>
>
