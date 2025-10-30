/**
 * Comprehensive snapshot tests for the new TypeScript code generation API.
 *
 * This test suite defines the target API we're implementing.
 * Tests are organized by feature area and use snapshots to verify output.
 */

import { describe, expect, test } from 'vitest'
import * as TS from './_.js'

describe('Basic Literals', () => {
  test('string literal', () => {
    expect(TS.string('hello')).toMatchInlineSnapshot(`""hello""`)
  })

  test('number literal', () => {
    expect(TS.number(42)).toMatchInlineSnapshot(`"42"`)
  })

  test('boolean literals', () => {
    expect(TS.boolean(true)).toMatchInlineSnapshot(`"true"`)
    expect(TS.boolean(false)).toMatchInlineSnapshot(`"false"`)
  })

  test('null literal', () => {
    expect(TS.nullLiteral()).toMatchInlineSnapshot(`"null"`)
  })

  test('undefined literal', () => {
    expect(TS.undefinedLiteral()).toMatchInlineSnapshot(`"undefined"`)
  })
})

describe('Array Generation', () => {
  test('arrayLiteral - simple values', () => {
    expect(TS.arrayLiteral(['a', 'b', 'c'])).toMatchInlineSnapshot(`"[a, b, c]"`)
  })

  test('arrayLiteral - empty', () => {
    expect(TS.arrayLiteral([])).toMatchInlineSnapshot(`"[]"`)
  })

  test('arrayType - generic Array<T>', () => {
    expect(TS.arrayType('string')).toMatchInlineSnapshot(`"Array<string>"`)
    expect(TS.arrayType('User')).toMatchInlineSnapshot(`"Array<User>"`)
  })

  test('arrayType - nested arrays', () => {
    expect(TS.arrayType(TS.arrayType('string'))).toMatchInlineSnapshot(`"Array<Array<string>>"`)
  })
})

describe('Object Generation - Core API', () => {
  test('object - from plain object', () => {
    expect(TS.object({
      id: 'string',
      name: 'string',
      age: 'number',
    })).toMatchInlineSnapshot(`
      "{
      id: string,
      name: string,
      age: number
      }"
    `)
  })

  test('object - empty', () => {
    expect(TS.object({})).toMatchInlineSnapshot(`"{}"`)
  })

  test('object - nested objects', () => {
    expect(TS.object({
      user: TS.object({
        id: 'string',
        name: 'string',
      }),
      meta: TS.object({
        created: 'Date',
        updated: 'Date',
      }),
    })).toMatchInlineSnapshot(`
      "{
      user: {
      id: string,
      name: string
      },
      meta: {
      created: Date,
      updated: Date
      }
      }"
    `)
  })

  test('object - from tuples', () => {
    expect(TS.object([
      ['id', 'string'],
      ['name', 'string'],
    ])).toMatchInlineSnapshot(`
      "{
      id: string,
      name: string
      }"
    `)
  })

  test('object - with spread', () => {
    expect(TS.object({
      $spread: ['BaseType', 'Mixin'],
      $fields: {
        id: 'string',
        name: 'string',
      },
    })).toMatchInlineSnapshot(`
      "{
      ...BaseType,
      ...Mixin,
      id: string,
      name: string
      }"
    `)
  })

  test('object - with literal injection', () => {
    expect(TS.object({
      $literal: '// Custom comment',
      $fields: {
        id: 'string',
      },
    })).toMatchInlineSnapshot(`
      "{

      id: string
      // Custom comment
      }"
    `)
  })

  test('object - with directive fields (optional, tsDoc)', () => {
    expect(TS.object({
      id: TS.objectField$({
        value: 'string',
        tsDoc: 'User ID',
        optional: false,
      }),
      name: TS.objectField$({
        value: 'string',
        tsDoc: 'User name',
        optional: true,
      }),
    })).toMatchInlineSnapshot(`
      "{
      /**
      * User ID
      */
      id: string,
      /**
      * User name
      */
      name?: string
      }"
    `)
  })
})

describe('Field Generation', () => {
  test('field - simple', () => {
    expect(TS.field('name', 'string')).toMatchInlineSnapshot(`"name: string"`)
  })

  test('field - with TermObject type', () => {
    expect(TS.field(
      'user',
      TS.object({
        id: 'string',
        name: 'string',
      }),
    )).toMatchInlineSnapshot(`
      "user: {
      id: string,
      name: string
      }"
    `)
  })

  test('field - optional', () => {
    expect(TS.field('name', 'string', { optional: true })).toMatchInlineSnapshot(`"name?: string"`)
  })

  test('field - readonly', () => {
    expect(TS.field('id', 'string', { readonly: true })).toMatchInlineSnapshot(`"readonly id: string"`)
  })

  test('field - with tsDoc', () => {
    expect(TS.field('id', 'string', {
      tsDoc: 'Unique identifier',
    })).toMatchInlineSnapshot(`
      "/**
      * Unique identifier
      */
      id: string"
    `)
  })

  test('field - all options', () => {
    expect(TS.field('metadata', TS.object({ key: 'string' }), {
      optional: true,
      readonly: true,
      tsDoc: 'Optional metadata',
    })).toMatchInlineSnapshot(`
      "/**
      * Optional metadata
      */
      readonly metadata?: {
      key: string
      }"
    `)
  })
})

describe('Const Declarations', () => {
  test('constDecl - simple', () => {
    expect(TS.constDecl('user', '"Alice"')).toMatchInlineSnapshot(`"const user = "Alice""`)
  })

  test('constDecl - with TermObject', () => {
    expect(TS.constDecl(
      'user',
      TS.object({
        id: '"123"',
        name: '"Alice"',
      }),
    )).toMatchInlineSnapshot(`
      "const user = {
      id: "123",
      name: "Alice"
      }"
    `)
  })

  test('constDeclTyped - with type annotation', () => {
    expect(TS.constDeclTyped('count', 'number', '0')).toMatchInlineSnapshot(`"const count: number = 0"`)
  })

  test('constDeclTyped - with TermObject value', () => {
    expect(TS.constDeclTyped(
      'config',
      'Config',
      TS.object({
        timeout: '5000',
        retries: '3',
      }),
    )).toMatchInlineSnapshot(`
      "const config: Config = {
      timeout: 5000,
      retries: 3
      }"
    `)
  })
})

describe('Type Aliases', () => {
  test('typeAlias - simple', () => {
    expect(TS.typeAlias('UserId', 'string')).toMatchInlineSnapshot(`"type UserId = string"`)
  })

  test('typeAlias - with TermObject', () => {
    expect(TS.typeAlias(
      'User',
      TS.object({
        id: 'string',
        name: 'string',
      }),
    )).toMatchInlineSnapshot(`
      "type User = {
      id: string,
      name: string
      }"
    `)
  })

  test('typeAlias$ - with options', () => {
    expect(TS.typeAlias$({
      name: 'Point',
      type: TS.object({ x: 'number', y: 'number' }),
      export: true,
    })).toMatchInlineSnapshot(`
      "export type Point = {
      x: number,
      y: number
      }"
    `)
  })

  test('typeAlias$ - with tsDoc', () => {
    expect(TS.typeAlias$({
      name: 'UserId',
      type: 'string',
      tsDoc: 'Unique user identifier',
      export: true,
    })).toMatchInlineSnapshot(`
      "/**
      * Unique user identifier
      */
      export type UserId = string"
    `)
  })

  test('typeAlias$ - with type parameters', () => {
    expect(TS.typeAlias$({
      name: 'Result',
      type: TS.object({ value: 'T', error: 'E' }),
      parameters: ['T', 'E = Error'],
    })).toMatchInlineSnapshot(`
      "export type Result<T, E = Error> = {
      value: T,
      error: E
      }"
    `)
  })
})

describe('Interface Declarations', () => {
  test('interfaceDecl - simple', () => {
    expect(TS.interfaceDecl({
      name: 'User',
      block: TS.object({ id: 'string', name: 'string' }),
    })).toMatchInlineSnapshot(`
      "export interface User {
      {
      id: string,
      name: string
      }
      }"
    `)
  })

  test('interfaceDecl - with plain object block', () => {
    expect(TS.interfaceDecl({
      name: 'User',
      block: { id: 'string', name: 'string' },
    })).toMatchInlineSnapshot(`
      "export interface User {
      id: string,
      name: string
      }"
    `)
  })

  test('interfaceDecl - with extends', () => {
    expect(TS.interfaceDecl({
      name: 'Admin',
      extends: ['User', 'Auditable'],
      block: { permissions: 'string[]' },
    })).toMatchInlineSnapshot(`
      "export interface Admin extends User, Auditable {
      permissions: string[]
      }"
    `)
  })

  test('interfaceDecl - with parameters', () => {
    expect(TS.interfaceDecl({
      name: 'Container',
      parameters: ['T'],
      block: { value: 'T' },
    })).toMatchInlineSnapshot(`
      "export interface Container<T> {
      value: T
      }"
    `)
  })

  test('interfaceDecl - with tsDoc', () => {
    expect(TS.interfaceDecl({
      name: 'User',
      block: { id: 'string' },
      tsDoc: 'Represents a user in the system',
      export: true,
    })).toMatchInlineSnapshot(`
      "/**
      * Represents a user in the system
      */
      export interface User {
      id: string
      }"
    `)
  })

  test('interfaceDecl - from tuples', () => {
    expect(TS.interfaceDecl({
      name: 'Point',
      block: [['x', 'number'], ['y', 'number']],
    })).toMatchInlineSnapshot(`
      "export interface Point {
      x: number,
      y: number
      }"
    `)
  })
})

describe('Namespace Declarations', () => {
  test('namespace - simple', () => {
    expect(TS.namespace('Utils', 'export const foo = 1')).toMatchInlineSnapshot(`
      "namespace Utils {
      export const foo = 1
      }"
    `)
  })

  test('namespace - with reserved keyword escaping', () => {
    expect(TS.namespace('interface', 'export const foo = 1', {
      escapeReserved: true,
    })).toMatchInlineSnapshot(`
      "namespace $interface {
      export const foo = 1
      }"
    `)
  })

  test('namespace - no escaping when disabled', () => {
    expect(TS.namespace('MyNamespace', 'export const foo = 1', {
      escapeReserved: false,
    })).toMatchInlineSnapshot(`
      "namespace MyNamespace {
      export const foo = 1
      }"
    `)
  })
})

describe('Composition - Kitchen Sink', () => {
  test('deeply nested composition', () => {
    expect(TS.object({
      user: TS.object({
        id: 'string',
        profile: TS.object({
          name: 'string',
          avatar: 'string',
        }),
        settings: TS.object({
          theme: '"light" | "dark"',
          notifications: 'boolean',
        }),
      }),
      metadata: TS.object({
        created: 'Date',
        tags: TS.arrayType('string'),
      }),
    })).toMatchInlineSnapshot(`
      "{
      user: {
      id: string,
      profile: {
      name: string,
      avatar: string
      },
      settings: {
      theme: "light" | "dark",
      notifications: boolean
      }
      },
      metadata: {
      created: Date,
      tags: Array<string>
      }
      }"
    `)
  })

  test('const with complex nested object', () => {
    expect(TS.constDecl(
      'config',
      TS.object({
        api: TS.object({
          endpoint: '"/api/v1"',
          timeout: '5000',
          headers: TS.object({
            'Content-Type': '"application/json"',
            'Authorization': '"Bearer token"',
          }),
        }),
        features: TS.object({
          darkMode: 'true',
          analytics: 'false',
        }),
      }),
    )).toMatchInlineSnapshot(`
      "const config = {
      api: {
      endpoint: "/api/v1",
      timeout: 5000,
      headers: {
      Content-Type: "application/json",
      Authorization: "Bearer token"
      }
      },
      features: {
      darkMode: true,
      analytics: false
      }
      }"
    `)
  })

  test('interface with nested objects and arrays', () => {
    expect(TS.interfaceDecl({
      name: 'ApiResponse',
      parameters: ['T'],
      block: {
        data: 'T',
        meta: TS.object({
          page: 'number',
          total: 'number',
        }),
        links: TS.object({
          self: 'string',
          next: 'string | null',
        }),
        errors: TS.arrayType(TS.object({
          code: 'string',
          message: 'string',
        })),
      },
    })).toMatchInlineSnapshot(`
      "export interface ApiResponse<T> {
      data: T,
      meta: {
      page: number,
      total: number
      },
      links: {
      self: string,
      next: string | null
      },
      errors: Array<{
      code: string,
      message: string
      }>
      }"
    `)
  })
})

describe('Builder Pattern', () => {
  test('builder - simple interface', () => {
    const code = TS.builder()
    code.interface({
      name: 'User',
      block: { id: 'string', name: 'string' },
      export: true,
    })
    expect(code.build()).toMatchInlineSnapshot(`
      "export interface User {
      {
      id: string,
      name: string
      }
      }"
    `)
  })

  test('builder - multiple declarations', () => {
    const code = TS.builder()
    code.interface({
      name: 'User',
      block: { id: 'string', name: 'string' },
      export: true,
    })
    code.type({
      name: 'UserId',
      type: 'string',
      export: true,
    })
    code.const(
      'defaultUser',
      TS.object({
        id: '"0"',
        name: '"Guest"',
      }),
      { export: true },
    )
    expect(code.build()).toMatchInlineSnapshot(`
      "export interface User {
      {
      id: string,
      name: string
      }
      }
      export type UserId = string
      export const defaultUser = {
      id: "0",
      name: "Guest"
      }"
    `)
  })

  test('builder - with template strings', () => {
    const code = TS.builder()
    code`// Custom header comment`
    code.interface({ name: 'User', block: { id: 'string' } })
    code`// Footer comment`
    expect(code.build()).toMatchInlineSnapshot(`
      "// Custom header comment
      export interface User {
      {
      id: string
      }
      }
      // Footer comment"
    `)
  })

  test('builder - with nested composition', () => {
    const code = TS.builder()
    code.const(
      'config',
      TS.object({
        database: TS.object({
          host: '"localhost"',
          port: '5432',
        }),
        cache: TS.object({
          enabled: 'true',
          ttl: '3600',
        }),
      }),
      { export: true },
    )
    expect(code.build()).toMatchInlineSnapshot(`
      "export const config = {
      database: {
      host: "localhost",
      port: 5432
      },
      cache: {
      enabled: true,
      ttl: 3600
      }
      }"
    `)
  })

  test('builder - namespace with builder callback', () => {
    const code = TS.builder()
    code.namespace('Utils', (b) => {
      b.const('VERSION', '"1.0.0"', { export: true })
      b.function({
        name: 'helper',
        params: [],
        returnType: 'void',
        body: 'console.log("helper")',
        export: true,
      })
    })
    expect(code.build()).toMatchInlineSnapshot(`
      "namespace Utils {
      export const VERSION = "1.0.0"
      export function helper(): void {
      console.log("helper")
      }
      }"
    `)
  })
})

describe('Template Function', () => {
  test('template - with Raw interpolation', () => {
    const userInterface = TS.interface$({
      name: 'User',
      block: { id: 'string', name: 'string' },
      export: true,
    })

    const result = TS.template`
      ${userInterface}

      export const defaultUser: User = { id: "0", name: "Guest" }
    `
    expect(result).toMatchInlineSnapshot(`
      "
            export interface User {
      id: string,
      name: string
      }

            export const defaultUser: User = { id: "0", name: "Guest" }
          "
    `)
  })

  test('template - with composed objects', () => {
    const result = TS.template`
      export const config = ${
      TS.object({
        api: TS.object({
          url: '"/api"',
          timeout: '5000',
        }),
      })
    }
    `
    expect(result).toMatchInlineSnapshot(`
      "
            export const config = {
      api: {
      url: "/api",
      timeout: 5000
      }
      }
          "
    `)
  })

  test('template - multiple declarations', () => {
    const typeDecl = TS.typeAlias$({
      name: 'UserId',
      type: 'string',
      export: true,
    })
    const interfaceDecl = TS.interface$({
      name: 'User',
      block: { id: 'UserId', name: 'string' },
      export: true,
    })

    const result = TS.template`
      ${typeDecl}
      ${interfaceDecl}
    `
    expect(result).toMatchInlineSnapshot(`
      "
            export type UserId = string
            export interface User {
      id: UserId,
      name: string
      }
          "
    `)
  })
})

describe('Factory Function', () => {
  test('factory - simple interface generator', () => {
    const generateInterface = TS.factory<[name: string, fields: Record<string, string>]>((b, name, fields) => {
      b.interface({
        name,
        block: fields,
        export: true,
      })
    })

    expect(generateInterface('User', { id: 'string', name: 'string' })).toMatchInlineSnapshot(`
      "export interface User {
      {
      id: string,
      name: string
      }
      }"
    `)
    expect(generateInterface('Post', { title: 'string', body: 'string' })).toMatchInlineSnapshot(`
      "export interface Post {
      {
      title: string,
      body: string
      }
      }"
    `)
  })

  test('factory - with nested composition', () => {
    const generateConfig = TS.factory<[serviceName: string]>((b, serviceName) => {
      b.const(
        `${serviceName}Config`,
        TS.object({
          service: `"${serviceName}"`,
          endpoint: '"/api"',
          settings: TS.object({
            timeout: '5000',
            retries: '3',
          }),
        }),
        { export: true },
      )
    })

    expect(generateConfig('auth')).toMatchInlineSnapshot(`
      "export const authConfig = {
      service: "auth",
      endpoint: "/api",
      settings: {
      timeout: 5000,
      retries: 3
      }
      }"
    `)
    expect(generateConfig('api')).toMatchInlineSnapshot(`
      "export const apiConfig = {
      service: "api",
      endpoint: "/api",
      settings: {
      timeout: 5000,
      retries: 3
      }
      }"
    `)
  })

  test('factory - complex multi-declaration', () => {
    const generateModule = TS.factory<[entityName: string]>((b, entityName) => {
      b.type({
        name: `${entityName}Id`,
        type: 'string',
        export: true,
      })
      b.interface({
        name: entityName,
        block: {
          id: `${entityName}Id`,
          createdAt: 'Date',
          updatedAt: 'Date',
        },
        export: true,
      })
      b.const(
        `default${entityName}`,
        TS.object({
          id: '"0"',
          createdAt: 'new Date()',
          updatedAt: 'new Date()',
        }),
        { export: true },
      )
    })

    expect(generateModule('User')).toMatchInlineSnapshot(`
      "export type UserId = string
      export interface User {
      {
      id: UserId,
      createdAt: Date,
      updatedAt: Date
      }
      }
      export const defaultUser = {
      id: "0",
      createdAt: new Date(),
      updatedAt: new Date()
      }"
    `)
  })
})

describe('Reserved Keyword Handling', () => {
  test('interface with reserved name', () => {
    expect(TS.interfaceDecl({
      name: 'interface',
      block: { id: 'string' },
      export: true,
    })).toMatchInlineSnapshot(`
      "interface $interface {
      id: string
      }
      export { type $interface as interface }"
    `)
  })

  test('type alias with reserved name', () => {
    expect(TS.typeAlias$({
      name: 'class',
      type: 'string',
      export: true,
    })).toMatchInlineSnapshot(`
      "type $class = string
      export { type $class as class }"
    `)
  })

  test('namespace with reserved name', () => {
    expect(TS.namespace('interface', 'export const foo = 1', {
      escapeReserved: true,
    })).toMatchInlineSnapshot(`
      "namespace $interface {
      export const foo = 1
      }"
    `)
  })

  test('multiple reserved keywords', () => {
    const code = TS.builder()
    code.interface({ name: 'interface', block: { id: 'string' }, export: true })
    code.interface({ name: 'class', block: { name: 'string' }, export: true })
    code.interface({ name: 'function', block: { type: 'string' }, export: true })
    expect(code.build()).toMatchInlineSnapshot(`
      "interface $interface {
      {
      id: string
      }
      }
      export { type $interface as interface }
      interface $class {
      {
      name: string
      }
      }
      export { type $class as class }
      interface $function {
      {
      type: string
      }
      }
      export { type $function as function }"
    `)
  })
})

describe('Edge Cases', () => {
  test('empty object', () => {
    expect(TS.object({})).toMatchInlineSnapshot(`"{}"`)
  })

  test('empty array', () => {
    expect(TS.arrayLiteral([])).toMatchInlineSnapshot(`"[]"`)
  })

  test('null values in object', () => {
    expect(TS.object({
      id: 'string',
      deleted: 'null',
    })).toMatchInlineSnapshot(`
      "{
      id: string,
      deleted: null
      }"
    `)
  })

  test('deeply nested empty objects', () => {
    expect(TS.object({
      a: TS.object({
        b: TS.object({}),
      }),
    })).toMatchInlineSnapshot(`
      "{
      a: {
      b: {}
      }
      }"
    `)
  })

  test('interface with no block', () => {
    expect(TS.interfaceDecl({
      name: 'Empty',
      export: true,
    })).toMatchInlineSnapshot(`"export interface Empty {}"`)
  })
})

describe('Backwards Compatibility Shims', () => {
  test('list renamed to arrayLiteral but kept as alias', () => {
    expect(TS.list).toBeDefined()
    expect(TS.list(['a', 'b'])).toEqual(TS.arrayLiteral(['a', 'b']))
  })
})
