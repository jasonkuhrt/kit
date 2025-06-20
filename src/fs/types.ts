import type { Json } from '#json'

/**
 * Represents a file with path and content.
 *
 * @typeParam $Type - The type of the file content. Defaults to string.
 */
export interface File<$Type = string> {
  path: string
  content: $Type
}

/**
 * Represents a reference to a file by its path.
 */
export interface FilePointer {
  path: string
}

/**
 * Options for file write operations.
 */
export interface FileWriteOptions {
  hard?: boolean | undefined
}

/**
 * Input type for file write operations, combining file data and write options.
 *
 * @typeParam $Type - The type of the file content. Defaults to string.
 */
export interface FileWriteInput<$Type = string> extends File<$Type>, FileWriteOptions {}

/**
 * File write input that accepts either string or JSON object content.
 */
export type FileWriteInputMaybeJson = FileWriteInput<string | Json.Object>
