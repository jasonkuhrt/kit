import { expect, test } from 'vitest'
import type { LogRecord } from './logger.js'
import { type Options, render } from './renderer.js'

const makeRec = (data?: Partial<LogRecord>): LogRecord => {
  return {
    level: 3,
    event: `test event`,
    ...data,
  }
}

const defaultOptions: Options = {
  color: false,
  levelLabel: false,
  timeDiff: false,
}

test('renders basic log record', () => {
  const rec = makeRec()
  const result = render(defaultOptions, rec)
  expect(result).toContain(`test event`)
})

test('renders with path', () => {
  const rec = makeRec({ path: [`app`, `router`] })
  const result = render(defaultOptions, rec)
  expect(result).toContain(`app:router`)
  expect(result).toContain(`test event`)
})

test('renders with context (singleline)', () => {
  const rec = makeRec({ context: { key: `value` } })
  const result = render(defaultOptions, rec)
  expect(result).toContain(`key`)
  expect(result).toContain(`value`)
})

test('renders with level label', () => {
  const rec = makeRec({ level: 3 }) // info
  const result = render({ ...defaultOptions, levelLabel: true }, rec)
  expect(result).toContain(`info`)
})
