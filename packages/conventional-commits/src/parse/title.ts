import { Data, Effect, Option } from 'effect'
import { MultiTargetCommit } from '../multi-target-commit.js'
import { SingleTargetCommit } from '../single-target-commit.js'
import { Target } from '../target.js'
import { Type, from as typeFrom } from '../type.js'

/**
 * Error parsing a conventional commit title.
 */
export class ParseTitleError extends Data.TaggedError('ParseTitleError')<{
  readonly message: string
  readonly input: string
}> {}

/**
 * Parsed title result—either SingleTarget or MultiTarget (without body/footers yet).
 */
export type ParsedTitle = SingleTargetCommit | MultiTargetCommit

// Regex for a single type-scope group: type(scope!, scope2)?!?
const TYPE_SCOPE_PATTERN = /^([a-z]+)(?:\(([^)]+)\))?(!)?$/

/**
 * Parse a conventional commit title line.
 *
 * SingleTarget when:
 * - Single type with zero or more scopes
 * - All scopes get same type and breaking
 *
 * MultiTarget when:
 * - Multiple comma-separated type(scope) groups
 * - OR same type but different breaking per scope
 */
export const parseTitle = (
  title: string,
): Effect.Effect<ParsedTitle, ParseTitleError> =>
  Effect.gen(function*() {
    const trimmed = title.trim()

    // Split on `: ` to get header and message
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) {
      return yield* Effect.fail(
        new ParseTitleError({ message: 'Missing colon separator', input: title }),
      )
    }

    const header = trimmed.slice(0, colonIndex).trim()
    const message = trimmed.slice(colonIndex + 1).trim()

    if (!message) {
      return yield* Effect.fail(
        new ParseTitleError({ message: 'Empty message', input: title }),
      )
    }

    // Check for global breaking indicator (! before :)
    const globalBreaking = header.endsWith('!')
    const headerWithoutGlobalBreaking = globalBreaking ? header.slice(0, -1) : header

    // Split by `, ` to detect multiple type-scope groups
    // But be careful: "feat(core, cli)" has comma inside parens, "feat(core), fix(cli)" has comma outside
    const groups = splitTypeScopeGroups(headerWithoutGlobalBreaking)

    if (groups.length === 1) {
      // Potentially SingleTarget
      const firstGroup = groups[0]
      if (!firstGroup) {
        return yield* Effect.fail(
          new ParseTitleError({ message: 'Invalid type-scope format', input: title }),
        )
      }
      const parsed = parseTypeScopeGroup(firstGroup)
      if (!parsed) {
        return yield* Effect.fail(
          new ParseTitleError({ message: 'Invalid type-scope format', input: title }),
        )
      }

      const { type, scopes, perScopeBreaking } = parsed
      const breaking = globalBreaking || perScopeBreaking.some(Boolean)

      // If we have per-scope breaking markers on individual scopes, it's still SingleTarget
      // because they all share the same type
      return SingleTargetCommit.make({
        type,
        scopes,
        breaking,
        message,
        body: Option.none(),
        footers: [],
      })
    }

    // Multiple groups = MultiTarget
    const targets: Target[] = []
    for (const group of groups) {
      const parsed = parseTypeScopeGroup(group)
      if (!parsed) {
        return yield* Effect.fail(
          new ParseTitleError({ message: `Invalid type-scope group: ${group}`, input: title }),
        )
      }

      const { type, scopes, perScopeBreaking } = parsed

      // Each scope in the group becomes a Target
      if (scopes.length === 0) {
        return yield* Effect.fail(
          new ParseTitleError({
            message: 'MultiTarget commits require scopes',
            input: title,
          }),
        )
      }

      for (let i = 0; i < scopes.length; i++) {
        const scope = scopes[i]
        if (!scope) continue
        targets.push(
          Target.make({
            type,
            scope,
            breaking: globalBreaking || perScopeBreaking[i] || false,
          }),
        )
      }
    }

    if (targets.length === 0) {
      return yield* Effect.fail(
        new ParseTitleError({ message: 'No targets found', input: title }),
      )
    }

    return MultiTargetCommit.make({
      targets: targets as [Target, ...Target[]],
      message,
      summary: Option.none(),
      sections: {},
    })
  })

interface ParsedGroup {
  type: Type
  scopes: string[]
  perScopeBreaking: boolean[]
}

/**
 * Split header into type-scope groups, respecting parentheses.
 * "feat(core), fix(cli)" → ["feat(core)", "fix(cli)"]
 * "feat(core, cli)" → ["feat(core, cli)"]
 */
const splitTypeScopeGroups = (header: string): string[] => {
  const groups: string[] = []
  let current = ''
  let depth = 0

  for (const char of header) {
    if (char === '(') {
      depth++
      current += char
    } else if (char === ')') {
      depth--
      current += char
    } else if (char === ',' && depth === 0) {
      const trimmed = current.trim()
      if (trimmed) groups.push(trimmed)
      current = ''
    } else {
      current += char
    }
  }

  const trimmed = current.trim()
  if (trimmed) groups.push(trimmed)

  return groups
}

const parseTypeScopeGroup = (group: string): ParsedGroup | null => {
  const match = group.match(TYPE_SCOPE_PATTERN)
  if (!match) return null

  const [, typeString, scopesPart, groupBreaking] = match
  if (!typeString) return null

  const type = typeFrom(typeString)

  if (!scopesPart) {
    // No scopes: "feat" or "feat!"
    return {
      type,
      scopes: [],
      perScopeBreaking: [],
    }
  }

  // Parse scopes, checking for per-scope ! markers
  const scopes: string[] = []
  const perScopeBreaking: boolean[] = []

  for (const scope of scopesPart.split(/,\s*/)) {
    const scopeTrimmed = scope.trim()
    if (scopeTrimmed.endsWith('!')) {
      scopes.push(scopeTrimmed.slice(0, -1))
      perScopeBreaking.push(true)
    } else {
      scopes.push(scopeTrimmed)
      perScopeBreaking.push(groupBreaking === '!')
    }
  }

  return { type, scopes, perScopeBreaking }
}
