import { Version as VltVersion } from '@vltpkg/semver'
import { Schema as S } from 'effect'

export class PreRelease extends S.TaggedClass<PreRelease>('SemverPreRelease')('SemverPreRelease', {
  major: S.Number,
  minor: S.Number,
  patch: S.Number,
  prerelease: S.NonEmptyArray(S.Union(S.String, S.Number)),
  build: S.optional(S.Array(S.String)),
  version: S.instanceOf(VltVersion),
}, {
  identifier: 'PreRelease',
  title: 'Pre-Release',
  description: 'A semantic version with pre-release identifiers',
}) {
  static is = S.is(PreRelease)
}
