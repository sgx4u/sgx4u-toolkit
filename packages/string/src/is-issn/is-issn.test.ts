import { describe, expect, it } from "vitest";
import { isISSN } from "./is-issn.js";
describe("isISSN", () => {
    it("checks the checksum", () => {
        expect(isISSN("0378-5955")).toBe(true);
        expect(isISSN("0378-5954")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isISSN(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isISSN("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isISSN("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isISSN("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isISSN("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isISSN("你好")).toBe("boolean");
    });
});
