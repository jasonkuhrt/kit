import type { Obj } from '@kitz/core'
import type { Overload } from '../Overload/_.js'
import type { Extension } from './_.js'

export namespace Updaters {
  export type AddOverload<
    $Extension extends Extension,
    $Overload extends Overload.Data,
  > = Obj.UpdateKeyWithAppendOne<
    $Extension,
    'overloads',
    $Overload
  >
}
