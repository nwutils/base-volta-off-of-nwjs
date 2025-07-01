import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwImport from 'eslint-config-tjw-import';
import tjwJest from 'eslint-config-tjw-jest';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';

export default [
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginJest.configs['flat/recommended'],
  tjwBase.configs.recommended,
  tjwImport,
  tjwJest.configs.recommended,
  {
    // project specific rules/settings
    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        vi: true
      }
    },
    rules: {
      // If this is not turned off, linting throws because it can't find 'jest' install
      'jest/no-deprecated-functions': 'off',
      'no-async-promise-executor': 'off'
    }
  }
];
