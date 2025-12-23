import type { ConfigManager } from '@kitz/config-manager'
import type { Overload } from '../Overload/_.js'
import type { Extension } from './_.js'

export namespace Updaters {
  export type AddOverload<
    $Extension extends Extension,
    $Overload extends Overload.Data,
  > = ConfigManager.UpdateKeyWithAppendOne<
    $Extension,
    'overloads',
    $Overload
  >
}
