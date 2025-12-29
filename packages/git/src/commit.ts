import { Schema } from 'effect'
import { Author } from './author.js'
import { Sha } from './sha.js'

/**
 * A commit from git log.
 */
export class Commit extends Schema.TaggedClass<Commit>()('Commit', {
  hash: Sha,
  message: Schema.String,
  body: Schema.String,
  author: Author,
  date: Schema.Date,
}) {}
