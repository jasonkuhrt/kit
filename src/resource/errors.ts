/**
 * Base error class for resource operations.
 */
export abstract class ResourceError extends Error {
  abstract readonly _tag: string

  constructor(
    message: string,
    public readonly resourceName: string,
    public readonly filePath: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

/**
 * Error when resource file is not found.
 */
export class ResourceErrorNotFound extends ResourceError {
  readonly _tag = 'ResourceErrorNotFound' as const

  constructor(resourceName: string, filePath: string) {
    super(`Resource "${resourceName}" not found at: ${filePath}`, resourceName, filePath)
  }
}

/**
 * Error when resource content cannot be decoded.
 */
export class ResourceErrorDecodeFailed extends ResourceError {
  readonly _tag = 'ResourceErrorDecodeFailed' as const

  constructor(
    resourceName: string,
    filePath: string,
    public override readonly cause: unknown,
  ) {
    super(
      `Failed to decode resource "${resourceName}" from: ${filePath}`,
      resourceName,
      filePath,
    )
    // Set cause if the environment supports it (Node 16.9+)
    if ('cause' in Error.prototype) {
      ;(this as any).cause = cause
    }
  }
}

/**
 * Error when resource content fails schema validation.
 */
export class ResourceErrorValidationFailed extends ResourceError {
  readonly _tag = 'ResourceErrorValidationFailed' as const

  constructor(
    resourceName: string,
    filePath: string,
    public readonly errors: unknown,
  ) {
    super(
      `Schema validation failed for resource "${resourceName}" from: ${filePath}`,
      resourceName,
      filePath,
    )
  }
}

/**
 * Union of all resource errors.
 */
export type ResourceErrorAny =
  | ResourceErrorNotFound
  | ResourceErrorDecodeFailed
  | ResourceErrorValidationFailed

// Constructor functions for convenience

export const notFound = (resourceName: string, filePath: string): ResourceErrorNotFound =>
  new ResourceErrorNotFound(resourceName, filePath)

export const decodeFailed = (
  resourceName: string,
  filePath: string,
  cause: unknown,
): ResourceErrorDecodeFailed => new ResourceErrorDecodeFailed(resourceName, filePath, cause)

export const validationFailed = (
  resourceName: string,
  filePath: string,
  errors: unknown,
): ResourceErrorValidationFailed => new ResourceErrorValidationFailed(resourceName, filePath, errors)

// Type guards

export const isNotFound = (error: unknown): error is ResourceErrorNotFound => error instanceof ResourceErrorNotFound

export const isDecodeFailed = (error: unknown): error is ResourceErrorDecodeFailed =>
  error instanceof ResourceErrorDecodeFailed

export const isValidationFailed = (error: unknown): error is ResourceErrorValidationFailed =>
  error instanceof ResourceErrorValidationFailed

export const isResourceError = (error: unknown): error is ResourceError => error instanceof ResourceError

/**
 * Check if a value is any resource error.
 * This is a convenience function that combines Err.is with isResourceError.
 */
export const is = (error: unknown): error is ResourceErrorAny => isResourceError(error)
