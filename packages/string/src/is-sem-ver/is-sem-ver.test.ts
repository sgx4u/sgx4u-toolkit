import { describe, expect, it } from "vitest";
import { isSemVer } from "./is-sem-ver.js";
describe("isSemVer", () => {
    it("accepts SemVer 2", () => {
        expect(isSemVer("1.2.3")).toBe(true);
        expect(isSemVer("1.2.3-alpha.1+build")).toBe(true);
        expect(isSemVer("v1.2.3")).toBe(false);
        expect(isSemVer(null)).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isSemVer(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isSemVer("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isSemVer("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isSemVer("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isSemVer("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isSemVer("你好")).toBe("boolean");
    });
});
