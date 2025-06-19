import { Json } from '#json/index.js'
import { Resource } from '#resource/index.js'
import type { Manifest } from './manifest.js'

/**
 * Resource definition for reading and writing package.json manifest files.
 * Provides typed access to package.json with automatic JSON encoding/decoding.
 *
 * @example
 * // reading a manifest
 * const manifest = await resource.read()
 *
 * @example
 * // writing a manifest
 * await resource.write({ name: 'my-package', version: '1.0.0' })
 */
export const resource = Resource.create({
  name: `manifest`,
  path: `package.json`,
  codec: Json.codecAs<Manifest>(),
  emptyValue: {},
})
