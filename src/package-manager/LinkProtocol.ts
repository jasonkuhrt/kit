import { Schema } from 'effect'

/**
 * Zod schema for package manager link protocols.
 * Validates link protocol values: 'link' or 'file'.
 *
 * @example
 * ```ts
 * // parse a link protocol value
 * const protocol = LinkProtocol.parse('link') // 'link'
 * ```
 */
export const LinkProtocol = Schema.Enums(
  {
    link: 'link',
    file: 'file',
  } as const,
)

/**
 * Type representing package manager link protocols.
 * Can be either 'link' or 'file'.
 */
export type LinkProtocol = Schema.Schema.Type<typeof LinkProtocol>
