// Config
export { ConfigError, defineConfig, load as loadConfig, ReleaseConfig } from './config.js'

// Discovery
export { discover, DiscoveryError, type Package, type PackageMap, resolvePackages, toPackageMap } from './discovery.js'

// Version
export {
  aggregateByPackage,
  bumpFromType,
  type BumpType,
  calculateNextVersion,
  type CommitImpact,
  extractImpacts,
  findLatestTagVersion,
  maxBump,
} from './version.js'

// Cascade
export { buildDependencyGraph, type DependencyGraph, detectCascades } from './cascade.js'

// Publish
export {
  injectVersion,
  npmPublish,
  publishAll,
  PublishError,
  type PublishOptions,
  publishPackage,
  type ReleaseInfo,
  restoreVersion,
} from './publish.js'

// Preflight
export {
  checkGitClean,
  checkGitRemote,
  checkNpmAuth,
  checkTagsNotExist,
  PreflightError,
  type PreflightOptions,
  type PreflightResult,
  runPreflight,
} from './preflight.js'

// State
export {
  type ApplyState,
  type ApplyStep,
  canResume,
  createInitialState,
  DEFAULT_STATE_FILE,
  deleteState,
  getPendingSteps,
  hasFailed,
  isComplete,
  markCompleted,
  markFailed,
  markPartial,
  readState,
  StateError,
  type StepStatus,
  summarizeState,
  updateStep,
  writeState,
} from './state.js'

// Release
export {
  apply,
  type ApplyOptions,
  type PlanContext,
  type PlannedRelease,
  planPr,
  planPreview,
  planStable,
  ReleaseError,
  type ReleaseOptions,
  type ReleasePlan,
  type ReleaseResult,
} from './release.js'
