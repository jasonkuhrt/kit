/**
 * Context information that can be attached to errors.
 * Must be an object to ensure it can be properly serialized and inspected.
 */
export type Context = object

/**
 * An error that includes additional context information.
 */
export interface ErrorWithContext extends Error {
  /**
   * Additional context information about the error.
   */
  context?: Context
}
