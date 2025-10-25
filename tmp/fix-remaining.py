#!/usr/bin/env python3
import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Pattern 1: expectTypeOf(value).toEqualTypeOf<Type>()
    # Use non-greedy match for the value part
    content = re.sub(
        r'expectTypeOf\(([^)]+?)\)\.toEqualTypeOf<(.+?)>\(\)',
        r'Ts.Assert.exact.ofAs<\2>().on(\1)',
        content
    )

    # Pattern 2: expectTypeOf<Type>().toEqualTypeOf<Expected>()
    # Need to handle nested angle brackets properly
    def replace_type_only(match):
        actual = match.group(1)
        expected = match.group(2)
        return f'Ts.Assert.exact.ofAs<{expected}>().onAs<{actual}>()'

    # Use a more sophisticated regex that handles nested brackets
    content = re.sub(
        r'expectTypeOf<(.+?)>\(\)\.toEqualTypeOf<(.+?)>\(\)',
        replace_type_only,
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"✓ Fixed {filepath}")
        return True
    else:
        print(f"  No changes in {filepath}")
        return False

if __name__ == '__main__':
    files = [
        "src/utils/ts/print.test.ts",
        "src/utils/mask/mask.test-d.ts",
        "src/domains/str/match.test-d.ts",
        "src/utils/err/try.test.ts",
        "src/utils/sch/$.test-d.ts",
        "src/utils/ts/relation.test.ts",
        "src/utils/config-manager/ConfigManager.test.ts",
        "src/utils/fs/$.test.ts",
        "src/domains/group/$.test.ts",
        "src/domains/idx/$.test.ts",
        "src/domains/obj/filter.test-d.ts",
    ]

    changed = 0
    for filepath in files:
        if fix_file(filepath):
            changed += 1

    print(f"\nFixed {changed} files")
