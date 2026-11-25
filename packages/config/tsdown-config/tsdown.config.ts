import { defineConfig } from "tsdown";

// This package cannot import itself. Consumers use defineLibraryConfig instead.
// The options below match that preset, with platform node because this
// package is Node tooling. Neutral stays the default for universal and edge.
// Callers import this package. The library preset still emits CommonJS.
export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: "node",
    fixedExtension: false,
});
