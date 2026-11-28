import { describe, expect, it } from "vitest";
import { isCUID } from "./is-cuid.js";
describe("isCUID", () => {
    it("checks the v1 shape", () => {
        expect(isCUID("cabcdefghijklmnopqrstuvwx")).toBe(true);
        expect(isCUID("abcdefghijklmnopqrstuvwx")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isCUID(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isCUID("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isCUID("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isCUID("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isCUID("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isCUID("你好")).toBe("boolean");
    });
});
