import { defineConfig } from "tsdown";

// The ESM entry stays index.js so Prettier can load this package before a build.
// This config only emits the CommonJS build and its declaration.
export default defineConfig({
    entry: ["index.js"],
    format: ["cjs"],
    dts: {
        compilerOptions: {
            allowJs: true,
        },
    },
    sourcemap: true,
    clean: true,
    // Config presets run on Node. Neutral is for universal and edge libraries.
    platform: "node",
    fixedExtension: false,
});
