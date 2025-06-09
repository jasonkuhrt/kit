// Browser-safe version - mock process object
export const process = {
  env: {} as Record<string, string | undefined>,
  argv: [] as string[],
  exit: (code?: number) => {
    throw new Error(`process.exit(${code}) called in browser environment`)
  },
  cwd: () => '/',
}
