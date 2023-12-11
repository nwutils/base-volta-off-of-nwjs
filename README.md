# base-volta-off-of-nwjs

WIP: Tool to update the Volta config in package.json so Node match's your NW.js version

This script needs adapted to work as a library:

* https://github.com/nwutils/nw-selenium-javascript-example/blob/main/base-volta-off-of-nw.mjs


## API ideas

I'm wondering if it could be as easy as this?

```json
{
  "name": "my-app",
  "main": "index.html",
  "scripts": {
    "start": "nw .",
    "postinstall": "base-volta-off-of-nwjs"
  }
  "devDependencies": {
    "nw": "0.80.0-sdk",
    "base-volta-off-of-nwjs": "^1.0.0"
  }
}
```

Alternatively we could allow passing in the path to `node_modules` or the path to the `package.json`?

```json
"postinstall": "base-volta-off-of-nwjs ./node_modules ./package.json"
```
