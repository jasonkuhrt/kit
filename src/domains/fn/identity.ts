/**
 * @category Basic Functions
 */
export const identity: identity = (value) => value

/**
 * @category Basic Functions
 */
export type identity<$Value = any> = <$value extends $Value>(value: $value) => $value
