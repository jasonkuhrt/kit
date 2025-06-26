import * as fc from 'fast-check'
import { describe, expect, test } from 'vitest'
import { Registry } from '../registry/$.ts'
import { createTraitDispatcher, createTraitProxy } from './dispatcher.ts'

describe('dispatchOrThrow', () => {
  test('dispatches to correct implementation', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Num', {
      is: (a: number, b: number) => a === b,
    })

    const result = createTraitDispatcher(registry.data, 'Eq')('is')(42, 42)
    expect(result).toBe(true)

    const result2 = createTraitDispatcher(registry.data, 'Eq')('is')(42, 43)
    expect(result2).toBe(false)
  })

  test('uses first argument to determine domain', () => {
    const registry = Registry.create()
    let calledWith: string | null = null

    Registry.register(registry.data, 'Test', 'Str', {
      method: (s: string) => {
        calledWith = 'Str'
        return s
      },
    })
    Registry.register(registry.data, 'Test', 'Num', {
      method: (n: number) => {
        calledWith = 'Num'
        return n
      },
    })

    createTraitDispatcher(registry.data, 'Test')('method')('hello')
    expect(calledWith).toBe('Str')

    createTraitDispatcher(registry.data, 'Test')('method')(42)
    expect(calledWith).toBe('Num')
  })

  test('passes all arguments to implementation', () => {
    const registry = Registry.create()
    let receivedArgs: any[] = []

    Registry.register(registry.data, 'Test', 'Arr', {
      concat: (...args: any[]) => {
        receivedArgs = args
        return args[0].concat(...args.slice(1))
      },
    })

    const result = createTraitDispatcher(registry.data, 'Test')('concat')([1], [2], [3])
    expect(receivedArgs).toEqual([[1], [2], [3]])
    expect(result).toEqual([1, 2, 3])
  })

  test('supports this context', () => {
    const registry = Registry.create()
    const context = { multiplier: 10 }

    Registry.register(registry.data, 'Test', 'Num', {
      multiply: function(this: typeof context, n: number) {
        return n * this.multiplier
      },
    })

    const result = createTraitDispatcher(registry.data, 'Test', context)('multiply')(5)
    expect(result).toBe(50)
  })

  test('throws for non-existent trait', () => {
    const registry = Registry.create()

    expect(() => createTraitDispatcher(registry.data, 'NonExistent')('method')(42)).toThrow(
      'Trait "NonExistent" not found in registry',
    )
  })

  test('throws for non-registered domain', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Str', { is: () => true })

    expect(() => createTraitDispatcher(registry.data, 'Eq')('is')(42) // Number, not String
    ).toThrow('Domain "Num" not registered for trait "Eq"')
  })

  test('throws for non-existent method', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Eq', 'Num', { is: () => true })

    expect(() => createTraitDispatcher(registry.data, 'Eq')('compare')(42, 43)).toThrow(
      'Method "compare" not found for domain "Num" in trait "Eq"',
    )
  })
})

describe('create', () => {
  test('creates a proxy that dispatches method calls', () => {
    const registry = Registry.create()
    Registry.register(registry.data, 'Math', 'Num', {
      add: (a: number, b: number) => a + b,
      multiply: (a: number, b: number) => a * b,
    })

    const Math = createTraitProxy(registry.data, 'Math') as any

    expect(Math.add(2, 3)).toBe(5)
    expect(Math.multiply(4, 5)).toBe(20)
  })

  test('caches method dispatchers', () => {
    const registry = Registry.create()
    let callCount = 0

    // Mock dispatchOrThrow to count calls
    const _originalRegister = Registry.register
    Registry.register(registry.data, 'Test', 'Num', {
      method: () => {
        callCount++
        return 'result'
      },
    })

    const Test = createTraitProxy(registry.data, 'Test') as any

    // First call
    const method1 = Test.method
    const result1 = method1(42)
    expect(result1).toBe('result')
    expect(callCount).toBe(1)

    // Second call - should use cached dispatcher
    const method2 = Test.method
    expect(method1).toBe(method2) // Same function reference
    const result2 = method2(42)
    expect(result2).toBe('result')
    expect(callCount).toBe(2) // Called again, but same dispatcher function
  })

  test('handles non-string properties gracefully', () => {
    const registry = Registry.create()
    const Test = createTraitProxy(registry.data, 'Test') as any

    // Symbol properties should return undefined
    expect(Test[Symbol.toStringTag]).toBeUndefined()
    expect(Test[Symbol.iterator]).toBeUndefined()
  })

  test('forwards all arguments correctly', () => {
    const registry = Registry.create()
    let receivedArgs: any[] = []

    Registry.register(registry.data, 'Test', 'Arr', {
      variadic: (...args: any[]) => {
        receivedArgs = args
        return args.length
      },
    })

    const Test = createTraitProxy(registry.data, 'Test') as any
    const result = Test.variadic([1], 'two', 3, { four: 4 })

    expect(receivedArgs).toEqual([[1], 'two', 3, { four: 4 }])
    expect(result).toBe(4)
  })

  test('works with curried methods', () => {
    const registry = Registry.create()

    Registry.register(registry.data, 'Eq', 'Str', {
      is: (a: string, b: string) => a === b,
      isOn: (a: string) => (b: string) => a === b,
    })

    const Eq = createTraitProxy(registry.data, 'Eq') as any

    // Direct method
    expect(Eq.is('hello', 'hello')).toBe(true)
    expect(Eq.is('hello', 'world')).toBe(false)

    // Curried method
    const isHello = Eq.isOn('hello')
    expect(isHello('hello')).toBe(true)
    expect(isHello('world')).toBe(false)
  })

  test('error propagation from dispatch', () => {
    const registry = Registry.create()
    const Test = createTraitProxy(registry.data, 'Test') as any

    // Should throw when trait method doesn't exist
    expect(() => Test.nonExistent(42)).toThrow()
  })
})

describe('property-based tests', () => {
  test('dispatchOrThrow always returns implementation result', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // trait name
        fc.string({ minLength: 1 }), // method name
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.array(fc.anything()),
          fc.object(),
        ), // first arg (determines domain)
        fc.array(fc.anything()), // additional args
        fc.anything(), // return value
        (traitName, methodName, firstArg, additionalArgs, returnValue) => {
          const registry = Registry.create()

          // Determine domain from first arg
          const domainName = typeof firstArg === 'string'
            ? 'Str'
            : typeof firstArg === 'number'
            ? 'Num'
            : typeof firstArg === 'boolean'
            ? 'Bool'
            : Array.isArray(firstArg)
            ? 'Arr'
            : 'Obj'

          // Register implementation that returns our value
          Registry.register(registry.data, traitName, domainName, {
            [methodName]: () => returnValue,
          })

          const result = createTraitDispatcher(
            registry.data,
            traitName,
          )(methodName)(firstArg, ...additionalArgs)

          expect(result).toBe(returnValue)
        },
      ),
    )
  })

  test('create proxy always forwards to dispatcher', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // trait name
        fc.array(
          fc.string({ minLength: 1 }).filter(s =>
            ![
              'constructor',
              'valueOf',
              'toString',
              '__proto__',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'toLocaleString',
            ].includes(s)
          ),
          { minLength: 1, maxLength: 5 },
        ), // method names
        fc.array(fc.anything(), { minLength: 1 }), // arguments (need at least 1 for dispatch)
        (traitName, methodNames, args) => {
          const registry = Registry.create()
          const dispatchCalls: Array<{
            trait: string
            method: string
            args: any[]
          }> = []

          // Register implementations that track calls
          // Default to string if no args to ensure we have a valid domain
          const firstArg = args.length > 0 ? args[0] : 'default'
          const domainName = typeof firstArg === 'string'
            ? 'Str'
            : typeof firstArg === 'number'
            ? 'Num'
            : typeof firstArg === 'boolean'
            ? 'Bool'
            : Array.isArray(firstArg)
            ? 'Arr'
            : typeof firstArg === 'undefined'
            ? 'Undefined'
            : firstArg === null
            ? 'Null'
            : 'Obj'

          const impl: Record<string, Function> = {}
          methodNames.forEach(method => {
            impl[method] = (...receivedArgs: any[]) => {
              dispatchCalls.push({
                trait: traitName,
                method,
                args: receivedArgs,
              })
              return `${method}-result`
            }
          })

          Registry.register(registry.data, traitName, domainName, impl)

          // Create proxy and call methods
          const proxy = createTraitProxy(registry.data, traitName) as any

          methodNames.forEach(method => {
            const result = proxy[method](...args)
            expect(result).toBe(`${method}-result`)
          })

          // Verify all calls were made
          expect(dispatchCalls).toHaveLength(methodNames.length)
          dispatchCalls.forEach((call, i) => {
            expect(call.trait).toBe(traitName)
            expect(call.method).toBe(methodNames[i])
            expect(call.args).toEqual(args)
          })
        },
      ),
    )
  })

  test('method caching is consistent', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // trait name
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }), // method names
        (traitName, methodNames) => {
          const registry = Registry.create()
          Registry.register(registry.data, 'Test', 'Str', {})

          const proxy = createTraitProxy(registry.data, traitName) as any

          // Access each method multiple times
          const methodRefs = new Map<string, Function>()

          methodNames.forEach(method => {
            const ref1 = proxy[method]
            const ref2 = proxy[method]
            const ref3 = proxy[method]

            // All references should be the same (cached)
            expect(ref1).toBe(ref2)
            expect(ref2).toBe(ref3)

            methodRefs.set(method, ref1)
          })

          // Accessing again should still return cached version
          methodNames.forEach(method => {
            expect(proxy[method]).toBe(methodRefs.get(method))
          })
        },
      ),
    )
  })

  test('handles any property access gracefully', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // trait name
        fc.oneof(
          fc.string(),
          fc.constant(Symbol.toStringTag),
          fc.constant(Symbol.iterator),
          fc.constant(Symbol.hasInstance),
        ), // property to access
        (traitName, prop) => {
          const registry = Registry.create()
          const proxy = createTraitProxy(registry.data, traitName) as any

          if (typeof prop === 'string') {
            // String properties return functions
            const result = proxy[prop]
            expect(typeof result).toBe('function')
          } else {
            // Non-string properties (symbols) return undefined
            const result = proxy[prop]
            expect(result).toBeUndefined()
          }
        },
      ),
    )
  })

  test('handles numeric property access correctly', () => {
    const registry = Registry.create()
    const proxy = createTraitProxy(registry.data, 'Test') as any

    // Numeric properties get coerced to strings by JavaScript
    const result = proxy[0]
    expect(typeof result).toBe('function')

    // Can be called like any other method
    Registry.register(registry.data, 'Test', 'Str', {
      '0': () => 'numeric property',
    })
    expect(proxy[0]('test')).toBe('numeric property')
  })

  test('error messages preserve information', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // trait name
        fc.string({ minLength: 1 }).filter(s => !['toString', 'valueOf', 'constructor', 'hasOwnProperty'].includes(s)), // method name (avoid built-ins)
        fc.oneof(
          fc.constant('missing-trait'),
          fc.constant('missing-domain'),
          fc.constant('missing-method'),
        ), // error scenario
        (traitName, methodName, scenario) => {
          const registry = Registry.create()

          if (scenario === 'missing-domain') {
            // Register trait but not for the domain we'll use
            Registry.register(registry.data, traitName, 'Str', {
              [methodName]: () => 'result',
            })
          } else if (scenario === 'missing-method') {
            // Register trait with different method
            Registry.register(registry.data, traitName, 'Num', {
              otherMethod: () => 'result',
            })
          }

          expect(() => {
            createTraitDispatcher(
              registry.data,
              traitName,
            )(methodName)(42) // Will resolve to 'Num' domain
          }).toThrow()
        },
      ),
    )
  })
})
