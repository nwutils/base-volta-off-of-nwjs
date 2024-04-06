import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
import process from 'node:process';

import { test, expect } from 'vitest';

test('cli works', async function () {
    process.chdir('tests/fixtures/app');
    child_process.execSync('npm start');

    const NodeManifestPath = path.resolve('package.json');
    const NodeManifestBuffer = await fs.promises.readFile(NodeManifestPath);
    const NodeManifest = JSON.parse(NodeManifestBuffer.toString());
    const NodeVersion = NodeManifest.volta.node;

    expect(NodeVersion).toBe('21.1.0');
});
