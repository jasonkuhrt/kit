import { Dir } from '#dir'
import { FsLoc } from '#fs-loc'
import { Str } from '#str'
import { Test } from '#test'
import { beforeEach, vi } from 'vitest'
import { extractFromFiles } from './extract.js'

// Mock Date to ensure consistent snapshots
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-10-12T10:00:00.000Z'))
})

const { ts } = Str.Tpl.highlight

const packageJson = {
  name: 'x',
  version: '0.0.0',
  exports: {
    '.': './build/index.js',
  },
}

const project = Dir
  .spec('/')
  .add('package.json', packageJson)
  .add('src/index.ts', ts``)

Test
  .on(extractFromFiles)
  .snapshotSchemas([FsLoc.FsLoc])
  .casesInput(
    // Entrypoint filtering
    {
      files: project
        .add('package.json', {
          ...packageJson,
          exports: {
            ...packageJson.exports,
            './a': './build/a.js',
          },
        })
        .add('src/a.ts', ts`export const _ = 0`)
        .toLayout(),
      entrypoints: ['.'], // ignores ./a
    },
    // Simple Entrypoint
    {
      files: project
        .add('src/index.ts', ts`/** EX _ doc */ export const _ = () => 0`)
        .toLayout(),
    },
    // Drillable Namespace Entrypoints
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './build/index.js',
            './a': './build/a.js',
          },
        })
        .add('src/index.ts', ts`/** P doc */ export * as A from './a.js'`)
        .add('src/a.ts', ts`/** NS doc */ /** _ doc **/ export const _ = 0`)
        .toLayout(),
    },
    // Filter @internal exports
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** Public export */
          export const publicFn = () => 1

          /** Internal export
           * @internal
           */
          export const internalFn = () => 2
        `,
        )
        .toLayout(),
    },
    // Filter underscore exports when option enabled
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** Public export */
          export const publicFn = () => 1

          /** Internal helper */
          export const _internalHelper = () => 2
        `,
        )
        .toLayout(),
      filterUnderscoreExports: true,
    },
    // Don't filter underscore exports by default
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** Public export */
          export const publicFn = () => 1

          /** Internal helper */
          export const _internalHelper = () => 2
        `,
        )
        .toLayout(),
      // filterUnderscoreExports defaults to false
    },
    // Mixed: @internal and underscore filtering
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** Public export */
          export const publicFn = () => 1

          /** Internal with tag
           * @internal
           */
          export const internalFn = () => 2

          /** Internal with underscore */
          export const _internalHelper = () => 3

          /** Internal with both
           * @internal
           */
          export const _superInternal = () => 4
        `,
        )
        .toLayout(),
      filterUnderscoreExports: true,
    },
  )
  .test()
