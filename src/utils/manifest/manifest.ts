import { createSchemaResource, type Resource } from '#resource/resource'
import { Effect, Option, Schema as S } from 'effect'
import type { WritableDeep } from 'type-fest'

// Re-export WritableDeep to avoid type portability issues
export type { WritableDeep }

const AuthorObjectSchema = S.Struct({
  name: S.optional(S.String),
  email: S.optional(S.String),
  url: S.optional(S.String),
})

const RepositoryObjectSchema = S.Struct({
  type: S.optional(S.String),
  url: S.optional(S.String),
})

const BugsObjectSchema = S.Struct({
  url: S.optional(S.String),
  email: S.optional(S.String),
})

const EnginesSchema = S.Struct({
  node: S.optional(S.String),
  npm: S.optional(S.String),
  pnpm: S.optional(S.String),
})

const WorkspacesObjectSchema = S.Struct({
  packages: S.optional(S.Array(S.String)),
  nohoist: S.optional(S.Array(S.String)),
})

/**
 * Base immutable schema for package.json manifest
 */
export const ManifestSchemaImmutable = S.Struct({
  name: S.optionalWith(S.String, { default: () => 'unnamed' }),
  version: S.optionalWith(S.String, { default: () => '0.0.0' }),
  description: S.optional(S.String),
  main: S.optional(S.String),
  type: S.optional(S.Literal('module', 'commonjs')),
  scripts: S.optional(S.Record({ key: S.String, value: S.String })),
  dependencies: S.optional(S.Record({ key: S.String, value: S.String })),
  devDependencies: S.optional(S.Record({ key: S.String, value: S.String })),
  peerDependencies: S.optional(S.Record({ key: S.String, value: S.String })),
  optionalDependencies: S.optional(S.Record({ key: S.String, value: S.String })),
  bin: S.optional(S.Union(
    S.String,
    S.Record({ key: S.String, value: S.String }),
  )),
  files: S.optional(S.Array(S.String)),
  exports: S.optional(S.Union(
    S.Record({ key: S.String, value: S.Unknown }),
    S.String,
  )),
  imports: S.optional(S.Record({ key: S.String, value: S.Unknown })),
  engines: S.optional(EnginesSchema),
  repository: S.optional(S.Union(
    RepositoryObjectSchema,
    S.String,
  )),
  keywords: S.optional(S.Array(S.String)),
  author: S.optional(S.Union(
    S.String,
    AuthorObjectSchema,
  )),
  license: S.optional(S.String),
  bugs: S.optional(S.Union(
    BugsObjectSchema,
    S.String,
  )),
  homepage: S.optional(S.String),
  private: S.optional(S.Boolean),
  workspaces: S.optional(S.Union(
    S.Array(S.String),
    WorkspacesObjectSchema,
  )),
  packageManager: S.optional(S.String),
  madge: S.optional(S.Unknown),
}).pipe(
  S.annotations({
    identifier: 'Manifest',
    description: 'NPM package.json manifest',
  }),
)

/**
 * Mutable version of the manifest schema for runtime manipulation
 */
export const ManifestSchemaMutable = S.mutable(ManifestSchemaImmutable)

/**
 * Default export is the immutable schema (best practice)
 */
export const ManifestSchema = ManifestSchemaImmutable

/**
 * Type inferred from the immutable Schema
 */
export interface Manifest extends S.Schema.Type<typeof ManifestSchemaImmutable> {}

/**
 * Mutable type for runtime manipulation
 */
export type ManifestMutable = WritableDeep<Manifest>

/**
 * Type for bin property when normalized
 */
export type PropertyBinNormalized = Record<string, string>

/**
 * Type for package exports
 */
export type PropertyExports = Record<string, unknown> | string

/**
 * Create a new Manifest with validation and defaults
 */
export const make = (input: Partial<Manifest> = {}): Manifest => {
  return S.decodeUnknownSync(ManifestSchema)(input)
}

/**
 * Decode unknown input into a Manifest
 */
export const decode = S.decodeUnknown(ManifestSchema)

/**
 * Encode a Manifest for serialization
 */
export const encode = S.encode(ManifestSchema)

/**
 * Empty manifest with minimal required fields
 */
export const emptyManifest = make()

/**
 * Resource for reading/writing package.json with Schema validation (mutable for runtime manipulation)
 */
export const resource: Resource<ManifestMutable> = {
  read: (dirPath: string) =>
    createSchemaResource(
      'package.json',
      ManifestSchemaMutable,
      emptyManifest,
    ).read(dirPath).pipe(
      Effect.map(Option.map((result) => result as ManifestMutable)),
    ),
  write: (value: ManifestMutable, dirPath: string) =>
    createSchemaResource(
      'package.json',
      ManifestSchemaMutable,
      emptyManifest,
    ).write(value as any, dirPath),
  readOrEmpty: (dirPath: string) =>
    createSchemaResource(
      'package.json',
      ManifestSchemaMutable,
      emptyManifest,
    ).readOrEmpty(dirPath).pipe(
      Effect.map((result) => result as ManifestMutable),
    ),
}

/**
 * Overwrite a package script
 */
export const overwritePackageScript = (manifest: ManifestMutable, scriptName: string, script: string): void => {
  if (!manifest.scripts) {
    manifest.scripts = {}
  }
  manifest.scripts[scriptName] = script
}

/**
 * Merge a script into an existing package script
 */
export const mergePackageScript = (manifest: ManifestMutable, scriptName: string, script: string): void => {
  if (!manifest.scripts) {
    manifest.scripts = {}
  }
  const existing = manifest.scripts[scriptName]
  if (existing && !existing.includes(script)) {
    manifest.scripts[scriptName] = `${existing} && ${script}`
  } else if (!existing) {
    manifest.scripts[scriptName] = script
  }
}

/**
 * Remove a package script or part of a script
 */
export const removePackageScript = (manifest: ManifestMutable, scriptName: string, scriptPart?: string): void => {
  if (!manifest.scripts || !manifest.scripts[scriptName]) {
    return
  }

  if (!scriptPart) {
    delete manifest.scripts[scriptName]
  } else {
    const current = manifest.scripts[scriptName]
    if (current.includes(` && ${scriptPart}`)) {
      manifest.scripts[scriptName] = current.replace(` && ${scriptPart}`, '')
    } else if (current.includes(`${scriptPart} && `)) {
      manifest.scripts[scriptName] = current.replace(`${scriptPart} && `, '')
    } else if (current === scriptPart) {
      delete manifest.scripts[scriptName]
    }
  }
}

/**
 * Parse package name moniker (org/name format)
 */
export const parseMoniker = (packageName: string): { org?: string; name: string } => {
  const parts = packageName.split('/')
  if (parts.length === 2 && parts[0]?.startsWith('@')) {
    return { org: parts[0], name: parts[1]! }
  }
  return { name: packageName }
}
