import { Arr } from '#arr/index.js'
import { Language } from '#language/index.js'
import { Obj } from '#obj/index.js'
import { Rec } from '#rec/index.js'
import { Str } from '#str/index.js'
import { Char } from '#str/str.js'
import type { Ts } from '#ts/index.js'
import { cyan, red } from 'ansis'
import { cleanStack } from './stack.js'
import { is } from './type.js'
import type { Context } from './types.js'

interface EnvironmentConfigurableOptionSpec<$Name extends string = string, $Type = any> {
  name: $Name
  envVarNamePrefix: string
  default: NoInfer<$Type>
  description?: string
  parse: (envVarValue: string) => $Type
}

const makeEnvVarName = (spec: EnvironmentConfigurableOptionSpec) => {
  return Str.Case.upper(
    Str.Case.snake(`${spec.envVarNamePrefix}_${spec.name}`),
  )
}

export type InferOptions<$EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[]> = Ts.Simplify<
  Arr.ReduceWithIntersection<_InferOptions<$EnvironmentConfigurableOptions>>
>

export type _InferOptions<$EnvironmentConfigurableOptions extends EnvironmentConfigurableOptionSpec[]> = {
  [i in keyof $EnvironmentConfigurableOptions]: {
    [_ in $EnvironmentConfigurableOptions[i]['name']]?: ReturnType<$EnvironmentConfigurableOptions[i]['parse']>
  }
}

const define = <const options extends EnvironmentConfigurableOptionSpec[]>(options: options): options => {
  return options
}

interface EnvironmentConfigurableOptionInput<$Spec extends EnvironmentConfigurableOptionSpec> {
  spec: $Spec
  value: any
  source: 'default' | 'environment'
}

type Resolve<$Specs extends EnvironmentConfigurableOptionSpec[]> = Ts.Simplify<
  Arr.ReduceWithIntersection<_Resovle<$Specs>>
>

type _Resovle<$Specs extends EnvironmentConfigurableOptionSpec[]> = {
  [i in keyof $Specs]: {
    [_ in $Specs[i]['name']]: {
      spec: $Specs[i]
      value: ReturnType<$Specs[i]['parse']>
      source: 'default' | 'environment'
    }
  }
}

const resolve = <const specs extends EnvironmentConfigurableOptionSpec[]>(
  specs: specs,
  input: InferOptions<specs>,
): Resolve<specs> => {
  const config = Rec.create<EnvironmentConfigurableOptionInput<specs[number]>>()
  const input$ = input as Record<string, any>

  for (const spec of specs) {
    const processValue = Language.process.env[makeEnvVarName(spec)]
    if (processValue !== undefined) {
      config[spec.name] = {
        spec,
        value: spec.parse(processValue),
        source: 'environment',
      }
      continue
    }
    if (spec.name in input && input$[spec.name] !== undefined) {
      config[spec.name] = {
        spec,
        value: input$[spec.name],
        source: 'default',
      }
      continue
    }
    config[spec.name] = {
      spec,
      value: spec.default,
      source: 'default',
    }
  }

  return config as any
}

// ---------------

const optionSpecs = define([
  {
    name: 'color',
    envVarNamePrefix: 'errorDsiplay',
    description: 'Should output be colored for easier reading',
    default: true,
    parse: (envVarValue) => envVarValue === '0' || envVarValue === 'false' ? false : true,
  },
  {
    name: 'stackTraceColumns',
    envVarNamePrefix: 'errorDsiplay',
    description: 'The column count to display before truncation begins',
    default: 120,
    parse: (envVarValue) => parseInt(envVarValue, 10),
  },
  {
    name: 'identColumns',
    envVarNamePrefix: 'errorDsiplay',
    description: 'The column count to use for indentation',
    default: 4,
    parse: (envVarValue) => parseInt(envVarValue, 10),
  },
])

export type InspectOptions = InferOptions<typeof optionSpecs>

export type InspectConfig = Resolve<typeof optionSpecs>

export const formatTitle = (indent: string, text: string, config: InspectConfig) => {
  const title = `\n${indent}${text.toUpperCase()}\n`
  return config.color.value ? cyan(title) : title
}

/**
 * Render an error to a string with nice formatting including causes, aggregate errors, context, and stack traces.
 */

export const inspect = (error: Error, options?: InspectOptions): string => {
  const config = resolve(optionSpecs, options ?? {})

  let inspection = _inspectResursively(error, '', config)

  inspection += `\n${formatTitle('', 'Environment Variable Formatting', config)}`

  // todo: indent should not indent empty lines
  inspection += Str.indent(
    `\nYou can control formatting of this error display with the following environment variables.\n`,
    config.identColumns.value,
  )

  inspection += '\n'

  for (const [_, state] of Obj.entries(config)) {
    inspection += Str.indent(
      `${makeEnvVarName(state.spec)} – The column count to display before truncation ${
        state.source === 'environment'
          ? `(currently set to ${state.value})`
          : `(currently unset, defaulting to ${state.value})`
      }`,
      config.identColumns.value,
    )
    inspection += '\n'
  }

  return inspection
}

const _inspectResursively = (error: Error, parentIndent: string, config: InspectConfig): string => {
  const formatIndent = Char.spaceRegular.repeat(config.identColumns.value)
  if (!is(error)) {
    return parentIndent + String(error)
  }

  const lines: string[] = []

  // Handle AggregateError
  if (error instanceof AggregateError && error.errors.length > 0) {
    lines.push(formatTitle(parentIndent, 'errors', config))
    lines.push(...error.errors.reduce<string[]>((acc, err, index) => {
      acc.push(formatTitle(parentIndent, `[${index}]`, config))
      acc.push(_inspectResursively(err, parentIndent + formatIndent, config))
      return acc
    }, []))
    return Str.unlines(lines)
  }

  // Render the main error message
  const errorName = config.color.value ? red(error.name) : error.name
  lines.push(`${parentIndent}${errorName}`)
  lines.push('')
  lines.push(`${parentIndent}${formatIndent}${error.message}`)

  // Handle cause if present
  if ('cause' in error && error.cause instanceof Error) {
    lines.push(formatTitle(parentIndent, 'cause', config))
    lines.push(_inspectResursively(error.cause, parentIndent + formatIndent, config))
  }

  // Handle context property if present
  if ('context' in error && error.context !== undefined) {
    lines.push(formatTitle(parentIndent, 'context', config))
    // todo: pretty object rendering
    lines.push(String((error as Error & { context: Context }).context))
  }

  // Handle stack property if present
  if (error.stack) {
    // Clean the stack trace first
    const cleanedStack = cleanStack(error.stack, {
      removeInternal: true,
      maxFrames: 15,
      filterPatterns: ['node_modules', 'node:internal'],
    })

    const stack = Str.unlines(
      Str
        .lines(cleanedStack)
        // Stacks include the message by default, we already showed that above.
        .slice(1)
        .map(_ => Str.truncate(`${parentIndent}${formatIndent}${_.trim()}`, config.stackTraceColumns.value)),
    )
    lines.push(formatTitle(parentIndent, 'stack', config))
    lines.push(stack)
  }

  return Str.unlines(lines)
}
