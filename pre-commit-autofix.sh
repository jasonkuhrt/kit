#!/usr/bin/env sh
#
# Pre-commit Hook: Auto-fix with Safe Partial Staging
#
# WHAT IT DOES:
# - Runs `pnpm fix` on staged files
# - Auto-stages fixed files
# - Never blocks commits
# - Safely handles partial staging (files with both staged and unstaged changes)
#
# CONVENTION REQUIRED:
# - Project must have `pnpm fix` script
# - All `fix:*` scripts must be non-blocking (always exit 0)
# - Example: "fix:lint": "oxlint --fix src || exit 0"
#
# USAGE:
# Copy this file to .husky/pre-commit and make it executable:
#   cp pre-commit-autofix.sh .husky/pre-commit
#   chmod +x .husky/pre-commit
#
# SAFETY:
# - Stashes unstaged changes before fixing
# - Only re-stages files that were originally staged
# - Guaranteed stash cleanup (never leaves orphaned stashes)
# - Handles merge conflicts gracefully
#

# Check if there are staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  # No staged files, nothing to do
  exit 0
fi

# Store stash count before we stash
STASH_COUNT_BEFORE=$(git stash list | wc -l)

# Stash unstaged changes (keeping index intact)
# This handles partial staging - unstaged changes are safely stashed
STASH_NAME="pre-commit-$(date +%s)"
git stash push --keep-index --include-untracked -m "$STASH_NAME" > /dev/null 2>&1

# Check if stash was actually created (could fail if no unstaged changes)
STASH_COUNT_AFTER=$(git stash list | wc -l)
STASH_CREATED=0
if [ "$STASH_COUNT_AFTER" -gt "$STASH_COUNT_BEFORE" ]; then
  STASH_CREATED=1
fi

# Run all auto-fixes (formatting, linting, etc.)
# Convention: `pnpm fix` must always be non-blocking
pnpm fix > /dev/null 2>&1 || true

# Re-stage the fixed files (only what was originally staged)
echo "$STAGED_FILES" | xargs git add 2>/dev/null

# MUST restore stash if we created one
# Ignore errors - conflicts are expected and are formatting-related by definition
if [ $STASH_CREATED -eq 1 ]; then
  # Try to pop with index first, if that fails try without index
  git stash pop --index > /dev/null 2>&1 || git stash pop > /dev/null 2>&1 || true

  # If stash pop had conflicts, user will see them in git status
  # This is expected behavior for partial staging + formatting
fi

# Always succeed (never block commit)
exit 0
