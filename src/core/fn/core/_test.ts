// Test helper types and functions for fn module tests

export const _ = Symbol('placeholder')

export const fn0p = () => {}
export const fn1p = (arg1: number) => {}
export const fn1pOptional = (arg?: number) => {}
export const fn2p = (arg1: number, arg2: string) => {}
export const fn2pOptional = (arg1?: number, arg2?: string) => {}
export const fn3p = (arg1: number, arg2: string, arg3: boolean) => {}
export const fnNoParameters = () => {}
