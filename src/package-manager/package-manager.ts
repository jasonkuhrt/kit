import { z } from 'zod'

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
export const LinkProtocol = z.enum([`link`, `file`])

/**
 * Type representing package manager link protocols.
 * Can be either 'link' or 'file'.
 */
export type LinkProtocol = z.infer<typeof LinkProtocol>
