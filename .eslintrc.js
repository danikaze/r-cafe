module.exports = {
  extends: 'airbnb',
  parserOptions: {
    sourceType: 'module',
    globalReturn: true,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
  },
  env: {
    browser: true,
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    strict: ['error', 'global'],
    'spaced-comment': ['error', 'always', {
      exceptions: ['/'],
    }],
    'max-len': ['error', {
      code: 120,
      ignoreTrailingComments: true,
      ignoreUrls: true,
    }],
    'no-unused-vars': ['error', {
      args: 'none',
    }],
    'no-param-reassign': 'off',
    'no-use-before-define': ['error', {
      functions: false,
    }],
    'no-plusplus': 'off',
    'no-restricted-syntax': [ // allows for-in & for-of
      'error',
      'LabeledStatement',
      'WithStatement',
    ],
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'ts': 'never',
      'jsx': 'never',
      'tsx': 'never',
    }],
  },
};
