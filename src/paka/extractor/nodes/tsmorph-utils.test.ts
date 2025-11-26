import { Test } from '#test'
import { Project } from 'ts-morph'
import { expect, test } from 'vitest'
import {
  BuilderMethod,
  BuilderSignatureModel,
  ClassSignatureModel,
  FunctionSignature,
  FunctionSignatureModel,
  Parameter,
  TypeParameter,
} from '../../schema.js'
import { extractSignature } from './tsmorph-utils.js'

/**
 * Helper to create a TypeScript project and extract signature from source.
 */
const extractFromSource = (source: string) => {
  const project = new Project({ useInMemoryFileSystem: true })
  const sourceFile = project.createSourceFile('test.ts', source)
  const exports = sourceFile.getExportedDeclarations()
  const firstExport = Array.from(exports.values())[0]?.[0]
  if (!firstExport) throw new Error('No export found')
  return extractSignature(firstExport)
}

Test.describe('extractSignature')
  .inputType<string>()
  .outputType<object>()
  .cases(
    // Functions
    [`export function test(): void {}`, { _tag: 'FunctionSignatureModel' }],
    [`export function add(a: number, b: number): number { return a + b }`, { _tag: 'FunctionSignatureModel' }],
    [`export function map<T, U>(items: T[], fn: (item: T) => U): U[] { return items.map(fn) }`, {
      _tag: 'FunctionSignatureModel',
    }],
    [`export async function fetchData(url: string): Promise<string> { return 'data' }`, {
      _tag: 'FunctionSignatureModel',
    }],
    // Arrow functions & function expressions
    [`export const add = (a: number, b: number): number => a + b`, { _tag: 'FunctionSignatureModel' }],
    [`export const identity = <T>(value: T): T => value`, { _tag: 'FunctionSignatureModel' }],
    [`export const multiply = function(a: number, b: number): number { return a * b }`, {
      _tag: 'FunctionSignatureModel',
    }],
    [`export const fetchUser = async (id: number): Promise<User> => { return {} as User }\ninterface User {}`, {
      _tag: 'FunctionSignatureModel',
    }],
    // Types
    [`export type Config = { port: number; host: string }`, {
      _tag: 'TypeSignatureModel',
      text: 'type Config = { port: number; host: string }',
    }],
    [`export interface User {\n  name: string\n  age: number\n}`, { _tag: 'TypeSignatureModel' }],
    [`export enum Color { Red = 'red', Green = 'green', Blue = 'blue' }`, { _tag: 'TypeSignatureModel' }],
    [`export class Box { constructor(public value: number) {} getValue() { return this.value } }`, {
      _tag: 'ClassSignatureModel',
    }],
    [`export namespace Utils { export function helper() {} }`, { _tag: 'TypeSignatureModel' }],
    // Values
    [`export const PI = 3.14159`, { _tag: 'ValueSignatureModel', type: '3.14159' }],
    [`export const greeting = 'Hello'`, { _tag: 'ValueSignatureModel', type: '"Hello"' }],
    [`export const config = { port: 3000, host: 'localhost' }`, { _tag: 'ValueSignatureModel' }],
    // Builders
    [
      `/** @builder */
export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> { return null as any }
interface TestBuilder<State> {
  inputType<I>(): TestBuilder<State & { input: I }>
  test(): void
}`,
      { _tag: 'BuilderSignatureModel', typeName: 'TestBuilder' },
    ],
  )
  .test(({ input, output }) => {
    const sig = extractFromSource(input)
    expect(sig).toMatchObject(output)
  })

// Detailed tests for specific features
test('type parameter constraints', () => {
  const sig = extractFromSource(`export function sort<T extends string>(items: T[]): T[] { return items.sort() }`)
  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.typeParameters[0]).toMatchObject({ name: 'T', constraint: 'string' })
})

test('type parameter defaults', () => {
  const sig = extractFromSource(`export function create<T = unknown>(): T { return {} as T }`)
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.typeParameters[0]).toMatchObject({ name: 'T', default: 'unknown' })
})

test('optional parameters', () => {
  const sig = extractFromSource(`export function greet(name: string, age?: number): string { return name }`)
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.parameters).toMatchObject([
    { name: 'name', type: 'string', optional: false, rest: false },
    { name: 'age', type: 'number', optional: true, rest: false },
  ])
})

test('rest parameters', () => {
  const sig = extractFromSource(
    `export function sum(...numbers: number[]): number { return numbers.reduce((a, b) => a + b, 0) }`,
  )
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.parameters[0]).toMatchObject({
    name: 'numbers',
    type: 'number[]',
    optional: true, // Rest parameters are always optional in TypeScript
    rest: true,
  })
})

test('default parameter values', () => {
  const sig = extractFromSource(`export function greet(name: string = 'World'): string { return 'Hello ' + name }`)
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.parameters[0]).toMatchObject({
    name: 'name',
    type: 'string',
    optional: true, // Parameters with defaults are optional in TypeScript
    rest: false,
    defaultValue: "'World'",
  })
})

test('function overloads', () => {
  const sig = extractFromSource(`
    export function parse(input: string): Config
    export function parse(input: Buffer): Config
    export function parse(input: unknown): Config {
      return {} as Config
    }
    interface Config {}
  `)

  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads).toHaveLength(3)
  expect(fnSig.overloads[0]).toMatchObject({
    parameters: [{ name: 'input', type: 'string' }],
    returnType: 'Config',
  })
  expect(fnSig.overloads[1]).toMatchObject({
    parameters: [{ name: 'input', type: 'Buffer' }],
    returnType: 'Config',
  })
  expect(fnSig.overloads[2]).toMatchObject({
    parameters: [{ name: 'input', type: 'unknown' }],
    returnType: 'Config',
  })
})

test('Effect Schema classes validation', () => {
  const sig = extractFromSource(`export function test<T extends string>(value: T, opt?: number): T { return value }`)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  const overload = fnSig.overloads[0]!

  // Verify nested classes are proper instances
  expect(overload.typeParameters[0]).toBeInstanceOf(TypeParameter)
  expect(overload.parameters[0]).toBeInstanceOf(Parameter)
  expect(overload).toBeInstanceOf(FunctionSignature)
})

// Builder pattern tests
test('builder with chainable methods', () => {
  const sig = extractFromSource(`
    /** @builder */
    export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
      return null as any
    }
    interface TestBuilder<State> {
      inputType<I>(): TestBuilder<State & { input: I }>
      cases(...cases: any[]): TestBuilder<State>
    }
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type
  expect(builderSig.typeName).toBe('TestBuilder')
  expect(builderSig.chainableMethods).toHaveLength(2)
  expect(builderSig.chainableMethods[0]).toMatchObject({
    name: 'inputType',
    category: 'chainable',
  })
  expect(builderSig.chainableMethods[1]).toMatchObject({
    name: 'cases',
    category: 'chainable',
  })
})

test('builder with terminal methods', () => {
  const sig = extractFromSource(`
    /** @builder */
    export const on = <Fn>(fn: Fn): TestBuilder<{ fn: Fn }> => null as any
    interface TestBuilder<State> {
      test(): void
      run(): void
    }
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type
  expect(builderSig.terminalMethods).toHaveLength(2)
  expect(builderSig.terminalMethods[0]).toMatchObject({
    name: 'test',
    category: 'terminal',
  })
  expect(builderSig.terminalMethods[1]).toMatchObject({
    name: 'run',
    category: 'terminal',
  })
})

test('builder with transform methods', () => {
  const sig = extractFromSource(`
    /** @builder */
    export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
      return null as any
    }
    interface TestBuilder<State> {
      layer<R>(layer: any): TestBuilderWithLayers<State, R>
    }
    interface TestBuilderWithLayers<State, R> {}
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type
  expect(builderSig.transformMethods).toHaveLength(1)
  expect(builderSig.transformMethods[0]).toMatchObject({
    name: 'layer',
    category: 'transform',
    transformsTo: 'TestBuilderWithLayers',
  })
})

test('builder with mixed method types', () => {
  const sig = extractFromSource(`
    /** @builder */
    export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
      return null as any
    }
    interface TestBuilder<State> {
      inputType<I>(): TestBuilder<State & { input: I }>
      cases(...cases: any[]): TestBuilder<State>
      test(): void
      layer<R>(layer: any): OtherBuilder<State, R>
    }
    interface OtherBuilder<State, R> {}
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type
  expect(builderSig.typeName).toBe('TestBuilder')
  expect(builderSig.chainableMethods).toHaveLength(2)
  expect(builderSig.terminalMethods).toHaveLength(1)
  expect(builderSig.transformMethods).toHaveLength(1)
})

test('builder with method overloads', () => {
  const sig = extractFromSource(`
    /** @builder */
    export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
      return null as any
    }
    interface TestBuilder<State> {
      test(): void
      test(fn: (params: any) => void): void
    }
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type
  expect(builderSig.terminalMethods).toHaveLength(1)
  const testMethod = builderSig.terminalMethods[0]!
  expect(testMethod.name).toBe('test')
  expect(testMethod.overloads).toHaveLength(2)
  expect(testMethod.overloads[0]).toMatchObject({
    parameters: [],
    returnType: 'void',
  })
  expect(testMethod.overloads[1]).toMatchObject({
    parameters: [{ name: 'fn', type: '(params: any) => void' }],
    returnType: 'void',
  })
})

test('builder Effect Schema classes validation', () => {
  const sig = extractFromSource(`
    /** @builder */
    export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
      return null as any
    }
    interface TestBuilder<State> {
      inputType<I>(): TestBuilder<State & { input: I }>
      test(): void
    }
  `)

  expect(sig._tag).toBe('BuilderSignatureModel')
  const builderSig = sig as typeof BuilderSignatureModel.Type

  // Verify nested classes are proper instances
  expect(builderSig).toBeInstanceOf(BuilderSignatureModel)
  expect(builderSig.entryPoint).toBeInstanceOf(FunctionSignature)
  expect(builderSig.chainableMethods[0]).toBeInstanceOf(BuilderMethod)
  expect(builderSig.terminalMethods[0]).toBeInstanceOf(BuilderMethod)
})

// @param/@returns/@throws tests
test('@param documentation', () => {
  const sig = extractFromSource(`
    /**
     * @param items - Array of items to process
     * @param fn - Transform function
     */
    export function map<T, U>(items: T[], fn: (item: T) => U): U[] {
      return items.map(fn)
    }
  `)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  const overload = fnSig.overloads[0]!
  expect(overload.parameters[0]?.description).toBe('Array of items to process')
  expect(overload.parameters[1]?.description).toBe('Transform function')
})

test('@returns documentation', () => {
  const sig = extractFromSource(`
    /**
     * @param value - Input value
     * @returns The doubled value
     */
    export function double(value: number): number {
      return value * 2
    }
  `)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  const overload = fnSig.overloads[0]!
  expect(overload.returnDoc).toBe('The doubled value')
})

test('@throws documentation', () => {
  const sig = extractFromSource(`
    /**
     * @param value - Input value
     * @throws Error if value is negative
     * @throws TypeError if value is not a number
     */
    export function process(value: number): number {
      if (value < 0) throw new Error('negative')
      return value
    }
  `)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  const overload = fnSig.overloads[0]!
  expect(overload.throws).toHaveLength(2)
  expect(overload.throws[0]).toBe('Error if value is negative')
  expect(overload.throws[1]).toBe('TypeError if value is not a number')
})

test('@param/@returns/@throws combined', () => {
  const sig = extractFromSource(`
    /**
     * Parse a configuration file.
     * @param path - File path to parse
     * @param options - Parsing options
     * @returns Parsed configuration object
     * @throws Error if file not found
     * @throws SyntaxError if file is invalid
     */
    export function parseConfig(path: string, options?: { strict?: boolean }): Config {
      return {} as Config
    }
    interface Config {}
  `)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  const overload = fnSig.overloads[0]!

  expect(overload.parameters[0]?.description).toBe('File path to parse')
  expect(overload.parameters[1]?.description).toBe('Parsing options')
  expect(overload.returnDoc).toBe('Parsed configuration object')
  expect(overload.throws).toEqual([
    'Error if file not found',
    'SyntaxError if file is invalid',
  ])
})

test('function with overloads preserves JSDoc per-overload', () => {
  const sig = extractFromSource(`
    /**
     * Parse from string.
     * @param input - String to parse
     * @returns Parsed config
     */
    export function parse(input: string): Config
    /**
     * Parse from buffer.
     * @param input - Buffer to parse
     * @returns Parsed config
     * @throws Error if buffer is invalid
     */
    export function parse(input: Buffer): Config
    export function parse(input: unknown): Config {
      return {} as Config
    }
    interface Config {}
  `)

  expect(sig._tag).toBe('FunctionSignatureModel')
  const fnSig = sig as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads).toHaveLength(3)

  // First overload (string)
  expect(fnSig.overloads[0]?.parameters[0]?.description).toBe('String to parse')
  expect(fnSig.overloads[0]?.returnDoc).toBe('Parsed config')
  expect(fnSig.overloads[0]?.throws).toEqual([])

  // Second overload (Buffer)
  expect(fnSig.overloads[1]?.parameters[0]?.description).toBe('Buffer to parse')
  expect(fnSig.overloads[1]?.returnDoc).toBe('Parsed config')
  expect(fnSig.overloads[1]?.throws).toEqual(['Error if buffer is invalid'])
})

// Class extraction tests
test('class with constructor, properties, and methods', () => {
  const sig = extractFromSource(`
    export class User {
      /** User's unique identifier */
      readonly id: string
      /** User's display name */
      name: string
      /** Optional email address */
      email?: string
      /** Number of users created */
      static count: number = 0

      /**
       * Create a new user.
       * @param id - User ID
       * @param name - User name
       */
      constructor(id: string, name: string) {
        this.id = id
        this.name = name
      }

      /** Get the user's name */
      getName(): string {
        return this.name
      }

      /** Create a new user with random ID */
      static create(name: string): User {
        return new User('id', name)
      }
    }
  `)

  expect(sig._tag).toBe('ClassSignatureModel')
  const classSig = sig as typeof ClassSignatureModel.Type

  // Constructor
  expect(classSig.ctor).toBeDefined()
  expect(classSig.ctor?.parameters).toHaveLength(2)
  expect(classSig.ctor?.parameters[0]?.name).toBe('id')
  expect(classSig.ctor?.parameters[0]?.description).toBe('User ID')
  expect(classSig.ctor?.parameters[1]?.name).toBe('name')
  expect(classSig.ctor?.parameters[1]?.description).toBe('User name')
  expect(classSig.ctor?.returnType).toBe('User')

  // Properties
  expect(classSig.properties).toHaveLength(4)

  const idProp = classSig.properties.find((p) => p.name === 'id')
  expect(idProp?.type).toBe('string')
  expect(idProp?.readonly).toBe(true)
  expect(idProp?.optional).toBe(false)
  expect(idProp?.static).toBe(false)
  expect(idProp?.description).toBe("User's unique identifier")

  const emailProp = classSig.properties.find((p) => p.name === 'email')
  expect(emailProp?.optional).toBe(true)
  expect(emailProp?.description).toBe('Optional email address')

  const countProp = classSig.properties.find((p) => p.name === 'count')
  expect(countProp?.static).toBe(true)
  expect(countProp?.description).toBe('Number of users created')

  // Methods
  expect(classSig.methods).toHaveLength(2)

  const getNameMethod = classSig.methods.find((m) => m.name === 'getName')
  expect(getNameMethod?.static).toBe(false)
  expect(getNameMethod?.overloads).toHaveLength(1)
  expect(getNameMethod?.overloads[0]?.returnType).toBe('string')

  const createMethod = classSig.methods.find((m) => m.name === 'create')
  expect(createMethod?.static).toBe(true)
  expect(createMethod?.overloads).toHaveLength(1)
  expect(createMethod?.overloads[0]?.parameters).toHaveLength(1)
  expect(createMethod?.overloads[0]?.returnType).toBe('User')
})
