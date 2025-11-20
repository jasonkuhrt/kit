import { Test } from '#test'
import { ArrMut } from './_.js'

Test.on(ArrMut.is)
  .cases(
    [[[]], true],
    [[[1, 2, 3]], true],
    [[{}], false],
    [[`string`], false],
    [[null], false],
    [[undefined], false],
  )
  .test()

Test.on(ArrMut.create)
  .cases([[], []])
  .test()

Test.on(ArrMut.map<number[], number>)
  .cases(
    [[[1, 2, 3], (x: number) => x * 2], [2, 4, 6]],
    [[[], (x: number) => x], []],
  )
  .test()

Test.on(ArrMut.find<number>)
  .cases(
    [[[1, 2, 3], (x: number) => x > 2], 3],
    [[[1, 2, 3], (x: number) => x > 10], undefined],
  )
  .test()

Test.on(ArrMut.join)
  .cases(
    [[['a', 'b', 'c'], ','], 'a,b,c'],
    [[[1, 2, 3], ' - '], '1 - 2 - 3'],
  )
  .test()

Test.on(ArrMut.merge<number>)
  .cases([[[1, 2], [3, 4]], [1, 2, 3, 4]])
  .test()

Test.on(ArrMut.isEmpty)
  .cases(
    [[[]], true],
    [[[1]], false],
  )
  .test()

Test.on(ArrMut.getFirst<number>)
  .cases(
    [[[1, 2, 3]], 1],
    [[[]], undefined],
  )
  .test()

Test.on(ArrMut.getLast<number>)
  .cases(
    [[[1, 2, 3]], 3],
    [[[]], undefined],
  )
  .test()
