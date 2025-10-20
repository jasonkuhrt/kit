import { Pat } from '#pat'
import { Assert } from '#ts/ts'

Assert.parameter1.sub.of.as<Pat.Pattern<number>>()(Pat.isMatchOn(42))
Assert.parameter1.sub.of.as<Pat.Pattern<string>>()(Pat.isMatchOn('hello'))
Assert.parameter1.sub.of.as<Pat.Pattern<boolean>>()(Pat.isMatchOn(true))
Assert.parameter1.sub.of.as<Pat.Pattern<bigint>>()(Pat.isMatchOn(1n))
Assert.parameter1.sub.of.as<Pat.Pattern<Date>>()(Pat.isMatchOn(new Date()))
Assert.parameter1.sub.of.as<Pat.Pattern<number[]>>()(Pat.isMatchOn([1, 2]))
Assert.parameter1.sub.of.as<Pat.Pattern<{ name: string; age: number }>>()(
  Pat.isMatchOn({ name: 'Alice', age: 30 }),
)
