import type { Obj } from '#obj'
import type { A } from 'ts-toolbelt'
import type { Apply } from '../../kind.js'
import type { Relation } from '../../relation.js'
import type { DisplaySimplify, StaticErrorAssertion } from '../helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Diff Utilities
//
//
//
//

/**
 * Compute structured diff between Expected and Actual object types.
 *
 * Returns a flat object with `diff_` prefixed fields:
 * - `diff_missing` - Properties in Expected but not in Actual (only if non-empty)
 * - `diff_excess` - Properties in Actual but not in Expected (only if non-empty)
 * - `diff_mismatch` - Properties in both but with different types (only if non-empty)
 *
 * Empty diff fields are completely omitted from the result.
 * If either type is not an object, returns an empty object (no diff).
 *
 * @internal
 */
// dprint-ignore
type DiffFields<$Expected extends object, $Actual extends object> = {
  diff_missing: DisplaySimplify<A.Compute<Obj.ExcludeKeys<$Expected, Obj.SharedKeys<$Expected, $Actual>>>>
  diff_excess: DisplaySimplify<A.Compute<Obj.ExcludeKeys<$Actual, Obj.SharedKeys<$Expected, $Actual>>>>
  diff_mismatch: DisplaySimplify<A.Compute<Obj.OmitNever<Obj.Mismatched<$Expected, $Actual>>>>
}

// dprint-ignore
export type ComputeDiff<$Expected, $Actual> =
  $Expected extends object
    ? $Actual extends object
      ? {
          [k in keyof DiffFields<$Expected, $Actual> as Obj.IsEmpty<DiffFields<$Expected, $Actual>[k]> extends true ? never : k]: DiffFields<$Expected, $Actual>[k]
        }
      : {}
    : {}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Base Relation Kinds
//
//
//
//

/**
 * Exact assertion kind - checks for exact structural equality.
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if types are exactly equal, otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `exact.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 */
// dprint-ignore
export interface ExactKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  return:
    Relation.IsExact<this['parameters'][1], this['parameters'][0]> extends true
      ? never
      : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
        ? StaticErrorAssertion<
            'Types are mutually assignable but not structurally equal',
            this['parameters'][0],
            this['parameters'][1],
            ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Use equiv() for mutual assignability OR apply Simplify<T> to normalize types' }
          >
        : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.subtype
          ? StaticErrorAssertion<
              'Actual type is a subtype of expected type but not structurally equal',
              this['parameters'][0],
              this['parameters'][1],
              ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Actual is narrower than expected - types don\'t match exactly' }
            >
          : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.supertype
            ? StaticErrorAssertion<
                'Actual type is a supertype of expected type but not structurally equal',
                this['parameters'][0],
                this['parameters'][1],
                ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Actual is wider than expected - types don\'t match exactly' }
              >
            : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.overlapping
              ? StaticErrorAssertion<
                  'Types have overlapping values but are not structurally equal',
                  this['parameters'][0],
                  this['parameters'][1],
                  ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Types share some possible values but are different' }
                >
              : StaticErrorAssertion<
                  'Types are completely disjoint (no common values)',
                  this['parameters'][0],
                  this['parameters'][1],
                  ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'These types have no overlap and will never be equal' }
                >
}

/**
 * Equiv assertion kind - checks for mutual assignability (semantic equality).
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if types are mutually assignable, otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `equiv.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 */
// dprint-ignore
export interface EquivKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  return:
    Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
      ? never
      : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.subtype
        ? StaticErrorAssertion<
            'Actual extends Expected, but Expected does not extend Actual',
            this['parameters'][0],
            this['parameters'][1]
          >
        : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.supertype
          ? StaticErrorAssertion<
              'Expected extends Actual, but Actual does not extend Expected',
              this['parameters'][0],
              this['parameters'][1]
            >
          : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.overlapping
            ? StaticErrorAssertion<
                'Types overlap but are not mutually assignable',
                this['parameters'][0],
                this['parameters'][1]
              >
            : StaticErrorAssertion<
                'Types are disjoint (no common values)',
                this['parameters'][0],
                this['parameters'][1]
              >
}

/**
 * Sub assertion kind - checks that Actual extends Expected (subtype relation).
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if Actual extends Expected, otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `sub.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 */
// dprint-ignore
export interface SubKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Actual type does not extend expected type',
          this['parameters'][0],
          this['parameters'][1]
        >
}
