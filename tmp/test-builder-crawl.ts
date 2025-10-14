import { Project } from 'ts-morph'

const project = new Project({ useInMemoryFileSystem: true })
const sourceFile = project.createSourceFile(
  'test.ts',
  `
interface TestBuilder<State> {
  inputType<I>(): TestBuilder<State & { input: I }>
  cases(...cases: any[]): TestBuilder<State>
  test(): void
  test(fn: (params: any) => void): void
}

/** @builder */
export function on<Fn>(fn: Fn): TestBuilder<{ fn: Fn }> {
  return null as any
}
`,
)

const exports = sourceFile.getExportedDeclarations()
const onDecl = Array.from(exports.values())[0]?.[0]

if (onDecl && 'getReturnType' in onDecl) {
  const returnType = (onDecl as any).getReturnType()
  console.log('Return type:', returnType.getText())

  const symbol = returnType.getSymbol()
  console.log('Symbol:', symbol?.getName())

  const declarations = symbol?.getDeclarations()
  if (declarations && declarations[0]) {
    const interfaceDecl = declarations[0]
    console.log('Declaration kind:', interfaceDecl.getKindName())

    if (interfaceDecl.getKindName() === 'InterfaceDeclaration') {
      const iface = interfaceDecl as any
      const methods = iface.getMethods()

      console.log('\nMethods:')
      for (const method of methods) {
        const name = method.getName()
        const returnType = method.getReturnType()
        const returnTypeText = returnType.getText()

        // Check if returns same builder type
        const isChainable = returnTypeText.includes('TestBuilder')
        const isVoid = returnTypeText === 'void'

        console.log(`  ${name}():`, returnTypeText, '→', isChainable ? 'chainable' : isVoid ? 'terminal' : 'other')
      }
    }
  }
}
