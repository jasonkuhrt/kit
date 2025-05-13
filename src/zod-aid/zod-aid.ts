import { z } from 'zod'

export const isDefault = (zodType: z.ZodType): zodType is z.ZodDefault<z.ZodType> => {
  return 'defaultValue' in zodType._def
}

export const typeGuard =
  <$Schema extends z.ZodType, $Value = z.infer<$Schema>>(schema: $Schema) => (value: unknown): value is $Value => {
    const result = schema.safeParse(value)
    return result.success
  }
