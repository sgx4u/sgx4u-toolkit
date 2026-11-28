import { describe, expect, it } from "vitest";
import { isCamelCase } from "./is-camel-case.js";

describe("isCamelCase", () => {
    it("accepts camel case and rejects separators", () => {
        expect(isCamelCase("fooBar")).toBe(true);
        expect(isCamelCase("xmlHttpRequest")).toBe(true);
        expect(isCamelCase("userId")).toBe(true);
        expect(isCamelCase("FooBar")).toBe(false);
        expect(isCamelCase("userID")).toBe(false);
        expect(isCamelCase("foo_bar")).toBe(false);
        expect(isCamelCase("123")).toBe(false);
        expect(isCamelCase("")).toBe(false);
        expect(isCamelCase(null)).toBe(false);
        expect(isCamelCase(new String("fooBar"))).toBe(false);
    });
});
