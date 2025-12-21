import { Version as VltVersion } from '@vltpkg/semver'
import { Schema as S } from 'effect'

export class OfficialRelease extends S.TaggedClass<OfficialRelease>('SemverOfficialRelease')('SemverOfficialRelease', {
  major: S.Number,
  minor: S.Number,
  patch: S.Number,
  build: S.optional(S.Array(S.String)),
  version: S.instanceOf(VltVersion),
}, {
  identifier: 'OfficialRelease',
  title: 'Official Release',
  description: 'A semantic version that is an official release (no pre-release identifiers)',
}) {
  static is = S.is(OfficialRelease)
}
