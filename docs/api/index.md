# API Reference

Kit provides a comprehensive set of modules for various programming tasks. Each module follows consistent patterns and naming conventions.

## Module Categories

### 📦 Data Structures

Modules for working with common data structures:

- [**Arr**](./arr) - Array operations and transformations
- [**Obj**](./obj) - Object manipulation and utilities
- [**Str**](./str) - String processing and formatting
- [**Rec**](./rec) - Record/dictionary operations
- [**Group**](./group) - Grouping and categorization
- [**Idx**](./idx) - Index-based operations
- [**Tree**](./tree) - Tree structure manipulation

### 🔧 Functional Programming

Modules for functional programming patterns:

- [**Fn**](./fn) - Function composition and utilities
- [**Prom**](./prom) - Promise utilities and control flow
- [**Cache**](./cache) - Memoization and caching strategies

### 🔍 Type & Value Operations

Modules for working with primitive types:

- [**Bool**](./bool) - Boolean logic and operations
- [**Num**](./num) - Number operations and math utilities
- [**Null**](./null) - Null handling utilities
- [**Undefined**](./undefined) - Undefined handling
- [**Value**](./value) - General value utilities
- [**Eq**](./eq) - Equality comparisons

### 🌐 I/O & External

Modules for external interactions:

- [**Fs**](./fs) - File system operations
- [**FsRelative**](./fs-relative) - Relative path operations
- [**Http**](./http) - HTTP client utilities
- [**Cli**](./cli) - Command-line interface helpers
- [**Url**](./url) - URL parsing and manipulation
- [**Path**](./path) - Path utilities

### 🛠️ Development Tools

Modules for development and debugging:

- [**Debug**](./debug) - Debugging utilities
- [**Ts**](./ts) - TypeScript-specific utilities
- [**Language**](./language) - Language/runtime utilities
- [**Codec**](./codec) - Encoding/decoding utilities
- [**Json**](./json) - JSON utilities
- [**Err**](./err) - Error handling and utilities

## Common Patterns

### Currying Convention

Most functions follow a consistent currying pattern:

```typescript
// Standard function
operation(data, ...args)

// Curried with data first
operationOn(data)(...args)

// Curried with args first
operationWith(...args)(data)
```

### Universal Operations

Many modules share common operation names:

- `is` - Type predicate
- `create` / `make` - Constructor
- `merge` - Combine multiple values
- `map` - Transform elements
- `filter` - Select elements
- `reduce` - Aggregate to single value
- `by` - Key-based operations

### Type Safety

All modules are designed with TypeScript-first approach:

- Strong type inference
- Generics where appropriate
- Type predicates for narrowing
- Strict null checks

## Import Styles

Choose the import style that best fits your needs:

```typescript
// Namespace import (recommended)
import { Arr, Obj, Str } from '@wollybeard/kit'

// Direct module import
import * as Arr from '@wollybeard/kit/arr'

// Specific function import
import { filter, map } from '@wollybeard/kit/arr'
```
