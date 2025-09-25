'use strict'
var __assign = (this && this.__assign) || function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i]
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) {
          t[p] = s[p]
        }
      }
    }
    return t
  }
  return __assign.apply(this, arguments)
}
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value)
    })
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value))
      } catch (e) {
        reject(e)
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
var __generator = (this && this.__generator) || function(thisArg, body) {
  var _ = {
      label: 0,
      sent: function() {
        if (t[0] & 1) throw t[1]
        return t[1]
      },
      trys: [],
      ops: [],
    },
    f,
    y,
    t,
    g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype)
  return g.next = verb(0),
    g['throw'] = verb(1),
    g['return'] = verb(2),
    typeof Symbol === 'function' && (g[Symbol.iterator] = function() {
      return this
    }),
    g
  function verb(n) {
    return function(v) {
      return step([n, v])
    }
  }
  function step(op) {
    if (f) throw new TypeError('Generator is already executing.')
    while (g && (g = 0, op[0] && (_ = 0)), _) {
      try {
        if (
          f = 1,
            y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next)
            && !(t = t.call(y, op[1])).done
        ) return t
        if (y = 0, t) op = [op[0] & 2, t.value]
        switch (op[0]) {
          case 0:
          case 1:
            t = op
            break
          case 4:
            _.label++
            return { value: op[1], done: false }
          case 5:
            _.label++
            y = op[1]
            op = [0]
            continue
          case 7:
            op = _.ops.pop()
            _.trys.pop()
            continue
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0
              continue
            }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
              _.label = op[1]
              break
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1]
              t = op
              break
            }
            if (t && _.label < t[2]) {
              _.label = t[2]
              _.ops.push(op)
              break
            }
            if (t[2]) _.ops.pop()
            _.trys.pop()
            continue
        }
        op = body.call(thisArg, _)
      } catch (e) {
        op = [6, e]
        y = 0
      } finally {
        f = t = 0
      }
    }
    if (op[0] & 5) throw op[1]
    return { value: op[0] ? op[1] : void 0, done: true }
  }
}
var __rest = (this && this.__rest) || function(s, e) {
  var t = {}
  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
      t[p] = s[p]
    }
  }
  if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) {
        t[p[i]] = s[p[i]]
      }
    }
  }
  return t
}
var __spreadArray = (this && this.__spreadArray) || function(to, from, pack) {
  if (pack || arguments.length === 2) {
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i)
        ar[i] = from[i]
      }
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from))
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.describe = describe
exports.on = on
var effect_1 = require('effect')
var vitest_1 = require('vitest')
// ============================================================================
// Default State
// ============================================================================
var defaultState = {
  fn: effect_1.Option.none(),
  config: {},
  outputMapper: effect_1.Option.none(),
  pendingDescribe: effect_1.Option.none(),
  accumulatedGroups: [],
  currentCases: [],
  layerOrFactory: effect_1.Option.none(),
  layerType: effect_1.Option.none(),
  typeState: { i: undefined, o: undefined, context: {}, fn: (function() {}) },
}
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Custom assertion that uses Effect's Equal.equals for equivalence checking.
 * Falls back to Vitest's toEqual for better error messages when values are not equal.
 */
var assertEffectEqual = function(actual, expected) {
  // First try Effect's Equal.equals for proper equivalence checking
  // This handles Effect data types that implement Equal trait
  var isEqual = effect_1.Equal.equals(actual, expected)
  if (!isEqual) {
    // Use toEqual for better diff output when assertion fails
    ;(0, vitest_1.expect)(actual).toEqual(expected)
  }
  // If Equal.equals returns true, assertion passes silently
}
// ============================================================================
// Functional Builder Implementation
// ============================================================================
function createBuilder(state) {
  var _this = this
  if (state === void 0) state = defaultState
  // Helper to flush current cases to accumulated groups
  var flushCases = function(s) {
    if (s.currentCases.length > 0) {
      var group = {
        describe: s.pendingDescribe,
        cases: s.currentCases,
      }
      return __assign(__assign({}, s), {
        accumulatedGroups: __spreadArray(__spreadArray([], s.accumulatedGroups, true), [group], false),
        currentCases: [],
        pendingDescribe: effect_1.Option.none(),
      })
    }
    return s
  }
  // Parse case arguments helper
  var parseCaseArgs = function(args) {
    // If single argument and it's an object with 'n' property, it's object form
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && 'n' in args[0]) {
      return args[0]
    }
    var fn = effect_1.Option.getOrUndefined(state.fn)
    if (!fn) {
      return args // Can't parse without function
    }
    // Otherwise it's direct parameters
    var hasName = typeof args[0] === 'string'
    var startIdx = hasName ? 1 : 0
    var name = hasName ? args[0] : undefined
    // For .on() mode, params are always passed as a tuple
    if (effect_1.Array.isArray(args[startIdx])) {
      var params = args[startIdx]
      var hasOutput = args.length > startIdx + 1
      var output = hasOutput ? args[startIdx + 1] : undefined
      // Build tuple case
      if (name && hasOutput) {
        return [name, params, output]
      } else if (name) {
        return [name, params]
      } else if (hasOutput) {
        return [params, output]
      } else {
        return [params]
      }
    } else {
      // Direct params (not in array) - collect based on function arity
      var fnArity = fn.length
      var params = args.slice(startIdx, startIdx + fnArity)
      var hasOutput = args.length > startIdx + fnArity
      var output = hasOutput ? args[startIdx + fnArity] : undefined
      // Build tuple case
      if (name && hasOutput) {
        return [name, params, output]
      } else if (name) {
        return [name, params]
      } else if (hasOutput) {
        return [params, output]
      } else {
        return [params]
      }
    }
  }
  // Terminal execution helper
  var executeTests = function(customTest, describeBlock, cases) {
    var testFn = state.config.concurrent ? vitest_1.test.concurrent : vitest_1.test
    var testMethod = state.config.only ? testFn.only : testFn
    var fn = effect_1.Option.getOrUndefined(state.fn)
    var outputMapper = effect_1.Option.getOrUndefined(state.outputMapper)
    var parseCase = function(caseData) {
      // Object form
      if (!effect_1.Array.isArray(caseData)) {
        var obj = caseData // CaseObject type is complex, use any for destructuring
        // Extract known properties and preserve the rest as context
        var n = obj.n,
          i = obj.i,
          o = obj.o,
          skip = obj.skip,
          skipIf = obj.skipIf,
          only = obj.only,
          todo = obj.todo,
          tags = obj.tags,
          context = __rest(obj, ['n', 'i', 'o', 'skip', 'skipIf', 'only', 'todo', 'tags'])
        return __assign({
          name: n,
          input: fn ? (i !== null && i !== void 0 ? i : []) : i,
          output: o,
          skip: skip,
          skipIf: skipIf,
          only: only,
          todo: todo,
          tags: tags,
        }, context)
      }
      // Tuple form
      var tuple = caseData
      var generateName = function(input, output) {
        var fnName = (fn === null || fn === void 0 ? void 0 : fn.name) || 'fn'
        var inputStr = effect_1.Array.isArray(input)
          ? input.map(function(p) {
            return JSON.stringify(p)
          }).join(', ')
          : JSON.stringify(input)
        return output !== undefined
          ? ''.concat(fnName, '(').concat(inputStr, ') \u2192 ').concat(JSON.stringify(output))
          : ''.concat(fnName, '(').concat(inputStr, ')')
      }
      var formatName = function(template, input, output) {
        if (!state.config.nameTemplate) {
          return template
        }
        return state.config.nameTemplate
          .replace('$i', JSON.stringify(input))
          .replace('$o', output !== undefined ? JSON.stringify(output) : 'snapshot')
      }
      // Determine structure
      if (typeof tuple[0] === 'string') {
        var name_1 = tuple[0]
        var input = tuple[1]
        var output = tuple[2]
        var context = tuple[3] // Context is 4th element when name is present
        return __assign(
          { name: formatName(name_1, input, output), input: input, output: output },
          context && typeof context === 'object' ? context : {},
        )
      } else {
        var input = tuple[0]
        var output = tuple[1]
        var context = tuple[2] // Context is 3rd element when name is absent
        return __assign(
          { name: generateName(input, output), input: input, output: output },
          context && typeof context === 'object' && !effect_1.Array.isArray(context) ? context : {},
        )
      }
    }
    var runTests = function() {
      var _loop_1 = function(caseData) {
        var _a = parseCase(caseData),
          name_2 = _a.name,
          input = _a.input,
          output = _a.output,
          skip = _a.skip,
          skipIf = _a.skipIf,
          only = _a.only,
          todo = _a.todo,
          tags = _a.tags,
          testContext = __rest(_a, ['name', 'input', 'output', 'skip', 'skipIf', 'only', 'todo', 'tags'])
        if (todo) {
          testMethod.todo(name_2)
          return 'continue'
        }
        testMethod(name_2, function(vitestContext) {
          return __awaiter(_this, void 0, void 0, function() {
            var result, transformedOutput, transformedOutput, result
            var _a, _b
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  // Handle skip conditions
                  if (skip || state.config.skip) {
                    vitestContext.skip(
                      typeof skip === 'string'
                        ? skip
                        : typeof state.config.skip === 'string'
                        ? state.config.skip
                        : undefined,
                    )
                    return [2 /*return*/]
                  }
                  if (
                    (skipIf === null || skipIf === void 0 ? void 0 : skipIf())
                    || ((_b = (_a = state.config).skipIf) === null || _b === void 0 ? void 0 : _b.call(_a))
                  ) {
                    vitestContext.skip('Skipped by condition')
                    return [2 /*return*/]
                  }
                  if (!fn) return [3, /*break*/ 4]
                  result = fn.apply(void 0, input)
                  if (!customTest) return [3, /*break*/ 2]
                  transformedOutput = outputMapper ? outputMapper(output, input) : output
                  return [4, /*yield*/ customTest(result, transformedOutput, testContext, vitestContext)]
                case 1:
                  _c.sent()
                  return [3, /*break*/ 3]
                case 2:
                  if (output !== undefined) {
                    transformedOutput = outputMapper ? outputMapper(output, input) : output
                    if (state.config.matcher) {
                      // Use configured matcher
                      ;(0, vitest_1.expect)(result)[state.config.matcher](transformedOutput)
                    } else {
                      // Default to Effect's Equal.equals with fallback to toEqual
                      assertEffectEqual(result, transformedOutput)
                    }
                  } else {
                    // Snapshot mode
                    ;(0, vitest_1.expect)(result).toMatchSnapshot(name_2)
                  }
                  _c.label = 3
                case 3:
                  return [3, /*break*/ 6]
                case 4:
                  if (!customTest) return [3, /*break*/ 6]
                  return [4, /*yield*/ customTest(input, output, testContext, vitestContext) // Auto-snapshot if result is returned
                  ]
                case 5:
                  result = _c.sent()
                  // Auto-snapshot if result is returned
                  if (result !== undefined) {
                    ;(0, vitest_1.expect)(result).toMatchSnapshot(name_2)
                  }
                  _c.label = 6
                case 6:
                  return [2 /*return*/]
              }
            })
          })
        })
      }
      for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
        var caseData = cases_1[_i]
        _loop_1(caseData)
      }
    }
    // Wrap in describe if description or describeBlock provided
    if (describeBlock) {
      ;(0, vitest_1.describe)(describeBlock, function() {
        if (state.config.description) {
          ;(0, vitest_1.describe)(state.config.description, runTests)
        } else {
          runTests()
        }
      })
    } else if (state.config.description) {
      ;(0, vitest_1.describe)(state.config.description, runTests)
    } else {
      runTests()
    }
  }
  // Return builder object with all methods
  return {
    // Type building methods
    i: function() {
      return createBuilder(
        __assign(__assign({}, state), { typeState: __assign(__assign({}, state.typeState), { i: undefined }) }),
      )
    },
    o: function(mapperOrNothing) {
      // Check if this is output mapper mode for .on()
      if (effect_1.Option.isSome(state.fn) && typeof mapperOrNothing === 'function') {
        return createBuilder(__assign(__assign({}, state), { outputMapper: effect_1.Option.some(mapperOrNothing) }))
      }
      // Otherwise it's type setting
      return createBuilder(
        __assign(__assign({}, state), { typeState: __assign(__assign({}, state.typeState), { o: undefined }) }),
      )
    },
    // Function mode
    on: function(fn) {
      return createBuilder(
        __assign(__assign({}, state), {
          fn: effect_1.Option.some(fn),
          typeState: __assign(__assign({}, state.typeState), { fn: fn }),
        }),
      )
    },
    // Cases methods - always non-terminal, returns builder for chaining
    cases: function() {
      var cases = []
      for (var _i = 0; _i < arguments.length; _i++) {
        cases[_i] = arguments[_i]
      }
      var newState = __assign(__assign({}, state), {
        currentCases: __spreadArray(__spreadArray([], state.currentCases, true), cases, true),
      })
      // Always return builder for chaining - execution happens in .test()
      // Cast to proper type for type inference
      return createBuilder(flushCases(newState))
    },
    casesIn: function(describeName) {
      return function() {
        var cases = []
        for (var _i = 0; _i < arguments.length; _i++) {
          cases[_i] = arguments[_i]
        }
        // First flush any pending cases with their describe
        var flushed = flushCases(state)
        // Then add the new describe with its cases
        var newState = __assign(__assign({}, flushed), {
          pendingDescribe: effect_1.Option.some(describeName),
          currentCases: cases,
        })
        return createBuilder(flushCases(newState))
      }
    },
    casesAsArgs: function() {
      var cases = []
      for (var _i = 0; _i < arguments.length; _i++) {
        cases[_i] = arguments[_i]
      }
      var wrappedCases = cases.map(function(args) {
        return [args]
      })
      var newState = __assign(__assign({}, state), {
        currentCases: __spreadArray(__spreadArray([], state.currentCases, true), wrappedCases, true),
      })
      // Always return builder for chaining
      return createBuilder(newState)
    },
    casesAsArg: function() {
      var cases = []
      for (var _i = 0; _i < arguments.length; _i++) {
        cases[_i] = arguments[_i]
      }
      var wrappedCases = cases.map(function(arg) {
        return [[arg]]
      })
      var newState = __assign(__assign({}, state), {
        currentCases: __spreadArray(__spreadArray([], state.currentCases, true), wrappedCases, true),
      })
      // Always return builder for chaining
      return createBuilder(newState)
    },
    case: function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      var caseData = parseCaseArgs(args)
      return createBuilder(
        __assign(__assign({}, state), {
          currentCases: __spreadArray(__spreadArray([], state.currentCases, true), [caseData], false),
        }),
      )
    },
    // Configuration methods
    name: function(template) {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { nameTemplate: template }) }),
      )
    },
    only: function() {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { only: true }) }),
      )
    },
    skip: function(reason) {
      return createBuilder(
        __assign(__assign({}, state), {
          config: __assign(__assign({}, state.config), { skip: reason !== null && reason !== void 0 ? reason : true }),
        }),
      )
    },
    skipIf: function(condition) {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { skipIf: condition }) }),
      )
    },
    concurrent: function() {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { concurrent: true }) }),
      )
    },
    tags: function(tags) {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { tags: tags }) }),
      )
    },
    onlyMatching: function(matcher) {
      return createBuilder(
        __assign(__assign({}, state), { config: __assign(__assign({}, state.config), { matcher: matcher }) }),
      )
    },
    describe: function(name) {
      // If we have pending describe and cases, flush them first
      if (effect_1.Option.isSome(state.pendingDescribe) || state.currentCases.length > 0) {
        var flushed = flushCases(state)
        return createBuilder(__assign(__assign({}, flushed), { pendingDescribe: effect_1.Option.some(name) }))
      }
      return createBuilder(__assign(__assign({}, state), { pendingDescribe: effect_1.Option.some(name) }))
    },
    // Layer methods
    layer: function(layer) {
      return createBuilder(
        __assign(__assign({}, state), {
          layerOrFactory: effect_1.Option.some(layer),
          layerType: effect_1.Option.some('static'),
        }),
      )
    },
    layerEach: function(factory) {
      return createBuilder(
        __assign(__assign({}, state), {
          layerOrFactory: effect_1.Option.some(factory),
          layerType: effect_1.Option.some('dynamic'),
        }),
      )
    },
    // Terminal methods
    test: function(fn) {
      // Flush any remaining cases
      var finalState = flushCases(state)
      // Execute all accumulated groups
      for (var _i = 0, _a = finalState.accumulatedGroups; _i < _a.length; _i++) {
        var group = _a[_i]
        executeTests(fn, effect_1.Option.getOrUndefined(group.describe), group.cases)
      }
    },
    testEffect: function(fn) {
      // Flush any remaining cases
      var finalState = flushCases(state)
      var layerOrFactory = effect_1.Option.getOrUndefined(finalState.layerOrFactory)
      var layerType = effect_1.Option.getOrUndefined(finalState.layerType)
      // Execute with Effect wrapper
      for (var _i = 0, _a = finalState.accumulatedGroups; _i < _a.length; _i++) {
        var group = _a[_i]
        executeTests(
          function(i, o, ctx, context) {
            var effect = fn(i, o, ctx)
            var layer = layerType === 'static'
              ? layerOrFactory
              : layerOrFactory(__assign({ i: i, o: o }, ctx))
            var effectWithLayer = effect_1.Effect.provide(effect, layer)
            return effect_1.Effect.runPromise(effectWithLayer)
          },
          effect_1.Option.getOrUndefined(group.describe),
          group.cases,
        )
      }
    },
  }
}
function describe(description) {
  var initialState = description
    ? __assign(__assign({}, defaultState), { config: { description: description } })
    : defaultState
  return createBuilder(
    __assign(__assign({}, initialState), {
      typeState: { i: undefined, o: undefined, context: {}, fn: (function() {}) },
    }),
  )
}
/**
 * Create a test table without a top-level describe block
 * Useful for simple test cases that don't need grouping
 */
function on($fn) {
  var initialState = __assign(__assign({}, defaultState), { fn: effect_1.Option.some($fn) })
  return createBuilder(
    __assign(__assign({}, initialState), { typeState: { i: undefined, o: undefined, context: {}, fn: $fn } }),
  )
}
