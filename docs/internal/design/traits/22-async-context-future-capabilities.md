# AsyncContext Future Capabilities

## Overview

Beyond solving the global registry problem, AsyncContext opens up possibilities for **ambient capabilities** that flow through Kit operations without explicit parameter passing. This document explores potential future enhancements.

## Capability Categories

### 1. Debug and Tracing Context

**Automatic operation tracing** throughout Kit usage:

```typescript
const debugContext = new AsyncContext()

export const withDebug = (options, fn) => {
  return debugContext.run(options, fn)
}

// Kit operations automatically check debug context
export const map = (arr, fn) => {
  const debug = debugContext.get()
  if (debug?.trace) {
    console.log(`Arr.map called with ${arr.length} items`)
  }
  if (debug?.timing) {
    const start = performance.now()
    const result = arr.map(fn)
    console.log(`Arr.map took ${performance.now() - start}ms`)
    return result
  }

  return arr.map(fn)
}

// Usage - all operations automatically trace
await withDebug({ trace: true, timing: true }, async () => {
  Arr.map(items, x => x * 2) // Automatically traced
  Str.capitalize('hello') // Automatically traced
  Range.diff(r1, r2) // Automatically traced

  await processAsync() // Tracing flows through async calls
})
```

### 2. Performance Monitoring Context

**Automatic metrics collection** across all Kit operations:

```typescript
const perfContext = new AsyncContext()

export const withPerformanceMonitoring = (collector, fn) => {
  return perfContext.run(collector, fn)
}

// Kit operations automatically report metrics
const monitoredOperation = (name, operation) => {
  const collector = perfContext.get()
  if (!collector) return operation()

  const start = performance.now()
  const startMemory = process.memoryUsage?.()

  try {
    const result = operation()
    collector.record({
      operation: name,
      duration: performance.now() - start,
      memory: process.memoryUsage?.(),
      status: 'success',
    })
    return result
  } catch (error) {
    collector.record({
      operation: name,
      duration: performance.now() - start,
      memory: process.memoryUsage?.(),
      status: 'error',
      error: error.message,
    })
    throw error
  }
}

// Usage
const metrics = new MetricsCollector()
await withPerformanceMonitoring(metrics, async () => {
  // All Kit operations automatically tracked
  Range.diff(r1, r2)
  Arr.filter(items, predicate)
  Obj.mapValues(data, transform)

  // Get comprehensive performance report
  console.log(metrics.getReport())
})
```

### 3. Capability-Based Security Context

**Fine-grained operation permissions**:

```typescript
const capabilityContext = new AsyncContext()

export const withCapabilities = (capabilities, fn) => {
  return capabilityContext.run(capabilities, fn)
}

// Operations check required capabilities
export const Fs = {
  read: (path) => {
    const caps = capabilityContext.get()
    if (!caps?.filesystem?.read) {
      throw new SecurityError('Read capability not granted')
    }
    return actualRead(path)
  },

  write: (path, data) => {
    const caps = capabilityContext.get()
    if (!caps?.filesystem?.write) {
      throw new SecurityError('Write capability not granted')
    }
    return actualWrite(path, data)
  },
}

export const Http = {
  fetch: (url) => {
    const caps = capabilityContext.get()
    if (!caps?.network?.outbound) {
      throw new SecurityError('Network outbound capability not granted')
    }
    return actualFetch(url)
  },
}

// Usage - sandboxed execution
await withCapabilities({
  filesystem: { read: true },
  network: { outbound: false },
}, async () => {
  const config = Fs.read('./config.json') // ✅ Allowed
  Fs.write('./log.txt', 'data') // ❌ Throws - no write permission
  Http.fetch('https://api.example.com') // ❌ Throws - no network permission
})
```

### 4. Environment Adaptation Context

**Automatic platform-specific behavior**:

```typescript
const envContext = new AsyncContext()

export const withEnvironment = (environment, fn) => {
  return envContext.run(environment, fn)
}

// Kit adapts behavior based on environment
export const Http = {
  fetch: (url, options) => {
    const env = envContext.get()

    switch (env?.platform) {
      case 'node':
        return nodeFetch(url, options)
      case 'cloudflare-workers':
        return workersFetch(url, {
          ...options,
          timeout: env.timeout || 30000,
        })
      case 'browser':
        return browserFetch(url, options)
      default:
        return globalFetch(url, options)
    }
  },
}

export const Fs = {
  read: (path) => {
    const env = envContext.get()

    if (env?.platform === 'browser') {
      throw new Error('File system not available in browser')
    }

    return actualRead(path)
  },
}

// Usage
await withEnvironment({
  platform: 'cloudflare-workers',
  timeout: 10000,
  region: 'us-east-1',
}, async () => {
  // All operations automatically adapt
  const response = Http.fetch('/api/data') // Uses CF Workers fetch with timeout
  const config = Fs.read('./config.json') // Would throw - no FS in CF Workers
})
```

### 5. Configuration Context

**Ambient configuration for operations**:

```typescript
const configContext = new AsyncContext()

export const withConfig = (config, fn) => {
  return configContext.run(config, fn)
}

// Operations use ambient configuration
export const Range = {
  diff: (a, b) => {
    const config = configContext.get()
    const precision = config?.precision ?? 'standard'
    const algorithm = config?.algorithm ?? 'default'

    if (precision === 'high' && algorithm === 'precise') {
      return highPrecisionDiff(a, b)
    } else if (algorithm === 'fast') {
      return fastDiff(a, b)
    }

    return standardDiff(a, b)
  },
}

// Usage
await withConfig({
  precision: 'high',
  algorithm: 'precise',
  locale: 'en-US',
}, async () => {
  // All operations use high precision
  Range.diff(r1, r2)
  Num.format(42.123456)
  Date.format(new Date())
})
```

### 6. Contextual Caching

**Automatic memoization with request-scoped cache**:

```typescript
const cacheContext = new AsyncContext()

export const withCaching = (cacheImpl, fn) => {
  return cacheContext.run(cacheImpl, fn)
}

// Operations automatically cache results
const cached = (key, operation) => {
  const cache = cacheContext.get()
  if (!cache) return operation()

  if (cache.has(key)) {
    return cache.get(key)
  }

  const result = operation()
  cache.set(key, result)
  return result
}

// Usage
const cache = new Map()
await withCaching(cache, async () => {
  // Expensive operations automatically cached within this context
  const result1 = Arr.groupBy(largeArray, expensiveGroupFn) // Computed
  const result2 = Arr.groupBy(largeArray, expensiveGroupFn) // Cached!
})
```

## Composable Contexts

Multiple contexts can work together:

```typescript
// Fluent API for composing contexts
await withDebug({ trace: true })
  .withPerformanceMonitoring(metrics)
  .withConfig({ precision: 'high' })
  .withCapabilities({ filesystem: { read: true } })
  .run(async () => {
    // All contexts active simultaneously
    Range.diff(r1, r2)
    // - Traced (debug)
    // - Timed (performance)
    // - High precision (config)
    // - Security checked (capabilities)
  })

// Or nested contexts with inheritance
await withDebug(
  { trace: true, timing: false },
  () =>
    withDebug({ timing: true }, () => {
      // Merged: { trace: true, timing: true }
      Range.diff(r1, r2)
    }),
)
```

## Implementation Pattern

```typescript
// Context-aware operation wrapper
const withContext = (name, operation) => {
  return (...args) => {
    // Collect all active contexts
    const debug = debugContext.get()
    const perf = perfContext.get()
    const config = configContext.get()
    const caps = capabilityContext.get()

    // Apply context behaviors
    if (caps && !checkCapabilities(caps, name)) {
      throw new SecurityError(`Capability required: ${name}`)
    }

    if (debug?.trace) {
      console.log(`${name} called with:`, args)
    }

    const start = perf ? performance.now() : 0

    try {
      const result = operation(...args, config)

      if (perf) {
        perf.record(name, performance.now() - start)
      }

      if (debug?.trace) {
        console.log(`${name} result:`, result)
      }

      return result
    } catch (error) {
      if (perf) {
        perf.recordError(name, performance.now() - start, error)
      }
      throw error
    }
  }
}

// Apply to Kit operations
export const map = withContext('Arr.map', (arr, fn, config) => {
  // Use config if available
  const batchSize = config?.batchSize
  if (batchSize && arr.length > batchSize) {
    return batchedMap(arr, fn, batchSize)
  }
  return arr.map(fn)
})
```

## Future Possibilities

1. **Automatic Error Recovery**: Context-driven retry policies
2. **Smart Batching**: Automatic operation batching based on context
3. **Resource Management**: Automatic cleanup and resource tracking
4. **Telemetry Integration**: OpenTelemetry spans for all operations
5. **A/B Testing**: Context-driven feature flags and experiments

AsyncContext could transform Kit from a simple utility library into a **context-aware computational environment** where operations automatically adapt to their execution context.
