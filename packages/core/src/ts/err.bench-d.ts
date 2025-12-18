import { bench } from '@ark/attest'
import type * as Err from './err.js'

type _baseline = Err.StaticError<'baseline'>

bench('StaticError > n metadata', () => {
  return {} as Err.StaticError<'Invalid operation'>
}).types([31, 'instantiations'])

bench('StaticError > y metadata', () => {
  return {} as Err.StaticError<'Type mismatch', { expected: 'string'; actual: 'number' }>
}).types([251, 'instantiations'])
