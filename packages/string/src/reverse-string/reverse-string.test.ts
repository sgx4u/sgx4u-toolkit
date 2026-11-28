import { describe, expect, it } from "vitest";
import { reverseString } from "./reverse-string.js";
describe("reverseString", () => {
    it("reverses graphemes", () => {
        expect(reverseString("ab")).toBe("ba");
        expect(reverseString("a😀b")).toBe("b😀a");
        expect(reverseString("")).toBe("");
        expect(reverseString(null as unknown as string)).toBeUndefined();
    });
});
