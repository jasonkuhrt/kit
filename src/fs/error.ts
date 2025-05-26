import { Err } from '#err/index.js'

export type ErrorNotFound = NodeJS.ErrnoException & { code: 'ENOENT' }

export const isNotFoundError = (error: unknown): error is ErrorNotFound => {
  return Err.is(error) && `code` in error && error.code === `ENOENT`
}
