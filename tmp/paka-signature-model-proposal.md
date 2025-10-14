# Paka Signature Model - Current State & Proposals

## Current Model (What We Have Now)

### Schema Structure

```typescript
// BaseExportFields (shared by all exports)
const BaseExportFields = {
  name: S.String,
  signature: S.String,  // ← THE PROBLEM: Flat string
  description: S.optional(S.String),
  examples: S.Array(Example),
  deprecated: S.optional(S.String),
  category: S.optional(S.String),
  tags: S.Record({ key: S.String, value: S.String }),
  sourceLocation: SourceLocation,
}

// ValueExport (runtime exports)
class ValueExport {
  ...BaseExportFields,
  _tag: 'value',
  type: 'function' | 'const' | 'class' | 'namespace',
  module?: Module,  // For namespaces only
}

// TypeExport (type-only exports)
class TypeExport {
  ...BaseExportFields,
  _tag: 'type',
  type: 'interface' | 'type-alias' | 'enum' | 'union' | 'intersection',
}
```

### Current Extraction Logic (tsmorph-utils.ts)

```typescript
extractSignature(decl):
  - TypeAlias → decl.getText()
  - Interface → decl.getText()
  - Enum → decl.getText()
  - Function → `function ${name}<${typeParams}>(${params}): ${returnType}`
  - Variable → simplifyTypeText(type.getText())
  - Class → decl.getText() (includes implementation!)
  - Namespace → decl.getText()
```

**Result:** Everything becomes a flat string, structure is lost.

---

## Problems with Current Approach

### 1. **Lost Structure**

- Can't access individual parameters
- Can't query by return type
- Function overloads are merged/lost
- Type parameter constraints not separated
- No distinction between optional/required parameters

### 2. **Poor Display**

```typescript
// Current: Everything on one line
signature: 'function map<T, U>(items: T[], fn: (item: T, index: number) => U): U[]'

// Can't format as:
function map<T, U>(
  items: T[],
  fn: (item: T, index: number) => U,
): U[]
```

### 3. **No Overload Support**

```typescript
// TypeScript source:
function parse(input: string): Config
function parse(input: Buffer): Config
function parse(input: unknown): Config

// Current extraction: Only gets ONE signature, or they're merged badly
```

### 4. **Classes Include Implementation**

```typescript
// Current: Full class body with implementation
signature: 'class Box extends S.Class<Box> { constructor() { ... } method() { ... } }'

// Should be: Just the interface/signature
```

### 5. **Not Queryable**

- Can't find "all functions returning Promise"
- Can't find "all functions with callback parameters"
- Can't build parameter documentation tables
- Can't generate type relationship graphs

---

## Proposal: Structured Signature Model

### Core Building Blocks

```typescript
// Type parameter (for generics)
class TypeParameter extends S.Class<TypeParameter>('TypeParameter')({
  name: S.String,  // e.g., "T"
  constraint: S.optional(S.String),  // e.g., "extends string"
  default: S.optional(S.String),  // e.g., "= unknown"
})

// Function/method parameter
class Parameter extends S.Class<Parameter>('Parameter')({
  name: S.String,  // e.g., "items"
  type: S.String,  // e.g., "T[]"
  optional: S.Boolean,  // foo?: string
  rest: S.Boolean,  // ...args: T[]
  defaultValue: S.optional(S.String),  // = []
})

// Single function signature (one overload)
class FunctionSignature extends S.Class<FunctionSignature>('FunctionSignature')({
  typeParameters: S.Array(TypeParameter),
  parameters: S.Array(Parameter),
  returnType: S.String,
})
```

### Signature Variants (Tagged Union)

```typescript
// 1. Function signature (supports overloads)
class FunctionSignatureModel extends S.TaggedClass('FunctionSignatureModel')({
  overloads: S.Array(FunctionSignature),  // Multiple overloads
})

// 2. Type signature (type aliases, interfaces - just text for now)
class TypeSignatureModel extends S.TaggedClass('TypeSignatureModel')({
  text: S.String,  // Full type text
})

// 3. Class signature (structured)
class ClassSignatureModel extends S.TaggedClass('ClassSignatureModel')({
  typeParameters: S.Array(TypeParameter),
  extends: S.optional(S.String),  // Base class
  implements: S.Array(S.String),  // Interfaces
  members: S.Array(ClassMember),  // Properties, methods, constructor
})

class ClassMember extends S.Class<ClassMember>('ClassMember')({
  kind: S.Enums({ property: 'property', method: 'method', constructor: 'constructor' }),
  name: S.String,
  signature: S.String,  // For properties: type, for methods: full signature
  visibility: S.Enums({ public: 'public', private: 'private', protected: 'protected' }),
  static: S.Boolean,
  readonly: S.optional(S.Boolean),
})

// 4. Value signature (const primitives, simple values)
class ValueSignatureModel extends S.TaggedClass('ValueSignatureModel')({
  type: S.String,  // Just the inferred type
})

// 5. Enum signature
class EnumSignatureModel extends S.TaggedClass('EnumSignatureModel')({
  members: S.Array(EnumMember),
})

class EnumMember extends S.Class<EnumMember>('EnumMember')({
  name: S.String,
  value: S.optional(S.String),  // Optional initializer
})

// Union of all signature models
const SignatureModel = S.Union(
  FunctionSignatureModel,
  TypeSignatureModel,
  ClassSignatureModel,
  ValueSignatureModel,
  EnumSignatureModel,
)
```

### Updated BaseExportFields

```typescript
const BaseExportFields = {
  name: S.String,
  signature: SignatureModel, // ← NOW STRUCTURED!
  description: S.optional(S.String),
  examples: S.Array(Example),
  deprecated: S.optional(S.String),
  category: S.optional(S.String),
  tags: S.Record({ key: S.String, value: S.String }),
  sourceLocation: SourceLocation,
}
```

---

## Example Transformations

### Before (Current)

```json
{
  "name": "map",
  "signature": "function map<T, U>(items: T[], fn: (item: T) => U): U[]",
  "_tag": "value",
  "type": "function"
}
```

### After (Proposed)

```json
{
  "name": "map",
  "signature": {
    "_tag": "FunctionSignatureModel",
    "overloads": [
      {
        "typeParameters": [
          { "name": "T" },
          { "name": "U" }
        ],
        "parameters": [
          { "name": "items", "type": "T[]", "optional": false, "rest": false },
          {
            "name": "fn",
            "type": "(item: T) => U",
            "optional": false,
            "rest": false
          }
        ],
        "returnType": "U[]"
      }
    ]
  },
  "_tag": "value",
  "type": "function"
}
```

---

## Benefits of Structured Model

### 1. **Rich Queries**

```typescript
// Find all async functions
exports.filter(e =>
  e.signature._tag === 'FunctionSignatureModel'
  && e.signature.overloads.some(o => o.returnType.startsWith('Promise<'))
)

// Find all functions with callbacks
exports.filter(e =>
  e.signature._tag === 'FunctionSignatureModel'
  && e.signature.overloads.some(o =>
    o.parameters.some(p => p.type.includes('=>'))
  )
)
```

### 2. **Better Documentation**

```markdown
### Parameters

| Name  | Type           | Optional | Default | Description       |
| ----- | -------------- | -------- | ------- | ----------------- |
| items | T[]            | No       | -       | Array to map over |
| fn    | (item: T) => U | No       | -       | Mapping function  |
```

### 3. **Formatted Display**

```typescript
// Can now pretty-print:
function map<T, U>(
  items: T[],
  fn: (item: T) => U,
): U[]

// Instead of:
function map<T, U>(items: T[], fn: (item: T) => U): U[]
```

### 4. **Overload Support**

```json
{
  "signature": {
    "_tag": "FunctionSignatureModel",
    "overloads": [
      {
        "parameters": [{ "name": "input", "type": "string" }],
        "returnType": "Config"
      },
      {
        "parameters": [{ "name": "input", "type": "Buffer" }],
        "returnType": "Config"
      },
      {
        "parameters": [{ "name": "input", "type": "unknown" }],
        "returnType": "Config"
      }
    ]
  }
}
```

---

## Implementation Strategy

### Phase 1: Core Function Signatures (High Value)

- Implement `FunctionSignatureModel`, `TypeParameter`, `Parameter`
- Extract overloads properly using ts-morph's `getOverloads()`
- Update VitePress renderer to use structured data

**Impact:** Most exports are functions - this covers 70%+ of use cases

### Phase 2: Class Signatures (Medium Value)

- Implement `ClassSignatureModel`, `ClassMember`
- Extract constructors, methods, properties
- Filter out implementation details

**Impact:** Covers complex class-based APIs

### Phase 3: Enum Signatures (Low Value)

- Implement `EnumSignatureModel`, `EnumMember`
- Extract enum members with values

**Impact:** Nice to have for enum documentation

### Phase 4: Keep Simple for Types (Pragmatic)

- Keep `TypeSignatureModel` as just text
- Parsing type aliases/interfaces into structure is complex
- Diminishing returns - text is often fine for types

**Impact:** Types can stay as-is

---

## Questions for Discussion

1. **Granularity:** Is `ClassSignatureModel` too complex? Should we keep classes as text initially?

2. **Type Text Simplification:** Should we keep `simplifyTypeText()` for the `type` fields in parameters/return types?

3. **Default Values:** Should we extract parameter default values? They can be arbitrarily complex expressions.

4. **Deprecation:** Should overloads have individual `deprecated` flags, or just at export level?

5. **Interface/Type Parsing:** Should we eventually parse interfaces into structured form (properties, methods)? Or is text sufficient?

---

## Recommendation

**Start with Phase 1** (function signatures only):

- High impact, covers majority of exports
- Clear value proposition
- Manageable implementation scope
- Can iterate from there

This gives us:

- Overload support
- Type parameter extraction
- Parameter metadata (optional, rest, default)
- Return type extraction
- Query capabilities
- Better rendering

Let me know which direction you want to take!
