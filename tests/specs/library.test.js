import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { describe, expect, test } from 'vitest';

import { run } from '../../library.js';

describe('Library', () => {
  describe('Run', () => {
    test('Handles versions with hyphenated build numbers', async () => {
      process.chdir('tests/fixtures/build-number');

      // Ensure NW.js has been installed in the fixture so the library can check its version
      child_process.execSync('npm i');

      // Run the library
      await run();

      const manifestLocation = path.resolve('package.json');
      const manifestBuffer = await fs.promises.readFile(manifestLocation);
      const manifest = JSON.parse(manifestBuffer);
      const nodeVersion = manifest.volta.node;

      expect(nodeVersion)
        .toEqual('21.1.0');

      // Reset the package.json file
      delete manifest.volta;
      fs.writeFileSync(manifestLocation, JSON.stringify(manifest, null, 2) + '\n');
    });
  });
});
