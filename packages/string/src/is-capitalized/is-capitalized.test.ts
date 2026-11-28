import { describe, expect, it } from "vitest";
import { isCapitalized } from "./is-capitalized.js";

describe("isCapitalized", () => {
    it("looks at the first grapheme", () => {
        expect(isCapitalized("Hello")).toBe(true);
        expect(isCapitalized("hello")).toBe(false);
        expect(isCapitalized("")).toBe(false);
        expect(isCapitalized("1abc")).toBe(false);
        expect(isCapitalized("Éclair")).toBe(true);
        expect(isCapitalized(null)).toBe(false);
    });
});
