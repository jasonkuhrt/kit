import { Json } from '#json/index.js'
import { Resource } from '#resource/index.js'
import type { Manifest } from './manifest.js'

export const resource = Resource.create({
  name: `manifest`,
  path: `package.json`,
  codec: Json.codecAs<Manifest>(),
  emptyValue: {},
})
