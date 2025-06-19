import { Err } from '#err/index.js'

/**
 * Error type for file not found errors (ENOENT).
 */
export type ErrorNotFound = NodeJS.ErrnoException & { code: 'ENOENT' }

/**
 * Check if an error is a file not found error (ENOENT).
 *
 * @param error - The error to check.
 * @returns True if the error is a file not found error.
 *
 * @example
 * ```ts
 * try {
 *   await fs.readFile('./missing.txt')
 * } catch (error) {
 *   if (isNotFoundError(error)) {
 *     console.log('File not found')
 *   }
 * }
 * ```
 */
export const isNotFoundError = (error: unknown): error is ErrorNotFound => {
  return Err.is(error) && `code` in error && error.code === `ENOENT`
}
