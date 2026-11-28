import { describe, expect, it } from "vitest";
import { isAlphanumeric } from "./is-alphanumeric.js";

describe("isAlphanumeric", () => {
    it("allows letters and digits", () => {
        expect(isAlphanumeric("abc123")).toBe(true);
        expect(isAlphanumeric("")).toBe(false);
        expect(isAlphanumeric("ab c")).toBe(false);
        expect(isAlphanumeric({ value: "abc123", locale: "ascii" })).toBe(true);
        expect(isAlphanumeric({ value: "ä1", locale: "ascii" })).toBe(false);
        expect(isAlphanumeric({ value: "١٢٣", locale: "ar" })).toBe(true);
        expect(isAlphanumeric({ value: "abc123", locale: "en" })).toBe(true);
        expect(isAlphanumeric(null)).toBe(false);
    });
});
