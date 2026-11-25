import { defineConfig, type ViteUserConfigExport } from "vitest/config";

/** Node test environment. Test files sit beside the source they cover. */
export function definePackageVitestConfig(
  options: ViteUserConfigExport = {},
): ViteUserConfigExport {
  if (typeof options === "function" || options instanceof Promise) {
    return options;
  }

  const { test: callerTestOptions, ...rest } = options;

  return defineConfig({
    ...rest,
    test: {
      environment: "node",
      include: ["src/**/*.test.ts"],
      ...callerTestOptions,
    },
  });
}
