# TypeScript Error Reporting: Generics and Type Instantiation (2025-05-29)

## Overview

This note summarizes key learnings about how TypeScript reports errors for generic types and functions, particularly the distinction between displaying generic signatures and specific instantiations. This is relevant for creating custom error types (like `StaticErrorGuard`) and understanding IDE hover information versus compiler errors.

The core challenge addressed was improving the display of inferred types within error messages, aiming to show concrete types rather than generic placeholders like `<value_>` at all times.

## General Principles

1.  **Type Instantiation vs. Generic Signature Display:**
    *   **Generic Signature:** When TypeScript refers to a generic function or type itself (e.g., in IDE hovers over the function name, or in the initial part of a compiler error describing the "Argument of type `GenericFunc<T>`..."), it will display the type parameters as placeholders (e.g., `T`, `$Value`, `value_`). This is accurate because the function/type *is* generic at this level of description.
    *   **Type Instantiation:** When a generic function is *called* or a generic type is *used* with specific type arguments (often inferred), TypeScript instantiates it. In the detailed part of a compiler error explaining an assignability failure for that specific call/use, TypeScript will use these concrete, instantiated types.

2.  **Custom Error Types and `CONTEXT`:**
    *   If a custom error type like `StaticErrorGuard<$Guard, $Value>` includes a `CONTEXT` object (e.g., `{ guard: $Guard, value: $Value }`), this `CONTEXT` object *will* show instantiated types in the relevant part of the compiler error (i.e., when detailing the assignability failure for a specific instantiation).
    *   Example:
        ```typescript
        // Generic Definition
        interface MyError<T> {
          ERROR_INFO: { param: T };
        }

        // In an error for a specific call where T is inferred as `string`:
        // Type 'number' is not assignable to type 'MyError<string>'
        //   Property 'ERROR_INFO' has issues:
        //     Type '{ param: number; }' is not assignable to type '{ param: string; }'. // 'string' is instantiated
        ```

3.  **Template Literal Types for Error Messages (e.g., using `Print<T>`):**
    *   When a template literal type is used to construct an error message string (e.g., `` `Value is ${Print<T>}` ``), the `Print<T>` utility will be evaluated with the *instantiated* type for `T` in the detailed compiler error.
    *   If `Print<T>` itself is shown with a generic `T` (e.g., `Print<value_, ...>`) in an error message, it's likely in the part of the error describing the generic signature, not the specific failure.

4.  **`Simplify<T>` Utility:**
    *   `Simplify<T>` helps improve the readability of complex types by expanding aliases or flattening structures.
    *   It operates on the type it's given. If given `MyType<G>` (where `G` is generic), it simplifies `MyType<G>`. If given `MyType<string>`, it simplifies `MyType<string>`.
    *   It does not "force instantiation" in the sense of making a generic signature display with specific types before a call-site inference occurs.

5.  **IDE Hovers vs. Compiler Errors:**
    *   IDE hovers on a generic function/type definition or reference will typically show its generic signature.
    *   Compiler errors are more detailed and hierarchical. The initial parts might describe generic signature mismatches, while deeper parts will detail failures with instantiated types. The latter is the "ground truth" for a specific call.

## Brief Self-Contained Example

```typescript
// 1. A Generic Error Type
interface CustomError<ParamType> {
  MESSAGE: string; // To be constructed with Print<ParamType>
  CONTEXT: {
    expectedParamType: ParamType;
  };
}

// 2. A "Print" utility (simplified)
type Print<T> =
  T extends string ? `"${T}" (string)` :
  T extends number ? `${T} (number)` :
  "some_other_type";

// 3. A generic function that uses the error type
// If ArgType is not a string, its parameter expects CustomError<ArgType>
function processOrError<ArgType>(
  arg: ArgType extends string ? string : CustomError<ArgType>
): void {
  // ...
}

// 4. Usage
declare const myNumber: number;

// Calling processOrError(myNumber):
// - ArgType is inferred as `number`.
// - `ArgType extends string` (number extends string) is false.
// - So, `arg` parameter is expected to be `CustomError<number>`.
// - `CustomError<number>` is `{ MESSAGE: string, CONTEXT: { expectedParamType: number } }`.
// - We are passing `myNumber` (type `number`).
// - `number` is not assignable to `CustomError<number>`.

// Expected Compiler Error Structure:
/*
Argument of type 'number' is not assignable to parameter of type 'CustomError<number>'.

Breaking it down (conceptual parts of a real TS error):

Error Part 1 (Generic Signature aspect, if TS describes `processOrError` first):
  Function `processOrError<ArgType>(arg: ArgType extends string ? string : CustomError<ArgType>)`
  When `ArgType` is `number`, `arg` expects `CustomError<number>`.
  The `CustomError<ArgType>` part might show `CONTEXT: { expectedParamType: ArgType }` (generic)
  if it's describing the uninstantiated generic structure that leads to `CustomError<number>`.

Error Part 2 (Specific Instantiation Failure - THE IMPORTANT PART):
  Type 'number' is not assignable to type 'CustomError<number>'.
    Within `CustomError<number>` (the expected type):
    `CONTEXT` is `{ expectedParamType: number }` // <-- `ArgType` is instantiated to `number`
    `MESSAGE` (if we constructed it like `MESSAGE: `Expected ${Print<ArgType>}` `) would be
    `"Expected 123 (number)"` (if myNumber was 123 and Print resolved).

IDE Hover on `processOrError` definition:
  Will show `<ArgType>(arg: ArgType extends string ? string : CustomError<ArgType>)`
  If hovering on `CustomError<ArgType>` part within this, it will show `CONTEXT: { expectedParamType: ArgType }`
  (because ArgType is not yet known from a specific call at the definition site).
*/
```

## Conclusion for the Original Case

The initial concern about `value_` (a generic type parameter) appearing in error messages was largely due to observing it in IDE hovers or the parts of compiler errors that describe the *generic signature* of the function `Null.isnt`.

In the *detailed assignability failure* part of the compiler error, TypeScript *does* correctly use the instantiated type (e.g., `PageBranchContent | undefined`) for `value_` when constructing the `CONTEXT` object and evaluating `Print<value_>` for the error message string.

There isn't a known TypeScript mechanism to force the generic signature display itself to "pre-instantiate" with types from a potential call site. The current behavior accurately distinguishes between generic definitions and specific instantiations.