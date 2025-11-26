export type SearchParamsInit = ConstructorParameters<typeof URLSearchParams>[0]

export const appendAllMutate = (url: URL, additionalSearchParams: SearchParamsInit) => {
  const sp = new URLSearchParams(additionalSearchParams)
  sp.forEach((value, key) => {
    url.searchParams.append(key, value)
  })
}

export const appendAll = (url: URL | string, additionalSearchParams: SearchParamsInit) => {
  const url2 = new URL(url)
  appendAllMutate(url2, additionalSearchParams)
  return url2
}

export const appendAllToPath = (path: string, additionalSearchParams: SearchParamsInit): string => {
  // Use a dummy base to safely manipulate search params for a path
  const dummyBase = 'http://dummy'
  const tempUrl = new URL(path, dummyBase)
  appendAllMutate(tempUrl, additionalSearchParams)
  // Extract everything after the dummy origin
  return tempUrl.href.slice(dummyBase.length)
}
