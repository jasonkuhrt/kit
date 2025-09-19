import { Fs } from '#fs'
import { expect, test } from 'vitest'

test('fs module exports pickFirstPathExisting', () => {
  expect(typeof Fs.pickFirstPathExisting).toBe('function')
})

test('fs module exports pickFirstPathExistingString', () => {
  expect(typeof Fs.pickFirstPathExistingString).toBe('function')
})
