module.exports = {
    extends: [
        'react-app',
        'react-app/jest'
    ],
    rules: {
        // Naming Convention Rules (relaxed for React)
        '@typescript-eslint/naming-convention': [
            'warn',
            {
                // Interfaces and Types (PascalCase)
                selector: 'interface',
                format: ['PascalCase']
            },
            {
                // Type Aliases (PascalCase)
                selector: 'typeAlias',
                format: ['PascalCase']
            },
            {
                // Enums (PascalCase)
                selector: 'enum',
                format: ['PascalCase']
            },
            {
                // Enum Members (UPPER_SNAKE_CASE)
                selector: 'enumMember',
                format: ['UPPER_CASE']
            },
            {
                // Variables (camelCase or UPPER_CASE for constants)
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                leadingUnderscore: 'allow'
            },
            {
                // Functions (camelCase or PascalCase for React components)
                selector: 'function',
                format: ['camelCase', 'PascalCase'],
                leadingUnderscore: 'allow'
            },
            {
                // Parameters (camelCase)
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'allow'
            },
            {
                // Class Methods (camelCase)
                selector: 'classMethod',
                format: ['camelCase']
            },
            {
                // Object Methods (camelCase)
                selector: 'objectLiteralMethod',
                format: ['camelCase']
            },
            {
                // Properties (allow various formats for API constants and React props)
                selector: 'property',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
                leadingUnderscore: 'allow'
            }
        ],

        // Import/Export Rules (relaxed)
        'import/order': [
            'warn',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ],

        // React Specific Rules
        'react/jsx-pascal-case': 'error',
        'react/jsx-no-bind': [
            'warn',
            {
                allowArrowFunctions: true,
                allowBind: false,
                ignoreRefs: true
            }
        ],

        // TypeScript Rules
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // General Code Quality Rules
        'no-console': 'warn',
        'no-debugger': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-template': 'warn'
    },
    overrides: [
        {
            // Test files can have more relaxed naming
            files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
            rules: {
                '@typescript-eslint/naming-convention': 'off',
                'import/order': 'off'
            }
        }
    ]
};
