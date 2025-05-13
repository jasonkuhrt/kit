import type { Json } from '../json/index.js'

export interface File<$Type = string> {
  path: string
  content: $Type
}

export interface FilePointer {
  path: string
}

export interface FileWriteOptions {
  hard?: boolean | undefined
}

export interface FileWriteInput<$Type = string> extends File<$Type>, FileWriteOptions {}

export type FileWriteInputMaybeJson = FileWriteInput<string | Json.Object>
