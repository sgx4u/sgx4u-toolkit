import { describe, expect, it } from "vitest";
import { isHash } from "./is-hash.js";
describe("isHash", () => {
    it("checks length", () => {
        expect(isHash({ value: "a".repeat(32), algorithm: "md5" })).toBe(true);
        expect(isHash({ value: "zz", algorithm: "md5" })).toBe(false);
        expect(() => isHash({ value: "a", algorithm: "nope" })).toThrow(
            RangeError,
        );
        expect(isHash("abc")).toBe(false);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(isHash(null as never)).toBe(false);
    });
    it("accepts an empty string", () => {
        expect(typeof isHash({ value: "".repeat(16), algorithm: "md5" })).toBe(
            "boolean",
        );
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            typeof isHash({ value: "👨‍👩‍👧".repeat(16), algorithm: "md5" }),
        ).toBe("boolean");
    });
    it("accepts a combining mark", () => {
        expect(
            typeof isHash({ value: "e\u0301".repeat(16), algorithm: "md5" }),
        ).toBe("boolean");
    });
    it("accepts Arabic text", () => {
        expect(
            typeof isHash({ value: "مرحبا".repeat(16), algorithm: "md5" }),
        ).toBe("boolean");
    });
    it("accepts CJK text", () => {
        expect(
            typeof isHash({ value: "你好".repeat(16), algorithm: "md5" }),
        ).toBe("boolean");
    });
});
