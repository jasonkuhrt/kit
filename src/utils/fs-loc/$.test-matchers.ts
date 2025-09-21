import { expect } from 'vitest'
import '../test/matchers/$.js'
import * as FsLoc from './$$.js'

interface FsLocMatchers<R = unknown> {
  /**
   * Check if the FsLoc is absolute
   */
  toBeAbs(): R

  /**
   * Check if the FsLoc is relative
   */
  toBeRel(): R

  /**
   * Check if the FsLoc is a file
   */
  toBeFile(): R

  /**
   * Check if the FsLoc is a directory
   */
  toBeDir(): R

  /**
   * Check if the FsLoc is at root (no path segments)
   */
  toBeRoot(): R

  /**
   * Check if the FsLoc is within a given directory
   */
  toBeWithin(parent: FsLoc.Groups.Dir.Dir): R

  /**
   * Check if the FsLoc encodes to the expected string
   */
  toEncodeTo(expected: string): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends FsLocMatchers<T> {}
  interface AsymmetricMatchersContaining extends FsLocMatchers {}
}

expect.extend({
  toBeAbs(received: FsLoc.FsLoc) {
    const pass = FsLoc.Groups.Abs.is(received)
    const receivedStr = FsLoc.encodeSync(received)

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be absolute`
          : `Expected ${receivedStr} to be absolute`,
    }
  },

  toBeRel(received: FsLoc.FsLoc) {
    const pass = FsLoc.Groups.Rel.is(received)
    const receivedStr = FsLoc.encodeSync(received)

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be relative`
          : `Expected ${receivedStr} to be relative`,
    }
  },

  toBeFile(received: FsLoc.FsLoc) {
    const pass = FsLoc.Groups.File.is(received)
    const receivedStr = FsLoc.encodeSync(received)

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be a file`
          : `Expected ${receivedStr} to be a file`,
    }
  },

  toBeDir(received: FsLoc.FsLoc) {
    const pass = FsLoc.Groups.Dir.is(received)
    const receivedStr = FsLoc.encodeSync(received)

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be a directory`
          : `Expected ${receivedStr} to be a directory`,
    }
  },

  toBeRoot(received: FsLoc.FsLoc) {
    const pass = FsLoc.isRoot(received)
    const receivedStr = FsLoc.encodeSync(received)

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be at root`
          : `Expected ${receivedStr} to be at root`,
    }
  },

  toBeWithin(received: FsLoc.FsLoc, parent: FsLoc.Groups.Dir.Dir) {
    // Convert both to absolute for comparison if needed
    const receivedStr = FsLoc.encodeSync(received)
    const parentStr = FsLoc.encodeSync(parent)

    // Check if received path starts with parent path
    // This is a simplified check - you might want to make it more robust
    const receivedSegments = received.path.segments
    const parentSegments = parent.path.segments

    const pass = parentSegments.every((seg, i) => receivedSegments[i] === seg)
      && receivedSegments.length > parentSegments.length

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${receivedStr} not to be within ${parentStr}`
          : `Expected ${receivedStr} to be within ${parentStr}`,
    }
  },

  toEncodeTo(received: FsLoc.FsLoc, expected: string) {
    const actual = FsLoc.encodeSync(received)
    const pass = actual === expected

    return {
      pass,
      message: () =>
        pass
          ? `Expected FsLoc not to encode to "${expected}"`
          : `Expected FsLoc to encode to "${expected}", but got "${actual}"`,
    }
  },
})
