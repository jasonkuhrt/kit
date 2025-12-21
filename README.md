# Kouka

A TypeScript standard library.

## Installation

```sh
# Main package (includes all modules)
pnpm add kouka

# Or install individual packages
pnpm add @kouka/core
pnpm add @kouka/fs
pnpm add @kouka/cli
# ... etc
```

## Import Patterns

### Using the `kouka` metapackage

The `kouka` package re-exports all modules from all packages:

```typescript
// Import everything from core
import { Arr, Fn, Obj, Str } from 'kouka'

// Import specific modules
import { Arr } from 'kouka/arr'
import { Cli } from 'kouka/cli'
import { Fs } from 'kouka/fs'
```

### Using scoped packages directly

For more control over dependencies:

```typescript
// Core modules
import { Arr, Str } from '@kouka/core'
import { Arr } from '@kouka/core/arr'

// Other packages
import { Cli } from '@kouka/cli'
import { Fs } from '@kouka/fs'
```

## Packages

<!-- PACKAGES_TABLE_START -->

| Package                                                | Description                        |
| ------------------------------------------------------ | ---------------------------------- |
| [`@kouka/assert`](./packages/assert)                   | Assertion utilities                |
| [`@kouka/bldr`](./packages/bldr)                       | Builder pattern utilities          |
| [`@kouka/cli`](./packages/cli)                         | CLI framework                      |
| [`@kouka/codec`](./packages/codec)                     | Encoding and decoding utilities    |
| [`@kouka/color`](./packages/color)                     | Color manipulation utilities       |
| [`@kouka/config-manager`](./packages/config-manager)   | Configuration file management      |
| [`@kouka/configurator`](./packages/configurator)       | Configurator pattern utilities     |
| [`@kouka/core`](./packages/core)                       | Core data structures and utilities |
| [`@kouka/env`](./packages/env)                         | Environment variable utilities     |
| [`@kouka/fs`](./packages/fs)                           | Filesystem utilities               |
| [`@kouka/group`](./packages/group)                     | Grouping utilities                 |
| [`@kouka/html`](./packages/html)                       | HTML utilities                     |
| [`@kouka/http`](./packages/http)                       | HTTP utilities                     |
| [`@kouka/idx`](./packages/idx)                         | Index data structure               |
| [`@kouka/json`](./packages/json)                       | JSON utilities                     |
| [`@kouka/jsonc`](./packages/jsonc)                     | JSON with comments utilities       |
| [`kouka`](./packages/kouka)                            | A TypeScript standard library      |
| [`@kouka/log`](./packages/log)                         | Logging utilities                  |
| [`@kouka/manifest`](./packages/manifest)               | Manifest file utilities            |
| [`@kouka/mask`](./packages/mask)                       | Data masking utilities             |
| [`@kouka/mod`](./packages/mod)                         | Module utilities                   |
| [`@kouka/name`](./packages/name)                       | Naming convention utilities        |
| [`@kouka/num`](./packages/num)                         | Extended number utilities          |
| [`@kouka/oak`](./packages/oak)                         | CLI argument parsing               |
| [`@kouka/package-manager`](./packages/package-manager) | Package manager utilities          |
| [`@kouka/paka`](./packages/paka)                       | Package utilities                  |
| [`@kouka/prox`](./packages/prox)                       | Extended proxy utilities           |
| [`@kouka/ref`](./packages/ref)                         | Reference utilities                |
| [`@kouka/resource`](./packages/resource)               | Resource management utilities      |
| [`@kouka/sch`](./packages/sch)                         | Schema utilities                   |
| [`@kouka/semver`](./packages/semver)                   | Semantic versioning utilities      |
| [`@kouka/syn`](./packages/syn)                         | Syntax utilities                   |
| [`@kouka/test`](./packages/test)                       | Testing utilities                  |
| [`@kouka/tex`](./packages/tex)                         | Text and box formatting utilities  |
| [`@kouka/time`](./packages/time)                       | Time utilities                     |
| [`@kouka/tree`](./packages/tree)                       | Tree data structure utilities      |
| [`@kouka/url`](./packages/url)                         | URL utilities                      |
| [`@kouka/ware`](./packages/ware)                       | Middleware utilities               |

<!-- PACKAGES_TABLE_END -->

## Core Modules

The `@kouka/core` package (and `kouka`) exports these modules:

| Module      | Description               |
| ----------- | ------------------------- |
| `Arr`       | Array utilities           |
| `Bool`      | Boolean utilities         |
| `Err`       | Error handling            |
| `Fn`        | Function utilities        |
| `Lang`      | Language/pluralization    |
| `Null`      | Null utilities            |
| `Num`       | Number utilities          |
| `Obj`       | Object utilities          |
| `Optic`     | Optic/lens utilities      |
| `Pat`       | Pattern matching          |
| `Prom`      | Promise utilities         |
| `Prox`      | Proxy utilities           |
| `Rec`       | Record utilities          |
| `Str`       | String utilities          |
| `Ts`        | TypeScript type utilities |
| `Tup`       | Tuple utilities           |
| `Undefined` | Undefined utilities       |

## About

- Accumulated value across various utility functions across various projects over years.
- Work in progress, breaking changes daily/weekly.

## Goals

- Maximum type safety
- Maximum tree shakability
- Maximum inline JSDoc
- Functional interface
- High performance (close to native as practical)
- Organized by data structure with consistent base interfaces (e.g. `Arr.is`, `Obj.is`, `Str.is`, ...)

## Documentation

For now read the code, things are very self contained.
I will focus on JSDoc before writing here.

## Contributing

I am open to contributions!
