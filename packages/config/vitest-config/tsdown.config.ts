import { defineLibraryConfig } from "@sgx4u/tsdown-config";

/**
 * Build config for this preset.
 *
 * Workspace tooling is only loaded through `import`, so the format is ESM
 * and CommonJS is omitted. `platform` is `"node"` because the preset runs
 * in the repository toolchain.
 */
export default defineLibraryConfig({
    platform: "node",
    format: ["esm"],
});
