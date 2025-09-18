import { Effect, Schema } from 'effect'
import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'
import { type ManifestMutable, ManifestSchema, ManifestSchemaMutable, parseMoniker } from './$$.js'

describe('ManifestSchema', () => {
  test('validates a minimal package.json', () => {
    const minimal = {
      name: 'test-package',
      version: '1.0.0',
    }

    const result = Effect.runSync(Schema.decodeUnknown(ManifestSchema)(minimal))
    expect(result).toMatchObject(minimal)
  })

  test('validates a full package.json', () => {
    const full = {
      name: '@org/package',
      version: '2.0.0',
      description: 'A test package',
      main: 'index.js',
      type: 'module',
      scripts: {
        test: 'vitest',
        build: 'tsc',
      },
      dependencies: {
        effect: '^3.0.0',
      },
      devDependencies: {
        vitest: '^1.0.0',
      },
      peerDependencies: {
        react: '^18.0.0',
      },
      optionalDependencies: {
        'optional-lib': '^1.0.0',
      },
      bin: {
        'my-cli': './cli.js',
      },
      files: ['dist', 'README.md'],
      exports: {
        '.': './index.js',
        './sub': './sub/index.js',
      },
      imports: {
        '#internal': './src/internal.js',
      },
      engines: {
        node: '>=20',
        pnpm: '>=8',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/org/package.git',
      },
      keywords: ['test', 'package'],
      author: {
        name: 'Test Author',
        email: 'test@example.com',
      },
      license: 'MIT',
      bugs: {
        url: 'https://github.com/org/package/issues',
      },
      homepage: 'https://example.com',
      private: false,
      workspaces: ['packages/*'],
      packageManager: 'pnpm@8.0.0',
      madge: {
        detectiveOptions: {
          ts: {
            skipTypeImports: true,
          },
        },
      },
    }

    const result = Effect.runSync(Schema.decodeUnknown(ManifestSchema)(full))
    expect(result).toMatchObject(full)
  })

  test('rejects invalid type field', () => {
    const invalid = {
      name: 'test',
      version: '1.0.0',
      type: 'invalid',
    }

    expect(() => Effect.runSync(Schema.decodeUnknown(ManifestSchema)(invalid))).toThrow()
  })

  test('allows string bin field', () => {
    const manifest = {
      name: 'test',
      version: '1.0.0',
      bin: './cli.js',
    }

    const result = Effect.runSync(Schema.decodeUnknown(ManifestSchema)(manifest))
    expect(result.bin).toBe('./cli.js')
  })

  test('allows string repository field', () => {
    const manifest = {
      name: 'test',
      version: '1.0.0',
      repository: 'https://github.com/org/repo.git',
    }

    const result = Effect.runSync(Schema.decodeUnknown(ManifestSchema)(manifest))
    expect(result.repository).toBe('https://github.com/org/repo.git')
  })

  test('allows string author field', () => {
    const manifest = {
      name: 'test',
      version: '1.0.0',
      author: 'John Doe <john@example.com>',
    }

    const result = Effect.runSync(Schema.decodeUnknown(ManifestSchema)(manifest))
    expect(result.author).toBe('John Doe <john@example.com>')
  })

  test('supports mutable fields with mutable schema', () => {
    const manifest = S.decodeUnknownSync(ManifestSchemaMutable)({
      name: 'test',
      version: '1.0.0',
      scripts: {
        test: 'vitest',
      },
    }) as ManifestMutable

    // Should allow mutation
    manifest.scripts!['build'] = 'tsc'
    expect(manifest.scripts!['build']).toBe('tsc')

    // Arrays should be mutable too
    manifest.files = ['src']
    manifest.files.push('dist')
    expect(manifest.files).toEqual(['src', 'dist'])
  })
})

describe('parseMoniker', () => {
  test('parses scoped package name', () => {
    expect(parseMoniker('@org/package')).toEqual({
      org: '@org',
      name: 'package',
    })
  })

  test('parses unscoped package name', () => {
    expect(parseMoniker('package')).toEqual({
      name: 'package',
    })
  })

  test('handles package with slashes but no scope', () => {
    expect(parseMoniker('not-scoped/package')).toEqual({
      name: 'not-scoped/package',
    })
  })
})
