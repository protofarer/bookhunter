/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  env: {
    browser: true,
    // amd: true,
    node: true,
    jest: true,
  },

  // plugins in the eslint base config
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],

  // plugins via external package
  plugins: ['@typescript-eslint', 'import', 'prettier'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    // ecmaFeatures: {
    //   jsx: true,
    // },
  },

  ignorePatterns: [
    'archive',
    'build',
    'public/build',
    'public/fontawesome', // address Parsing error: parserOptions.project error
    'server.js', // address Parsing error: parserOptions.project error
    'node_modules',
    'coverage',
    'remix.config.js',
    '.cache',
    '.history',
    '.eslintrc.js',
    'vitest.config.ts',
    'vite.config.ts',
    'cypress',
    'test',
    'mocks',
    'cypress.config.ts',
  ],

  globals: {
    JSX: 'readonly',
    Cypress: 'readonly',
    React: 'readonly',
  },

  // eslint docs: Plugins use settings to specify information that should be shared across
  // all of its rules. You can add settings object to ESLint configuration file
  // and it will be supplied to every rule being executed. This may be useful if
  // you are adding custom rules and want them to have access to the same
  // information and be easily configurable.
  settings: {
    'import/extensions': ['.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },

    // to lint vitest (close API to jest) properly must set version explicitly
    jest: {
      version: 27,
    },
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    semi: 'warn',
    'react/react-in-jsx-scope': 'off',
  },
};
