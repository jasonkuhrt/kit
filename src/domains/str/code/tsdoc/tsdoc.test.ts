import { Test } from '#test'
import { expect, test } from 'vitest'
import * as TSDoc from './tsdoc.js'

// ============================================================================
// Core Formatting
// ============================================================================

// Test escaping
// dprint-ignore
Test.describe('TSDoc.escape > basic escaping')
  .on(TSDoc.escape)
  .cases(
    [['hello world'],                             'hello world'],
    [['*/'],                                      '* /'],
    [['@deprecated use new'],                     '\\@deprecated use new'],
    [['@param foo'],                              '\\@param foo'],
    [['regular text @notAtLineStart'],            'regular text @notAtLineStart'],
  )
  .test()

// dprint-ignore
Test.describe('TSDoc.escape > null/undefined')
  .on(TSDoc.escape)
  .cases(
    [[null as any],                               null],
    [[undefined as any],                          null],
  )
  .test()

// Test format function
test('TSDoc.format > basic formatting', () => {
  const result = TSDoc.format('Hello\nWorld')
  expect(result).toBe('/**\n* Hello\n* World\n*/')
})

test('TSDoc.format > single line', () => {
  const result = TSDoc.format('Single line')
  expect(result).toBe('/**\n* Single line\n*/')
})

test('TSDoc.format > with empty lines', () => {
  const result = TSDoc.format('Line 1\n\nLine 2')
  expect(result).toBe('/**\n* Line 1\n*\n* Line 2\n*/')
})

test('TSDoc.format > null returns empty', () => {
  const result = TSDoc.format(null)
  expect(result).toBe('')
})

// ============================================================================
// Type Branding
// ============================================================================

test('TSDoc.raw > creates branded type', () => {
  const result = TSDoc.raw('{@link Foo}')
  expect(result).toEqual({
    __jsDocSafe: true,
    content: '{@link Foo}',
  })
})

// ============================================================================
// Tag Helpers
// ============================================================================

test('TSDoc.tag.deprecated > with reason', () => {
  const result = TSDoc.tag.deprecated('Use newMethod()')
  expect(result?.content).toBe('@deprecated Use newMethod()')
})

test('TSDoc.tag.deprecated > null reason returns null', () => {
  const result = TSDoc.tag.deprecated(null)
  expect(result).toBe(null)
})

test('TSDoc.tag.see > with text', () => {
  const result = TSDoc.tag.see('https://example.com', 'Documentation')
  expect(result.content).toBe('@see {@link https://example.com | Documentation}')
})

test('TSDoc.tag.see > without text', () => {
  const result = TSDoc.tag.see('https://example.com')
  expect(result.content).toBe('@see {@link https://example.com}')
})

test('TSDoc.tag.link > with text', () => {
  const result = TSDoc.tag.link('MyType', 'the type')
  expect(result.content).toBe('{@link MyType | the type}')
})

test('TSDoc.tag.link > without text', () => {
  const result = TSDoc.tag.link('MyType')
  expect(result.content).toBe('{@link MyType}')
})

test('TSDoc.tag.example > generates code block', () => {
  const result = TSDoc.tag.example('const x = 1', 'ts')
  expect(result.content).toBe('@example\n```ts\nconst x = 1\n```')
})

test('TSDoc.tag.remarks > with content', () => {
  const result = TSDoc.tag.remarks('Important note')
  expect(result?.content).toBe('@remarks\nImportant note')
})

test('TSDoc.tag.remarks > null content returns null', () => {
  const result = TSDoc.tag.remarks(null)
  expect(result).toBe(null)
})

test('TSDoc.tag.param > generates param tag', () => {
  const result = TSDoc.tag.param('name', 'The user name')
  expect(result.content).toBe('@param name - The user name')
})

test('TSDoc.tag.returns > generates returns tag', () => {
  const result = TSDoc.tag.returns('The result value')
  expect(result.content).toBe('@returns The result value')
})

// ============================================================================
// Builder Interface
// ============================================================================

test('TSDoc.builder > basic usage', () => {
  const doc = TSDoc.builder()
  doc`First line`
  doc`Second line`
  const result = doc.build()
  expect(result).toBe('First line\nSecond line')
})

test('TSDoc.builder > with escaping', () => {
  const doc = TSDoc.builder()
  doc`User input: ${'*/'}`
  const result = doc.build()
  expect(result).toBe('User input: * /')
})

test('TSDoc.builder > with raw content', () => {
  const doc = TSDoc.builder()
  const link = TSDoc.raw('{@link Foo}')
  doc`See: ${link}`
  const result = doc.build()
  expect(result).toBe('See: {@link Foo}')
})

test('TSDoc.builder > .add() with null skips', () => {
  const doc = TSDoc.builder()
  doc`Line 1`
  doc.add(null)
  doc.add(undefined)
  doc.add('Line 2')
  const result = doc.build()
  expect(result).toBe('Line 1\nLine 2')
})

test('TSDoc.builder > .addRaw() for pre-escaped content', () => {
  const doc = TSDoc.builder()
  doc.addRaw('{@link Type}')
  const result = doc.build()
  expect(result).toBe('{@link Type}')
})

test('TSDoc.builder > .blank() adds empty line', () => {
  const doc = TSDoc.builder()
  doc`First`
  doc.blank()
  doc`Second`
  const result = doc.build()
  expect(result).toBe('First\n\nSecond')
})

test('TSDoc.builder > .table() with basic entries', () => {
  const doc = TSDoc.builder()
  doc.table({
    'Name': 'Alice',
    'Age': '30',
  })
  const result = doc.build()
  expect(result).toContain('| | |')
  expect(result).toContain('| **Name** | Alice |')
  expect(result).toContain('| **Age** | 30 |')
})

test('TSDoc.builder > .table() filters undefined/null', () => {
  const doc = TSDoc.builder()
  doc.table({
    'Name': 'Bob',
    'Age': undefined,
    'City': null,
  })
  const result = doc.build()
  expect(result).toContain('| **Name** | Bob |')
  expect(result).not.toContain('Age')
  expect(result).not.toContain('City')
})

test('TSDoc.builder > .table() with array values', () => {
  const doc = TSDoc.builder()
  doc.table({
    'Items': ['a', 'b', 'c'],
  })
  const result = doc.build()
  expect(result).toContain('| **Items** | a, b, c |')
})

test('TSDoc.builder > .codeblock()', () => {
  const doc = TSDoc.builder()
  doc.codeblock('ts', 'const x = 1')
  const result = doc.build()
  expect(result).toBe('```ts\nconst x = 1\n```')
})

test('TSDoc.builder > .$deprecated()', () => {
  const doc = TSDoc.builder()
  doc.$deprecated('Use newMethod()')
  const result = doc.build()
  expect(result).toBe('@deprecated Use newMethod()')
})

test('TSDoc.builder > .$example() template mode', () => {
  const doc = TSDoc.builder()
  doc.$example('Basic', 'ts')`const x = 1`
  const result = doc.build()
  expect(result).toContain('@example Basic')
  expect(result).toContain('```ts')
  expect(result).toContain('const x = 1')
})

test('TSDoc.builder > .$example() direct mode', () => {
  const doc = TSDoc.builder()
  doc.$example('Basic', 'ts', 'const x = 1')
  const result = doc.build()
  expect(result).toContain('@example Basic')
  expect(result).toContain('```ts')
  expect(result).toContain('const x = 1')
})

test('TSDoc.builder > .$see()', () => {
  const doc = TSDoc.builder()
  doc.$see('https://example.com', 'Documentation')
  const result = doc.build()
  expect(result).toBe('@see {@link https://example.com | Documentation}')
})

test('TSDoc.builder > .$link() returns Raw', () => {
  const doc = TSDoc.builder()
  const link = doc.$link('MyType', 'the type')
  expect(link).toEqual({
    __jsDocSafe: true,
    content: '{@link MyType | the type}',
  })
})

test('TSDoc.builder > .$remarks()', () => {
  const doc = TSDoc.builder()
  doc.$remarks`Important note`
  const result = doc.build()
  expect(result).toBe('@remarks\nImportant note')
})

test('TSDoc.builder > complex example', () => {
  const doc = TSDoc.builder()

  doc`Main description`
  doc``
  doc.add('User-provided description')
  doc``
  doc.$deprecated('Use v2')
  doc``
  doc.table({
    'Type': 'string',
    'Required': 'Yes',
  })

  const result = doc.build()
  expect(result).toContain('Main description')
  expect(result).toContain('User-provided description')
  expect(result).toContain('@deprecated Use v2')
  expect(result).toContain('| **Type** | string |')
})

// ============================================================================
// Tagged Template
// ============================================================================

test('TSDoc.template > basic usage', () => {
  const result = TSDoc.template`Hello world`
  expect(result).toBe('Hello world')
})

test('TSDoc.template > with escaping', () => {
  const result = TSDoc.template`Code: ${'*/'}`
  expect(result).toBe('Code: * /')
})

test('TSDoc.template > with raw content', () => {
  const link = TSDoc.raw('{@link Foo}')
  const result = TSDoc.template`See: ${link}`
  expect(result).toBe('See: {@link Foo}')
})

test('TSDoc.template > with null values', () => {
  const result = TSDoc.template`Value: ${null} and ${undefined}`
  expect(result).toBe('Value:  and ')
})

test('TSDoc.template > whitespace normalization', () => {
  const result = TSDoc.template`
    First line

    Second line
  `
  expect(result).toBe('First line\n\nSecond line')
})

test('TSDoc.template.factory > creates reusable generator', () => {
  const genDoc = TSDoc.template.factory<[name: string, type: string]>((doc, name, type) => {
    doc`Field: ${name}`
    doc``
    doc.table({ 'Type': type })
  })

  const result = genDoc('foo', 'string')
  expect(result).toContain('Field: foo')
  expect(result).toContain('| **Type** | string |')
})
