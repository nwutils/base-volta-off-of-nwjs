import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { test, expect } from 'vitest';

test('cli behaviour for specific build', async function () {
    // NW.js binary is installed via nwjs/npm-installer in CI before running this test
    process.chdir('tests/fixtures/build-number');
    // Package is npm linked in CI before running this test
    child_process.execSync('base-volta-off-of-nwjs');

    const nodeManifestBuffer = await fs.promises.readFile(path.resolve('package.json'));
    const nodeManifest = JSON.parse(nodeManifestBuffer.toString());
    const nodeVersion = nodeManifest.volta.node;

    expect(nodeVersion).toBe('21.1.0');
});
