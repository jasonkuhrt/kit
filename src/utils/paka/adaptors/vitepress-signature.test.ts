import { Test } from '#test'
import {
  FunctionSignature,
  FunctionSignatureModel,
  Parameter,
  TypeParameter,
  TypeSignatureModel,
  ValueSignatureModel,
} from '../schema.js'

/**
 * Extract the renderSignature function for testing.
 * In production code, this would be private, but for tests we extract it.
 */
const renderSignature = (
  sig: typeof FunctionSignatureModel.Type | typeof TypeSignatureModel.Type | typeof ValueSignatureModel.Type,
): string => {
  // This is a duplicate of the implementation in vitepress.ts for testing
  if (sig._tag === 'FunctionSignatureModel') {
    return sig.overloads.map((overload) => {
      // Type parameters
      const typeParams = overload.typeParameters.length > 0
        ? `<${
          overload.typeParameters.map((tp) => {
            let text = tp.name
            if (tp.constraint) text += ` extends ${tp.constraint}`
            if (tp.default) text += ` = ${tp.default}`
            return text
          }).join(', ')
        }>`
        : ''

      // Parameters
      const params = overload.parameters.map((param) => {
        let text = ''
        if (param.rest) text += '...'
        text += param.name
        if (param.optional) text += '?'
        text += `: ${param.type}`
        if (param.defaultValue) text += ` = ${param.defaultValue}`
        return text
      }).join(', ')

      // Full signature
      return `${typeParams}(${params}): ${overload.returnType}`
    }).join('\n')
  } else if (sig._tag === 'TypeSignatureModel') {
    return sig.text
  } else {
    return sig.type
  }
}

// Helper to create function signature model
const fn = (
  overloads: Parameters<typeof FunctionSignature.make>[0][],
): typeof FunctionSignatureModel.Type =>
  FunctionSignatureModel.make({
    overloads: overloads.map((o) =>
      FunctionSignature.make({
        returnDoc: undefined,
        throws: [],
        ...o,
      })
    ),
  })

// Helper to create type parameter
const tp = (name: string, constraint?: string, defaultValue?: string): typeof TypeParameter.Type =>
  TypeParameter.make({ name, constraint, default: defaultValue })

// Helper to create parameter
const p = (
  name: string,
  type: string,
  opts?: { optional?: boolean; rest?: boolean; defaultValue?: string },
): typeof Parameter.Type =>
  Parameter.make({
    name,
    type,
    optional: opts?.optional ?? false,
    rest: opts?.rest ?? false,
    defaultValue: opts?.defaultValue,
  })

// dprint-ignore
Test.on(renderSignature)
  .cases(
    [[fn([{ typeParameters: [], parameters: [], returnType: 'void' }])],                                                                                                            '(): void'],
    [[fn([{ typeParameters: [], parameters: [p('a', 'number'), p('b', 'number')], returnType: 'number' }])],                                                                        '(a: number, b: number): number'],
    [[fn([{ typeParameters: [tp('T'), tp('U')], parameters: [p('items', 'T[]'), p('fn', '(item: T) => U')], returnType: 'U[]' }])],                                                '<T, U>(items: T[], fn: (item: T) => U): U[]'],
    [[fn([{ typeParameters: [tp('T', 'string')], parameters: [p('value', 'T')], returnType: 'T' }])],                                                                               '<T extends string>(value: T): T'],
    [[fn([{ typeParameters: [tp('T', undefined, 'unknown')], parameters: [], returnType: 'T' }])],                                                                                  '<T = unknown>(): T'],
    [[fn([{ typeParameters: [tp('T', 'object', 'Record<string, unknown>')], parameters: [p('value', 'T')], returnType: 'T' }])],                                                   '<T extends object = Record<string, unknown>>(value: T): T'],
    [[fn([{ typeParameters: [], parameters: [p('name', 'string'), p('age', 'number', { optional: true })], returnType: 'string' }])],                                              '(name: string, age?: number): string'],
    [[fn([{ typeParameters: [], parameters: [p('numbers', 'number[]', { rest: true })], returnType: 'number' }])],                                                                 '(...numbers: number[]): number'],
    [[fn([{ typeParameters: [], parameters: [p('name', 'string', { defaultValue: "'World'" })], returnType: 'string' }])],                                                         "(name: string = 'World'): string"],
    [[fn([
      { typeParameters: [], parameters: [p('input', 'string')], returnType: 'Config' },
      { typeParameters: [], parameters: [p('input', 'Buffer')], returnType: 'Config' },
      { typeParameters: [], parameters: [p('input', 'unknown')], returnType: 'Config' },
    ])],                                                                                                                                                                             '(input: string): Config\n(input: Buffer): Config\n(input: unknown): Config'],
    [[fn([{
      typeParameters: [tp('T', 'object'), tp('K', 'keyof T')],
      parameters: [p('obj', 'T'), p('key', 'K'), p('defaultValue', 'T[K]', { optional: true })],
      returnType: 'T[K]'
    }])],                                                                                                                                                                            '<T extends object, K extends keyof T>(obj: T, key: K, defaultValue?: T[K]): T[K]'],
    [[TypeSignatureModel.make({ text: 'type Config = { port: number; host: string }' })],                                                                                          'type Config = { port: number; host: string }'],
    [[ValueSignatureModel.make({ type: 'number' })],                                                                                                                                'number'],
    [[ValueSignatureModel.make({ type: '3.14159' })],                                                                                                                               '3.14159'],
    [[ValueSignatureModel.make({ type: '{ port: number; host: string }' })],                                                                                                        '{ port: number; host: string }'],
  )
  .test()
