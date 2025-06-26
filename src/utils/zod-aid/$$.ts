import { z } from 'zod/v4'

/**
 * Check if a Zod type has a default value.
 *
 * @param zodType - The Zod type to check.
 *
 * @returns True if the type has a default value, false otherwise.
 *
 * @example
 * ```ts
 * // check various zod types
 * const stringSchema = z.string()
 * const stringWithDefault = z.string().default('hello')
 * const numberWithDefault = z.number().default(42)
 *
 * console.log(isDefault(stringSchema)) // false
 * console.log(isDefault(stringWithDefault)) // true
 * console.log(isDefault(numberWithDefault)) // true
 * ```
 */
export const isDefault = (zodType: z.ZodType): zodType is z.ZodDefault<z.ZodType> => {
  return 'defaultValue' in zodType._def
}

/**
 * Create a type guard function from a Zod schema.
 *
 * @template $Schema - The Zod schema type.
 * @template $Value - The inferred type from the schema.
 *
 * @param schema - The Zod schema to use for validation.
 *
 * @returns A type guard function that validates values against the schema.
 *
 * @example
 * ```ts
 * // create type guards from zod schemas
 * const isUser = typeGuard(z.object({
 *   name: z.string(),
 *   age: z.number()
 * }))
 *
 * const isStringArray = typeGuard(z.array(z.string()))
 *
 * // use the type guards
 * const data: unknown = { name: 'john', age: 30 }
 * if (isUser(data)) {
 *   // data is now typed as { name: string; age: number }
 *   console.log(data.name)
 * }
 *
 * const items: unknown = ['a', 'b', 'c']
 * if (isStringArray(items)) {
 *   // items is now typed as string[]
 *   items.forEach(item => console.log(item.toUpperCase()))
 * }
 * ```
 */
export const typeGuard =
  <$Schema extends z.ZodType, $Value = z.infer<$Schema>>(schema: $Schema) => (value: unknown): value is $Value => {
    const result = schema.safeParse(value)
    return result.success
  }
