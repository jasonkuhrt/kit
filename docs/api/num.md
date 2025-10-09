# Num

Numeric types and utilities with branded types for mathematical constraints.

Provides branded number types (Positive, Negative, Even, Odd, etc.) with
runtime validation, mathematical operations, range types, and specialized
numeric domains like Complex, Ratio, and BigInt. Includes type guards,
ordering, and equivalence utilities.

## Import

```typescript
import { Num } from '@wollybeard/kit/num'
```

## Functions

### add <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L27)</sub>

```typescript
;((a: number, b: number) => number)
```

### subtract <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L65)</sub>

```typescript
;((a: number, b: number) => number)
```

### multiply <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L106)</sub>

```typescript
;((a: number, b: number) => number)
```

### divide <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L151)</sub>

```typescript
;((dividend: number, divisor: NonZero) => number)
```

### divideWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L177)</sub>

```typescript
;((divisor: NonZero) => (dividend: number) => number)
```

### power <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L204)</sub>

```typescript
;((base: number, exponent: number) => number)
```

### round <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L258)</sub>

```typescript
;((value: number, precision?: number) => number)
```

### floor <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L319)</sub>

```typescript
;(<T extends Finite>(value: T) => Int)
```

### ceil <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L355)</sub>

```typescript
;(<T extends Finite>(value: T) => Int)
```

### trunc <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L390)</sub>

```typescript
;(<T extends Finite>(value: T) => Int)
```

### sqrt <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L429)</sub>

```typescript
;(<T extends NonNegative>(value: T) => Sqrt<T>)
```

### cbrt <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L451)</sub>

```typescript
;((value: number) => number)
```

### log <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L475)</sub>

```typescript
;((value: Positive) => number)
```

### log10 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L502)</sub>

```typescript
;((value: Positive) => number)
```

### log2 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L530)</sub>

```typescript
;((value: Positive) => number)
```

### sin <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L565)</sub>

```typescript
;(<T extends Finite>(radians: T) => Sin<_T>)
```

### cos <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L600)</sub>

```typescript
;(<T extends Finite>(radians: T) => Cos<_T>)
```

### tan <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L628)</sub>

```typescript
;((radians: Finite) => number)
```

### asin <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L658)</sub>

```typescript
;((value: InRange<-1, 1>) => Radians)
```

### acos <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L689)</sub>

```typescript
;((value: InRange<-1, 1>) => Radians)
```

### atan <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L718)</sub>

```typescript
;((value: Finite) => Radians)
```

### atan2 <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L749)</sub>

```typescript
;((y: Finite, x: Finite) => Radians)
```

### degToRad <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L790)</sub>

```typescript
;((degrees: Degrees) => Radians)
```

### radToDeg <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L820)</sub>

```typescript
;((radians: Radians) => Degrees)
```

### min <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L853)</sub>

```typescript
;(<A extends number, B extends number>(a: A, b: B) => Min<A, B>)
```

### max <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L897)</sub>

```typescript
;(<A extends number, B extends number>(a: A, b: B) => Max<A, B>)
```

### gcd <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L941)</sub>

```typescript
;((a: Int, b: Int) => Natural)
```

### lcm <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1002)</sub>

```typescript
;((a: Int, b: Int) => Whole)
```

### is <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L16)</sub>

```typescript
(value: unknown) => value is number
```

### isNaN <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L23)</sub>

```typescript
(value: unknown) => value is number
```

### abs <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L50)</sub>

```typescript
;(<T extends number>(value: T) => Abs<T>)
```

### sign <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L78)</sub>

```typescript
;(<T extends number>(value: T) => Sign<T>)
```

### inc <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L85)</sub>

```typescript
;((value: number) => number)
```

### dec <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L92)</sub>

```typescript
;((value: number) => number)
```

### mod <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L123)</sub>

```typescript
;(<T extends number, U extends NonZero>(dividend: T, divisor: U) => NonNegative)
```

### modOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L141)</sub>

```typescript
;(<T extends number>(dividend: T) => <U extends NonZero>(divisor: U) =>
  NonNegative)
```

### modWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L162)</sub>

```typescript
;(<U extends NonZero>(divisor: U) => <T extends number>(dividend: T) =>
  NonNegative)
```

### range <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L43)</sub>

```typescript
(start: number, end: number, options?: RangeOptions | undefined) => number[]
```

### rangeFrom <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L96)</sub>

```typescript
(start: number) => (end: number, options?: RangeOptions | undefined) => number[]
```

### rangeTo <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L117)</sub>

```typescript
(end: number) => (start: number, options?: RangeOptions | undefined) => number[]
```

### rangeStep <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L136)</sub>

```typescript
(start: number, end: number, step: number) => number[]
```

### rangeStepWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L157)</sub>

```typescript
(step: number) => (start: number, end: number) => number[]
```

### rangeInclusive <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L175)</sub>

```typescript
(start: number, end: number) => number[]
```

### times <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L200)</sub>

```typescript
<T>(n: number, fn: (index: number) => T) => T[]
```

### timesWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L229)</sub>

```typescript
<T>(fn: (index: number) => T) => (n: number) => T[]
```

### lerp <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L259)</sub>

```typescript
;((start: number, end: number, t: number) => number)
```

### lerpBetween <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L309)</sub>

```typescript
;((start: number, end: number) => (t: number) => number)
```

### mapRange <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L339)</sub>

```typescript
;((
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
) => number)
```

### mapRangeFrom <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L414)</sub>

```typescript
;((fromMin: number, fromMax: number, toMin: number, toMax: number) =>
(value: number) => number)
```

### sequence <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L440)</sub>

```typescript
(n: number) => number[]
```

### wrap <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L471)</sub>

```typescript
;((value: number, min: number, max: number) => number)
```

### wrapWithin <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L534)</sub>

```typescript
;((min: number, max: number) => (value: number) => number)
```

## Constants

### Degrees <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/degrees/$$.ts#L1)</sub>

```typescript
export * from './degrees.js'
```

### Even <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/even/$$.ts#L1)</sub>

```typescript
export * from './even.js'
```

### Finite <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/finite/$$.ts#L1)</sub>

```typescript
export * from './finite.js'
```

### Float <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/float/$$.ts#L1)</sub>

```typescript
export * from './float.js'
```

### InRange <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/in-range/$$.ts#L1)</sub>

```typescript
export * from './in-range.js'
```

### Int <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/int/$$.ts#L1)</sub>

```typescript
export * from './int.js'
```

### Natural <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/natural/$$.ts#L1)</sub>

```typescript
export * from './natural.js'
```

### Negative <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/negative/$$.ts#L1)</sub>

```typescript
export * from './negative.js'
```

### NonNegative <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/non-negative/$$.ts#L1)</sub>

```typescript
export * from './non-negative.js'
```

### NonPositive <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/non-positive/$$.ts#L1)</sub>

```typescript
export * from './non-positive.js'
```

### NonZero <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/non-zero/$$.ts#L1)</sub>

```typescript
export * from './non-zero.js'
```

### Odd <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/odd/$$.ts#L1)</sub>

```typescript
export * from './odd.js'
```

### Percentage <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/percentage/$$.ts#L1)</sub>

```typescript
export * from './percentage.js'
```

### Positive <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/positive/$$.ts#L1)</sub>

```typescript
export * from './positive.js'
```

### Radians <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/radians/$$.ts#L1)</sub>

```typescript
export * from './radians.js'
```

### SafeInt <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/safe-int/$$.ts#L1)</sub>

```typescript
export * from './safe-int.js'
```

### Whole <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/whole/$$.ts#L1)</sub>

```typescript
export * from './whole.js'
```

### Zero <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/zero/$$.ts#L1)</sub>

```typescript
export * from './zero.js'
```

### Prime <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/prime/$$.ts#L1)</sub>

```typescript
export * from './prime.js'
```

### Ratio <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/ratio/$$.ts#L1)</sub>

```typescript
export * from './ratio.js'
```

### Frac <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/frac/$$.ts#L1)</sub>

```typescript
export * from './frac.js'
```

### Complex <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/complex/$$.ts#L1)</sub>

```typescript
export * from './complex.js'
```

### BigInt <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/big-integer/$$.ts#L1)</sub>

```typescript
export * from './big-integer.js'
```

### Arb <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/traits/arb.ts#L34)</sub>

```typescript
Arb<number>
```

### Eq <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/traits/eq.ts#L21)</sub>

```typescript
Eq<number>
```

### Type <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/traits/type.ts#L20)</sub>

```typescript
Type<number>
```

### addWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L48)</sub>

```typescript
;((a: number) => (b: number) => number)
```

### subtractWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L88)</sub>

```typescript
;((a: number) => (b: number) => number)
```

### multiplyWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L132)</sub>

```typescript
;((b: number) => (a: number) => number)
```

### powerWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L230)</sub>

```typescript
;((exponent: number) => (base: number) => number)
```

### roundWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L286)</sub>

```typescript
;((precision?: number | undefined) => (value: number) => number)
```

### atan2With <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L762)</sub>

```typescript
;((y: Finite) => (x: Finite) => Radians)
```

### minWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L866)</sub>

```typescript
;((a: number) => (b: number) => number)
```

### maxWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L910)</sub>

```typescript
;((a: number) => (b: number) => number)
```

### gcdWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L971)</sub>

```typescript
;((a: Int) => (b: Int) => Natural)
```

### lcmWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1020)</sub>

```typescript
;((a: Int) => (b: Int) => Whole)
```

### PI <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1039)</sub>

```typescript
number
```

### E <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1059)</sub>

```typescript
number
```

### TAU <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1081)</sub>

```typescript
number
```

### GOLDEN_RATIO <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L1105)</sub>

```typescript
number
```

## Types

### Floor <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L292)</sub>

Type-level floor transformation.
Floor always returns an integer.

```typescript
export type Floor<_T extends number> = Int
```

### Ceil <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L327)</sub>

Type-level ceil transformation.
Ceil always returns an integer.

```typescript
export type Ceil<_T extends number> = Int
```

### Trunc <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L363)</sub>

Type-level trunc transformation.
Trunc always returns an integer.

```typescript
export type Trunc<_T extends number> = Int
```

### Sqrt <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L399)</sub>

Type-level sqrt transformation.
Square root of non-negative returns non-negative.
Square root of positive returns positive (except for 0).

```typescript
export type Sqrt<T extends number> = T extends Positive ? Positive
  : T extends NonNegative ? NonNegative
  : number
```

### Sin <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L538)</sub>

Type-level sine transformation.
Sine always returns a value in the range [-1, 1].

```typescript
export type Sin<_T extends number> = InRange<-1, 1>
```

### Cos <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L573)</sub>

Type-level cosine transformation.
Cosine always returns a value in the range [-1, 1].

```typescript
export type Cos<_T extends number> = InRange<-1, 1>
```

### Min <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L828)</sub>

Type-level min transformation.
Returns the union of both input types (the more general type).

```typescript
export type Min<A extends number, B extends number> = A | B
```

### Max <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/math.ts#L872)</sub>

Type-level max transformation.
Returns the union of both input types (the more general type).

```typescript
export type Max<A extends number, B extends number> = A | B
```

### Abs <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L31)</sub>

Type-level absolute value transformation.
Maps number types to their absolute value types.

```typescript
export type Abs<T extends number> = T extends Positive ? Positive
  : T extends Negative ? Positive
  : T extends NonPositive ? NonNegative
  : T extends Zero ? Zero
  : NonNegative
```

### Sign <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L58)</sub>

Type-level sign transformation.
Maps number types to their sign (-1, 0, 1).

```typescript
export type Sign<T extends number> = T extends Positive ? 1
  : T extends Negative ? -1
  : T extends Zero ? 0
  : -1 | 0 | 1
```

### Mod <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L100)</sub>

Type-level modulo transformation.
Modulo always returns a non-negative result.

```typescript
export type Mod<_T extends number, _U extends NonZero> = NonNegative
```

### NumberLiteral <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L169)</sub>

Number literal type.

```typescript
export type NumberLiteral = number
```

### PlusOne <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L174)</sub>

Add one to a number literal type.

```typescript
export type PlusOne<$n extends NumberLiteral> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
][
  $n
]
```

### MinusOne <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/operations.ts#L203)</sub>

Subtract one from a number literal type.

```typescript
export type MinusOne<$n extends NumberLiteral> = [
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
][
  $n
]
```

### RangeOptions <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/num/range.ts#L4)</sub>

Options for generating numeric ranges.

```typescript
export interface RangeOptions {
  /**
   * The step between each number in the range.
   * @default 1
   */
  step?: number
  /**
   * Whether to include the end value in the range.
   * @default false
   */
  inclusive?: boolean
}
```
