# Modularization

See also: [modularization.svg](./modularization.svg)

## Circular Dependencies

### Cross-Module (Blockers)

These cycles between non-core modules must be resolved before extracting packages:

| Cycle    | Notes             |
| -------- | ----------------- |
| fs ↔ pro | Mutual dependency |

### Within Core (Acceptable)

These cycles are within core and don't block package extraction (core is one package):

- arr ↔ obj, arr ↔ pat, rec ↔ obj, ts ↔ str, fn ↔ arr, bool ↔ obj, str ↔ lens

### Internal (Within Modules)

These cycles are within a single module and don't block package extraction:

1. `str/visual` → `str/visual-table`
2. `cli/tex/chain/block` → `cli/tex/chain/root`
3. `cli/tex/chain/block` → `cli/tex/chain/table`
4. `fs/path/AbsDir` → `fs/path/constants`
5. `paka/extractor/nodes/module` → `paka/extractor/nodes/export`
6. `syn/term-object` → `syn/ts`

## Core Modules (Level -1)

Cycles within core are acceptable - these will be one package.

| Module    | Type   | Deps |
| --------- | ------ | ---- |
| arr       | domain |      |
| bool      | domain |      |
| err       | utils  |      |
| fn        | domain |      |
| lang      | utils  |      |
| lens      | utils  |      |
| null      | domain |      |
| obj       | domain |      |
| pat       | utils  |      |
| rec       | domain |      |
| str       | domain |      |
| ts        | utils  |      |
| tup       | domain |      |
| undefined | domain |      |

## Rest Modules (Level 0+)

No cycles allowed between these modules.

| Module          | Type   | Level | Deps     | Exp |
| --------------- | ------ | ----- | -------- | --- |
| codec           | utils  | 0     |          |     |
| json            | utils  | 0     |          |     |
| jsonc           | utils  | 0     |          |     |
| num             | domain | 0     |          |     |
| prom            | domain | 0     |          |     |
| prox            | domain | 0     |          |     |
| ref             | utils  | 0     |          |     |
| tree            | domain | 0     |          |     |
| url             | domain | 0     |          |     |
| value           | utils  | 0     |          |     |
| color           | domain | 1     |          |     |
| fs              | utils  | 1     |          |     |
| group           | domain | 1     |          |     |
| html            | utils  | 1     |          |     |
| http            | utils  | 1     |          |     |
| idx             | domain | 1     |          |     |
| manifest        | utils  | 1     |          |     |
| name            | utils  | 1     |          |     |
| package-manager | utils  | 1     |          |     |
| resource        | utils  | 1     | jsonc    |     |
| sch             | utils  | 1     |          |     |
| semver          | domain | 1     |          |     |
| syn             | domain | 1     | str, obj |     |
| assert          | utils  | 2     |          |     |
| bldr            | utils  | 2     |          |     |
| cli             | utils  | 2     |          |     |
| config-manager  | utils  | 2     | value    |     |
| configurator    | utils  | 2     |          |     |
| dir             | utils  | 2     |          |     |
| log             | utils  | 2     |          |     |
| paka            | utils  | 2     |          |     |
| test            | utils  | 2     |          |     |
| ware            | utils  | 2     |          |     |
| mask            | utils  | -     |          | y   |
| pro             | utils  | -     |          | y   |
| time            | domain | -     |          | y   |

## Tool References

- [madge](https://github.com/pahen/madge) - JS/TS dependency graph generator
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) - Dependency analysis with rule validation
- [skott](https://github.com/antoine-coulon/skott) - Modern TS dependency analyzer with web UI
