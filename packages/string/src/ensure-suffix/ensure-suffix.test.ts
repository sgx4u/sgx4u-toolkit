import { describe, expect, it } from "vitest";
import { ensureSuffix } from "./ensure-suffix.js";
describe("ensureSuffix", () => {
    it("applies the affix once", () => {
        const result = ensureSuffix({ value: "hello", suffix: "x" });
        expect(typeof result).toBe("string");
        expect(
            ensureSuffix({ value: 1 as unknown as string, suffix: "x" }),
        ).toBeUndefined();
    });
});
