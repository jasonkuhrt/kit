# Scoped Activation

## Problem

Can traits be activated only within certain scopes rather than globally? This would provide better control and isolation.

## Use Cases

1. Testing - different trait implementations in tests
2. Feature flags - enable traits conditionally
3. Sandboxing - isolated trait environments
4. Performance - avoid global lookup when not needed

## Possible Solutions

### 1. AsyncContext API (Stage 2 Proposal)

```typescript
const TraitContext = new AsyncContext()

export const withTraits = <T>(traits: TraitRegistry, fn: () => T): T => {
  return TraitContext.run(traits, fn)
}

// In trait implementation
const diff = (a, b) => {
  const traits = TraitContext.get()
  if (!traits?.Range) throw new Error('Range trait not activated')
  return traits.Range.get(a.__brand).diff(a, b)
}

// Usage
withTraits(customTraits, () => {
  Range.diff(r1, r2) // Uses custom traits
})
```

**Pros:**

- True dynamic scoping
- Works with async operations
- No parameter passing needed

**Cons:**

- Not yet standard (Stage 2)
- Requires polyfill
- Runtime overhead

### 2. Function Parameter Injection

```typescript
const withTraits = <T>(fn: (traits: Traits) => T): T => {
  return fn(activeTraits)
}

// Usage
withTraits(({ Range }) => {
  Range.diff(r1, r2)
})
```

**Pros:**

- Works today
- Explicit dependencies
- Type safe

**Cons:**

- Must pass traits through call stack
- Less ergonomic
- Can't use with existing functions

### 3. Zone.js Style Patching

```typescript
const withTraits = (traits, fn) => {
  const original = globalThis.Range
  globalThis.Range = traits.Range
  try {
    return fn()
  } finally {
    globalThis.Range = original
  }
}
```

**Pros:**

- Works with existing code
- No parameter passing

**Cons:**

- Not async safe
- Monkey patching
- Can break with concurrent execution

### 4. Proxy-Based Scoping

```typescript
const TraitScope = {
  current: defaultTraits,

  with(traits, fn) {
    const prev = this.current
    this.current = traits
    try {
      return fn()
    } finally {
      this.current = prev
    }
  },
}

const Range = new Proxy({}, {
  get(_, method) {
    return (...args) => {
      return TraitScope.current.Range[method](...args)
    }
  },
})
```

**Pros:**

- Synchronous scoping
- No global mutation
- Works today

**Cons:**

- Not async safe without AsyncContext
- Proxy overhead
- Complex implementation

### 5. Generator-Based Context

```typescript
function* withTraits(traits) {
  const prev = setCurrentTraits(traits)
  try {
    yield
  } finally {
    setCurrentTraits(prev)
  }
}

// Usage
const scope = withTraits(customTraits)
scope.next() // Enter scope
Range.diff(r1, r2)
scope.next() // Exit scope
```

**Pros:**

- Explicit scope control
- No async issues if used correctly

**Cons:**

- Awkward API
- Easy to misuse
- Not idiomatic

## Hybrid Approach

```typescript
// Default: global traits
Range.diff(r1, r2)

// Scoped: explicit traits
Range.using(customTraits).diff(r1, r2)

// Block scoped (when AsyncContext lands)
withTraits(customTraits, async () => {
  await processRanges()
})
```

## Recommendation

1. Start with global traits for simplicity
2. Add `using()` method for explicit scoping
3. Prepare for AsyncContext when it lands
4. Document that global is default, scoping is advanced feature

The complexity of scoping might not be worth it for initial release.
