/* eslint-disable import/no-extraneous-dependencies */

const baseRestrictedSyntax = require('eslint-config-tjw-base/no-restricted-syntax.json');

module.exports = {
  root: true,
  globals: {
    Promise: true
  },
  extends: [
    'eslint:recommended',
    'tjw-base',
    'tjw-import'
  ],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'import/no-namespace': 'off',
    'import/no-unresolved': 'off',
    'import/no-unused-modules': 'off',
    'no-restricted-syntax': [
      'error',
      ...baseRestrictedSyntax
    ]
  }
};
