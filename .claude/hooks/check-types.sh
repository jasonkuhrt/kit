#!/bin/bash
# Stop hook: Run type checks only if THIS SESSION modified TypeScript files

# Read hook input from stdin
INPUT=$(cat)

# Extract transcript path from JSON input
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

if [[ -z "$TRANSCRIPT_PATH" ]]; then
  # No transcript available, skip
  exit 0
fi

# Expand ~ to home directory
TRANSCRIPT_PATH="${TRANSCRIPT_PATH/#\~/$HOME}"

if [[ ! -f "$TRANSCRIPT_PATH" ]]; then
  # Transcript file doesn't exist, skip
  exit 0
fi

# Check if this session wrote/edited any .ts files
# Look for Write and Edit tool calls with .ts file paths
TS_MODIFIED=$(grep -E '"tool":\s*"(Write|Edit)"' "$TRANSCRIPT_PATH" 2>/dev/null | \
  grep -oE '"file_path":\s*"[^"]+\.tsx?"' | \
  head -1)

if [[ -z "$TS_MODIFIED" ]]; then
  # No TypeScript files modified by this session, skip
  exit 0
fi

echo "This session modified TypeScript files - running type check..."
pnpm turbo check:types
exit $?
