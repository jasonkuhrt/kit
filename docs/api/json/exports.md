# Json.Exports

_Json_ / **Exports**

## Import

::: code-group

```typescript [Namespace]
import { Json } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Json from '@wollybeard/kit/json'
```

:::

## Codec

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `codec`

```typescript
Codec<Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L169" />

Codec for JSON values with pretty-printing. Uses Effect's parseJson for decoding.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `encode`

```typescript
Encode<Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L187" />

Encode a JSON value to a pretty-printed string.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `decode`

```typescript
Decode<Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L195" />

Parse a JSON string to a typed value. Uses Effect's parseJson for better error messages.

## Schemas

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrimitiveSchema`

```typescript
Union<[typeof String, typeof Number, typeof Boolean, typeof Null]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L110" />

JSON primitive value schema. Matches: string, number, boolean, or null.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ValueSchema`

```typescript
Schema<Value, Value, never>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L124" />

JSON value schema. Matches any valid JSON value: primitives, objects, or arrays (recursively).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ObjectSchema`

```typescript
Record$<typeof String, Schema<Value, Value, never>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L138" />

JSON object schema. Matches objects with string keys and JSON values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `parseJsonSchema`

```typescript
SchemaClass<unknown, string, never>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L146" />

Schema for parsing JSON strings to unknown values. Uses Effect's parseJson for better error handling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseJsonAs`

```typescript
<A>(schema: Schema<A, A, never>): transform<SchemaClass<unknown, string, never>, Schema<A, A, never>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L153" />

Schema for parsing JSON with type validation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ObjectParser`

```typescript
{ parse: (value: unknown) => { readonly[x: string]: Value; }; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L225" />

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPrimitive`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L51" />

Type guard to check if a value is a JSON primitive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isValue`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L65" />

Type guard to check if a value is a valid JSON value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isObject`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L87" />

Type guard to check if a value is a JSON object.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Primitive`

```typescript
type Primitive = string | number | boolean | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L18" />

JSON primitive type. Matches: string, number, boolean, or null.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Obj`

```typescript
type Obj = { [key in string]?: Value }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L25" />

JSON object type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Value`

```typescript
type Value = Primitive | Obj | Value[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L33" />

JSON value type. Matches any valid JSON value: primitives, objects, or arrays (recursively).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Object`

```typescript
type Obj = { [key in string]?: Value }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L25" />

JSON object type.
