import type * as Kind from '../../kind.js'
import type { SENTINEL } from '../../ts.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Builder State
//
//
//
//

export interface State {
  extractors: readonly Kind.Kind[]
  relator: undefined | Kind.Kind
  matcher: Matcher
  negated: boolean
}

interface Matcher {
  type: unknown
  input: boolean
  inputLiteral: boolean
}

export namespace State {
  /**
   * Initial state for the assertion builder.
   */
  export type Empty = {
    extractors: []
    relator: undefined
    matcher: {
      type: SENTINEL.Empty
      input: true
      inputLiteral: false
    }
    negated: false
  }

  export type AddExtractor<
    $State extends State,
    $Extractor extends Kind.Kind,
  > = {
    extractors: [...$State['extractors'], $Extractor]
    relator: $State['relator']
    matcher: $State['matcher']
    negated: $State['negated']
  }

  export type SetRelator<
    $State extends State,
    $Relator extends Kind.Kind,
  > = {
    extractors: $State['extractors']
    relator: $Relator
    matcher: $State['matcher']
    negated: $State['negated']
  }

  export type SetMatcher<
    $State extends State,
    $Type,
    $Input extends boolean = false,
    $InputLiteral extends boolean = false,
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $Type
      input: $Input
      inputLiteral: $InputLiteral
    }
    negated: $State['negated']
  }

  export type SetMatcherType<
    $State extends State,
    $Type,
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $Type
      input: false // Matcher has consumed its input
      inputLiteral: $State['matcher']['inputLiteral']
    }
    negated: $State['negated']
  }

  export type SetMatcherLiteral<
    $State extends State,
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $State['matcher']['type']
      input: $State['matcher']['input']
      inputLiteral: true
    }
    negated: $State['negated']
  }

  export type SetNegated<
    $State extends State,
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: $State['matcher']
    negated: true
  }
}
