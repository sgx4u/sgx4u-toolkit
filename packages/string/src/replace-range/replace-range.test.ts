import { describe, expect, it } from "vitest";
import { replaceRange } from "./replace-range.js";
describe("replaceRange", () => {
    it("replaces a range", () => {
        expect(
            replaceRange({ value: "abcd", start: 1, end: 3, replacement: "X" }),
        ).toBe("aXd");
        expect(() =>
            replaceRange({ value: "abcd", start: 3, end: 1, replacement: "X" }),
        ).toThrow(RangeError);
    });
});
