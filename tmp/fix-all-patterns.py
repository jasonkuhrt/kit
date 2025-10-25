#!/usr/bin/env python3
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Pattern 1: expectTypeOf(value1).toEqualTypeOf(value2) - comparing two values
    content = re.sub(
        r'expectTypeOf\(([^)]+?)\)\.toEqualTypeOf\(([^)]+?)\)',
        r'Ts.Assert.exact.ofAs<typeof \2>().on(\1)',
        content
    )

    # Pattern 2: expectTypeOf(value).toMatchTypeOf<SuperType>() - subtype check with value
    content = re.sub(
        r'expectTypeOf\(([^)]+?)\)\.toMatchTypeOf<(.+?)>\(\)',
        r'Ts.Assert.sub.ofAs<\2>().on(\1)',
        content
    )

    # Pattern 3: expectTypeOf<Type>().toMatchTypeOf<SuperType>() - subtype check type-only
    content = re.sub(
        r'expectTypeOf<(.+?)>\(\)\.toMatchTypeOf<(.+?)>\(\)',
        r'Ts.Assert.sub.ofAs<\2>().onAs<\1>()',
        content
    )

    # Pattern 4: expectTypeOf<Type>().not.toMatchTypeOf<SuperType>() - negated subtype
    content = re.sub(
        r'expectTypeOf<(.+?)>\(\)\.not\.toMatchTypeOf<(.+?)>\(\)',
        r'Ts.Assert.not.sub.ofAs<\2>().onAs<\1>()',
        content
    )

    # Pattern 5: expectTypeOf(value).toEqualTypeOf<Type>() - value with type
    content = re.sub(
        r'expectTypeOf\(([^)]+?)\)\.toEqualTypeOf<(.+?)>\(\)',
        r'Ts.Assert.exact.ofAs<\2>().on(\1)',
        content
    )

    # Pattern 6: expectTypeOf<Type>().toEqualTypeOf<Expected>() - type-only
    content = re.sub(
        r'expectTypeOf<(.+?)>\(\)\.toEqualTypeOf<(.+?)>\(\)',
        r'Ts.Assert.exact.ofAs<\2>().onAs<\1>()',
        content
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
        try:
            if fix_file(filepath):
                changed += 1
        except Exception as e:
            print(f"Error processing {filepath}: {e}")

    print(f"\nFixed {changed} files")
