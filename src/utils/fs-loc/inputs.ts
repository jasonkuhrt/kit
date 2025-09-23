/**
 * Input validation types for FsLoc APIs.
 *
 * These types allow APIs to accept either strongly-typed FsLoc objects
 * or string literals that are validated at compile time.
 *
 * @module
 */

import type { Ts } from '#ts'
import type { Analyzer } from './analyzer/$.js'
import * as FsLoc from './fs-loc.js'
import type * as Groups from './groups/$$.js'

/**
 * Accept RelFile type OR string literal that must be a relative file.
 */
export type RelFile<T> = T extends FsLoc.RelFile.RelFile ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'file'; isPathRelative: true } ? T
        : Ts.StaticError<
          'Must be a relative file path',
          { received: T; hint: 'Relative files must not start with / and must have an extension' }
        >
    )
  : Ts.StaticError<'Must be a RelFile or string', { received: T }>

/**
 * Accept RelDir type OR string literal that must be a relative directory.
 */
export type RelDir<T> = T extends FsLoc.RelDir.RelDir ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'dir'; isPathRelative: true } ? T
        : Ts.StaticError<
          'Must be a relative directory path',
          { received: T; hint: 'Relative directories must not start with / or have an extensions' }
        >
    )
  : Ts.StaticError<'Must be a RelDir or string', { received: T }>

/**
 * Accept AbsFile type OR string literal that must be an absolute file.
 */
export type AbsFile<T> = T extends FsLoc.AbsFile.AbsFile ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'file'; isPathAbsolute: true } ? T
        : Ts.StaticError<
          'Must be an absolute file path',
          { received: T; hint: 'Absolute files must start with / and have an extension' }
        >
    )
  : Ts.StaticError<'Must be an AbsFile or string', { received: T }>

/**
 * Accept AbsDir type OR string literal that must be an absolute directory.
 */
export type AbsDir<T> = T extends FsLoc.AbsDir.AbsDir ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'dir'; isPathAbsolute: true } ? T
        : Ts.StaticError<
          'Must be an absolute directory path',
          { received: T; hint: 'Absolute directories must start with / and not have an extension' }
        >
    )
  : Ts.StaticError<'Must be an AbsDir or string', { received: T }>

/**
 * Accept any File type OR string literal that must be a file.
 */
export type File<T> = T extends Groups.File.File ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'file' } ? T
        : Ts.StaticError<'Must be a file path', { received: T; hint: 'Files must have an extension' }>
    )
  : Ts.StaticError<'Must be a File or string', { received: T }>

/**
 * Accept any Dir type OR string literal that must be a directory.
 */
export type Dir<T> = T extends Groups.Dir.Dir ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'dir' } ? T
        : Ts.StaticError<
          'Must be a directory path',
          { received: T; hint: 'Directories should end with / or have no extension' }
        >
    )
  : Ts.StaticError<'Must be a Dir or string', { received: T }>

/**
 * Accept any relative path OR string literal that must be relative.
 */
export type Rel<T> = T extends Groups.Rel.Rel ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { isPathRelative: true } ? T
        : Ts.StaticError<'Must be a relative path', { received: T; hint: 'Relative paths must not start with /' }>
    )
  : Ts.StaticError<'Must be a relative path or RelFile/RelDir', { received: T }>

/**
 * Accept any absolute path OR string literal that must be absolute.
 */
export type Abs<T> = T extends Groups.Abs.Abs ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { isPathAbsolute: true } ? T
        : Ts.StaticError<'Must be an absolute path', { received: T; hint: 'Absolute paths must start with /' }>
    )
  : Ts.StaticError<'Must be an absolute path or AbsFile/AbsDir', { received: T }>

/**
 * Accept any FsLoc type OR any string.
 */
export type Any<T> = T extends FsLoc.FsLoc ? T
  : T extends string ? T
  : Ts.StaticError<'Must be a FsLoc type or string', { received: T }>

/**
 * Helper functions to normalize validated inputs to FsLoc types at runtime.
 */
export const normalize = {
  file: <T>(input: File<T>): Groups.File.File =>
    typeof input === 'string' ? FsLoc.decodeSync(input) as Groups.File.File : input as Groups.File.File,

  dir: <T>(input: Dir<T>): Groups.Dir.Dir =>
    typeof input === 'string' ? FsLoc.decodeSync(input) as Groups.Dir.Dir : input as Groups.Dir.Dir,

  relFile: <T>(input: RelFile<T>): FsLoc.RelFile.RelFile =>
    typeof input === 'string' ? FsLoc.RelFile.decodeSync(input) : input as FsLoc.RelFile.RelFile,

  relDir: <T>(input: RelDir<T>): FsLoc.RelDir.RelDir =>
    typeof input === 'string' ? FsLoc.RelDir.decodeSync(input) : input as FsLoc.RelDir.RelDir,

  absFile: <T>(input: AbsFile<T>): FsLoc.AbsFile.AbsFile =>
    typeof input === 'string' ? FsLoc.AbsFile.decodeSync(input) : input as FsLoc.AbsFile.AbsFile,

  absDir: <T>(input: AbsDir<T>): FsLoc.AbsDir.AbsDir =>
    typeof input === 'string' ? FsLoc.AbsDir.decodeSync(input) : input as FsLoc.AbsDir.AbsDir,

  rel: <T>(input: Rel<T>): Groups.Rel.Rel =>
    typeof input === 'string' ? FsLoc.decodeSync(input) as Groups.Rel.Rel : input as Groups.Rel.Rel,

  abs: <T>(input: Abs<T>): Groups.Abs.Abs =>
    typeof input === 'string' ? FsLoc.decodeSync(input) as Groups.Abs.Abs : input as Groups.Abs.Abs,

  any: <T>(input: Any<T>): FsLoc.FsLoc => typeof input === 'string' ? FsLoc.decodeSync(input) : input as FsLoc.FsLoc,
}
