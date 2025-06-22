/**
 * Contravariance Example: Input Positions
 *
 * Contravariance allows less specific types to be used where more specific types are expected.
 * This occurs in input positions (function parameters).
 */

// Using the same hierarchy
class Animal {
  name: string = 'Generic Animal'
}

class Dog extends Animal {
  breed: string = 'Unknown'
}

class GoldenRetriever extends Dog {
  breed = 'Golden Retriever'
  friendly: boolean = true
}

// Function types with contravariant parameter positions
type HandleAnimal = (animal: Animal) => void
type HandleDog = (dog: Dog) => void
type HandleGoldenRetriever = (golden: GoldenRetriever) => void

// Implementations
const handleAnimal: HandleAnimal = (a) => {
  console.log(`Animal: ${a.name}`)
}

const handleDog: HandleDog = (d) => {
  console.log(`Dog: ${d.name}, Breed: ${d.breed}`)
}

const handleGoldenRetriever: HandleGoldenRetriever = (g) => {
  console.log(`Golden: ${g.name}, Friendly: ${g.friendly}`)
}

// ✅ Contravariance: Can assign less specific to more specific
const handleDog2: HandleDog = handleAnimal // OK! Animal handler can handle Dogs
const handleGolden2: HandleGoldenRetriever = handleAnimal // OK!
const handleGolden3: HandleGoldenRetriever = handleDog // OK!

// ❌ Cannot go the other way
// @ts-expect-error - Cannot assign more specific to less specific
const handleAnimal2: HandleAnimal = handleDog // Error! Dog handler expects breed property

// @ts-expect-error - Cannot assign more specific to less specific
const handleAnimal3: HandleAnimal = handleGoldenRetriever // Error!

// Practical example: Event handlers
type ClickHandler = (event: MouseEvent) => void
type GeneralHandler = (event: Event) => void

const generalHandler: GeneralHandler = (e) => {
  console.log(e.type) // All Events have type
}

const clickHandler: ClickHandler = generalHandler // ✅ Contravariance

// Real world: Array methods
const dogs: Dog[] = [new Dog(), new GoldenRetriever()]

// forEach expects (dog: Dog) => void
dogs.forEach(handleAnimal) // ✅ Works! handleAnimal can handle any Animal

// @ts-expect-error - Cannot use handler that expects GoldenRetriever
dogs.forEach(handleGoldenRetriever) // Error! Not all Dogs are GoldenRetrievers

// Contravariance with union types
type HandleStringOrNumber = (value: string | number) => void
type HandleString = (value: string) => void

const handleStringOrNumber: HandleStringOrNumber = (v) => {
  console.log(v) // Must handle both string and number
}

// @ts-expect-error - string ⊈ string | number for inputs
const handleString: HandleString = handleStringOrNumber // Error!

// But this works:
const handleUnion: HandleStringOrNumber = (v: string | number) => {
  if (typeof v === 'string') console.log(v.toUpperCase())
  else console.log(v.toFixed(2))
}

const handleJustString: HandleString = (s: string) => console.log(s.length)
const handleUnion2: HandleStringOrNumber = handleJustString // ✅ Contravariance
