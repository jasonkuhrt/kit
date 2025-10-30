import { Pat } from '#pat'
import { Assert } from '#ts/ts'

Assert.parameter1.sub.ofAs<Pat.Pattern<number>>().on(Pat.isMatchOn(42))
Assert.parameter1.sub.ofAs<Pat.Pattern<string>>().on(Pat.isMatchOn('hello'))
Assert.parameter1.sub.ofAs<Pat.Pattern<boolean>>().on(Pat.isMatchOn(true))
Assert.parameter1.sub.ofAs<Pat.Pattern<bigint>>().on(Pat.isMatchOn(1n))
Assert.parameter1.sub.ofAs<Pat.Pattern<Date>>().on(Pat.isMatchOn(new Date()))
Assert.parameter1.sub.ofAs<Pat.Pattern<number[]>>().on(Pat.isMatchOn([1, 2]))
Assert.parameter1.sub.ofAs<Pat.Pattern<{ name: string; age: number }>>().on(
  Pat.isMatchOn({ name: 'Alice', age: 30 }),
)
