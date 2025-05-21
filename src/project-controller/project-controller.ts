import type { ProcessPromise, Shell } from 'zx'
import { Debug } from '../debug/index.js'
import { FsRelative } from '../fs-relative/index.js'
import { Fs } from '../fs/index.js'
import { Language } from '../language/index.js'
import type { SideEffect } from '../language/language.js'
import { Manifest } from '../manifest/index.js'
import type { PackageManager } from '../package-manager/index.js'
import { Path } from '../path/index.js'
import type { Str } from '../str/index.js'
import { Layout } from './layout.js'

type ScriptRunner = (...args: any[]) => Promise<any>

type ScriptRunners = Record<string, ScriptRunner>

export const defaultTemplateIgnore = [
  /node_module/,
  /build/,
  /dist/,
]

export interface ProjectController<
  // eslint-disable-next-line
  $ScriptRunners extends ScriptRunners = {},
> {
  layout: Layout.Layout
  shell: Shell
  packageManager: Shell
  files: {
    packageJson?: Manifest.Manifest | undefined
  }
  run: $ScriptRunners
  /**
   * Directory path to this project.
   */
  dir: string
  /**
   * Cancel any still running child processes.
   */
  stop: () => SideEffect
}

type ScaffoldInput = TemplateScaffoldInput | InitScaffold

interface TemplateScaffoldInput {
  type: `template`
  /**
   * Path to a directory whose contents will be used as the project template.
   *
   * Its files will be copied.
   */
  dir: string
  ignore?: Str.PatternsInput
}

interface InitScaffold {
  type: `init`
}

interface TemplateScaffold {
  type: `template`
  /**
   * Path to a directory whose contents will be used as the project template.
   *
   * Its files will be copied.
   */
  dir: string
  ignore: Str.PatternsInput
}

type Scaffold = TemplateScaffold | InitScaffold

interface ConfigInput<$ScriptRunners extends ScriptRunners = ScriptRunners> {
  debug?: Debug.Debug | undefined
  package?: false | {
    /**
     * @defaultValue `false`
     */
    install?: boolean | undefined
    links?: {
      dir: string
      protocol: PackageManager.LinkProtocol
    }[] | undefined
  }
  scripts?: ((project: ProjectController) => $ScriptRunners) | undefined
  /**
   * By default uses an "init" scaffold. This is akin to running e.g. `pnpm init`.
   */
  scaffold?: string | ScaffoldInput | undefined
}

interface Config {
  debug: Debug.Debug
  scaffold: Scaffold
  package: {
    enabled: boolean
    install: boolean
  }
}

const resolveConfigInput = (configInput: ConfigInput<any>): Config => {
  const debug = configInput.debug ?? Debug.debug

  const scaffold: Scaffold = typeof configInput.scaffold === `string`
    ? ({
      type: `template`,
      dir: configInput.scaffold,
      ignore: defaultTemplateIgnore,
    } satisfies TemplateScaffoldInput)
    : configInput.scaffold?.type === `template`
    ? {
      ...configInput.scaffold,
      ignore: configInput.scaffold.ignore ?? defaultTemplateIgnore,
    }
    : configInput.scaffold?.type === `init`
    ? ({ type: `init` } satisfies InitScaffold)
    : ({ type: `init` } satisfies InitScaffold)

  const install = configInput.package ? (configInput.package.install ?? false) : false

  return {
    debug,
    scaffold,
    package: {
      enabled: configInput.package !== false,
      install,
    },
  }
}

// eslint-disable-next-line
export const create = async <scriptRunners extends ScriptRunners = {}>(
  parameters: ConfigInput<scriptRunners>,
): Promise<ProjectController<scriptRunners>> => {
  const config = resolveConfigInput(parameters)

  const { debug } = config

  // utilities

  const fsr = FsRelative.create({ directory: await Fs.makeTemporaryDirectory() })

  debug(`created temporary directory`, { path: fsr.cwd })

  const { $ } = await import(`zx`)

  // const ac = new AbortController()

  const shell = $({ cwd: fsr.cwd })

  const shellProcesses: ProcessPromise[] = []

  const shellWrapped: Shell = (pieces: any, ...args: any[]) => {
    const p = shell(pieces, ...args)
    shellProcesses.push(p)
    return p
  }

  shellWrapped.sync = shell.sync

  const pnpmShell: Shell = shellWrapped({ prefix: `pnpm ` })

  const layout = Layout.create({ fsRelative: fsr })

  // scaffold

  switch (config.scaffold.type) {
    case `template`: {
      await Fs.copyDir({
        from: config.scaffold.dir,
        to: fsr.cwd,
        options: { ignore: config.scaffold.ignore },
      })
      debug(`copied template`)
      break
    }
    case `init`: {
      const initPackageJson = {
        path: `package.json`,
        content: {
          name: `project`,
          packageManager: `pnpm@10.10.0`,
        },
      }
      await fsr.write(initPackageJson)
      break
    }
    default: {
      Language.neverCase(config.scaffold)
    }
  }

  // files

  const packageJson = await Manifest.resource.read(fsr.cwd)
  if (config.package.enabled) {
    if (!packageJson) Language.never(`packageJson missing in ${fsr.cwd}`)
  }

  const files = {
    packageJson,
  }

  // instance

  const project: ProjectController<scriptRunners> = {
    shell: shellWrapped,
    layout,
    files,
    packageManager: pnpmShell,
    dir: fsr.cwd,
    stop: async () => {
      await Promise.allSettled(shellProcesses.map(async p => {
        if (p.isHalted()) return
        await p.kill()
      }))

      // if (!ac.signal.aborted) {
      //   ac.abort('project.stop()')
      //   setTimeout(() => {
      //   }, 1000);
      // }
    },
    // Will be overwritten
    // eslint-disable-next-line
    run: undefined as any,
  }

  project.run = parameters.scripts?.(project) ?? {} as scriptRunners

  // Initialize

  // links

  const links = parameters.package ? parameters.package.links ?? [] : []
  for (const link of links) {
    const pathToLinkDirFromProject = Path.join(
      `..`,
      Path.relative(project.layout.cwd, link.dir),
    )
    debug(`install link`, link)

    switch (link.protocol) {
      case `link`: {
        await project.packageManager`add ${`link:` + pathToLinkDirFromProject}`
        break
      }
      case `file`: {
        await project.packageManager`add ${`file:` + pathToLinkDirFromProject}`
        break
      }
      default: {
        Language.neverCase(link.protocol)
      }
    }
  }

  // init

  // install

  if (config.package.install) {
    await project.packageManager`install`
    debug(`installed dependencies`)
  }

  // return

  return project
}

export * from './layout.js'
