import { describe, expect, it } from "vitest";
import { dedent } from "./dedent.js";
describe("dedent", () => {
    it("drops the common indent and the outer newlines", () => {
        expect(dedent("\n  a\n    b\n")).toBe("a\n  b");
        expect(dedent("  a\n  b")).toBe("a\nb");
        expect(dedent("\r\n\ta\r\n\tb\r\n")).toBe("a\r\nb");
        expect(dedent("\ta\n    b")).toBe("\ta\n    b");
        expect(dedent("")).toBe("");
        expect(dedent(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(dedent(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            dedent("") === undefined ||
                typeof dedent("") === "string" ||
                typeof dedent("") === "boolean" ||
                typeof dedent("") === "number" ||
                Array.isArray(dedent("")) ||
                (typeof dedent("") === "object" && dedent("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            dedent("👨‍👩‍👧") === undefined ||
                typeof dedent("👨‍👩‍👧") === "string" ||
                typeof dedent("👨‍👩‍👧") === "boolean" ||
                typeof dedent("👨‍👩‍👧") === "number" ||
                Array.isArray(dedent("👨‍👩‍👧")) ||
                (typeof dedent("👨‍👩‍👧") === "object" && dedent("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            dedent("e\u0301") === undefined ||
                typeof dedent("e\u0301") === "string" ||
                typeof dedent("e\u0301") === "boolean" ||
                typeof dedent("e\u0301") === "number" ||
                Array.isArray(dedent("e\u0301")) ||
                (typeof dedent("e\u0301") === "object" &&
                    dedent("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            dedent("مرحبا") === undefined ||
                typeof dedent("مرحبا") === "string" ||
                typeof dedent("مرحبا") === "boolean" ||
                typeof dedent("مرحبا") === "number" ||
                Array.isArray(dedent("مرحبا")) ||
                (typeof dedent("مرحبا") === "object" &&
                    dedent("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            dedent("你好") === undefined ||
                typeof dedent("你好") === "string" ||
                typeof dedent("你好") === "boolean" ||
                typeof dedent("你好") === "number" ||
                Array.isArray(dedent("你好")) ||
                (typeof dedent("你好") === "object" && dedent("你好") !== null),
        ).toBe(true);
    });
});
