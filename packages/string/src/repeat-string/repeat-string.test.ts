import { describe, expect, it } from "vitest";
import { repeatString } from "./repeat-string.js";
describe("repeatString", () => {
    it("repeats and rejects a bad count", () => {
        expect(repeatString({ value: "ab", count: 2 })).toBe("abab");
        expect(repeatString({ value: "ab", count: 0 })).toBe("");
        expect(() => repeatString({ value: "a", count: -1 })).toThrow(
            RangeError,
        );
        expect(() => repeatString({ value: "a", count: 1.5 })).toThrow(
            RangeError,
        );
        expect(
            repeatString({ value: 1 as unknown as string, count: 1 }),
        ).toBeUndefined();
    });
});
