import { definePackageVitestConfig } from "@sgx4u/vitest-config";
import type { ViteUserConfig } from "vitest/config";

/**
 * Vitest config for this package.
 *
 * The binding is annotated so `isolatedDeclarations` can type the default
 * export. Coverage uses the v8 provider. Thresholds match the package bar:
 * 90% lines and 84% branches.
 */
const vitestConfig: ViteUserConfig = definePackageVitestConfig({
    test: {
        coverage: {
            provider: "v8",
            reporter: ["text", "json-summary"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/**/*.test.ts",
                "src/**/*.types.ts",
                "src/types/**",
                "src/index.ts",
                "src/json-patch.ts",
                "src/hash.ts",
            ],
            thresholds: {
                lines: 90,
                branches: 84,
                functions: 90,
                statements: 90,
            },
        },
    },
});

export default vitestConfig;
