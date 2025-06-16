import { Arr } from '#arr/index.js'
import { Language } from '#language/index.js'
import { Str } from '#str/index.js'
import { calcIsEnabledFromEnv } from './environment-variable.js'

type DebugParameters = [event: string, payload?: unknown]

export * from './dump.js'

export interface Debug {
  (...args: DebugParameters): void
  toggle: (isEnabled: boolean) => void
  sub: (subNamespace: string) => Debug
}

interface State {
  isEnabled: boolean
}

// todo:
// const Option = {
//   else:
//     <alternative>(alternative: alternative) => <value>(value: value): value extends undefined ? alternative : value => {
//       if (value === undefined || value === null) {
//         return alternative as any
//       }
//       return value as any
//     },
// }

// const namespaceToString = (namespace: string[] = []): string => {
//   return formatNamespaceSegment(namespace.join(`_`))
//   // todo:
//   // const x = Option.else([] as string[])
//   // const y = x(namespace)
//   // const z = Fn.pipe(
//   //   namespace,
//   //   x,
//   //   // Option.else([]),
//   //   // (_) => Array.is(_) ? _ : [],
//   //   // Str.joinWith(`_`),
//   //   // Str.Case.upper,
//   // )
// }

const formatNamespaceSegment = (segment: string): string => {
  return Str.Case.snake(segment).toUpperCase()
}

export const create = (namespaceInput?: string | string[], initialState?: State): Debug => {
  const namespace = Arr.sure(namespaceInput ?? [])

  const state: State = initialState ?? { isEnabled: false }

  // Can be enabled via envar
  const isDebugEnabledFromEnv = calcIsEnabledFromEnv(Language.process.env, namespace)
  if (isDebugEnabledFromEnv) {
    state.isEnabled = true
  }

  const debug: Debug = (...args) => {
    const isPayloadPassed = args.length === 2
    const [event, payload] = args

    if (state.isEnabled) {
      // If a payload is an array then default depth to 1 so that we see its _contents_
      const isPayloadArray = Array.isArray(payload)
      const depthBoost = isPayloadArray ? 1 : 0
      const defaultDepth = 3
      const debugDepth = parseNumberOr(Language.process.env[`DEBUG_DEPTH`], defaultDepth) + depthBoost
      const isPayloadDisabled = debugDepth < 0

      const payloadRendered = isPayloadPassed && !isPayloadDisabled
        ? Language.inspect(payload, {
          colors: true,
          depth: debugDepth,
          // compact: true,
          maxStringLength: 1000,
        })
        : ``

      const formatNamespaceSegmentAnsi = (segment: string): string => {
        return Language.colorize(
          `bold`,
          Language.colorize(`bgYellowBright`, ` ` + formatNamespaceSegment(segment) + ` `),
        )
      }

      const namespaceRendered = namespace.map(formatNamespaceSegmentAnsi).join(` `)
      const eventRendered = Language.colorize(
        `bold`,
        Language.colorize(
          `bgMagentaBright`,
          ` ` + formatNamespaceSegment(event) + ` `,
        ),
      )
      const prefixRendered = `${namespaceRendered} ${eventRendered}`

      console.debug(prefixRendered, payloadRendered)
    }
  }

  debug.toggle = (isEnabled: boolean) => {
    state.isEnabled = isEnabled
  }

  debug.sub = (subNamespace: string | string[]) => {
    const s = Arr.sure(subNamespace)
    const stateCopy = structuredClone(state)
    return create([...namespace, ...s], stateCopy)
  }

  return debug
}

const parseNumberOr = (str: string | undefined, defaultValue: number): number => {
  if (str === ``) return defaultValue

  const parsed = Number(str)
  if (Number.isNaN(parsed)) {
    return defaultValue
  }
  return parsed
}
