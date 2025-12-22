#!/bin/bash
# Stop hook: Run type checks if TypeScript files were modified

# Check if any .ts files have unstaged changes
if git diff --name-only | grep -q '\.ts$'; then
  echo "TypeScript files modified - running type check..."
  pnpm turbo check:types
  exit $?
fi

# Check if any .ts files are staged
if git diff --cached --name-only | grep -q '\.ts$'; then
  echo "TypeScript files staged - running type check..."
  pnpm turbo check:types
  exit $?
fi

# No TypeScript changes, skip
exit 0
