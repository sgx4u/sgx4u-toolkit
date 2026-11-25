import { defineConfig } from "tsdown";

// This package cannot import its own preset, so it repeats those options.
// Workspace tooling is only loaded through `import`, so it skips CommonJS.
export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: "node",
    fixedExtension: false,
});
