import { Pat } from '#pat'
import { Assert } from '#ts/ts'

Assert.parameter1.sub.ofAs<Pat.Pattern<number>>()(Pat.isMatchOn(42))
Assert.parameter1.sub.ofAs<Pat.Pattern<string>>()(Pat.isMatchOn('hello'))
Assert.parameter1.sub.ofAs<Pat.Pattern<boolean>>()(Pat.isMatchOn(true))
Assert.parameter1.sub.ofAs<Pat.Pattern<bigint>>()(Pat.isMatchOn(1n))
Assert.parameter1.sub.ofAs<Pat.Pattern<Date>>()(Pat.isMatchOn(new Date()))
Assert.parameter1.sub.ofAs<Pat.Pattern<number[]>>()(Pat.isMatchOn([1, 2]))
Assert.parameter1.sub.ofAs<Pat.Pattern<{ name: string; age: number }>>()(
  Pat.isMatchOn({ name: 'Alice', age: 30 }),
)
