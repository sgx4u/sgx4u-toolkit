import { definePackageConfig } from "@sgx4u/eslint-config";

export default definePackageConfig({
    runtime: "universal",
    rootDir: import.meta.dirname,
});
