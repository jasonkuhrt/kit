#!/bin/bash
#
# Script to convert expectTypeOf to Ts.Assert API across all test files
#

files=(
  "src/domains/group/$.test.ts"
  "src/domains/idx/$.test.ts"
  "src/domains/obj/get.test.ts"
  "src/domains/obj/filter.test-d.ts"
  "src/domains/str/match.test-d.ts"
  "src/utils/ts/print.test.ts"
  "src/utils/ts/relation.test.ts"
  "src/utils/config-manager/ConfigManager.test.ts"
  "src/utils/err/try.test.ts"
  "src/utils/fs/$.test.ts"
  "src/utils/fs-loc/$.test.ts"
  "src/utils/fs-loc/codec-string/$.test.ts"
  "src/utils/fs-loc/operations/to-abs.test.ts"
  "src/utils/fs-loc/operations/join.test.ts"
  "src/utils/fs-loc/operations/ensure-optional-absolute-with-cwd.test.ts"
  "src/utils/mask/mask.test-d.ts"
  "src/utils/sch/$.test-d.ts"
  "src/utils/test/table/\$\$.test-d.ts"
)

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "Skipping missing file: $file"
    continue
  fi

  echo "Processing $file..."

  # 1. Remove expectTypeOf from imports, add Ts import and alias
  # Pattern 1: import { ..., expectTypeOf, ... } from 'vitest'
  perl -i -pe 's/import \{ ([^}]*?)expectTypeOf,\s*([^}]*?)\} from .vitest./import { $1$2} from '\''vitest'\''/' "$file"
  perl -i -pe 's/import \{ ([^}]*?),\s*expectTypeOf([^}]*?)\} from .vitest./import { $1$2} from '\''vitest'\''/' "$file"
  perl -i -pe 's/import \{ expectTypeOf \} from .vitest.//' "$file"

  # Add Ts import if not present
  if ! grep -q "import { Ts } from '#ts'" "$file"; then
    # Find the last import line and add Ts import after it
    perl -i -pe 'if (/^import .*from/ && !$seen) { $_ .= "import { Ts } from '"'"'#ts'"'"'\n"; $seen = 1 }' "$file"
  fi

  # Add alias after imports if not present
  if ! grep -q "const A = Ts.Assert" "$file"; then
    perl -i -pe 'if (/^import .*from/ && !$alias_added) { $after_imports = 1 } elsif ($after_imports && !/^import/ && !$alias_added) { $_ = "\nconst A = Ts.Assert.exact.ofAs\n\n" . $_; $alias_added = 1 }' "$file"
  fi

  # 2. Convert expectTypeOf patterns
  # Pattern: expectTypeOf(value).toEqualTypeOf<Type>() -> A<Type>().on(value)
  perl -i -pe 's/expectTypeOf\(([^)]+)\)\.toEqualTypeOf<([^>]+)>\(\)/A<$2>().on($1)/g' "$file"

  # Pattern: expectTypeOf<Type>().toEqualTypeOf<Expected>() -> A<Expected>().onAs<Type>()
  perl -i -pe 's/expectTypeOf<([^>]+)>\(\)\.toEqualTypeOf<([^>]+)>\(\)/A<$2>().onAs<$1>()/g' "$file"

  # Pattern: expectTypeOf<Type>().toMatchTypeOf<SuperType>() -> needs Ts.Assert.sub
  perl -i -pe 's/expectTypeOf<([^>]+)>\(\)\.toMatchTypeOf<([^>]+)>\(\)/Ts.Assert.sub.ofAs<$2>().onAs<$1>()/g' "$file"

  # Pattern: expectTypeOf<Type>().not.toMatchTypeOf<SuperType>()
  perl -i -pe 's/expectTypeOf<([^>]+)>\(\)\.not\.toMatchTypeOf<([^>]+)>\(\)/Ts.Assert.not.sub.ofAs<$2>().onAs<$1>()/g' "$file"

  echo "✓ Processed $file"
done

echo ""
echo "Conversion complete!"
