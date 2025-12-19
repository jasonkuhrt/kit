# NPM Name Availability Research

Date: 2025-12-19

## Effect-ish Names

| Name | Unscoped | Scoped (@name/core) | Notes |
|------|----------|---------------------|-------|
| **kouka** | ✅ AVAILABLE | ✅ AVAILABLE | Current scope |
| effectful | ❌ taken (v2.0.0) | ❌ taken (@effectful/core v2.0.8) | Active project |
| effective | ❌ taken (v1.0.2) | ✅ AVAILABLE | Unscoped taken |
| effected | ❌ taken (v0.1.1) | ✅ AVAILABLE | Unscoped taken |
| effection | ❌ taken (v3.6.1) | ❌ taken (@effection/core v2.2.3) | Active project |
| effector | ❌ taken (v23.4.4) | - | Popular state manager |
| effex | ❌ taken (v4.0.2) | - | |
| effekt | ❌ taken (v0.12.1) | - | |
| **effectis** | ✅ AVAILABLE | ✅ AVAILABLE | Best candidate |
| **efekt** | ✅ AVAILABLE | ✅ AVAILABLE | Short, available |

## Best Available Options

1. **effectis** - Both scoped and unscoped available
2. **efekt** - Both scoped and unscoped available (shorter)
3. **kouka** - Current choice, both available

## Considerations

- Unscoped names are valuable for the main metapackage entry point
- Scoped names (@name/*) are needed for the monorepo packages
- Having both allows: `import { Arr } from 'name'` and `import { Arr } from '@name/core'`
