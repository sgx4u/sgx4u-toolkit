import { describe, expect, it } from "vitest";
import { isPascalCase } from "./is-pascal-case.js";

describe("isPascalCase", () => {
    it("accepts pascal case and rejects a lower first letter", () => {
        expect(isPascalCase("FooBar")).toBe(true);
        expect(isPascalCase("XmlHttpRequest")).toBe(true);
        expect(isPascalCase("fooBar")).toBe(false);
        expect(isPascalCase("XMLHttpRequest")).toBe(false);
        expect(isPascalCase("Foo-Bar")).toBe(false);
        expect(isPascalCase("")).toBe(false);
        expect(isPascalCase(null)).toBe(false);
    });
});
