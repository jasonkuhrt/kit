/**
 * Global settings for Kit library type testing utilities.
 *
 * These settings control the behavior of type assertions and can be configured
 * per-project by augmenting the global namespace.
 *
 * @example
 * ```typescript
 * // In your project: types/kit-settings.d.ts
 * declare global {
 *   namespace KitLibrarySettings {
 *     namespace Ts {
 *       namespace Test {
 *         interface Settings {
 *           lintBidForExactPossibility: true
 *         }
 *       }
 *     }
 *   }
 * }
 * export {}
 * ```
 */

declare global {
  namespace KitLibrarySettings {
    namespace Ts {
      /**
       * Registry of types to preserve during type simplification and display.
       *
       * Add properties to this interface to register types that should not be expanded
       * when types are simplified for display (in errors, hover info, etc.).
       * The property names don't matter - all value types will be unioned together.
       *
       * This is a general TypeScript concept used throughout the library, not just for errors.
       *
       * @example
       * ```typescript
       * // In your project: types/kit-settings.d.ts
       * import type { MySpecialClass, AnotherClass } from './my-classes'
       *
       * declare global {
       *   namespace KitLibrarySettings {
       *     namespace Ts {
       *       interface PreserveTypes {
       *         mySpecial: MySpecialClass
       *         another: AnotherClass
       *       }
       *     }
       *   }
       * }
       * export {}
       * ```
       */
      interface PreserveTypes {
        // Empty by default - users augment this interface
      }

      namespace Error {
        export type GetPreservedTypes<$T extends object> = [keyof $T] extends [never] ? never
          : $T[keyof $T]

        /**
         * Configuration interface for TypeScript error rendering.
         *
         * These settings apply to all TS errors (StaticError, StaticErrorAssertion, etc.).
         * Augment this interface in your project to customize behavior.
         */
        interface Settings {
          /**
           * Minimum key length for error message alignment.
           *
           * All keys in error messages will be padded with underscores to this length
           * for visual alignment.
           *
           * @default 14
           *
           * @example
           * ```typescript
           * // In your project: types/kit-settings.d.ts
           * declare global {
           *   namespace KitLibrarySettings {
           *     namespace Ts {
           *       namespace Error {
           *         interface Settings {
           *           errorKeyLength: 16
           *         }
           *       }
           *     }
           *   }
           * }
           * export {}
           * ```
           */
          errorKeyLength: 14

          /**
           * Controls how errors are rendered in IDE hovers.
           *
           * - `true`: Show full error object with all fields (ERROR, expected, actual, tip, etc.)
           * - `false`: Show only the error message string for cleaner hovers
           *
           * **Use `true` for debugging** - See all available context about the type mismatch
           * **Use `false` for cleaner UI** - Reduce hover noise when you just need the message
           *
           * @default true
           *
           * @example
           * ```typescript
           * // With renderErrors: true (default)
           * // Hover shows: { ERROR_________: "...", expected______: ..., actual________: ..., tip___________: "..." }
           *
           * // With renderErrors: false
           * // Hover shows: "EXPECTED and ACTUAL are disjoint"
           * ```
           */
          renderErrors: boolean
        }
      }

      namespace Assert {
        /**
         * Configuration interface for type test assertions.
         *
         * Augment this interface in your project to customize behavior.
         * Inherits error rendering settings from {@link KitLibrarySettings.Ts.Error.Settings}.
         */
        interface Settings {
          /**
           * When `true`, using {@link bid} when {@link exact} would work shows a type error.
           *
           * This enforces using the most precise assertion available, helping maintain
           * stronger type guarantees in your tests.
           *
           * **Recommended:** `true` for new projects to enforce best practices.
           *
           * @default false
           *
           * @example
           * ```typescript
           * // With lintBidForExactPossibility: false (default)
           * Ts.Assert.bid<string, string>()('hello')  // ✓ Allowed
           *
           * // With lintBidForExactPossibility: true
           * Ts.Assert.bid<string, string>()('hello')  // ✗ Error: Use exact() instead
           * Ts.Assert.exact<string, string>()('hello') // ✓ Correct
           *
           * // bid() still works when only bidirectional (not exact)
           * Ts.Assert.bid<string & {}, string>()('hello') // ✓ Allowed (not structurally equal)
           * ```
           */
          // todo: rename exact terminology
          lintBidForExactPossibility: boolean
        }
      }
    }
  }
}

/**
 * Kit's built-in augmentation of PreserveTypes.
 *
 * IMPORTANT: Keep synchronized with {@link Lang.BuiltInTypes}.
 * Any type in BuiltInTypes should have a corresponding entry here.
 *
 * @internal
 */
import type { PrimitiveBrandLike } from './ts.js'

declare global {
  namespace KitLibrarySettings {
    namespace Ts {
      interface PreserveTypes {
        // Primitives
        _void: void
        _string: string
        _number: number
        _boolean: boolean
        _symbol: symbol
        _bigint: bigint
        _null: null
        _undefined: undefined
        // Branded primitives - catches ALL Effect branded types by structural matching
        // See {@link PrimitiveBrandLike} for details on how this pattern works
        _branded: PrimitiveBrandLike
        // Object built-ins
        _Function: Function
        _Date: Date
        _Error: Error
        _RegExp: RegExp
        _Map: Map<any, any>
        _Set: Set<any>
        _WeakMap: WeakMap<any, any>
        _WeakSet: WeakSet<any>
        _Promise: Promise<any>
        _Array: Array<any>
        _ReadonlyArray: ReadonlyArray<any>
      }
    }
  }
}

/**
 * Helper type to read an error setting with proper defaults.
 *
 * @internal
 */
export type GetErrorSetting<K extends keyof KitLibrarySettings.Ts.Error.Settings> =
  KitLibrarySettings.Ts.Error.Settings[K]

/**
 * Get the renderErrors setting with proper default handling.
 *
 * - If the setting is exactly `boolean` (not extended to true/false), defaults to `true`
 * - Otherwise uses the extended value
 *
 * @internal
 */
export type GetRenderErrors<$Value = GetErrorSetting<'renderErrors'>> = boolean extends $Value ? true : $Value

/**
 * Extract all preserved types from the Ts.PreserveTypes registry.
 * Returns a union of all value types in the interface.
 * Returns `never` if no types are registered.
 *
 * Used throughout the library for type simplification and display.
 *
 * @internal
 */
export type GetPreservedTypes = [keyof KitLibrarySettings.Ts.PreserveTypes] extends [never] ? never
  : KitLibrarySettings.Ts.PreserveTypes[keyof KitLibrarySettings.Ts.PreserveTypes]

// Make this a module
