import { definePackageVitestConfig } from "@sgx4u/vitest-config";
import type { ViteUserConfig } from "vitest/config";

/**
 * Vitest config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. The preset runs tests on Node and includes every test file under `src`.
 */
const vitestConfig: ViteUserConfig = definePackageVitestConfig({
    test: {
        coverage: {
            provider: "v8",
            include: ["src/**/*.ts"],
            exclude: ["src/**/*.test.ts", "src/**/*.types.ts"],
            thresholds: {
                lines: 90,
                branches: 84,
            },
        },
    },
});

export default vitestConfig;
