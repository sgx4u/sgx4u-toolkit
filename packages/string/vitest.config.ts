import { definePackageVitestConfig } from "@sgx4u/vitest-config";
import type { ViteUserConfig } from "vitest/config";

/**
 * Vitest config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Coverage uses the v8 provider. Lines must stay at or above 90
 * percent and branches at or above 84 percent.
 */
const vitestConfig: ViteUserConfig = definePackageVitestConfig({
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text", "json-summary"],
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
