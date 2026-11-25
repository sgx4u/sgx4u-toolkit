import { defineConfig } from "tsdown";

// This package cannot import itself. Consumers use defineLibraryConfig instead.
export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: "neutral",
    fixedExtension: false,
});
