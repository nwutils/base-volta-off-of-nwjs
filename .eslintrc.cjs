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
    'no-restricted-syntax': [
      'error',
      ...baseRestrictedSyntax
    ]
  }
};
