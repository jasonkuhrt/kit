import type { PackageJson } from 'type-fest'

export * from './moniker.js'

export * from './resource.js'

/**
 * Type representing the exports property of a package.json file.
 * Excludes the undefined case from PackageJson's exports type.
 */
export type PropertyExports = Exclude<PackageJson[`exports`], undefined>

/**
 * Type representing the scripts property of a package.json file.
 * Excludes the undefined case from PackageJson's scripts type.
 */
export type PropertyScripts = Exclude<PackageJson[`scripts`], undefined>

/**
 * Type representing the bin property of a package.json file.
 * Excludes the undefined case from PackageJson's bin type.
 */
export type PropertyBin = Exclude<PackageJson[`bin`], undefined>

/**
 * Type representing a normalized bin property as a record.
 * The bin property can be a string or record, this type extracts only the record form.
 */
export type PropertyBinNormalized = Extract<PropertyBin, Record<any, any>>

/**
 * Type alias for a package.json manifest.
 * Represents the complete structure of a package.json file.
 */
export type Manifest = PackageJson

/**
 * Type representing a normalized package.json manifest.
 * The bin property is guaranteed to be either undefined or in record form.
 */
export type NormalizedManifest = Omit<Manifest, `bin`> & {
  bin: undefined | PropertyBinNormalized
}

/**
 * Normalizes a package.json manifest by converting the bin property to record form.
 *
 * @param value - The manifest to normalize.
 * @returns A normalized manifest with bin property as undefined or record.
 *
 * @example
 * // normalizing a manifest with string bin
 * const manifest = { name: 'my-package', bin: './cli.js' }
 * const normalized = normalize(manifest)
 * // normalized.bin is now { 'my-package': './cli.js' }
 *
 * @example
 * // normalizing a manifest with record bin
 * const manifest = { name: 'my-package', bin: { 'my-cli': './cli.js' } }
 * const normalized = normalize(manifest)
 * // normalized.bin remains { 'my-cli': './cli.js' }
 */
export const normalize = (value: Manifest): NormalizedManifest => {
  const value_ = structuredClone(value) as NormalizedManifest

  /**
   * @see https://docs.npmjs.com/cli/v10/configuring-npm/package-json?v=true#bin
   */
  if (typeof value_.bin === `string`) {
    const name = value.name ?? `no-name-package`
    value_.bin = {
      [name]: value_.bin,
    }
  }

  return value_
}

/**
 * Overwrites or adds a script to the manifest's scripts property.
 * Mutates the manifest object directly.
 *
 * @param manifest - The manifest to modify.
 * @param name - The name of the script to set.
 * @param value - The script command to set.
 *
 * @example
 * // overwriting an existing script
 * const manifest = { scripts: { test: 'jest' } }
 * overwritePackageScript(manifest, 'test', 'vitest')
 * // manifest.scripts.test is now 'vitest'
 *
 * @example
 * // adding a new script
 * const manifest = {}
 * overwritePackageScript(manifest, 'build', 'tsc')
 * // manifest.scripts is now { build: 'tsc' }
 */
export const overwritePackageScript = (manifest: Manifest, name: string, value: string) => {
  const packageScripts = manifest.scripts ?? {}
  packageScripts[name] = value
  manifest.scripts = packageScripts
}

/**
 * Merges a script command into the manifest's scripts property.
 * If the script already exists, appends the new value with && separator.
 * Mutates the manifest object directly.
 *
 * @param manifest - The manifest to modify.
 * @param name - The name of the script to merge into.
 * @param value - The script command to merge.
 *
 * @example
 * // merging into an existing script
 * const manifest = { scripts: { test: 'jest' } }
 * mergePackageScript(manifest, 'test', 'eslint')
 * // manifest.scripts.test is now 'jest && eslint'
 *
 * @example
 * // merging into a new script
 * const manifest = {}
 * mergePackageScript(manifest, 'test', 'jest')
 * // manifest.scripts is now { test: 'jest' }
 *
 * @example
 * // no duplicate merge
 * const manifest = { scripts: { test: 'jest && eslint' } }
 * mergePackageScript(manifest, 'test', 'eslint')
 * // manifest.scripts.test remains 'jest && eslint'
 */
export const mergePackageScript = (manifest: Manifest, name: string, value: string) => {
  const packageScripts = manifest.scripts ?? {}
  const existingScript = packageScripts[name]

  if (existingScript) {
    if (existingScript.includes(value)) return
    packageScripts[name] = scriptJoin([existingScript, value])
  } else {
    packageScripts[name] = value
  }

  manifest.scripts = packageScripts
}

/**
 * Removes a script or part of a script from the manifest's scripts property.
 * If value is provided, removes only that part of the script.
 * If value is not provided, removes the entire script.
 * Mutates the manifest object directly.
 *
 * @param manifest - The manifest to modify.
 * @param name - The name of the script to remove from.
 * @param value - Optional specific command to remove from the script.
 *
 * @example
 * // removing an entire script
 * const manifest = { scripts: { test: 'jest' } }
 * removePackageScript(manifest, 'test')
 * // manifest.scripts is now {}
 *
 * @example
 * // removing part of a script
 * const manifest = { scripts: { test: 'jest && eslint' } }
 * removePackageScript(manifest, 'test', 'eslint')
 * // manifest.scripts.test is now 'jest'
 *
 * @example
 * // removing last part of a script
 * const manifest = { scripts: { test: 'jest' } }
 * removePackageScript(manifest, 'test', 'jest')
 * // manifest.scripts is now {} (empty scripts removed)
 */
export const removePackageScript = (manifest: Manifest, name: string, value?: string) => {
  const packageScripts = manifest.scripts ?? {}
  const existingScript = packageScripts[name]

  if (!existingScript) {
    return
  }
  if (!value) {
    // eslint-disable-next-line
    delete packageScripts[name]
    return
  }
  if (!existingScript.includes(value)) {
    return
  }

  const newScript = scriptExclude(existingScript, value)
  if (newScript === ``) {
    // eslint-disable-next-line
    delete packageScripts[name]
  } else {
    packageScripts[name] = newScript
  }

  if (Object.keys(packageScripts).length > 0) {
    manifest.scripts = packageScripts
  }
}

const scriptSplit = (script: string) => script.split(`&&`).map(s => s.trim())

const scriptJoin = (scripts: string[]) => scripts.map(s => s.trim()).filter(s => s !== ``).join(` && `)

const scriptExclude = (script: string, scriptToExclude: string) =>
  scriptJoin(scriptSplit(script).filter(s => s !== scriptToExclude))
