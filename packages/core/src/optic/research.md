## Composition

Optics compose, and the result type is the "weakest" (most general) of the composed optics:

| Composition       | Result      |
| ----------------- | ----------- |
| `Lens ∘ Lens`     | `Lens`      |
| `Lens ∘ Prism`    | `Optional`  |
| `Lens ∘ Optional` | `Optional`  |
| `Prism ∘ Prism`   | `Prism`     |
| `X ∘ Traversal`   | `Traversal` |
| `X ∘ Fold`        | `Fold`      |

```typescript
// Lens + Lens = Lens
const nameLens = Optic.compose(Optic.prop('user'), Optic.prop('name'))

// Lens + Optional = Optional
const firstItemName = Optic.compose(Optic.index(0), Optic.prop('name'))

// Anything + Traversal = Traversal
const allNames = Optic.compose(Optic.each, Optic.prop('name'))
```

## Summary Table

| Optic         | Focus | Fail? | Read | Write | Construct     |
| ------------- | ----- | ----- | ---- | ----- | ------------- |
| **Iso**       | 1     | No    | Yes  | Yes   | Yes (reverse) |
| **Lens**      | 1     | No    | Yes  | Yes   | No            |
| **Prism**     | 0-1   | Yes   | Yes  | Yes   | Yes           |
| **Optional**  | 0-1   | Yes   | Yes  | Yes   | No            |
| **Traversal** | 0-n   | -     | Yes  | Yes   | No            |
| **Fold**      | 0-n   | -     | Yes  | No    | No            |
| **Getter**    | 1     | No    | Yes  | No    | No            |
| **Setter**    | -     | -     | No   | Yes   | No            |

## Canonical Operations

Each optic type has a well-defined set of operations, consistent across implementations (Haskell lens, Scala Monocle, fp-ts/optic):

### Operations by Optic Type

| Optic         | get | getOption | getAll | set | modify | reverseGet |
| ------------- | --- | --------- | ------ | --- | ------ | ---------- |
| **Iso**       | ✓   | -         | -      | ✓   | ✓      | ✓          |
| **Lens**      | ✓   | -         | -      | ✓   | ✓      | -          |
| **Prism**     | -   | ✓         | -      | ✓   | ✓      | ✓          |
| **Optional**  | -   | ✓         | -      | ✓   | ✓      | -          |
| **Traversal** | -   | -         | ✓      | ✓   | ✓      | -          |
| **Fold**      | -   | -         | ✓      | -   | -      | -          |
| **Getter**    | ✓   | -         | -      | -   | -      | -          |
| **Setter**    | -   | -         | -      | ✓   | ✓      | -          |

### Abstract Operations

| Abstract       | Description                       | Haskell    | Scala          | fp-ts        |
| -------------- | --------------------------------- | ---------- | -------------- | ------------ |
| **get**        | Extract single value (infallible) | `view`     | `get()`        | `get()`      |
| **getOption**  | Extract single value (fallible)   | `preview`  | `getOption()`  | `getOptic()` |
| **getAll**     | Extract all focused values        | `toListOf` | `getAll()`     | `getAll()`   |
| **set**        | Replace focused value(s)          | `set`      | `replace()`    | `replace()`  |
| **modify**     | Transform focused value(s)        | `over`     | `modify()`     | `modify()`   |
| **reverseGet** | Construct outer from focused      | `review`   | `reverseGet()` | `encode()`   |

### Operation Hierarchy

More powerful optics support more operations:

- **Iso** = get + set + modify + reverseGet (complete bidirectional)
- **Lens** = get + set + modify (no construction)
- **Prism** = getOption + set + modify + reverseGet (fallible read, can construct)
- **Optional** = getOption + set + modify (fallible read, no construction)
- **Traversal** = getAll + set + modify (multiple focus)
- **Fold** = getAll (read-only, multiple focus)
- **Getter** = get (read-only, single focus)
- **Setter** = set + modify (write-only)

## References

- [fp-ts/optic](https://github.com/fp-ts/optic) - TypeScript optics
- [monocle-ts](https://github.com/gcanti/monocle-ts) - Functional optics for TypeScript
- [Haskell lens](https://hackage.haskell.org/package/lens) - The original
- [Scala Monocle](https://www.optics.dev/Monocle/) - Scala optics
- [Optics By Example](https://leanpub.com/optics-by-example/) - Comprehensive guide

## TODO

- [ ] Implement `set` and `modify` operations
- [ ] Add Prism for sum type discrimination
- [ ] Add Iso for bidirectional transforms
- [ ] Add Traversal for multi-element operations
- [ ] Add Fold for read-only aggregation
- [ ] Implement optic composition with type degradation
- [ ] Add dual API: `.get` (dependently typed) vs `.$get` (dynamic, returns Option)
