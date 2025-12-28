import { Test } from '@kitz/test'
import { Semver } from './_.js'

// ─── Phase Detection ───────────────────────────────────────────────

Test.describe('isPhaseInitial')
  .on(Semver.isPhaseInitial)
  .cases(
    [[Semver.fromString('0.0.1')], true],
    [[Semver.fromString('0.1.0')], true],
    [[Semver.fromString('0.99.99')], true],
    [[Semver.fromString('1.0.0')], false],
    [[Semver.fromString('1.2.3')], false],
    [[Semver.fromString('2.0.0')], false],
  )
  .test()

Test.describe('isPhasePublic')
  .on(Semver.isPhasePublic)
  .cases(
    [[Semver.fromString('0.0.1')], false],
    [[Semver.fromString('0.1.0')], false],
    [[Semver.fromString('0.99.99')], false],
    [[Semver.fromString('1.0.0')], true],
    [[Semver.fromString('1.2.3')], true],
    [[Semver.fromString('2.0.0')], true],
  )
  .test()

// ─── mapBumpForPhase ───────────────────────────────────────────────

Test.describe('mapBumpForPhase > initial phase (0.x.x)')
  .on((bump: Semver.BumpType) => Semver.mapBumpForPhase(Semver.fromString('0.5.0'), bump))
  .cases(
    // In initial phase: major/minor → minor, patch → patch
    [['major'], 'minor'],
    [['minor'], 'minor'],
    [['patch'], 'patch'],
  )
  .test()

Test.describe('mapBumpForPhase > public phase (1.x.x+)')
  .on((bump: Semver.BumpType) => Semver.mapBumpForPhase(Semver.fromString('1.5.0'), bump))
  .cases(
    // In public phase: standard semantics
    [['major'], 'major'],
    [['minor'], 'minor'],
    [['patch'], 'patch'],
  )
  .test()
