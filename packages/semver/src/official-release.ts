import { Schema as S } from 'effect'
import { BuildIds } from './identifiers.js'

/**
 * A semantic version that is an official release (no pre-release identifiers).
 */
export class OfficialRelease extends S.TaggedClass<OfficialRelease>()('SemverOfficialRelease', {
  major: S.Number.pipe(S.int(), S.nonNegative()),
  minor: S.Number.pipe(S.int(), S.nonNegative()),
  patch: S.Number.pipe(S.int(), S.nonNegative()),
  build: S.optional(BuildIds),
}, {
  identifier: 'OfficialRelease',
  title: 'Official Release',
  description: 'A semantic version that is an official release (no pre-release identifiers)',
}) {
  static is = S.is(OfficialRelease)

  /** String representation for JS coercion (template literals, logging) */
  override toString(): string {
    const buildStr = this.build?.length ? `+${this.build.join('.')}` : ''
    return `${this.major}.${this.minor}.${this.patch}${buildStr}`
  }
}
