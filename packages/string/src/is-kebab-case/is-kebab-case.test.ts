import { describe, expect, it } from "vitest";
import { isKebabCase } from "./is-kebab-case.js";

describe("isKebabCase", () => {
    it("accepts the kebab-case conversion", () => {
        expect(isKebabCase("xml-http-request")).toBe(true);
        expect(isKebabCase("foo")).toBe(true);
        expect(isKebabCase("fooBar")).toBe(false);
        expect(isKebabCase("")).toBe(false);
        expect(isKebabCase(null)).toBe(false);
    });
});
