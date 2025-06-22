# Namespace Categorization

## Problem

How do we categorize the different types of modules in `src/*`? Are they all domains, or do we have different categories?

## Current Understanding

We have at least three categories:

### 1. Data Type Domains

Modules focused on a specific data type and its operations.

Examples:

- `Num` - number operations
- `Str` - string operations
- `Arr` - array operations
- `Obj` - object operations

Characteristics:

- Export type-specific operations
- May include branded types
- Domain-focused

### 2. Traits/Protocols

Cross-cutting interfaces that can be implemented by multiple data types.

Examples:

- `Range` - interval/bounds for any ordered type
- `Eq` - equality comparison
- `Ord` - ordering comparison
- `Show` - string representation

Characteristics:

- Define common operations
- Work across multiple domains
- Enable polymorphism

### 3. Functional Utilities

Operations grouped by function rather than data type.

Examples:

- `Gen` - data generation
- `Parse` - parsing operations
- `Validate` - validation operations
- `Transform` - transformation operations

Characteristics:

- Cross-domain by nature
- Grouped by purpose
- May not fit trait pattern

## Questions

1. Should we make this categorization explicit in our directory structure?
   ```
   src/
     domains/
       num/
       str/
     traits/
       range/
       eq/
     utilities/
       gen/
       parse/
   ```

2. How do we handle modules that could fit multiple categories?
   - Is `Json` a domain or utility?
   - Is `Fn` a domain or utility?

3. Should traits have a different API pattern than domains?

## Recommendation

Keep flat structure but document the category clearly in each module's README or through naming conventions. This maintains flexibility while providing clarity.
