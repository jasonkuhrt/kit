#!/bin/bash
# Migrate all FsLoc references to Fs.Path

# Find all TypeScript files that import from FsLoc
files=$(grep -rl "from '#fs-loc'" src --include="*.ts")

for file in $files; do
  echo "Migrating: $file"

  # Replace import statements
  sed -i '' "s/import { FsLoc } from '#fs-loc'/import { Fs } from '#fs'/g" "$file"
  sed -i '' "s/from '#fs-loc'/from '#fs'/g" "$file"

  # Replace FsLoc. type and value references with Fs.Path.
  sed -i '' 's/FsLoc\./Fs.Path./g' "$file"

  # Fix common patterns that don't work with simple replacement
  # FsLoc.AbsDir -> typeof Fs.Path.AbsDir.Type (in type position)
  # This is harder to do with sed, so we'll handle it case by case if needed
done

echo "Migration complete!"
echo "Files migrated: $(echo "$files" | wc -l)"
