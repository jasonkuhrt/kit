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
      namespace Test {
        /**
         * Configuration interface for type test assertions.
         *
         * Augment this interface in your project to customize behavior.
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
           * Ts.Test.bid<string, string>()('hello')  // ✓ Allowed
           *
           * // With lintBidForExactPossibility: true
           * Ts.Test.bid<string, string>()('hello')  // ✗ Error: Use exact() instead
           * Ts.Test.exact<string, string>()('hello') // ✓ Correct
           *
           * // bid() still works when only bidirectional (not exact)
           * Ts.Test.bid<string & {}, string>()('hello') // ✓ Allowed (not structurally equal)
           * ```
           */
          lintBidForExactPossibility: false

          /**
           * Minimum key length for error message alignment.
           *
           * All keys in error messages will be padded with underscores to this length
           * for visual alignment.
           *
           * @default 12
           *
           * @example
           * ```typescript
           * // In your project: types/kit-settings.d.ts
           * declare global {
           *   namespace KitLibrarySettings {
           *     namespace Ts {
           *       namespace Test {
           *         interface Settings {
           *           errorKeyLength: 15
           *         }
           *       }
           *     }
           *   }
           * }
           * export {}
           * ```
           */
          errorKeyLength: 12
        }

        /**
         * Registry of types to preserve in error messages.
         *
         * Add properties to this interface to register types that should not be expanded.
         * The property names don't matter - all value types will be unioned together.
         *
         * @example
         * ```typescript
         * // In your project: types/kit-settings.d.ts
         * import type { MySpecialClass, AnotherClass } from './my-classes'
         *
         * declare global {
         *   namespace KitLibrarySettings {
         *     namespace Ts {
         *       namespace Test {
         *         interface PreserveTypes {
         *           mySpecial: MySpecialClass
         *           another: AnotherClass
         *         }
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
      }
    }
  }
}

/**
 * Helper type to read a test setting with proper defaults.
 *
 * @internal
 */
export type GetTestSetting<K extends keyof KitLibrarySettings.Ts.Test.Settings> = KitLibrarySettings.Ts.Test.Settings[K]

/**
 * Extract all preserved types from the PreserveTypes registry.
 * Returns a union of all value types in the interface.
 * Returns `never` if no types are registered.
 *
 * @internal
 */
export type GetPreservedTypes = [keyof KitLibrarySettings.Ts.Test.PreserveTypes] extends [never] ? never
  : KitLibrarySettings.Ts.Test.PreserveTypes[keyof KitLibrarySettings.Ts.Test.PreserveTypes]

// Make this a module
