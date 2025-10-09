# Ts.Kind

_Ts_ / **Kind**

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Kind.someFunction()
```

## Constants

### PrivateKindReturn

```typescript
PrivateKindReturn = Symbol()
```

### PrivateKindParameters

```typescript
PrivateKindParameters = Symbol()
```

## Types

### Apply

```typescript
export type Apply<$Kind, $Args> =
  // @ts-expect-error - Intentional type manipulation for kind simulation
  ($Kind & { parameters: $Args })['return']
```

### Kind

```typescript
export interface Kind<$Params = unknown, $Return = unknown> {
  readonly parameters: $Params
  readonly return: $Return
}
```

### Parameters

```typescript
export type Parameters<$Kind> = $Kind extends Kind<infer P, any> ? P : never
```

### Return

```typescript
export type Return<$Kind> = $Kind extends Kind<any, infer R> ? R : never
```

### Identity

```typescript
export interface Identity extends Kind {
  // @ts-expect-error
  return: this['parameters'][0]
}
```

### Const

```typescript
export interface Const<$Const> extends Kind {
  return: $Const
}
```

### Private

```typescript
export interface Private {
  [PrivateKindReturn]: unknown
  [PrivateKindParameters]: unknown
}
```

### PrivateApply

```typescript
export type PrivateApply<$Kind extends Private, $Args> =
  ($Kind & { [PrivateKindParameters]: $Args })[PrivateKindReturn]
```

### MaybePrivateApplyOr

```typescript
export type MaybePrivateApplyOr<$MaybeKind, $Args, $Or> = $MaybeKind extends
  Private ? PrivateApply<$MaybeKind, $Args>
  : $Or
```

### IsPrivateKind

```typescript
export type IsPrivateKind<T> = T extends Private ? true : false
```
