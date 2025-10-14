import { Project } from 'ts-morph'

const project = new Project({ useInMemoryFileSystem: true })
const sourceFile = project.createSourceFile(
  'test.ts',
  `
export function parse(input: string): Config
export function parse(input: Buffer): Config  
export function parse(input: unknown): Config {
  return {} as Config
}

interface Config {}
`,
)

const exports = sourceFile.getExportedDeclarations()
const parseDecl = Array.from(exports.values())[0]?.[0]

console.log('Declaration type:', parseDecl?.getKindName())
console.log('Has getOverloads:', typeof (parseDecl as any).getOverloads)
console.log('Has getImplementation:', typeof (parseDecl as any).getImplementation)

const overloads = (parseDecl as any).getOverloads()
console.log('Number of overloads from getOverloads():', overloads?.length)

const impl = (parseDecl as any).getImplementation?.()
console.log('Has implementation:', !!impl)
if (impl) {
  console.log('Implementation text:', impl.getText().substring(0, 100))
}
