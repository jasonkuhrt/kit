import type { Block } from '../nodes/block.js'
import type { BlockParameters } from '../nodes/block.js'
import type { BlockBuilder } from './block.js'
import { createBlockBuilder } from './block.js'
import type { Builder, BuilderInternal } from './helpers.js'
import { toInternalBuilder } from './helpers.js'

export const defaults = {
  terminalWidth: 120,
} as const

export interface RootBuilder extends BlockBuilder<RootBuilder> {
  render(): string
}

export const createRootBuilder = (parameters?: BlockParameters): RootBuilder & BuilderInternal<Block> => {
  const builder = createBlockBuilder({ getSuperChain: () => builder }) as RootBuilder
  const builderInternal = toInternalBuilder(builder)

  const defaultWidth = process.stdout.columns ?? defaults.terminalWidth

  const { spanRange, ...otherParameters } = parameters ?? {}

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
