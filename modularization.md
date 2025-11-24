# Modularization

See also: [modularization.svg](./modularization.svg)

## Circular Dependencies

1. `obj` → `str` (type-only: `Str.PadEnd` in `AlignKeys`)
2. `str/visual` → `str/visual-table` (internal)
3. `cli/tex/chain/block` → `cli/tex/chain/root` (internal)
4. `cli/tex/chain/block` → `cli/tex/chain/table` (internal)
5. `fs/path/AbsDir` → `fs/path/constants` (internal)
6. `paka/extractor/nodes/module` → `paka/extractor/nodes/export` (internal)

## Modules

| Module          | Type   | Level | Deps      | Exp |
| --------------- | ------ | ----- | --------- | --- |
| arr             | domain |       |           |     |
| assert          | utils  |       |           |     |
| bldr            | utils  |       |           |     |
| bool            | domain | 0     |           |     |
| cli             | utils  | 1     |           |     |
| codec           | utils  |       |           |     |
| color           | domain |       |           |     |
| config-manager  | utils  |       | value     |     |
| configurator    | utils  |       |           |     |
| dir             | utils  |       |           |     |
| err             | utils  |       |           |     |
| extract         | utils  |       |           |     |
| fn              | domain | 0     |           |     |
| fs              | utils  |       | fs-memory |     |
| fs-memory       | utils  |       |           |     |
| group           | domain |       |           |     |
| html            | utils  |       |           |     |
| http            | utils  |       |           |     |
| idx             | domain |       |           |     |
| json            | utils  | 0     |           |     |
| jsonc           | utils  |       |           |     |
| lang            | utils  |       |           |     |
| lens            | utils  |       |           |     |
| log             | utils  | 1     |           |     |
| manifest        | utils  |       |           |     |
| mask            | utils  |       |           |     |
| name            | utils  | 1     |           |     |
| null            | domain | 0     |           |     |
| num             | domain | 0     |           |     |
| obj             | domain |       | str ⚠️     |     |
| package-manager | utils  | 1     |           |     |
| paka            | utils  | 0     |           |     |
| pat             | utils  |       |           |     |
| pro             | utils  |       |           |     |
| prom            | domain |       |           |     |
| prox            | domain |       |           |     |
| rec             | domain | 0     |           |     |
| ref             | utils  | 0     |           |     |
| resource        | utils  | 1     | jsonc     |     |
| sch             | utils  | 1     |           |     |
| semver          | domain | 1     |           |     |
| str             | domain | 0     |           |     |
| syn             | domain | 1     | str, obj  |     |
| test            | utils  | 1     |           |     |
| time            | domain |       |           |     |
| tree            | domain | 0     |           |     |
| ts              | utils  | 0     | extract   |     |
| tup             | domain | 0     |           |     |
| undefined       | domain | 0     |           |     |
| url             | domain | 0     |           |     |
| value           | utils  | 0     |           |     |
| ware            | utils  | 1     |           |     |

⚠️ = circular dependency

## Tool References

- [madge](https://github.com/pahen/madge) - JS/TS dependency graph generator
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) - Dependency analysis with rule validation
- [skott](https://github.com/antoine-coulon/skott) - Modern TS dependency analyzer with web UI
