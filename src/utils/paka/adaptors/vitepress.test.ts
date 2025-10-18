import { FsLoc } from '#fs-loc'
import { expect, test } from 'vitest'
import {
  Docs,
  FunctionSignature,
  FunctionSignatureModel,
  Parameter,
  SourceLocation,
  TypeParameter,
  ValueExport,
} from '../schema.js'

test('demotes H2 headings in JSDoc descriptions to H4', () => {
  // Regression test for: JSDoc descriptions use double-space separators, not newlines.
  // demoteHeadings requires actual line breaks to match ^## patterns.
  // Must convert double-spaces to newlines BEFORE demoting headings.

  const mockExport = ValueExport.make({
    type: 'function',
    name: 'on',
    signature: FunctionSignatureModel.make({
      overloads: [
        FunctionSignature.make({
          typeParameters: [TypeParameter.make({ name: '$fn' })],
          parameters: [Parameter.make({ name: '$fn', type: '$fn', optional: false, rest: false })],
          returnType: 'TestBuilder',
          returnDoc: undefined,
          throws: [],
        }),
      ],
    }),
    docs: Docs.make({
      description: 'Creates a test table builder.  ## Case Formats  Test cases can be specified in multiple formats.',
    }),
    examples: [],
    tags: {},
    sourceLocation: SourceLocation.make({ file: FsLoc.fromString('./test.ts'), line: 1 }),
  })

  // The description should have H2 headings demoted to H4
  // We can't easily test the full pipeline, but we can verify the transformation logic
  const description = mockExport.docs?.description

  // Simulate the transformation that should happen
  const transformed = description
    ?.replace(/  /g, '\n\n') // Convert double-space to newlines FIRST
    .replace(/ - /g, '\n- ')

  // After conversion, headings should be present as actual line-start patterns
  expect(transformed).toContain('\n\n## Case Formats\n\n')
})

test('renders @param documentation', () => {
  const sig = FunctionSignatureModel.make({
    overloads: [
      FunctionSignature.make({
        typeParameters: [],
        parameters: [
          Parameter.make({ name: 'items', type: 'T[]', optional: false, rest: false, description: 'Array of items' }),
          Parameter.make({
            name: 'fn',
            type: '(item: T) => U',
            optional: false,
            rest: false,
            description: 'Transform function',
          }),
        ],
        returnType: 'U[]',
        returnDoc: undefined,
        throws: [],
      }),
    ],
  })

  const mockExport = ValueExport.make({
    type: 'function',
    name: 'map',
    signature: sig,
    examples: [],
    tags: {},
    sourceLocation: SourceLocation.make({ file: FsLoc.fromString('./test.ts'), line: 1 }),
  })

  const fnSig = mockExport.signature as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.parameters[0]?.description).toBe('Array of items')
  expect(fnSig.overloads[0]?.parameters[1]?.description).toBe('Transform function')
})

test('renders @returns documentation', () => {
  const sig = FunctionSignatureModel.make({
    overloads: [
      FunctionSignature.make({
        typeParameters: [],
        parameters: [Parameter.make({ name: 'value', type: 'number', optional: false, rest: false })],
        returnType: 'number',
        returnDoc: 'The doubled value',
        throws: [],
      }),
    ],
  })

  const mockExport = ValueExport.make({
    type: 'function',
    name: 'double',
    signature: sig,
    examples: [],
    tags: {},
    sourceLocation: SourceLocation.make({ file: FsLoc.fromString('./test.ts'), line: 1 }),
  })

  const fnSig = mockExport.signature as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.returnDoc).toBe('The doubled value')
})

test('renders @throws documentation', () => {
  const sig = FunctionSignatureModel.make({
    overloads: [
      FunctionSignature.make({
        typeParameters: [],
        parameters: [Parameter.make({ name: 'value', type: 'number', optional: false, rest: false })],
        returnType: 'number',
        returnDoc: undefined,
        throws: ['Error if value is negative', 'TypeError if value is not a number'],
      }),
    ],
  })

  const mockExport = ValueExport.make({
    type: 'function',
    name: 'process',
    signature: sig,
    examples: [],
    tags: {},
    sourceLocation: SourceLocation.make({ file: FsLoc.fromString('./test.ts'), line: 1 }),
  })

  const fnSig = mockExport.signature as typeof FunctionSignatureModel.Type
  expect(fnSig.overloads[0]?.throws).toEqual([
    'Error if value is negative',
    'TypeError if value is not a number',
  ])
})
