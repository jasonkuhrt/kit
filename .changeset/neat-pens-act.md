---
"@kitz/core": major
---

Rename global namespace to KITZ

Unifies library globals under a single `KITZ` namespace:

- `KitLibrarySettings` → `KITZ`
- `KitTraits` → `KITZ.Traits`

**Migration:** Update your declaration merging to use the new namespace:

```typescript
// Before
declare global {
  namespace KitLibrarySettings {
    interface Assert { showDiff: true }
  }
  namespace KitTraits.Display {
    interface Handlers<$Type> { /* ... */ }
  }
}

// After
declare global {
  namespace KITZ {
    interface Assert { showDiff: true }
  }
  namespace KITZ.Traits.Display {
    interface Handlers<$Type> { /* ... */ }
  }
}
```
