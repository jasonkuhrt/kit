import type { PackageJson } from 'type-fest'
import { Json } from '../json/index.js'
import { Language } from '../language/index.js'
import { Resource } from '../resource/index.js'

export * from './moniker.js'

export const resource = Resource.create({
  name: `manifest`,
  path: `package.json`,
  codec: Json.codecAs<Manifest>(),
  emptyValue: Language.constant({}),
})

export type PropertyExports = Exclude<PackageJson[`exports`], undefined>

export type PropertyScripts = Exclude<PackageJson[`scripts`], undefined>

export type PropertyBin = Exclude<PackageJson[`bin`], undefined>

export type PropertyBinNormalized = Extract<PropertyBin, Record<any, any>>

export type Manifest = PackageJson

export type NormalizedManifest = Omit<Manifest, `bin`> & {
  bin: undefined | PropertyBinNormalized
}

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

export const overwritePackageScript = (manifest: Manifest, name: string, value: string) => {
  const packageScripts = manifest.scripts ?? {}
  packageScripts[name] = value
  manifest.scripts = packageScripts
}

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
