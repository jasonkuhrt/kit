import { strict as assert } from 'assert'
import { test } from 'vitest'
import { dualExport, escapeReserved, reservedNames } from './reserved.js'

test(`reserved names includes 'as'`, () => {
  assert.ok(reservedNames.includes(`as`), `"as" should be included in reservedNames`)
})

test(`escapeReserved('as') returns '$as'`, () => {
  assert.equal(escapeReserved(`as`), `$as`, `escapeReserved should return "$as" for the name "as"`)
})

test(`dualExport handles 'as' keyword correctly`, () => {
  const result = dualExport({
    name: `as`,
    const: { value: `1` },
    type: { type: `number` },
  })

  assert.equal(result.internalName, `$as`, `dualExport should use "$as" as the internal name for exported "as"`)
  assert.equal(result.exportedName, `as`, `dualExport should preserve the exportedName as "as"`)
  assert.ok(result.code.includes(`export { $as as as }`), `dualExport code should include the re-export for "as"`)
})
