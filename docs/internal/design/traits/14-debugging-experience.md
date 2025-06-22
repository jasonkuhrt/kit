# Debugging Experience

## Problem

How do we ensure a good debugging experience when using trait dispatch? The indirection can make stack traces harder to follow and errors less clear.

## Debugging Challenges

### 1. Indirect Stack Traces

```typescript
// Direct call stack
Error: Invalid range
  at NumRange.diff (num/range.ts:23:11)
  at processData (app.ts:45:18)
  at main (app.ts:12:5)

// Trait dispatch stack  
Error: Invalid range
  at dispatch (traits/dispatch.ts:78:15)      // Generic dispatch
  at Proxy.<anonymous> (traits/proxy.ts:12:9)  // Proxy layer
  at RangeOps.diff (traits/range.ts:34:12)    // Trait layer
  at NumRange.diff (num/range.ts:23:11)       // Finally!
  at processData (app.ts:45:18)
  at main (app.ts:12:5)
```

### 2. Generic Error Messages

```typescript
// Direct call - specific error
NumRange.diff(null, range)
// Error: NumRange.diff: first argument must be a NumRange, got null

// Trait dispatch - generic error
Range.diff(null, range)
// Error: dispatch: cannot determine type of null
```

### 3. Type Detection Failures

```typescript
// Mysterious failures when type detection fails
Range.diff(customRange, customRange)
// Error: No implementation found for type: Object
// What is the actual type? Why did detection fail?
```

## Solutions

### 1. Enhanced Stack Traces

```typescript
class TraitError extends Error {
  constructor(
    message: string,
    public trait: string,
    public method: string,
    public implementation?: string,
  ) {
    super(message)
    this.name = 'TraitError'

    // Enhance stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TraitError)
    }
  }

  toString() {
    return `${this.name} in ${this.trait}.${this.method}: ${this.message}
  Trait: ${this.trait}
  Method: ${this.method}
  Implementation: ${this.implementation || 'not found'}`
  }
}

// Usage
throw new TraitError(
  'Invalid arguments',
  'Range',
  'diff',
  'NumRange',
)
```

### 2. Debug Mode

```typescript
// Enable detailed logging
if (process.env.NODE_ENV === 'development') {
  TraitDebug.enable()
}

const diff = (a: unknown, b: unknown) => {
  TraitDebug.log('Range.diff called', { a, b })

  const typeA = detectType(a)
  TraitDebug.log('Detected type', { typeA, a })

  const impl = registry.get(typeA)
  TraitDebug.log('Found implementation', { impl: impl?.name })

  if (!impl) {
    TraitDebug.error('No implementation found', {
      type: typeA,
      availableTypes: [...registry.keys()],
      value: a,
    })
  }

  return impl.diff(a, b)
}
```

### 3. Better Error Messages

```typescript
function createTraitMethod(trait: string, method: string) {
  return (...args: unknown[]) => {
    try {
      const type = detectType(args[0])
      const impl = registry.get(type)

      if (!impl) {
        throw new Error(
          `${trait}.${method}: No implementation for type '${type}'.\n`
            + `Available types: ${[...registry.keys()].join(', ')}\n`
            + `Did you forget to import the implementation?\n`
            + `Example: import '@wollybeard/kit/${type.toLowerCase()}'`,
        )
      }

      return impl[method](...args)
    } catch (error) {
      // Enhance error with context
      if (error instanceof Error) {
        error.message = `${trait}.${method}: ${error.message}`
      }
      throw error
    }
  }
}
```

### 4. Development Tools

```typescript
// Browser extension / VS Code extension
window.__KIT_TRAIT_DEVTOOLS__ = {
  // Show all registered implementations
  getRegistry() {
    return Object.fromEntries(registry)
  },

  // Trace a specific call
  trace(trait: string, method: string, ...args: unknown[]) {
    const events: TraceEvent[] = []

    // Instrument the call
    const result = withTracing(events, () => {
      return traits[trait][method](...args)
    })

    return { result, events }
  },

  // Explain why a type wasn't detected
  explainType(value: unknown) {
    return {
      value,
      constructor: value?.constructor?.name,
      prototype: Object.getPrototypeOf(value),
      brand: value?.__brand,
      detection: detectType(value),
      wouldMatch: [...registry.keys()].filter(type => couldMatch(type, value)),
    }
  },
}
```

### 5. Source Maps for Dispatch

```typescript
// Generate source maps that skip dispatch layers
function createDirectSourceMap(traitCall: string): string {
  // Transform Range.diff(a, b) stack trace to show NumRange.diff directly
  return `//# sourceMappingURL=...skip-dispatch-layers...`
}
```

### 6. Type-Level Debugging

```typescript
// Helper types that give better error messages
type DebugTrait<T> = T extends never
  ? ['Error: No trait implementation found for type', T]
  : T

type DebugMixedTypes<A, B> = A extends B ? B extends A ? A
  : ['Error: Mixed types', A, 'and', B, 'are not compatible']
  : ['Error: Mixed types', A, 'and', B, 'are not compatible']
```

### 7. Runtime Validation

```typescript
const createSafeTraitMethod = <T>(
  trait: string,
  method: string,
  validator?: (args: unknown[]) => void,
) => {
  return (...args: unknown[]) => {
    // Validate arguments
    if (validator) {
      try {
        validator(args)
      } catch (error) {
        throw new TraitError(
          `Invalid arguments: ${error.message}`,
          trait,
          method,
        )
      }
    }

    // Show helpful error for null/undefined
    if (args[0] == null) {
      throw new TraitError(
        `First argument is ${args[0]}. Trait methods require typed values.`,
        trait,
        method,
      )
    }

    return dispatch(trait, method, args)
  }
}
```

## Best Practices

### 1. Clear Type Detection

```typescript
// Make type detection explicit and debuggable
const detectType = (value: unknown): string => {
  // Try brand first
  if (value?.__brand) return value.__brand

  // Try constructor name
  if (value?.constructor?.name) return value.constructor.name

  // Fallback with clear error
  throw new Error(
    `Cannot detect type of value: ${inspect(value)}`,
  )
}
```

### 2. Descriptive Registration

```typescript
// Include metadata during registration
registerTrait('Range', 'NumRange', {
  implementation: NumRangeOps,
  module: '@wollybeard/kit/num',
  source: 'num/range/index.ts',
  types: ['NumRange', 'NumericRange'], // aliases
})
```

### 3. Testing Helpers

```typescript
// Test-specific helpers
export const TraitTest = {
  expectDispatchPath(
    fn: () => void,
    expected: string[],
  ) {
    const calls = recordDispatchCalls(fn)
    expect(calls.map(c => c.path)).toEqual(expected)
  },
}
```

## Recommendation

1. **Default**: Clear error messages with helpful hints
2. **Development**: Debug mode with detailed logging
3. **Production**: Minimal overhead, but traceable errors
4. **Tooling**: Developer tools for inspection
5. **Documentation**: Debugging guide for common issues
