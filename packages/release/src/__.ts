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

// Workflow
export {
  DEFAULT_WORKFLOW_DB,
  executeWorkflow,
  executeWorkflowObservable,
  makeWorkflowRuntime,
  type ObservableWorkflowResult,
  ReleaseWorkflow,
  ReleaseWorkflowError,
  toWorkflowPayload,
  WorkflowPreflightError,
  WorkflowPublishError,
  WorkflowTagError,
} from './workflow.js'

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

// Monotonic Validation
export {
  type AuditResult,
  type AuditViolation,
  auditPackageHistory,
  getPackageTagInfos,
  getTagSha,
  isAncestor,
  type TagInfo,
  validateAdjacent,
  type ValidationResult,
  type Violation,
} from './monotonic.js'

// History Commands
export {
  audit as historyAudit,
  type AuditOptions as HistoryAuditOptions,
  formatAuditResult,
  formatAuditResults,
  formatMonotonicViolationError,
  formatSetResult,
  formatTagExistsError,
  HistoryError,
  MonotonicViolationError,
  set as historySet,
  type SetOptions as HistorySetOptions,
  type SetResult as HistorySetResult,
  TagExistsError,
} from './history.js'
