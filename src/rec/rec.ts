export const is = (value: unknown): value is Record<string, unknown> => {
  return typeof value === `object` && value !== null && !Array.isArray(value)
}
