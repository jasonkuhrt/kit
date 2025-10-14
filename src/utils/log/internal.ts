import objectInspect from 'object-inspect'

/**
 * Module to avoid circular dependencies and internal utilities
 */

export const validPathSegmentNameRegex = /^[A-z_]+[A-z_0-9]*$/

/**
 * Run a given parser over an environment variable. If parsing fails, throw a
 * contextual error message.
 */
export const parseFromEnvironment = <$T>(
  key: string,
  parser: {
    info: { valid: string; typeName: string }
    run: (raw: string) => null | $T
  },
): $T => {
  const envVarValue = process.env[key]! // assumes env presence handled before
  const result = parser.run(envVarValue)

  if (result === null) {
    throw new Error(
      `Could not parse environment variable ${key} into ${parser.info.typeName}. The environment variable was: ${
        objectInspect(envVarValue)
      }. A valid environment variable must be like: ${parser.info.valid}`,
    )
  }

  return result
}
