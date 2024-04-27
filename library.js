import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import url from 'node:url';

import { parse as semverParse } from 'semver';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

let originalManifestIndentation = 2;
let originalManifestEOL = '\n';

async function fileExists (file) {
  let exists = true;
  try {
    await fs.promises.stat(file);
  } catch {
    exists = false;
  }
  return exists;
}

function getVersions () {
  return new Promise((resolve, reject) => {
    const request = https.get('https://nwjs.io/versions.json', (response) => {
      response.setEncoding('utf8');
      let responseBody = '';

      response.on('data', (chunk) => {
        responseBody += chunk;
      });

      response.on('end', () => {
        try {
          responseBody = JSON.parse(responseBody);
          resolve(responseBody);
        } catch (error) {
          reject(error);
        }
      });
    });

    request.on('error', (error) => {
      reject(error);
    });
  });
}

function getLocalNwManifestPath () {
  return new Promise(async (resolve, reject) => {
    const nwManifestRelativeToCwd = path.resolve(process.cwd(), 'node_modules', 'nw', 'package.json');
    const nwManifestRelativeToHere = path.resolve(__dirname, '..', 'nw', 'package.json');
    const cwdExists = await fileExists(nwManifestRelativeToCwd);
    const hereExists = await fileExists(nwManifestRelativeToHere);
    if (cwdExists) {
      resolve(nwManifestRelativeToCwd);
    } else if (hereExists) {
      resolve(nwManifestRelativeToHere);
    } else {
      reject(new Error('Could not locate nw node module manifest.'));
    }
  });
}

function getLocalNwManifest () {
  return new Promise(async (resolve, reject) => {
    try {
      const nwManifest = await getLocalNwManifestPath();
      let data = await fs.promises.readFile(nwManifest, { encoding: 'binary' });
      data = JSON.parse(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

function getLocalNWVersion () {
  return new Promise(async (resolve, reject) => {
    const nwManifest = await getLocalNwManifest();
    let localNwVersion = nwManifest?.version || '';

    const parsedVersion = semverParse(localNwVersion);
    if (parsedVersion) {
      resolve([
        parsedVersion.major,
        parsedVersion.minor,
        parsedVersion.patch
      ].join('.'));
    } else {
      reject(new Error('Unable to get local NW.js version'));
    }
  });
}

function getCorrectNodeVersion () {
  return new Promise(async (resolve, reject) => {
    try {
      const localNwVersion = await getLocalNWVersion();
      const allNwVersions = await getVersions();

      const match = allNwVersions.versions.find(function (version) {
        // 'v0.82.0' === 'v' + '0.82.0'
        return version.version === 'v' + localNwVersion;
      });
      if (!match) {
        throw 'No matching NW.js version found';
      }
      const nodeVersion = match?.components?.node;
      if (nodeVersion) {
        resolve(nodeVersion);
      } else {
        throw 'No Node version found';
      }
    } catch (error) {
      reject(error);
    }
  });
}

function determineOriginalManifestIndentation (data) {
  data = data.trim();
  data = data.replaceAll('\r\n', '\n');

  if (data[0] !== '{' || data[1] !== '\n') {
    return;
  }

  let first = data[2];
  let second = data[3];
  let third = data[4];
  let fourth = data[5];

  if (first === '\t') {
    originalManifestIndentation = '\t';
  } else if (first + second + third + fourth === '    ') {
    originalManifestIndentation = 4;
  } else {
    originalManifestIndentation = 2;
  }
}

function determinOriginalEOL (data) {
  if (data.includes('\r\n')) {
    originalManifestEOL = '\r\n';
  } else {
    originalManifestEOL = '\n';
  }
}

function getManifestPath () {
  return new Promise(async (resolve, reject) => {
    const manifestRelativeToCwd = path.resolve(process.cwd(), 'package.json');
    const manifestRelativeToHere = path.resolve(__dirname, '..', '..', 'package.json');
    const cwdExists = await fileExists(manifestRelativeToCwd);
    const hereExists = await fileExists(manifestRelativeToHere);
    if (cwdExists) {
      resolve(manifestRelativeToCwd);
    } else if (hereExists) {
      resolve(manifestRelativeToHere);
    } else {
      reject(new Error('Could not locate your manifest.'));
    }
  });
}

function getManifest () {
  return new Promise(async (resolve, reject) => {
    try {
      const manifest = await getManifestPath();
      let data = await fs.promises.readFile(manifest, { encoding: 'binary' });
      determineOriginalManifestIndentation(String(data));
      determinOriginalEOL(String(data));
      data = JSON.parse(data);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

function getManifestWithUpdatedVoltaObject () {
  return new Promise(async (resolve, reject) => {
    try {
      const manifest = await getManifest();
      const nodeVersion = await getCorrectNodeVersion();
      manifest.volta = manifest.volta || {};
      manifest.volta.node = nodeVersion;
      resolve(manifest);
    } catch (error) {
      reject(error);
    }
  });
}

function saveNewManifest () {
  return new Promise(async (resolve, reject) => {
    try {
      const manifestPath = await getManifestPath();
      mutatedManifest = JSON.stringify(mutatedManifest, null, originalManifestIndentation);
      mutatedManifest = mutatedManifest.replaceAll('\r\n', '\n').replaceAll('\n', originalManifestEOL);
      mutatedManifest = mutatedManifest + originalManifestEOL;
      await fs.promises.writeFile(manifestPath, mutatedManifest);
    } catch (error) {
      reject(error);
    }
  });
}

export async function run () {
  try {
    const mutatedManifest = await getManifestWithUpdatedVoltaObject();
    await saveNewManifest(mutatedManifest);
  } catch (error) {
    console.error(error);
  }
}
