/**
 * Type-level test assertion that requires the result to be never (no error).
 * Used in type-level test suites to ensure a type evaluates to never (success).
 *
 * Generally prefer value-level API instead.
 *
 * **Problem**: Individual `Case<>` assertions don't actually catch type errors at compile time
 * due to internal casting. Errors only appear when wrapped in `Cases<>`, which has its own issues.
 *
 * **Better Alternative**: Use value-level API which reports ALL errors simultaneously:
 * ```ts
 * // ❌ Type-level - doesn't catch errors reliably
 * type _ = Ts.Assert.Case<Assert.exact<string, number>>  // May silently pass!
 *
 * // ✅ Value-level - shows all errors
 * Assert.exact.ofAs<string>().onAs<number>()  // Error shown immediately
 * ```
 *
 * @see {@link Cases} for batch assertions (also discouraged)
 *
 * @example
 * ```ts
 * type MyTests = [
 *   Ts.Assert.Case<Equal<string, string>>,  // OK - evaluates to never (success)
 *   Ts.Assert.Case<Equal<string, number>>,  // Error - doesn't extend never (returns error)
 * ]
 * ```
 */
export type Case<$Result extends never> = $Result

/**
 * Type-level batch assertion helper that accepts multiple assertions.
 * Each type parameter must extend never (no error), allowing batch type assertions.
 *
 * Generally prefer value-level API instead.
 *
 * **Fatal Flaw**: TypeScript **short-circuits on the first failing assertion** and never
 * evaluates remaining parameters. With dozens of test cases, this makes debugging extremely
 * slow - you fix one error, run again, see the next error, fix it, repeat.
 *
 * **This is a fundamental TypeScript limitation and cannot be fixed.**
 *
 * **Better Alternative**: Use value-level API which reports ALL errors simultaneously:
 * ```ts
 * // ❌ Type-level Cases - only shows FIRST error
 * type _ = Ts.Assert.Cases<
 *   Assert.exact<string, string>,   // ✓ Pass
 *   Assert.exact<number, string>,   // ✗ ERROR - TypeScript stops here!
 *   Assert.exact<boolean, boolean>, // Never checked - you won't see errors here
 *   Assert.exact<symbol, string>    // Never checked - you won't see errors here
 * >
 *
 * // ✅ Value-level - shows ALL errors at once
 * Assert.exact.ofAs<string>().onAs<string>()   // ✓ Pass
 * Assert.exact.ofAs<number>().onAs<string>()   // ✗ Error shown
 * Assert.exact.ofAs<boolean>().onAs<boolean>() // ✓ Pass
 * Assert.exact.ofAs<symbol>().onAs<string>()   // ✗ Error shown (both line 2 and 4 visible!)
 *
 * // Alternative: Individual type aliases (also shows all errors)
 * type _pass1 = Assert.exact.of<string, string>
 * type _fail1 = Assert.exact.of<number, string>  // Error shown
 * type _pass2 = Assert.exact.of<boolean, boolean>
 * type _fail2 = Assert.exact.of<symbol, string>  // Error shown (all errors visible)
 * ```
 *
 * **Additional Limitations**:
 * - Limited to 100 type parameters (arbitrary hard limit)
 * - Cannot be aliased for brevity
 * - Worse error messages than value-level API
 *
 * **Only use this if explicitly instructed** - kept for backward compatibility only.
 *
 * @see Value-level API: `Assert.exact.ofAs<Expected>().on(value)` for the recommended approach
 *
 * @example
 * ```ts
 * type _ = Ts.Assert.Cases<
 *   Equal<string, string>,     // ✓ Pass (returns never)
 *   Extends<string, 'hello'>,  // ✓ Pass (returns never)
 *   Never<never>               // ✓ Pass (returns never)
 * >
 *
 * // Type error if any assertion fails
 * type _ = Ts.Assert.Cases<
 *   Equal<string, string>,     // ✓ Pass (returns never)
 *   Equal<string, number>,     // ✗ Fail - Type error here (returns StaticErrorAssertion)
 *   Extends<string, 'hello'>   // ✓ Pass (returns never)
 * >
 * ```
 */
export type Cases<
  _T1 extends never = never,
  _T2 extends never = never,
  _T3 extends never = never,
  _T4 extends never = never,
  _T5 extends never = never,
  _T6 extends never = never,
  _T7 extends never = never,
  _T8 extends never = never,
  _T9 extends never = never,
  _T10 extends never = never,
  _T11 extends never = never,
  _T12 extends never = never,
  _T13 extends never = never,
  _T14 extends never = never,
  _T15 extends never = never,
  _T16 extends never = never,
  _T17 extends never = never,
  _T18 extends never = never,
  _T19 extends never = never,
  _T20 extends never = never,
  _T21 extends never = never,
  _T22 extends never = never,
  _T23 extends never = never,
  _T24 extends never = never,
  _T25 extends never = never,
  _T26 extends never = never,
  _T27 extends never = never,
  _T28 extends never = never,
  _T29 extends never = never,
  _T30 extends never = never,
  _T31 extends never = never,
  _T32 extends never = never,
  _T33 extends never = never,
  _T34 extends never = never,
  _T35 extends never = never,
  _T36 extends never = never,
  _T37 extends never = never,
  _T38 extends never = never,
  _T39 extends never = never,
  _T40 extends never = never,
  _T41 extends never = never,
  _T42 extends never = never,
  _T43 extends never = never,
  _T44 extends never = never,
  _T45 extends never = never,
  _T46 extends never = never,
  _T47 extends never = never,
  _T48 extends never = never,
  _T49 extends never = never,
  _T50 extends never = never,
  _T51 extends never = never,
  _T52 extends never = never,
  _T53 extends never = never,
  _T54 extends never = never,
  _T55 extends never = never,
  _T56 extends never = never,
  _T57 extends never = never,
  _T58 extends never = never,
  _T59 extends never = never,
  _T60 extends never = never,
  _T61 extends never = never,
  _T62 extends never = never,
  _T63 extends never = never,
  _T64 extends never = never,
  _T65 extends never = never,
  _T66 extends never = never,
  _T67 extends never = never,
  _T68 extends never = never,
  _T69 extends never = never,
  _T70 extends never = never,
  _T71 extends never = never,
  _T72 extends never = never,
  _T73 extends never = never,
  _T74 extends never = never,
  _T75 extends never = never,
  _T76 extends never = never,
  _T77 extends never = never,
  _T78 extends never = never,
  _T79 extends never = never,
  _T80 extends never = never,
  _T81 extends never = never,
  _T82 extends never = never,
  _T83 extends never = never,
  _T84 extends never = never,
  _T85 extends never = never,
  _T86 extends never = never,
  _T87 extends never = never,
  _T88 extends never = never,
  _T89 extends never = never,
  _T90 extends never = never,
  _T91 extends never = never,
  _T92 extends never = never,
  _T93 extends never = never,
  _T94 extends never = never,
  _T95 extends never = never,
  _T96 extends never = never,
  _T97 extends never = never,
  _T98 extends never = never,
  _T99 extends never = never,
  _T100 extends never = never,
> = true
