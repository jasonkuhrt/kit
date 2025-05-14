export interface Moniker {
  name: string
  scope: string | null
}

export const parseMoniker = (name: string): Moniker => {
  const parts = name.split(`/`)

  if (parts.length === 0) {
    throw new Error(`Invalid moniker: ${name}`)
  }

  if (parts.length === 1) {
    return { name: parts[0]!, scope: null }
  }

  if (parts.length === 2) {
    return { name: parts[1]!, scope: parts[0]! }
  }

  throw new Error(`Invalid moniker: ${name}`)
}
