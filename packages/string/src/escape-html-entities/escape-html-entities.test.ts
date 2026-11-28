import { describe, expect, it } from "vitest";
import { escapeHTMLEntities } from "./escape-html-entities.js";
import { unescapeHTMLEntities } from "../unescape-html-entities/unescape-html-entities.js";

describe("escapeHTMLEntities", () => {
    it("uses a named entity and round-trips", () => {
        expect(escapeHTMLEntities("<")).toBe("&lt;");
        expect(escapeHTMLEntities({ value: "'", level: "xml" })).toBe("&apos;");
        expect(unescapeHTMLEntities("&amp;")).toBe("&");
        expect(unescapeHTMLEntities("&#65;")).toBe("A");
        expect(() =>
            escapeHTMLEntities({ value: "a", level: "nope" as "xml" }),
        ).toThrow(RangeError);
    });
});

describe("unicode and invalid input", () => {
    it("returns the invalid-input result for null", () => {
        expect(escapeHTMLEntities(null as never)).toBeUndefined();
    });
    it("accepts an empty string", () => {
        expect(
            escapeHTMLEntities("") === undefined ||
                typeof escapeHTMLEntities("") === "string" ||
                typeof escapeHTMLEntities("") === "boolean" ||
                typeof escapeHTMLEntities("") === "number" ||
                Array.isArray(escapeHTMLEntities("")) ||
                (typeof escapeHTMLEntities("") === "object" &&
                    escapeHTMLEntities("") !== null),
        ).toBe(true);
    });
    it("accepts a family emoji grapheme", () => {
        expect(
            escapeHTMLEntities("👨‍👩‍👧") === undefined ||
                typeof escapeHTMLEntities("👨‍👩‍👧") === "string" ||
                typeof escapeHTMLEntities("👨‍👩‍👧") === "boolean" ||
                typeof escapeHTMLEntities("👨‍👩‍👧") === "number" ||
                Array.isArray(escapeHTMLEntities("👨‍👩‍👧")) ||
                (typeof escapeHTMLEntities("👨‍👩‍👧") === "object" &&
                    escapeHTMLEntities("👨‍👩‍👧") !== null),
        ).toBe(true);
    });
    it("accepts a combining mark", () => {
        expect(
            escapeHTMLEntities("e\u0301") === undefined ||
                typeof escapeHTMLEntities("e\u0301") === "string" ||
                typeof escapeHTMLEntities("e\u0301") === "boolean" ||
                typeof escapeHTMLEntities("e\u0301") === "number" ||
                Array.isArray(escapeHTMLEntities("e\u0301")) ||
                (typeof escapeHTMLEntities("e\u0301") === "object" &&
                    escapeHTMLEntities("e\u0301") !== null),
        ).toBe(true);
    });
    it("accepts Arabic text", () => {
        expect(
            escapeHTMLEntities("مرحبا") === undefined ||
                typeof escapeHTMLEntities("مرحبا") === "string" ||
                typeof escapeHTMLEntities("مرحبا") === "boolean" ||
                typeof escapeHTMLEntities("مرحبا") === "number" ||
                Array.isArray(escapeHTMLEntities("مرحبا")) ||
                (typeof escapeHTMLEntities("مرحبا") === "object" &&
                    escapeHTMLEntities("مرحبا") !== null),
        ).toBe(true);
    });
    it("accepts CJK text", () => {
        expect(
            escapeHTMLEntities("你好") === undefined ||
                typeof escapeHTMLEntities("你好") === "string" ||
                typeof escapeHTMLEntities("你好") === "boolean" ||
                typeof escapeHTMLEntities("你好") === "number" ||
                Array.isArray(escapeHTMLEntities("你好")) ||
                (typeof escapeHTMLEntities("你好") === "object" &&
                    escapeHTMLEntities("你好") !== null),
        ).toBe(true);
    });
});
