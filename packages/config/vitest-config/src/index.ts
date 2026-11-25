import { defineConfig, type ViteUserConfig } from "vitest/config";

/**
 * Node test environment. Test files sit beside the source they cover.
 * Fields on the caller's `test` object replace those defaults one at a time.
 * Other top-level fields are copied through.
 */
export function definePackageVitestConfig(
    options: ViteUserConfig = {},
): ViteUserConfig {
    if (
        options === null ||
        typeof options !== "object" ||
        Array.isArray(options) ||
        options instanceof Promise
    ) {
        throw new Error(
            "definePackageVitestConfig expects a Vitest config object. A function or a promise would skip the Node environment and the src/**/*.test.ts include.",
        );
    }

    const { test: callerTestOptions, ...optionsWithoutTest } = options;

    return defineConfig({
        ...optionsWithoutTest,
        test: {
            environment: "node",
            include: ["src/**/*.test.ts"],
            ...callerTestOptions,
        },
    });
}
