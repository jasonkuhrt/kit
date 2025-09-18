/**
 * Memory-based filesystem implementation for Effect Platform.
 *
 * Provides an in-memory filesystem service that implements the Effect Platform
 * FileSystem interface. Useful for testing code that depends on filesystem
 * operations without actually touching the disk.
 *
 * @module
 */

export * as FsMemory from './$$.js'
