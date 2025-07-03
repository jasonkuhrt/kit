# Partial Application Type Derivation

## Given

```typescript
// Original function signature
// dprint-ignore
is<value1 extends $A, value2 extends $A>(value1: value1, value2: ValidateComparable<value1, value2>): boolean
```

## Then partial types derived are

```typescript
// dprint-ignore
interface IsPartial<$A> {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Positional overloads (using hole symbol _)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Original signature - no holes
  <value1 extends $A, value2 extends $A>(value1: value1, value2: ValidateComparable<value1, value2>): boolean

  // First parameter deferred (value1: _) - validation moves to deferred parameter
  <value2 extends $A>(value1: _, value2: value2): IsPartial1<$A, value2>

  // Second parameter deferred (value2: _) - validation stays with value2
  <value1 extends $A>(value1: value1, value2: _): IsPartial1<$A, value1>

  // Both parameters deferred - returns self (recursive)
  (value1: _, value2: _): IsPartial<$A>

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Named overloads (using object syntax, no holes needed)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Both parameters provided
  <value1 extends $A, value2 extends $A>(args: { value1: value1; value2: ValidateComparable<value1, value2> }): boolean

  // Only value1 provided
  <value1 extends $A>(args: { value1: value1 }): <value2 extends $A>(args: { value2: ValidateComparable<value1, value2> }) => boolean

  // Only value2 provided
  <value2 extends $A>(args: { value2: value2 }): <value1 extends $A>(args: { value1: ValidateComparable<value1, value2> }) => boolean

  // No parameters provided - returns self (recursive)
  (args: {}): IsPartial<$A>
}

// dprint-ignore
interface IsPartial1<$A, Known extends $A> {
  // Provide the remaining value
  <value extends $A>(value: ValidateComparable<value, Known>): boolean

  // Or defer again (returns self for consistency)
  (value: _): IsPartial1<$A, Known>
}
```

## Key Derivation Rules

1. **Positional Arguments**
   - Use hole symbol `_` to defer parameters
   - Each combination of holes creates an overload
   - All holes deferred returns the original partial interface (recursive)

2. **Named Arguments**
   - Use object syntax with parameter names as keys
   - No holes needed - just omit properties
   - Empty object returns the original partial interface (recursive)

3. **Validation Type Movement**
   - When a parameter that others validate against is deferred, the validation moves to the deferred parameter's position
   - Example: `ValidateComparable<value1, value2>` moves to the deferred parameter when either is a hole

4. **Type Parameter Preservation**
   - Type parameters and their constraints are preserved
   - When a type parameter is deferred, it appears in the returned function signature

5. **Recursive Partial Application**
   - Functions that accept all holes/empty objects return the same partial interface
   - Single parameter functions can re-defer for consistency
