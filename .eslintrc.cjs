/* eslint-disable import/no-extraneous-dependencies */

const baseRestrictedSyntax = require('eslint-config-tjw-base/no-restricted-syntax.json');
const jestRestrictedSyntax = require('eslint-config-tjw-jest/no-restricted-syntax.json');

module.exports = {
  root: true,
  globals: {
    Promise: true
  },
  extends: [
    'eslint:recommended',
    'tjw-base',
    'tjw-import',
    'tjw-jest'
  ],
  rules: {
    'capitalize-test-names': 'error',
    'newline-before-expect-assertion': 'error',
    'test-names-avoid-should': 'error',
    'jest/no-deprecated-functions': 'off',
    'no-async-promise-executor': 'off',
    'no-restricted-syntax': [
      'error',
      ...baseRestrictedSyntax,
      ...jestRestrictedSyntax
    ]
  }
};
