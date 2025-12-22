# Kouka

A TypeScript standard library.

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

## Package Organization

Each regular scoped package can be imported as a namespace or barrel:

```ts
import { X } from '@kouka/x'
import * as X from '@kouka/x/__'
```

There are two non-regular special pacakges. The scoped core package and the unscoped metapackage.

The scoped core package has multiple modules and each can be imported as a namespace or barrel:

```ts
import { A, B, C /* ... */ } from '@kouka/core'
import * as A from '@kouka/core/a'
import * as B from '@kouka/core/b'
import * as C from '@kouka/core/c'
```

The metapackage re-exports all modules from all packages. The regular package re-exports the consumption pattern is:

```ts
import { X } from 'kouka'
import * as X from 'kouka/x'
```

For re-export of the special core package the consumption pattern is:

```ts
import { A, B, C /* ... */ } from 'kouka'
import * as A from 'kouka/a'
import * as B from 'kouka/b'
import * as C from 'kouka/c'
```

Notice that the core package has been flattened into the metapackage.

1. Its main entrypoint is a barrel of all scoped package main entrypoint exports (one namespace) and all core package main entrypoint exports (multiple namespaes).
2. Its additional entrypoints are one per scoped package (their barrel entrypoint) and one per scsoped core package's own additional entrypoints.

You will also find these conventions:

- Regular scoped packages: The exported namespace is pascal case of the package name (kebab case).
- Core scoped package: The exported namespaces are pascal case of each entrypoint name (kebaba case).

## Package Index

<!-- PACKAGES_TABLE_START -->

| Package | Description |
| ------- | ----------- |
| [`@kouka/assert`](./packages/assert) | Assertion utilities |
| [`@kouka/bldr`](./packages/bldr) | Builder pattern utilities |
| [`@kouka/cli`](./packages/cli) | CLI framework |
| [`@kouka/codec`](./packages/codec) | Encoding and decoding utilities |
| [`@kouka/color`](./packages/color) | Color manipulation utilities |
| [`@kouka/config-manager`](./packages/config-manager) | Configuration file management |
| [`@kouka/configurator`](./packages/configurator) | Configurator pattern utilities |
| [`@kouka/core`](./packages/core) | Core data structures and utilities |
| [`@kouka/env`](./packages/env) | Environment variable utilities |
| [`@kouka/fs`](./packages/fs) | Filesystem utilities |
| [`@kouka/group`](./packages/group) | Grouping utilities |
| [`@kouka/html`](./packages/html) | HTML utilities |
| [`@kouka/http`](./packages/http) | HTTP utilities |
| [`@kouka/idx`](./packages/idx) | Index data structure |
| [`@kouka/json`](./packages/json) | JSON utilities |
| [`@kouka/jsonc`](./packages/jsonc) | JSON with comments utilities |
| [`kouka`](./packages/kouka) | A TypeScript standard library |
| [`@kouka/log`](./packages/log) | Logging utilities |
| [`@kouka/manifest`](./packages/manifest) | Manifest file utilities |
| [`@kouka/mask`](./packages/mask) | Data masking utilities |
| [`@kouka/mod`](./packages/mod) | Module utilities |
| [`@kouka/name`](./packages/name) | Naming convention utilities |
| [`@kouka/num`](./packages/num) | Extended number utilities |
| [`@kouka/oak`](./packages/oak) | CLI argument parsing |
| [`@kouka/package-manager`](./packages/package-manager) | Package manager utilities |
| [`@kouka/paka`](./packages/paka) | Package utilities |
| [`@kouka/prox`](./packages/prox) | Extended proxy utilities |
| [`@kouka/ref`](./packages/ref) | Reference utilities |
| [`@kouka/resource`](./packages/resource) | Resource management utilities |
| [`@kouka/sch`](./packages/sch) | Schema utilities |
| [`@kouka/semver`](./packages/semver) | Semantic versioning utilities |
| [`@kouka/syn`](./packages/syn) | Syntax utilities |
| [`@kouka/test`](./packages/test) | Testing utilities |
| [`@kouka/tex`](./packages/tex) | Text and box formatting utilities |
| [`@kouka/time`](./packages/time) | Time utilities |
| [`@kouka/tree`](./packages/tree) | Tree data structure utilities |
| [`@kouka/url`](./packages/url) | URL utilities |
| [`@kouka/ware`](./packages/ware) | Middleware utilities |

<!-- PACKAGES_TABLE_END -->

## Core Package Namespace Index

<!-- CORE_NAMESPACE_INDEX_START -->

| Module | Description |
| ------ | ----------- |
| `Arr` | Array utilities for working with readonly and mutable arrays. |
| `Bool` | Boolean utilities for logical operations and predicates. |
| `Err` | Error handling utilities for robust error management. |
| `Fn` | Function utilities for functional programming patterns. |
| `Lang` | Language utilities for type inspection and formatting. |
| `Null` | Null utilities for nullable type handling. |
| `Num` | Number utilities for numeric operations and type guards. |
| `Obj` | Object utilities for working with plain JavaScript objects. |
| `Optic` | Optic utilities for type-safe data access and transformation. |
| `Pat` | Pattern matching utilities for declarative value matching. |
| `Prom` | Promise utilities for asynchronous operations. |
| `Prox` | Proxy utilities for dynamic object behavior. |
| `Rec` | Record utilities for working with plain JavaScript objects as dictionaries. |
| `Str` | String utilities for text manipulation and analysis. |
| `Ts` | TypeScript type utilities and type-level programming helpers. |
| `Tup` | Tuple utilities for fixed-length array operations. |
| `Undefined` | Undefined utilities for optional type handling. |

<!-- CORE_NAMESPACE_INDEX_END -->
