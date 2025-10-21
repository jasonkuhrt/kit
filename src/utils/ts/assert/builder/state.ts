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
  inferMode: 'auto' | 'narrow' | 'wide'
  allowUnknown: boolean
  allowAny: boolean
  allowNever: boolean
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
      inferMode: 'auto'
      allowUnknown: false
      allowAny: false
      allowNever: false
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

  export type SetAllowFlags<
    $State extends State,
    $AllowUnknown extends boolean = $State['matcher']['allowUnknown'],
    $AllowAny extends boolean = $State['matcher']['allowAny'],
    $AllowNever extends boolean = $State['matcher']['allowNever'],
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $State['matcher']['type']
      input: $State['matcher']['input']
      inferMode: $State['matcher']['inferMode']
      allowUnknown: $AllowUnknown
      allowAny: $AllowAny
      allowNever: $AllowNever
    }
    negated: $State['negated']
  }

  export type SetMatcher<
    $State extends State,
    $Type,
    $Input extends boolean = false,
    $AllowUnknown extends boolean = false,
    $AllowAny extends boolean = false,
    $AllowNever extends boolean = false,
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $Type
      input: $Input
      inferMode: $State['matcher']['inferMode']
      allowUnknown: $AllowUnknown
      allowAny: $AllowAny
      allowNever: $AllowNever
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
      inferMode: $State['matcher']['inferMode']
      allowUnknown: $State['matcher']['allowUnknown']
      allowAny: $State['matcher']['allowAny']
      allowNever: $State['matcher']['allowNever']
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

  export type SetInferMode<
    $State extends State,
    $Mode extends 'auto' | 'narrow' | 'wide',
  > = {
    extractors: $State['extractors']
    relator: $State['relator']
    matcher: {
      type: $State['matcher']['type']
      input: $State['matcher']['input']
      inferMode: $Mode
      allowUnknown: $State['matcher']['allowUnknown']
      allowAny: $State['matcher']['allowAny']
      allowNever: $State['matcher']['allowNever']
    }
    negated: $State['negated']
  }
}
