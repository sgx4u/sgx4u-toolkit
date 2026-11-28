import { describe, expect, it } from "vitest";
import { formatCount } from "./format-count.js";
describe("formatCount", () => {
    it("formats the number and the noun", () => {
        expect(formatCount({ value: "apple", count: 1, locale: "en" })).toBe(
            "1 apple",
        );
        expect(formatCount({ value: "apple", count: 2, locale: "en" })).toBe(
            "2 apples",
        );
    });
});
