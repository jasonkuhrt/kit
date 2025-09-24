export const identity: identity = (value) => value

export type identity<$Value = any> = <$value extends $Value>(value: $value) => $value
