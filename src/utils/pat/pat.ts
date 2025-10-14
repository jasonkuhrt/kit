import { CoreFn as Fn } from '#fn/core'
import { Rec } from '#rec'

/**
 * A pattern for matching against values.
 * For objects, represents a partial structure to match against.
 * @template $Value - The type of value this pattern matches
 */
export type Pattern<$Value> = Partial<$Value>

/**
 * Checks if a value matches a pattern.
 * For objects, performs a deep partial match.
 * For primitives, performs strict equality comparison.
 * @template value - The type of the value to match
 * @param value - The value to check
 * @param pattern - The pattern to match against
 * @returns True if the value matches the pattern, false otherwise
 * @example
 * ```ts
 * // Primitive matching
 * isMatch(42, 42) // true
 * isMatch('hello', 'hello') // true
 * isMatch('hello', 'world') // false
 *
 * // Object matching (partial)
 * isMatch({ a: 1, b: 2 }, { a: 1 }) // true
 * isMatch({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
 * isMatch({ a: 1, b: 2 }, { a: 2 }) // false
 *
 * // Nested object matching
 * isMatch(
 *   { user: { name: 'John', age: 30 } },
 *   { user: { name: 'John' } }
 * ) // true
 * ```
 */
export const isMatch = <value>(value: value, pattern: Pattern<value>): boolean => {
  if (Rec.is(value) && Rec.is(pattern)) {
    const value_ = value as Rec.Any

    return Object.entries(pattern).every(([patternKey, patternValue]) => {
      const valueValue = value_[patternKey]
      return isMatch(valueValue, patternValue as any)
    })
  }

  return value === pattern
}

/**
 * Curried version of {@link isMatch} with pattern first.
 * Returns a function that checks if values match the given pattern.
 * @template value - The type of values to match
 * @param pattern - The pattern to match against
 * @returns A function that takes a value and returns true if it matches the pattern
 * @example
 * ```ts
 * const isAdmin = isMatchOn({ role: 'admin' })
 * isAdmin({ name: 'John', role: 'admin' }) // true
 * isAdmin({ name: 'Jane', role: 'user' }) // false
 *
 * const hasAge30 = isMatchOn({ age: 30 })
 * const users = [
 *   { name: 'Alice', age: 30 },
 *   { name: 'Bob', age: 25 },
 *   { name: 'Charlie', age: 30 }
 * ]
 * users.filter(hasAge30) // [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }]
 * ```
 */
export const isMatchOn = Fn.flipCurried(Fn.curry(isMatch))

/**
 * Curried version of {@link isMatch} with value first.
 * Returns a function that checks if the given value matches patterns.
 * @template value - The type of the value to match
 * @param value - The value to match against patterns
 * @returns A function that takes a pattern and returns true if the value matches it
 * @example
 * ```ts
 * const user = { name: 'John', role: 'admin', age: 30 }
 * const matchesUser = isMatchWith(user)
 *
 * matchesUser({ role: 'admin' }) // true
 * matchesUser({ age: 30 }) // true
 * matchesUser({ name: 'Jane' }) // false
 *
 * // Useful for finding which patterns a value satisfies
 * const patterns = [
 *   { role: 'admin' },
 *   { age: 30 },
 *   { name: 'Jane' }
 * ]
 * patterns.filter(matchesUser) // [{ role: 'admin' }, { age: 30 }]
 * ```
 */
export const isMatchWith = Fn.flipCurried(isMatchOn)
