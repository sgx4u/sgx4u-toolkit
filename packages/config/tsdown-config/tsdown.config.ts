import { defineConfig } from "tsdown";

/**
 * Build config for this preset.
 *
 * This package cannot import its own `defineLibraryConfig`, so the options
 * are written out here. Workspace tooling is only loaded through `import`,
 * so the format is ESM and CommonJS is omitted. `platform` is `"node"`
 * because the preset runs in the repository toolchain.
 */
export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: "node",
    fixedExtension: false,
});
