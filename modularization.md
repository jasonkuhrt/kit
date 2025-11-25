# Modularization

See also: [modularization.svg](./modularization.svg)

## Circular Dependencies

1. `str/visual` → `str/visual-table` (internal)
2. `cli/tex/chain/block` → `cli/tex/chain/root` (internal)
3. `cli/tex/chain/block` → `cli/tex/chain/table` (internal)
4. `fs/path/AbsDir` → `fs/path/constants` (internal)
5. `paka/extractor/nodes/module` → `paka/extractor/nodes/export` (internal)

## Modules

| Module          | Type   | Level | Deps     | Exp |
| --------------- | ------ | ----- | -------- | --- |
| arr             | domain | 0     |          |     |
| bool            | domain | 0     |          |     |
| codec           | utils  | 0     |          |     |
| err             | utils  | 0     |          |     |
| fn              | domain | 0     |          |     |
| json            | utils  | 0     |          |     |
| jsonc           | utils  | 0     |          |     |
| lang            | utils  | 0     |          |     |
| null            | domain | 0     |          |     |
| num             | domain | 0     |          |     |
| obj             | domain | 0     | str      |     |
| prom            | domain | 0     |          |     |
| prox            | domain | 0     |          |     |
| rec             | domain | 0     |          |     |
| ref             | utils  | 0     |          |     |
| str             | domain | 0     |          |     |
| tree            | domain | 0     |          |     |
| ts              | utils  | 0     |          |     |
| tup             | domain | 0     |          |     |
| undefined       | domain | 0     |          |     |
| url             | domain | 0     |          |     |
| value           | utils  | 0     |          |     |
| color           | domain | 1     |          |     |
| fs              | utils  | 1     |          |     |
| group           | domain | 1     |          |     |
| html            | utils  | 1     |          |     |
| http            | utils  | 1     |          |     |
| idx             | domain | 1     |          |     |
| lens            | utils  | 1     |          |     |
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
| pat             | utils  | -     |          | y   |
| pro             | utils  | -     |          | y   |
| time            | domain | -     |          | y   |

## Tool References

- [madge](https://github.com/pahen/madge) - JS/TS dependency graph generator
- [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) - Dependency analysis with rule validation
- [skott](https://github.com/antoine-coulon/skott) - Modern TS dependency analyzer with web UI
