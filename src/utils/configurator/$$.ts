export { Configurator } from './configurator.js'
export type * from './configurator.js'

// Re-export commonly used types from Configurator namespace at the top level for easier access
import type { Configurator as C } from './configurator.js'
export type ApplyConfiguratorInputResolver$Func<
  $Configurator extends C,
  $Current extends $Configurator['normalizedIncremental'],
  $Input extends $Configurator['input'],
> = C.ApplyConfiguratorInputResolver$Func<$Configurator, $Current, $Input>
export type BuilderProviderCallback<$C extends C> = C.BuilderProviderCallback<$C>
export type Builder<$C extends C> = C.Builder<$C>
export type Configuration = C.Configuration
export type DataInput<$C extends C = C> = C.DataInput<$C>
export type InferParameters<$C extends C> = C.InferParameters<$C>
