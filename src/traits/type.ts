import { Traitor } from '#traitor'
import type { Ts } from '#ts'

/**
 * Type trait interface for type checking operations.
 *
 * The Type trait provides a standard interface for checking if a value
 * belongs to a specific domain or type. It enables runtime type checking
 * with TypeScript type guard support for proper type narrowing.
 *
 * @template $Value - The type of values this Type instance can check
 *
 * @example
 * ```ts
 * import { Str, Num } from '@wollybeard/kit'
 *
 * // Domain-specific type checking
 * Str.Type.is('hello')  // true
 * Str.Type.is(123)      // false
 *
 * // Polymorphic type checking (requires setup)
 * Type.is('hello')  // true (dispatches to Str)
 * Type.is(123)      // true (dispatches to Num)
 * ```
 */
export interface Type<$Value = any> extends
  Traitor.Definition<
    'Type',
    [], // Dependencies (none)
    { // External interface - rich types for users
      /**
       * Check if a value belongs to this domain/type.
       *
       * This is a type guard that narrows the type when it returns true.
       * For primitive types, this typically checks typeof or specific values.
       * For complex types, this checks structural properties or prototypes.
       *
       * @param value - The value to type check
       * @returns `true` if the value belongs to this type, `false` otherwise
       *
       * @example
       * ```ts
       * // Type narrowing
       * const value: unknown = getValue()
       * if (Str.Type.is(value)) {
       *   // value is now typed as string
       *   value.toUpperCase()
       * }
       *
       * // Array filtering with type narrowing
       * const mixed = ['hello', 123, true, 'world']
       * const strings = mixed.filter(Str.Type.is)
       * // strings is typed as string[]
       * ```
       */
      is(value: unknown): value is $Value
    },
    { // Internal interface
      is(value: unknown): boolean
    }
  >,
  Ts.Kind.Private
{
  // @ts-expect-error - PrivateKind pattern: unknown will be overridden via intersection
  [Ts.Kind.PrivateKindReturn]: Type<this[Ts.Kind.PrivateKindParameters][0]>
  [Ts.Kind.PrivateKindParameters]: unknown
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Runtime
//
//

export const Type = Traitor.define<Type>('Type')
