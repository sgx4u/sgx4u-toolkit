import { defineLibraryConfig } from "@sgx4u/tsdown-config";

// This package is Node tooling. Neutral is the preset default for universal
// and edge libraries. Node built-ins stay external when the platform is node.
export default defineLibraryConfig({
    platform: "node",
    // Callers import this package. The library preset still emits CommonJS.
    format: ["esm"],
});
