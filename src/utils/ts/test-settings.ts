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

// Make this a module
