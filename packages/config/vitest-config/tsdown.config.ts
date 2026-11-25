import { defineLibraryConfig } from "@sgx4u/tsdown-config";

// Workspace tooling is only loaded through `import`, so it skips CommonJS.
export default defineLibraryConfig({
    platform: "node",
    format: ["esm"],
});
