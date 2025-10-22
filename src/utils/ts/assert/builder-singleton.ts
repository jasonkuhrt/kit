import { Prox } from '#prox'
import type { Builder } from '#utils/ts/assert/builder/builders.js'
import type { State } from './builder/state.js'

export const builder = Prox.createRecursive<Builder<State.Empty>>()
