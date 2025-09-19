export const encodedSeparator = '/'

export const joinEncodedPathTarget = (path: string, target: string): string => {
  if (path === './') return path + target
  if (path === '') return target // should be root case
  return [path, target].join(encodedSeparator)
}
