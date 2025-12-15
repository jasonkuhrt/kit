import { Assert } from '#assert'
import type { Path } from '#fs/fs'
import { Option } from 'effect'
import type { $Abs } from '../$Abs/_.js'
import type { $Dir } from '../$Dir/_.js'
import type { $Rel } from '../$Rel/_.js'
import type { AbsDir } from '../AbsDir/_.js'
import type { AbsFile } from '../AbsFile/_.js'
import type { RelDir } from '../RelDir/_.js'
import type { RelFile } from '../RelFile/_.js'
import {
  getSharedBase,
  isAncestorOf,
  isDescendantOf,
  type MatchingDirGroup,
  type MatchingTypeGroup,
  type MatchingTypeGroupForDir,
  type SharedBase,
} from './relationship.js'

const A = Assert.Type.exact

// ============================================================================
// MatchingTypeGroup type utility
// ============================================================================

// Relative paths map to $Rel
A.ofAs<MatchingTypeGroup<RelDir>>().onAs<$Rel>()
A.ofAs<MatchingTypeGroup<RelFile>>().onAs<$Rel>()

// Absolute paths map to $Abs
A.ofAs<MatchingTypeGroup<AbsDir>>().onAs<$Abs>()
A.ofAs<MatchingTypeGroup<AbsFile>>().onAs<$Abs>()

// Union distributes correctly
A.ofAs<MatchingTypeGroup<Path>>().onAs<$Rel | $Abs>()

// ============================================================================
// SharedBase type utility
// ============================================================================

// Relative paths produce RelDir
A.ofAs<SharedBase<RelDir>>().onAs<RelDir>()
A.ofAs<SharedBase<RelFile>>().onAs<RelDir>()

// Absolute paths produce AbsDir
A.ofAs<SharedBase<AbsDir>>().onAs<AbsDir>()
A.ofAs<SharedBase<AbsFile>>().onAs<AbsDir>()

// Union distributes correctly
A.ofAs<SharedBase<Path>>().onAs<RelDir | AbsDir>()

// ============================================================================
// Function return types
// ============================================================================

declare const relDir: RelDir
declare const relFile: RelFile
declare const absDir: AbsDir
declare const absFile: AbsFile
declare const path: Path
declare const dir: $Dir

// getSharedBase return types
A.ofAs<Option.Option<RelDir>>().on(getSharedBase(relDir, relDir))
A.ofAs<Option.Option<RelDir>>().on(getSharedBase(relFile, relFile))
A.ofAs<Option.Option<AbsDir>>().on(getSharedBase(absDir, absDir))
A.ofAs<Option.Option<AbsDir>>().on(getSharedBase(absFile, absFile))
A.ofAs<Option.Option<RelDir | AbsDir>>().on(getSharedBase(path, path))

// isDescendantOf accepts directory parents only
A.ofAs<boolean>().on(isDescendantOf(relDir, relDir))
A.ofAs<boolean>().on(isDescendantOf(absDir, absDir))
A.ofAs<boolean>().on(isDescendantOf(path, dir)) // path as child, dir as parent

// ============================================================================
// Type errors for mismatched groups
// ============================================================================

// @ts-expect-error - cannot mix rel and abs
getSharedBase(relDir, absDir)

// @ts-expect-error - cannot mix rel and abs
isDescendantOf(relDir, absDir)

// @ts-expect-error - cannot mix abs and rel
getSharedBase(absFile, relFile)

// ============================================================================
// MatchingDirGroup type utility
// ============================================================================

// All paths map to their matching directory type
A.ofAs<MatchingDirGroup<RelDir>>().onAs<RelDir>()
A.ofAs<MatchingDirGroup<RelFile>>().onAs<RelDir>()
A.ofAs<MatchingDirGroup<AbsDir>>().onAs<AbsDir>()
A.ofAs<MatchingDirGroup<AbsFile>>().onAs<AbsDir>()

// Union distributes correctly
A.ofAs<MatchingDirGroup<Path>>().onAs<RelDir | AbsDir>()

// ============================================================================
// MatchingTypeGroupForDir type utility
// ============================================================================

// Directories map to their matching type group
A.ofAs<MatchingTypeGroupForDir<RelDir>>().onAs<$Rel>()
A.ofAs<MatchingTypeGroupForDir<AbsDir>>().onAs<$Abs>()

// Union distributes correctly
A.ofAs<MatchingTypeGroupForDir<$Dir>>().onAs<$Rel | $Abs>()

// ============================================================================
// isDescendantOf accepts directory parent only
// ============================================================================

// Valid: file descends from dir
A.ofAs<boolean>().on(isDescendantOf(relFile, relDir))
A.ofAs<boolean>().on(isDescendantOf(absFile, absDir))

// Valid: dir descends from dir
A.ofAs<boolean>().on(isDescendantOf(relDir, relDir))
A.ofAs<boolean>().on(isDescendantOf(absDir, absDir))

// @ts-expect-error - parent cannot be a file (rel)
isDescendantOf(relDir, relFile)

// @ts-expect-error - parent cannot be a file (abs)
isDescendantOf(absDir, absFile)

// ============================================================================
// isAncestorOf only accepts directory as first param
// ============================================================================

// Valid: dir is ancestor of file
A.ofAs<boolean>().on(isAncestorOf(relDir, relFile))
A.ofAs<boolean>().on(isAncestorOf(absDir, absFile))

// Valid: dir is ancestor of dir
A.ofAs<boolean>().on(isAncestorOf(relDir, relDir))
A.ofAs<boolean>().on(isAncestorOf(absDir, absDir))

// @ts-expect-error - first param must be directory (rel)
isAncestorOf(relFile, relDir)

// @ts-expect-error - first param must be directory (abs)
isAncestorOf(absFile, absDir)
