import { describe, expect, it } from "vitest";
import { formatSprintf } from "./format-sprintf.js";
describe("formatSprintf", () => {
    it("formats the safe subset", () => {
        expect(formatSprintf({ template: "Hi %s", values: ["Ada"] })).toBe(
            "Hi Ada",
        );
        expect(
            formatSprintf({ template: "%d %f %%", values: [1.9, 1.5] }),
        ).toBe("1 1.5 %");
        expect(formatSprintf({ template: "%1$s %1$s", values: ["A"] })).toBe(
            "A A",
        );
        expect(formatSprintf({ template: "%j", values: [{ a: 1 }] })).toBe(
            '{"a":1}',
        );
        expect(() => formatSprintf({ template: "%q", values: [] })).toThrow(
            RangeError,
        );
        expect(() => formatSprintf({ template: "%s", values: [] })).toThrow(
            RangeError,
        );
    });
});
