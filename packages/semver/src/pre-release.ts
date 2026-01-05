import { Schema as S } from 'effect'
import { BuildIds, PrereleaseIds } from './identifiers.js'

/**
 * A semantic version with pre-release identifiers.
 */
export class PreRelease extends S.TaggedClass<PreRelease>()('SemverPreRelease', {
  major: S.Number.pipe(S.int(), S.nonNegative()),
  minor: S.Number.pipe(S.int(), S.nonNegative()),
  patch: S.Number.pipe(S.int(), S.nonNegative()),
  prerelease: PrereleaseIds,
  build: S.optional(BuildIds),
}, {
  identifier: 'PreRelease',
  title: 'Pre-Release',
  description: 'A semantic version with pre-release identifiers',
}) {
  static is = S.is(PreRelease)

  /** String representation for JS coercion (template literals, logging) */
  override toString(): string {
    const prereleaseStr = `-${this.prerelease.join('.')}`
    const buildStr = this.build?.length ? `+${this.build.join('.')}` : ''
    return `${this.major}.${this.minor}.${this.patch}${prereleaseStr}${buildStr}`
  }
}
