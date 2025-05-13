export type Factory = (path: string) => URL

export const factory = (baesUrl: URL): Factory => {
  return path => {
    return new URL(path, baesUrl)
  }
}
