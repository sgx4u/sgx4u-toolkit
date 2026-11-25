import { defineConfig, type ViteUserConfig } from "vitest/config";

/**
 * Returns a Vitest config for package tests run on Node.
 *
 * Call this from a package `vitest.config.ts`. Universal, edge, and Node
 * packages share this runner: the test process is Node, and
 * `@sgx4u/eslint-config` decides which imports `src` may use. Sets
 * `test.environment` to `"node"` and includes every file under `src` whose
 * name ends in `.test.ts`. A `test` object on `options` replaces those
 * fields one at a time, so `environment` stays `"node"` unless the caller
 * sets it. Other top-level fields are copied onto the result. `options` is
 * left unchanged.
 *
 * @param options - Fields to copy through. An empty object keeps the Node environment and the `src` test glob.
 * @defaultValue {}
 * @returns A new config object.
 * @throws {@link TypeError} When `options` is `null`, an array, a function, or a promise. Those values would skip the defaults if they were returned unchanged.
 * @example
 * definePackageVitestConfig({ test: { include: ["other.test.ts"] } })
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
        throw new TypeError(
            `options must be a Vitest config object. Received ${Object.prototype.toString.call(options)}. A function or a promise would skip the Node environment and the src/**/*.test.ts include.`,
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
