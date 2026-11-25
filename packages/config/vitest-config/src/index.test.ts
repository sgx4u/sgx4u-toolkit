import { describe, expect, it } from "vitest";
import { definePackageVitestConfig } from "./index.js";

describe("definePackageVitestConfig", () => {
    it("uses the Node environment and the source test glob", () => {
        const config = definePackageVitestConfig();
        expect(config.test?.environment).toBe("node");
        expect(config.test?.include).toEqual(["src/**/*.test.ts"]);
    });

    it("lets a caller test field replace one default", () => {
        const config = definePackageVitestConfig({
            test: {
                include: ["other.test.ts"],
            },
        });
        expect(config.test?.environment).toBe("node");
        expect(config.test?.include).toEqual(["other.test.ts"]);
    });

    it("copies top-level fields and can override the environment", () => {
        const config = definePackageVitestConfig({
            logLevel: "silent",
            test: {
                environment: "happy-dom",
            },
        });
        expect(config.logLevel).toBe("silent");
        expect(config.test?.environment).toBe("happy-dom");
        expect(config.test?.include).toEqual(["src/**/*.test.ts"]);
    });

    it("rejects a function or a promise", () => {
        const functionConfig: unknown = () => ({});
        expect(() =>
            definePackageVitestConfig(
                functionConfig as Parameters<
                    typeof definePackageVitestConfig
                >[0],
            ),
        ).toThrow(/config object/);

        const promiseConfig: unknown = Promise.resolve({});
        expect(() =>
            definePackageVitestConfig(
                promiseConfig as Parameters<
                    typeof definePackageVitestConfig
                >[0],
            ),
        ).toThrow(/config object/);
    });
});
