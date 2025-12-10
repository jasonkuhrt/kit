import type { MockInstance } from 'vitest'
import { beforeEach, vi } from 'vitest'

export let exit: MockInstance

beforeEach(() => {
  exit = vi.spyOn(process, `exit`).mockImplementation(() => undefined as never)
})
