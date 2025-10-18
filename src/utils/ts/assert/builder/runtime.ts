import { Prox } from '#prox'
import type { ExtractorsBuilder } from './builders.js'
import type { State } from './state.js'

export const runtime = Prox.createRecursive<ExtractorsBuilder<State.Empty>>()
