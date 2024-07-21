module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parserOptions: {
    project: "./tsconfig.json",
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/strict',
    'prettier',
    'airbnb-typescript',
    'plugin:import/recommended',
  ],
  ignorePatterns: [
    'node_modules/',
    'dist',
    '.eslintrc.cjs',
    '*.test.ts',
    'vite.config.ts',
    'vite-env.d.ts',
    'svg.vite-env.d.ts'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react',
    'jsx-a11y',
    'react-hooks',
  ],
  "settings": {
    "react": {
      "pragma": "React",  // Pragma to use, default to "React"
      "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
      "version": "detect",
    },
  },
  rules: {
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ],
    'linebreak-style': [
      'off',
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-console': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-unused-vars': 1,
    'react/prop-types': 1,
    'no-underscore-dangle': 0,
    'react/jsx-props-no-spreading': 0,
    'react/function-component-definition': [
      2,
      {
        'namedComponents': 'arrow-function',
        'unnamedComponents': 'arrow-function'
      }
    ],
    'max-len': [
      'error', {
        'code': 150,
        'ignoreComments': true,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true
      }
    ],
    'object-curly-newline': [
      'error', {
        'ObjectExpression': { 'multiline': true, 'minProperties': 10, 'consistent': true },
        'ObjectPattern': { 'multiline': true, 'minProperties': 10, 'consistent': true },
        'ImportDeclaration': { 'multiline': true, 'minProperties': 10, 'consistent': true },
        'ExportDeclaration': { 'multiline': true, 'minProperties': 10, 'consistent': true }
      }
    ],
    'import/prefer-default-export': 'off',
    'default-param-last': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-named-as-default': 'off',
    'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 1 }],
    'import/no-unresolved': ['error', { ignore: ['\\.svg\\?react$'] }],
  },
}
