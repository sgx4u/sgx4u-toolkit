import { describe, expect, it } from "vitest";
import { toUpperCase } from "./to-upper-case.js";

describe("toUpperCase", () => {
    it("converts case and honors Turkish", () => {
        expect(toUpperCase("Hello")).toBe("Hello".toLocaleUpperCase());
        expect(toUpperCase({ value: "i", locale: "tr-TR" })).toBe("İ");
        expect(toUpperCase("")).toBe("");
        expect(toUpperCase(null as unknown as string)).toBeUndefined();
        expect(() => toUpperCase({ value: "a", locale: "" })).toThrow(
            RangeError,
        );
    });
});
