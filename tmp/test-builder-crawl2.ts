import { Project } from 'ts-morph'

const project = new Project({ useInMemoryFileSystem: true })
const sourceFile = project.createSourceFile(
  'test.ts',
  `
interface TestBuilder<State> {
  // Chainable - returns builder
  inputType<I>(): TestBuilder<State & { input: I }>
  cases(...cases: any[]): TestBuilder<State>
  
  // Terminal - returns void
  test(): void
  test(fn: (params: any) => void): void
  
  // Transform - returns different type
  layer<R>(layer: any): TestBuilderWithLayers<State, R>
}

interface TestBuilderWithLayers<State, R> extends TestBuilder<State> {
  testEffect(fn: any): void
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
  const symbol = returnType.getSymbol()
  const builderTypeName = symbol?.getName() // "TestBuilder"

  const declarations = symbol?.getDeclarations()
  if (declarations && declarations[0]) {
    const interfaceDecl = declarations[0]

    if (interfaceDecl.getKindName() === 'InterfaceDeclaration') {
      const iface = interfaceDecl as any
      const methods = iface.getMethods()

      // Group methods by name (handle overloads)
      const methodMap = new Map()
      for (const method of methods) {
        const name = method.getName()
        if (!methodMap.has(name)) {
          methodMap.set(name, [])
        }
        methodMap.get(name).push(method)
      }

      console.log(`\nBuilder: ${builderTypeName}\n`)

      for (const [name, overloads] of methodMap) {
        // Check return type of first overload
        const method = overloads[0]
        const returnType = method.getReturnType()
        const returnTypeText = returnType.getText()
        const returnSymbol = returnType.getSymbol()

        // Classify method
        let category = 'other'
        if (returnTypeText === 'void') {
          category = 'terminal'
        } else if (returnSymbol?.getName() === builderTypeName) {
          category = 'chainable'
        } else if (returnSymbol) {
          category = 'transform'
        }

        console.log(`  ${name}(): ${returnTypeText}`)
        console.log(`    → ${category}`)
        console.log(`    → ${overloads.length} overload(s)`)
      }
    }
  }
}
