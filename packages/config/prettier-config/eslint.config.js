import { definePackageConfig } from "@sgx4u/eslint-config";

/**
 * Lint config for this preset.
 *
 * Preset source runs on Node, so the globals and import bans are the Node
 * set. `rootDir` is this file's directory, which becomes
 * `parserOptions.tsconfigRootDir`.
 */
export default definePackageConfig({
    runtime: "node",
    rootDir: import.meta.dirname,
});
