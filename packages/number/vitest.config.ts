import { definePackageVitestConfig } from "@sgx4u/vitest-config";
import type { ViteUserConfig } from "vitest/config";

/**
 * Vitest config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Coverage uses the v8 provider and fails below the package minimum.
 */
const vitestConfig: ViteUserConfig = definePackageVitestConfig({
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text", "text-summary"],
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
