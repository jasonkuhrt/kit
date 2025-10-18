import { Ts } from '#ts'
import { Tup } from './$.js'

type _Push = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.Push<[1, 2], 3>, [1, 2, 3]>,
  Ts.Assert.exact.of<Tup.Push<[], 'first'>, ['first']>,
  Ts.Assert.exact.of<Tup.Push<[string], number>, [string, number]>
>

type _IsMultiple = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.IsMultiple<[1, 2]>, true>,
  Ts.Assert.exact.of<Tup.IsMultiple<[1, 2, 3]>, true>,
  Ts.Assert.exact.of<Tup.IsMultiple<[1]>, false>,
  Ts.Assert.exact.of<Tup.IsMultiple<[]>, false>,
  Ts.Assert.exact.of<Tup.IsMultiple<string>, false>
>

type _Flatten = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.Flatten<[[1, 2], [3, 4]]>, readonly [1, 2, 3, 4]>,
  Ts.Assert.exact.of<Tup.Flatten<[['a'], ['b', 'c']]>, readonly ['a', 'b', 'c']>,
  Ts.Assert.exact.of<Tup.Flatten<[]>, []>
>

type _IsEmpty = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.IsEmpty<[]>, true>,
  Ts.Assert.exact.of<Tup.IsEmpty<readonly []>, true>,
  Ts.Assert.exact.of<Tup.IsEmpty<[1]>, false>,
  Ts.Assert.exact.of<Tup.IsEmpty<[1, 2, 3]>, false>
>

type Users = readonly [
  { id: 'alice'; name: 'Alice' },
  { id: 'bob'; name: 'Bob' },
]

type _IndexBy = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.IndexBy<Users, 'id'>['alice'], { id: 'alice'; name: 'Alice' }>,
  Ts.Assert.exact.of<Tup.IndexBy<Users, 'id'>['bob'], { id: 'bob'; name: 'Bob' }>
>

type _GetLastValue = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.GetLastValue<[1, 2, 3]>, 3>,
  Ts.Assert.exact.of<Tup.GetLastValue<['a']>, 'a'>,
  Ts.Assert.exact.of<Tup.GetLastValue<['x', 'y', 'z']>, 'z'>
>

type _DropUntilIndex = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.DropUntilIndex<[1, 2, 3], 0>, [1, 2, 3]>,
  Ts.Assert.exact.of<Tup.DropUntilIndex<[1, 2, 3], 2>, [3]>,
  Ts.Assert.exact.of<Tup.DropUntilIndex<[1, 2, 3], 3>, []>
>

type _GetAtNextIndex = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.GetAtNextIndex<[1, 2, 3], 0>, 2>,
  Ts.Assert.exact.of<Tup.GetAtNextIndex<[1, 2, 3], 2>, undefined>
>

type _FindIndexForValue = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.FindIndexForValue<'b', ['a', 'b', 'c']>, 1>,
  Ts.Assert.exact.of<Tup.FindIndexForValue<'a', ['a', 'b', 'c']>, 0>,
  Ts.Assert.exact.of<Tup.FindIndexForValue<'c', ['a', 'b', 'c']>, 2>
>

type _TakeValuesBefore = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.TakeValuesBefore<'c', ['a', 'b', 'c', 'd']>, ['a', 'b']>,
  Ts.Assert.exact.of<Tup.TakeValuesBefore<'a', ['a', 'b', 'c']>, []>,
  Ts.Assert.exact.of<Tup.TakeValuesBefore<'d', ['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>
>

type _ToIndexByObjectKey = Ts.Assert.Cases<
  Ts.Assert.equiv.of<
    Tup.ToIndexByObjectKey<[{ name: 'a' }, { name: 'b' }], 'name'>,
    { a: { name: 'a' }; b: { name: 'b' } }
  >,
  Ts.Assert.exact.of<Tup.ToIndexByObjectKey<[], 'name'>, {}>
>

type _PreviousItem = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.PreviousItem<[], 1>, undefined>,
  Ts.Assert.exact.of<Tup.PreviousItem<[1, 2, 3], 2>, 1>,
  Ts.Assert.exact.of<Tup.PreviousItem<[1, 2, 3], 1>, undefined>,
  Ts.Assert.exact.of<Tup.PreviousItem<[{ x: 1 }, { y: 2 }], { x: 1 }>, undefined>,
  Ts.Assert.exact.of<Tup.PreviousItem<[{ x: 1 }, { y: 2 }], { y: 2 }>, { x: 1 }>,
  Ts.Assert.exact.of<Tup.PreviousItem<[{ x: 1 }, { y: 2; w: 3 }], { y: 2 }>, { x: 1 }>
>

// GetNextIndexOr and FindValueAfterOr test OrDefault indirectly
type _GetNextIndexOr = Ts.Assert.Cases<
  Ts.Assert.exact.of<Tup.GetNextIndexOr<['a', 'b', 'c'], 0, 'default'>, 'b'>,
  Ts.Assert.exact.of<Tup.GetNextIndexOr<['a', 'b', 'c'], 2, 'default'>, 'default'>
>
