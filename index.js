import { promises as fs } from 'fs';
import path from 'node:path';
import * as url from 'url';

let https;
try {
  https = await import('node:https');
} catch (error) {
  console.error('https support is disabled!');
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function fileExists (file) {
  return fs.access(file, fs.constants.F_OK)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
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

function getLocalNwManifest () {
  return new Promise(async (resolve, reject) => {
    const nwManifest = path.join(__dirname, 'node_modules', 'nw', 'package.json');
    const nwManifestExists = await fileExists(nwManifest);

    if (nwManifestExists) {
      try {
        let data = await fs.readFile(nwManifest, 'binary');
        data = JSON.parse(data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('NW.js manifest file does not seem to exist'));
    }
  });
}

function getCorrectNodeVersion () {
  return new Promise(async (resolve, reject) => {
    try {
      const nwManifest = await getLocalNwManifest();
      const allNwVersions = await getVersions();

      const localNwVersion = nwManifest?.version;
      const match = allNwVersions.versions.find(function (version) {
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

function getManifest () {
  return new Promise(async (resolve, reject) => {
    const manifest = path.join(__dirname, 'package.json');
    const manifestExists = await fileExists(manifest);

    if (manifestExists) {
      try {
        let data = await fs.readFile(manifest, 'binary');
        data = JSON.parse(data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('Cannot locate package.json'));
    }
  });
}

function updateVoltaObjectInManifest () {
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

async function run () {
  try {
    const mutatedManifest = await updateVoltaObjectInManifest();
    const manifest = path.join(__dirname, 'package.json');
    await fs.writeFile(manifest, JSON.stringify(mutatedManifest, null, 2) + '\n');
  } catch (error) {
    console.error(error);
  }
}

run();
