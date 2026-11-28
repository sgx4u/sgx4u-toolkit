import { describe, expect, it } from "vitest";
import { ensurePrefix } from "./ensure-prefix.js";
describe("ensurePrefix", () => {
    it("applies the affix once", () => {
        const result = ensurePrefix({ value: "hello", prefix: "x" });
        expect(typeof result).toBe("string");
        expect(
            ensurePrefix({ value: 1 as unknown as string, prefix: "x" }),
        ).toBeUndefined();
    });
});
