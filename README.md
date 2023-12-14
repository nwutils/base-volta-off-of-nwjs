# base-volta-off-of-nwjs

Updates the Volta config in your `package.json` so your Node.js version will match the version of Node.js built in to NW.js.


## Usage

1. `npm pkg set scripts.postinstall="npx base-volta-off-of-nwjs"`

This will add a command to your npm scripts that will automatically run after every time you do an `npm install`. It will update the Volta object in your `package.json` so the `node` value will match 


## Requirements

1. You must have `nw` listed in `dependencies` or `devDependencies`
1. `nw` must be installed in the `node_modules` folder
