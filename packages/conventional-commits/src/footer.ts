import { Schema } from 'effect'

/**
 * A conventional commit footer (e.g., "BREAKING CHANGE: description" or "Fixes: #123")
 */
export class Footer extends Schema.TaggedClass<Footer>()('Footer', {
  /** Footer token (e.g., "BREAKING CHANGE", "Fixes", "Closes") */
  token: Schema.String,
  /** Footer value */
  value: Schema.String,
}) {}
