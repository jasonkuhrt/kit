import { Ts } from '#ts'
import { test } from 'vitest'
import type * as FilterTypes from './filter.types.js'

/**
 * Type-level tests for log filter parsing.
 */

test('type-level filter parsing', () => {
  type _ = Ts.Test.Cases<
    // Simple path
    Ts.Test.exact<
      FilterTypes.ParseOne<'app'>,
      {
        originalInput: 'app'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Path with descendants
    Ts.Test.exact<
      FilterTypes.ParseOne<'app:*'>,
      {
        originalInput: 'app:*'
        negate: false
        path: { value: '.app'; descendants: { includeParent: true } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Path descendants only
    Ts.Test.exact<
      FilterTypes.ParseOne<'app::*'>,
      {
        originalInput: 'app::*'
        negate: false
        path: { value: '.app'; descendants: { includeParent: false } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Wildcard all
    Ts.Test.exact<
      FilterTypes.ParseOne<'*'>,
      {
        originalInput: '*'
        negate: false
        path: { value: '.'; descendants: { includeParent: true } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Wildcard descendants only
    Ts.Test.exact<
      FilterTypes.ParseOne<':*'>,
      {
        originalInput: ':*'
        negate: false
        path: { value: '.'; descendants: { includeParent: false } }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // With level - exact
    Ts.Test.exact<
      FilterTypes.ParseOne<'app@warn'>,
      {
        originalInput: 'app@warn'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'eq' }
      }
    >,
    // With level - gte
    Ts.Test.exact<
      FilterTypes.ParseOne<'app@warn+'>,
      {
        originalInput: 'app@warn+'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'gte' }
      }
    >,
    // With level - lte
    Ts.Test.exact<
      FilterTypes.ParseOne<'app@warn-'>,
      {
        originalInput: 'app@warn-'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'lte' }
      }
    >,
    // With level number
    Ts.Test.exact<
      FilterTypes.ParseOne<'app@4'>,
      {
        originalInput: 'app@4'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: 'warn'; comp: 'eq' }
      }
    >,
    // With level wildcard
    Ts.Test.exact<
      FilterTypes.ParseOne<'app@*'>,
      {
        originalInput: 'app@*'
        negate: false
        path: { value: '.app'; descendants: false }
        level: { value: '*'; comp: 'eq' }
      }
    >,
    // Negated
    Ts.Test.exact<
      FilterTypes.ParseOne<'!app'>,
      {
        originalInput: '!app'
        negate: true
        path: { value: '.app'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Negated with level
    Ts.Test.exact<
      FilterTypes.ParseOne<'!app@error+'>,
      {
        originalInput: '!app@error+'
        negate: true
        path: { value: '.app'; descendants: false }
        level: { value: 'error'; comp: 'gte' }
      }
    >,
    // Root
    Ts.Test.exact<
      FilterTypes.ParseOne<'.'>,
      {
        originalInput: '.'
        negate: false
        path: { value: '.'; descendants: false }
        level: { value: 'info'; comp: 'gte' }
      }
    >,
    // Multiple patterns (comma-separated)
    Ts.Test.exact<
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
    Ts.Test.exact<
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
