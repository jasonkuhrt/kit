/* eslint-disable @typescript-eslint/no-namespace */

/**
 * Minimal Deno global type declarations for APIs used in this module.
 * @see https://docs.deno.com/api/deno/
 */
declare namespace Deno {
  export function cwd(): string
  export const args: string[]
  export const env: {
    toObject(): Record<string, string>
  }
  export const build: {
    os: string
    arch: string
  }
  export function exit(code?: number): never
}

import { Fs } from '@kouka/fs'
import { Layer } from 'effect'
import { Env } from './env.js'
import type { Arch, Os } from './types.js'

/**
 * Pure environment object for Deno runtime using native Deno APIs.
 *
 * Use this for non-Effect code that needs cross-platform env access.
 * The conditional exports ensure the correct platform module is loaded.
 *
 * @see https://docs.deno.com/api/deno/~/Deno.cwd
 * @see https://docs.deno.com/api/deno/~/Deno.args
 * @see https://docs.deno.com/api/deno/~/Deno.env
 * @see https://docs.deno.com/api/deno/~/Deno.build.os
 * @see https://docs.deno.com/api/deno/~/Deno.build.arch
 * @see https://docs.deno.com/api/deno/~/Deno.exit
 */
export const env = {
  cwd: Fs.Path.AbsDir.fromString(Deno.cwd()),
  argv: Deno.args,
  vars: Deno.env.toObject(),
  platform: 'deno' as const,
  os: Deno.build.os as Os,
  arch: Deno.build.arch as Arch,
  exit: (code?: number): never => Deno.exit(code),
}

/**
 * Live layer for Deno runtime.
 *
 * @see https://docs.deno.com/api/deno/
 */
export const Live = Layer.succeed(Env, env)
