import { describe, expect, test } from 'vitest'
import * as Registry from '../registry/registry.ts'
import { createTraitDispatcher, dispatchMethodCall } from './dispatcher.ts'

describe('createTraitDispatcher uses dispatchMethodCall', () => {
  test('createTraitDispatcher delegates to dispatchMethodCall', () => {
    const registry = Registry.create()

    // Create a trait registry
    const traitRegistry: Registry.TraitRegistry<any> = {
      implementations: {
        Num: {
          add: (a: number, b: number) => a + b,
        },
      },
      domainDetector: null,
      isInitialized: false,
    }

    // Add to registry
    registry['Math'] = traitRegistry

    // Use createTraitDispatcher
    const dispatcher = createTraitDispatcher(registry, 'Math')
    const add = dispatcher('add')

    // Should work correctly
    const result = add(2, 3)
    expect(result).toBe(5)
  })

  test('dispatchMethodCall works directly', () => {
    const traitRegistry: Registry.TraitRegistry<any> = {
      implementations: {
        Num: {
          multiply: (a: number, b: number) => a * b,
        },
      },
      domainDetector: null,
      isInitialized: false,
    }

    // Call dispatchMethodCall directly
    const result = dispatchMethodCall(traitRegistry, 'Math', 'multiply', [4, 5])
    expect(result).toBe(20)
  })
})
