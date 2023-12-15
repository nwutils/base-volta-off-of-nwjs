# base-volta-off-of-nwjs

Updates the Volta config in your `package.json` so your Node.js version will match the version of Node.js built in to NW.js.


## Usage

1. Uninstall any Node Version Managers you have, then install [Volta](https://volta.sh)
1. In your repo run `npm pkg set scripts.postinstall="npx base-volta-off-of-nwjs"`
1. Then run `npm install`
   * If it asks if you want to run `base-volta-off-of-nwjs` press `enter` to confirm, this should only happen once

This will add a command to your npm scripts that will automatically run after any time you do an `npm install`. It will update the Volta object in your `package.json` so the `node` value will match the version of Node in NW.js.


## Requirements

1. You must have `nw` listed in `dependencies` or `devDependencies`
1. `nw` must be installed in the `node_modules` folder
