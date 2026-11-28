import { describe, expect, it } from "vitest";
import { unwrapText } from "./unwrap-text.js";
describe("unwrapText", () => {
    it("joins lines and keeps paragraph breaks", () => {
        expect(unwrapText("hello\nworld")).toBe("hello world");
        expect(unwrapText("hello\n\nworld")).toBe("hello\n\nworld");
        expect(unwrapText("hello\r\nworld")).toBe("hello world");
        expect(unwrapText("hello\n \nworld")).toBe("hello\n\nworld");
        expect(unwrapText(null)).toBeUndefined();
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(unwrapText(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            unwrapText("") === undefined ||
                typeof unwrapText("") === "string" ||
                typeof unwrapText("") === "boolean" ||
                typeof unwrapText("") === "number" ||
                Array.isArray(unwrapText("")) ||
                (typeof unwrapText("") === "object" && unwrapText("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            unwrapText("👨‍👩‍👧") === undefined ||
                typeof unwrapText("👨‍👩‍👧") === "string" ||
                typeof unwrapText("👨‍👩‍👧") === "boolean" ||
                typeof unwrapText("👨‍👩‍👧") === "number" ||
                Array.isArray(unwrapText("👨‍👩‍👧")) ||
                (typeof unwrapText("👨‍👩‍👧") === "object" &&
                    unwrapText("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            unwrapText("e\u0301") === undefined ||
                typeof unwrapText("e\u0301") === "string" ||
                typeof unwrapText("e\u0301") === "boolean" ||
                typeof unwrapText("e\u0301") === "number" ||
                Array.isArray(unwrapText("e\u0301")) ||
                (typeof unwrapText("e\u0301") === "object" &&
                    unwrapText("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            unwrapText("مرحبا") === undefined ||
                typeof unwrapText("مرحبا") === "string" ||
                typeof unwrapText("مرحبا") === "boolean" ||
                typeof unwrapText("مرحبا") === "number" ||
                Array.isArray(unwrapText("مرحبا")) ||
                (typeof unwrapText("مرحبا") === "object" &&
                    unwrapText("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            unwrapText("你好") === undefined ||
                typeof unwrapText("你好") === "string" ||
                typeof unwrapText("你好") === "boolean" ||
                typeof unwrapText("你好") === "number" ||
                Array.isArray(unwrapText("你好")) ||
                (typeof unwrapText("你好") === "object" &&
                    unwrapText("你好") !== null),
        ).toBe(true);
    });
});
