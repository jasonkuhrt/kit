# Zed oxlint LSP Configuration Investigation

**Date**: 2024-12-30
**Status**: Unresolved - needs further testing after Zed restart

## Problem

`no-unused-expressions` lint errors appear in Zed IDE for tagged template literals like:

```typescript
mid`${Tex.Glyph.box.edge.horizontal}...`
```

These errors do NOT appear when running oxlint via CLI.

## Findings

### CLI Works Correctly

```bash
pnpm turbo check:lint --filter=@kitz/flo
# Result: 0 errors (only warnings about ansis named exports)
```

The CLI correctly reads `oxlint.json` and does not flag `no-unused-expressions`.

### Inline Directives Work

Both of these suppress the error in the IDE:

```typescript
// eslint-disable-next-line no-unused-expressions

/* oxlint-disable no-unused-expressions */
```

### Config File Not Being Read by LSP

Added to `oxlint.json`:

```json
{
  "rules": {
    "eslint/no-unused-expressions": "off",
    "no-unused-expressions": "off"
  }
}
```

This is respected by CLI but NOT by the IDE LSP.

### Original Zed Config (Wrong)

```json
"lsp": {
  "oxc": {
    "settings": {
      "config_path": "./oxlint.json",
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  }
}
```

**Issues discovered:**

1. LSP name should be `oxlint`, not `oxc`
2. Setting should be `configPath` (camelCase), not `config_path`
3. Structure needs `initialization_options.settings` nesting
4. `rules` is not a valid LSP setting - rules must be in config file

### Corrected Zed Config

```json
"lsp": {
  "oxlint": {
    "initialization_options": {
      "settings": {
        "configPath": "./oxlint.json"
      }
    }
  }
}
```

### Untested

- Whether `configPath` resolves relative to workspace root or settings file
- Whether Zed restart (vs just LSP restart) is needed
- Whether the corrected config actually works

## References

- [oxc-zed extension](https://github.com/oxc-project/oxc-zed)
- [oxc language server options](https://github.com/oxc-project/oxc/tree/main/crates/oxc_language_server)
- [oxlint no-unused-expressions rule](https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-unused-expressions)
- [oxlint config file reference](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html)

## Available LSP Options

From oxc language server docs:

| Option                    | Type            | Default  | Purpose                                              |
| ------------------------- | --------------- | -------- | ---------------------------------------------------- |
| `configPath`              | string/null     | null     | Path to oxlint config; disables nested config if set |
| `tsConfigPath`            | string/null     | null     | Path to tsconfig for import alias resolution         |
| `unusedDisableDirectives` | allow/warn/deny | allow    | Report unused disable comments                       |
| `typeAware`               | boolean         | false    | Enable type-aware linting                            |
| `disableNestedConfig`     | boolean         | false    | Only use configPath, ignore nested configs           |
| `fixKind`                 | string          | safe_fix | Level of auto-fixes                                  |
| `run`                     | onSave/onType   | onType   | When linting occurs                                  |

## Next Steps

1. Restart Zed completely (not just LSP restart)
2. Verify `configPath` resolves correctly relative to workspace
3. If still failing, try absolute path for `configPath`
4. Consider filing bug report with Zed or oxc-zed extension
