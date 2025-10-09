# Json

JSON utilities with Effect Schema integration.

Provides type-safe JSON operations including type guards, parsing, encoding,
and validation using Effect Schema. Supports JSON primitives, objects, and
recursive value structures with comprehensive error handling.

## Import

```typescript
import { Json } from '@wollybeard/kit/json'
```

## Functions

### isPrimitive <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L43)</sub>

```typescript
(value: unknown) => value is Primitive
```

### isValue <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L55)</sub>

```typescript
(value: unknown) => value is Value
```

### isObject <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L75)</sub>

```typescript
(value: unknown) => value is Obj
```

### parseJsonAs <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L131)</sub>

```typescript
;(<A>(schema: Schema<A, A, never>) =>
  transform<SchemaClass<unknown, string, never>, Schema<A, A, never>>)
```

## Constants

### PrimitiveSchema <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L96)</sub>

```typescript
Union<[typeof String, typeof Number, typeof Boolean, typeof Null]>
```

### ValueSchema <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L108)</sub>

```typescript
Schema<Value, Value, never>
```

### ObjectSchema <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L120)</sub>

```typescript
Record$<typeof String, Schema<Value, Value, never>>
```

### parseJsonSchema <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L126)</sub>

```typescript
SchemaClass<unknown, string, never>
```

### codec <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L145)</sub>

```typescript
Codec<Value>
```

### encode <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L161)</sub>

```typescript
Encode<Value>
```

### decode <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L167)</sub>

```typescript
Decode<Value>
```

### ObjectParser <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L189)</sub>

```typescript
{ parse: (value: unknown) => { readonly [x: string]: Value; }; }
```

## Types

### Primitive <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L16)</sub>

JSON primitive type.
Matches: string, number, boolean, or null.

```typescript
export type Primitive = string | number | boolean | null
```

### Obj <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L21)</sub>

JSON object type.

```typescript
export type Obj = { [key in string]?: Value }
```

### Value <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L27)</sub>

JSON value type.
Matches any valid JSON value: primitives, objects, or arrays (recursively).

```typescript
export type Value = Primitive | Obj | Value[]
```

### Object <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/json/json.effect.ts#L21)</sub>

JSON object type.

```typescript
export type Obj = { [key in string]?: Value }
```
