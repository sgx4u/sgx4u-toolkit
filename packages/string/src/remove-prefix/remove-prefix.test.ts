import { describe, expect, it } from "vitest";
import { removePrefix } from "./remove-prefix.js";
describe("removePrefix", () => {
    it("applies the affix once", () => {
        const result = removePrefix({ value: "hello", prefix: "x" });
        expect(typeof result).toBe("string");
        expect(
            removePrefix({ value: 1 as unknown as string, prefix: "x" }),
        ).toBeUndefined();
    });
});
