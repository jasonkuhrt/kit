import { Err } from '@kitz/core'
import type { OpeningArgs } from '../OpeningArgs/_.js'
import type { ParameterExclusive, ParameterExclusiveGroup } from '../Parameter/exclusive.js'
import type { Parameter } from '../Parameter/types.js'

export namespace Global {
  export const ErrorUnknownParameterViaEnvironment = Err.TaggedContextualError(
    'OakErrorUnknownParameterViaEnvironment',
    ['input', 'environment'],
  ).constrain<{ flagName: string; prefix: string | null }>({
    message: (ctx) => `Unknown parameter via environment: "${ctx.flagName}"`,
  })

  export const ErrorUnknownFlag = Err.TaggedContextualError(
    'OakErrorUnknownFlag',
    ['input', 'flag'],
  ).constrain<{ flagName: string }>({
    message: (ctx) => `Unknown flag "${ctx.flagName}"`,
  })
}

export const ErrorDuplicateLineArg = Err.TaggedContextualError(
  'OakErrorDuplicateLineArg',
  ['input', 'flag'],
).constrain<{ parameter: Parameter; flagName: string }>({
  message: (ctx) => `The parameter "${ctx.flagName}" was passed an argument multiple times via flags.`,
})

export const ErrorDuplicateEnvArg = Err.TaggedContextualError(
  'OakErrorDuplicateEnvArg',
  ['input', 'environment'],
).constrain<{
  parameter: Parameter
  instances: { value: string; name: string; prefix: string | null }[]
}>({
  message: (ctx) =>
    `The parameter "${ctx.parameter.name.canonical}" was passed an argument multiple times via different parameter aliases in the environment.`,
})

export const ErrorFailedToGetDefaultArgument = Err.TaggedContextualError(
  'OakErrorFailedToGetDefaultArgument',
  ['argument', 'default'],
).constrain<{ spec: Parameter }>({
  message: (ctx) => `Failed to get default value for ${ctx.spec.name.canonical}`,
})

export const ErrorMissingArgument = Err.TaggedContextualError(
  'OakErrorMissingArgument',
  ['input', 'argument'],
).constrain<{ parameter: Parameter }>({
  message: (ctx) => `Missing argument for flag "${ctx.parameter.name.canonical}".`,
})

export const ErrorMissingArgumentForMutuallyExclusiveParameters = Err.TaggedContextualError(
  'OakErrorMissingArgumentForMutuallyExclusiveParameters',
  ['input', 'argument'],
).constrain<{ group: ParameterExclusiveGroup }>({
  message: (ctx) =>
    `Missing argument for one of the following parameters: ${
      Object.values(ctx.group.parameters)
        .map((_) => _.name.canonical)
        .join(`, `)
    }`,
})

export const ErrorArgumentsToMutuallyExclusiveParameters = Err.TaggedContextualError(
  'OakErrorArgumentsToMutuallyExclusiveParameters',
  ['input', 'argument'],
).constrain<{
  group: ParameterExclusiveGroup
  offenses: { spec: ParameterExclusive; arg: OpeningArgs.Argument }[]
}>({
  message: (ctx) =>
    `Arguments given to multiple mutually exclusive parameters: ${
      ctx.offenses
        .map((_) => _.spec.name.canonical)
        .join(`, `)
    }`,
})

export const ErrorInvalidArgument = Err.TaggedContextualError(
  'OakErrorInvalidArgument',
  ['input', 'validation'],
).constrain<{
  spec: Parameter
  value: unknown
  validationErrors: string[]
  environmentVariableName?: string
}>({
  message: (ctx) =>
    ctx.environmentVariableName
      ? `Invalid argument (via environment variable "${ctx.environmentVariableName}") for parameter: "${ctx.spec.name.canonical}". The error was:\n${
        ctx.validationErrors.join(`\n`)
      }`
      : `Invalid argument for parameter: "${ctx.spec.name.canonical}". The error was:\n${
        ctx.validationErrors.join(`\n`)
      }`,
})
