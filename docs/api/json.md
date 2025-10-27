# Json

JSON utilities with Effect Schema integration.

Provides type-safe JSON operations including type guards, parsing, encoding, and validation using Effect Schema. Supports JSON primitives, objects, and recursive value structures with comprehensive error handling.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `codec`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L169" /> {#c-codec-169}

```typescript
Codec<Value>
```

Codec for JSON values with pretty-printing. Uses Effect's parseJson for decoding.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `encode`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L187" /> {#c-encode-187}

```typescript
Encode<Value>
```

Encode a JSON value to a pretty-printed string.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `decode`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L195" /> {#c-decode-195}

```typescript
Decode<Value>
```

Parse a JSON string to a typed value. Uses Effect's parseJson for better error messages.

## Schemas

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Primitive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L211" /> {#c-primitive-211}

```typescript
{
  parse: ;
  ;((value: unknown) => string | number | boolean | null)
}
```

Exported schemas for parsing JSON types. These are used in tests and provide parse methods.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrimitiveSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L110" /> {#c-primitive-schema-110}

```typescript
Union<[typeof String, typeof Number, typeof Boolean, typeof Null]>
```

JSON primitive value schema. Matches: string, number, boolean, or null.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ValueSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L124" /> {#c-value-schema-124}

```typescript
Schema<Value, Value, never>
```

JSON value schema. Matches any valid JSON value: primitives, objects, or arrays (recursively).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ObjectSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L138" /> {#c-object-schema-138}

```typescript
Record$<typeof String, Schema<Value, Value, never>>
```

JSON object schema. Matches objects with string keys and JSON values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `parseJsonSchema`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L146" /> {#c-parse-json-schema-146}

```typescript
SchemaClass<unknown, string, never>
```

Schema for parsing JSON strings to unknown values. Uses Effect's parseJson for better error handling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseJsonAs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L153" /> {#f-parse-json-as-153}

```typescript
<A>(schema: Schema<A, A, never>): transform<SchemaClass<unknown, string, never>, Schema<A, A, never>>
```

Schema for parsing JSON with type validation.

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isPrimitive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L51" /> {#f-is-primitive-51}

```typescript
(value: unknown): boolean
```

Type guard to check if a value is a JSON primitive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isValue`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L65" /> {#f-is-value-65}

```typescript
(value: unknown): boolean
```

Type guard to check if a value is a valid JSON value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isObject`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L87" /> {#f-is-object-87}

```typescript
(value: unknown): boolean
```

Type guard to check if a value is a JSON object.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Primitive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L18" /> {#u-primitive-18}

```typescript
type Primitive = string | number | boolean | null
```

JSON primitive type. Matches: string, number, boolean, or null.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Obj`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L25" /> {#t-obj-25}

```typescript
type Obj = { [key in string]?: Value }
```

JSON object type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Value`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L33" /> {#u-value-33}

```typescript
type Value = Primitive | Obj | Value[]
```

JSON value type. Matches any valid JSON value: primitives, objects, or arrays (recursively).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Object`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/json/json.effect.ts#L25" /> {#t-object-25}

```typescript
type Obj = { [key in string]?: Value }
```

JSON object type.
