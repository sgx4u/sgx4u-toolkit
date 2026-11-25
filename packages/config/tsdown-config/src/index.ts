import { defineConfig, type UserConfig } from "tsdown";

/**
 * Dual ESM and CJS library build. Dependencies stay external.
 * With `"type": "module"`, ESM is dist/*.js plus dist/*.d.ts, and CJS is
 * dist/*.cjs plus dist/*.d.cts. Export maps stay hand-written so
 * @sgx4u/source is stable.
 */
export function defineLibraryConfig(options: UserConfig = {}): UserConfig {
    return defineConfig({
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        sourcemap: true,
        clean: true,
        platform: "neutral",
        fixedExtension: false,
        ...options,
    });
}
