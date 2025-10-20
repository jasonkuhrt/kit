import type { Kind } from '#ts/ts'
import type { Obj } from '#obj'
import type { Relation } from '../../relation.js'
import type { ComputeDiff, StaticErrorAssertion } from '../assertion-error.js'
// import type { AssertionKind } from '../helpers.js'

interface AssertionKind extends Kind.Kind {}

/**
 * Exact assertion kind - checks for exact structural equality.
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual, $Negated?]
 * Returns: never if types are exactly equal (or not equal when negated), otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `exact.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 * When $Negated is true, the assertion is inverted.
 */
// dprint-ignore
export interface ExactKind extends AssertionKind {
  expectationConstraint: unknown
  parameters: [$Expected: unknown, $Actual: unknown, $Negated?: boolean]
  return:
    this['parameters'][2] extends true
      ? InvertExactResult<this['parameters'][0], this['parameters'][1]>
      : Relation.IsExact<this['parameters'][1], this['parameters'][0]> extends true
        ? never
        : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
          ? StaticErrorAssertion<
              'EXPECTED and ACTUAL are only equivilant (not exact)',
              this['parameters'][0],
              this['parameters'][1],
              ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Use equiv() for mutual assignability OR apply Simplify<T> to normalize types' }
            >
          : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.subtype
            ? StaticErrorAssertion<
                'ACTUAL is subtype of EXPECTED',
                this['parameters'][0],
                this['parameters'][1],
                ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'ACTUAL is narrower than EXPECTED' }
              >
            : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.supertype
              ? StaticErrorAssertion<
                  'ACTUAL is supertype of EXPECTED',
                  this['parameters'][0],
                  this['parameters'][1],
                  ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'ACTUAL is wider than EXPECTED' }
                >
              : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.overlapping
                ? StaticErrorAssertion<
                    'EXPECTED only overlaps with ACTUAL',
                    this['parameters'][0],
                    this['parameters'][1],
                    ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Types share some values but differ' }
                  >
                : StaticErrorAssertion<
                    'EXPECTED and ACTUAL are disjoint',
                    this['parameters'][0],
                    this['parameters'][1],
                    ComputeDiff<this['parameters'][0], this['parameters'][1]> & { tip: 'Types share no values' }
                  >
}

type InvertExactResult<$Expected, $Actual> = Relation.IsExact<$Actual, $Expected> extends true ? StaticErrorAssertion<
    'ACTUAL is exactly EXPECTED but should not be',
    $Expected,
    $Actual
  >
  : never

/**
 * Equiv assertion kind - checks for mutual assignability (semantic equality).
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual, $Negated?]
 * Returns: never if types are mutually assignable (or not equivalent when negated), otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `equiv.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 * When $Negated is true, the assertion is inverted.
 */
// dprint-ignore
export interface EquivKind extends AssertionKind {
  expectationConstraint: unknown
  parameters: [$Expected: unknown, $Actual: unknown, $Negated?: boolean]
  return:
    this['parameters'][2] extends true
      ? InvertEquivResult<this['parameters'][0], this['parameters'][1]>
      : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
        ? never
        : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.subtype
          ? StaticErrorAssertion<
              'ACTUAL extends EXPECTED but not vice versa',
              this['parameters'][0],
              this['parameters'][1]
            >
          : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.supertype
            ? StaticErrorAssertion<
                'EXPECTED extends ACTUAL but not vice versa',
                this['parameters'][0],
                this['parameters'][1]
              >
            : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.overlapping
              ? StaticErrorAssertion<
                  'EXPECTED and ACTUAL overlap but not mutually assignable',
                  this['parameters'][0],
                  this['parameters'][1]
                >
              : StaticErrorAssertion<
                  'EXPECTED and ACTUAL are disjoint',
                  this['parameters'][0],
                  this['parameters'][1]
                >
}

type InvertEquivResult<$Expected, $Actual> = Relation.GetRelation<$Expected, $Actual> extends Relation.equivalent
  ? StaticErrorAssertion<
    'ACTUAL is equivalent to EXPECTED but should not be',
    $Expected,
    $Actual
  >
  : never

/**
 * Sub assertion kind - checks that Actual extends Expected (subtype relation).
 *
 * Part of the Higher-Kinded Types (HKT) pattern.
 *
 * Parameters: [$Expected, $Actual, $Negated?]
 * Returns: never if Actual extends Expected (or does not extend when negated), otherwise StaticErrorAssertion
 *
 * This is the base kind used by all `sub.*` assertions.
 * Extractors compose with this kind to transform inputs before checking.
 * When $Negated is true, the assertion is inverted.
 */
// dprint-ignore
export interface SubKind extends AssertionKind {
  expectationConstraint: unknown
  parameters: [$Expected: unknown, $Actual: unknown, $Negated?: boolean]
  return:
    this['parameters'][2] extends true
      ? InvertSubResult<this['parameters'][0], this['parameters'][1]>
      : this['parameters'][1] extends this['parameters'][0]
        ? never
        : StaticErrorAssertion<
            'ACTUAL does not extend EXPECTED',
            this['parameters'][0],
            this['parameters'][1]
          >
}

type InvertSubResult<$Expected, $Actual> = $Actual extends $Expected ? StaticErrorAssertion<
    'ACTUAL extends EXPECTED but should not',
    $Expected,
    $Actual
  >
  : never

/**
 * Helper: Check for excess properties in Actual beyond Expected.
 *
 * Returns never if no excess, otherwise StaticErrorAssertion with excess keys.
 */
type CheckNoExcess<$Expected, $Actual> = $Actual extends infer __actual__
  ? $Expected extends infer __expected__
    ? [keyof Obj.SubtractShallow<__actual__, __expected__>] extends [never] ? never
      : StaticErrorAssertion<
          'ACTUAL has excess properties not in EXPECTED',
          __expected__,
          __actual__,
          { excess: keyof Obj.SubtractShallow<__actual__, __expected__> }
        >
    : never
  : never

/**
 * Sub + NoExcess kind - checks subtype relation AND no excess properties.
 *
 * Parameters: [$Expected, $Actual, $Negated?]
 * Returns: never if Actual extends Expected with no excess properties
 *
 * Combines two checks:
 * 1. Actual extends Expected (subtype relation)
 * 2. Actual has no object keys beyond those in Expected
 */
// dprint-ignore
export interface SubNoExcessKind extends AssertionKind {
  expectationConstraint: unknown
  parameters: [$Expected: unknown, $Actual: unknown, $Negated?: boolean]
  return:
    this['parameters'][2] extends true
      ? InvertSubNoExcessResult<this['parameters'][0], this['parameters'][1]>
      : this['parameters'][1] extends this['parameters'][0]
        ? CheckNoExcess<this['parameters'][0], this['parameters'][1]>
        : StaticErrorAssertion<
            'ACTUAL does not extend EXPECTED',
            this['parameters'][0],
            this['parameters'][1]
          >
}

type InvertSubNoExcessResult<$Expected, $Actual> = $Actual extends $Expected
  ? [keyof Obj.SubtractShallow<$Actual, $Expected>] extends [never]
    ? StaticErrorAssertion<
        'ACTUAL extends EXPECTED with no excess but should not',
        $Expected,
        $Actual
      >
    : never
  : never

/**
 * Equiv + NoExcess kind - checks mutual assignability AND no excess properties.
 *
 * Parameters: [$Expected, $Actual, $Negated?]
 * Returns: never if types are equivalent with no excess properties
 *
 * Combines two checks:
 * 1. Expected and Actual are mutually assignable (equivalent)
 * 2. Actual has no object keys beyond those in Expected
 */
// dprint-ignore
export interface EquivNoExcessKind extends AssertionKind {
  expectationConstraint: unknown
  parameters: [$Expected: unknown, $Actual: unknown, $Negated?: boolean]
  return:
    this['parameters'][2] extends true
      ? InvertEquivNoExcessResult<this['parameters'][0], this['parameters'][1]>
      : Relation.GetRelation<this['parameters'][0], this['parameters'][1]> extends Relation.equivalent
        ? CheckNoExcess<this['parameters'][0], this['parameters'][1]>
        : StaticErrorAssertion<
            'EXPECTED and ACTUAL are not equivalent',
            this['parameters'][0],
            this['parameters'][1]
          >
}

type InvertEquivNoExcessResult<$Expected, $Actual> = Relation.GetRelation<$Expected, $Actual> extends Relation.equivalent
  ? [keyof Obj.SubtractShallow<$Actual, $Expected>] extends [never]
    ? StaticErrorAssertion<
        'ACTUAL is equivalent to EXPECTED with no excess but should not',
        $Expected,
        $Actual
      >
    : never
  : never
