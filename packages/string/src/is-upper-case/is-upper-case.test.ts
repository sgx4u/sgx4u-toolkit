import { describe, expect, it } from "vitest";
import { isUpperCase } from "./is-upper-case.js";

describe("isUpperCase", () => {
    it("requires a cased letter that is already upper", () => {
        expect(isUpperCase("ABC")).toBe(true);
        expect(isUpperCase("abc")).toBe(false);
        expect(isUpperCase("123")).toBe(false);
        expect(isUpperCase("")).toBe(false);
        expect(isUpperCase(1)).toBe(false);
    });
});
