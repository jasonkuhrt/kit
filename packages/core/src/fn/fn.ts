export * from './analyze.js'
export * from './compose.js'
export * from './constant.js'
export * from './core/__.js'
export * from './cycle.js'
export * from './endo.js'
export * from './extractor.js'
export * from './identity.js'
export * as Kind from './kind.js'
export * from './memo.js'
export * from './partial/__.js'
export * from './pipe.js'
export * from './predicates.js'

/**
 * Display handler for Function type.
 * @internal
 */
declare global {
  namespace KITZ.Traits.Display {
    interface Handlers<$Type> {
      _function: $Type extends Function ? 'Function' : never
    }
  }
}
