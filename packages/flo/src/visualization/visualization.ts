/**
 * @module visualization
 *
 * Terminal visualization for workflow execution.
 *
 * Renders ASCII diagrams with dynamic coloring based on activity progress:
 * - 🟢 Green: Completed activities
 * - 🟡 Yellow: Currently executing activity
 * - 🔴 Red: Failed activities
 * - ⚪ Gray: Pending activities
 *
 * @example
 * ```ts
 * // Simple list mode
 * const renderer = TerminalRenderer.make({
 *   activities: ['Preflight', 'Publish:@kitz/core', 'CreateTag'],
 * })
 *
 * // DAG mode (from workflow graph)
 * const { layers, nodes } = myWorkflow.toGraph(payload)
 * const renderer = TerminalRenderer.make({
 *   mode: 'dag',
 *   layers: layers,
 *   edges: Array.from(nodes.values()).flatMap(n =>
 *     n.dependencies.map(dep => [dep, n.name])
 *   ),
 * })
 *
 * yield* events.pipe(
 *   Stream.tap((event) => Effect.sync(() => renderer.update(event))),
 *   Stream.runDrain,
 * )
 * ```
 */

import type { ActivityEvent } from '../observable/__.js'

// ============================================================================
// Types
// ============================================================================

/**
 * Activity state for rendering.
 */
export type ActivityState = 'pending' | 'running' | 'completed' | 'failed'

/**
 * Configuration for simple list mode.
 */
export interface ListModeConfig {
  readonly mode?: 'list' | undefined
  /** List of activity names to track (in order) */
  readonly activities: readonly string[]
  /** Whether to use colors (auto-detected from TTY if not specified) */
  readonly colors?: boolean | undefined
  /** Output stream (defaults to process.stdout) */
  readonly output?: NodeJS.WriteStream | undefined
}

/**
 * Configuration for DAG visualization mode.
 */
export interface DagModeConfig {
  readonly mode: 'dag'
  /** Topological layers - each layer contains nodes that can run concurrently */
  readonly layers: readonly (readonly string[])[]
  /** Edges as [from, to] pairs */
  readonly edges?: readonly (readonly [string, string])[] | undefined
  /** Whether to use colors (auto-detected from TTY if not specified) */
  readonly colors?: boolean | undefined
  /** Output stream (defaults to process.stdout) */
  readonly output?: NodeJS.WriteStream | undefined
}

/**
 * Configuration for the terminal renderer.
 */
export type TerminalRendererConfig = ListModeConfig | DagModeConfig

/**
 * State of all activities for rendering.
 */
export interface RenderState {
  readonly activities: Map<string, ActivityState>
  readonly currentActivity: string | null
  readonly startTime: Date
  readonly completedCount: number
  readonly totalCount: number
}

// ============================================================================
// ANSI Color Codes
// ============================================================================

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  // Colors
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
} as const

const stateToColor = (state: ActivityState, useColors: boolean): string => {
  if (!useColors) return ''
  switch (state) {
    case 'completed':
      return ANSI.green
    case 'running':
      return ANSI.yellow
    case 'failed':
      return ANSI.red
    case 'pending':
      return ANSI.gray
  }
}

const stateToSymbol = (state: ActivityState): string => {
  switch (state) {
    case 'completed':
      return '✓'
    case 'running':
      return '●'
    case 'failed':
      return '✗'
    case 'pending':
      return '○'
  }
}

// ============================================================================
// Box Drawing Characters
// ============================================================================

const BOX = {
  horizontal: '─',
  vertical: '│',
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  verticalRight: '├',
  verticalLeft: '┤',
  horizontalDown: '┬',
  horizontalUp: '┴',
  cross: '┼',
  arrow: '→',
} as const

// ============================================================================
// List Renderer
// ============================================================================

const renderList = (
  activities: readonly string[],
  state: RenderState,
  useColors: boolean,
): string => {
  const reset = useColors ? ANSI.reset : ''
  const lines: string[] = []

  for (const name of activities) {
    const activityState = state.activities.get(name) ?? 'pending'
    const color = stateToColor(activityState, useColors)
    const symbol = stateToSymbol(activityState)
    lines.push(`${color}${symbol}${reset} ${name}`)
  }

  // Add summary line
  const elapsed = ((Date.now() - state.startTime.getTime()) / 1000).toFixed(1)
  const summary = `${state.completedCount}/${state.totalCount} completed (${elapsed}s)`
  lines.push('')
  lines.push(useColors ? `${ANSI.dim}${summary}${ANSI.reset}` : summary)

  return lines.join('\n')
}

// ============================================================================
// DAG Renderer
// ============================================================================

/**
 * Render a DAG as ASCII art with box-drawing characters.
 *
 * Layout:
 * ```
 * Layer 0          Layer 1          Layer 2
 * ┌────────┐       ┌────────┐       ┌────────┐
 * │ Step A │──────→│ Step B │──────→│ Step D │
 * └────────┘       └────────┘       └────────┘
 *     │            ┌────────┐           ↑
 *     └───────────→│ Step C │───────────┘
 *                  └────────┘
 * ```
 */
const renderDag = (
  layers: readonly (readonly string[])[],
  edges: readonly (readonly [string, string])[],
  state: RenderState,
  useColors: boolean,
): string => {
  const reset = useColors ? ANSI.reset : ''

  // Calculate max node name length for box sizing
  const allNodes = layers.flat()
  const maxNameLen = Math.max(...allNodes.map((n) => n.length), 8)
  const boxWidth = maxNameLen + 4 // padding + borders

  // Build node positions: Map<nodeName, { layer, position }>
  const nodePositions = new Map<string, { layer: number; position: number }>()
  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l]
    if (!layer) continue
    for (let p = 0; p < layer.length; p++) {
      const node = layer[p]
      if (node) {
        nodePositions.set(node, { layer: l, position: p })
      }
    }
  }

  // Calculate max nodes per layer for height
  const maxNodesPerLayer = Math.max(...layers.map((l) => l.length))

  // Render each row (each row shows one node from each layer at that position)
  const lines: string[] = []
  const layerWidth = boxWidth + 4 // box + arrow spacing

  for (let row = 0; row < maxNodesPerLayer; row++) {
    // Three lines per node row: top border, content, bottom border
    let topLine = ''
    let midLine = ''
    let botLine = ''

    for (let col = 0; col < layers.length; col++) {
      const layer = layers[col]
      const node = layer?.[row]

      if (node) {
        const activityState = state.activities.get(node) ?? 'pending'
        const color = stateToColor(activityState, useColors)
        const symbol = stateToSymbol(activityState)

        // Pad name to center in box
        const paddedName = node.padStart((maxNameLen + node.length) / 2).padEnd(maxNameLen)

        topLine += `${color}${BOX.topLeft}${'─'.repeat(boxWidth - 2)}${BOX.topRight}${reset}`
        midLine += `${color}${BOX.vertical}${reset}${symbol} ${paddedName} ${color}${BOX.vertical}${reset}`
        botLine += `${color}${BOX.bottomLeft}${'─'.repeat(boxWidth - 2)}${BOX.bottomRight}${reset}`
      } else {
        // Empty cell
        topLine += ' '.repeat(boxWidth)
        midLine += ' '.repeat(boxWidth)
        botLine += ' '.repeat(boxWidth)
      }

      // Add arrow to next layer if there's an edge
      if (col < layers.length - 1) {
        const hasEdgeToRight = node
          ? edges.some(([from, to]) => {
              const toPos = nodePositions.get(to)
              return from === node && toPos?.layer === col + 1
            })
          : false

        if (hasEdgeToRight) {
          topLine += '    '
          midLine += `${BOX.horizontal}${BOX.horizontal}${BOX.arrow} `
          botLine += '    '
        } else {
          topLine += '    '
          midLine += '    '
          botLine += '    '
        }
      }
    }

    lines.push(topLine)
    lines.push(midLine)
    lines.push(botLine)

    // Add vertical connectors between rows if needed
    if (row < maxNodesPerLayer - 1) {
      let connectorLine = ''
      for (let col = 0; col < layers.length; col++) {
        const currentNode = layers[col]?.[row]
        const nextNode = layers[col]?.[row + 1]

        // Check if there are edges that need vertical lines
        const needsVertical =
          currentNode && edges.some(([from]) => from === currentNode && nodePositions.get(from)?.layer === col)

        if (needsVertical || nextNode) {
          connectorLine += ' '.repeat(boxWidth / 2) + BOX.vertical + ' '.repeat(boxWidth / 2 - 1)
        } else {
          connectorLine += ' '.repeat(boxWidth)
        }
        if (col < layers.length - 1) {
          connectorLine += '    '
        }
      }
      if (connectorLine.trim()) {
        lines.push(connectorLine)
      }
    }
  }

  // Add summary
  const elapsed = ((Date.now() - state.startTime.getTime()) / 1000).toFixed(1)
  const summary = `${state.completedCount}/${state.totalCount} completed (${elapsed}s)`
  lines.push('')
  lines.push(useColors ? `${ANSI.dim}${summary}${ANSI.reset}` : summary)

  return lines.join('\n')
}

// ============================================================================
// Compact DAG Renderer (horizontal layers)
// ============================================================================

/**
 * Render a compact DAG showing layers as columns.
 *
 * ```
 * [✓ StepA] ──→ [● StepB] ──→ [○ StepD]
 *           └─→ [○ StepC] ─┘
 * ```
 */
const renderCompactDag = (
  layers: readonly (readonly string[])[],
  _edges: readonly (readonly [string, string])[],
  state: RenderState,
  useColors: boolean,
): string => {
  const reset = useColors ? ANSI.reset : ''
  const lines: string[] = []

  // Header
  if (useColors) {
    lines.push(`${ANSI.bold}${ANSI.cyan}Workflow Progress${ANSI.reset}`)
  } else {
    lines.push('Workflow Progress')
  }
  lines.push('')

  // Render each layer
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    if (!layer) continue

    const layerLabel = useColors ? `${ANSI.dim}Layer ${i}:${ANSI.reset}` : `Layer ${i}:`

    if (layer.length === 1) {
      const node = layer[0]!
      const activityState = state.activities.get(node) ?? 'pending'
      const color = stateToColor(activityState, useColors)
      const symbol = stateToSymbol(activityState)
      lines.push(`  ${layerLabel} ${color}${symbol} ${node}${reset}`)
    } else {
      lines.push(`  ${layerLabel}`)
      for (const node of layer) {
        const activityState = state.activities.get(node) ?? 'pending'
        const color = stateToColor(activityState, useColors)
        const symbol = stateToSymbol(activityState)
        lines.push(`    ${color}${symbol} ${node}${reset}`)
      }
    }
  }

  // Summary
  const elapsed = ((Date.now() - state.startTime.getTime()) / 1000).toFixed(1)
  const summary = `${state.completedCount}/${state.totalCount} completed (${elapsed}s)`
  lines.push('')
  lines.push(useColors ? `${ANSI.dim}${summary}${ANSI.reset}` : summary)

  return lines.join('\n')
}

// ============================================================================
// Terminal Renderer
// ============================================================================

/**
 * Terminal renderer for workflow visualization.
 */
export const TerminalRenderer = {
  /**
   * Create a terminal renderer.
   */
  make: (config: TerminalRendererConfig): TerminalRendererInstance => {
    // Determine color support
    const output = config.output ?? process.stdout
    const useColors = config.colors ?? (output.isTTY ?? false)

    // Extract activities from config
    const activities =
      config.mode === 'dag' ? config.layers.flat() : (config as ListModeConfig).activities

    // Initialize state
    const state: RenderState = {
      activities: new Map(activities.map((a) => [a, 'pending' as ActivityState])),
      currentActivity: null,
      startTime: new Date(),
      completedCount: 0,
      totalCount: activities.length,
    }

    // Track mutable state
    let currentActivity: string | null = null
    let completedCount = 0

    const updateState = (): RenderState => ({
      activities: state.activities,
      currentActivity,
      startTime: state.startTime,
      completedCount,
      totalCount: state.totalCount,
    })

    return {
      update: (event: ActivityEvent): void => {
        switch (event._tag) {
          case 'ActivityStarted':
            state.activities.set(event.activity, 'running')
            currentActivity = event.activity
            break
          case 'ActivityCompleted':
            state.activities.set(event.activity, 'completed')
            completedCount++
            if (currentActivity === event.activity) {
              currentActivity = null
            }
            break
          case 'ActivityFailed':
            state.activities.set(event.activity, 'failed')
            if (currentActivity === event.activity) {
              currentActivity = null
            }
            break
          case 'WorkflowCompleted':
          case 'WorkflowFailed':
            currentActivity = null
            break
        }
      },

      render: (): string => {
        const currentState = updateState()

        if (config.mode === 'dag') {
          const edges = config.edges ?? []
          // Use compact rendering for terminal (full DAG can be too wide)
          return renderCompactDag(config.layers, edges, currentState, useColors)
        } else {
          return renderList((config as ListModeConfig).activities, currentState, useColors)
        }
      },

      renderFull: (): string => {
        if (config.mode === 'dag') {
          const edges = config.edges ?? []
          return renderDag(config.layers, edges, updateState(), useColors)
        } else {
          return renderList((config as ListModeConfig).activities, updateState(), useColors)
        }
      },

      getState: (): RenderState => updateState(),
    }
  },
}

/**
 * Terminal renderer instance.
 */
export interface TerminalRendererInstance {
  /** Update state from an activity event */
  update: (event: ActivityEvent) => void
  /** Render current state as ASCII string (compact mode for DAG) */
  render: () => string
  /** Render current state as full ASCII diagram (with box drawing) */
  renderFull: () => string
  /** Get current render state */
  getState: () => RenderState
}
