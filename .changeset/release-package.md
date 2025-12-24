---
"@kitz/release": minor
"@kitz/git": minor
"@kitz/changelog": minor
"@kitz/npm-registry": minor
"@kitz/conventional-commits": minor
---

Add @kitz/release package for commit-driven releases

- `planStable()` - Plans stable releases based on conventional commits
- `planPreview()` - Plans canary releases (`${version}-next.${n}`)
- `planPr()` - Plans PR-specific releases (`0.0.0-pr.${prNum}.${n}.${sha}`)
- `apply()` - Publishes packages and creates git tags
- Automatic cascade detection for dependent packages
- Version calculation from git tags

Supporting packages:

- `@kitz/git` - Git service with tag/commit operations
- `@kitz/changelog` - Changelog generation scaffold
- `@kitz/npm-registry` - NPM registry operations scaffold
