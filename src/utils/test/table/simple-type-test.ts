// Simple test to verify type inference works

type TestType = { i: string; o: number }

// This should work - direct conditional type
function testDirect(
  fn: TestType extends { i: infer I; o: infer O } ? (i: I, o: O) => void
    : never,
): void {
  fn('hello', 42) // Should work
}

// Test it
testDirect((i, o) => {
  // TypeScript should infer i: string, o: number
  const _i: string = i
  const _o: number = o
})

// Now test with a class
class TestClass<T> {
  test(
    fn: T extends { i: infer I; o: infer O } ? (i: I, o: O) => void
      : never,
  ): void {
    // Implementation
  }
}

const instance = new TestClass<{ i: string; o: number }>()
instance.test((i, o) => {
  // TypeScript should infer i: string, o: number
  const _i: string = i
  const _o: number = o
})
