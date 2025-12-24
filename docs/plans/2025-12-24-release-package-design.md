# @kitz/release Package Design

A full rewrite of [dripip](https://github.com/prisma-labs/dripip) for the kitz monorepo, providing opinionated CLI tooling for continuous delivery of npm packages.

## Goals

- Feature parity with dripip (all three release types)
- Effect-native throughout
- Schema classes with type-level parsing where applicable
- Single-package repos (monorepo support is a separate effort)

## Package Structure

```
packages/
├── git/                    # @kitz/git
├── conventional-commits/   # @kitz/conventional-commits
├── changelog/              # @kitz/changelog
├── npm-registry/           # @kitz/npm-registry
├── release/                # @kitz/release
└── (conf/)                 # @kitz/conf enhancements
```

### Dependency Graph

```
@kitz/release
├── @kitz/git
├── @kitz/conventional-commits
├── @kitz/changelog
├── @kitz/npm-registry
├── @kitz/semver (existing)
├── @kitz/pkg (existing)
├── @kitz/conf (existing, enhanced)
└── @kitz/oak (existing, for CLI)

@kitz/changelog
├── @kitz/conventional-commits
└── @kitz/semver

@kitz/npm-registry
└── @vltpkg/registry-client (external)
```

## Package Descriptions

### @kitz/git

Effect-wrapped git operations. Built on `simple-git` or `isomorphic-git`.

- Repository info (remotes, branches, tags, HEAD)
- Commit history traversal
- Tag management (create, delete, list)
- Working tree status (clean/dirty)

### @kitz/conventional-commits

Schema classes and type-level parser for the [Conventional Commits](https://www.conventionalcommits.org/) specification.

```typescript
// Schema class with .make() taking struct
const commit = CC.ConventionalCommit.make({
  type: 'feat',
  scope: 'cli',
  message: 'add dry-run flag',
  breaking: false,
})

// Parse from string (runtime)
const parsed = CC.parse('feat(cli): add dry-run flag')
//    ^? Effect<ConventionalCommit, ParseError>

// Type-level parse (compile-time)
type Parsed = CC.Parse<'feat(cli): add dry-run flag'>
//   ^? { type: 'feat'; scope: 'cli'; message: 'add dry-run flag'; breaking: false }
```

### @kitz/changelog

Generate changelogs from conventional commits, render to various formats.

```typescript
// Generate from commits
const log = Changelog.fromCommits(commits)

// Render to markdown
const md = Changelog.toMarkdown(log)

// Render to terminal (colored)
const terminal = Changelog.toTerminal(log)
```

Output format:

```markdown
## 1.2.0

### Features

- **cli**: add dry-run flag (#123)

### Fixes

- **core**: handle empty commit messages (#125)

### Breaking Changes

- **config**: rename `npmTag` to `distTag` (#126)
```

### @kitz/npm-registry

npm registry operations with Effect wrapping.

| Operation      | Implementation              |
| -------------- | --------------------------- |
| Read versions  | `@vltpkg/registry-client`   |
| Read dist-tags | `@vltpkg/registry-client`   |
| Read packument | `@vltpkg/registry-client`   |
| Publish        | Shell out to `npm publish`  |
| Set dist-tag   | Shell out to `npm dist-tag` |

Using @vltpkg/registry-client for reads provides performance (native HTTP + caching) and potential cross-registry support.

### @kitz/release

The main release orchestration package with SDK + CLI.

## SDK Architecture

Three main functions matching dripip's release types:

```typescript
import * as Release from '@kitz/release'

// PR release: 0.0.0-pr.45.3.abc123
Release.pr({ dryRun: false })

// Preview/canary release: 1.2.0-next.4
Release.preview({ dryRun: false, skipNpm: false })

// Stable release: 1.2.0
Release.stable({ dryRun: false, skipNpm: false })
```

All return `Effect<ReleaseResult, ReleaseError, ReleaseContext>`.

### ReleaseContext

Effect service layer:

```typescript
interface ReleaseContext {
  git: Git.Git
  npm: NpmRegistry.Client
  github: GitHub.Client // octokit
  config: Release.Config
  cwd: string
}
```

### ReleaseError

Tagged union of failure modes:

```typescript
type ReleaseError =
  | Git.Error
  | NpmRegistry.PublishError
  | GitHub.ApiError
  | Config.LoadError
  | ValidationError
```

## CLI Architecture

File-based command dispatch using `@kitz/cli`:

```
release/src/cli/
├── commands/
│   ├── pr.ts              # release pr
│   ├── preview.ts         # release preview
│   ├── stable.ts          # release stable
│   ├── preview-or-pr.ts   # release preview-or-pr
│   ├── log.ts             # release log
│   └── $default.ts        # release (show help)
└── main.ts                # dispatch(commandsDirPath)
```

Each command uses `@kitz/oak` for argument parsing.

### CLI Commands

```
release <command> [options]

Commands:
  release pr              PR release (0.0.0-pr.<num>.<n>.<sha>)
  release preview         Preview/canary release (<next>-next.<n>)
  release stable          Stable release (<next>)
  release preview-or-pr   Auto-detect context and run appropriate release
  release log             Show changelog since last release

Options:
  -d, --dry-run           Output what would happen without publishing
  -j, --json              Format output as JSON
  --skip-npm              Skip npm publish step
  --trunk <branch>        Override trunk branch detection
  -c, --config <path>     Path to config file
```

## Configuration

Optional config file with CLI flag overrides:

```typescript
// release.config.ts
import { defineConfig } from '@kitz/release'

export default defineConfig({
  trunk: 'main',
  npmTag: 'latest',
  previewTag: 'next',
  skipNpm: false,
})
```

Uses `@kitz/conf` with planned enhancements for JSON/YAML support (cosmiconfig-style search).

## Version Management

Preserve dripip's novel approach - keep version out of git history:

1. `package.json` stores placeholder: `"version": "0.0.0-dripip"`
2. Version state lives in git tags (e.g., `v1.2.0`, `next`)
3. At publish time:
   - Set real version in package.json
   - Run `npm publish`
   - Restore placeholder version (even on failure)

Version calculation:

- Analyze commits since last tag using `@kitz/conventional-commits`
- Determine bump: `fix` → patch, `feat` → minor, `BREAKING CHANGE` → major
- Apply to current version via `@kitz/semver`

## Release Notes

Published to GitHub Releases:

**Preview releases:**

- Publish to `next` tag
- Accumulates changes since last stable
- Replaced with each preview release

**Stable releases:**

- Publish to version tag (e.g., `v1.2.0`)
- Contains all changes since previous stable
- Clears `next` release notes

## Version Formats

| Release Type | Version Pattern               | Example                | Dist-tag |
| ------------ | ----------------------------- | ---------------------- | -------- |
| PR           | `0.0.0-pr.<pr_num>.<n>.<sha>` | `0.0.0-pr.45.3.abc123` | `pr.45`  |
| Preview      | `<next>-next.<n>`             | `1.2.0-next.4`         | `next`   |
| Stable       | `<next>`                      | `1.2.0`                | `latest` |

## Key Design Decisions

| Decision        | Choice                        | Rationale                                          |
| --------------- | ----------------------------- | -------------------------------------------------- |
| Platform        | GitHub-only                   | Avoid over-abstraction without real use cases      |
| Registry        | npm registry only             | Primary use case, cross-registry via @vltpkg later |
| Package manager | npm CLI for publish           | Works universally, handles auth                    |
| Registry reads  | @vltpkg/registry-client       | Performance, caching, potential cross-registry     |
| Config          | Optional file + CLI overrides | Zero-config by default, flexibility when needed    |
| Version storage | Git tags, not package.json    | Keeps git history clean                            |

## @kitz/conf Enhancements

Parallel enhancement to support:

- JSON loader (via `@kitz/json`)
- YAML loader (new dependency or `@kitz/yaml`)
- Cosmiconfig-style search: `release.config.ts` → `release.config.js` → `release.json` → `package.json#release`

## Out of Scope

- Monorepo support (separate effort)
- Non-GitHub platforms (GitLab, Bitbucket)
- Non-npm registries (handled via @vltpkg later if needed)
