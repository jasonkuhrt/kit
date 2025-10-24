import type { Block } from '../nodes/block.js'
import type { BlockParameters } from '../nodes/block.js'
import type { BlockBuilder } from './block.js'
import { createBlockBuilder } from './block.js'
import type { Builder, BuilderInternal } from './helpers.js'
import { toInternalBuilder } from './helpers.js'

export const defaults = {
  terminalWidth: (typeof process !== 'undefined' && process.stdout?.columns) ?? 120,
} as const

export interface RootBuilder extends BlockBuilder<RootBuilder> {
  render(): string
}

export const createRootBuilder = (
  parameters?: BlockParameters & {
    /**
     * Terminal width in characters for rendering.
     * If not provided, uses defaults.terminalWidth (process.stdout.columns at module load time, or 120).
     *
     * @default defaults.terminalWidth
     */
    terminalWidth?: number
  },
): RootBuilder & BuilderInternal<Block> => {
  const builder = createBlockBuilder({ getSuperChain: () => builder }) as RootBuilder
  const builderInternal = toInternalBuilder(builder)

  const { terminalWidth, spanRange, ...otherParameters } = parameters ?? {}
  const defaultWidth = terminalWidth ?? defaults.terminalWidth

  builderInternal._.node.setParameters({
    spanRange: {
      ...spanRange,
      cross: {
        ...spanRange?.cross,
        max: spanRange?.cross?.max ?? defaultWidth,
      },
    },
    ...otherParameters,
  })

  builder.render = () => render(builder)

  return builder as RootBuilder & BuilderInternal<Block>
}

export const render = (builder: Builder): string => {
  const result = toInternalBuilder(builder)._.node.render({
    index: {
      isFirst: true,
      isLast: true,
      position: 0,
      total: 1,
    },
  })
  return result.value
}
