// Utilities from Graffle prelude needed by config-manager

export type GuardedType<$T> = $T extends (x: any) => x is infer $U ? $U : never

export const isAnyFunction = (value: unknown): value is (...args: any[]) => any => {
  return typeof value === 'function'
}

export namespace Objekt {
  export type IsEmpty<$T> = {} extends $T ? true : false
}
