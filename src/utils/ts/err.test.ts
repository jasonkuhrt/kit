import { attest } from '@ark/attest'
import { test } from 'vitest'
import type * as Err from './err.js'

test('StaticError - message only', () => {
  attest({} as Err.StaticError<'msg'>).type.toString.snap(`{
  ERROR_________: "msg"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('StaticError - with metadata', () => {
  attest({} as Err.StaticError<'msg', { a: 'a'; b: 'b' }>).type.toString.snap(`{
  ERROR_________: "msg"
  a_____________: "a"
  b_____________: "b"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('StaticError - with multiple metadata fields', () => {
  attest({} as Err.StaticError<'msg', { a: 'a'; b: 'b'; c: 'c'; d: 'd' }>).type
    .toString.snap(`{
  ERROR_________: "msg"
  a_____________: "a"
  b_____________: "b"
  c_____________: "c"
  d_____________: "d"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})

test('StaticError - with long key name', () => {
  attest({} as Err.StaticError<'msg', { veryLongKeyName: 'x'; s: 'y' }>).type
    .toString.snap(`{
  ERROR_________: "msg"
  veryLongKeyName: "x"
  s_____________: "y"
  HIERARCHY_____: readonly ["root", ...string[]]
}`)
})
