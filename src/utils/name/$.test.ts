import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { Name } from './$.js'

property('generate creates three-word names', fc.integer({ min: 1, max: 10 }), (count) => {
  const names = Array.from({ length: count }, () => Name.generate())
  names.forEach(name => {
    const words = name.split(' ')
    expect(words).toHaveLength(3)
    words.forEach(word => expect(word).toMatch(/^[A-Z][a-z]+$/))
  })
})

test('generate produces diverse names', () => {
  const names = new Set(Array.from({ length: 100 }, () => Name.generate()))
  expect(names.size).toBeGreaterThan(80) // Allow some duplicates

  // Check variety in components
  const components = { adjectives: new Set(), colors: new Set(), animals: new Set() }
  names.forEach(name => {
    const [adj, color, animal] = name.split(' ')
    components.adjectives.add(adj)
    components.colors.add(color)
    components.animals.add(animal)
  })

  expect(components.adjectives.size).toBeGreaterThan(10)
  expect(components.colors.size).toBeGreaterThan(5)
  expect(components.animals.size).toBeGreaterThan(10)
})
