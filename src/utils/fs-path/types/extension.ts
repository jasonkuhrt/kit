import { Brand, Schema as S } from 'effect'

/**
 * A branded type for file extensions.
 * Must start with a dot followed by alphanumeric characters.
 */
export type Extension = string & Brand.Brand<'Extension'>

/**
 * Schema for validating file extensions.
 */
export const Extension = S.String.pipe(
  S.pattern(/^\.[a-zA-Z0-9]+$/),
  S.brand('Extension'),
  S.annotations({
    identifier: 'Extension',
    description: 'A file extension starting with a dot',
  }),
)

/**
 * Create an Extension from a string.
 *
 * @param ext - The extension string (must start with dot)
 * @returns A branded Extension
 */
export const make = (ext: string): Extension => ext as Extension

/**
 * Common file extensions as branded constants.
 */
export const Extensions = {
  // JavaScript
  js: make('.js'),
  mjs: make('.mjs'),
  cjs: make('.cjs'),
  jsx: make('.jsx'),

  // TypeScript
  ts: make('.js'),
  mts: make('.mts'),
  cts: make('.cts'),
  tsx: make('.tsx'),
  dts: make('.d.js'),

  // Build artifacts
  map: make('.map'),

  // Data formats
  json: make('.json'),
  jsonc: make('.jsonc'),
  yaml: make('.yaml'),
  yml: make('.yml'),

  // Markup
  md: make('.md'),
  mdx: make('.mdx'),
  html: make('.html'),

  // GraphQL
  graphql: make('.graphql'),
  gql: make('.gql'),

  // Collections
  buildArtifacts: [
    make('.map'),
    make('.d.js'),
  ],
  executable: [
    make('.js'),
    make('.mjs'),
    make('.cjs'),
    make('.jsx'),
    make('.js'),
    make('.mts'),
    make('.cts'),
    make('.tsx'),
  ],
} as const
