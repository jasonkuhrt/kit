#!/bin/bash

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Only format markdown files
if [[ "$file_path" == *.md ]]; then
  cd "$CLAUDE_PROJECT_DIR"
  if ! output=$(pnpm dprint fmt "$file_path" 2>&1); then
    echo "Markdown formatting failed for $file_path: $output"
  fi
fi

exit 0
