import type { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import type { ConfigManager } from './_.js'

interface a1 {
  a: { b: number }
  b: string
}

interface x1 {
  z: number
  a: [1]
  c: { x: 1 }
}

// dprint-ignore
type _ = A.Cases<
  A.exact<
    ConfigManager.SetKeysOptional<x1, {
      a: [1, 2]
      c: { y: 2 }
      keyThatDoesNotExistOnX1: boolean
    }>,
    { z: number; a: [1, 2]; c: { y: 2 } }
  >,
  A.exact<ConfigManager.MergeDefaultsShallow<{x:1}, undefined>            , {x:1}>,
  A.exact<ConfigManager.MergeDefaultsShallow<{x:1}, {}>                   , {x:1}>,
  A.equiv<ConfigManager.MergeDefaultsShallow<{}, {x:1}>                   , {x:1}>,
  A.equiv<ConfigManager.MergeDefaultsShallow<{x:2}, {x:1}>                , {x:1}>,
  A.exact<ConfigManager.MergeDefaults<{x:1}, undefined>                   , {x:1}>,
  A.exact<ConfigManager.MergeDefaults<{x:1}, {}>                          , {x:1}>,
  A.exact<ConfigManager.MergeDefaults<{x:1}, {x:2}>                       , {x:2}>,
  A.exact<ConfigManager.MergeDefaults<{x:1}, {x:2; y:3}>                  , {x:2; y:3}>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, [], { a2: 2 }>      , { a: { b: 2 }; a2: 2 }>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, ['a'], { b: 3 }>    , { a: { b: 3 } }>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, ['a', 'b'], 3>      , { a: { b: 3 } }>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, [], 1>              , never>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, ['x'], 1>           , never>,
  A.exact<ConfigManager.SetKeyAtPath<{ a: { b: 2 } }, ['a', 'b', 'c'], 3> , { a: { b: never } }>,
  A.equiv<ConfigManager.SetKey<a1, 'a', { b: 2 }>                         , { a: { b: 2 }; b: string }>,
  A.equiv<ConfigManager.SetKey<{ a?: number }, 'a', 1>                    , { a: 1 }>,
  A.equiv<ConfigManager.SetKey<{ a?: number; b?: number }, 'a', 1>        , { a: 1; b?: number }>,
  A.exact<ConfigManager.SetAtPath<a1, [], 9>                              , a1>,
  A.equiv<ConfigManager.SetAtPath<a1, ['a'], { b: 2 }>                    , { a: { b: 2 }; b: string }>,
  A.equiv<ConfigManager.SetAtPath<a1, ['a'], { x: 2 }>                    , { a: { x: 2 }; b: string }>,
  A.equiv<ConfigManager.SetAtPath<a1, ['a', 'b'], 9>                      , { a: { b: 9 }; b: string }>,
  A.equiv<ConfigManager.SetAtPath<a1, ['a', 'b', 'c'], 9>                 , { a: { b: { c: 9 } }; b: string }>,
  A.equiv<ConfigManager.SetAtPath<a1, ['a', 'b2', 'c'], 9>                , { a: { b: number; b2: { c: 9 } }; b: string }>,
  A.equiv<ConfigManager.SetAtPath<a1, ['c'], 9>                           , { a: { b: number }; b: string; c: 9 }>,
  // A.equiv<ConfigManager.UpdateMany<{'a':2}, [[['a'], 1]]>                 , { a: 1 }>,
  // A.exact<ConfigManager.UpdateMany<{'a':2}, [[['a'], 1], null]>           , { a: 1 }>,
  A.equiv<ConfigManager.UpdateKeyWithAppendOne<{x: []}, 'x', 1>           , { x: [1] }>,
  A.equiv<ConfigManager.UpdateKeyWithAppendOne<{x: [1]}, 'x', 2>          , { x: [1, 2] }>,
  A.equiv<ConfigManager.UpdateKeyWithAppendOne<{x: []}, 'x', 1>           , { x: [1] }>,
  A.equiv<ConfigManager.UpdateKeyWithAppendOne<{x: [1]}, 'x', 2>          , { x: [1, 2] }>,
  A.equiv<ConfigManager.UpdateKeyWithIntersection<{x: {}}, 'x', {}>       , { x: {} }>,
  A.equiv<ConfigManager.UpdateKeyWithIntersection<{x: {}}, 'x', {a:1}>    , { x: {a:1} }>,
  A.equiv<ConfigManager.UpdateKeyWithIntersection<{x: {b:2}}, 'x', {a:1}> , { x: {a:1; b:2} }>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {}>                        , {a:1}>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {a:2}>                     , {a:2}>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {a:undefined}>             , {a:1}>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {a?:1}>                    , {a:1}>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {a?:2}>                    , {a:2}>,
  A.exact<ConfigManager.SetKeysOptional<{a:1}, {a:2|undefined}>           , {a:2}>
>
