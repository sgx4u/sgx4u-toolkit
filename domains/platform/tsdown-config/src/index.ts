import { defineConfig, type UserConfig } from "tsdown";

/**
 * ESM-only library build. Dependencies stay external. Output is dist/*.js
 * plus declarations. Export maps stay hand-written so @sgx4u/source is stable.
 */
export function defineLibraryConfig(options: UserConfig = {}): UserConfig {
  return defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    platform: "neutral",
    fixedExtension: false,
    ...options,
  });
}
