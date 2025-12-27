import { describe, expect, test } from 'vitest'
import type { ActivityEvent } from '../observable/__.js'
import { TerminalRenderer } from './visualization.js'

// ============================================================================
// List Mode Rendering
// ============================================================================

describe('TerminalRenderer list mode', () => {
  const activities = ['Preflight', 'Publish:core', 'Publish:flo', 'CreateTag', 'PushTags']

  test('initial state (all pending)', () => {
    const renderer = TerminalRenderer.make({
      activities,
      colors: false,
    })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('one activity running', () => {
    const renderer = TerminalRenderer.make({
      activities,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('first completed, second running', () => {
    const renderer = TerminalRenderer.make({
      activities,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:core', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('all completed', () => {
    const renderer = TerminalRenderer.make({
      activities,
      colors: false,
    })
    for (const activity of activities) {
      renderer.update({ _tag: 'ActivityStarted', activity, timestamp: new Date(), resumed: false })
      renderer.update({ _tag: 'ActivityCompleted', activity, timestamp: new Date(), durationMs: 100, resumed: false })
    }
    expect(renderer.render()).toMatchSnapshot()
  })

  test('with failure', () => {
    const renderer = TerminalRenderer.make({
      activities,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:core', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityFailed', activity: 'Publish:core', timestamp: new Date(), error: 'npm publish failed' })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('with colors enabled', () => {
    const renderer = TerminalRenderer.make({
      activities: ['Step1', 'Step2', 'Step3'],
      colors: true,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Step1', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Step1', timestamp: new Date(), durationMs: 50, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Step2', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })
})

// ============================================================================
// DAG Mode Rendering (Compact)
// ============================================================================

describe('TerminalRenderer DAG mode (compact)', () => {
  // Diamond dependency pattern:
  // Preflight -> Publish:A -> CreateTag
  // Preflight -> Publish:B -> CreateTag
  const layers: readonly (readonly string[])[] = [
    ['Preflight'],
    ['Publish:A', 'Publish:B'],
    ['CreateTag'],
  ]

  const edges: readonly (readonly [string, string])[] = [
    ['Preflight', 'Publish:A'],
    ['Preflight', 'Publish:B'],
    ['Publish:A', 'CreateTag'],
    ['Publish:B', 'CreateTag'],
  ]

  test('initial state (all pending)', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('first layer running', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('first layer done, second layer concurrent', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:A', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:B', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('all completed', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    const allActivities = layers.flat()
    for (const activity of allActivities) {
      renderer.update({ _tag: 'ActivityStarted', activity, timestamp: new Date(), resumed: false })
      renderer.update({ _tag: 'ActivityCompleted', activity, timestamp: new Date(), durationMs: 100, resumed: false })
    }
    expect(renderer.render()).toMatchSnapshot()
  })

  test('with failure in concurrent layer', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:A', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:B', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Publish:A', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityFailed', activity: 'Publish:B', timestamp: new Date(), error: 'publish failed' })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('with colors enabled', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: true,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:A', timestamp: new Date(), resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })
})

// ============================================================================
// DAG Mode Rendering (Full Box Drawing)
// ============================================================================

describe('TerminalRenderer DAG mode (full)', () => {
  const layers: readonly (readonly string[])[] = [
    ['StepA'],
    ['StepB', 'StepC'],
    ['StepD'],
  ]

  const edges: readonly (readonly [string, string])[] = [
    ['StepA', 'StepB'],
    ['StepA', 'StepC'],
    ['StepB', 'StepD'],
    ['StepC', 'StepD'],
  ]

  test('full render initial state', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    expect(renderer.renderFull()).toMatchSnapshot()
  })

  test('full render with progress', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'StepA', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'StepA', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'StepB', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'StepC', timestamp: new Date(), resumed: false })
    expect(renderer.renderFull()).toMatchSnapshot()
  })

  test('full render with colors', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      edges,
      colors: true,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'StepA', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'StepA', timestamp: new Date(), durationMs: 100, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'StepB', timestamp: new Date(), resumed: false })
    expect(renderer.renderFull()).toMatchSnapshot()
  })
})

// ============================================================================
// State Management
// ============================================================================

describe('TerminalRenderer state', () => {
  test('getState returns current state', () => {
    const renderer = TerminalRenderer.make({
      activities: ['A', 'B', 'C'],
      colors: false,
    })

    let state = renderer.getState()
    expect(state.completedCount).toBe(0)
    expect(state.totalCount).toBe(3)
    expect(state.currentActivity).toBeNull()
    expect(state.activities.get('A')).toBe('pending')

    renderer.update({ _tag: 'ActivityStarted', activity: 'A', timestamp: new Date(), resumed: false })
    state = renderer.getState()
    expect(state.currentActivity).toBe('A')
    expect(state.activities.get('A')).toBe('running')

    renderer.update({ _tag: 'ActivityCompleted', activity: 'A', timestamp: new Date(), durationMs: 100, resumed: false })
    state = renderer.getState()
    expect(state.completedCount).toBe(1)
    expect(state.activities.get('A')).toBe('completed')
  })

  test('workflow events clear current activity', () => {
    const renderer = TerminalRenderer.make({
      activities: ['A'],
      colors: false,
    })

    renderer.update({ _tag: 'ActivityStarted', activity: 'A', timestamp: new Date(), resumed: false })
    expect(renderer.getState().currentActivity).toBe('A')

    renderer.update({ _tag: 'WorkflowCompleted', timestamp: new Date(), durationMs: 1000 })
    expect(renderer.getState().currentActivity).toBeNull()
  })
})

// ============================================================================
// Complex DAG Scenarios
// ============================================================================

describe('TerminalRenderer complex DAG', () => {
  // Release workflow pattern:
  // Preflight -> Publish:core -> |
  //           -> Publish:flo  -> CreateTag -> PushTags
  //           -> Publish:syn  -> |
  const layers: readonly (readonly string[])[] = [
    ['Preflight'],
    ['Publish:@kitz/core', 'Publish:@kitz/flo', 'Publish:@kitz/syn'],
    ['CreateTag'],
    ['PushTags'],
  ]

  test('complex DAG initial state', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      colors: false,
    })
    expect(renderer.render()).toMatchSnapshot()
  })

  test('complex DAG full render', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      colors: false,
    })
    expect(renderer.renderFull()).toMatchSnapshot()
  })

  test('complex DAG mid-execution', () => {
    const renderer = TerminalRenderer.make({
      mode: 'dag',
      layers,
      colors: false,
    })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Preflight', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Preflight', timestamp: new Date(), durationMs: 50, resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:@kitz/core', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:@kitz/flo', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityStarted', activity: 'Publish:@kitz/syn', timestamp: new Date(), resumed: false })
    renderer.update({ _tag: 'ActivityCompleted', activity: 'Publish:@kitz/core', timestamp: new Date(), durationMs: 200, resumed: false })
    expect(renderer.render()).toMatchSnapshot()
  })
})
