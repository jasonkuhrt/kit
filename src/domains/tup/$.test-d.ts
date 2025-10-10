import { Ts } from '#ts'
import { Tup } from './$.js'

type _Push = Ts.Test.Cases<
  Ts.Test.exact<Tup.Push<[1, 2], 3>, [1, 2, 3]>,
  Ts.Test.exact<Tup.Push<[], 'first'>, ['first']>,
  Ts.Test.exact<Tup.Push<[string], number>, [string, number]>
>

type _IsMultiple = Ts.Test.Cases<
  Ts.Test.exact<Tup.IsMultiple<[1, 2]>, true>,
  Ts.Test.exact<Tup.IsMultiple<[1, 2, 3]>, true>,
  Ts.Test.exact<Tup.IsMultiple<[1]>, false>,
  Ts.Test.exact<Tup.IsMultiple<[]>, false>,
  Ts.Test.exact<Tup.IsMultiple<string>, false>
>

type _Flatten = Ts.Test.Cases<
  Ts.Test.exact<Tup.Flatten<[[1, 2], [3, 4]]>, readonly [1, 2, 3, 4]>,
  Ts.Test.exact<Tup.Flatten<[['a'], ['b', 'c']]>, readonly ['a', 'b', 'c']>,
  Ts.Test.exact<Tup.Flatten<[]>, []>
>

type _IsEmpty = Ts.Test.Cases<
  Ts.Test.exact<Tup.IsEmpty<[]>, true>,
  Ts.Test.exact<Tup.IsEmpty<readonly []>, true>,
  Ts.Test.exact<Tup.IsEmpty<[1]>, false>,
  Ts.Test.exact<Tup.IsEmpty<[1, 2, 3]>, false>
>

type Users = readonly [
  { id: 'alice'; name: 'Alice' },
  { id: 'bob'; name: 'Bob' },
]

type _IndexBy = Ts.Test.Cases<
  Ts.Test.exact<Tup.IndexBy<Users, 'id'>['alice'], { id: 'alice'; name: 'Alice' }>,
  Ts.Test.exact<Tup.IndexBy<Users, 'id'>['bob'], { id: 'bob'; name: 'Bob' }>
>

type _GetLastValue = Ts.Test.Cases<
  Ts.Test.exact<Tup.GetLastValue<[1, 2, 3]>, 3>,
  Ts.Test.exact<Tup.GetLastValue<['a']>, 'a'>,
  Ts.Test.exact<Tup.GetLastValue<['x', 'y', 'z']>, 'z'>
>

type _DropUntilIndex = Ts.Test.Cases<
  Ts.Test.exact<Tup.DropUntilIndex<[1, 2, 3], 0>, [1, 2, 3]>,
  Ts.Test.exact<Tup.DropUntilIndex<[1, 2, 3], 2>, [3]>,
  Ts.Test.exact<Tup.DropUntilIndex<[1, 2, 3], 3>, []>
>

type _GetAtNextIndex = Ts.Test.Cases<
  Ts.Test.exact<Tup.GetAtNextIndex<[1, 2, 3], 0>, 2>,
  Ts.Test.exact<Tup.GetAtNextIndex<[1, 2, 3], 2>, undefined>
>

type _FindIndexForValue = Ts.Test.Cases<
  Ts.Test.exact<Tup.FindIndexForValue<'b', ['a', 'b', 'c']>, 1>,
  Ts.Test.exact<Tup.FindIndexForValue<'a', ['a', 'b', 'c']>, 0>,
  Ts.Test.exact<Tup.FindIndexForValue<'c', ['a', 'b', 'c']>, 2>
>

type _TakeValuesBefore = Ts.Test.Cases<
  Ts.Test.exact<Tup.TakeValuesBefore<'c', ['a', 'b', 'c', 'd']>, ['a', 'b']>,
  Ts.Test.exact<Tup.TakeValuesBefore<'a', ['a', 'b', 'c']>, []>,
  Ts.Test.exact<Tup.TakeValuesBefore<'d', ['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>
>

type _ToIndexByObjectKey = Ts.Test.Cases<
  Ts.Test.bid<Tup.ToIndexByObjectKey<[{ name: 'a' }, { name: 'b' }], 'name'>, { a: { name: 'a' }; b: { name: 'b' } }>,
  Ts.Test.exact<Tup.ToIndexByObjectKey<[], 'name'>, {}>
>

type _PreviousItem = Ts.Test.Cases<
  Ts.Test.exact<Tup.PreviousItem<[], 1>, undefined>,
  Ts.Test.exact<Tup.PreviousItem<[1, 2, 3], 2>, 1>,
  Ts.Test.exact<Tup.PreviousItem<[1, 2, 3], 1>, undefined>,
  Ts.Test.exact<Tup.PreviousItem<[{ x: 1 }, { y: 2 }], { x: 1 }>, undefined>,
  Ts.Test.exact<Tup.PreviousItem<[{ x: 1 }, { y: 2 }], { y: 2 }>, { x: 1 }>,
  Ts.Test.exact<Tup.PreviousItem<[{ x: 1 }, { y: 2; w: 3 }], { y: 2 }>, { x: 1 }>
>

// GetNextIndexOr and FindValueAfterOr test OrDefault indirectly
type _GetNextIndexOr = Ts.Test.Cases<
  Ts.Test.exact<Tup.GetNextIndexOr<['a', 'b', 'c'], 0, 'default'>, 'b'>,
  Ts.Test.exact<Tup.GetNextIndexOr<['a', 'b', 'c'], 2, 'default'>, 'default'>
>
