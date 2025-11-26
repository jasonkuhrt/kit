import { Ts } from '#ts'
import type { Guard } from './inputs.js'

// Test Guards by using them in function signatures
// Valid inputs should pass through unchanged
// Invalid inputs should produce StaticError types

// Helper to test Guard behavior
declare function testGuard<$input>(input: $input): void

// === Guard.RelFile Tests ===

// Valid cases - should accept
testGuard<Guard.RelFile<'file.txt'>>('file.txt')
testGuard<Guard.RelFile<'./src/index.ts'>>('./src/index.ts')
testGuard<Guard.RelFile<'../lib/util.js'>>('../lib/util.js')
testGuard<Guard.RelFile<'path/to/file.txt'>>('path/to/file.txt')

// Invalid cases - should be StaticError (test with type alias)
type _relFileError1 = Guard.RelFile<'/absolute/file.txt'>
type _relFileError2 = Guard.RelFile<'./src/'>
type _relFileError3 = Guard.RelFile<'src'>

// === Guard.RelDir Tests ===
testGuard<Guard.RelDir<'./'>>('./')
testGuard<Guard.RelDir<'src/'>>('src/')
testGuard<Guard.RelDir<'../'>>('../')
testGuard<Guard.RelDir<'src'>>('src')

type _relDirError1 = Guard.RelDir<'/absolute/'>
type _relDirError2 = Guard.RelDir<'./file.txt'>

// === Guard.AbsFile Tests ===
testGuard<Guard.AbsFile<'/file.txt'>>('/file.txt')
testGuard<Guard.AbsFile<'/home/user/doc.pdf'>>('/home/user/doc.pdf')
testGuard<Guard.AbsFile<'/a/b/c.js'>>('/a/b/c.js')

type _absFileError1 = Guard.AbsFile<'./file.txt'>
type _absFileError2 = Guard.AbsFile<'/home/'>
type _absFileError3 = Guard.AbsFile<'/'>

// === Guard.AbsDir Tests ===
testGuard<Guard.AbsDir<'/'>>('/')
testGuard<Guard.AbsDir<'/home/'>>('/home/')
testGuard<Guard.AbsDir<'/usr/local/'>>('/usr/local/')
testGuard<Guard.AbsDir<'/home'>>('/home')

type _absDirError1 = Guard.AbsDir<'./src/'>
type _absDirError2 = Guard.AbsDir<'/file.txt'>

// === Guard.File Tests ===
testGuard<Guard.File<'file.txt'>>('file.txt')
testGuard<Guard.File<'/file.txt'>>('/file.txt')
testGuard<Guard.File<'./src/index.ts'>>('./src/index.ts')
testGuard<Guard.File<'/home/doc.pdf'>>('/home/doc.pdf')

type _fileError1 = Guard.File<'./src/'>
type _fileError2 = Guard.File<'/home/'>

// === Guard.Dir Tests ===
testGuard<Guard.Dir<'./'>>('./')
testGuard<Guard.Dir<'/'>>('/')
testGuard<Guard.Dir<'src/'>>('src/')
testGuard<Guard.Dir<'/home/'>>('/home/')
testGuard<Guard.Dir<'src'>>('src')
testGuard<Guard.Dir<'/home'>>('/home')

type _dirError1 = Guard.Dir<'file.txt'>
type _dirError2 = Guard.Dir<'/file.txt'>

// === Guard.Rel Tests ===
testGuard<Guard.Rel<'file.txt'>>('file.txt')
testGuard<Guard.Rel<'./src/'>>('./src/')
testGuard<Guard.Rel<'../'>>('../')
testGuard<Guard.Rel<'src'>>('src')

type _relError1 = Guard.Rel<'/file.txt'>
type _relError2 = Guard.Rel<'/home/'>

// === Guard.Abs Tests ===
testGuard<Guard.Abs<'/file.txt'>>('/file.txt')
testGuard<Guard.Abs<'/home/'>>('/home/')
testGuard<Guard.Abs<'/'>>('/')
testGuard<Guard.Abs<'/home'>>('/home')

type _absError1 = Guard.Abs<'file.txt'>
type _absError2 = Guard.Abs<'./src/'>

// === Guard.Any Tests ===
testGuard<Guard.Any<'file.txt'>>('file.txt')
testGuard<Guard.Any<'/file.txt'>>('/file.txt')
testGuard<Guard.Any<'./src/'>>('./src/')
testGuard<Guard.Any<'/home/'>>('/home/')

type _anyError = Guard.Any<{ notAPath: true }>
