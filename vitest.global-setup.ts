import { cleanup, setup } from '@ark/attest'

export async function globalSetup() {
  await setup()
}

export function teardown() {
  cleanup()
}
