import { definePackageVitestConfig } from "@sgx4u/vitest-config";
import type { ViteUserConfig } from "vitest/config";

/**
 * Vitest config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Coverage runs with the tests and fails below the package thresholds.
 */
const vitestConfig: ViteUserConfig = definePackageVitestConfig({
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text"],
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/**/*.types.ts"],
            thresholds: {
                lines: 95,
                branches: 90,
                functions: 95,
                statements: 95,
            },
        },
    },
});

export default vitestConfig;
