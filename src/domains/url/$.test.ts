import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { Url } from './$.js'

property(
  'factory creates URLs relative to base',
  fc.webUrl(),
  fc.stringMatching(/^[a-zA-Z0-9-._~]+$/),
  (baseHref, path) => {
    const base = new URL(baseHref)
    const factory = Url.factory(base)
    const result = factory(path)

    expect(result).toBeInstanceOf(URL)
    expect(result.origin).toBe(base.origin)
  },
)

test('factory handles various URL components', () => {
  const factory = Url.factory(new URL('https://api.example.com:8080/v1/'))

  // Relative paths
  expect(factory('users').href).toBe('https://api.example.com:8080/v1/users')
  expect(factory('users/123').href).toBe('https://api.example.com:8080/v1/users/123')

  // Absolute paths
  expect(factory('/admin').href).toBe('https://api.example.com:8080/admin')

  // Query and fragments
  expect(factory('search?q=test').href).toBe('https://api.example.com:8080/v1/search?q=test')
  expect(factory('docs#section').href).toBe('https://api.example.com:8080/v1/docs#section')

  // Edge cases
  expect(factory('').href).toBe('https://api.example.com:8080/v1/')
  expect(factory('/').href).toBe('https://api.example.com:8080/')
})

test('pathSeparator', () => {
  expect(Url.pathSeparator).toBe('/')
  expect(['api', 'v1', 'users'].join(Url.pathSeparator)).toBe('api/v1/users')
})
