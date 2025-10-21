import { Prox } from '#prox'
import type { BaseBuilder } from './builders.js'
import type { State } from './state.js'

export const runtime = Prox.createRecursive<BaseBuilder<State.Empty>>()
