import { describe, expect, it } from "vitest";
import { isLowerCase } from "./is-lower-case.js";

describe("isLowerCase", () => {
    it("requires a cased letter that is already lower", () => {
        expect(isLowerCase("abc")).toBe(true);
        expect(isLowerCase("abc123")).toBe(true);
        expect(isLowerCase("ABC")).toBe(false);
        expect(isLowerCase("123")).toBe(false);
        expect(isLowerCase("")).toBe(false);
        expect(isLowerCase(null)).toBe(false);
    });
});
