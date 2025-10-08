import { S } from '#deps/effect'
import type { Ts } from '#ts'
import type { Analyzer } from './codec-string/$.js'
import type * as FsLoc from './fs-loc.js'
import type * as Groups from './groups/$$.js'

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
 * processPath(AbsFileClass.decodeSync('/path/file.txt'))
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
  export type RelFile = Input<FsLoc.RelFile>

  /**
   * Input that accepts a relative directory path.
   */
  export type RelDir = Input<FsLoc.RelDir>

  /**
   * Input that accepts an absolute file path.
   */
  export type AbsFile = Input<FsLoc.AbsFile>

  /**
   * Input that accepts an absolute directory path.
   */
  export type AbsDir = Input<FsLoc.AbsDir>

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
export type InputOrError<$FsLoc extends FsLoc.FsLoc = FsLoc.FsLoc> = Input<$FsLoc> | Ts.StaticErrorAny

/**
 * Validates an input against a target FsLoc type.
 *
 * This type performs compile-time validation when given string literals,
 * ensuring they match the expected path format (absolute/relative, file/directory).
 * If validation fails, it returns a StaticError with helpful hints.
 *
 * @example
 * ```ts
 * // Success: string literal matches target type
 * type Valid = Validate<'/path/file.txt', AbsFileClass>
 * // Result: '/path/file.txt'
 *
 * // Error: string literal doesn't match target type
 * type Invalid = Validate<'./relative.txt', AbsFileClass>
 * // Result: StaticError<'Must be an absolute file path', ...>
 * ```
 */
// dprint-ignore
export type Guard<
  $Input extends Input,
  $TargetFsLoc extends FsLoc.FsLoc,
  ___ActualFsLoc extends FsLoc.FsLoc = $Input extends string ? FromAnalysis<Analyzer.Analyze<$Input>> : $Input,
> =
  string extends $Input
    ? Ts.Simplify<Ts.StaticError<'When giving a string, it must be a literal so that it can be statically parsed.'>> :
  ___ActualFsLoc['_tag'] extends $TargetFsLoc['_tag']
    ? $Input :
  // else
    Ts.Simplify<Ts.StaticError<GetValidationError<$TargetFsLoc['_tag']>['message'], { received: $Input  }, GetValidationError<$TargetFsLoc['_tag']>['hint']>>

export type FromAnalysis<$Analysis extends Analyzer.Analysis> = $Analysis extends { _tag: 'file'; pathType: 'absolute' }
  ? FsLoc.AbsFile
  : $Analysis extends { _tag: 'file'; pathType: 'relative' } ? FsLoc.RelFile
  : $Analysis extends { _tag: 'dir'; pathType: 'absolute' } ? FsLoc.AbsDir
  : $Analysis extends { _tag: 'dir'; pathType: 'relative' } ? FsLoc.RelDir
  : never

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
export namespace Guard {
  /**
   * Validates that input is a relative file path.
   * Relative files must not start with `/` and must have an extension.
   */
  export type RelFile<$Input extends Input> = Guard<$Input, FsLoc.RelFile>

  /**
   * Validates that input is a relative directory path.
   * Relative directories must not start with `/` and should end with `/` or have no extension.
   */
  export type RelDir<$Input extends Input> = Guard<$Input, FsLoc.RelDir>

  /**
   * Validates that input is an absolute file path.
   * Absolute files must start with `/` and have an extension.
   */
  export type AbsFile<$Input extends Input> = Guard<$Input, FsLoc.AbsFile>

  /**
   * Validates that input is an absolute directory path.
   * Absolute directories must start with `/` and should end with `/` or have no extension.
   */
  export type AbsDir<$Input extends Input> = Guard<$Input, FsLoc.AbsDir>

  /**
   * Validates that input is a file path (either absolute or relative).
   */
  export type File<$Input extends Input> = Guard<$Input, Groups.File.File>

  /**
   * Validates that input is a directory path (either absolute or relative).
   */
  export type Dir<$Input extends Input> = Guard<$Input, Groups.Dir.Dir>

  /**
   * Validates that input is a relative path (either file or directory).
   */
  export type Rel<$Input extends Input> = Guard<$Input, Groups.Rel.Rel>

  /**
   * Validates that input is an absolute path (either file or directory).
   */
  export type Abs<$Input extends Input> = Guard<$Input, Groups.Abs.Abs>

  /**
   * Accept any FsLoc type OR any string without validation.
   */
  export type Any<$Input> = $Input extends FsLoc.FsLoc ? $Input
    : $Input extends string ? $Input
    : Ts.StaticError<'Must be a FsLoc type or string', { received: $Input }>
}

// dprint-ignore
export type normalize<$Input extends InputOrError> =
  $Input extends Ts.StaticErrorAny    ? never :
  $Input extends string               ? FromAnalysis<Analyzer.Analyze<$Input>> :
                                        $Input

export const normalize = <$schema extends S.Schema.All>(schema: $schema) => {
  const decodeSync = S.decodeSync(schema as any)

  return <const $input extends Input<$schema['Type']>>(
    input: Guard<$input, $schema['Type']>,
  ): normalize<$input> => {
    if (typeof input === 'string') {
      return decodeSync(input) as any
    }
    return input as any
  }
}

export const normalizeDynamic = <$schema extends S.Schema.All>(schema: $schema) => {
  const decodeSync = S.decodeSync(schema as any)

  return <const $input extends InputOrError<$schema['Type']>>(
    input: $input,
  ): normalize<$input> => {
    if (typeof input === 'string') {
      return decodeSync(input) as any
    }
    return input as any
  }
}
