import { Prox } from '#prox'
import type { Builder } from '#utils/ts/assert/builder/builders.ts'
import type { State } from './builder/state.ts'

export const builder = Prox.createRecursive<Builder<State.Empty>>()
