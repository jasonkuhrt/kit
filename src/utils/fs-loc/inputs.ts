import type { Ts } from '#ts'
import { Schema as S } from 'effect'
import type { Analyzer } from './analyzer/$.js'
import * as FsLoc from './fs-loc.js'
import * as Groups from './groups/$$.js'

/**
 * Input type for FsLoc APIs that accepts either a FsLoc type or a string.
 *
 * When a string is provided, it will be validated at compile time if it's a literal,
 * or at runtime if it's a dynamic value.
 *
 * @example
 * ```ts
 * function processPath<T extends Input>(path: T) { ... }
 *
 * // Can accept FsLoc types
 * processPath(FsLoc.AbsFile.decodeSync('/path/file.txt'))
 *
 * // Can accept string literals
 * processPath('/path/file.txt')
 * processPath('./relative/path/')
 * ```
 */
export type Input<$FsLoc extends FsLoc.FsLoc = FsLoc.FsLoc> = $FsLoc | string

/**
 * Namespace containing type aliases for Input types.
 * Provides convenient shortcuts for common FsLoc input constraints.
 */
export namespace Input {
  /**
   * Input that accepts a relative file path.
   */
  export type RelFile = Input<FsLoc.RelFile.RelFile>

  /**
   * Input that accepts a relative directory path.
   */
  export type RelDir = Input<FsLoc.RelDir.RelDir>

  /**
   * Input that accepts an absolute file path.
   */
  export type AbsFile = Input<FsLoc.AbsFile.AbsFile>

  /**
   * Input that accepts an absolute directory path.
   */
  export type AbsDir = Input<FsLoc.AbsDir.AbsDir>

  /**
   * Input that accepts any file path (absolute or relative).
   */
  export type File = Input<Groups.File.File>

  /**
   * Input that accepts any directory path (absolute or relative).
   */
  export type Dir = Input<Groups.Dir.Dir>

  /**
   * Input that accepts any relative path (file or directory).
   */
  export type Rel = Input<Groups.Rel.Rel>

  /**
   * Input that accepts any absolute path (file or directory).
   */
  export type Abs = Input<Groups.Abs.Abs>

  /**
   * Input that accepts any FsLoc type.
   */
  export type Any = Input<FsLoc.FsLoc>
}

/**
 * Extended input type that includes validation errors.
 *
 * This type is used internally by validation functions to handle cases where
 * validation fails at compile time. The StaticError type provides helpful
 * error messages to guide users toward correct path formats.
 */
export type InputValidated<$FsLoc extends FsLoc.FsLoc = FsLoc.FsLoc> = $FsLoc | string | Ts.StaticError

/**
 * Validates an input against a target FsLoc type.
 *
 * This type performs compile-time validation when given string literals,
 * ensuring they match the expected path format (absolute/relative, file/directory).
 * If validation fails, it returns a StaticError with helpful hints.
 *
 * @typeParam $Input - The input to validate (string or FsLoc type)
 * @typeParam $TargetFsLoc - The target FsLoc type to validate against
 *
 * @example
 * ```ts
 * // Success: string literal matches target type
 * type Valid = Validate<'/path/file.txt', FsLoc.AbsFile.AbsFile>
 * // Result: '/path/file.txt'
 *
 * // Error: string literal doesn't match target type
 * type Invalid = Validate<'./relative.txt', FsLoc.AbsFile.AbsFile>
 * // Result: StaticError<'Must be an absolute file path', ...>
 * ```
 */
// dprint-ignore
export type Validate<
  $Input extends Input,
  $TargetFsLoc extends FsLoc.FsLoc,
  ___ActualFsLoc extends FsLoc.FsLoc = normalize<$Input>,
> =
  ___ActualFsLoc['_tag'] extends $TargetFsLoc['_tag']
    ? $Input
    : Ts.StaticError<GetValidationError<$TargetFsLoc['_tag']>['message'], { received: $Input; hint: GetValidationError<$TargetFsLoc['_tag']>['hint'] }>

// dprint-ignore
type GetValidationError<$Tag> =
    $Tag extends 'LocRelFile'                         ? { message: 'Must be a relative file path'; hint: 'Relative files must not start with / and must have an extension' }
  : $Tag extends 'LocRelDir'                          ? { message: 'Must be a relative directory path'; hint: 'Relative directories must not start with / and should end with / or have no extension' }
  : $Tag extends 'LocAbsDir'                          ? { message: 'Must be an absolute directory path'; hint: 'Absolute directories must start with / and should end with / or have no extension' }
  : $Tag extends 'LocAbsFile'                         ? { message: 'Must be an absolute file path'; hint: 'Absolute files must start with / and have an extension' }
  : $Tag extends 'LocRelFile' | 'LocRelDir'           ? { message: 'Must be a relative path'; hint: 'Relative paths must not start with /' }
  : $Tag extends 'LocAbsFile' | 'LocAbsDir'           ? { message: 'Must be an absolute path'; hint: 'Absolute paths must start with /' }
  : $Tag extends 'LocRelFile' | 'LocAbsFile'          ? { message: 'Must be a file path'; hint: 'Files must have an extension' }
  : $Tag extends 'LocRelDir' | 'LocAbsDir'            ? { message: 'Must be a directory path'; hint: 'Directories should end with / or have no extension' }
  : { message: 'Must be a valid filesystem location'; hint: 'Check the path format' }

/**
 * Namespace containing type aliases for validating FsLoc inputs.
 * All types accept either the corresponding FsLoc type or a validated string literal.
 */
export namespace Validate {
  /**
   * Validates that input is a relative file path.
   * Relative files must not start with `/` and must have an extension.
   */
  export type RelFile<$Input extends Input> = Validate<$Input, FsLoc.RelFile.RelFile>

  /**
   * Validates that input is a relative directory path.
   * Relative directories must not start with `/` and should end with `/` or have no extension.
   */
  export type RelDir<$Input extends Input> = Validate<$Input, FsLoc.RelDir.RelDir>

  /**
   * Validates that input is an absolute file path.
   * Absolute files must start with `/` and have an extension.
   */
  export type AbsFile<$Input extends Input> = Validate<$Input, FsLoc.AbsFile.AbsFile>

  /**
   * Validates that input is an absolute directory path.
   * Absolute directories must start with `/` and should end with `/` or have no extension.
   */
  export type AbsDir<$Input extends Input> = Validate<$Input, FsLoc.AbsDir.AbsDir>

  /**
   * Validates that input is a file path (either absolute or relative).
   */
  export type File<$Input extends Input> = Validate<$Input, Groups.File.File>

  /**
   * Validates that input is a directory path (either absolute or relative).
   */
  export type Dir<$Input extends Input> = Validate<$Input, Groups.Dir.Dir>

  /**
   * Validates that input is a relative path (either file or directory).
   */
  export type Rel<$Input extends Input> = Validate<$Input, Groups.Rel.Rel>

  /**
   * Validates that input is an absolute path (either file or directory).
   */
  export type Abs<$Input extends Input> = Validate<$Input, Groups.Abs.Abs>

  /**
   * Accept any FsLoc type OR any string without validation.
   */
  export type Any<$Input> = $Input extends FsLoc.FsLoc ? $Input
    : $Input extends string ? $Input
    : Ts.StaticError<'Must be a FsLoc type or string', { received: $Input }>
}

// dprint-ignore
export type normalize<$Input extends InputValidated> =
  $Input extends Ts.StaticError       ? never :
  $Input extends string               ? FsLoc.FromAnalysis<Analyzer.Analyze<$Input>> :
                                        $Input

/**
 * Normalize a validated input to a FsLoc type at runtime.
 *
 * This function converts string inputs to their corresponding FsLoc types
 * using the FsLoc decoder. If the input is already a FsLoc type, it returns
 * it unchanged. If the input is a StaticError (from failed validation),
 * the return type is `never`, allowing TypeScript to properly handle
 * validation failures.
 *
 * @param input - The validated input to normalize
 * @returns The normalized FsLoc type, or never if input is StaticError
 *
 * @example
 * ```ts
 * const path1 = normalize('/path/file.txt')  // Returns AbsFile
 * const path2 = normalize(someAbsFile)       // Returns unchanged
 * ```
 */
export const normalize = <input extends InputValidated>(
  input: input,
): normalize<input> => {
  return (typeof input === 'string' ? FsLoc.decodeSync(input) : input) as any
}

/**
 * Schema namespace for FsLoc input validation.
 * Provides Effect Schema types that accept both strings and FsLoc types.
 */
export namespace Schema {
  /**
   * Schema for relative file inputs.
   * Accepts a string or RelFile FsLoc type.
   */
  export const RelFile = S.Union(
    S.String,
    FsLoc.RelFile.RelFile,
  )

  /**
   * Schema for relative directory inputs.
   * Accepts a string or RelDir FsLoc type.
   */
  export const RelDir = S.Union(
    S.String,
    FsLoc.RelDir.RelDir,
  )

  /**
   * Schema for absolute file inputs.
   * Accepts a string or AbsFile FsLoc type.
   */
  export const AbsFile = S.Union(
    S.String,
    FsLoc.AbsFile.AbsFile,
  )

  /**
   * Schema for absolute directory inputs.
   * Accepts a string or AbsDir FsLoc type.
   */
  export const AbsDir = S.Union(
    S.String,
    FsLoc.AbsDir.AbsDir,
  )

  /**
   * Schema for any file input (absolute or relative).
   * Accepts a string or any File FsLoc type.
   */
  export const File = S.Union(
    S.String,
    Groups.File.File,
  )

  /**
   * Schema for any directory input (absolute or relative).
   * Accepts a string or any Dir FsLoc type.
   */
  export const Dir = S.Union(
    S.String,
    Groups.Dir.Dir,
  )

  /**
   * Schema for any relative input (file or directory).
   * Accepts a string or any Rel FsLoc type.
   */
  export const Rel = S.Union(
    S.String,
    Groups.Rel.Rel,
  )

  /**
   * Schema for any absolute input (file or directory).
   * Accepts a string or any Abs FsLoc type.
   */
  export const Abs = S.Union(
    S.String,
    Groups.Abs.Abs,
  )

  /**
   * Schema for any FsLoc input.
   * Accepts a string or any FsLoc type.
   */
  export const Any = S.Union(
    S.String,
    FsLoc.FsLoc,
  )
}
