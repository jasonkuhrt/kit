#!/bin/bash

input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Format files supported by dprint (ts, tsx, js, jsx, md, json)
case "$file_path" in
  *.ts|*.tsx|*.js|*.jsx|*.md|*.json)
    cd "$CLAUDE_PROJECT_DIR"
    if ! output=$(pnpm dprint fmt "$file_path" 2>&1); then
      echo "Formatting failed for $file_path: $output"
    fi
    ;;
esac

exit 0
