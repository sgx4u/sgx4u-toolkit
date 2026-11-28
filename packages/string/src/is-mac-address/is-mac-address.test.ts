import { describe, expect, it } from "vitest";
import { isMACAddress } from "./is-mac-address.js";
describe("isMACAddress", () => {
    it("accepts the common formats", () => {
        expect(isMACAddress("aa:bb:cc:dd:ee:ff")).toBe(true);
        expect(isMACAddress("aabb.ccdd.eeff")).toBe(true);
        expect(isMACAddress({ value: "aabbccddeeff", format: "bare" })).toBe(
            true,
        );
        expect(isMACAddress("nope")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isMACAddress(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isMACAddress("")).toBe("boolean");
    });
    it("accepts a family emoji grapheme", () => {
        expect(typeof isMACAddress("👨‍👩‍👧")).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(typeof isMACAddress("e\u0301")).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(typeof isMACAddress("مرحبا")).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(typeof isMACAddress("你好")).toBe("boolean");
    });
});
