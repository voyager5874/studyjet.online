/* eslint-disable no-use-before-define */
// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react-hooks/recommended',
//   ],
//   ignorePatterns: ['dist', '.eslintrc.cjs'],
//   parser: '@typescript-eslint/parser',
//   plugins: ['react-refresh'],
//   rules: {
//     'react-refresh/only-export-components': [
//       'warn',
//       { allowConstantExport: true },
//     ],
//   },
// }


module.exports = {
  extends: ['@it-incubator/eslint-config', 'plugin:storybook/recommended'],
  overrides: [
    {
      files: ['**/*.stories.tsx'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/consistent-type-imports': ['error', {
          prefer: 'type-imports'
        }],
        'no-duplicate-imports': 'off',
        'import/no-duplicates': 'error',
        'perfectionist/sort-objects': 'off',
        // 'perfectionist/sort-jsx-props': 'off'
      },
    },
    // {
    //   files: ['router-config.tsx'],
    //   rules: {
    //     "perfectionist/sort-objects": ["off"]
    //   },
    // }
  ],
}
