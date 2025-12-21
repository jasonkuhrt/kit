import { Prox } from '@kouka/core/prox'
import type { Builder } from './builder/builders.js'
import type { State } from './builder/state.js'

export const builder = Prox.createRecursive<Builder<State.Empty>>()
