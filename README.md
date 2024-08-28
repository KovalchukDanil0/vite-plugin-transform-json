# Vite Plugin Transform JSON

Plugin will copy JSON file, to `outDir` directory, named as per input one, during Vite build and modifies data dynamically via callback function.

## Install

Install package from npm

> npm install --save-dev vite-plugin-transform-json

## Basic Usage

Create JSON file in `src/manifest.json`.  
Add plugin to Vite configuration and add properties as showed below.

```ts
// vite.config.{js,ts}
defineConfig({
  plugins: [
    // use plugin here
    viteCopyTransformJson({
      // define path of the JSON file
      srcPath: "src/manifest.json",

      // callback function, can be sync or async function
      async transformedProps() {
        const isMatchCondition = true;
        const backgroundPagePath = "assets/background.js";

        // return JSON-like object
        return {
          version: "new version",
          description: "new description",
          homepage_url: "new repo url",
          background: isMatchCondition
            ? { service_worker: backgroundPagePath }
            : { page: backgroundPagePath },
        };
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
```

That should generate new manifest file with specified settings in `dist` folder
