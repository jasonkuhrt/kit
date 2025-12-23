// Force TS to resolve internal lens paths for consumer type inference discovery
// See: https://github.com/microsoft/TypeScript/issues/61700
import type * as __array from '@kitz/core/_internal/optic-lenses/array'
import type * as __awaited from '@kitz/core/_internal/optic-lenses/awaited'
import type * as __parameter1 from '@kitz/core/_internal/optic-lenses/parameter1'
import type * as __parameter2 from '@kitz/core/_internal/optic-lenses/parameter2'
import type * as __parameter3 from '@kitz/core/_internal/optic-lenses/parameter3'
import type * as __parameter4 from '@kitz/core/_internal/optic-lenses/parameter4'
import type * as __parameter5 from '@kitz/core/_internal/optic-lenses/parameter5'
import type * as __parameters from '@kitz/core/_internal/optic-lenses/parameters'
import type * as __returned from '@kitz/core/_internal/optic-lenses/returned'

/**
 * @internal DO NOT USE - Forces TypeScript to include internal lens module references
 * in declaration output. Required for consumer type inference.
 * See: https://github.com/microsoft/TypeScript/issues/61700
 */
export type __InternalLensResolution =
  | __array.Get<never>
  | __awaited.Get<never>
  | __parameter1.Get<never>
  | __parameter2.Get<never>
  | __parameter3.Get<never>
  | __parameter4.Get<never>
  | __parameter5.Get<never>
  | __parameters.Get<never>
  | __returned.Get<never>

// Core operations
export type {
  FormatConstraint,
  Get,
  GetApplicableLenses,
  IsDisjoint,
  LensErrorArrayExtract,
  LensErrorKeyNotFound,
  LensErrorTupleExtract,
  Set,
  UnwrapEither,
  ValidateAndExtract,
} from './core.js'

// Expression compilation
export type * as Exp from './exp.js'
export { compile, get, getOn, getWith } from './exp.js'

// Registry
export type { GetLens, LensName, LensRegistry } from './registry.js'

// Lenses
export type * as Array from './lenses/array.js'
export type * as Awaited from './lenses/awaited.js'
export type * as Indexed from './lenses/indexed.js'
export type * as Parameter from './lenses/parameter.js'
export type * as Parameter1 from './lenses/parameter1.js'
export type * as Parameter2 from './lenses/parameter2.js'
export type * as Parameter3 from './lenses/parameter3.js'
export type * as Parameter4 from './lenses/parameter4.js'
export type * as Parameter5 from './lenses/parameter5.js'
export type * as Parameters from './lenses/parameters.js'
export type * as Property from './lenses/property.js'
export type * as Returned from './lenses/returned.js'
export type * as Tuple from './lenses/tuple.js'
