import { Test } from '#test'
import { expect, test as vtTest } from 'vitest'
import * as TS from './ts.js'

// ============================================================================
// Literals
// ============================================================================

// dprint-ignore
Test.describe('TS.string > quote string')
  .on(TS.string)
  .cases(
    [['hello'],                                     '"hello"'],
    [['world'],                                     '"world"'],
    [['path/to/file'],                              '"path/to/file"'],
  )
  .test()

vtTest('TS.list > array literal', () => {
  expect(TS.list(['a', 'b', 'c'])).toBe('[a, b, c]')
  expect(TS.list(['foo'])).toBe('[foo]')
  expect(TS.list([])).toBe('[]')
})

// dprint-ignore
Test.describe('TS.block > wrap in braces')
  .on(TS.block)
  .cases(
    [['foo: string'],                               '{\nfoo: string\n}'],
    [['a: number\nb: boolean'],                     '{\na: number\nb: boolean\n}'],
  )
  .test()

vtTest('TS.object > generate object literal', () => {
  const result = TS.object([
    ['name', '"Alice"'],
    ['age', '30'],
  ])
  expect(result).toBe('{\nname: "Alice",\nage: 30\n}')
})

vtTest('TS.object > empty object', () => {
  const result = TS.object([])
  expect(result).toBe('{}')
})

// ============================================================================
// Type Definitions
// ============================================================================

// dprint-ignore
Test.describe('TS.typeAlias > basic type alias')
  .on(TS.typeAlias)
  .cases(
    [['UserId', 'string'],                          'type UserId = string'],
    [['Point', '{ x: number; y: number }'],         'type Point = { x: number; y: number }'],
  )
  .test()

vtTest('TS.typeAliasWithOptions > with all options', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Result',
    type: 'T | Error',
    parameters: ['T'],
    tsDoc: 'A result type',
    export: true,
  })
  expect(result).toContain('/**')
  expect(result).toContain('* A result type')
  expect(result).toContain('export type Result<T> = T | Error')
})

vtTest('TS.typeAliasWithOptions > minimal options', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Foo',
    type: 'string',
  })
  expect(result).toBe('export type Foo = string')
})

vtTest('TS.typeAliasWithOptions > no export', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Private',
    type: 'number',
    export: false,
  })
  expect(result).toBe('type Private = number')
})

vtTest('TS.interfaceDecl > basic interface', () => {
  const result = TS.interfaceDecl({
    name: 'User',
    block: 'id: string\nname: string',
  })
  expect(result).toContain('export interface User {')
  expect(result).toContain('id: string')
  expect(result).toContain('name: string')
})

vtTest('TS.interfaceDecl > with extends', () => {
  const result = TS.interfaceDecl({
    name: 'Admin',
    block: 'role: string',
    extends: ['User', 'Permissions'],
  })
  expect(result).toContain('export interface Admin extends User, Permissions {')
})

vtTest('TS.interfaceDecl > with type parameters', () => {
  const result = TS.interfaceDecl({
    name: 'Container',
    block: 'value: T',
    parameters: ['T'],
  })
  expect(result).toContain('export interface Container<T> {')
})

vtTest('TS.interfaceDecl > with TSDoc', () => {
  const result = TS.interfaceDecl({
    name: 'Config',
    block: 'port: number',
    tsDoc: 'Application configuration',
  })
  expect(result).toContain('/**')
  expect(result).toContain('* Application configuration')
  expect(result).toContain('export interface Config {')
})

vtTest('TS.interfaceDecl > empty interface', () => {
  const result = TS.interfaceDecl({
    name: 'Empty',
  })
  expect(result).toBe('export interface Empty {}')
})

// ============================================================================
// Exports
// ============================================================================

// dprint-ignore
Test.describe('TS.exportDecl > export declaration')
  .on(TS.exportDecl)
  .cases(
    [['const foo = 1'],                             'export const foo = 1'],
    [['function bar() {}'],                         'export function bar() {}'],
  )
  .test()

// dprint-ignore
Test.describe('TS.reexportAll > export star')
  .on(TS.reexportAll)
  .cases(
    [[{ from: './path' }],                          "export * from './path'"],
    [[{ from: './types', type: true }],             "export type * from './types'"],
  )
  .test()

// dprint-ignore
Test.describe('TS.reexportNamespace > export star as')
  .on(TS.reexportNamespace)
  .cases(
    [[{ as: 'Name', from: './path' }],              "export * as Name from './path'"],
    [[{ as: 'Types', from: './types', type: true }], "export type * as Types from './types'"],
  )
  .test()

vtTest('TS.reexportNamed > simple name', () => {
  const result = TS.reexportNamed({ names: 'Foo', from: './foo' })
  expect(result).toBe("export { Foo } from './foo'")
})

vtTest('TS.reexportNamed > array of names', () => {
  const result = TS.reexportNamed({ names: ['a', 'b', 'c'], from: './abc' })
  expect(result).toBe("export { a, b, c } from './abc'")
})

vtTest('TS.reexportNamed > aliased names', () => {
  const result = TS.reexportNamed({
    names: { oldName: 'newName', foo: 'bar' },
    from: './module',
  })
  expect(result).toBe("export { oldName as newName, foo as bar } from './module'")
})

vtTest('TS.reexportNamed > with type', () => {
  const result = TS.reexportNamed({ names: 'Type', from: './types', type: true })
  expect(result).toBe("export type { Type } from './types'")
})

// ============================================================================
// Imports
// ============================================================================

// dprint-ignore
Test.describe('TS.importAll > import star')
  .on(TS.importAll)
  .cases(
    [[{ as: 'Name', from: './path' }],              "import * as Name from './path'"],
    [[{ as: 'Types', from: './types', type: true }], "import type * as Types from './types'"],
  )
  .test()

vtTest('TS.importNamed > simple name', () => {
  const result = TS.importNamed({ names: 'Foo', from: './foo' })
  expect(result).toBe("import { Foo } from './foo'")
})

vtTest('TS.importNamed > array of names', () => {
  const result = TS.importNamed({ names: ['a', 'b', 'c'], from: './abc' })
  expect(result).toBe("import { a, b, c } from './abc'")
})

vtTest('TS.importNamed > aliased names', () => {
  const result = TS.importNamed({
    names: { oldName: 'newName', foo: 'bar' },
    from: './module',
  })
  expect(result).toBe("import { oldName as newName, foo as bar } from './module'")
})

vtTest('TS.importNamed > with type', () => {
  const result = TS.importNamed({ names: 'Type', from: './types', type: true })
  expect(result).toBe("import type { Type } from './types'")
})
