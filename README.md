# @andyrmitchell/trowser

Run a (simplified) Jest test file in the browser.

## Why?

I wanted a really light way to use Chrome's debugging tools to fix issues in the test.

You should probably use Node with Inspector for full support of Jest in Chrome, but find it slightly too clunky. 

## Install

`npm install --save-dev @andyrmitchell/trowser`

## Usage 

Use the `--file [path/to/file.test.ts]` option to specify the .ts file.

```bash 
npx trowser --file path/to/file.test.ts
```

This will run the trowser on the specific .ts file and perform its operation.

### Watch Option 

If you want trowser to automatically watch the specified .ts file and perform its operation whenever it's updated, you can use the `--watch` option.

```bash 
npx trowser --file path/to/file.ts --watch
```

## How it works

- It takes the test file as input
- It uses esbuild to combine the TypeScrip test file and globalTestFunctions.ts (the test framework stub) into a single bundle.js
- bundle.js and ./static/index.html are placed in the user's temporary directory
- index.html is opened in Chrome 

## Developing

### Making changes and publishing 

```bash 
npm run build_release
```

#### Pre-requisites:
- Run `npm install`
- Have `np` installed globally 

### Quick decision log
- Use tsup to convert src files to js
- Used commonjs for max compabitibility 
- Use `np` rather than `npm publish` for a nice experience (install it globally)

### Extending the test framework

- At time of writing, it only supports `expects().toBe()`.
- You can add more in ./static/globalTestFunctions.ts

### Moving from commonjs to ESM in the cli script
- Change tsup.config.ts format to 'esm'
- Change package.json 'type' to 'module' 
    - You might need to change 'main' to 'module' too, I'm not sure. See https://github.com/frehner/modern-guide-to-packaging-js-library 

### Converting to Deno

You can probably use `deno-bin` and call it from cli.ts 

### Bundling the test script using ESM 

The main hurdle is that esm files must be served (they can't run as files). 
- Enable ESM_MODE in setupTest.ts
- In index.html, point it to http://localhost:8081/bundle.js instead
