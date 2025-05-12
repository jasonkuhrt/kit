// dprint-ignore
export function pipe<value>(value: value, ...reducers: []): value
// dprint-ignore
export function pipe<value, f1 extends (value: value) => any>(value: value, ...fns: [f1]): ReturnType<f1>
// dprint-ignore
export function pipe<value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any>(value: value, ...fns: [f1, f2]): ReturnType<f2>
// dprint-ignore
export function pipe<value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any>(value: value, ...fns: [f1, f2, f3]): ReturnType<f3>
// dprint-ignore
export function pipe<value, f1 extends (value: value) => any, f2 extends (value: ReturnType<f1>) => any, f3 extends (value: ReturnType<f2>) => any, f4 extends (value: ReturnType<f3>) => any>(value: value, ...fns: [f1, f2, f3, f4]): ReturnType<f4>

export function pipe(value: any, ...fns: ((...args: any[]) => any)[]) {
  return fns.reduce((value, fn) => {
    const nextValue = fn(value)
    return nextValue
  }, value)
}
