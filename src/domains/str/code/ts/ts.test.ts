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

// dprint-ignore
Test.describe('TS.boolean > boolean literal')
  .on(TS.boolean)
  .cases(
    [[true],                                            'true'],
    [[false],                                           'false'],
  )
  .test()

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

vtTest('TS.union > union type alias', () => {
  const result = TS.union('Status', ['Active', 'Inactive', 'Pending'])
  expect(result).toBe('type Status =\n| Active\n| Inactive\n| Pending')
})

vtTest('TS.union > filters falsy values', () => {
  const result = TS.union('Result', ['Success', '', 'Failure'])
  expect(result).toBe('type Result =\n| Success\n| Failure')
})

vtTest('TS.unionItems > union items without type wrapper', () => {
  const result = TS.unionItems(['string', 'number', null])
  expect(result).toBe('string\n| number')
})

vtTest('TS.unionItems > filters null values', () => {
  const result = TS.unionItems(['string', null, 'boolean'])
  expect(result).toBe('string\n| boolean')
})

// dprint-ignore
Test.describe('TS.tuple > tuple type')
  .on(TS.tuple)
  .cases(
    [[['string', 'number', 'boolean']],                 '[string, number, boolean]'],
    [[['string']],                                      '[string]'],
    [[[]]  ,                                            '[]'],
  )
  .test()

// dprint-ignore
Test.describe('TS.nullable > nullable type')
  .on(TS.nullable)
  .cases(
    [['string'],                                        'string | null'],
    [['User'],                                          'User | null'],
  )
  .test()

// dprint-ignore
Test.describe('TS.intersection > intersection type')
  .on(TS.intersection)
  .cases(
    [['Base', 'Mixin'],                                 'Base & Mixin'],
    [['User', 'Permissions'],                           'User & Permissions'],
  )
  .test()

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

// ============================================================================
// Namespaces
// ============================================================================

// dprint-ignore
Test.describe('TS.namespace > namespace declaration')
  .on(TS.namespace)
  .cases(
    [['Utils', 'export const foo = 1'],                 'namespace Utils {\nexport const foo = 1\n}'],
    [['Types', 'export type T = string'],               'namespace Types {\nexport type T = string\n}'],
  )
  .test()

// ============================================================================
// Expressions
// ============================================================================

// dprint-ignore
Test.describe('TS.propertyAccess > property access expression')
  .on(TS.propertyAccess)
  .cases(
    [['Math', 'PI'],                                    'Math.PI'],
    [['console', 'log'],                                'console.log'],
    [['obj', 'property'],                               'obj.property'],
  )
  .test()

// ============================================================================
// Variable Declarations
// ============================================================================

// dprint-ignore
Test.describe('TS.constDecl > const declaration')
  .on(TS.constDecl)
  .cases(
    [['foo', '1'],                                      'const foo = 1'],
    [['name', '"Alice"'],                               'const name = "Alice"'],
    [['items', '[1, 2, 3]'],                            'const items = [1, 2, 3]'],
  )
  .test()

// dprint-ignore
Test.describe('TS.constDeclTyped > typed const declaration')
  .on(TS.constDeclTyped)
  .cases(
    [['foo', 'number', '1'],                            'const foo: number = 1'],
    [['name', 'string', '"Alice"'],                     'const name: string = "Alice"'],
    [['items', 'number[]', '[1, 2, 3]'],                'const items: number[] = [1, 2, 3]'],
  )
  .test()

// ============================================================================
// Object Members
// ============================================================================

// dprint-ignore
Test.describe('TS.objectFromFields > wrap fields in object braces')
  .on(TS.objectFromFields)
  .cases(
    [['a: string'],                                     '{\na: string\n}'],
    [['a: string\nb: number'],                          '{\na: string\nb: number\n}'],
  )
  .test()

// dprint-ignore
Test.describe('TS.fields > join field declarations')
  .on(TS.fields)
  .cases(
    [[['a: string', 'b: number']],                      'a: string\nb: number'],
    [[['id: string']],                                  'id: string'],
    [[[]]  ,                                            ''],
  )
  .test()

// ============================================================================
// New Literals
// ============================================================================

// dprint-ignore
Test.describe('TS.number > number literal')
  .on(TS.number)
  .cases(
    [[42],                                              '42'],
    [[3.14],                                            '3.14'],
    [[0],                                               '0'],
    [[-5],                                              '-5'],
  )
  .test()

// dprint-ignore
Test.describe('TS.nullLiteral > null literal')
  .on(TS.nullLiteral)
  .cases(
    [[],                                                'null'],
  )
  .test()

// dprint-ignore
Test.describe('TS.undefinedLiteral > undefined literal')
  .on(TS.undefinedLiteral)
  .cases(
    [[],                                                'undefined'],
  )
  .test()

// ============================================================================
// Type-Level Features
// ============================================================================

// dprint-ignore
Test.describe('TS.conditional > conditional type')
  .on(TS.conditional)
  .cases(
    [['T', 'string', 'number', 'boolean'],              'T extends string ? number : boolean'],
    [['A', 'B', 'C', 'D'],                              'A extends B ? C : D'],
  )
  .test()

// dprint-ignore
Test.describe('TS.mapped > mapped type')
  .on(TS.mapped)
  .cases(
    [['K', 'keyof T', 'T[K]'],                          '{ [K in keyof T]: T[K] }'],
    [['P', 'string', 'boolean'],                        '{ [P in string]: boolean }'],
  )
  .test()

vtTest('TS.templateLiteral > template literal type', () => {
  const result = TS.templateLiteral(['Hello ', '${T}', '!'])
  expect(result).toBe('`Hello ${T}!`')
})

vtTest('TS.templateLiteral > empty parts', () => {
  const result = TS.templateLiteral([])
  expect(result).toBe('``')
})

// ============================================================================
// Type Operators
// ============================================================================

// dprint-ignore
Test.describe('TS.typeOf > typeof operator')
  .on(TS.typeOf)
  .cases(
    [['value'],                                         'typeof value'],
    [['obj.prop'],                                      'typeof obj.prop'],
  )
  .test()

// dprint-ignore
Test.describe('TS.keyOf > keyof operator')
  .on(TS.keyOf)
  .cases(
    [['User'],                                          'keyof User'],
    [['Record<string, any>'],                           'keyof Record<string, any>'],
  )
  .test()

// dprint-ignore
Test.describe('TS.indexedAccess > indexed access type')
  .on(TS.indexedAccess)
  .cases(
    [['User', 'id'],                                    'User["id"]'],
    [['Config', 'port'],                                'Config["port"]'],
  )
  .test()

// ============================================================================
// Utility Types
// ============================================================================

// dprint-ignore
Test.describe('TS.partial > Partial utility type')
  .on(TS.partial)
  .cases(
    [['User'],                                          'Partial<User>'],
    [['Config'],                                        'Partial<Config>'],
  )
  .test()

// dprint-ignore
Test.describe('TS.required > Required utility type')
  .on(TS.required)
  .cases(
    [['User'],                                          'Required<User>'],
    [['Options'],                                       'Required<Options>'],
  )
  .test()

// dprint-ignore
Test.describe('TS.readonly > Readonly utility type')
  .on(TS.readonly)
  .cases(
    [['User'],                                          'Readonly<User>'],
    [['State'],                                         'Readonly<State>'],
  )
  .test()

vtTest('TS.pick > Pick utility type', () => {
  const result = TS.pick('User', ['id', 'name'])
  expect(result).toBe('Pick<User, "id" | "name">')
})

vtTest('TS.pick > single key', () => {
  const result = TS.pick('User', ['id'])
  expect(result).toBe('Pick<User, "id">')
})

vtTest('TS.omit > Omit utility type', () => {
  const result = TS.omit('User', ['password'])
  expect(result).toBe('Omit<User, "password">')
})

vtTest('TS.omit > multiple keys', () => {
  const result = TS.omit('User', ['password', 'salt'])
  expect(result).toBe('Omit<User, "password" | "salt">')
})

// dprint-ignore
Test.describe('TS.record > Record utility type')
  .on(TS.record)
  .cases(
    [['string', 'number'],                              'Record<string, number>'],
    [['number', 'User'],                                'Record<number, User>'],
  )
  .test()

// ============================================================================
// Functions
// ============================================================================

vtTest('TS.functionDecl > basic function', () => {
  const result = TS.functionDecl({
    name: 'add',
    params: ['a: number', 'b: number'],
    returnType: 'number',
    body: 'return a + b',
  })
  expect(result).toContain('function add(a: number, b: number): number {')
  expect(result).toContain('return a + b')
})

vtTest('TS.functionDecl > async function', () => {
  const result = TS.functionDecl({
    name: 'fetchData',
    async: true,
    returnType: 'Promise<Data>',
  })
  expect(result).toContain('async function fetchData()')
})

vtTest('TS.functionDecl > exported function', () => {
  const result = TS.functionDecl({
    name: 'helper',
    export: true,
  })
  expect(result).toContain('export function helper()')
})

// dprint-ignore
Test.describe('TS.arrowFunction > arrow function')
  .on(TS.arrowFunction)
  .cases(
    [[['x'], 'x * 2'],                                  'x => x * 2'],
    [[['a', 'b'], 'a + b'],                             '(a, b) => a + b'],
    [[['n: number'], 'n * 2', 'number'],                '(n: number): number => n * 2'],
  )
  .test()

// ============================================================================
// Classes
// ============================================================================

vtTest('TS.classDecl > basic class', () => {
  const result = TS.classDecl({
    name: 'User',
    body: 'constructor(public id: string) {}',
  })
  expect(result).toContain('class User {')
  expect(result).toContain('constructor(public id: string) {}')
})

vtTest('TS.classDecl > with extends', () => {
  const result = TS.classDecl({
    name: 'Admin',
    extends: 'User',
  })
  expect(result).toContain('class Admin extends User {')
})

vtTest('TS.classDecl > with implements', () => {
  const result = TS.classDecl({
    name: 'Service',
    implements: ['IService', 'Disposable'],
  })
  expect(result).toContain('class Service implements IService, Disposable {')
})

vtTest('TS.classDecl > abstract class', () => {
  const result = TS.classDecl({
    name: 'Base',
    abstract: true,
  })
  expect(result).toContain('abstract class Base {')
})

vtTest('TS.classDecl > exported class', () => {
  const result = TS.classDecl({
    name: 'Helper',
    export: true,
  })
  expect(result).toContain('export class Helper {')
})

vtTest('TS.classDecl > with type parameters', () => {
  const result = TS.classDecl({
    name: 'Container',
    parameters: ['T'],
  })
  expect(result).toContain('class Container<T> {')
})

// ============================================================================
// Control Flow & Expressions
// ============================================================================

vtTest('TS.ifStatement > with else', () => {
  const result = TS.ifStatement('x > 0', 'return true', 'return false')
  expect(result).toContain('if (x > 0) {')
  expect(result).toContain('return true')
  expect(result).toContain('} else {')
  expect(result).toContain('return false')
})

vtTest('TS.ifStatement > without else', () => {
  const result = TS.ifStatement('enabled', 'doSomething()')
  expect(result).toContain('if (enabled) {')
  expect(result).toContain('doSomething()')
  expect(result).not.toContain('else')
})

// dprint-ignore
Test.describe('TS.ternary > ternary expression')
  .on(TS.ternary)
  .cases(
    [['x > 0', 'positive', 'negative'],                 'x > 0 ? positive : negative'],
    [['enabled', 'yes', 'no'],                          'enabled ? yes : no'],
  )
  .test()

// dprint-ignore
Test.describe('TS.call > function call')
  .on(TS.call)
  .cases(
    [['add', ['1', '2']],                               'add(1, 2)'],
    [['process', []],                                   'process()'],
  )
  .test()

// dprint-ignore
Test.describe('TS.methodCall > method call')
  .on(TS.methodCall)
  .cases(
    [['console', 'log', ['"hello"']],                   'console.log("hello")'],
    [['obj', 'method', ['arg1', 'arg2']],               'obj.method(arg1, arg2)'],
  )
  .test()

// ============================================================================
// Builder Pattern
// ============================================================================

vtTest('TS.Type.union > builder pattern', () => {
  const result = TS.Type.union('Status')
    .variant('Active')
    .variant('Inactive')
    .variant('Pending')
    .build()
  expect(result).toBe('type Status =\n| Active\n| Inactive\n| Pending')
})

vtTest('TS.Type.object > builder pattern', () => {
  const result = TS.Type.object()
    .field('id', 'string')
    .field('name', 'string', { optional: true })
    .build()
  expect(result).toContain('{\nid: string')
  expect(result).toContain('name?: string')
})

vtTest('TS.Type.interface > builder pattern', () => {
  const result = TS.Type.interface('User')
    .field('id', 'string')
    .field('name', 'string')
    .export()
    .build()
  expect(result).toContain('export interface User {')
  expect(result).toContain('id: string')
  expect(result).toContain('name: string')
})

vtTest('TS.Type.interface > with extends', () => {
  const result = TS.Type.interface('Admin')
    .extends('User', 'Permissions')
    .field('role', 'string')
    .build()
  expect(result).toContain('interface Admin extends User, Permissions {')
})

vtTest('TS.Type.interface > with type parameters', () => {
  const result = TS.Type.interface('Container')
    .parameters('T')
    .field('value', 'T')
    .build()
  expect(result).toContain('interface Container<T> {')
})
