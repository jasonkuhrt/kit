/**
 * kouka - A TypeScript standard library.
 *
 * This is the main entry point that re-exports all namespaces from all packages.
 *
 * @example
 * ```ts
 * import { Arr, Str, Obj, Fn, Fs, Cli } from 'kouka'
 *
 * const result = Arr.map([1, 2, 3], n => n * 2)
 * ```
 *
 * @packageDocumentation
 */

// Core package namespaces
export * from '@kouka/core'

// Regular package namespaces
export { Assert } from '@kouka/assert'
export { Bldr } from '@kouka/bldr'
export { Cli } from '@kouka/cli'
export { Codec } from '@kouka/codec'
export { Color } from '@kouka/color'
export { ConfigManager } from '@kouka/config-manager'
export { Configurator } from '@kouka/configurator'
export { Env } from '@kouka/env'
export { Fs } from '@kouka/fs'
export { Group } from '@kouka/group'
export { Html } from '@kouka/html'
export { Http } from '@kouka/http'
export { Idx } from '@kouka/idx'
export { Json } from '@kouka/json'
export { Jsonc } from '@kouka/jsonc'
export { Log } from '@kouka/log'
export { Manifest } from '@kouka/manifest'
export { Mask } from '@kouka/mask'
export { Mod } from '@kouka/mod'
export { Name } from '@kouka/name'
export { Num as ExtNum } from '@kouka/num'
export { Oak } from '@kouka/oak'
export { PackageManager } from '@kouka/package-manager'
export { Paka } from '@kouka/paka'
export { Prox as ExtProx } from '@kouka/prox'
export { Ref } from '@kouka/ref'
export { Resource } from '@kouka/resource'
export { Sch } from '@kouka/sch'
export { Semver } from '@kouka/semver'
export { Syn } from '@kouka/syn'
export { Test } from '@kouka/test'
export { Tex } from '@kouka/tex'
export { Time } from '@kouka/time'
export { Tree } from '@kouka/tree'
export { Url } from '@kouka/url'
export { Ware } from '@kouka/ware'
