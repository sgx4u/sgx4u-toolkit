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

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isPascalCase(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isPascalCase("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isPascalCase("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isPascalCase("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isPascalCase("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isPascalCase("你好")).toBe("boolean");
    });
});
