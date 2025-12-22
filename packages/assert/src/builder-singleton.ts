import { Prox } from '@kouka/core'
import type { Builder } from './builder/builders.js'
import type { State } from './builder/state.js'

export const builder = Prox.createRecursive<Builder<State.Empty>>()
