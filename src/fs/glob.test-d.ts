import { Assert } from '#assert'
import { Fs } from '#fs'
import { Effect } from 'effect'
import { glob, globSync } from './glob.js'

const A = Assert.exact
const p = '*'

// Test onlyFiles option behavior
A.ofAs<Effect.Effect<Fs.Path.RelFile[], Error>>().on(glob(p, { onlyFiles: true }))
A.ofAs<Effect.Effect<Fs.Path.AbsFile[], Error>>().on(glob(p, { onlyFiles: true, absolute: true }))
A.ofAs<Effect.Effect<Fs.Path.RelFile[], Error>>().on(glob(p))
A.ofAs<Effect.Effect<Fs.Path.RelFile[], Error>>().on(glob(p, {}))

// Test onlyDirectories option behavior
A.ofAs<Effect.Effect<Fs.Path.RelDir[], Error>>().on(glob(p, { onlyDirectories: true }))
A.ofAs<Effect.Effect<Fs.Path.AbsDir[], Error>>().on(glob(p, { onlyDirectories: true, absolute: true }))

// Test onlyFiles: false behavior (returns both files and dirs)
A.ofAs<Effect.Effect<Fs.Path.$Rel[], Error>>().on(glob(p, { onlyFiles: false }))
A.ofAs<Effect.Effect<Fs.Path.$Abs[], Error>>().on(glob(p, { onlyFiles: false, absolute: true }))

// Test globSync has same type inference behavior
A.ofAs<Effect.Effect<Fs.Path.RelFile[], Error>>().on(globSync(p, { onlyFiles: true }))
A.ofAs<Effect.Effect<Fs.Path.AbsFile[], Error>>().on(globSync(p, { onlyFiles: true, absolute: true }))
A.ofAs<Effect.Effect<Fs.Path.RelDir[], Error>>().on(globSync(p, { onlyDirectories: true }))
A.ofAs<Effect.Effect<Fs.Path.AbsDir[], Error>>().on(globSync(p, { onlyDirectories: true, absolute: true }))
A.ofAs<Effect.Effect<Fs.Path.RelFile[], Error>>().on(globSync(p))

// Test that the user's specific use case works as expected
A.ofAs<Effect.Effect<Fs.Path.AbsFile[], Error>>().on(glob(p, { absolute: true, onlyFiles: true }))
