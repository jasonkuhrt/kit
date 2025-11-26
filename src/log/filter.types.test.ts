import type { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import { test } from 'vitest'
import type * as FilterTypes from './filter.types.js'

/**
 * Type-level tests for log filter parsing.
 */

test('type-level filter parsing', () => {
  type _ = A.Cases<
    // Simple path
    A.exact<
      FilterTypes.ParseOne<'app'>,
      {
        originalInput: 'app'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Path with descendants
    A.exact<
      FilterTypes.ParseOne<'app:*'>,
      {
        originalInput: 'app:*'
        negate: false
        path: { value: '.app'; descendants: { includeParent: true } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Path descendants only
    A.exact<
      FilterTypes.ParseOne<'app::*'>,
      {
        originalInput: 'app::*'
        negate: false
        path: { value: '.app'; descendants: { includeParent: false } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Wildcard all
    A.exact<
      FilterTypes.ParseOne<'*'>,
      {
        originalInput: '*'
        negate: false
        path: { value: '.'; descendants: { includeParent: true } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Wildcard descendants only
    A.exact<
      FilterTypes.ParseOne<':*'>,
      {
        originalInput: ':*'
        negate: false
        path: { value: '.'; descendants: { includeParent: false } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // With level - exact
    A.exact<
      FilterTypes.ParseOne<'app@warn'>,
      {
        originalInput: 'app@warn'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'eq' }
      }
    >,
    // With level - gte
    A.exact<
      FilterTypes.ParseOne<'app@warn+'>,
      {
        originalInput: 'app@warn+'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'gte' }
      }
    >,
    // With level - lte
    A.exact<
      FilterTypes.ParseOne<'app@warn-'>,
      {
        originalInput: 'app@warn-'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'lte' }
      }
    >,
    // With level number
    A.exact<
      FilterTypes.ParseOne<'app@4'>,
      {
        originalInput: 'app@4'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'eq' }
      }
    >,
    // With level wildcard
    A.exact<
      FilterTypes.ParseOne<'app@*'>,
      {
        originalInput: 'app@*'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: '*'; comp: 'eq' }
      }
    >,
    // Negated
    A.exact<
      FilterTypes.ParseOne<'!app'>,
      {
        originalInput: '!app'
        negate: true
        path: { value: '.app'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Negated with level
    A.exact<
      FilterTypes.ParseOne<'!app@error+'>,
      {
        originalInput: '!app@error+'
        negate: true
        path: { value: '.app'; descendants: false }
        level: { value: 'error'; comp: 'gte' }
      }
    >,
    // Root
    A.exact<
      FilterTypes.ParseOne<'.'>,
      {
        originalInput: '.'
        negate: false
        path: { value: '.'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Multiple patterns (comma-separated)
    A.exact<
      FilterTypes.Parse<'app,nexus'>,
      [
        {
          originalInput: 'app'
          negate: false
          path: { value: '.app'; descendants: false }
          level: { value: 'info'; comp: 'gte' }
        },
        {
          originalInput: 'nexus'
          negate: false
          path: { value: '.nexus'; descendants: false }
          level: { value: 'info'; comp: 'gte' }
        },
      ]
    >,
    // Multiple patterns with complex syntax
    A.exact<
      FilterTypes.Parse<'app:*@info+,!nexus@warn'>,
      [
        {
          originalInput: 'app:*@info+'
          negate: false
          path: { value: '.app'; descendants: { includeParent: true } }
          level: { value: 'info'; comp: 'gte' }
        },
        {
          originalInput: '!nexus@warn'
          negate: true
          path: { value: '.nexus'; descendants: false }
          level: { value: 'warn'; comp: 'eq' }
        },
      ]
    >
  >
})
