# Obj Module Enhancements

## Overview

The existing `obj` module provides solid foundations for object manipulation but lacks many advanced utilities found in libraries like Lodash, Ramda, and es-toolkit. This document proposes comprehensive enhancements while maintaining type safety and functional programming principles.

## Current State Analysis

**Existing Features:**

- `is(value)` - Type predicate for objects
- `entries(obj)` - Get key-value pairs with exact typing
- `isEmpty(obj)` - Check if object has no properties
- `pick(obj, keys)` - Select specific properties
- `omit(obj, keys)` - Remove specific properties
- `policyFilter(mode, obj, keys)` - Generic allow/deny filtering
- `partition(obj, keys)` - Split into picked and omitted parts
- `filter(obj, predicate)` - Filter by predicate function
- `setPrivateState(obj, state)` - Attach hidden state via Symbol
- `getPrivateState<T>(obj)` - Retrieve hidden state
- `isShape<T>(spec)` - Type predicate with typeof validation

**Strengths:**

- Excellent TypeScript integration
- Precise type preservation
- Functional programming approach
- Immutability focus

**Gaps Identified:**

- Limited object transformation utilities
- No deep object operations (merge, clone, etc.)
- Missing path-based operations
- No object validation utilities
- Limited object comparison functions
- No object creation/construction helpers
- Missing serialization utilities
- No object metadata operations

## Proposed Enhancements

### Core Object Operations (`core.ts`)

```typescript
/**
 * Enhanced type predicates.
 */
export const is = (value: unknown): value is object

/**
 * Check if value is plain object (not array, null, etc.).
 */
export const isPlain = (value: unknown): value is Record<string, unknown>

/**
 * Check if object is empty.
 */
export const isEmpty = (obj: object): boolean

/**
 * Check if object is not empty (with type narrowing).
 */
export const isntEmpty = <T extends object>(obj: T): obj is NonEmptyObject<T>

/**
 * Get object size (number of properties).
 */
export const size = (obj: object): number
export const length = size // Alias

/**
 * Check if object has specific property.
 */
export const has = <T extends object, K extends PropertyKey>(
  obj: T, 
  key: K
): obj is T & Record<K, unknown>

export const hasWith = <K extends PropertyKey>(key: K) => 
  <T extends object>(obj: T): obj is T & Record<K, unknown>

/**
 * Check if object has all specified properties.
 */
export const hasAll = <T extends object, K extends PropertyKey>(
  obj: T,
  keys: K[]
): obj is T & Record<K, unknown>

export const hasAllWith = <K extends PropertyKey>(keys: K[]) =>
  <T extends object>(obj: T): obj is T & Record<K, unknown>

/**
 * Check if object has any of specified properties.
 */
export const hasAny = <T extends object>(obj: T, keys: PropertyKey[]): boolean
export const hasAnyWith = (keys: PropertyKey[]) => (obj: object): boolean

/**
 * Type for non-empty objects.
 */
export type NonEmptyObject<T> = T & { [K in keyof T]: T[K] } & { readonly __nonEmpty: true }
```

### Object Construction and Creation (`construction.ts`)

```typescript
/**
 * Create object from key-value pairs.
 */
export const fromEntries = <K extends PropertyKey, V>(entries: [K, V][]): Record<K, V>

/**
 * Create object from keys with value factory.
 */
export const fromKeys = <K extends PropertyKey, V>(
  keys: K[], 
  valueFactory: (key: K, index: number) => V
): Record<K, V>

export const fromKeysWith = <K extends PropertyKey, V>(
  valueFactory: (key: K, index: number) => V
) => (keys: K[]): Record<K, V>

/**
 * Create object from values with key factory.
 */
export const fromValues = <K extends PropertyKey, V>(
  values: V[],
  keyFactory: (value: V, index: number) => K
): Record<K, V>

export const fromValuesWith = <K extends PropertyKey, V>(
  keyFactory: (value: V, index: number) => K
) => (values: V[]): Record<K, V>

/**
 * Create object by zipping keys and values.
 */
export const zipObject = <K extends PropertyKey, V>(keys: K[], values: V[]): Record<K, V>
export const zipObjectWith = <K extends PropertyKey, V>(keys: K[]) => (values: V[]): Record<K, V>

/**
 * Create object with default values.
 */
export const defaults = <T extends object, D extends object>(obj: T, defaultValues: D): T & D
export const defaultsWith = <D extends object>(defaultValues: D) => <T extends object>(obj: T): T & D

/**
 * Create object with computed properties.
 */
export const computed = <T extends Record<string, any>>(
  computations: { [K in keyof T]: () => T[K] }
): T

/**
 * Create frozen object.
 */
export const freeze = <T extends object>(obj: T): Readonly<T>

/**
 * Create sealed object.
 */
export const seal = <T extends object>(obj: T): T

/**
 * Create object with prototype.
 */
export const withPrototype = <T extends object, P extends object>(obj: T, prototype: P): T & P
export const withPrototypeOf = <P extends object>(prototype: P) => <T extends object>(obj: T): T & P
```

### Deep Object Operations (`deep.ts`)

```typescript
/**
 * Deep clone object.
 */
export const cloneDeep = <T>(obj: T): T

/**
 * Shallow clone object.
 */
export const clone = <T extends object>(obj: T): T

/**
 * Deep merge objects.
 */
export const mergeDeep = <T extends object, U extends object>(obj1: T, obj2: U): T & U
export const mergeDeepWith = <U extends object>(obj2: U) => <T extends object>(obj1: T): T & U

/**
 * Deep merge with custom merge function.
 */
export const mergeDeepWithFn = <T extends object, U extends object>(
  obj1: T,
  obj2: U,
  mergeFn: (key: string, value1: any, value2: any) => any
): T & U

/**
 * Shallow merge objects.
 */
export const merge = <T extends object, U extends object>(obj1: T, obj2: U): T & U
export const mergeWith = <U extends object>(obj2: U) => <T extends object>(obj1: T): T & U

/**
 * Merge multiple objects.
 */
export const mergeAll = <T extends object[]>(...objects: T): MergeAll<T>
export type MergeAll<T extends object[]> = T extends [infer First, ...infer Rest]
  ? First extends object
    ? Rest extends object[]
      ? First & MergeAll<Rest>
      : First
    : never
  : {}

/**
 * Deep equality comparison.
 */
export const equalDeep = <T>(obj1: T, obj2: T): boolean
export const equalDeepWith = <T>(obj1: T) => (obj2: T): boolean

/**
 * Structural equality (same shape).
 */
export const equalStructure = <T extends object>(obj1: T, obj2: unknown): obj2 is T
export const equalStructureWith = <T extends object>(obj1: T) => (obj2: unknown): obj2 is T
```

### Path-Based Operations (`paths.ts`)

```typescript
/**
 * Path types for type-safe property access.
 */
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? K | `${K}.${Path<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

export type PathValue<T, P extends Path<T>> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : never

/**
 * Get value at path.
 */
export const get = <T extends object, P extends Path<T>>(
  obj: T,
  path: P
): PathValue<T, P> | undefined

export const getWith = <P extends string>(path: P) => 
  <T extends object>(obj: T): PathValue<T, P> | undefined

/**
 * Get value at path with default.
 */
export const getOr = <T extends object, P extends Path<T>, D>(
  obj: T,
  path: P,
  defaultValue: D
): PathValue<T, P> | D

export const getOrWith = <P extends string, D>(path: P, defaultValue: D) =>
  <T extends object>(obj: T): PathValue<T, P> | D

/**
 * Set value at path.
 */
export const set = <T extends object, P extends Path<T>, V>(
  obj: T,
  path: P,
  value: V
): T

export const setWith = <P extends string, V>(path: P, value: V) =>
  <T extends object>(obj: T): T

/**
 * Update value at path.
 */
export const update = <T extends object, P extends Path<T>>(
  obj: T,
  path: P,
  updater: (value: PathValue<T, P>) => PathValue<T, P>
): T

export const updateWith = <P extends string>(
  path: P,
  updater: (value: any) => any
) => <T extends object>(obj: T): T

/**
 * Delete property at path.
 */
export const unset = <T extends object, P extends Path<T>>(obj: T, path: P): T
export const unsetWith = <P extends string>(path: P) => <T extends object>(obj: T): T

/**
 * Check if path exists.
 */
export const hasPath = <T extends object, P extends Path<T>>(obj: T, path: P): boolean
export const hasPathWith = <P extends string>(path: P) => (obj: object): boolean

/**
 * Get all paths in object.
 */
export const paths = <T extends object>(obj: T): Path<T>[]

/**
 * Flatten object to path-value pairs.
 */
export const flatten = <T extends object>(obj: T): Record<string, any>

/**
 * Unflatten path-value pairs to object.
 */
export const unflatten = <T extends Record<string, any>>(flattened: T): object
```

### Object Transformation (`transform.ts`)

```typescript
/**
 * Map over object values.
 */
export const mapValues = <T extends object, R>(
  obj: T,
  mapper: <K extends keyof T>(value: T[K], key: K, obj: T) => R
): Record<keyof T, R>

export const mapValuesWith = <R>(
  mapper: (value: any, key: PropertyKey, obj: object) => R
) => <T extends object>(obj: T): Record<keyof T, R>

/**
 * Map over object keys.
 */
export const mapKeys = <T extends object, K extends PropertyKey>(
  obj: T,
  mapper: (key: keyof T, value: T[keyof T], obj: T) => K
): Record<K, T[keyof T]>

export const mapKeysWith = <K extends PropertyKey>(
  mapper: (key: PropertyKey, value: any, obj: object) => K
) => <T extends object>(obj: T): Record<K, T[keyof T]>

/**
 * Transform object (map both keys and values).
 */
export const transform = <T extends object, K extends PropertyKey, V>(
  obj: T,
  transformer: {
    key?: (key: keyof T, value: T[keyof T], obj: T) => K
    value?: (value: T[keyof T], key: keyof T, obj: T) => V
  }
): Record<K, V>

/**
 * Reduce object to single value.
 */
export const reduce = <T extends object, R>(
  obj: T,
  reducer: (acc: R, value: T[keyof T], key: keyof T, obj: T) => R,
  initial: R
): R

export const reduceOn = <T extends object>(obj: T) =>
  <R>(reducer: (acc: R, value: T[keyof T], key: keyof T, obj: T) => R, initial: R): R

/**
 * Invert object (swap keys and values).
 */
export const invert = <T extends Record<PropertyKey, PropertyKey>>(obj: T): 
  Record<T[keyof T], keyof T>

/**
 * Group object properties by criteria.
 */
export const groupBy = <T extends object, K extends PropertyKey>(
  obj: T,
  grouper: (value: T[keyof T], key: keyof T, obj: T) => K
): Record<K, Partial<T>>

export const groupByWith = <K extends PropertyKey>(
  grouper: (value: any, key: PropertyKey, obj: object) => K
) => <T extends object>(obj: T): Record<K, Partial<T>>

/**
 * Evolve object by applying transformations to specific keys.
 */
export const evolve = <T extends object>(
  obj: T,
  transformations: Partial<{ [K in keyof T]: (value: T[K]) => any }>
): T

export const evolveWith = <T extends object>(
  transformations: Partial<{ [K in keyof T]: (value: T[K]) => any }>
) => (obj: T): T
```

### Object Validation and Schema (`validation.ts`)

```typescript
/**
 * Schema definition for object validation.
 */
export interface ObjectSchema<T> {
  [K in keyof T]: {
    type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function'
    required?: boolean
    validator?: (value: any) => boolean
    default?: T[K]
  }
}

/**
 * Validate object against schema.
 */
export const validate = <T extends object>(
  obj: unknown,
  schema: ObjectSchema<T>
): obj is T

export const validateWith = <T extends object>(schema: ObjectSchema<T>) =>
  (obj: unknown): obj is T

/**
 * Check if object conforms to shape.
 */
export const conformsTo = <T extends object>(
  obj: unknown,
  predicates: Partial<{ [K in keyof T]: (value: any) => boolean }>
): obj is T

export const conformsToWith = <T extends object>(
  predicates: Partial<{ [K in keyof T]: (value: any) => boolean }>
) => (obj: unknown): obj is T

/**
 * Ensure object has required properties.
 */
export const ensureRequired = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): obj is T & Required<Pick<T, K>>

export const ensureRequiredWith = <K extends PropertyKey>(keys: K[]) =>
  <T extends object>(obj: T): obj is T & Record<K, unknown>

/**
 * Type-safe property access with validation.
 */
export const safeGet = <T extends object, K extends keyof T>(
  obj: T,
  key: K,
  validator: (value: unknown) => value is T[K]
): T[K] | undefined

export const safeGetWith = <K extends PropertyKey>(
  key: K,
  validator: (value: unknown) => boolean
) => (obj: object): unknown | undefined
```

### Object Comparison and Diffing (`comparison.ts`)

```typescript
/**
 * Deep comparison with detailed result.
 */
export interface ComparisonResult {
  equal: boolean
  differences: Array<{
    path: string
    expected: any
    actual: any
    type: 'missing' | 'extra' | 'different'
  }>
}

export const compare = <T extends object>(obj1: T, obj2: unknown): ComparisonResult
export const compareWith = <T extends object>(obj1: T) => (obj2: unknown): ComparisonResult

/**
 * Object difference calculation.
 */
export interface ObjectDiff<T> {
  added: Partial<T>
  removed: (keyof T)[]
  modified: Partial<T>
  unchanged: Partial<T>
}

export const diff = <T extends object>(obj1: T, obj2: T): ObjectDiff<T>
export const diffWith = <T extends object>(obj1: T) => (obj2: T): ObjectDiff<T>

/**
 * Apply diff to object.
 */
export const applyDiff = <T extends object>(obj: T, diff: ObjectDiff<T>): T
export const applyDiffWith = <T extends object>(diff: ObjectDiff<T>) => (obj: T): T

/**
 * Check if objects intersect (have common properties).
 */
export const intersects = <T extends object, U extends object>(obj1: T, obj2: U): boolean
export const intersectsWith = <U extends object>(obj2: U) => <T extends object>(obj1: T): boolean

/**
 * Get intersection of objects.
 */
export const intersection = <T extends object, U extends object>(
  obj1: T, 
  obj2: U
): Pick<T, keyof T & keyof U>

export const intersectionWith = <U extends object>(obj2: U) =>
  <T extends object>(obj1: T): Pick<T, keyof T & keyof U>

/**
 * Check if object is subset of another.
 */
export const isSubsetOf = <T extends object, U extends object>(subset: T, superset: U): boolean
export const isSubsetOfWith = <U extends object>(superset: U) => 
  <T extends object>(subset: T): boolean
```

### Serialization and Conversion (`serialization.ts`)

```typescript
/**
 * JSON serialization with custom handling.
 */
export interface SerializeOptions {
  space?: number | string
  replacer?: (key: string, value: any) => any
  dateFormat?: 'iso' | 'timestamp' | 'custom'
  customDateFormatter?: (date: Date) => string
}

export const serialize = (obj: any, options?: SerializeOptions): string
export const serializeWith = (options: SerializeOptions) => (obj: any): string

/**
 * JSON deserialization with validation.
 */
export interface DeserializeOptions<T> {
  reviver?: (key: string, value: any) => any
  validator?: (obj: unknown) => obj is T
  dateReviver?: boolean
}

export const deserialize = <T = any>(json: string, options?: DeserializeOptions<T>): T
export const deserializeWith = <T = any>(options: DeserializeOptions<T>) => (json: string): T

/**
 * Safe JSON operations with Result types.
 */
export const trySerialize = (obj: any): { success: true; value: string } | { success: false; error: string }
export const tryDeserialize = <T = any>(json: string): { success: true; value: T } | { success: false; error: string }

/**
 * Convert object to URL query string.
 */
export const toQueryString = (obj: Record<string, any>): string
export const fromQueryString = (queryString: string): Record<string, string>

/**
 * Convert object to form data.
 */
export const toFormData = (obj: Record<string, any>): FormData
export const fromFormData = (formData: FormData): Record<string, any>

/**
 * Convert to/from different object notations.
 */
export const toDotNotation = (obj: object): Record<string, any>
export const fromDotNotation = (dotNotation: Record<string, any>): object

export const toBracketNotation = (obj: object): Record<string, any>
export const fromBracketNotation = (bracketNotation: Record<string, any>): object
```

### Object Metadata and Introspection (`metadata.ts`)

```typescript
/**
 * Get object metadata.
 */
export interface ObjectMetadata {
  keys: string[]
  values: any[]
  entries: [string, any][]
  size: number
  depth: number
  hasCircularReferences: boolean
  propertyDescriptors: Record<string, PropertyDescriptor>
}

export const metadata = <T extends object>(obj: T): ObjectMetadata

/**
 * Object introspection utilities.
 */
export const getDepth = (obj: object): number
export const hasCircularReferences = (obj: object): boolean
export const getCircularPaths = (obj: object): string[]

/**
 * Property descriptor operations.
 */
export const getDescriptor = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): PropertyDescriptor | undefined

export const setDescriptor = <T extends object, K extends keyof T>(
  obj: T,
  key: K,
  descriptor: PropertyDescriptor
): T

export const getAllDescriptors = <T extends object>(obj: T): Record<keyof T, PropertyDescriptor>

/**
 * Prototype chain operations.
 */
export const getPrototypeChain = (obj: object): object[]
export const isInstanceOf = <T>(obj: unknown, constructor: new (...args: any[]) => T): obj is T
export const getConstructorName = (obj: object): string

/**
 * Property enumeration.
 */
export const getEnumerableKeys = <T extends object>(obj: T): (keyof T)[]
export const getNonEnumerableKeys = <T extends object>(obj: T): (keyof T)[]
export const getOwnKeys = <T extends object>(obj: T): (keyof T)[]
export const getAllKeys = <T extends object>(obj: T): (keyof T)[]

/**
 * Symbol operations.
 */
export const getSymbols = (obj: object): symbol[]
export const getOwnSymbols = (obj: object): symbol[]
export const hasSymbol = (obj: object, symbol: symbol): boolean
```

## Enhanced Type Definitions

```typescript
/**
 * Utility types for object operations.
 */
export type NonEmptyObject<T> = T & { [K in keyof T]: T[K] } & {
  readonly __nonEmpty: true
}

export type PlainObject = Record<string, unknown>

export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

export type Flatten<T> = T extends object ? {
    [
      K in keyof T as `${string & K}${T[K] extends object
        ? `.${string & keyof T[K]}`
        : ''}`
    ]: T[K] extends object ? T[K][keyof T[K]] : T[K]
  }
  : T

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

## Integration with Existing Features

### Enhanced Pick/Omit

```typescript
// Deep pick/omit operations
export const pickDeep = <T extends object, P extends Path<T>[]>(obj: T, paths: P): PickDeep<T, P>
export const omitDeep = <T extends object, P extends Path<T>[]>(obj: T, paths: P): OmitDeep<T, P>

// Conditional pick/omit
export const pickBy = <T extends object>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean
): Partial<T>

export const omitBy = <T extends object>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean
): Partial<T>

// Pick by type
export const pickByType = <T extends object, U>(obj: T, type: U): Pick<T, KeysOfType<T, U>>
export const omitByType = <T extends object, U>(obj: T, type: U): Omit<T, KeysOfType<T, U>>
```

### Enhanced Filtering

```typescript
// More filter variants
export const filterValues = <T extends object>(
  obj: T,
  predicate: (value: T[keyof T]) => boolean
): Partial<T>

export const filterKeys = <T extends object>(
  obj: T,
  predicate: (key: keyof T) => boolean
): Partial<T>

export const filterEntries = <T extends object>(
  obj: T,
  predicate: (entry: [keyof T, T[keyof T]]) => boolean
): Partial<T>

// Compact - remove undefined/null values
export const compact = <T extends object>(obj: T): CompactObject<T>
export const compactDeep = <T extends object>(obj: T): CompactDeep<T>

type CompactObject<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K]
}

type CompactDeep<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] extends object ? CompactDeep<T[K]> : T[K]
}
```

## Performance Optimizations

1. **Structural sharing** for immutable operations
2. **Lazy evaluation** for complex transformations
3. **Memoization** for expensive operations
4. **Proxy-based** lazy properties
5. **WeakMap caching** for metadata operations

## Usage Examples

```typescript
import { Obj } from '@wollybeard/kit'

// Construction
const user = Obj.fromKeys(['name', 'email', 'age'], key => getDefaultValue(key))
const merged = Obj.mergeDeep(baseConfig, userConfig)

// Path operations
const userName = Obj.get(user, 'profile.personal.name')
const updated = Obj.set(user, 'profile.personal.name', 'John')

// Transformation
const apiUser = Obj.mapKeys(user, key => camelToSnake(key))
const summary = Obj.reduce(stats, (acc, value) => acc + value, 0)

// Validation
if (Obj.validate(data, userSchema)) {
  // data is now typed as User
  console.log(data.email)
}

// Comparison
const changes = Obj.diff(oldUser, newUser)
const isEqual = Obj.equalDeep(obj1, obj2)

// Serialization
const json = Obj.serialize(obj, { space: 2, dateFormat: 'iso' })
const restored = Obj.deserialize(json, { validator: isUser })

// Curried usage
const pickUserFields = Obj.pickWith(['name', 'email'])
const setDefaultAge = Obj.setWith('age', 18)
const validateUser = Obj.validateWith(userSchema)

pipe(
  rawData,
  validateUser,
  pickUserFields,
  setDefaultAge,
) // User object with selected fields and default age
```

This comprehensive enhancement transforms the Obj module into a complete object manipulation library while maintaining the excellent type safety and functional programming principles of the existing codebase.
