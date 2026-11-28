import { describe, expect, it } from "vitest";
import { removeSuffix } from "./remove-suffix.js";
describe("removeSuffix", () => {
    it("applies the affix once", () => {
        const result = removeSuffix({ value: "hello", suffix: "x" });
        expect(typeof result).toBe("string");
        expect(
            removeSuffix({ value: 1 as unknown as string, suffix: "x" }),
        ).toBeUndefined();
    });
});
