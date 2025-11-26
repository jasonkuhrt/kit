import { Data, Equal, Hash, Schema } from 'effect'

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 1: Data Module - Direct Constructors
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('═══════════════════════════════════════════════════════════════')
console.log('Part 1: Data Module - Direct Constructors')
console.log('═══════════════════════════════════════════════════════════════\n')

// Data.struct
const struct1 = Data.struct({ name: 'Alice', age: 30 })
const struct2 = Data.struct({ name: 'Alice', age: 30 })
console.log('Data.struct({ name: "Alice", age: 30 })')
console.log('  value:', struct1)
console.log('  Equal.equals(struct1, struct2):', Equal.equals(struct1, struct2))
console.log('  Has Equal.symbol:', Equal.symbol in struct1)
console.log('  Has Hash.symbol:', Hash.symbol in struct1)

// Data.tuple
const tuple1 = Data.tuple('hello', 42, true)
const tuple2 = Data.tuple('hello', 42, true)
console.log('\nData.tuple("hello", 42, true)')
console.log('  value:', tuple1)
console.log('  Equal.equals(tuple1, tuple2):', Equal.equals(tuple1, tuple2))
console.log('  Has Equal.symbol:', Equal.symbol in tuple1)
console.log('  Array.isArray:', Array.isArray(tuple1))

// Data.array
const arr1 = Data.array([1, 2, 3])
const arr2 = Data.array([1, 2, 3])
console.log('\nData.array([1, 2, 3])')
console.log('  value:', arr1)
console.log('  Equal.equals(arr1, arr2):', Equal.equals(arr1, arr2))
console.log('  Has Equal.symbol:', Equal.symbol in arr1)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 2: Schema WITHOUT Data wrapper (plain JS values)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('Part 2: Schema WITHOUT Data wrapper (plain JS values)')
console.log('═══════════════════════════════════════════════════════════════\n')

const PlainStructSchema = Schema.Struct({ name: Schema.String, age: Schema.Number })
const PlainTupleSchema = Schema.Tuple(Schema.String, Schema.Number)

const plainStruct1 = Schema.decodeUnknownSync(PlainStructSchema)({ name: 'Bob', age: 25 })
const plainStruct2 = Schema.decodeUnknownSync(PlainStructSchema)({ name: 'Bob', age: 25 })
console.log('Schema.Struct (no Data wrapper)')
console.log('  decoded:', plainStruct1)
console.log('  Equal.equals:', Equal.equals(plainStruct1, plainStruct2))
console.log('  Has Equal.symbol:', Equal.symbol in plainStruct1)

const plainTuple1 = Schema.decodeUnknownSync(PlainTupleSchema)(['world', 99])
const plainTuple2 = Schema.decodeUnknownSync(PlainTupleSchema)(['world', 99])
console.log('\nSchema.Tuple (no Data wrapper)')
console.log('  decoded:', plainTuple1)
console.log('  Equal.equals:', Equal.equals(plainTuple1, plainTuple2))
console.log('  Has Equal.symbol:', Equal.symbol in plainTuple1)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 3: Schema WITH Data wrapper (Data-wrapped values)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('Part 3: Schema WITH Data wrapper (Data-wrapped values)')
console.log('═══════════════════════════════════════════════════════════════\n')

const DataStructSchema = Schema.Data(Schema.Struct({ name: Schema.String, age: Schema.Number }))
const DataTupleSchema = Schema.Data(Schema.Tuple(Schema.String, Schema.Number))

const dataStruct1 = Schema.decodeUnknownSync(DataStructSchema)({ name: 'Carol', age: 35 })
const dataStruct2 = Schema.decodeUnknownSync(DataStructSchema)({ name: 'Carol', age: 35 })
console.log('Schema.Data(Schema.Struct(...))')
console.log('  decoded:', dataStruct1)
console.log('  Equal.equals:', Equal.equals(dataStruct1, dataStruct2))
console.log('  Has Equal.symbol:', Equal.symbol in dataStruct1)

const dataTuple1 = Schema.decodeUnknownSync(DataTupleSchema)(['foo', 123])
const dataTuple2 = Schema.decodeUnknownSync(DataTupleSchema)(['foo', 123])
console.log('\nSchema.Data(Schema.Tuple(...))')
console.log('  decoded:', dataTuple1)
console.log('  Equal.equals:', Equal.equals(dataTuple1, dataTuple2))
console.log('  Has Equal.symbol:', Equal.symbol in dataTuple1)
console.log('  Array.isArray:', Array.isArray(dataTuple1))

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 4: Runtime Distinguishability (THE KEY INSIGHT)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log('\n═══════════════════════════════════════════════════════════════')
console.log('Part 4: Runtime Distinguishability (THE KEY INSIGHT)')
console.log('═══════════════════════════════════════════════════════════════\n')

const dataTuple = Data.tuple('hello', 42)
const plainArray: [string, number] = ['hello', 42]

console.log('Comparing Data.tuple vs plain array:')
console.log('  Data.tuple:', dataTuple)
console.log('  Plain array:', plainArray)

console.log('\nBoth are arrays:')
console.log('  Array.isArray(dataTuple):', Array.isArray(dataTuple))
console.log('  Array.isArray(plainArray):', Array.isArray(plainArray))

console.log('\nBUT Equal.isEqual() distinguishes them:')
console.log('  Equal.isEqual(dataTuple):', Equal.isEqual(dataTuple))
console.log('  Equal.isEqual(plainArray):', Equal.isEqual(plainArray))

console.log('\n┌─────────────────────────────────────────────────────────────┐')
console.log('│ LENS IMPLICATION:                                           │')
console.log('│                                                             │')
console.log('│ if (Equal.isEqual(data) && Array.isArray(data)) {          │')
console.log("│   // It's a Data.tuple - bounded, return T directly        │")
console.log('│ } else if (Array.isArray(data)) {                          │')
console.log("│   // It's a plain array - unbounded, return Option<T>      │")
console.log('│ }                                                           │')
console.log('└─────────────────────────────────────────────────────────────┘')

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Part 5: TypeScript Types (hover over these)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Hover over these to see inferred types:
type PlainStructType = typeof PlainStructSchema.Type
//   ^?
type PlainTupleType = typeof PlainTupleSchema.Type
//   ^?
type DataStructType = typeof DataStructSchema.Type
//   ^?
type DataTupleType = typeof DataTupleSchema.Type
//   ^?
