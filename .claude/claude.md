# CLAUDE.md

@issue.md
@../CONTRIBUTING.md

## Import Convention (CRITICAL)

**Cross-package imports MUST use namespace (root path), never barrel (`/__`):**

```typescript
// ✅ Correct - namespace import from root
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'

// ❌ Incorrect - barrel imports
import { Git } from '@kitz/git/__'
import * as Semver from '@kitz/semver/__'
```

When using namespace imports, access members via the namespace:
- Service tag: `Git.Git`
- Error type: `Git.GitError`
- Functions: `Semver.fromString()`

**Exception**: The `kitz` aggregator package re-exports barrels to compose the umbrella.

## Backwards Compatibility

**Default stance: Breaking changes are acceptable.**

This is a pre-1.0 library under active development. Unless explicitly instructed otherwise for a specific task, you should:

- Prioritize clean design over backwards compatibility
- Make breaking changes freely when they improve the API
- Not worry about migration paths or deprecation warnings
- Focus on the best long-term solution

Backwards compatibility will ONLY be considered when explicitly mentioned in the task requirements.
