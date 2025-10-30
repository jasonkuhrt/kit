import type { ArrMut } from '#arr-mut'
import type { Fn } from '#fn'
import type { Obj } from '#obj'
import type { Domain } from '#traitor/traitor'
import type { Ts } from '#ts'
import * as Laws from './laws/__.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Base Aliases
//
//

type Interface = object

type Deps = ReadonlyArray<Definition>

type DepsDefault = readonly any[]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Internal
//
//

/**
 * Private symbol for storing trait metadata.
 * This symbol is not exported, making it inaccessible outside this module.
 */
const internalProperty = Symbol('internal')
type internalProperty = typeof internalProperty

/**
 * Metadata stored on each trait interface.
 */
export interface Internal<
  $Name extends string = string,
  $Interface extends Interface = Interface,
  $Deps extends Deps = DepsDefault,
> {
  name: $Name
  interface: $Interface
  deps: $Deps
  laws?: Laws.Input.TraitSelectResolved
  methods?: MethodsConfig<$Interface> | undefined
}

/**
 * Extract the internal interface from a trait.
 * This requires access to the private symbol.
 */
// dprint-ignore
export type GetInternal<$Definition extends Definition> =
  $Definition[internalProperty]

/**
 * Extract the internal interface from a trait.
 * This requires access to the private symbol.
 */
export type GetInternalInterface<$Definition extends Definition> = $Definition[internalProperty]['interface']

export type GetAppliedInternalInterface<
  $Definition extends Definition,
  $Domain extends Domain,
> = GetInternalInterface<
  Fn.Kind.MaybePrivateApplyOr<$Definition, [$Domain['_type']], $Definition>
>

export type GetAppliedInterface<
  $Definition extends Definition,
  $Domain extends Domain,
> = Fn.Kind.MaybePrivateApplyOr<
  $Definition,
  [$Domain['_type']],
  $Definition
>

export type GetDeps<$Definition extends Definition> = $Definition[internalProperty]['deps']

export type GetName<$Definition extends Definition> = $Definition[internalProperty]['name']

export const getInternal = <definition extends Definition>(definition: definition): GetInternal<definition> => {
  return definition[internalProperty] as any
}

export const mergeInternal = <definition extends Definition>(
  definition: definition,
  metadata: Partial<Internal>,
): void => {
  Object.assign(definition[internalProperty], metadata)
}

/**
 * Type for the domain parameter passed to hooks.
 * Contains all trait implementations for a specific domain.
 */
export type DomainParam<$Definition extends Definition> = domainParam<$Definition>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Method Configuration
//
//

/**
 * Curry generation configuration.
 */
export interface CurryConfig {
  on?: boolean
  with?: boolean
}

/**
 * Default domain check strategy when not specified.
 */
export const defaultDomainCheck: number[] = []

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Methods
//
//

//
//
//
// ━━━━━━━━━━━━━━ • Callback
//
//

/**
 * Methods configuration object with proper typing for each method.
 */
export type Methods<$Interface extends object> = {
  [K in keyof $Interface]: MethodInput<$Interface[K]>
}

// Store trait metadata in a WeakMap for later access by implement
export const traitMetadata = new WeakMap<object, { name: string; methods?: any }>()

// Store method configurations globally for dispatcher access
export const traitMethodConfigs = new Map<string, Record<string, MethodConfig<any>>>()

/**
 * Methods configuration type for trait definitions.
 * Provides static configuration for method domain detection, pre-processing and implementations.
 */
export type MethodsConfig<$Interface> =
  & {
    // Optional methods in internal interface MUST provide either default or defaultWith
    [__key__ in Obj.OptionalKeys<$Interface>]: MethodRequired<$Interface[__key__]>
  }
  & {
    // Required methods in internal interface CAN be configured (optional)
    [__key__ in Obj.RequiredKeys<$Interface>]?: MethodInput<$Interface[__key__]>
  }

//
//
//
// ━━━━━━━━━━━━━━ • Domain Parameter
//
//

/**
 * Build domain object type from dependencies.
 * Includes the current trait and all its dependencies.
 */
// dprint-ignore
export type DomainParamDeps<$Definition extends Definition> =
  GetDeps<$Definition> extends Deps
    ?  ArrMut.ReduceWithIntersection<toInternalInterfaces<GetDeps<$Definition>>>
    : {}

// dprint-ignore
type toInternalInterfaces<$Deps extends ReadonlyArray<Definition>> = {
  [__index__ in keyof $Deps]:
    {
      [_ in GetName<$Deps[__index__]>]:
        GetInternalInterface<$Deps[__index__]>
    }
}

// dprint-ignore
type domainParam<$Definition extends Definition> =
  & DomainParamDeps<$Definition>
  & GetInternalInterface<$Definition>

/**
 * Build a domain object containing all trait implementations for this domain.
 *
 * This is the runtime equivalent of the `DomainParam` type above.
 * It creates an object that provides access to all traits that have been
 * implemented by a specific domain (e.g., 'Str', 'Num', 'Arr'), including
 * the trait being registered and all its dependencies.
 *
 * This object is passed to trait hooks as the `domain` parameter, enabling
 * cross-trait dependencies. For example, the Eq trait can use Type.is()
 * to check if values are of the correct type before comparing them.
 *
 * Example structure for String domain implementing Eq:
 * ```
 * {
 *   Type: { is: (value) => typeof value === 'string' },
 *   Eq: { is: (a, b) => a === b },  // The implementation being registered
 *   // ... other trait implementations for this domain
 * }
 * ```
 *
 * Type correspondence:
 * - Type-level: `DomainParam<Definition>`
 * - Runtime: This function's return value
 *
 * @param registry - The global registry containing all trait implementations
 * @param domainName - The name of the domain (e.g., 'Str', 'Num', 'Arr')
 * @param traitName - The name of the trait being implemented (e.g., 'Eq', 'Type')
 * @param implementation - The actual implementation being registered
 * @returns An object with all trait implementations for this domain
 */
export const domainParam = <$Definition extends Definition>(
  registry: any, // Registry.Data type from registry module
  domainName: string,
  traitName: GetName<$Definition>,
  implementation: any,
): domainParam<$Definition> => {
  const domainWithDeps: any = {}

  // Add all existing trait implementations for this domain
  for (const trait in registry) {
    const traitImpl = registry[trait]?.implementations[domainName]
    if (traitImpl) {
      domainWithDeps[trait] = traitImpl
    }
  }

  // Add the current implementation being registered
  domainWithDeps[traitName] = implementation

  return domainWithDeps
}

/**
 * Method configuration with domain detection and hooks.
 * Properly typed to match the interface method signature.
 */
export type MethodInput<$Method> = $Method extends Fn.AnyAny ? MethodConfig<$Method>
  : never

export interface MethodConfig<$Method extends Fn.AnyAny> {
  arity?: number
  curry?: CurryConfig
  domainCheck?: number[]
  domainMissing?: (...args: Parameters<$Method>) => ReturnType<$Method>

  // Direct hooks (no context needed)
  pre?: (...args: Parameters<$Method>) => ReturnType<$Method> | void
  post?: (result: ReturnType<$Method>, ...args: Parameters<$Method>) => ReturnType<$Method>
  default?: $Method

  // Context-aware hooks
  preWith?: (context: { domain: any; trait: any }) => (...args: Parameters<$Method>) => ReturnType<$Method> | void
  postWith?: (
    context: { domain: any; trait: any },
  ) => (result: ReturnType<$Method>, ...args: Parameters<$Method>) => ReturnType<$Method>
  defaultWith?: (context: { domain: any; trait: any }) => $Method

  // Co-located laws
  laws?: Record<string, boolean>
}

/**
 * Normalize method input into a consistent MethodConfig format.
 *
 * @param input - A MethodConfig object
 * @returns Normalized MethodConfig object
 */
const normalizeMethodInput = <$Method extends Fn.AnyAny>(
  input: MethodInput<$Method>,
): MethodConfig<$Method> => {
  // Already a MethodConfig object
  return input as any
}

// For optional methods, require either default or defaultWith implementation
// dprint-ignore
type MethodRequired<$Method> = $Method extends Fn.AnyAny
    ? MethodConfig<$Method> & ({ default: $Method } | { defaultWith: (context: { domain: any; trait: any }) => $Method })
    : never

//
//
//
// ━━━━━━━━━━━━━━ • Application
//
//

export type ParamContextGeneric = {
  domain: Domain
  trait: object
}

/**
 * Process methods configuration to create enhanced trait methods.
 *
 * This is the runtime equivalent of the MethodsInput/MethodsInputReturn types.
 * Methods allow traits to configure domain detection, add pre/post processing,
 * provide default implementations, and generate curried variants.
 *
 * Method configurations include:
 * - arity: Override detected arity for the method
 * - curry: Control which curried variants to generate
 * - domainCheck: Which arguments to check for domain detection
 * - domainMissing: What to do when domain detection fails
 * - pre: Pre-processing logic before implementation
 * - post: Post-processing logic after implementation
 * - default: Default implementation (receives trait parameter)
 *
 * Type correspondence:
 * - Type-level: `MethodsInput<Definition>` and `MethodsInputReturn<Interface>`
 * - Runtime: This function processes the return value of MethodsInput
 *
 * @param methods - The methods configuration object from trait definition
 * @param domainImplementation - The domain's base implementation
 * @param trait - The trait instance for default implementations
 * @returns Enhanced methods with configurations applied
 */
export const applyTraitMethods = <$Interface extends Interface>(
  methods: MethodsConfig<$Interface>,
  domainImplementation: $Interface,
  context: ParamContextGeneric,
): $Interface => {
  const enhancedImplementation = {} as Record<string, Fn.AnyAny>

  // Get all method names from both domain implementation and method configs
  const allMethodNames = new Set([
    ...Object.keys(domainImplementation),
    ...Object.keys(methods),
  ])

  // Single loop to process all methods
  for (const methodName of allMethodNames) {
    const domainMethod = domainImplementation[methodName as keyof $Interface] as Fn.AnyAny | undefined
    const methodConfig = methods[methodName as keyof $Interface] as MethodInput<any> | undefined

    // Handle non-function properties from domain
    if (domainMethod !== undefined && typeof domainMethod !== 'function') {
      enhancedImplementation[methodName] = domainMethod
      continue
    }

    // Get method implementation: prefer domain impl, fall back to default/defaultWith
    let impl: Fn.AnyAny | undefined
    if (typeof domainMethod === 'function') {
      impl = domainMethod
    } else if (methodConfig?.default) {
      impl = methodConfig.default
    } else if (methodConfig?.defaultWith) {
      impl = methodConfig.defaultWith(context) as Fn.AnyAny
    }

    if (impl) {
      const config = normalizeMethodInput(methodConfig || {})

      // Add the base method with enhancements
      enhancedImplementation[methodName] = enhanceMethod(config, impl, context) as any

      // Generate curried variants if applicable
      const arity = config.arity ?? impl.length
      if (arity > 1) {
        generateCurriedVariants(
          methodName,
          enhancedImplementation[methodName] as Fn.AnyAny,
          config,
          arity,
          enhancedImplementation,
        )
      }
    }
  }

  return enhancedImplementation as any
}

/**
 * Generate curried variants for a method.
 *
 * @param methodName - The base method name
 * @param method - The enhanced method implementation
 * @param config - The method configuration
 * @param arity - The arity of the method
 * @param target - The object to add curried variants to
 */
const generateCurriedVariants = <$Interface extends object>(
  methodName: string,
  method: Fn.AnyAny,
  config: MethodConfig<any>,
  arity: number,
  target: $Interface,
): void => {
  const curry = config.curry ?? { on: true, with: true }

  // Generate 'on' variant (curry first argument)
  if (curry.on !== false && arity >= 2) {
    const onName = `${methodName}On` as keyof $Interface
    if (!(onName in target)) {
      target[onName] = ((firstArg: any) => (...restArgs: any[]) => method(firstArg, ...restArgs)) as any
    }
  }

  // Generate 'with' variant (curry second argument) - only for arity 2+
  if (curry.with !== false && arity >= 2) {
    const withName = `${methodName}With` as keyof $Interface
    if (!(withName in target)) {
      if (arity === 2) {
        // For binary functions, 'with' curries the second argument
        target[withName] = ((secondArg: any) => (firstArg: any) => method(firstArg, secondArg)) as any
      } else {
        // For functions with more than 2 args, 'with' curries the second argument
        target[withName] = ((secondArg: any) => (firstArg: any, ...restArgs: any[]) =>
          method(firstArg, secondArg, ...restArgs)) as any
      }
    }
  }
}

/**
 * Enhance a method with pre/post hooks.
 *
 * @param config Method configuration with optional pre/post handlers
 * @param impl The implementation to enhance
 * @param context Context for preWith/postWith hooks
 * @returns Enhanced method that runs pre/post handlers
 */
export const enhanceMethod = <$Method extends Fn.AnyAny>(
  config: MethodConfig<$Method>,
  impl: Fn.AnyAny,
  context: ParamContextGeneric,
) => {
  // Determine which hooks to use - prefer direct hooks over context hooks
  const pre = config.pre ?? (config.preWith ? config.preWith(context) : undefined) as Fn.AnyAny | undefined
  const post = config.post
    ?? (config.postWith ? config.postWith(context) : undefined) as Fn.AnyAny | undefined

  if (!pre && !post) return impl

  return (...args: any[]) => {
    // Pre-processing
    if (pre) {
      const preResult = pre(...args)
      if (preResult !== undefined) return preResult
    }

    // Implementation
    const result = impl(...args)

    // Post-processing
    if (post) {
      return post(result, ...args)
    }

    return result
  }
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Laws
//
//

/**
 * Law function type for property-based testing.
 * Laws take an arbitrary generator and trait implementation, returning a fast-check property.
 */
export type Law = (arbitrary: any, implementation: any) => any

/**
 * Laws option type for trait definitions.
 * Laws are organized by method name, with each method having its own set of named laws.
 *
 * @example
 * ```ts
 * laws: {
 *   is: {
 *     reflexivity: (arb, impl) => ...,
 *     symmetry: (arb, impl) => ...,
 *     transitivity: (arb, impl) => ...
 *   },
 *   combine: {
 *     associativity: (arb, impl) => ...
 *   }
 * }
 * ```
 */
export type LawsInput<$Definition extends Definition> = {
  [__key__ in keyof GetInternalInterface<$Definition>]?: Laws.Input.Select
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Constructor
//
//

/**
 * Base interface for all traits in the Traitor system.
 *
 * Traits extend this interface to define both internal (implementation-facing)
 * and external (user-facing) types, along with their dependencies.
 * All metadata is hidden behind a private symbol, making traits appear as
 * their external interface directly.
 *
 * @template $Name - The name of the trait
 * @template $Deps - Array of trait names this trait depends on
 * @template $ExternalInternal - The external interface for users
 * @template $InternalInterface - The internal interface for implementations
 *
 * @example
 * ```ts
 * interface Eq<$Type = unknown> extends Traitor.Definition<
 *   'Eq',
 *   ['Type'], // Dependencies
 *   { // External - rich types for users
 *     is<a extends $Type, b = a>(a: a, b: ValidateComparable<a, b>): boolean
 *     isOn<a extends $Type>(a: a): <b = a>(b: ValidateComparable<a, b>) => boolean
 *   },
 *   { // Internal - simple types for implementations
 *     is(a: $Type, b: $Type): boolean
 *   }
 * > {}
 * ```
 */
export type Definition<
  $Name extends string = string,
  $Deps extends Deps = DepsDefault,
  $ExternalInternal extends Interface = Interface,
  $InternalInterface extends Interface = $ExternalInternal,
> =
  & $ExternalInternal
  & {
    [internalProperty]: Internal<$Name, $InternalInterface, $Deps>
  }

/**
 * Define a trait with a local interface pattern.
 *
 * This is a pure function that creates a trait definition without relying on global types.
 * The trait interface is passed as a type parameter, making the code more explicit and local.
 *
 * @template $Obj - The trait interface extending Definition
 * @param name - The name of the trait (for runtime identification)
 * @param options - Optional configuration including hooks and laws
 * @returns The trait definition
 *
 * @example
 * ```ts
 * import { Traitor } from '#traitor'
 *
 * interface Eq<$A = unknown> extends Traitor.Definition<
 *   [Type],
 *   { is<a extends $A, b = a>(a: a, b: ValidateComparable<a, b>): boolean },
 *   { is(a: $A, b: $A): boolean }
 * > {}
 *
 * export const Eq = Traitor.define<Eq>('Eq', {
 *   methods() {
 *     return {
 *       is: {
 *         domainMissing: () => false,
 *         // domainCheck: [] is default (check all args)
 *       },
 *       isOn: {
 *         default: ({ trait }) => (a) => (b) => trait.is(a, b)
 *         // Auto-generated from is (arity 2)
 *       }
 *     }
 *   }
 * })
 * ```
 */
// dprint-ignore
export const define = <$Definition extends Definition>(
  name: GetName<$Definition>,
  methods?: MethodsConfig<GetInternalInterface<$Definition>>
): $Definition => {
  const definition = empty()

  // Extract laws from methods and prepare laws object
  const laws: LawsInput<$Definition> = {}
  const cleanedMethods  = {} as Record<string, MethodConfig<any>>

  if (methods) {
    for (const [methodName, methodConfig] of Object.entries(methods) as Array<[string, MethodConfig<any> | undefined]>) {
      if (methodConfig) {
        // Extract laws if present
        if (methodConfig.laws) {
          (laws as any)[methodName] = methodConfig.laws
        }

        // Create cleaned config without laws
        const { laws: _, ...cleanConfig } = methodConfig
        if (Object.keys(cleanConfig).length > 0) {
          (cleanedMethods as any)[methodName] = cleanConfig
        }
      }
    }
  }

  mergeInternal(definition, {
    name,
    laws: Object.keys(laws).length > 0 ? Laws.Input.resolveTraitSelect(laws as Laws.Input.TraitSelect) : {},
    methods: Object.keys(cleanedMethods).length > 0 ? cleanedMethods : undefined,
  })

  // Store method configurations for dispatcher access
  if (methods) {
    traitMethodConfigs.set(name, cleanedMethods )
  }

  return definition as any
}

export const empty = (): Definition => {
  return {
    [internalProperty]: {} as any,
  }
}
