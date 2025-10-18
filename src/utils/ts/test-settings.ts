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
      namespace Assert {
        export type GetPreservedTypes<$T extends object> = [keyof $T] extends [never] ? never
          : $T[keyof $T]

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
           *       namespace Test {
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
           * Controls how assertion errors are rendered in IDE hovers.
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
           * // With renderAssertionErrors: true (default)
           * // Hover shows: { ERROR_________: "...", expected______: ..., actual________: ..., tip___________: "..." }
           *
           * // With renderAssertionErrors: false
           * // Hover shows: "EXPECTED and ACTUAL are disjoint"
           * ```
           */
          renderAssertionErrors: boolean
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
export type GetTestSetting<K extends keyof KitLibrarySettings.Ts.Assert.Settings> =
  KitLibrarySettings.Ts.Assert.Settings[K]

/**
 * Get the renderAssertionErrors setting with proper default handling.
 *
 * - If the setting is exactly `boolean` (not extended to true/false), defaults to `true`
 * - Otherwise uses the extended value
 *
 * @internal
 */
export type GetRenderAssertionErrors<$Value = GetTestSetting<'renderAssertionErrors'>> = boolean extends $Value ? true
  : $Value

/**
 * Extract all preserved types from the PreserveTypes registry.
 * Returns a union of all value types in the interface.
 * Returns `never` if no types are registered.
 *
 * @internal
 */
export type GetPreservedTypes = [keyof KitLibrarySettings.Ts.Assert.PreserveTypes] extends [never] ? never
  : KitLibrarySettings.Ts.Assert.PreserveTypes[keyof KitLibrarySettings.Ts.Assert.PreserveTypes]

// Make this a module
